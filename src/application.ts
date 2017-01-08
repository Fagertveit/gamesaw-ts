import { SceneManager } from './scene-manager';
import { Surface2d } from './graphics/surface2d';
import { Surface3d } from './graphics/surface3d';
import { Gamesaw } from './gamesaw';

export class Application {
    public sceneManager: SceneManager;
    public surface: Surface3d;
    public config: Gamesaw;
    public active: boolean = true;
    public applicationTimer: number;
    public targetFps: number = 30;
    public delta: number = 0;
    public lastDelta: number = 0;
    public lastUpdate: number = 0;
    public fps: number = 0;
    public frames: number = 0;

    constructor(width: number, height: number, targetFps?: number, renderWidth?: number, renderHeight?: number) {
        this.config = Gamesaw.getInstance();
        this.config.setResolution(width, height);

        if (renderWidth && renderHeight) {
            this.config.setRenderResolution(renderWidth, renderHeight);
        }

        if (this.config.renderMode === 'webgl') {
            this.surface = Surface3d.getInstance();
            this.surface.init();
        }

        if (targetFps) {
            this.targetFps = targetFps;
        }

        this.sceneManager = new SceneManager(this);
    }

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

        this.sceneManager.update(delta);
    }

    public setTargetFps(targetFps: number): void {
        this.targetFps = targetFps;

        this.stop();
        this.start();
    }

    public resizeCanvas(width: number, height: number, renderWidth?: number, renderHeight?: number): void {
        this.config.setResolution(width, height);

        if (renderWidth && renderHeight) {
            this.config.setRenderResolution(renderWidth, renderHeight);
        }

        this.surface.resize();
    }
}
