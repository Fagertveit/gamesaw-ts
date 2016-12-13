import { Gamesaw } from '../gamesaw';

export class Mouse {
    private static instance: Mouse = new Mouse();
    public config: Gamesaw;
    public x: number;
    public y: number;
    public button: boolean[];
    public click: boolean[];
    public stopPropagation: boolean = false;
    public preventDefault: boolean = false;
    private container: HTMLElement;

    constructor() {
        if (Mouse.instance) {
            throw new Error('Error: Instantiation failed, Use Mouse.getInstance() instead of new.');
        }

        Mouse.instance = this;

        this.button = [false, false, false];
        this.click = [false, false, false];
    }

    public init(): void {
        let _this = this;
        this.config = Gamesaw.getInstance();
        this.container = document.getElementById(this.config.getContainerId());

        this.container.addEventListener('click', (event) => {
            _this.handleClick(event);
        });

        this.container.addEventListener('mousemove', (event) => {
            _this.calculateMousePosition(event);
        });

        this.container.addEventListener('mousedown', (event) => {
            _this.handleMouseDown(event);
        });

        this.container.addEventListener('mouseup', (event) => {
            _this.handleMouseUp(event);
        });
    }

    public static getInstance(): Mouse {
        return Mouse.instance;
    }

    public clearClicks(): void {
        this.click = [false, false, false];
    }

    private handleClick(event: MouseEvent): void {
        if (this.preventDefault) {
            event.preventDefault();
        }

        if (this.stopPropagation) {
            event.stopPropagation();
        }

        this.click[event.button] = true;
    }

    private handleMouseDown(event: MouseEvent): void {
        if (this.preventDefault) {
            event.preventDefault();
        }

        if (this.stopPropagation) {
            event.stopPropagation();
        }

        this.button[event.button] = true;
    }

    private handleMouseUp(event: MouseEvent): void {
        if (this.preventDefault) {
            event.preventDefault();
        }

        if (this.stopPropagation) {
            event.stopPropagation();
        }

        this.button[event.button] = false;
    }

    private calculateMousePosition(event: MouseEvent): void {
        if (event.pageX && event.pageY) {
            this.x = event.pageX;
            this.y = event.pageY;
        } else {
            this.x = event.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
            this.y = event.clientY + document.body.scrollTop + document.documentElement.scrollTop;
        }

        this.x -= this.container.offsetLeft;
        this.y -= this.container.offsetTop;

        if (this.config.doScale()) {
            this.x = Math.floor(this.x * this.config.getWidthRatio());
            this.y = Math.floor(this.y * this.config.getHeightRatio());
        }
    }
}
