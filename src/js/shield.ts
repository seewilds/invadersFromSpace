import type { Position, RenderOptions, Sprite } from "./types.js";
import { Pixel } from "./pixel.js";
import { spriteFactory } from "./factories.js";
import { Laser } from "./laser.js";
import { ShieldSprite } from "./sprites.js";

class Shield {
  context: CanvasRenderingContext2D;
  pixels: Pixel[];
  sprite: Sprite;
  pixelIndices: number[];
  renderOptions: RenderOptions;
  damage: number[][];
  scale: number;
  x0: number;
  y0: number;
  constructor(
    context: CanvasRenderingContext2D,
    renderOptions: RenderOptions,
    position: Position,
  ) {
    this.context = context;
    this.renderOptions = renderOptions;
    this.damage = [
      [0, 0],
      [-1, 1],
      [0, 1],
      [-2, 2],
      [0, 2],
      [-1, 3],
      [0, 3],
      [2, 3],
      [-2, 4],
      [-1, 4],
      [0, 4],
      [1, 4],
      [3, 4],
      [-2, 5],
      [-1, 5],
      [0, 5],
      [1, 5],
      [2, 5],
      [-1, 6],
      [0, 6],
      [1, 6],
      [2, 6],
      [3, 6],
      [-2, 7],
      [0, 7],
      [1, 7],
      [2, 7],
      [-1, 8],
      [1, 8]
    ];
    this.x0 = position.x;
    this.y0 = position.y;
    this.sprite = ShieldSprite;
    this.pixelIndices = [...ShieldSprite.pixels];
    this.scale = renderOptions.scale;
    this.pixels = spriteFactory(
      this.sprite.rows,
      this.sprite.cols,
      this.scale,
      this.x0,
      this.y0,
      this.pixelIndices,
      "#1FFE1F",
    );
  }

  clear(): void {
    this.pixels.forEach((pixel) => {
      pixel.Update(this.context, pixel.x, pixel.y, "black");
    });
  }

  hit(laser: Laser): boolean {
    for (let i = 0; i < this.pixels.length - 1; i++) {
      for (let j = 0; j < laser.pixels.length - 1; j++) {
        if (
          Math.abs(laser.pixels[j].x - this.pixels[i].x) < this.renderOptions.scale 
          && Math.abs(laser.pixels[j].y - this.pixels[i].y) < this.renderOptions.scale 
        ) {
          this.explosion(i);
          this.clear();
          this.pixels = spriteFactory(
            this.sprite.rows,
            this.sprite.cols,
            this.scale,
            this.x0,
            this.y0,
            this.pixelIndices,
            "#1FFE1F",
          );
          this.update();
          return true;
        }
      }
    }
    return false;
  }

  explosion(index: number): void {
    let hitIndex = this.pixelIndices[index];
    let pixelsToRemove = this.damage.map((d) =>
      this.damagedPixels(hitIndex, d),
    );
    for (let i = this.pixelIndices.length - 1; i >= 0; i--) {
      for (let j = pixelsToRemove.length - 1; j >= 0; j--){
        if(pixelsToRemove[j] === this.pixelIndices[i]){
          this.pixelIndices.splice(i, 1);
          pixelsToRemove.splice(j, 1);
        }
      }
    }
    if (this.pixelIndices.length <= 40) {
      this.pixelIndices = [];
    }
  }

  damagedPixels(position: number, explosionPoition: number[]): number {
    return (
      position + explosionPoition[0] + this.sprite.cols * explosionPoition[1]
    );
  }

  isActive(): boolean {
    return this.pixels.length > 0;
  }

  update(): void {
    this.pixels.forEach((pixel) => {
      pixel.Update(this.context, pixel.x, pixel.y);
    });
  }
}

export { Shield };
