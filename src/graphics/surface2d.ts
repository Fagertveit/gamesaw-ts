import { Color } from './color';
import { Gamesaw } from '../gamesaw';

export class Surface2d {
    public config: Gamesaw;
    public id: string = 'canvas-2d';
    public canvas: HTMLCanvasElement;
    public clearColor: Color = new Color(0, 0, 0, 1);

    constructor(id: string) {
        this.config = Gamesaw.getInstance();
        this.id = id;

        this.createCanvas();
    }

    public createCanvas(): void {
        let container = document.getElementById(this.config.getContainerId());

        this.canvas = document.createElement('canvas');
        this.canvas.setAttribute('id', this.id);

        if (this.config.doScale()) {
            this.canvas.setAttribute('width', String(this.config.getRenderResolutionWidth()));
            this.canvas.setAttribute('height', String(this.config.getRenderResolutionHeight()));
        } else {
            this.canvas.setAttribute('width', String(this.config.getResolutionWidth()));
            this.canvas.setAttribute('height', String(this.config.getResolutionHeight()));
        }

        this.canvas.style.position = 'absolute';

        container.appendChild(this.canvas);
    };

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

    public toDataUrl(): string {
        return this.canvas.toDataURL('image/png');
    }
}
