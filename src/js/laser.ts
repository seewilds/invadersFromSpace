import { Position, RenderOptions, Sprite } from "./types.ts"
import { Pixel } from "./pixel.ts";
import { spriteFactory } from "./factories.ts";
import { Shot } from "./sprites.ts";

class Laser {
  context: CanvasRenderingContext2D;
  pixels: Pixel[];
  sprite: Sprite;
  deltaY: number;
  position: PositionOptions;
  direction: number;
  lastUpdate: number;
  colour: string;

  constructor(context: CanvasRenderingContext2D, renderOptions: RenderOptions, position: Position, direction: number,  colour: string = "rgb(248, 102, 36)") {
    this.context = context;
    this.sprite = Shot;
    this.deltaY = 10 / (renderOptions.targetFramesPerSecond / 30) * direction;
    this.direction = 0;
    this.lastUpdate = performance.now();
    this.colour = colour;
    this.pixels = spriteFactory(this.sprite.rows, this.sprite.cols, renderOptions.scale, position.x, position.y, this.sprite.pixels, this.colour);
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