import { Color } from './color';
import { CONTAINER_ID } from '../gamesaw';

export abstract class Surface {
    public abstract width: number;
    public abstract height: number;
    public abstract id: string;
    public abstract canvas: HTMLCanvasElement;

    public createCanvas(): void {
        let container = document.getElementById(CONTAINER_ID);

        this.canvas = document.createElement('canvas');
        this.canvas.setAttribute('id', this.id);
        this.canvas.setAttribute('width', String(this.width));
        this.canvas.setAttribute('height', String(this.height));

        this.canvas.style.position = 'absolute';

        container.appendChild(this.canvas);
    };

    public abstract clear(color: Color): void;

    public toDataUrl(): string {
        return this.canvas.toDataURL('image/png');
    }
}
