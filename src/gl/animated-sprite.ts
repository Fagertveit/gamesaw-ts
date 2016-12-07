import { Sprite } from './sprite';
import { Renderer2d } from './renderer2d/renderer2d';

export interface Animations {
    [index: string]: AnimatedSprite;
}

export class AnimatedSprite {
    public frames: Sprite[] = [];
    public loop: boolean = false;
    public active: boolean = true;
    public timePerFrame: number = 100;
    public currentFrame: number = 0;
    public currentDelta: number = 0;

    constructor(frames?: Sprite[], loop?: boolean, timePerFrame?: number) {
        if (frames) {
            this.frames = frames;
        }

        if (loop) {
            this.loop = loop;
        }

        if (timePerFrame) {
            this.timePerFrame = timePerFrame;
        }
    }

    public play(): void {
        this.active = true;
    }

    public stop(): void {
        this.active = false;
        this.currentFrame = 0;
        this.currentDelta = 0;
    }

    public pause(): void {
        this.active = false;
    }

    public nextFrame(): void {
        this.currentFrame += 1;

        if (this.currentFrame >= this.frames.length) {
            if (!this.loop) {
                this.active = false;
            }
            this.currentFrame = 0;
        }
    }

    public update(delta: number): void {
        if (this.active) {
            this.currentDelta += delta;

            if (this.currentDelta > this.timePerFrame) {
                this.currentDelta = 0;
                this.nextFrame();
            }
        }
    }

    public render(renderer: Renderer2d, x: number, y: number): void {
        this.frames[this.currentFrame].render(renderer, x, y);
    }

    public renderScale(renderer: Renderer2d, x: number, y: number, scale: number, scaleY?: number): void {
        if (scaleY) {
            this.frames[this.currentFrame].renderScale(renderer, x, y, scale, scaleY);
        } else {
            this.frames[this.currentFrame].renderScale(renderer, x, y, scale);
        }
    }

    public renderAngle(renderer: Renderer2d, x: number, y: number, angle: number): void {
        this.frames[this.currentFrame].renderAngle(renderer, x, y, angle);
    }

    public renderAngleScale(renderer: Renderer2d, x: number, y: number, angle: number, scale: number, scaleY?: number): void {
        if (scaleY) {
            this.frames[this.currentFrame].renderAngleScale(renderer, x, y, angle, scale, scaleY);
        } else {
            this.frames[this.currentFrame].renderAngleScale(renderer, x, y, angle, scale);
        }
    }
}
