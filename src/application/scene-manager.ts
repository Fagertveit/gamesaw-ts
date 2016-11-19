import { Scene } from './scene';

interface SceneList {
    [index: string]: Scene;
}

export class SceneManager {
    public scenes: SceneList = {};
    public activeScene: string;

    constructor() { }

    public update(delta: number): void {
        this.scenes[this.activeScene].update(delta);
        this.scenes[this.activeScene].render(delta);
    }

    public addScene(id: string): void {
        this.scenes[id] = new Scene();
    }

    public removeScene(id: string): void {
        delete this.scenes[id];
    }

    public getScene(id: string): Scene {
        return this.scenes[id];
    }

    public setActiveScene(id: string): void {
        if (this.scenes[id] === undefined) {
            throw new Error('Scene with id: ' + id + ' is undefined.');
        }

        this.activeScene = id;
    }
}
