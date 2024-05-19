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
  pix: number[];
  key: boolean;
  deltaX: number;
  scale: number;
  x: number;
  y: number;
  x0: number;
  y0: number;
  damage: number[][];
  constructor(scale: number, x: number, y: number, context: CanvasRenderingContext2D) {
    this.context = context;
    this.hits = [];
    this.damage = [
      [4, 5, 6, 25, 26, 27, 28, 46, 47, 48, 49, 50, 51, 67, 68, 69, 70, 71, 72, 73, 88, 89, 90, 91, 92, 93, 94, 95, 110, 111, 112, 113, 114, 115, 116, 117, 132, 133, 134, 135, 136, 137, 138, 139, 154, 155, 156, 157, 158, 159, 160, 177, 178, 179, 180, 181, 200, 201, 202, 223],
      [15, 16, 17, 37, 38, 39, 40, 58, 59, 60, 61, 62, 63, 80, 81, 82, 83, 84, 85, 86, 102, 103, 104, 105, 106, 107, 108, 109, 124, 125, 126, 127, 128, 129, 130, 131, 146, 147, 148, 149, 150, 151, 152, 153, 169, 170, 171, 172, 173, 174, 175, 192, 193, 194, 195, 196, 215, 216, 217, 238],
      [7, 8, 9, 10, 11, 12, 13, 14, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 93, 94, 95, 96, 97, 98, 99, 100, 101, 102, 103, 115, 116, 117, 118, 119, 120, 121, 122, 123, 124, 125, 137, 138, 139, 140, 141, 142, 143, 144, 145, 146, 147, 160, 161, 162, 163, 164, 165, 166, 167, 168, 183, 184, 185, 186, 187, 188, 189, 206, 207, 208, 209, 210],
      [113, 134, 135, 136, 155, 156, 157, 158, 159, 176, 177, 178, 179, 180, 181, 182, 198, 199, 200, 201, 202, 203, 204, 205, 220, 221, 222, 223, 224, 225, 226, 227, 242, 243, 244, 245, 246, 247, 248, 264, 265, 266, 267, 268, 269, 270, 286, 287, 288, 289, 290, 291, 308, 309, 310, 311, 312, 330, 331, 332, 333, 334],
      [128, 149, 150, 151, 170, 171, 172, 173, 174, 191, 192, 193, 194, 195, 196, 197, 212, 213, 214, 215, 216, 217, 218, 219, 234, 235, 236, 237, 238, 239, 240, 241, 257, 258, 259, 260, 261, 262, 263, 279, 280, 281, 282, 283, 284, 285, 302, 303, 304, 305, 306, 307, 325, 326, 327, 328, 329, 347, 348, 349, 350, 351],
      [98, 99, 119, 120, 121, 122, 140, 141, 142, 143, 144, 145, 161, 162, 163, 164, 165, 166, 167, 168, 182, 183, 184, 185, 186, 187, 188, 189, 190, 191, 203, 204, 205, 206, 207, 208, 209, 210, 211, 212, 213, 214, 226, 227, 228, 229, 230, 231, 232, 233, 234, 235, 249, 250, 251, 252, 253, 254, 255, 256]
    ]
    this.sprite = ShieldSprite;
    this.pix = ShieldSprite.pixels;
    this.deltaX = 0;
    this.scale = scale;
    this.x = x;
    this.y = y;
    this.pixels = spriteFactory(this.sprite.rows, this.sprite.cols, this.scale, this.x, this.y, this.pix, "#1FFE1F");
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
          


          this.explosion(i, laser);
          let firstPixelPosition = this.sprite.pixels[0];
          let x0 = this.pixels[0].x - this.scale * firstPixelPosition;
          let y0 = this.pixels[0].y - this.scale * Math.floor(firstPixelPosition / this.sprite.rows);          
          this.pixels = spriteFactory(this.sprite.rows, this.sprite.cols, this.scale, x0, y0, this.pix, "#1FFE1F");
          //this.pixels.splice(i, 1);
          console.log(this.pix)
          return true;
        }
      }
    }
    return false;
  }

  explosion(index: number, laser: Laser):void{
    if(laser.direction > 0){
      for(let i = 0; i < this.damage.length; i++){
        if(this.damage[i].some(element => element == index)){
          this.removedPixels(i);
          return;
        }
      }
    }else{
      for(let i = this.damage.length - 1; i >= 0; i--){
        if(this.damage[i].some(element => element == index)){
          this.removedPixels(i);
          return;
        }
      }
    }
  }

  removedPixels(index: number): void{
    for(let i = this.pix.length - 1; i >= 0; i--){
      this.damage[index].forEach(element => {
        if(this.pix.some(pixel => pixel === element)){
          this.pix.splice(i, 1);
          console.log('ching')
        }
      });
    }
    this.damage.splice(index, 1);
  }

  update(): void {
    this.pixels.forEach(pixel => {
      pixel.Update(this.context, pixel.x, pixel.y);
    });
  }
}

export { Shield }