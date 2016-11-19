import { Scene } from './scene';

interface SceneList {
    [index: string]: Scene;
}

export class SceneManager {
    public scenes: SceneList = {};
    constructor() { }

    public addScene(id: string): void {
        this.scenes[id] = new Scene();
    }

    public removeScene(id: string): void {
        delete this.scenes[id];
    }

    public getScene(id: string): Scene {
        return this.scenes[id];
    }
}
