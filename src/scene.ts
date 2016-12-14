import { Color } from './graphics/color';
import { Application } from './application';

export class Scene {
    public render: (delta: number) => void;
    public update: (delta: number) => void;

    private application: Application;

    constructor(application: Application) {
        this.application = application;
    }
}
