import { Node } from './node';

export class Connection {
    public cost: number;
    public srcNode: Node;
    public dstNode: Node;

    constructor(srcNode?: Node, dstNode?: Node) {
        if (srcNode) {
            this.srcNode = srcNode;
        }

        if (dstNode) {
            this.dstNode = dstNode;
        }
    }

    public setCost(cost: number): void {
        this.cost = cost;
    }

    public getCost(): number {
        return this.cost;
    }

    public setSrcNode(srcNode: Node) {
        this.srcNode = srcNode;
    }

    public getSrcNode(): Node {
        return this.srcNode;
    }

    public setDstNode(dstNode: Node) {
        this.dstNode = dstNode;
    }

    public getDstNode(): Node {
        return this.dstNode;
    }
}
