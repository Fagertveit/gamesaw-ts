import { Sprite } from '../sprite';
import { Renderer2d } from '../renderer2d/renderer2d';
import { Rectangle } from '../../geometry/rectangle';
import { Point } from '../../geometry/point';
import { intersects } from '../../geometry/collision';
import { Mouse } from '../../input/mouse';

export class Button {
    public active: boolean = false;
    public spriteInactive: Sprite;
    public spriteActive: Sprite;
    public collider: Rectangle;
    public callback: () => void;

    constructor(x: number, y: number, width: number, height: number, inactive?: Sprite, active?: Sprite, callback?: () => void) {
        this.collider = new Rectangle(x, y, width, height);

        if (inactive) {
            this.spriteInactive = inactive;
        }

        if (active) {
            this.spriteActive = active;
        }

        if (callback) {
            this.callback = callback;
        }
    }

    public render() {
        if (this.active) {
            this.spriteActive.render(this.collider.pos.x, this.collider.pos.y);
        } else {
            this.spriteInactive.render(this.collider.pos.x, this.collider.pos.y);
        }
    }

    public update() {
        let mouse = Mouse.getInstance();
        let mousePos = new Point(mouse.x, mouse.y);

        if (intersects(mousePos, this.collider)) {
            this.active = true;
            if (mouse.click[0] && this.callback) {
                this.callback();
            }
        } else {
            this.active = false;
        }
    }
}
