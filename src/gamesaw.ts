export class Gamesaw {
    private static instance: Gamesaw = new Gamesaw();
    public containerId: string = 'gamesaw-container';
    public width: number = 640;
    public height: number = 480;
    public renderWidth: number;
    public renderHeight: number;

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
