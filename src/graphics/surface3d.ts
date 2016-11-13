import { Surface } from './surface.abstract';
import { Color } from './color';

export class Surface3d extends Surface {
    public width: number;
    public height: number;
    public id: string;
    public canvas: HTMLCanvasElement;

    constructor() {
        super();
    }

    public clear(color: Color): void {

    }

    public getContext(): WebGLRenderingContext {
        return this.canvas.getContext('webgl', { preserveDrawingBuffer: true }) ||
            this.canvas.getContext('experimental-webgl', { preserveDrawingBuffer: true });
    }
}
