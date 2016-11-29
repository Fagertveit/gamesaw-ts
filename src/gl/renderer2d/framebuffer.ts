export class FrameBuffer {
    public gl: WebGLRenderingContext;
    public texture: WebGLTexture;
    public fbo: WebGLFramebuffer;
    public width: number;
    public height: number;

    constructor(gl: WebGLRenderingContext, width: number, height: number) {
        this.gl = gl;
        this.width = width;
        this.height = height;

        this.init();
    }

    public init() {
        let gl = this.gl;
        this.fbo = gl.createFramebuffer();

        if (!this.fbo) {
            throw new Error('Failed to create FBO.');
        }

        this.texture = gl.createTexture();

        if (!this.texture) {
            throw new Error('Failed to create FBO texture.');
        }

        gl.bindTexture(gl.TEXTURE_2D, this.texture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, this.width, this.height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);

        let depthBuffer = gl.createRenderbuffer();
        if (!depthBuffer) {
            throw new Error('Failed to create depth buffer.');
        }

        gl.bindRenderbuffer(gl.RENDERBUFFER, depthBuffer);
        gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, this.width, this.height);

        gl.bindFramebuffer(gl.FRAMEBUFFER, this.fbo);
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.texture, 0);
        gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, depthBuffer);

        let err = gl.checkFramebufferStatus(gl.FRAMEBUFFER);

        if (gl.FRAMEBUFFER_COMPLETE !== err) {
            throw new Error('Framebuffer object is incomplete: ' + err.toString());
        }

        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        gl.bindTexture(gl.TEXTURE_2D, null);
        gl.bindRenderbuffer(gl.RENDERBUFFER, null);
    }
}