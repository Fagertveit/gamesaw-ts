import { ResourceManager } from '../utility/resource-manager';

export class Sample {
    public url: string;
    public sample: HTMLAudioElement;
    public length: number;
    public loaded: boolean = false;
    private resourceManager: ResourceManager;

    constructor(url: string) {
        if (url) {
            this.url = url;
            this.load(url);
        }

        this.resourceManager = ResourceManager.getInstance();
    }

    public load(url: string): void {
        let _this = this;
        this.sample = new Audio();
        this.sample.src = url;

        this.resourceManager.addAudio();

        this.sample.addEventListener('load', (event) => {
            _this.loadHandler(event);
        });
        this.sample.addEventListener('error', _this.errorHandler);
    }

    public play(): void {
        this.sample.currentTime = 0;
        this.sample.play();
    }

    public pause(): void {
        this.sample.pause();
    }

    public stop(): void {
        this.sample.pause();
        this.sample.currentTime = 0;
    }

    public seek(time: number) {
        this.sample.currentTime = time;
    }

    public setSpeed(speed: number) {
        this.sample.playbackRate = speed;
    }

    public getSpeed(): number {
        return this.sample.playbackRate;
    }

    public loadHandler(event: Event) {
        this.loaded = true;
        this.length = this.sample.duration;

        this.resourceManager.audioReady();
    }

    public errorHandler(event: Event) {
        this.resourceManager.audioFailed();

        throw new Error('Failed to load audio resource.');
    }
}
