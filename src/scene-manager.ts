import { Scene } from './scene';
import { Application } from './application';

interface SceneList {
    [index: string]: Scene;
}

export class SceneManager {
    public scenes: SceneList = {};
    public activeScene: string;

    private application: Application;

    constructor(application: Application) {
        this.application = application;
    }

    public update(delta: number): void {
        if (this.activeScene) {
            this.scenes[this.activeScene].update(delta);
            this.scenes[this.activeScene].render(delta);
        }
    }

    public addScene(id: string): Scene {
        if (this.scenes[id] !== undefined) {
            throw new Error('Scene with id: ' + id + ' already exists.');
        }

        this.scenes[id] = new Scene(this.application);

        if (!this.activeScene) {
            this.activeScene = id;
        }

        return this.scenes[id];
    }

    public removeScene(id: string): void {
        delete this.scenes[id];

        if (this.activeScene === id) {
            this.activeScene = this.getFirstScene();
        }
    }

    public getScene(id: string): Scene {
        if (this.scenes[id] === undefined) {
            throw new Error('Scene with id: ' + id + ' is undefined.');
        }

        return this.scenes[id];
    }

    public setActiveScene(id: string): void {
        if (this.scenes[id] === undefined) {
            throw new Error('Scene with id: ' + id + ' is undefined.');
        }

        this.activeScene = id;
    }

    public getFirstScene(): string {
        for (let scene in this.scenes) {
            return scene;
        }
    }
}
