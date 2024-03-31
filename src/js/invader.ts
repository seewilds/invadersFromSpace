import { spriteFactory } from "./factories";
import { Pixel } from "./pixel";
import { Explosion } from "./sprites";
import { CharacterSprite, Sprite } from "./types"

class Invader {
    context: CanvasRenderingContext2D;
    health: number;
    pixels: Pixel[];
    sprite: CharacterSprite;
    explosion: Sprite;
    colour: string;
    altActive: boolean;
    direction: number;
    pixelsPerPixel: number;
    x: number;
    y: number;
    updateInterval: number;
    lastUpdate: number;
    constructor(sprite: CharacterSprite, colour: string, pixelsPerPixel: number, x: number, y: number, direction: number, context: CanvasRenderingContext2D) {
        this.health = 1;
        this.context = context;
        this.explosion = Explosion;
        this.sprite = sprite;
        this.colour = colour;
        this.direction = direction;
        this.pixelsPerPixel = pixelsPerPixel;
        this.x = x;
        this.y = y;
        this.updateInterval = 200;
        this.lastUpdate = performance.now();
        this.pixels = spriteFactory(this.sprite.rows, this.sprite.cols, this.pixelsPerPixel, this.x, this.y, this.sprite.pixels, this.colour);
        this.altActive = false;
    }

    getWidth() {
        return this.sprite.cols * this.pixelsPerPixel;
    }

    Clear() {
        this.pixels.forEach(pixel => {
            pixel.Update(this.context, pixel.x, pixel.y, "black");
        });
    }

    Hit(x: number, y: number) {
        return this.pixels.some(pixel => pixel.hit(x, y));
    }

    Update(deltaX: number) {
        this.Clear();
        deltaX *= this.direction;
        if (this.health === 0) {
            this.pixels = spriteFactory(this.explosion.rows, this.explosion.cols, this.pixelsPerPixel, this.x, this.y, this.explosion.pixels, this.colour)
            this.altActive = false;
        }
        else if (this.altActive) {
            this.pixels = spriteFactory(this.sprite.rows, this.sprite.cols, this.pixelsPerPixel, this.x += deltaX, this.y, this.sprite.alternatePixels, this.colour)
            this.altActive = false;
        } else {
            this.pixels = spriteFactory(this.sprite.rows, this.sprite.cols, this.pixelsPerPixel, this.x += deltaX, this.y, this.sprite.pixels, this.colour);
            this.altActive = true;
        }
        this.pixels.forEach(pixel => {
            pixel.Update(this.context, pixel.x, pixel.y);
        });
    }
}

export { Invader }