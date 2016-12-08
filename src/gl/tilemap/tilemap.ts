import { TilemapLayer } from './tilemap-layer';
import { Tileset } from './tileset';
import { Color } from '../../graphics/color';
import { Http, AJAXResponse } from '../../utility/http';
import { ResourceManager } from '../../utility/resource-manager';
import { Renderer2d } from '../renderer2d/renderer2d';
import { Rectangle } from '../../geometry/rectangle';

export interface Tiled {
    width: number;
    height: number;
    tilewidth: number;
    tileheight: number;
    backgroundcolor: string;
    nextobjectid: number;
    orientation: string;
    renderorder: string;
    version: number;
    layers: TiledLayer[];
    tilesets: TiledTileset[];
}

export interface TiledTileset {
    name: string;
    image: string;
    imagewidth: number;
    imageheight: number;
    firstgid: number;
    margin: number;
    spacing: number;
    columns: number;
    tilecount: number;
    tilewidth: number;
    tileheight: number;
}

export interface TiledLayer {
    data: string;
    encoding: string;
    height: number;
    width: number;
    x: number;
    y: number;
    opacity: number;
    visible: boolean;
    name: string;
    type: string;
}

export interface TileInfo {
    collider?: Rectangle;
    id: number;
    row?: number;
    col?: number;
}

export class Tilemap {
    public gl: WebGLRenderingContext;
    private resourceManager: ResourceManager;
    public layers: TilemapLayer[] = [];
    public tilesets: Tileset[] = [];
    public width: number;
    public height: number;
    public tileWidth: number;
    public tileHeight: number;
    public backgroundColor: Color = new Color(100, 100, 100, 1);
    public ready: boolean = false;
    public orientation: string;
    public renderOrder: string;
    public nextObjectId: number;
    public activeLayer: number = 0;

    private http: Http;

    constructor(gl?: WebGLRenderingContext) {
        if (gl) {
            this.gl = gl;
        }

        this.resourceManager = ResourceManager.getInstance();

        this.http = new Http(false);
    }

    public loadTiledMap(url: string) {
        let _this = this;

        this.resourceManager.addOther();

        this.http.get(url, (data: AJAXResponse) => {
            _this.parseTiledMap(data.responseText);
        });
    }

    public parseTiledMap(json: string): void {
        let map = JSON.parse(json) as Tiled;
        this.width = map.width;
        this.height = map.height;
        this.tileWidth = map.tilewidth;
        this.tileHeight = map.tileheight;
        this.orientation = map.orientation;
        this.renderOrder = map.renderorder;
        this.nextObjectId = map.nextobjectid;

        if (map.backgroundcolor) {
            this.backgroundColor.setHex(map.backgroundcolor);
        }


        for (let layer of map.layers) {
            this.layers.push(new TilemapLayer(
                layer.data,
                layer.encoding,
                layer.width,
                layer.height,
                layer.x,
                layer.y,
                layer.opacity,
                layer.visible,
                layer.name,
                layer.type
            ));
        }

        for (let tileset of map.tilesets) {
            this.tilesets.push(new Tileset(
                this.gl,
                tileset.name,
                tileset.image,
                tileset.imagewidth,
                tileset.imageheight,
                tileset.firstgid,
                tileset.margin,
                tileset.spacing,
                tileset.columns,
                tileset.tilecount,
                tileset.tilewidth,
                tileset.tileheight
            ));
        }

        this.resourceManager.otherReady();
    }

    public setActiveLayer(activeLayer: number): void {
        this.activeLayer = activeLayer;
    }

    public getActiveLayer(): number {
        return this.activeLayer;
    }

    public getContainedTiles(container: Rectangle, scale?: number): TileInfo[] {
        let tiles: TileInfo[] = [];

        return tiles;
    }

    public getTileAt(x: number, y: number, scale?: number): TileInfo {
        let tile: TileInfo = {
            id: 0
        };

        if (scale) {
            let row: number = Math.floor(y / (this.tileHeight * scale));
            let col: number = Math.floor(x / (this.tileWidth * scale));
            let pos: number = (row * this.width) + col;
            let tileData = this.layers[this.activeLayer].getTile(pos);

            tile.id = tileData.tileid;
            tile.row = tileData.row;
            tile.col = tileData.col;
            tile.collider = new Rectangle((this.tileWidth * scale) * col, (this.tileHeight * scale) * row, (this.tileWidth * scale), (this.tileHeight * scale));
        } else {
            let row: number = Math.floor(y / this.tileHeight);
            let col: number = Math.floor(x / this.tileWidth);
            let pos: number = (row * this.width) + col;
            let tileData = this.layers[this.activeLayer].getTile(pos);

            console.log(col, row, pos);

            tile.id = tileData.tileid;
            tile.row = tileData.row;
            tile.col = tileData.col;
            tile.collider = new Rectangle(this.tileWidth * col, this.tileHeight * row, this.tileWidth, this.tileHeight);
        }

        return tile;
    }

    public render(renderer: Renderer2d, x: number, y: number, scale?: number, scaleY?: number) {
        for (let layer of this.layers) {
            if (layer.isVisible()) {
                for (let i in layer.tiles) {
                    let tileData = layer.getTile(+i);
                    let tileX: number = this.tileWidth * tileData.col + x;
                    let tileY: number = this.tileHeight * tileData.row + y;

                    if (tileData.tileid !== 0) {
                        for (let j in this.tilesets) {
                            if (tileData.tileid >= this.tilesets[j].firstgid && tileData.tileid <= this.tilesets[j].lastgid) {
                                this.tilesets[j].renderTile(renderer, tileX, tileY, tileData.tileid);
                                break;
                            }
                        }
                    }
                }
            }
        }
    }

    public renderScale(renderer: Renderer2d, x: number, y: number, scale: number) {
        for (let layer of this.layers) {
            if (layer.isVisible()) {
                for (let i in layer.tiles) {
                    let tileData = layer.getTile(+i);
                    let tileX: number = (this.tileWidth * scale) * tileData.col + x;
                    let tileY: number = (this.tileHeight * scale) * tileData.row + y;

                    if (tileData.tileid !== 0) {
                        for (let j in this.tilesets) {
                            if (tileData.tileid >= this.tilesets[j].firstgid && tileData.tileid <= this.tilesets[j].lastgid) {
                                this.tilesets[j].renderTileScale(renderer, tileX, tileY, tileData.tileid, scale);
                                break;
                            }
                        }
                    }
                }
            }
        }
    }
}
