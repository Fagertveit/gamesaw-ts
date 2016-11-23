import { Point, Vector2 } from '../../geometry/index';

export class Particle {
    public life: number;
    public size: number;
    public pos: Point;
    public dir: Point;
    public vel: number;
    public alpha: number;

    constructor(position: Point, direction: Point, size: number, velocity: number, life: number, alpha: number) {
        this.pos = position;
        this.dir = direction;
        this.size = size;
        this.vel = velocity;
        this.alpha = alpha;
    }

    public update(gravity: number, wind: number, growth: number, delta: number): void {
        this.life -= delta;
        this.size += growth;
        this.dir.y += gravity;
        this.dir.x += wind;
        this.pos.x += (this.dir.x * this.dir.x);
        this.pos.y += (this.dir.x * this.dir.y);
    }

    public isDead(): boolean {
        return this.life < 0;
    }
}
