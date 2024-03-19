import { Zero, One, Two, Three, Four, Five, Six, Seven, Eight, Nine, A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P, Q, R, S, T, U, V, W, X, Y, Z } from "./sprites";
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
    "Z" : Z 
}

function printText(text : string, xStart : number, yStart : number, pixelsPerPixel : number, colour : string , context: CanvasRenderingContext2D){
    let lettersArray = text.split('').map(char => ascii[char]);
    let letters = Array(lettersArray.length);
    for(let i = 0; i < lettersArray.length; i++){
        letters[i] = spriteFactory(lettersArray[i].rows, lettersArray[i].cols, pixelsPerPixel, xStart, yStart, lettersArray[i].pixels, colour) 
    }
    letters.forEach((letter, index) => letter.pixels.Update(xStart += index * (letter.rows * pixelsPerPixel), yStart += index * (letter.cols * pixelsPerPixel), context));
}

export { ascii, printText }