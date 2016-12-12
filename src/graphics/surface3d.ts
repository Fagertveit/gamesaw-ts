import { Surface } from './surface.abstract';
import { Color } from './color';
import { Gamesaw } from '../gamesaw';

export class Surface3d extends Surface {
    public gl: WebGLRenderingContext;
    public config: Gamesaw;
    public id: string;
    public clearColor: Color = new Color(0, 0, 0, 1);
    public canvas: HTMLCanvasElement;

    constructor(id: string) {
        super();
        this.config = Gamesaw.getInstance();

        this.id = id;

        this.createCanvas();
        this.init();
    }

    private init(): void {
        this.gl = this.getContext();

        let colorFloats = this.clearColor.getRGBAFloat();
        this.gl.clearColor(colorFloats[0], colorFloats[1], colorFloats[2], colorFloats[3]);
    }

    public clear(color?: Color): void {
        let gl = this.gl;
        if (color) {
            this.clearColor = color;
            let colorFloats = this.clearColor.getRGBAFloat();
            gl.clearColor(colorFloats[0], colorFloats[1], colorFloats[2], colorFloats[3]);
        }

        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        gl.enable(gl.BLEND);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    }

    public getContext(): WebGLRenderingContext {
        return this.canvas.getContext('webgl', { preserveDrawingBuffer: true }) ||
            this.canvas.getContext('experimental-webgl', { preserveDrawingBuffer: true });
    }
}
