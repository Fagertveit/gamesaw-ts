import { Node } from './node';
import { Connection } from './connection';

export class Graph {
    public nodes: Node[][];

    constructor(nodes: Node[][]) {
        if (nodes) {
            this.nodes = nodes;
        }
    }

    public setNodes(nodes: Node[][]): void {
        this.nodes = nodes;
    }

    public isValidNode(x: number, y: number): boolean {
        if ( x < 0 || y < 0 || y >= this.nodes.length || x >= this.nodes[0].length) {
            return false;
        } else if (this.nodes[y][x].getBlocked()) {
            return false;
        }

        return true;
    }

    public getNode(node: Node): Node {
        return this.nodes[node.y][node.x];
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
                    tempConnection.setDstNode(this.nodes[srcNode.y + j][srcNode.x + i]);
                    tempConnection.setCost(1);

                    connections.push(tempConnection);
                }
            }
        }

        return connections;
    }
}
