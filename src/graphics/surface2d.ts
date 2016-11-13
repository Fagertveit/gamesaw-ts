import { Surface } from './surface.abstract';
import { Color } from './color';

export class Surface2d extends Surface {
    public width: number = 640;
    public height: number = 480;
    public id: string = 'canvas-2d';
    public canvas: HTMLCanvasElement;

    constructor() {
        super();
    }

    public clear(color: Color): void {
        let ctx = this.getContext();

        ctx.clearRect(0, 0, this.width, this.height);

        if (color) {
            ctx.save();
            ctx.fillStyle = color.getHex();
            ctx.fillRect(0, 0, this.width, this.height);
            ctx.restore();
        }
    }

    public getContext(): CanvasRenderingContext2D {
        return this.canvas.getContext('2d');
    }
}
