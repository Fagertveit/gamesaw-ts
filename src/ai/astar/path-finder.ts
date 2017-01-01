import { Node } from './node';
import { NodeRecord } from './node-record';
import { NodeList } from './node-list';
import { Heuristic } from './heuristic';
import { Connection } from './connection';
import { Graph } from './graph';
import { TilemapLayer } from '../../gl/tilemap/tilemap-layer';

export class PathFinder {
    public startRecord: NodeRecord;
    public open: NodeList;
    public closed: NodeList;
    public heuristic: Heuristic;
    public graph: Graph;

    constructor() {
        this.startRecord = new NodeRecord();
        this.open = new NodeList();
        this.closed = new NodeList();
    }

    public generatePathData(map: TilemapLayer, closed: number[]) {
        let nodes: Node[][] = [];

        for (let i = 0; i < map.height; i += 1) {
            nodes[i] = [];
            for (let j = 0; j < map.width; j += 1) {
                let blocked = closed.indexOf(map.tiles[(i * map.width) + j]) !== -1;
                nodes[i][j] = new Node(j, i);
                nodes[i][j].setBlocked(blocked);
            }
        }

        this.graph = new Graph(nodes);
    }

    public findPath(startNode: Node, endNode: Node): Node[] {
        let path: Node[] = [];
        let current: NodeRecord;
        let connections: Connection[] = [];
        let end: Node;
        let endNodeCost: number;
        let endNodeRecord: NodeRecord;
        let endNodeHeuristic: number;

        this.startRecord = new NodeRecord();
        this.open = new NodeList();
        this.closed = new NodeList();

        this.heuristic = new Heuristic(endNode);

        if (this.graph.getNode(endNode).blocked) {
            return null;
        }

        this.startRecord.setNode(this.graph.getNode(startNode));
        this.startRecord.setEstimatedCost(this.heuristic.euclideanDistance(this.startRecord.getNode()));

        this.open.add(this.startRecord);

        while (this.open.size() > 0) {
            current = this.open.getSmallest();

            if (current.node.x === endNode.x && current.node.y === endNode.y) {
                break;
            }

            connections = this.graph.getConnections(current.getNode());

            for (let i = 0; i < connections.length; i += 1) {
                end = connections[i].getDstNode();
                endNodeCost = current.getCurrentCost() + connections[i].getCost();

                if (this.closed.contains(end)) {
                    endNodeRecord = this.closed.find(end);

                    if (endNodeRecord.getCurrentCost() <= endNodeCost) {
                        continue;
                    }

                    this.closed.remove(endNodeRecord.getNode());
                    endNodeHeuristic = endNodeRecord.getEstimatedCost() - endNodeRecord.getCurrentCost();
                } else if (this.open.contains(end)) {
                    endNodeRecord = this.open.find(end);

                    if (endNodeRecord.getCurrentCost() <= endNodeCost) {
                        continue;
                    }

                    endNodeHeuristic = endNodeRecord.getEstimatedCost() - endNodeRecord.getCurrentCost();
                } else {
                    endNodeRecord = new NodeRecord();
                    endNodeRecord.setNode(end);

                    endNodeHeuristic = this.heuristic.euclideanDistance(end);
                }

                endNodeRecord.setCurrentCost(endNodeCost);
                endNodeRecord.setConnection(connections[i]);
                endNodeRecord.setEstimatedCost(endNodeCost + endNodeHeuristic);

                if (!this.open.contains(end)) {
                    this.open.add(endNodeRecord);
                }
            }

            this.open.remove(current.getNode());
            this.closed.add(current);
        }

        if (!(current.node.x === endNode.x && current.node.y === endNode.y)) {
            return null;
        } else {
            while (!(current.node.x === startNode.x && current.node.y === startNode.y)) {
                path.push(current.connection.getDstNode());
                current = this.closed.find(current.connection.getSrcNode());
            }
        }

        return path.reverse();
    }
}
