import { Program, ShaderType } from '../shader/program';
import { RenderCall } from './render-call';
import { FrameBuffer } from './framebuffer';
import { Gamesaw } from '../../gamesaw';
import { Surface3d } from '../../graphics/surface3d';
import { Circle, Vector2, Line, Point, Rectangle, AABB, Polygon } from '../../geometry/index';
import { degreeToRadian } from '../../utility/index';
import { Color } from '../../graphics/color';

const vertexShader: string = 'attribute vec2 a_position;\n' +
'uniform vec2 u_resolution;\n' +
'uniform vec4 u_color;\n' +
'uniform int u_flip;\n' +
'varying vec4 v_color;\n' +
'void main() {\n' +
'	vec2 zeroToOne = a_position / u_resolution;\n' +
'	vec2 zeroToTwo = zeroToOne * 2.0;\n' +
'	vec2 clipSpace = zeroToTwo - 1.0;\n' +
'   if (u_flip == 1) {\n' +
'       gl_Position = vec4(clipSpace * vec2(1, 1), 0, 1);\n' +
'	} else {\n' +
'       gl_Position = vec4(clipSpace * vec2(1, -1), 0, 1);\n' +
'   }\n' +
'   gl_PointSize = 3.0;\n' +
'   v_color = u_color;\n' +
'}\n';

const fragmentShader: string = 'precision mediump float;\n' +
'varying vec4 v_color;\n\n' +
'void main() {\n' +
'	gl_FragColor = v_color;\n' +
'}\n';

interface GeoRenderCall {
    vertices: number[];
    indices: number[];
    color: number[];
    numIndices: number;
}

export class GeoRenderer {
    private static instance: GeoRenderer = new GeoRenderer();
    public gl: WebGLRenderingContext;
    public config: Gamesaw;
    public scaleFBO: FrameBuffer;
    public program: Program;
    public resolution: WebGLUniformLocation;
    public flip: WebGLUniformLocation;
    public color: WebGLUniformLocation;
    public position: number;
    public vertexBuffer: WebGLBuffer;
    public indexBuffer: WebGLBuffer;
    public colorBuffer: WebGLBuffer;
    public width: number = 800;
    public height: number = 600;
    public flipY: number = 0;
    public renderModeSrc: number;
    public renderModeDst: number;
    public defaultColor: Color = new Color(255, 0, 0, 1);

    public renderCalls: GeoRenderCall[] = [];

    constructor() {
        if (GeoRenderer.instance) {
            throw new Error('Error: Instantiation failed, Use Renderer2d.getInstance() instead of new.');
        }

        GeoRenderer.instance = this;
    }

    public static getInstance(): GeoRenderer {
        return GeoRenderer.instance;
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
        this.color = gl.getUniformLocation(this.program.program, 'u_color');

        this.vertexBuffer = gl.createBuffer();
        this.indexBuffer = gl.createBuffer();
        this.colorBuffer = gl.createBuffer();
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

    public addLine(line: Line, color?: Color): void {
        let renderCall: GeoRenderCall = {
            vertices: [line.start.x, line.start.y, line.end.x, line.end.y],
            indices: [1, 2],
            color: [1, 0, 0, 1],
            numIndices: 2
        };

        this.addCall(renderCall);
    }

    public addCall(renderCall: GeoRenderCall) {
        this.renderCalls.push(renderCall);
    }

    public clear(): void {
        this.renderCalls = [];
    }

    public bindFBO(): void {
        this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this.scaleFBO.fbo);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT);
        this.flipY = 1;
    }

    public executeFBO(): void {
        this.flush();
        this.clear();
    }

    public unbindFBO(): void {
        this.flipY = 0;
        this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null);
    }

    public execute(): void {
        this.flush();
        this.clear();
    }

    public renderLine(line: Line, color?: Color): void {
        let gl = this.gl;
        gl.useProgram(this.program.program);
        gl.uniform2f(this.resolution, this.config.getResolutionWidth(), this.config.getResolutionHeight());

        if (color) {
            let col = color.getRGBAFloat();
            gl.uniform4f(this.color, col[0], col[1], col[2], col[3]);
        } else {
            gl.uniform4f(this.color, 1.0, 0.0, 0.0, 1.0);
        }

        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([line.start.x, line.start.y, line.end.x, line.end.y]), gl.STATIC_DRAW);
        gl.enableVertexAttribArray(this.position);
        gl.vertexAttribPointer(this.position, 2, gl.FLOAT, false, 0, 0);

        gl.drawArrays(gl.LINES, 0, 2);
    }

    public renderCircle(circle: Circle, resolution: number, color?: Color): void {
        let gl = this.gl;
        let vertices: number[] = [];
        gl.useProgram(this.program.program);
        gl.uniform2f(this.resolution, this.config.getResolutionWidth(), this.config.getResolutionHeight());

        if (color) {
            let col = color.getRGBAFloat();
            gl.uniform4f(this.color, col[0], col[1], col[2], col[3]);
        } else {
            gl.uniform4f(this.color, 1.0, 0.0, 0.0, 1.0);
        }

        let vec = new Vector2(0.0, -1.0).scale(circle.radius).add(new Vector2(circle.pos.x, circle.pos.y));
        let degreePerStep = 360 / resolution;
        vertices.push(...[vec.x, vec.y]);

        for (let i = 0; i < resolution; i += 1) {
            vec = vec.rotatePivot(circle.pos.x, circle.pos.y, degreeToRadian(degreePerStep));
            vertices.push(...[vec.x, vec.y]);
        }

        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
        gl.enableVertexAttribArray(this.position);
        gl.vertexAttribPointer(this.position, 2, gl.FLOAT, false, 0, 0);

        gl.drawArrays(gl.LINE_LOOP, 0, vertices.length / 2);
    }

    public renderPoint(point: Point, color?: Color): void {
        let gl = this.gl;
        gl.useProgram(this.program.program);
        gl.uniform2f(this.resolution, this.config.getResolutionWidth(), this.config.getResolutionHeight());

        if (color) {
            let col = color.getRGBAFloat();
            gl.uniform4f(this.color, col[0], col[1], col[2], col[3]);
        } else {
            gl.uniform4f(this.color, 1.0, 0.0, 0.0, 1.0);
        }

        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([point.x, point.y]), gl.STATIC_DRAW);
        gl.enableVertexAttribArray(this.position);
        gl.vertexAttribPointer(this.position, 2, gl.FLOAT, false, 0, 0);

        gl.drawArrays(gl.POINTS, 0, 1);
    }

    public renderRectangle(rectangle: Rectangle, color?: Color): void {
        let gl = this.gl;
        gl.useProgram(this.program.program);
        gl.uniform2f(this.resolution, this.config.getResolutionWidth(), this.config.getResolutionHeight());

        if (color) {
            let col = color.getRGBAFloat();
            gl.uniform4f(this.color, col[0], col[1], col[2], col[3]);
        } else {
            gl.uniform4f(this.color, 1.0, 0.0, 0.0, 1.0);
        }

        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
            rectangle.pos.x, rectangle.pos.y,
            rectangle.pos.x + rectangle.width, rectangle.pos.y,
            rectangle.pos.x + rectangle.width, rectangle.pos.y + rectangle.height,
            rectangle.pos.x, rectangle.pos.y + rectangle.height
        ]), gl.STATIC_DRAW);
        gl.enableVertexAttribArray(this.position);
        gl.vertexAttribPointer(this.position, 2, gl.FLOAT, false, 0, 0);

        gl.drawArrays(gl.LINE_LOOP, 0, 4);
    }

    public renderPolygon(polygon: Polygon, color?: Color): void {

    }

    public flush(): void {
        let gl = this.gl;
        gl.useProgram(this.program.program);
        gl.uniform2f(this.resolution, this.config.getResolutionWidth(), this.config.getResolutionHeight());

        for (let call in this.renderCalls) {
            gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.renderCalls[call].vertices), gl.STATIC_DRAW);
            gl.enableVertexAttribArray(this.position);
            gl.vertexAttribPointer(this.position, 2, gl.FLOAT, false, 0, 0);

            gl.uniform4f(this.color, this.renderCalls[call].color[0], this.renderCalls[call].color[1], this.renderCalls[call].color[2], this.renderCalls[call].color[3]);

            gl.lineWidth(4);
            gl.drawArrays(gl.LINES, 0, 2);
        }
    }
}
