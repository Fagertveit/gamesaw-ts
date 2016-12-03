import { ResourceManager } from '../utility/resource-manager';

export class Texture {
    private gl: WebGLRenderingContext;
    private resourceManager: ResourceManager;
    public image: HTMLImageElement;
    public url: string;
    public width: number;
    public height: number;
    public texture: WebGLTexture;
    public loaded: boolean = false;
    public ready: boolean = false;

    constructor(gl: WebGLRenderingContext, url?: string, resourceManager?: ResourceManager) {
        this.gl = gl;

        if (resourceManager) {
            this.resourceManager = resourceManager;
        }

        if (url) {
            this.url;
            this.load(url);
        }
    }

    public load(url: string) {
        let _this = this;
        let gl = this.gl;

        if (this.resourceManager) {
            this.resourceManager.addImage();
        }

        this.image = new Image();
        this.image.src = url;
        this.texture = gl.createTexture();

        this.image.addEventListener('load', (event) => {
            _this.loadHandler(event);
        });
        this.image.addEventListener('error', _this.errorHandler);
    }

    private init(): void {
        let gl = this.gl;

        gl.bindTexture(gl.TEXTURE_2D, this.texture);

        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this.image);

        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

        gl.bindTexture(gl.TEXTURE_2D, null);

        this.ready = true;
    }

    private errorHandler(event: Event): void {
        if (this.resourceManager) {
            this.resourceManager.imageFailed();
        }

        throw new Error('Failed to load sprite.');
    }

    private loadHandler(event: Event): void {
        this.loaded = true;
        this.width = this.image.width;
        this.height = this.image.height;

        if (this.resourceManager) {
            this.resourceManager.imageReady();
        }

        this.init();
    }
}
