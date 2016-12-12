import { Color } from './color';
import { Gamesaw } from '../gamesaw';

export abstract class Surface {
    public abstract config: Gamesaw;
    public abstract id: string;
    public abstract canvas: HTMLCanvasElement;

    public constructor() { }

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

    public abstract clear(color: Color): void;

    public toDataUrl(): string {
        return this.canvas.toDataURL('image/png');
    }
}
