export interface Tile {
    tileid: number;
    row: number;
    col: number;
}

export class TilemapLayer {
    public tiles: number[] = [];
    public data: string;
    public encoding: string;
    public width: number;
    public height: number;
    public x: number;
    public y: number;
    public opacity: number;
    public visible: boolean;
    public name: string;
    public type: string;

    constructor(data: string, encoding: string, width: number, height: number,
        x: number, y: number, opacity: number, visible: boolean, name: string, type: string) {
        this.data = data;
        this.encoding = encoding;
        this.height = height;
        this.width = width;
        this.x = x;
        this.y = y;
        this.opacity = opacity;
        this.visible = visible;
        this.name = name;
        this.type = type;

        this.decode();
    }

    public decode() {
        let rawData = atob(this.data);
        let bytes: number = 4;
        let length: number = rawData.length / bytes;

        for (let i = 0; i < length; i += 1) {
            this.tiles[i] = 0;

            for (let j = bytes - 1; j >= 0; j -= 1) {
                this.tiles[i] += rawData.charCodeAt((i * bytes) + j) << (j << 3);
            }
        }
    }

    public isVisible(): boolean {
        return this.visible;
    }

    public getTileByIndex(i: number): Tile {
        return {
            tileid: this.tiles[i],
            row: Math.floor(i / this.width),
            col: i % this.width
        };
    }

    public getTileByPosition(column: number, row: number): Tile {
        let i: number = (row * this.width) + column;
        return {
            tileid: this.tiles[i],
            row: row,
            col: column
        };
    }
}
