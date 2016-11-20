export class Sprite {
    public image: HTMLImageElement;
    public url: string;
    public width: number;
    public height: number;
    public loaded: boolean = false;

    constructor(url: string) {
        if (url) {
            this.url = url;
            this.load(this.url);
        }
    }

    public load(url: string) {
        let _this = this;
        this.image = new Image();
        this.image.src = url;

        this.image.addEventListener('load', (event) => {
            _this.loadHandler(event);
        });
        this.image.addEventListener('error', _this.errorHandler);
    }

    public render(context: CanvasRenderingContext2D, x: number, y: number): void {
        context.drawImage(this.image, x, y);
    }

    public renderSize(context: CanvasRenderingContext2D, x: number, y: number, width: number, height: number): void {
        context.drawImage(this.image, x, y, width, height);
    }

    public renderSegment(context: CanvasRenderingContext2D, x: number, y: number,
        segmentX: number, segmentY: number, segmentWidth: number, segmentHeight: number): void {
        context.drawImage(this.image, segmentX, segmentY, segmentWidth, segmentHeight,
            x, y, this.width, this.height);
    }

    public renderSegmentSize(context: CanvasRenderingContext2D, x: number, y: number, width: number, height: number,
        segmentX: number, segmentY: number, segmentWidth: number, segmentHeight: number): void {
        context.drawImage(this.image, segmentX, segmentY, segmentWidth, segmentHeight,
            x, y, width, height);
    }

    private errorHandler(event: Event): void {
        throw new Error('Failed to load sprite.');
    }

    private loadHandler(event: Event): void {
        this.loaded = true;
        this.width = this.image.width;
        this.height = this.image.height;
    }
}
