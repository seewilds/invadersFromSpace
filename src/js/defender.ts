import { spriteFactory } from "./factories";
import { Laser } from "./battlefield";
import { Pixel } from "./pixel";
import { DefenderSprite, Shot } from "./sprites";
import { Sprite } from "./types";

class Defender {
    context: CanvasRenderingContext2D;
    health: number;
    pixels: Pixel[];
    key: boolean;
    sprite: Sprite;
    x: number;
    y: number;
    deltaX: number;
    scale: number;
    updateInterval: number;
    lastUpdate: number;
    addShots: Function;
    constructor(scale: number, width: number, height: number, addShots: Function, context: CanvasRenderingContext2D) {
      this.context = context;
      this.sprite = DefenderSprite;
      this.deltaX = 0;
      this.scale = scale;
      this.x = width / 2;
      this.y = height - this.sprite.cols * this.scale - 2 * this.scale;
      this.updateInterval = 10;
      this.lastUpdate = performance.now();
      this.pixels = spriteFactory(this.sprite.cols, this.sprite.rows, this.scale, this.x, this.y, this.sprite.pixels, "rgb(204, 218, 209)");
      this.addShots = addShots;
      window.addEventListener('keydown', (event) => this.handleKeyDown(event));
      window.addEventListener('keyup', (event) => this.handleKeyUp(event));
    }
  
    update(timestamp): void {
        if (
            this.pixels.some(pixel => pixel.x <= 10) && this.deltaX < 0
            || this.pixels.some(pixel => pixel.x >= this.context.canvas.width - 10) && this.deltaX > 0
          ) {
            this.deltaX = 0;
          }
          this.context.fillStyle = "black";
          this.context.clearRect(this.pixels[0].x - 6 * this.scale, this.pixels[0].y, 13 * this.scale, 8 * this.scale);
          this.context.fillRect(this.pixels[0].x - 6 * this.scale, this.pixels[0].y, 13 * this.scale, 8 * this.scale);
          this.pixels.forEach(pixel => {
            pixel.Update(this.context, pixel.x += this.deltaX, pixel.y);
          });
    }
  
    handleKeyDown(event: KeyboardEvent): void {
      if (event.key == 'a') {
        this.deltaX = -this.scale - 3;
        return;
      }
      if (event.key == 'd') {
        this.deltaX = this.scale + 3;
        return;
      }
      if (event.key === ' ') {
        this.addShots(new Laser(Shot, this.scale, this.pixels[0].x, this.pixels[0].y - 24, -1, this.context));
      }
    }
  
    handleKeyUp(event: KeyboardEvent): void {
      if (event.key == 'a') {
        this.deltaX = 0;
      }
      if (event.key == 'd') {
        this.deltaX = 0;
      }
    }
  }

export {Defender}