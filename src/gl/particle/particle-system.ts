import { ParticleEmitter } from './particle-emitter';

export class ParticleSystem {
    public emitters: ParticleEmitter[] = [];

    constructor() { }

    public addEmitter(emitter: ParticleEmitter): void {
        this.emitters.push(emitter);
    }

    public removeEmitter(index: number): void {
        if (this.emitters[index]) {
            this.emitters.splice(index, 1);
        }
    }

    public update(delta: number): void {
        for (let emitter of this.emitters) {
            emitter.update(delta);
        }
    }
}
