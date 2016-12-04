import { Node } from './node';
import { Connection } from './connection';

export class NodeRecord {
    public node: Node;
    public connection: Connection;
    public currentCost: number = 0;
    public estimatedCost: number = 0;

    constructor() {
        this.currentCost = 0;
        this.estimatedCost = 0;
    }

    public setNode(node: Node): void {
        this.node = node;
    }

    public getNode(): Node {
        return this.node;
    }

    public setConnection(connection: Connection): void {
        this.connection = connection;
    }

    public getConnection(): Connection {
        return this.connection;
    }

    public setCurrentCost(cost: number): void {
        this.currentCost = cost;
    }

    public getCurrentCost(): number {
        return this.currentCost;
    }

    public setEstimatedCost(estimatedCost: number): void {
        this.estimatedCost = estimatedCost;
    }

    public getEstimatedCost(): number {
        return this.estimatedCost;
    }
}
