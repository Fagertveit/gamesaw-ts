import { Texture } from '../texture';
import { Color } from '../../graphics/color';
import { Http, AJAXResponse } from '../../utility/http';
import { ResourceManager } from '../../utility/resource-manager';
import { FontRenderer } from './font-renderer';
import { RenderCall } from '../renderer2d/render-call';
import { BitmapFont, Glyph } from './bitmap-font';
import { Surface3d } from '../../graphics/surface3d';

export interface FontTexture {
    [index: number]: Texture;
}

const enum Align {
    LEFT,
    CENTER,
    RIGHT
}

export class Font {
    public gl: WebGLRenderingContext;
    public resourceManager: ResourceManager;
    public texturePage: FontTexture = {};
    public font: BitmapFont = new BitmapFont();
    public base: number = 0;
    public lineHeight: number = 0;
    public color: Color = new Color(255, 255, 255, 1.0);
    public configUrl: string;
    public align: number = Align.LEFT;
    private http: Http;

    constructor(configUrl?: string) {
        this.gl = Surface3d.getInstance().getContext();
        this.http = new Http(false);

        this.resourceManager = ResourceManager.getInstance();

        if (configUrl) {
            this.configUrl = configUrl;

            this.load(configUrl);
        }
    }

    public load(configUrl: string): void {
        let _this = this;

        this.resourceManager.addOther();

        this.http.get(configUrl, (data: XMLHttpRequest) => {
            _this.parseConfig(data.responseXML);
        });
    }

    public parseConfig(xmlConfig: XMLDocument): void {
        let pages = xmlConfig.getElementsByTagName('page');
        let char = xmlConfig.getElementsByTagName('char');
        let common = xmlConfig.getElementsByTagName('common')[0];
        let info = xmlConfig.getElementsByTagName('info')[0];

        this.font.glyphCount = +xmlConfig.getElementsByTagName('chars')[0].getAttribute('count');

        // Info data
        this.font.info = {
            face: info.getAttribute('face'),
            size: +info.getAttribute('size'),
            italic: +info.getAttribute('italic'),
            charset: info.getAttribute('charset'),
            unicode: +info.getAttribute('unicode'),
            bold: +info.getAttribute('bold'),
            stretchHeight: +info.getAttribute('stretchH'),
            smooth: +info.getAttribute('smooth'),
            antiAliasing: +info.getAttribute('aa'),
            padding: info.getAttribute('padding').split(',').map(src => +src),
            spacing: info.getAttribute('spacing').split(',').map(src => +src),
            outline: +info.getAttribute('outline')
        };

        // Common data
        this.font.common = {
            lineHeight: +common.getAttribute('lineHeight'),
            base: +common.getAttribute('base'),
            scaleWidth: +common.getAttribute('scaleW'),
            scaleHeight: +common.getAttribute('scaleH'),
            pages: +common.getAttribute('pages'),
            packed: +common.getAttribute('packed'),
            alphaChannel: +common.getAttribute('alphaChnl'),
            redChannel: +common.getAttribute('redChnl'),
            greenChannel: +common.getAttribute('greenChnl'),
            blueChannel: +common.getAttribute('blueChnl')
        };


        for (let i = 0; i < pages.length; i += 1) {
            let file = pages[i].getAttribute('file');
            let id = +pages[i].getAttribute('id');

            this.font.pages[id] = {
                file: file
            };

            this.texturePage[id] = new Texture(file);
        }

        for (let i = 0; i < char.length; i += 1) {
            let id = +char[i].getAttribute('id');
            this.font.glyphs[id] = {
                x: +char[i].getAttribute('x'),
                y: +char[i].getAttribute('y'),
                width: +char[i].getAttribute('width'),
                height: +char[i].getAttribute('height'),
                xOffset: +char[i].getAttribute('xoffset'),
                yOffset: +char[i].getAttribute('yoffset'),
                xAdvance: +char[i].getAttribute('xadvance'),
                page: +char[i].getAttribute('page'),
                channel: +char[i].getAttribute('chnl')
            };
        }

        this.resourceManager.otherReady();
    }

    public drawString(renderer: FontRenderer, str: string, x: number, y: number): void {
        let currentX: number = x;
        let currentY: number = 0;

        if (this.align === Align.CENTER) {
            let stringWidth = this.calculateWidth(str);
            currentX = x - Math.floor(stringWidth / 2);
        } else if (this.align === Align.RIGHT) {
            let stringWidth = this.calculateWidth(str);
            currentX = x - stringWidth;
        }

        for (let i = 0; i < str.length; i += 1) {
            let id = str.charCodeAt(i);

            if (this.font.glyphs[id]) {
                let glyph = this.font.glyphs[id];

                this.renderGlyph(renderer, currentX + glyph.xOffset, y + glyph.yOffset, glyph);
                currentX += glyph.xAdvance;
            }
        }
    }

    public renderGlyph(renderer: FontRenderer, x: number, y: number, glyph: Glyph): void {
        let uvs: number[] = [];

        uvs[0] = glyph.x / this.font.common.scaleWidth;
        uvs[1] = glyph.y / this.font.common.scaleHeight;
        uvs[2] = (glyph.x + glyph.width) / this.font.common.scaleWidth;
        uvs[3] = (glyph.y + glyph.height) / this.font.common.scaleHeight;

        let renderCall: RenderCall = new RenderCall();

        renderCall.texture = this.texturePage[glyph.page].texture;
        renderCall.vertices = [x, y, x + glyph.width, y, x, y + glyph.height, x + glyph.width, y + glyph.height];
        renderCall.uvs = [uvs[0], uvs[1], uvs[2], uvs[1], uvs[0], uvs[3], uvs[2], uvs[3]];
        renderCall.indices = [0, 1, 2, 1, 2, 3];
        renderCall.numIndices = 6;

        renderer.addCall(renderCall);
    }

    public calculateWidth(str: string): number {
        let width = 0;

        for (let i = 0; i < str.length; i += 1) {
            let id = str.charCodeAt(i);

            width += +this.font.glyphs[id]['xAdvance'];
        }

        return width;
    }
}
