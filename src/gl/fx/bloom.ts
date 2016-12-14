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

/* Combine fragment shader
 * ===========================================================
 * GLSL Fragment Shader
 *  This source code is released under the MIT License.
 *  Copyright (c) 2015 Guilherme R. Lampert.
 * ===========================================================
 */
const combineFragmentShader = 'precision mediump float;\n' +
'uniform float u_blend_mode;\n' +
'uniform sampler2D u_scene_texture;\n' +
'uniform sampler2D u_glow_texture;\n' +
'varying vec2 v_texCoord;\n' +
'const float ADDITIVE_BLENDING = 1.0;\n' +
'const float SCREEN_BLENDING   = 2.0;\n' +
'void main() {\n' +
'	vec4 dst = texture2D(u_scene_texture, v_texCoord); // Rendered scene (tmu:0)\n' +
'	vec4 src = texture2D(u_glow_texture,  v_texCoord); // Glow map       (tmu:1)\n' +
'	if (u_blend_mode == ADDITIVE_BLENDING) {\n' +
'		// Additive blending (strong result, high overexposure).\n' +
'		gl_FragColor = min(src + dst, 1.0);\n' +
'	} else if (u_blend_mode == SCREEN_BLENDING) {\n' +
'		// Screen blending (mild result, medium overexposure).\n' +
'		gl_FragColor = clamp((src + dst) - (src * dst), 0.0, 1.0);\n' +
'	} else {\n' +
'		// Show the glow map instead (DISPLAY_GLOWMAP).\n' +
'		gl_FragColor = src;\n' +
'	}\n' +
'}';

export class Bloom {
    public gl: WebGLRenderingContext;
    public glowFramebuffer: FrameBuffer;
    public combinationProgram: Program;
    public resolution: WebGLUniformLocation;
    public blendMode: WebGLUniformLocation;
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

        this.combinationProgram = new Program();
        this.combinationProgram.loadShader(ShaderType.VERTEX, vertexShader);
        this.combinationProgram.loadShader(ShaderType.FRAGMENT, combineFragmentShader);
        this.combinationProgram.createProgram();

        this.init();
    }

    public init(): void {
        let gl = this.gl;

        this.glowFramebuffer = new FrameBuffer(this.width, this.height);

        this.blendMode = gl.getUniformLocation(this.combinationProgram.program, 'u_blend_mode');
        this.resolution = gl.getUniformLocation(this.combinationProgram.program, 'u_resolution');
        this.position = gl.getAttribLocation(this.combinationProgram.program, 'a_position');
        this.textureCoordinates = gl.getAttribLocation(this.combinationProgram.program, 'a_texCoord');

        this.vertexBuffer = gl.createBuffer();
        this.indexBuffer = gl.createBuffer();
        this.texCoordBuffer = gl.createBuffer();
    }

    public execute(src: WebGLTexture, dst: WebGLTexture): WebGLTexture {
        let gl = this.gl;

        gl.bindFramebuffer(gl.FRAMEBUFFER, this.glowFramebuffer.fbo);

        this.render(dst, src);

        gl.bindFramebuffer(gl.FRAMEBUFFER, null);

        return this.glowFramebuffer.texture;
    }

    public render(src: WebGLTexture, dst: WebGLTexture): void {
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

        gl.useProgram(this.combinationProgram.program);

        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
        gl.uniform2f(this.resolution, 800, 600);
        gl.uniform1f(this.blendMode, 1.0);

        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, src);

        gl.activeTexture(gl.TEXTURE1);
        gl.bindTexture(gl.TEXTURE_2D, dst);

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
        gl.bindTexture(gl.TEXTURE_2D, dst);
        gl.activeTexture(gl.TEXTURE0);
    }
}
