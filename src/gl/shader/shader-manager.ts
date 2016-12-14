import { Program } from './program';
import { Surface3d } from '../../graphics/surface3d';

interface ProgramList {
    [index: string]: Program;
}

export class ShaderManager {
    public programs: ProgramList = {};
    public gl: WebGLRenderingContext;

    constructor(gl: WebGLRenderingContext) {
        this.gl = Surface3d.getInstance().getContext();
    }

    public createProgram(fragmentShaderUrl: string, vertexShaderUrl: string, id: string) {
        this.programs[id] = new Program(fragmentShaderUrl, vertexShaderUrl);
    }

    public getProgram(id: string): WebGLProgram {
        return this.programs[id].getProgram();
    }

    public useProgram(id: string): void {
        this.gl.useProgram(this.programs[id].getProgram());
    }
}
