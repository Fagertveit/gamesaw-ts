import { Surface2d } from './graphics/surface2d';
import { Surface3d } from './graphics/surface3d';
import { Application } from './application';

interface SurfaceList {
    [index: string]: Surface2d | Surface3d;
}

export class Scene {
    public surfaces: SurfaceList = {};
    public render: (delta: number) => void;
    public update: (delta: number) => void;

    private application: Application;

    constructor(application: Application) {
        this.application = application;
    }

    public add3dSurface(id: string) {
        this.surfaces[id] = new Surface3d(this.application.width, this.application.height, id);
    }

    public add2dSurface(id: string) {
        this.surfaces[id] = new Surface2d(this.application.width, this.application.height, id);
    }

    public getContext(id: string) {
        return this.surfaces[id].getContext();
    }

    public clear(id: string) {
        this.surfaces[id].clear();
    }
}
