import { Particle } from './particle';
import { ParticleRenderer } from './particle-renderer';
import { Point } from '../../geometry/index';
import { Texture } from '../texture';
import { Color } from '../../graphics/color';
import { Http } from '../../utility/http';

interface AJAXResponse {
    responseText?: string;
}

export class ParticleEmitter {
    public gl: WebGLRenderingContext;
    public renderer: ParticleRenderer;
    public particles: Particle[] = [];
    public vertices: number[] = [];
    public sizes: number[] = [];
    public currentLife: number;

    public texture: Texture;
    public pos: Point;
    public maxDir: Point;
    public minDir: Point;
    public maxVel: number;
    public minVel: number;
    public maxSize: number;
    public minSize: number;
    public constant: boolean = false;
    public growth: number;
    public color: Color = new Color(240, 175, 25, 0.4);
    public angularVel: number;
    public gravity: number;
    public wind: number;
    public maxLife: number;
    public minLife: number;
    public particlesPerSecond: number;
    public particlesAtStart: number;
    public lifeCycle: number;

    public blendSrc: number;
    public blendDst: number;

    private http: Http;

    constructor(gl: WebGLRenderingContext) {
        this.gl = gl;
        this.blendSrc = gl.SRC_ALPHA;
        this.blendDst = gl.ONE;

        this.http = new Http(false);
    }

    public setup(texture: Texture, position: Point, maxDirection: Point, minDirection: Point, maxVelocity: number, minVelocity: number,
        maxSize: number, minSize: number, maxLife: number, minLife: number, growth: number, gravity: number, wind: number,
        angularVelocity: number, lifeCycle: number, particlesPerSecond: number, particlesAtStart: number, constant: boolean, color: Color): void {
        this.texture = texture;
        this.pos = position;
        this.maxDir = maxDirection;
        this.minDir = minDirection;
        this.maxVel = maxVelocity;
        this.minVel = minVelocity;
        this.maxSize = maxSize;
        this.minSize = minSize;
        this.maxLife = maxLife;
        this.minLife = minLife;
        this.growth = growth;
        this.gravity = gravity;
        this.wind = wind;
        this.angularVel = angularVelocity;
        this.lifeCycle = lifeCycle;
        this.particlesPerSecond = particlesPerSecond;
        this.particlesAtStart = particlesAtStart;
        this.constant = constant;
        this.color = color;
    }

    public load(url: string) {
        this.http.get(url, (data: AJAXResponse) => {
            let emitter = JSON.parse(data.responseText);
        });
    }

    public toJson(): string {
        return '';
    }

    public update(delta: number): void {
        this.vertices = [];
        this.sizes = [];

        if (this.constant) {
            let numParticles = Math.ceil((delta / 1000) * this.particlesPerSecond);

            for (let i = 0; i < numParticles; i += 1) {
                this.particles.push(this.addParticle());
            }
        } else {
            this.currentLife -= delta;

            if (this.currentLife < 0) {
                for (let i = 0; i < this.particlesAtStart; i += 1) {
                    this.particles.push(this.addParticle());
                }

                this.currentLife = this.lifeCycle;
            }
        }

        let length = this.particles.length;

        for (let i = 0; i < length; i += 1) {
            this.particles[i].update(this.gravity, this.wind, this.growth, delta);

            if (this.particles[i].isDead()) {
                this.particles.splice(i, 1);
                length -= 1;
            } else {
                this.vertices.push(this.particles[i].pos.x);
                this.vertices.push(this.particles[i].pos.y);
                this.sizes.push(this.particles[i].size);
            }
        }
    }

    public addParticle(): Particle {
        return new Particle(new Point(this.pos.x, this.pos.y),
            new Point(this.randomMinMax(this.minDir.x, this.maxDir.x), this.randomMinMax(this.minDir.y, this.maxDir.y)),
            this.randomMinMax(this.minSize, this.maxSize),
            this.randomMinMax(this.minVel, this.maxVel),
            this.randomMinMax(this.minLife, this.maxLife),
            this.color.getAlpha());
    }

    public randomMinMax(min: number, max: number): number {
        return (Math.random() * (max - min)) + min;
    }
}
