import { Surface } from './surface.abstract';
import { Color } from './color';
import { Gamesaw } from '../gamesaw';

export class Surface2d extends Surface {
    public config: Gamesaw;
    public id: string = 'canvas-2d';
    public canvas: HTMLCanvasElement;
    public clearColor: Color = new Color(0, 0, 0, 1);

    constructor(id: string) {
        super();
        this.config = Gamesaw.getInstance();
        this.id = id;

        this.createCanvas();
    }

    public clear(color?: Color): void {
        if (color) {
            this.clearColor = color;
        }

        let ctx = this.getContext();

        ctx.clearRect(0, 0, this.config.getResolutionWidth(), this.config.getResolutionHeight());

        if (color) {
            ctx.save();
            ctx.fillStyle = color.getHex();
            ctx.fillRect(0, 0, this.config.getResolutionWidth(), this.config.getResolutionHeight());
            ctx.restore();
        }
    }

    public getContext(): CanvasRenderingContext2D {
        return this.canvas.getContext('2d');
    }
}
