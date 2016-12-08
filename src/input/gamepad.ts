export class Controller {
    private static instance: Controller = new Controller();

    constructor() {
        if (Controller.instance) {
            throw new Error('Error: Instantiation failed, Use Mouse.getInstance() instead of new.');
        }

        Controller.instance = this;
    }

    public static getInstance(): Controller {
        return Controller.instance;
    }
}
