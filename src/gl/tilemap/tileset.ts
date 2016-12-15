import { Texture } from '../texture';
import { Renderer2d } from '../renderer2d/renderer2d';
import { RenderCall } from '../renderer2d/render-call';
import { Surface3d } from '../../graphics/surface3d';

export class Tileset {
    public gl: WebGLRenderingContext;
    public texture: Texture;
    public name: string;
    public image: string;
    public imageWidth: number;
    public imageHeight: number;
    public firstgid: number;
    public lastgid: number;
    public margin: number;
    public spacing: number;
    public columns: number;
    public tileCount: number;
    public tileWidth: number;
    public tileHeight: number;

    constructor(gl: WebGLRenderingContext, name: string, image: string, imageWidth: number, imageHeight: number, firstgid: number,
        margin: number, spacing: number, columns: number, tileCount: number, tileWidth: number, tileHeight: number) {
        this.gl = Surface3d.getInstance().getContext();
        this.name = name;
        this.image = image;
        this.imageWidth = imageWidth;
        this.imageHeight = imageHeight;
        this.firstgid = firstgid;
        this.margin = margin;
        this.spacing = spacing;
        this.columns = columns;
        this.tileCount = tileCount;
        this.tileWidth = tileWidth;
        this.tileHeight = tileHeight;

        this.lastgid = this.firstgid + this.tileCount - 1;
        this.texture = new Texture(this.image);
    }

    public renderTile(x: number, y: number, id: number): void {
        let row: number = Math.floor((id - this.firstgid) / this.columns);
        let col: number = (id - this.firstgid) % this.columns;

        let uvs: number[] = [
            ((col * this.tileWidth) / this.imageWidth),
            ((row * this.tileHeight) / this.imageHeight),
            (((col * this.tileWidth) + this.tileWidth) / this.imageWidth),
            (((row * this.tileHeight) + this.tileHeight) / this.imageHeight)
        ];

        let renderCall: RenderCall = new RenderCall();

        renderCall.texture = this.texture.texture;
        renderCall.vertices = [x, y,
            x + this.tileWidth, y,
            x, y + this.tileHeight,
            x + this.tileWidth, y + this.tileHeight];
        renderCall.uvs = [uvs[0], uvs[1], uvs[2], uvs[1], uvs[0], uvs[3], uvs[2], uvs[3]];
        renderCall.indices = [0, 1, 2, 1, 2, 3];
        renderCall.numIndices = 6;

        Renderer2d.getInstance().addCall(renderCall);
    }

    public renderTileScale(x: number, y: number, id: number, scale: number, scaleY?: number) {
        let row: number = Math.floor((id - this.firstgid) / this.columns);
        let col: number = (id - this.firstgid) % this.columns;

        let uvs: number[] = [
            ((col * this.tileWidth) / this.imageWidth),
            ((row * this.tileHeight) / this.imageHeight),
            (((col * this.tileWidth) + this.tileWidth) / this.imageWidth),
            (((row * this.tileHeight) + this.tileHeight) / this.imageHeight)
        ];

        let renderCall: RenderCall = new RenderCall();

        renderCall.texture = this.texture.texture;
        renderCall.vertices = [x, y,
            x + this.tileWidth * scale, y,
            x, y + this.tileHeight * scale,
            x + this.tileWidth * scale, y + this.tileHeight * scale];
        renderCall.uvs = [uvs[0], uvs[1], uvs[2], uvs[1], uvs[0], uvs[3], uvs[2], uvs[3]];
        renderCall.indices = [0, 1, 2, 1, 2, 3];
        renderCall.numIndices = 6;

        Renderer2d.getInstance().addCall(renderCall);
    }

    public renderTileAngle(x: number, y: number, id: number, angle: number, scale?: number, scaleY?: number) {

    }
}
