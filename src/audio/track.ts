import { ResourceManager } from '../utility/resource-manager';

export class Track {
    public url: string;
    public track: HTMLAudioElement;
    public length: number;
    public loop: boolean = false;
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
        this.track = new Audio();
        this.track.src = url;

        this.resourceManager.addAudio();

        this.track.addEventListener('load', (event) => {
            _this.loadHandler(event);
        });
        this.track.addEventListener('error', _this.errorHandler);
    }

    public play(): void {
        this.track.play();
    }

    public pause(): void {
        this.track.pause();
    }

    public stop(): void {
        this.track.pause();
        this.track.currentTime = 0;
    }

    public seek(time: number) {
        this.track.currentTime = time;
    }

    public setSpeed(speed: number) {
        this.track.playbackRate = speed;
    }

    public getSpeed(): number {
        return this.track.playbackRate;
    }

    public setLoopable(loop: boolean): void {
        this.loop = loop;
    }

    public loadHandler(event: Event) {
        this.loaded = true;
        this.length = this.track.duration;

        this.resourceManager.audioReady();
    }

    public errorHandler(event: Event) {
        this.resourceManager.audioFailed();

        throw new Error('Failed to load audio resource.');
    }
}
