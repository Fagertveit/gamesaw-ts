import { Program, ShaderType } from '../shader/program';
import { Color } from '../../graphics/color';
import { RenderCall } from '../renderer2d/render-call';
import { Surface3d } from '../../graphics/surface3d';
import { Gamesaw } from '../../gamesaw';

const vertexShader: string = 'attribute vec2 a_position;\n' +
'attribute vec2 a_texCoord;\n' +
'varying vec2 v_texCoord;\n' +
'uniform vec2 u_resolution;\n' +
'void main() {\n' +
'	vec2 zeroToOne = a_position / u_resolution;\n' +
'	vec2 zeroToTwo = zeroToOne * 2.0;\n' +
'	vec2 clipSpace = zeroToTwo - 1.0;\n' +
'	gl_Position = vec4(clipSpace * vec2(1, -1), 0, 1);\n' +
'	v_texCoord = a_texCoord;\n' +
'}\n';

const fragmentShader: string = 'precision mediump float;\n' +
'uniform sampler2D u_image;\n' +
'uniform vec4 u_color;\n' +
'varying vec2 v_texCoord;\n\n' +
'void main() {\n' +
'	vec4 baseTexture = texture2D(u_image, v_texCoord);\n' +
'	gl_FragColor = baseTexture * u_color * u_color.w;\n' +
'}\n';

interface RenderCalls {
    [index: number]: RenderCall;
}

export class FontRenderer {
    public gl: WebGLRenderingContext;
    public config: Gamesaw;
    public program: Program;
    public resolution: WebGLUniformLocation;
    public colorLocation: WebGLUniformLocation;
    public position: number;
    public textureCoordinates: number;
    public vertexBuffer: WebGLBuffer;
    public indexBuffer: WebGLBuffer;
    public texCoordBuffer: WebGLBuffer;
    public color: Color = new Color(255, 255, 255, 1);
    public width: number = 800;
    public height: number = 600;

    public renderCalls: RenderCalls = {};

    constructor() {
        this.gl = Surface3d.getInstance().getContext();
        this.config = Gamesaw.getInstance();

        this.program = new Program();
        this.program.loadShader(ShaderType.VERTEX, vertexShader);
        this.program.loadShader(ShaderType.FRAGMENT, fragmentShader);
        this.program.createProgram();

        this.init();
    }

    public init(): void {
        let gl = this.gl;

        this.resolution = gl.getUniformLocation(this.program.program, 'u_resolution');
        this.colorLocation = gl.getUniformLocation(this.program.program, 'u_color');
        this.position = gl.getAttribLocation(this.program.program, 'a_position');
        this.textureCoordinates = gl.getAttribLocation(this.program.program, 'a_texCoord');

        this.vertexBuffer = gl.createBuffer();
        this.indexBuffer = gl.createBuffer();
        this.texCoordBuffer = gl.createBuffer();
    }

    public setColor(color: Color) {
        this.color = color;
    }

    public addCall(renderCall: RenderCall) {
        if (!this.renderCalls[renderCall.texture as number]) {
            this.renderCalls[renderCall.texture as number] = new RenderCall();
            this.renderCalls[renderCall.texture as number].texture = renderCall.texture;
        }

        this.renderCalls[renderCall.texture as number].add(renderCall);
    }

    public clear(): void {
        this.renderCalls = {};
    }

    public execute(): void {
        this.flush();
        this.clear();
    }

    public flush(): void {
        let gl = this.gl;
        gl.useProgram(this.program.program);

        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
        gl.uniform2f(this.resolution, this.config.getResolutionWidth(), this.config.getResolutionHeight());

        for (let call in this.renderCalls) {
            gl.bindTexture(gl.TEXTURE_2D, this.renderCalls[call].texture);

            let col: number[] = this.color.getRGBAFloat();
            gl.uniform4f(this.colorLocation, col[0], col[1], col[2], col[3]);

            gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.renderCalls[call].vertices), gl.STATIC_DRAW);
            gl.enableVertexAttribArray(this.position);
            gl.vertexAttribPointer(this.position, 2, gl.FLOAT, false, 0, 0);

            gl.bindBuffer(gl.ARRAY_BUFFER, this.texCoordBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.renderCalls[call].uvs), gl.STATIC_DRAW);
            gl.enableVertexAttribArray(this.textureCoordinates);
            gl.vertexAttribPointer(this.textureCoordinates, 2, gl.FLOAT, false, 0, 0);

            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
            gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.renderCalls[call].indices), gl.STATIC_DRAW);

            gl.drawElements(gl.TRIANGLES, this.renderCalls[call].numIndices, gl.UNSIGNED_SHORT, 0);
        }
    }
}
