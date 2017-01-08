import { Color } from './color';
import { Gamesaw } from '../gamesaw';

export class Surface3d {
    private static instance: Surface3d = new Surface3d();
    public gl: WebGLRenderingContext;
    public config: Gamesaw;
    public clearColor: Color = new Color(0, 0, 0, 1);
    public canvas: HTMLCanvasElement;

    constructor() {
        if (Surface3d.instance) {
            throw new Error('Error: Instantiation failed, Use Surface3d.getInstance() instead of new.');
        }

        Surface3d.instance = this;
        this.config = Gamesaw.getInstance();
    }

    public static getInstance(): Surface3d {
        return Surface3d.instance;
    }

    public createCanvas(): void {
        let container = document.getElementById(this.config.getContainerId());

        this.canvas = document.createElement('canvas');

        if (this.config.doScale()) {
            this.canvas.setAttribute('width', String(this.config.getRenderResolutionWidth()));
            this.canvas.setAttribute('height', String(this.config.getRenderResolutionHeight()));
        } else {
            this.canvas.setAttribute('width', String(this.config.getResolutionWidth()));
            this.canvas.setAttribute('height', String(this.config.getResolutionHeight()));
        }

        container.appendChild(this.canvas);
    };

    public init(): void {
        this.createCanvas();
        this.gl = this.getContext();

        let colorFloats = this.clearColor.getRGBAFloat();
        this.gl.clearColor(colorFloats[0], colorFloats[1], colorFloats[2], colorFloats[3]);
    }

    public clear(color?: Color): void {
        let gl = this.gl;
        if (color) {
            this.clearColor = color;
            let colorFloats = this.clearColor.getRGBAFloat();
            gl.clearColor(colorFloats[0], colorFloats[1], colorFloats[2], colorFloats[3]);
        }

        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        gl.enable(gl.BLEND);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    }

    public getContext(): WebGLRenderingContext {
        return this.canvas.getContext('webgl', { preserveDrawingBuffer: true }) ||
            this.canvas.getContext('experimental-webgl', { preserveDrawingBuffer: true });
    }

    public resize(): void {
        let gl = this.getContext();

        if (this.config.doScale()) {
            this.canvas.setAttribute('width', String(this.config.getRenderResolutionWidth()));
            this.canvas.setAttribute('height', String(this.config.getRenderResolutionHeight()));

            gl.viewport(0, 0, this.config.getRenderResolutionWidth(), this.config.getRenderResolutionHeight());
        } else {
            this.canvas.setAttribute('width', String(this.config.getResolutionWidth()));
            this.canvas.setAttribute('height', String(this.config.getResolutionHeight()));

            gl.viewport(0, 0, this.config.getResolutionWidth(), this.config.getResolutionHeight());
        }
    }

    public toDataUrl(): string {
        return this.canvas.toDataURL('image/png');
    }

    public toDataBlob(callback: Function): void {
        this.canvas.toBlob(() => callback, 'image/png');
    }
}
