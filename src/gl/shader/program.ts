import { Http } from '../../utility/http';
import { ResourceManager } from '../../utility/resource-manager';

interface AJAXResponse {
    responseText?: string;
}

export enum ShaderType {
    VERTEX,
    FRAGMENT
}

export class Program {
    public vertexShader: WebGLShader;
    public fragmentShader: WebGLShader;
    public program: WebGLProgram;
    public gl: WebGLRenderingContext;
    private http: Http;
    private resourceManager: ResourceManager;

    constructor(gl: WebGLRenderingContext, fragmentShaderUrl?: string, vertexShaderUrl?: string, resourceManager?: ResourceManager) {
        this.gl = gl;
        this.http = new Http(false);

        if (resourceManager) {
            this.resourceManager = resourceManager;
        }

        if (fragmentShaderUrl && vertexShaderUrl) {
            this.initShader(fragmentShaderUrl, vertexShaderUrl);
        }
    }

    public getProgram(): WebGLProgram {
        return this.program;
    }

    public loadShader(type: ShaderType, shader: string): void {
        if (type === ShaderType.VERTEX) {
            this.vertexShader = this.compileShader(type, shader);
        } else {
            this.fragmentShader = this.compileShader(type, shader);
        }
    }

    private compileShader(type: ShaderType, shaderSrc: string): WebGLShader {
        let shader: WebGLShader;

        if (type === ShaderType.VERTEX) {
            shader = this.gl.createShader(this.gl.VERTEX_SHADER);
        } else if (type === ShaderType.FRAGMENT) {
            shader = this.gl.createShader(this.gl.FRAGMENT_SHADER);
        } else {
            throw new Error('No valid shader type specified.');
        }

        this.gl.shaderSource(shader, shaderSrc);
        this.gl.compileShader(shader);

        if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
            throw new Error(this.gl.getShaderInfoLog(shader));
        }

        return shader;
    }

    public createProgram(): void {
        this.program = this.gl.createProgram();

        this.gl.attachShader(this.program, this.vertexShader);
        this.gl.attachShader(this.program, this.fragmentShader);
        this.gl.linkProgram(this.program);

        if (!this.gl.getProgramParameter(this.program, this.gl.LINK_STATUS)) {
            throw new Error('Unable to initialize the shader program.');
        }

        if (this.resourceManager) {
            this.resourceManager.otherReady();
        }

        this.gl.useProgram(this.program);
    }

    public initShader(fsUrl: string, vsUrl: string): void {
        let _this = this;

        if (this.resourceManager) {
            this.resourceManager.addOther();
        }

        this.http.get(fsUrl, (data: AJAXResponse) => {
            _this.loadShader(ShaderType.FRAGMENT, data.responseText);
        });

        this.http.get(vsUrl, (data: AJAXResponse) => {
            _this.loadShader(ShaderType.VERTEX, data.responseText);
        });

        this.createProgram();
    }
}
