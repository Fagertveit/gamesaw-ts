export abstract class Scene {
    public abstract gl: WebGLRenderingContext;

    constructor() { }

    public abstract render(delta: number): void;
    public abstract update(delta: number): void;

    public clear(): void {
        let gl = this.gl;
        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        gl.enable(gl.BLEND);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    }
}
