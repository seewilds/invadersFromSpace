import { ascii } from "./characters.js";
import { Pixel } from "./pixel.js";
import { characterConstants } from "./sprites.js";
import type { Sprite } from "./types.js";

function spriteFactory(
  rows: number,
  columns: number,
  scale: number,
  xStart: number,
  yStart: number,
  pixels: number[],
  colour: string,
): Pixel[] {
  let pixelArrays: Pixel[] = new Array(pixels.length);
  let pixelIndex = 0;
  let cell = 0;
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < columns; j++) {
      if (pixels.includes(cell)) {
        pixelArrays[pixelIndex] = new Pixel(
          scale,
          scale,
          xStart + scale * j,
          yStart + scale * i,
          colour,
        );
        pixelIndex++;
      }
      cell++;
    }
  }
  return pixelArrays;
}

function textFactory(
  text: string,
  xStart: number,
  yStart: number,
  scale: number,
  colour: string,
  spacingOverride: number = characterConstants.cols,
): Pixel[][] {
  let lettersArray: Sprite[] = text.split("").map((char) => ascii[char]);
  let letters: Pixel[][] = Array.from({ length: lettersArray.length }, () => []);
  for (let i = 0; i < lettersArray.length; i++) {
    letters[i] = spriteFactory(
      characterConstants.rows,
      characterConstants.cols,
      scale,
      xStart + i * scale * spacingOverride,
      yStart,
      lettersArray[i].pixels,
      colour,
    );
  }
  return letters;
}

export { spriteFactory, textFactory };
