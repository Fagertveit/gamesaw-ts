export enum Key {
    'BACKSPACE' = 8, 'TAB' = 9, 'ENTER' = 13, 'SHIFT' = 16, 'CTRL' = 17,
    'ALT' = 18, 'PAUSE' = 19, 'CAPS' = 20, 'ESCAPE' = 27, 'PAGEUP' = 33,
    'PAGEDOWN' = 34, 'END' = 35, 'HOME' = 36,
    'LEFT' = 37, 'UP' = 38, 'RIGHT' = 39, 'DOWN' = 40, 'INSERT' = 45, 'DELETE' = 46,
    'ZERO' = 48, 'ONE' = 49, 'TWO' = 50, 'THREE' = 51, 'FOUR' = 52, 'FIVE' = 53, 'SIX' = 54,
    'SEVEN' = 55, 'EIGHT' = 56, 'NINE' = 57,
    'A' = 65, 'B' = 66, 'C' = 67, 'D' = 68, 'E' = 69, 'F' = 70, 'G' = 71,
    'H' = 72, 'I' = 73, 'J' = 74, 'K' = 75, 'L' = 76, 'M' = 77, 'N' = 78,
    'O' = 79, 'P' = 80, 'Q' = 81, 'R' = 82, 'S' = 83, 'T' = 84, 'U' = 85,
    'V' = 86, 'W' = 87, 'Y' = 88, 'X' = 89, 'Z' = 90,
    'LEFTSUPER' = 91, 'RIGHTSUPER' = 92, 'SELECT' = 93,
    'NUM0' = 96, 'NUM1' = 97, 'NUM2' = 98, 'NUM3' = 99, 'NUM4' = 100,
    'NUM5' = 101, 'NUM6' = 102, 'NUM7' = 103, 'NUM8' = 104, 'NUM9' = 105,
    'MULTIPLY' = 106, 'ADD' = 107, 'SUBSTRACT' = 108, 'DECIMAL' = 110,
    'DIVIDE' = 111, 'F1' = 112, 'F2' = 113, 'F3' = 114, 'F4' = 115, 'F5' = 116,
    'F7' = 118, 'F8' = 119, 'F9' = 120, 'F10' = 121, 'F11' = 122, 'F12' = 123,
    'NUMLOCK' = 144, 'SCROLLLOCK' = 145, 'SEMICOLON' = 186, 'EQUAL' = 187,
    'COMMA' = 188, 'DASH' = 189, 'PERIOD' = 190, 'FORWARDSLASH' = 191,
    'GRAVEACCENT' = 192, 'OPENBRACKET' = 219, 'BACKSLASH' = 220, 'CLOSEBRAKET' = 221,
    'SINGLEQUOTE' = 222
};

export class Keyboard {
    public keys: boolean[] = [];
    public preventDefault: boolean = false;
    public stopPropagation: boolean = false;
    public keyLogger: boolean = false;

    constructor() {
        let _this = this;
        for (let i = 0; i < 256; i++) {
            this.keys[i] = false;
        }

        window.addEventListener('keydown', (event) => {
            _this.handleKeydown(event);
        });

        window.addEventListener('keyup', (event) => {
            _this.handleKeyup(event);
        });
    }

    public clearKeys(): void {
        for (let key in this.keys) {
            this.keys[key] = false;
        }
    }

    private handleKeydown(event: KeyboardEvent) {
        if (this.preventDefault) {
            event.preventDefault();
        }

        if (this.stopPropagation) {
            event.stopPropagation();
        }

        this.keys[event.keyCode] = true;
    }

    private handleKeyup(event: KeyboardEvent) {
        if (this.preventDefault) {
            event.preventDefault();
        }

        if (this.stopPropagation) {
            event.stopPropagation();
        }

        this.keys[event.keyCode] = false;
    }
}
