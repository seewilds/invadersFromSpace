import { Sprite } from "./types.ts"
import { Pixel } from "./pixel.ts";
import { spriteFactory } from "./factories.ts";

class Laser {
  context: CanvasRenderingContext2D;
  pixels: Pixel[];
  sprite: Sprite;
  key: boolean;
  deltaY: number;
  scale: number;
  x: number;
  y: number;
  direction: number;
  lastUpdate: number;
  colour: string;
  constructor(sprite: Sprite, scale: number, x: number, y: number, direction: number, context: CanvasRenderingContext2D, colour: string = "rgb(248, 102, 36)") {
    this.context = context;
    this.sprite = sprite;
    this.deltaY = 10 * direction;
    this.scale = scale;
    this.x = x;
    this.y = y;
    this.direction = 0;
    this.lastUpdate = performance.now();
    this.colour = colour;
    this.pixels = spriteFactory(this.sprite.rows, this.sprite.cols, this.scale, this.x, this.y, this.sprite.pixels, this.colour);
  }

  update(): void {
    this.clear();
    this.pixels.forEach((pixel, index) => {
      pixel.Update(this.context, pixel.x, pixel.y += this.deltaY, this.colour);
    });
  }

  clear(): void {
    this.pixels.forEach(pixel => {
      pixel.Update(this.context, pixel.x, pixel.y, "black");
    });
  }
}

export {Laser}