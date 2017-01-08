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
        this.life = life;
        this.alpha = alpha;
    }

    public update(gravity: number, wind: number, growth: number, delta: number): void {
        let lowDelta = delta / 10;
        this.life -= delta;
        this.size += growth * lowDelta;
        this.dir.y += gravity * lowDelta;
        this.dir.x += wind * lowDelta;
        this.pos.x += (this.dir.x * this.vel * lowDelta);
        this.pos.y += (this.dir.y * this.vel * lowDelta);
    }

    public isDead(): boolean {
        return this.life < 0;
    }
}
