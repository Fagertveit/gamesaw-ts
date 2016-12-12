interface Button {
    pressed: boolean;
    value: number;
}

export class Controller {
    private static instance: Controller = new Controller();
    public buttons: Button[];
    public axes: number[];
    public id: string;
    public index: number = 0;
    public mapping: string;
    public connected: boolean = false;

    constructor() {
        let _this = this;
        if (Controller.instance) {
            throw new Error('Error: Instantiation failed, Use Mouse.getInstance() instead of new.');
        }

        Controller.instance = this;

        let gamepads = navigator.getGamepads();
        if (gamepads[0] && gamepads[0].connected) {
            this.connected = true;
        }

        window.addEventListener('gamepadconnected', (event: GamepadEvent) => {
            console.log('Connecting gamepad ' + event.gamepad.id);
            _this.setupController(event);
        });
    }

    public static getInstance(): Controller {
        return Controller.instance;
    }

    public setupController(controller: GamepadEvent) {
        this.buttons = controller.gamepad.buttons;
        this.axes = controller.gamepad.axes;
        this.id = controller.gamepad.id;
        this.index = controller.gamepad.index;
        this.mapping = controller.gamepad.mapping;
        this.connected = controller.gamepad.connected;
    }

    public update(delta: number) {
        let gamepad: Gamepad = navigator.getGamepads()[this.index];

        this.buttons = gamepad.buttons;
        this.axes = gamepad.axes;
    }
}
