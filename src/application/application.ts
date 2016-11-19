import { SceneManager } from './scene-manager';

export class Application {
    public sceneManager = new SceneManager();
    public active: boolean = true;
    public applicationTimer: number;
    public targetFps: number = 30;
    public delta: number;
    public lastDelta: number;
    public lastUpdate: number;
    public fps: number;
    public frames: number;

    constructor() { }

    public init(): void {
        this.lastDelta = new Date().getTime();

        this.start();
    }

    public start(): void {
        this.applicationTimer = window.setInterval(() => {
            this.update();
        }, (1000 / this.targetFps));
    }

    public stop(): void {
        window.clearInterval(this.applicationTimer);
    }

    public step(): void {
        this.update();
    }

    public update(): void {
        let now = new Date().getTime();
        let delta = now - this.lastDelta;
        this.lastDelta = now;

        if (now - this.lastUpdate > 1000) {
            this.fps = this.frames;
            this.frames = 0;
            this.lastUpdate = now;
        } else {
            this.frames += 1;
        }
    }
}
