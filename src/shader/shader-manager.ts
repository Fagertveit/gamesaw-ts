import { Program } from './program';

interface ProgramList {
    [index: string]: Program;
}

export class ShaderManager {
    public programs: ProgramList = {};
    public gl: WebGLRenderingContext;

    constructor(gl: WebGLRenderingContext) {
        this.gl = gl;
    }

    public createProgram(fsUrl: string, vsUrl: string, id: string) {
        this.programs[id] = new Program(this.gl, fsUrl, vsUrl);
    }

    public getProgram(id: string): WebGLProgram {
        return this.programs[id].getProgram();
    }

    public useProgram(id: string): void {
        this.gl.useProgram(this.programs[id].getProgram());
    }
}
