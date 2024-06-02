import { spriteFactory } from "./factories.js";
import { Laser } from "./laser.js";
import { Pixel } from "./pixel.js";
import { DefenderSprite } from "./sprites.js";
import type { Position, RenderOptions, Sprite } from "./types.js";

class Defender {
  context: CanvasRenderingContext2D;
  health: number;
  pixels: Pixel[];
  sprite: Sprite;
  explosion: number[][];
  explosionIndex: number = 0;
  x: number;
  y: number;
  lastX: number;
  lastY: number;
  deltaX: number;
  renderOptions: RenderOptions;
  pixelMovementPerSecond: number;
  colour: string;
  lastUpdate: number;
  shotSound: HTMLAudioElement;
  defenderKilled: HTMLAudioElement;
  addShots: Function;
  spaceDepressed: boolean;
  constructor(
    context: CanvasRenderingContext2D,
    renderOptions: RenderOptions,
    position: Position,
    addShots: Function,
  ) {
    this.context = context;
    this.sprite = DefenderSprite;
    this.explosion = [
      [
        4, 11, 22, 27, 29, 32, 34, 37, 42, 50, 54, 56, 57, 58, 60, 61, 62, 65,
        70, 71, 73, 77, 79, 80, 81, 82, 83, 84, 85, 86, 87, 91, 92, 93, 94, 95,
        96, 97, 98, 99, 101, 103,
      ],
      [
        13, 16, 21, 31, 33, 42, 52, 55, 57, 58, 61, 62, 66, 71, 72, 73, 76, 80,
        81, 82, 83, 84, 85, 86, 87, 91, 92, 94, 95, 96, 97, 98, 99, 101, 103,
      ],
    ];
    this.health = 1;
    this.deltaX = 0;
    this.renderOptions = renderOptions;
    this.x = position.x / 2;
    this.y =
      position.y -
      this.sprite.cols * this.renderOptions.scale -
      2 * this.renderOptions.scale;
    this.lastX = this.x;
    this.lastY = this.y;
    this.pixelMovementPerSecond = 200;
    this.lastUpdate = performance.now();
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleKeyUp = this.handleKeyUp.bind(this);
    this.spaceDepressed = false;
    this.colour = "rgb(204, 218, 209)";
    this.pixels = spriteFactory(
      this.sprite.cols,
      this.sprite.rows,
      this.renderOptions.scale,
      this.x,
      this.y,
      this.sprite.pixels,
      this.colour,
    );
    this.addShots = addShots;
    const audioUrl = new URL("./../audio/shoot.wav", import.meta.url);
    this.shotSound = new Audio(audioUrl.toString());
    this.shotSound.volume = 0.25;
    const explosionSound = new URL("./../audio/explosion.wav", import.meta.url);
    this.defenderKilled = new Audio(explosionSound.toString());
    this.defenderKilled.volume = 0.25;
  }

  hit(laser: Laser): boolean {
    for (let i = 0; i < this.pixels.length; i++) {
      for (let j = 0; j < laser.pixels.length - 1; j++) {
        if (
          Math.abs(this.pixels[i].x - laser.pixels[j].x) <= 2 &&
          laser.pixels[j].y == this.pixels[i].y
        ) {
          this.health = 0;
          this.deltaX = 0;
          this.lastX = this.pixels[0].x;
          this.lastY = this.pixels[0].y;
          this.colour = "rgb(255,255,102)";
          this.clear();
          this.switchSprite();
          this.defenderKilled.play();
          return true;
        }
      }
    }
    return false;
  }

  reset(): void {
    this.health = 1;
    this.colour = "rgb(204, 218, 209)";
    this.pixels = spriteFactory(
      this.sprite.cols,
      this.sprite.rows,
      this.renderOptions.scale,
      this.x,
      this.y,
      this.sprite.pixels,
      this.colour,
    );
  }

  switchSprite() {
    if (this.explosionIndex === 1) {
      this.pixels = spriteFactory(
        this.sprite.cols,
        this.sprite.rows,
        this.renderOptions.scale,
        this.lastX - 6 * this.renderOptions.scale,
        this.lastY,
        this.explosion[0],
        this.colour,
      );
      this.explosionIndex = 0;
    } else {
      this.pixels = spriteFactory(
        this.sprite.cols,
        this.sprite.rows,
        this.renderOptions.scale,
        this.lastX - 6 * this.renderOptions.scale,
        this.lastY,
        this.explosion[1],
        this.colour,
      );
      this.explosionIndex = 1;
    }
  }

  update(secondsElapsed: number): void {
    if (
      (this.deltaX < 0 && this.pixels.some((pixel) => pixel.x <= 10)) ||
      (this.deltaX > 0 &&
        this.pixels.some((pixel) => pixel.x >= this.context.canvas.width - 10))
    ) {
      this.deltaX = 0;
    }

    this.clear();

    if (this.health === 0) {
      this.deltaX = 0;
      this.switchSprite();
    }

    let change =
      this.deltaX * Math.floor(this.pixelMovementPerSecond * secondsElapsed);
    this.pixels.forEach((pixel) => {
      pixel.Update(this.context, (pixel.x += change), pixel.y, this.colour);
    });
  }

  clear() {
    this.pixels.forEach((pixel) => {
      pixel.Update(this.context, pixel.x, pixel.y, "black");
    });
  }

  addEventListeners(): void {
    window.addEventListener("keydown", this.handleKeyDown);
    window.addEventListener("keyup", this.handleKeyUp);
  }

  removeEventListeners(): void {
    window.removeEventListener("keydown", this.handleKeyDown);
    window.removeEventListener("keyup", this.handleKeyUp);
  }

  handleKeyDown(event: KeyboardEvent): void {
    if (this.health === 0) {
      return;
    }
    if (event.key == "a") {
      this.deltaX = -1;
      return;
    }
    if (event.key == "d") {
      this.deltaX = 1;
      return;
    }
    if (!this.spaceDepressed && event.key === " ") {
      this.spaceDepressed = true;
      this.addShots(
        new Laser(
          this.context,
          this.renderOptions,
          { x: this.pixels[0].x, y: this.pixels[0].y - 24 },
          -1,
          "rgb(0,140,255)",
        ),
      );
      this.shotSound.currentTime = 0;
      this.shotSound.play();
    }
  }

  handleKeyUp(event: KeyboardEvent): void {
    if (event.key == "a") {
      this.deltaX = 0;
    }
    if (event.key == "d") {
      this.deltaX = 0;
    }
    if (event.key === " ") {
      this.spaceDepressed = false;
    }
  }
}

export { Defender };
