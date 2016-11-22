export class RenderCall {
    vertices: number[];
    indices: number[];
    uvs: number[];
    index: number;
    numIndices: number;
    texture: WebGLTexture;

    constructor() {
        this.flush();
    }

    public add(renderCall: RenderCall) {
        this.vertices = this.vertices.concat(renderCall.vertices);
        this.uvs = this.uvs.concat(renderCall.uvs);

        renderCall.indices.forEach((i) => {
            this.indices.push(i + this.index);
        });

        this.index += this.findMaxIndex(renderCall.indices);
        this.numIndices += renderCall.numIndices;
    }

    public findMaxIndex(indices: number[]): number {
        let max: number = 0;

        indices.forEach((i) => {
            if (i > max) {
                max = i;
            }
        });

        max += 1;

        return max;
    }

    public flush() {
        this.vertices = [];
        this.indices = [];
        this.uvs = [];
        this.index = 0;
        this.numIndices = 0;
    }

    public setTexture(texture: WebGLTexture) {
        this.texture = texture;
    }
}
