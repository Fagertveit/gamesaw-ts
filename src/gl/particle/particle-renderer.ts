import { Program, ShaderType } from '../shader/program';
import { ParticleEmitter } from './particle-emitter';
import { ParticleSystem } from './particle-system';
import { Surface3d } from '../../graphics/surface3d';
import { Gamesaw } from '../../gamesaw';

const vertexShader: string = 'attribute vec2 a_position;\n' +
'attribute float a_pointSize;\n' +
'uniform vec2 u_resolution;\n' +
'void main() {\n' +
'	vec2 zeroToOne = a_position / u_resolution;\n' +
'	vec2 zeroToTwo = zeroToOne * 2.0;\n' +
'	vec2 clipSpace = zeroToTwo - 1.0;\n' +
'	gl_Position = vec4(clipSpace * vec2(1, -1), 0, 1);\n' +
'	gl_PointSize = a_pointSize;\n' +
'}\n';

const fragmentShader: string = 'precision mediump float;\n' +
'uniform sampler2D u_image;\n' +
'uniform vec4 u_color;\n' +
'void main() {\n' +
'	vec4 baseTexture = texture2D(u_image, gl_PointCoord);\n' +
'	vec4 baseColor = u_color;\n' +
'	float alpha = u_color.w;\n' +
'	gl_FragColor = baseTexture * u_color;\n' +
'}\n';

export class ParticleRenderer {
    public gl: WebGLRenderingContext;
    public config: Gamesaw;
    public program: Program;
    public resolution: WebGLUniformLocation;
    public colorLocation: WebGLUniformLocation;
    public pointSize: number;
    public position: number;
    public vertexBuffer: WebGLBuffer;
    public sizeBuffer: WebGLBuffer;

    constructor(gl: WebGLRenderingContext) {
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
        this.pointSize = gl.getAttribLocation(this.program.program, 'a_pointSize');
        this.position = gl.getAttribLocation(this.program.program, 'a_position');

        this.vertexBuffer = gl.createBuffer();
        this.sizeBuffer = gl.createBuffer();
    }

    public render(emitter: ParticleEmitter): void {
        let gl = this.gl;

        gl.useProgram(this.program.program);

        gl.enable(gl.BLEND);
        gl.blendFunc(emitter.blendSrc, emitter.blendDst);

        gl.uniform2f(this.resolution, this.config.getResolutionWidth(), this.config.getResolutionHeight());
        gl.bindTexture(gl.TEXTURE_2D, emitter.texture.texture);

        let col: number[] = emitter.color.getRGBAFloat();

        gl.uniform4f(this.colorLocation, col[0], col[1], col[2], col[3]);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(emitter.vertices), gl.STATIC_DRAW);
        gl.enableVertexAttribArray(this.position);
        gl.vertexAttribPointer(this.position, 2, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.sizeBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(emitter.sizes), gl.STATIC_DRAW);
        gl.enableVertexAttribArray(this.pointSize);
        gl.vertexAttribPointer(this.pointSize, 1, gl.FLOAT, false, 0, 0);

        gl.drawArrays(gl.POINTS, 0, emitter.vertices.length / 2);

        gl.disableVertexAttribArray(this.position);
        gl.disableVertexAttribArray(this.pointSize);
    }
}
