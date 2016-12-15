import { Program, ShaderType } from '../shader/program';
import { RenderCall } from './render-call';
import { FrameBuffer } from './framebuffer';
import { Gamesaw } from '../../gamesaw';
import { Surface3d } from '../../graphics/surface3d';

const vertexShader: string = 'attribute vec2 a_position;\n' +
'attribute vec2 a_texCoord;\n' +
'varying vec2 v_texCoord;\n' +
'uniform vec2 u_resolution;\n' +
'uniform int u_flip;\n' +
'void main() {\n' +
'	vec2 zeroToOne = a_position / u_resolution;\n' +
'	vec2 zeroToTwo = zeroToOne * 2.0;\n' +
'	vec2 clipSpace = zeroToTwo - 1.0;\n' +
'   if (u_flip == 1) {\n' +
'       gl_Position = vec4(clipSpace * vec2(1, 1), 0, 1);\n' +
'	} else {\n' +
'       gl_Position = vec4(clipSpace * vec2(1, -1), 0, 1);\n' +
'   }\n' +
'	v_texCoord = a_texCoord;\n' +
'}\n';

const fragmentShader: string = 'precision mediump float;\n' +
'uniform sampler2D u_image;\n' +
'varying vec2 v_texCoord;\n\n' +
'void main() {\n' +
'	vec4 baseTexture = texture2D(u_image, v_texCoord);\n' +
'	gl_FragColor = baseTexture;\n' +
'}\n';

export class Renderer2d {
    private static instance: Renderer2d = new Renderer2d();
    public gl: WebGLRenderingContext;
    public config: Gamesaw;
    public scaleFBO: FrameBuffer;
    public program: Program;
    public resolution: WebGLUniformLocation;
    public flip: WebGLUniformLocation;
    public position: number;
    public textureCoordinates: number;
    public vertexBuffer: WebGLBuffer;
    public indexBuffer: WebGLBuffer;
    public texCoordBuffer: WebGLBuffer;
    public width: number = 800;
    public height: number = 600;
    public flipY: number = 0;
    public renderModeSrc: number;
    public renderModeDst: number;

    public renderCalls: RenderCall[] = [];

    constructor() {
        if (Renderer2d.instance) {
            throw new Error('Error: Instantiation failed, Use Renderer2d.getInstance() instead of new.');
        }

        Renderer2d.instance = this;
    }

    public static getInstance(): Renderer2d {
        return Renderer2d.instance;
    }

    public init(): void {
        this.gl = Surface3d.getInstance().getContext();
        this.config = Gamesaw.getInstance();

        let gl = this.gl;

        this.renderModeSrc = this.gl.SRC_ALPHA;
        this.renderModeDst = this.gl.ONE_MINUS_SRC_ALPHA;

        if (this.config.doScale()) {
            this.scaleFBO = new FrameBuffer(this.config.getFboTextureSize(), this.config.getFboTextureSize());
        }

        this.program = new Program();
        this.program.loadShader(ShaderType.VERTEX, vertexShader);
        this.program.loadShader(ShaderType.FRAGMENT, fragmentShader);
        this.program.createProgram();

        this.resolution = gl.getUniformLocation(this.program.program, 'u_resolution');
        this.flip = gl.getUniformLocation(this.program.program, 'u_flip');
        this.position = gl.getAttribLocation(this.program.program, 'a_position');
        this.textureCoordinates = gl.getAttribLocation(this.program.program, 'a_texCoord');

        this.vertexBuffer = gl.createBuffer();
        this.indexBuffer = gl.createBuffer();
        this.texCoordBuffer = gl.createBuffer();
    }

    public setRenderMode(src: number, dst: number): void {
        this.renderModeSrc = src;
        this.renderModeDst = dst;
    }

    public setRenderModeSrc(src: number): void {
        this.renderModeSrc = src;
    }

    public setRenderModeDst(dst: number): void {
        this.renderModeDst = dst;
    }

    public addCall(renderCall: RenderCall) {
        let found = false;

        for (let i in this.renderCalls) {
            if (this.renderCalls[i].texture === renderCall.texture) {
                this.renderCalls[i].add(renderCall);
                found = true;
                break;
            }
        }

        if (!found) {
            this.renderCalls.push(new RenderCall());
            let i = this.renderCalls.length - 1;
            this.renderCalls[i].texture = renderCall.texture;
            this.renderCalls[i].add(renderCall);
        }
    }

    public clear(): void {
        this.renderCalls = [];
    }

    public execute(): void {
        if (this.config.doScale()) {
            this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this.scaleFBO.fbo);
            this.flipY = 1;
            this.flush();
            this.clear();
            this.flipY = 0;
            this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null);
            this.renderScale();
        } else {
            this.flush();
            this.clear();
        }
    }

    public flush(): void {
        let gl = this.gl;
        gl.useProgram(this.program.program);

        gl.blendFunc(this.renderModeSrc, this.renderModeDst);
        gl.cullFace(gl.FRONT_AND_BACK);
        gl.uniform2f(this.resolution, this.config.getResolutionWidth(), this.config.getResolutionHeight());

        gl.uniform1i(this.flip, this.flipY);

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

    public renderScale(): void {
        let gl = this.gl;
        let width: number = this.config.getResolutionWidth();
        let height: number = this.config.getResolutionHeight();

        let uvWidth = this.config.getRenderResolutionWidth() / this.config.getFboTextureSize();
        let uvHeight = this.config.getRenderResolutionHeight() / this.config.getFboTextureSize();

        let vertices = [0, 0, width, 0, 0, height, width, height];
        let uvs = [
            0, 0,
            uvWidth, 0,
            0, uvHeight,
            uvWidth, uvHeight
        ];
        let indices = [0, 1, 2, 1, 2, 3];
        let numIndices = 6;

        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
        gl.cullFace(gl.FRONT_AND_BACK);
        gl.uniform2f(this.resolution, this.config.getResolutionWidth(), this.config.getResolutionHeight());
        gl.uniform1i(this.flip, this.flipY);

        gl.bindTexture(gl.TEXTURE_2D, this.scaleFBO.texture);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
        gl.enableVertexAttribArray(this.position);
        gl.vertexAttribPointer(this.position, 2, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.texCoordBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(uvs), gl.STATIC_DRAW);
        gl.enableVertexAttribArray(this.textureCoordinates);
        gl.vertexAttribPointer(this.textureCoordinates, 2, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);

        gl.drawElements(gl.TRIANGLES, numIndices, gl.UNSIGNED_SHORT, 0);
    }
}
