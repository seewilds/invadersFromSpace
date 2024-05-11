import { Sprite } from "./types.ts"
import { Pixel } from "./pixel.ts";
import { spriteFactory } from "./factories.ts";
import { Laser } from "./laser.ts";
import { ShieldSprite } from "./sprites.ts";

class Shield {
  context: CanvasRenderingContext2D;
  hits: number[];
  pixels: Pixel[];
  sprite: Sprite;
  key: boolean;
  deltaX: number;
  scale: number;
  x: number;
  y: number;
  x0: number;
  y0: number;
  constructor(scale: number, x: number, y: number, context: CanvasRenderingContext2D) {
    this.context = context;
    this.hits = [];
    this.sprite = ShieldSprite;
    this.deltaX = 0;
    this.scale = scale;
    this.x = x;
    this.y = y;
    this.pixels = spriteFactory(this.sprite.rows, this.sprite.cols, this.scale, this.x, this.y, this.sprite.pixels, "#1FFE1F");
    this.x0 = this.pixels[0].x;
    this.y0 = this.pixels[0].y;
  }

  clear(): void {
    this.pixels.forEach(pixel => {
      pixel.Update(this.context, pixel.x, pixel.y, "black");
    });
  }

  hit(laser: Laser): boolean {
    for (let i = 0; i < this.pixels.length; i++) {
      for (let j = 0; j < laser.pixels.length - 1; j++) {
        if (Math.abs(laser.pixels[j].x - this.pixels[i].x) <= 2 && Math.abs(laser.pixels[j].y - this.pixels[i].y) <= 2) {
          this.pixels.splice(i, 1);
          return true;
        }
      }
    }
    return false;
  }

  update(): void {
    this.pixels.forEach(pixel => {
      pixel.Update(this.context, pixel.x, pixel.y);
    });
  }
}

export { Shield }