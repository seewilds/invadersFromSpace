import { ascii } from "./characters";
import { Pixel } from "./pixel";
import { characterConstants } from "./sprites";
import { Sprite } from "./types";


function spriteFactory(height: number, width: number, pixelsPerPixel: number, xStart: number, yStart: number, activePixels: number[], colour: string): Pixel[] {
  let spriteArray : Pixel[] = new Array(activePixels.length);
  let activePixelsSet = 0;
  let loopNumber = 0;
  for (let i = 0; i < height; i++) {
    for (let j = 0; j < width; j++) {
      if (activePixels.includes(loopNumber)) {
        spriteArray[activePixelsSet] = new Pixel(pixelsPerPixel, pixelsPerPixel, xStart + j * pixelsPerPixel, yStart + pixelsPerPixel * i, colour);
        activePixelsSet++;
      }
      loopNumber++;
    }
  }
  return spriteArray;
}

function textFactory(text : string, xStart : number, yStart : number, pixelsPerPixel : number, colour : string, spacingOverride: number = characterConstants.cols) : Pixel[][] {
  let lettersArray: Sprite[] = text.split('').map(char => ascii[char]);
  let letters : Pixel[][] = Array(lettersArray.length);
  for(let i = 0; i < lettersArray.length; i++) {
      letters[i] = spriteFactory(characterConstants.rows, characterConstants.cols, pixelsPerPixel, xStart + i * pixelsPerPixel * spacingOverride, yStart, lettersArray[i].pixels, colour) ;
  }
  return letters;
}

export {spriteFactory, textFactory}