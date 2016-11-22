import { Texture } from './texture';
import { Renderer2d } from './renderer2d/renderer2d';
import { RenderCall } from './renderer2d/render-call';

export class Sprite {
    public uv: number[];
    public width: number;
    public height: number;
    public texture: Texture;

    constructor(texture?: Texture, width?: number, height?: number, uv?: number[]) {
        if (texture) {
            this.texture = texture;
        }

        if (width && height) {
            this.width = width;
            this.height = height;
        }

        if (uv) {
            this.uv = uv;
        }
    }

    public setUV(x0: number, y0: number, x1: number, y1: number): void {
        this.uv = [x0, y0, x1, y1];
    }

    public setUVByPixels(x: number, y: number, width: number, height: number): void {
        this.uv = [(x / this.texture.width), (y / this.texture.height), ((x + width) / this.texture.width), ((y + height) / this.texture.height)];
    }

    public render(renderer: Renderer2d, x: number, y: number): void {
        let renderCall: RenderCall = new RenderCall();

        renderCall.texture = this.texture.texture;
        renderCall.vertices = [x, y, x + this.width, y, x, y + this.height, x + this.width, y + this.height];
        renderCall.uvs = [this.uv[0], this.uv[1], this.uv[2], this.uv[1], this.uv[0], this.uv[3], this.uv[2], this.uv[3]];
        renderCall.indices = [0, 1, 2, 1, 2, 3];
        renderCall.numIndices = 6;

        renderer.addCall(renderCall);
    }
}
