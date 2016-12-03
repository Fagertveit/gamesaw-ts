import { Node } from './node';

export class Heuristic {
    public dstNode: Node;

    constructor(dstNode: Node) {
        this.dstNode = dstNode;
    }

    public euclideanDistance(currentNode: Node): number {
        let dx = currentNode.x - this.dstNode.x;
        let dy = currentNode.y - this.dstNode.y;

        return Math.sqrt((dx * dx) + (dy * dy));
    }

    public manhattanDistance(currentNode: Node): number {
        let dx = Math.abs(this.dstNode.x - currentNode.x);
        let dy = Math.abs(this.dstNode.y - currentNode.y);

        return dx + dy;
    }
}
