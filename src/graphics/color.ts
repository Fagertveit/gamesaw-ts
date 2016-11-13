export enum RGBA {
    RED,
    GREEN,
    BLUE,
    ALPHA
}

export enum HSLA {
    HUE,
    SATURATION,
    LUMINOSITY,
    ALPHA
}

export class Color {
    public rgb: number[] = [
        255,
        255,
        255
    ];
    public hsl: number[] = [
        360,
        100,
        100
    ];
    public alpha: number = 1;

    constructor() {}

    public getHex(): string {
        return '#' + ((1 << 24) + (this.rgb[RGBA.RED] << 16) + (this.rgb[RGBA.GREEN] << 8) + this.rgb[RGBA.BLUE]).toString(16).slice(1);
    }

    public setHex(hex: string): void {
        let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);

        this.rgb[RGBA.RED] = parseInt(result[RGBA.RED], 16);
        this.rgb[RGBA.GREEN] = parseInt(result[RGBA.GREEN], 16);
        this.rgb[RGBA.BLUE] = parseInt(result[RGBA.BLUE], 16);
    }
}
