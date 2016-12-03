export class Node {
    public x: number;
    public y: number;
    public blocked: boolean = false;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    public setBlocked(blocked: boolean): void {
        this.blocked = blocked;
    }

    public getBlocked(): boolean {
        return this.blocked;
    }
}
