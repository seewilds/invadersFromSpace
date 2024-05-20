import { Position, Sprite } from "./types.ts"
import { Pixel } from "./pixel.ts";
import { Saucer } from "./sprites.ts";
import { spriteFactory } from "./factories.ts";

class Spaceship {
  context: CanvasRenderingContext2D;
  pixels: Pixel[];
  sprite: Sprite;
  colour: string;
  deltaX: number;
  deltaY: number;
  direction: number;
  constructor(context: CanvasRenderingContext2D, renderOptions, position: Position, colour: string) {
    this.context = context;
    this.sprite = Saucer;
    this.colour = colour;
    this.deltaX = 6 / (renderOptions.targetFramesPerSecond / 30);
    this.deltaY = 6 / (renderOptions.targetFramesPerSecond / 30);
    this.direction = 0;
    this.pixels = spriteFactory(this.sprite.rows, this.sprite.cols, renderOptions.scale, position.x, position.y, this.sprite.pixels, this.colour);
  }

  clear(colour: string = "black"): void {
    this.pixels.forEach(pixel => {
      pixel.Update(this.context, pixel.x, pixel.y, colour);
    });
  }

  getPosition() {
    // left, right, top, bottom
    return [this.pixels[40], this.pixels[55], this.pixels[0], this.pixels[62]]
  }

  update(deltaX: number, deltaY: number, colour: string = this.colour): void {
    this.clear();
    this.deltaX = deltaX;
    this.deltaY = deltaY;
    this.colour = colour;
    this.pixels.forEach(pixel => {
      pixel.Update(this.context, pixel.x += this.deltaX, pixel.y += this.deltaY, this.colour);
    });
  }
}

export { Spaceship };