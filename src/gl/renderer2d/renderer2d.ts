import { Program, ShaderType } from '../shader/program';
import { RenderCall } from './render-call';

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
'varying vec2 v_texCoord;\n\n' +
'void main() {\n' +
'	vec4 baseTexture = texture2D(u_image, v_texCoord);\n' +
'	gl_FragColor = baseTexture;\n' +
'}\n';

interface RenderCalls {
    [index: number]: RenderCall;
}

export class Renderer2d {
    public gl: WebGLRenderingContext;
    public program: Program;
    public resolution: WebGLUniformLocation;
    public position: number;
    public textureCoordinates: number;
    public vertexBuffer: WebGLBuffer;
    public indexBuffer: WebGLBuffer;
    public texCoordBuffer: WebGLBuffer;
    public width: number = 800;
    public height: number = 600;

    public renderCalls: RenderCalls = {};

    constructor(gl: WebGLRenderingContext) {
        this.gl = gl;

        this.program = new Program(this.gl);
        this.program.loadShader(ShaderType.VERTEX, vertexShader);
        this.program.loadShader(ShaderType.FRAGMENT, fragmentShader);
        this.program.createProgram();

        this.init();
    }

    public init(): void {
        let gl = this.gl;

        this.resolution = gl.getUniformLocation(this.program.program, 'u_resolution');
        this.position = gl.getAttribLocation(this.program.program, 'a_position');
        this.textureCoordinates = gl.getAttribLocation(this.program.program, 'a_texCoord');

        this.vertexBuffer = gl.createBuffer();
        this.indexBuffer = gl.createBuffer();
        this.texCoordBuffer = gl.createBuffer();
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
        gl.uniform2f(this.resolution, this.width, this.height);

        for (let call in this.renderCalls) {
            gl.bindTexture(gl.TEXTURE_2D, this.renderCalls[call].texture);
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
