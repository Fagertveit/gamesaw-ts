export class ResourceManager {
    private static _instance: ResourceManager = new ResourceManager();

    public imageAssets: number = 0;
    public audioAssets: number = 0;
    public otherAssets: number = 0;

    public loadedImages: number = 0;
    public loadedAudio: number = 0;
    public loadedOther: number = 0;

    public failedImage: number = 0;
    public failedAudio: number = 0;
    public failedOther: number = 0;

    constructor() {
        if (ResourceManager._instance) {
            throw new Error('Error: Instantiation failed, Use ResourceManager.getInstance() instead of new.');
        }

        ResourceManager._instance = this;
    }

    public static getInstance(): ResourceManager {
        return ResourceManager._instance;
    }

    public getPercent(): number {
        return Math.ceil(
            (this.loadedImages + this.loadedAudio + this.loadedOther) /
            (this.imageAssets + this.audioAssets + this.otherAssets));
    }

    public isReady(): boolean {
        return (this.loadedImages + this.loadedAudio + this.loadedOther) ===
            (this.imageAssets + this.audioAssets + this.otherAssets);
    }

    public addImage(): void {
        this.imageAssets += 1;
    }

    public imageReady(): void {
        this.loadedImages += 1;
    }

    public imageFailed(): void {
        this.imageAssets -= 1;
        this.failedImage += 1;
    }

    public addAudio(): void {
        this.audioAssets += 1;
    }

    public audioReady(): void {
        this.loadedAudio += 1;
    }

    public audioFailed(): void {
        this.audioAssets -= 1;
        this.failedAudio += 1;
    }

    public addOther(): void {
        this.otherAssets += 1;
    }

    public otherReady(): void {
        this.loadedOther += 1;
    }

    public otherFailed(): void {
        this.otherAssets -= 1;
        this.failedOther += 1;
    }
}
