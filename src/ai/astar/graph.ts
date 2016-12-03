import { Node } from './node';
import { Connection } from './connection';

export class Graph {
    public nodes: Node[] = [];

    constructor(nodes: Node[]) {
        if (nodes) {
            this.nodes = nodes;
        }
    }

    public setNodes(nodes: Node[]): void {
        this.nodes = nodes;
    }

    public isValidNode(x: number, y: number): boolean {
        return true;
    }

    public getNode(node: Node): Node {
        for (let i = 0; i < this.nodes.length; i += 1) {
            if (this.nodes[i].x === node.x && this.nodes[i].y === node.y) {
                return this.nodes[i];
            }
        }
    }

    public getConnections(srcNode: Node): Connection[] {
        let connections: Connection[] = [];
        let tempConnection: Connection;

        // TODO: Need to rewrite this to handle the 1D tilemap structure of tiled format.
        for (let i = -1; i < 2; i += 1) {
            for (let j = -1; j < 2; j += 1) {
                if (i === 0 && j === 0) {
                    continue;
                } else if (this.isValidNode(srcNode.x + i, srcNode.y + j)) {
                    tempConnection = new Connection();

                    tempConnection.setSrcNode(srcNode);
                    tempConnection.setDstNode(this.nodes[srcNode.x + i]);
                    tempConnection.setCost(1);

                    connections.push(tempConnection);
                }
            }
        }

        return connections;
    }
}
