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

/* Blur Fragment shader
 * ===========================================================
 * GLSL Fragment Shader
 *  This source code is released under the MIT License.
 *  Copyright (c) 2015 Guilherme R. Lampert.
 * ===========================================================
 */
const glowFragmentShader = 'precision mediump float;\n' +
'uniform vec2  u_texel_size;\n' +
'uniform float u_blur_amount;\n' +
'uniform float u_blur_scale;\n' +
'uniform float u_blur_strength;\n' +
'uniform bool u_horizontal;\n' +
'uniform sampler2D u_color_texture;\n' +
'varying vec2 v_texcoords;\n' +
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
'   if (horizontal) {\n' +
'	    for (float i = 0.0; i < BLUR_PASSES; i += 1.0) {\n' +
'		    float offset = i - half_blur;\n' +
'		    vec4 tex_color = texture2D(u_color_texture, v_texcoords +\n' +
'			    vec2(offset * u_texel_size.x * u_blur_scale, 0.0)) * gaussian(offset * strength, deviation);\n' +
'		    color += tex_color;\n' +
'	    }\n' +
'   } else {\n' +
'       for (float i = 0.0; i < BLUR_PASSES; i += 1.0) {\n' +
'            float offset = i - half_blur;\n' +
'            vec4 tex_color = texture2D(u_color_texture, v_texcoords +\n' +
'                vec2(0.0, offset * u_texel_size.y * u_blur_scale)) * gaussian(offset * strength, deviation);\n' +
'            color += tex_color;\n' +
'        }\n' +
'   }\n' +
'	gl_FragColor = clamp(color, 0.0, 1.0);\n' +
'	gl_FragColor.w = 1.0;\n' +
'}';

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

export class Blur {
    public gl: WebGLRenderingContext;
    public horizontalFBO: FrameBuffer;
    public verticalFBO: FrameBuffer;

    public blurProgram: Program;
    public combinationProgram: Program;
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

    constructor(gl: WebGLRenderingContext) {
        this.gl = gl;

        this.blurProgram = new Program(this.gl);
        this.blurProgram.loadShader(ShaderType.VERTEX, vertexShader);
        this.blurProgram.loadShader(ShaderType.FRAGMENT, glowFragmentShader);
        this.blurProgram.createProgram();

        this.combinationProgram = new Program(this.gl);
        this.combinationProgram.loadShader(ShaderType.VERTEX, vertexShader);
        this.combinationProgram.loadShader(ShaderType.FRAGMENT, combineFragmentShader);
        this.combinationProgram.createProgram();

        this.init();
    }

    public init(): void {
        let gl = this.gl;

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
}
