import { Surface } from './surface.abstract';
import { Color } from './color';

export class Surface2d extends Surface {
    public width: number;
    public height: number;
    public id: string;
    public canvas: HTMLCanvasElement

    constructor() {
        super();
    }

    public createCanvas(): void {

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
