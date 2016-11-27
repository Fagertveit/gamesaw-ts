export interface Glyph {
    x: number;
    y: number;
    xOffset: number;
    yOffset: number;
    width: number;
    height: number;
    xAdvance: number;
    page: number;
    channel: number;
}

export interface GlyphSet {
    [index: number]: Glyph;
}

export interface FontInfo {
    face: string;
    size: number;
    bold: number;
    italic: number;
    charset: string;
    unicode: number;
    stretchHeight: number;
    smooth: number;
    padding: number[];
    antiAliasing: number;
    spacing: number[];
    outline: number;
}

export interface FontCommon {
    lineHeight: number;
    base: number;
    scaleWidth: number;
    scaleHeight: number;
    pages: number;
    packed: number;
    alphaChannel: number;
    redChannel: number;
    greenChannel: number;
    blueChannel: number;
}

export interface PageSet {
    [index: number]: FontPage;
}

export interface FontPage {
    file: string;
}

export class BitmapFont {
    public info: FontInfo;
    public common: FontCommon;
    public pages: PageSet = {};
    public glyphs: GlyphSet = {};
    public glyphCount: number;

    constructor() {

    }
}
