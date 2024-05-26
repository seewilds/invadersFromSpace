import type { Position, RenderOptions, Sprite } from "./types.js";
import { Pixel } from "./pixel.js";
import { spriteFactory } from "./factories.js";
import { Shot } from "./sprites.js";

class Laser {
  context: CanvasRenderingContext2D;
  pixels: Pixel[];
  sprite: Sprite;
  deltaY: number;
  pixelMovementPerSecond: number;
  position: PositionOptions;
  direction: number;
  colour: string;

  constructor(context: CanvasRenderingContext2D, renderOptions: RenderOptions, position: Position, direction: number,  colour: string = "rgb(248, 102, 36)") {
    this.context = context;
    this.sprite = Shot;
    this.direction = direction;
    this.pixelMovementPerSecond = 300;
    this.colour = colour;
    this.pixels = spriteFactory(this.sprite.rows, this.sprite.cols, renderOptions.scale, position.x, position.y, this.sprite.pixels, this.colour);
  }

  update(secondsElapsed: number): void {
    this.clear();
    let change = this.direction * Math.floor(this.pixelMovementPerSecond * secondsElapsed)
    this.pixels.forEach((pixel, index) => {
      pixel.Update(this.context, pixel.x, pixel.y += change, this.colour);
    });
  }

  clear(): void {
    this.pixels.forEach(pixel => {
      pixel.Update(this.context, pixel.x, pixel.y, "black");
    });
  }
}

export {Laser}