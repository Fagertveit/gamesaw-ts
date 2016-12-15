import { Texture } from './texture';
import { FrameBuffer } from './renderer2d/framebuffer';
import { Renderer2d } from './renderer2d/renderer2d';
import { RenderCall } from './renderer2d/render-call';
import { Vector2 } from '../geometry/vector2d';
import { degreeToRadian } from '../utility/angle';

export class Sprite {
    public uv: number[];
    public width: number;
    public height: number;
    public texture: Texture | FrameBuffer;

    constructor(texture?: Texture | FrameBuffer, width?: number, height?: number, uv?: number[]) {
        if (texture) {
            this.texture = texture;
        }

        if (width && height) {
            this.width = width;
            this.height = height;
        }

        if (uv) {
            this.setUVByPixels(uv[0], uv[1], uv[2], uv[3]);
        }
    }

    public setUV(x0: number, y0: number, x1: number, y1: number): void {
        this.uv = [x0, y0, x1, y1];
    }

    public setUVByPixels(x: number, y: number, width: number, height: number): void {
        this.uv = [(x / this.texture.width), (y / this.texture.height), ((x + width) / this.texture.width), ((y + height) / this.texture.height)];
    }

    public render(x: number, y: number): void {
        let renderCall: RenderCall = new RenderCall();

        renderCall.texture = this.texture.texture;
        renderCall.vertices = [x, y, x + this.width, y, x, y + this.height, x + this.width, y + this.height];
        renderCall.uvs = [this.uv[0], this.uv[1], this.uv[2], this.uv[1], this.uv[0], this.uv[3], this.uv[2], this.uv[3]];
        renderCall.indices = [0, 1, 2, 1, 2, 3];
        renderCall.numIndices = 6;

        Renderer2d.getInstance().addCall(renderCall);
    }

    public renderScale(x: number, y: number, scale: number, scaleY?: number): void {
        let renderCall: RenderCall = new RenderCall();

        if (scaleY) {
            renderCall.vertices = [x, y,
                x + (this.width * scaleY), y,
                x, y + (this.height * scale),
                x + (this.width * scaleY), y + (this.height * scale)];
        } else {
            renderCall.vertices = [x, y,
                x + (this.width * scale), y,
                x, y + (this.height * scale),
                x + (this.width * scale), y + (this.height * scale)];
        }

        renderCall.texture = this.texture.texture;

        renderCall.uvs = [this.uv[0], this.uv[1], this.uv[2], this.uv[1], this.uv[0], this.uv[3], this.uv[2], this.uv[3]];
        renderCall.indices = [0, 1, 2, 1, 2, 3];
        renderCall.numIndices = 6;

        Renderer2d.getInstance().addCall(renderCall);
    }

    public renderAngle(x: number, y: number, angle: number): void {
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

        Renderer2d.getInstance().addCall(renderCall);
    }

    public renderAngleScale(x: number, y: number, angle: number, scale: number, scaleY?: number): void {
        let vec: Vector2[] = [];
        let px: number = x + ((this.width * scale) / 2);
        let py: number = y + ((this.height * scale) / 2);

        if (scaleY) {
            vec[0] = new Vector2(x, y);
            vec[1] = new Vector2(x + (this.width * scale), y);
            vec[2] = new Vector2(x, y + (this.height * scaleY));
            vec[3] = new Vector2(x + (this.width * scale), y + (this.height * scaleY));
        } else {
            vec[0] = new Vector2(x, y);
            vec[1] = new Vector2(x + (this.width * scale), y);
            vec[2] = new Vector2(x, y + (this.height * scale));
            vec[3] = new Vector2(x + (this.width * scale), y + (this.height * scale));
        }

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

        Renderer2d.getInstance().addCall(renderCall);
    }

    public renderFBO() {
        let renderCall: RenderCall = new RenderCall();

        renderCall.texture = this.texture.texture;
        renderCall.vertices = [0, this.height, this.width, this.height, 0, 0, this.width, 0];
        renderCall.uvs = [this.uv[0], this.uv[1], this.uv[2], this.uv[1], this.uv[0], this.uv[3], this.uv[2], this.uv[3]];
        renderCall.indices = [0, 1, 2, 1, 2, 3];
        renderCall.numIndices = 6;

        Renderer2d.getInstance().addCall(renderCall);
    }
}
