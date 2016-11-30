import { Program, ShaderType } from '../shader/program';
import { RenderCall } from '../renderer2d/render-call';
import { FrameBuffer } from '../renderer2d/framebuffer';

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
'varying vec2 v_texcoords;\n' +
'const float ADDITIVE_BLENDING = 1.0;\n' +
'const float SCREEN_BLENDING   = 2.0;\n' +
'void main() {\n' +
'	vec4 dst = texture2D(u_scene_texture, v_texcoords); // Rendered scene (tmu:0)\n' +
'	vec4 src = texture2D(u_glow_texture,  v_texcoords); // Glow map       (tmu:1)\n' +
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
'	gl_FragColor.w = 1.0;\n' +
'}';

export class Bloom {
    public gl: WebGLRenderingContext;
    public combinationProgram: Program;
    public resolution: WebGLUniformLocation;
    public position: number;
    public textureCoordinates: number;
    public vertexBuffer: WebGLBuffer;
    public indexBuffer: WebGLBuffer;
    public texCoordBuffer: WebGLBuffer;

    constructor(gl: WebGLRenderingContext) {
        this.gl = gl;

        this.combinationProgram = new Program(this.gl);
        this.combinationProgram.loadShader(ShaderType.VERTEX, vertexShader);
        this.combinationProgram.loadShader(ShaderType.FRAGMENT, combineFragmentShader);
        this.combinationProgram.createProgram();

        this.init();
    }

    public init(): void {
        let gl = this.gl;

        this.resolution = gl.getUniformLocation(this.combinationProgram.program, 'u_resolution');
        this.position = gl.getAttribLocation(this.combinationProgram.program, 'a_position');
        this.textureCoordinates = gl.getAttribLocation(this.combinationProgram.program, 'a_texCoord');

        this.vertexBuffer = gl.createBuffer();
        this.indexBuffer = gl.createBuffer();
        this.texCoordBuffer = gl.createBuffer();
    }
}
