import { Program, ShaderType } from '../shader/program';
import { RenderCall } from '../renderer2d/render-call';
import { FrameBuffer } from '../renderer2d/framebuffer';
import { Surface3d } from '../../graphics/surface3d';

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

/* Blur Fragment shader
 * ===========================================================
 * GLSL Fragment Shader
 *  This source code is released under the MIT License.
 *  Copyright (c) 2015 Guilherme R. Lampert.
 * ===========================================================
 */
const blurFragmentShader = 'precision mediump float;\n' +
'uniform vec2  u_texel_size;\n' +
'uniform float u_blur_amount;\n' +
'uniform float u_blur_scale;\n' +
'uniform float u_blur_strength;\n' +
'uniform int u_horizontal;\n' +
'uniform sampler2D u_color_texture;\n' +
'varying vec2 v_texCoord;\n' +
'const float BLUR_PASSES = 20.0;\n' +
'float gaussian(float x, float deviation) {\n' +
'	return (1.0 / sqrt(6.28318530718 * deviation)) * exp(-((x * x) / (2.0 * deviation)));\n' +
'}\n' +
'void main() {\n' +
'	vec4  color = vec4(0.0);\n' +
'	float half_blur = u_blur_amount * 0.5;\n' +
'	float strength = 1.0 - u_blur_strength;\n' +
'	float deviation = half_blur * 0.35;\n' +
'	deviation *= deviation;\n' +
'   if (u_horizontal == 1) {\n' +
'	    for (float i = 0.0; i < BLUR_PASSES; i += 1.0) {\n' +
'		    float offset = i - half_blur;\n' +
'		    vec4 tex_color = texture2D(u_color_texture, v_texCoord +\n' +
'			    vec2(offset * u_texel_size.x * u_blur_scale, 0.0)) * gaussian(offset * strength, deviation);\n' +
'		    color += tex_color;\n' +
'	    }\n' +
'   } else {\n' +
'       for (float i = 0.0; i < BLUR_PASSES; i += 1.0) {\n' +
'            float offset = i - half_blur;\n' +
'            vec4 tex_color = texture2D(u_color_texture, v_texCoord +\n' +
'                vec2(0.0, offset * u_texel_size.y * u_blur_scale)) * gaussian(offset * strength, deviation);\n' +
'            color += tex_color;\n' +
'        }\n' +
'   }\n' +
'	gl_FragColor = clamp(color, 0.0, 1.0);\n' +
'}';

export class Blur {
    public gl: WebGLRenderingContext;
    public horizontalFBO: FrameBuffer;
    public verticalFBO: FrameBuffer;
    public texture: WebGLTexture;

    public blurProgram: Program;
    public resolution: WebGLUniformLocation;
    public texelSize: WebGLUniformLocation;
    public blurAmount: WebGLUniformLocation;
    public blurScale: WebGLUniformLocation;
    public blurStrength: WebGLUniformLocation;
    public horizontal: WebGLUniformLocation;
    public position: number;
    public textureCoordinates: number;
    public vertexBuffer: WebGLBuffer;
    public indexBuffer: WebGLBuffer;
    public texCoordBuffer: WebGLBuffer;

    public width: number;
    public height: number;

    constructor(width: number, height: number) {
        this.gl = Surface3d.getInstance().getContext();
        this.width = width;
        this.height = height;

        this.blurProgram = new Program();
        this.blurProgram.loadShader(ShaderType.VERTEX, vertexShader);
        this.blurProgram.loadShader(ShaderType.FRAGMENT, blurFragmentShader);
        this.blurProgram.createProgram();

        this.init();
    }

    public init(): void {
        let gl = this.gl;

        this.horizontalFBO = new FrameBuffer(this.width, this.height);
        this.verticalFBO = new FrameBuffer(this.width, this.height);

        this.texelSize = gl.getUniformLocation(this.blurProgram.program, 'u_texel_size');
        this.blurAmount = gl.getUniformLocation(this.blurProgram.program, 'u_blur_amount');
        this.blurScale = gl.getUniformLocation(this.blurProgram.program, 'u_blur_scale');
        this.blurStrength = gl.getUniformLocation(this.blurProgram.program, 'u_blur_strength');
        this.horizontal = gl.getUniformLocation(this.blurProgram.program, 'u_horizontal');

        this.resolution = gl.getUniformLocation(this.blurProgram.program, 'u_resolution');
        this.position = gl.getAttribLocation(this.blurProgram.program, 'a_position');
        this.textureCoordinates = gl.getAttribLocation(this.blurProgram.program, 'a_texCoord');

        this.vertexBuffer = gl.createBuffer();
        this.indexBuffer = gl.createBuffer();
        this.texCoordBuffer = gl.createBuffer();
    }

    public execute(texture: WebGLTexture): WebGLTexture {
        let gl = this.gl;

        gl.bindFramebuffer(gl.FRAMEBUFFER, this.horizontalFBO.fbo);

        this.render(true, texture);

        gl.bindFramebuffer(gl.FRAMEBUFFER, this.verticalFBO.fbo);

        this.render(false, this.horizontalFBO.texture);

        gl.bindFramebuffer(gl.FRAMEBUFFER, null);

        return this.verticalFBO.texture;
    }

    public render(horizontal: boolean, texture: WebGLTexture): void {
        let gl = this.gl;

        let vertices = [0, 0, this.width, 0, 0, this.height, this.width, this.height];
        let uvs = [
            0, 0,
            1, 0,
            0, 1,
            1, 1
        ];
        let indices = [0, 1, 2, 1, 2, 3];
        let numIndices = 6;

        gl.useProgram(this.blurProgram.program);

        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
        gl.uniform2f(this.resolution, 800, 600);
        gl.uniform2fv(this.texelSize, [(1.0 / this.width), (1.0 / this.height)]);
        // gl.uniform2fv(this.texelSize, [1, 1]);
        gl.uniform1f(this.blurAmount, 35.0);
        gl.uniform1f(this.blurScale, 1.0);
        gl.uniform1f(this.blurStrength, 0.2);

        if (horizontal) {
            gl.uniform1i(this.horizontal, 1);
        } else {
            gl.uniform1i(this.horizontal, 0);
        }

        gl.bindTexture(gl.TEXTURE_2D, texture);
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
