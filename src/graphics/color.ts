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

export interface RGB {
    r: number;
    g: number;
    b: number;
}

export interface HSL {
    h: number;
    s: number;
    l: number;
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

    constructor(red?: number, green?: number, blue?: number, alpha?: number) {
        if (red && green && blue) {
            this.rgb[RGBA.RED] = red;
            this.rgb[RGBA.GREEN] = green;
            this.rgb[RGBA.BLUE] = blue;
            this.RGBtoHSL();
        }

        if (alpha) {
            this.alpha = alpha;
        }
    }

    public setRGB(red: number, green: number, blue: number): void {
        this.rgb[RGBA.RED] = red;
        this.rgb[RGBA.GREEN] = green;
        this.rgb[RGBA.BLUE] = blue;
        this.RGBtoHSL();
    }

    public setHSL(hue: number, saturation: number, luminosity: number): void {
        this.hsl[HSLA.HUE] = hue;
        this.hsl[HSLA.SATURATION] = saturation;
        this.hsl[HSLA.LUMINOSITY] = luminosity;
        this.HSLtoRGB();
    }

    public setAlpha(alpha: number): void {
        this.alpha = alpha;
    }

    public getRGB(): RGB {
        return { r: this.rgb[RGBA.RED], g: this.rgb[RGBA.GREEN], b: this.rgb[RGBA.BLUE] };
    }

    public getHSL(): HSL {
        return { h: this.hsl[HSLA.HUE], s: this.hsl[HSLA.SATURATION], l: this.hsl[HSLA.LUMINOSITY] };
    }

    public getAlpha(): number {
        return this.alpha;
    }

    public getRGBAFloat(): number[] {
        return [ this.toFloat(this.rgb[RGBA.RED]), this.toFloat(this.rgb[RGBA.GREEN]), this.toFloat(this.rgb[RGBA.BLUE]), this.toFloat(this.alpha) ];
    }

    public RGBtoHSL(): void {
        let r: number = this.rgb[RGBA.RED];
        let g: number = this.rgb[RGBA.GREEN];
        let b: number = this.rgb[RGBA.BLUE];
        let h: number;
        let s: number;
        let l: number;

        let cmax: number = (r > g) ? r : g;

        if (b > cmax) {
            cmax = b;
        }

        let cmin: number = (r < g) ? r : g;

        if (b < cmin) {
            cmin = b;
        }

        l = cmax / 255.0;

        if (cmax !== 0) {
            s = (cmax - cmin) / cmax;
        } else {
            s = 0;
        }

        if (s === 0) {
            h = 0;
        } else {
            let redc: number = (cmax - r) / (cmax - cmin);
            let greenc: number = (cmax - g) / (cmax - cmin);
            let bluec: number = (cmax - b) / (cmax - cmin);

            if (r === cmax) {
                h = bluec - greenc;
            } else if (g === cmax) {
                h = 2.0 + redc - bluec;
            } else {
                h = 4.0 + greenc - redc;
            }

            h = h / 6.0;

            if (h < 0) {
                h = h + 1.0;
            }
        }

        this.hsl[HSLA.HUE] = h;
        this.hsl[HSLA.SATURATION] = s;
        this.hsl[HSLA.LUMINOSITY] = l;
    }

    public HSLtoRGB(): void {
        let r: number = 0;
        let g: number = 0;
        let b: number = 0;
        let hue: number = this.hsl[HSLA.HUE];
        let s: number = this.hsl[HSLA.SATURATION];
        let l: number = this.hsl[HSLA.LUMINOSITY];

        if (this.hsl[HSLA.SATURATION] === 0) {
            r = Math.floor(l * 255 + 0.5);
            g = Math.floor(l * 255 + 0.5);
            b = Math.floor(l * 255 + 0.5);
        } else {
            let h: number = (hue - Math.floor(hue)) * 6.0;
            let f: number = h - Math.floor(h);
            let p: number = l * (1.0 - s);
            let q: number = l * (1.0 - s * f);
            let t: number = l * (1.0 - (s * (1.0 - f)));

            switch (Math.floor(h)) {
                case 0:
                    r = (l * 255.0 + 0.5);
                    g = (t * 255.0 + 0.5);
                    b = (p * 255.0 + 0.5);
                    break;
                case 1:
                    r = (q * 255.0 + 0.5);
                    g = (l * 255.0 + 0.5);
                    b = (p * 255.0 + 0.5);
                    break;
                case 2:
                    r = (p * 255.0 + 0.5);
                    g = (l * 255.0 + 0.5);
                    b = (t * 255.0 + 0.5);
                    break;
                case 3:
                    r = (p * 255.0 + 0.5);
                    g = (q * 255.0 + 0.5);
                    b = (l * 255.0 + 0.5);
                    break;
                case 4:
                    r = (t * 255.0 + 0.5);
                    g = (p * 255.0 + 0.5);
                    b = (l * 255.0 + 0.5);
                    break;
                case 5:
                    r = (l * 255.0 + 0.5);
                    g = (p * 255.0 + 0.5);
                    b = (q * 255.0 + 0.5);
                    break;
            }
        }

        this.rgb[RGBA.RED] = Math.floor(r);
        this.rgb[RGBA.GREEN] = Math.floor(g);
        this.rgb[RGBA.BLUE] = Math.floor(b);
    }

    public getHex(): string {
        return '#' + ((1 << 24) + (this.rgb[RGBA.RED] << 16) + (this.rgb[RGBA.GREEN] << 8) + this.rgb[RGBA.BLUE]).toString(16).slice(1);
    }

    public setHex(hex: string): void {
        let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);

        this.rgb[RGBA.RED] = parseInt(result[RGBA.RED], 16);
        this.rgb[RGBA.GREEN] = parseInt(result[RGBA.GREEN], 16);
        this.rgb[RGBA.BLUE] = parseInt(result[RGBA.BLUE], 16);
    }

    private toFloat(int: number): number {
        if (int === 0) {
            return 0.0;
        }

        return int / 255;
    }

    private toInt(float: number): number {
        return float * 255;
    }

    public interpolate(c1: Color, c2: Color, scale: number): Color {
        let color = new Color();
        let col0 = c1.getRGBAFloat();
        let col1 = c2.getRGBAFloat();

        color.rgb[RGBA.RED] = this.toInt(col0[RGBA.RED] + (col1[RGBA.RED] - col0[RGBA.RED]) * scale);
        color.rgb[RGBA.GREEN] = this.toInt(col0[RGBA.GREEN] + (col1[RGBA.GREEN] - col0[RGBA.GREEN]) * scale);
        color.rgb[RGBA.BLUE] = this.toInt(col0[RGBA.BLUE] + (col1[RGBA.BLUE] - col0[RGBA.BLUE]) * scale);
        color.alpha = this.toInt(col0[RGBA.ALPHA] + (col1[RGBA.ALPHA] - col0[RGBA.ALPHA]) * scale);
        color.RGBtoHSL();

        return color;
    }
}
