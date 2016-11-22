import { Texture } from './texture';
import { Renderer2d } from './renderer2d/renderer2d';
import { RenderCall } from './renderer2d/render-call';
import { Vector2 } from '../geometry/vector2d';
import { degreeToRadian } from '../utility/angle';

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

    public renderScale(renderer: Renderer2d, x: number, y: number, scale: number): void {
        let renderCall: RenderCall = new RenderCall();

        renderCall.texture = this.texture.texture;
        renderCall.vertices = [x, y,
            x + (this.width * scale), y,
            x, y + (this.height * scale),
            x + (this.width * scale), y + (this.height * scale)];
        renderCall.uvs = [this.uv[0], this.uv[1], this.uv[2], this.uv[1], this.uv[0], this.uv[3], this.uv[2], this.uv[3]];
        renderCall.indices = [0, 1, 2, 1, 2, 3];
        renderCall.numIndices = 6;

        renderer.addCall(renderCall);
    }

    public renderAngle(renderer: Renderer2d, x: number, y: number, angle: number): void {
        let vec: Vector2[] = [];
        let px: number = x + (this.width / 2);
        let py: number = y + (this.height / 2);

        vec[0] = new Vector2(x, y);
        vec[1] = new Vector2(x + this.width, y);
        vec[2] = new Vector2(x, y + this.height);
        vec[3] = new Vector2(x + this.width, y + this.height);

        for (let vector in vec) {
            vec[vector] = vec[vector].rotatePivot(px, py, degreeToRadian(angle));
        }

        let renderCall: RenderCall = new RenderCall();

        renderCall.texture = this.texture.texture;
        renderCall.vertices = [vec[0].x, vec[0].y,
            vec[1].x, vec[1].y,
            vec[2].x, vec[2].y,
            vec[3].x, vec[3].y];
        renderCall.uvs = [this.uv[0], this.uv[1], this.uv[2], this.uv[1], this.uv[0], this.uv[3], this.uv[2], this.uv[3]];
        renderCall.indices = [0, 1, 2, 1, 2, 3];
        renderCall.numIndices = 6;

        renderer.addCall(renderCall);
    }
}
