import { Node } from './node';
import { NodeRecord } from './node-record';

export class NodeList {
    public list: NodeRecord[] = [];

    constructor() { }

    public add(nodeRecord: NodeRecord): void {
        this.list.push(nodeRecord);
    }

    public get(index: number): NodeRecord {
        return this.list[index];
    }

    public getSmallest(): NodeRecord {
        let smallest: NodeRecord;
        let current: NodeRecord;

        smallest = this.list[0];

        for (let i = 0; i < this.list.length; i += 1) {
            current = this.list[i];

            if (current.getEstimatedCost() < smallest.getEstimatedCost()) {
                smallest = current;
            }
        }

        return smallest;
    }

    public contains(node: Node): boolean {
        let current: Node;

        for (let i = 0; i < this.list.length; i += 1) {
            current = this.list[i].getNode();

            if (current.x === node.x && current.y === node.y) {
                return true;
            }
        }

        return false;
    }

    public find(node: Node): NodeRecord {
        let current: Node;

        for (let i = 0; i < this.list.length; i += 1) {
            current = this.list[i].getNode();

            if (current.x === node.x && current.y === node.y) {
                return this.list[i];
            }
        }
    }

    public remove(node: Node): void {
        let current: Node;

        for (let i = 0; i < this.list.length; i += 1) {
            current = this.list[i].getNode();

            if (current.x === node.x && current.y === node.y) {
                this.list.splice(i, 1);
            }
        }
    }

    public size(): number {
        return this.list.length;
    }
}
