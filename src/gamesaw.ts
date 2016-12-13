export class Gamesaw {
    private static instance: Gamesaw = new Gamesaw();
    public containerId: string = 'gamesaw-container';
    public width: number = 640;
    public height: number = 480;
    public renderWidth: number;
    public renderHeight: number;
    public widthRatio: number;
    public heightRatio: number;
    public fboTextureSize: number = 1024;

    constructor() {
        if (Gamesaw.instance) {
            throw new Error('Error: Instantiation failed, Use Gamesaw.getInstance() instead of new.');
        }

        Gamesaw.instance = this;
    }

    public static getInstance(): Gamesaw {
        return Gamesaw.instance;
    }

    public setContainerId(id: string): void {
        this.containerId = id;
    }

    public getContainerId(): string {
        return this.containerId;
    }

    public setRenderResolution(width: number, height: number): void {
        this.renderWidth = width;
        this.renderHeight = height;

        this.widthRatio = this.width / this.renderWidth;
        this.heightRatio = this.height / this.renderHeight;

        // We need to calculate the rendersize of the fbo, it needs to be power of 2
        let measurableSize: number = Math.max(this.renderWidth, this.renderHeight);

        if (measurableSize < 512) {
            this.fboTextureSize = 512;
        } else if (measurableSize < 1024) {
            this.fboTextureSize = 1024;
        } else if (measurableSize < 2048) {
            this.fboTextureSize = 2048;
        }
    }

    public getRenderResolution(): number[] {
        return [this.renderWidth, this.renderHeight];
    }

    public getRenderResolutionWidth(): number {
        return this.renderWidth;
    }

    public getRenderResolutionHeight(): number {
        return this.renderHeight;
    }

    public getFboTextureSize(): number {
        return this.fboTextureSize;
    }

    public getWidthRatio(): number {
        return this.widthRatio;
    }

    public getHeightRatio(): number {
        return this.heightRatio;
    }

    public doScale(): boolean {
        if (this.renderWidth === undefined && this.renderHeight === undefined) {
            return false;
        }

        return true;
    }

    public setResolution(width: number, height: number): void {
        this.width = width;
        this.height = height;
    }

    public getResolution(): number[] {
        return [this.width, this.height];
    }

    public getResolutionWidth(): number {
        return this.width;
    }

    public getResolutionHeight(): number {
        return this.height;
    }
}
