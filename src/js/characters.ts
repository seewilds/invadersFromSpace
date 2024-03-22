import { Zero, One, Two, Three, Four, Five, Six, Seven, Eight, Nine, A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P, Q, R, S, T, U, V, W, X, Y, Z, SPACE } from "./sprites";
import { Sprite, Character } from "./types"
import { Pixel } from "./pixel";
import { spriteFactory } from "./factories";

const ascii: Character = {
    "0" : Zero,
    "1" : One,
    "2" : Two,
    "3" : Three,
    "4" : Four,
    "5" : Five,
    "6" : Six,
    "7" : Seven, 
    "8" : Eight, 
    "9" : Nine,
    "A" : A,
    "B" : B,
    "C" : C,
    "D" : D,
    "E" : E, 
    "F" : F, 
    "G" : G,
    "H" : H,
    "I" : I,
    "J" : J,
    "K" : K,
    "L" : L,
    "M" : M, 
    "N" : N,
    "P" : P, 
    "O" : O,
    "Q" : Q,
    "R" : R,
    "S" : S,
    "T" : T,
    "U" : U,
    "V" : V,
    "W" : W,
    "X" : X,
    "Y" : Y,
    "Z" : Z,
    " " : SPACE
}


class Text {
    context: CanvasRenderingContext2D;
    text: string;
    pixels: Pixel[][];
    explosion: Sprite;
    colour: string;
    direction: number;
    pixelsPerPixel: number;
    x: number;
    y: number;
    updateInterval: number;
    lastUpdate: number;
    constructor(text: string, colour: string, pixelsPerPixel: number, x: number, y: number, context: CanvasRenderingContext2D) {
        this.context = context;
        this.text = text;
        this.colour = colour;
        this.pixelsPerPixel = pixelsPerPixel;
        this.x = x;
        this.y = y;
        this.updateInterval = 200;
        this.lastUpdate = performance.now();
        this.pixels = textFactory(this.text, this.x, this.y, this.pixelsPerPixel, this.colour);
    }

    getWidth() {
        return 7 * this.pixelsPerPixel;
    }

    Clear() {       
        this.pixels.forEach(pixels => {
            pixels.forEach(pixel => pixel.Update(this.context, pixel.x, pixel.y, "black"));
        });
    }

    Update(deltaX: number, deltaY: number) {
        this.Clear();
        this.pixels = textFactory(this.text, this.x, this.y += deltaY, this.pixelsPerPixel, this.colour);
        this.pixels.forEach(pixels => {
            pixels.forEach(pixel => pixel.Update(this.context, pixel.x, pixel.y));
        });
    }
}



function textFactory(text : string, xStart : number, yStart : number, pixelsPerPixel : number, colour : string) : Pixel[][] {
    let lettersArray = text.split('').map(char => ascii[char]);
    console.log(lettersArray)
    let letters : Pixel[][] = Array(lettersArray.length);
    for(let i = 0; i < lettersArray.length; i++) {
        letters[i] = spriteFactory(8, 7, pixelsPerPixel, xStart + i * 6 * pixelsPerPixel, yStart, lettersArray[i].pixels, colour) ;
    }
    return letters;
}

export { ascii, textFactory as printText, Text }