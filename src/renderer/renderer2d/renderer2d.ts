import { Program, ShaderType } from '../../shader/program';

const fragmentShader: string = '';
'attribute vec2 a_position;\n' +
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

const vertexShader: string = '' +
'precision mediump float;\n' +
'uniform sampler2D u_image;\n' +
'varying vec2 v_texCoord;\n\n' +
'void main() {\n' +
'	vec4 baseTexture = texture2D(u_image, v_texCoord);\n' +
'	vec4 baseColor = u_color;\n' +
'	gl_FragColor = baseTexture;\n' +
'	}\n' +
'}\n';

interface RenderCall {
    vertices: Float32Array;
    indices: Uint16Array;
    uvs: Float32Array;
    index: number;
    numIndices: number;
    texture: WebGLTexture;
    program: WebGLProgram;
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

    public renderCalls: RenderCall[] = [];

    constructor(gl: WebGLRenderingContext) {
        this.gl = gl;

        this.program = new Program(this.gl);
        this.program.loadShader(ShaderType.VERTEX, vertexShader);
        this.program.loadShader(ShaderType.FRAGMENT, fragmentShader);
        this.program.createProgram();
    }

    public init(): void {

    }

    public flush(): void {
        let gl = this.gl;

        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
        gl.uniform2f(this.resolution, this.width, this.height);

        for (let call of this.renderCalls) {
            gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, call.vertices, gl.STATIC_DRAW);
            gl.enableVertexAttribArray(this.position);
            gl.vertexAttribPointer(this.position, 2, gl.FLOAT, false, 0, 0);

            gl.bindBuffer(gl.ARRAY_BUFFER, this.texCoordBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, call.uvs, gl.STATIC_DRAW);
            gl.enableVertexAttribArray(this.textureCoordinates);
            gl.vertexAttribPointer(this.textureCoordinates, 2, gl.FLOAT, false, 0, 0);

            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
            gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, call.indices, gl.STATIC_DRAW);

            gl.drawElements(gl.TRIANGLES, call.numIndices, gl.UNSIGNED_SHORT, 0);
        }
    }
}
