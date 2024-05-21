import { spriteFactory } from "./factories";
import { Laser } from "./laser";
import { Pixel } from "./pixel";
import { Explosion, characterConstants } from "./sprites";
import { CharacterSprite, Position, RenderOptions, Sprite } from "./types"

class Invader {
    context: CanvasRenderingContext2D;
    renderOptions: RenderOptions;
    health: number;
    pixels: Pixel[];
    canFire: Boolean;
    addShot: Function;
    sprite: CharacterSprite;
    explosion: Sprite;
    explosionSound: HTMLAudioElement;
    colour: string;
    altActive: boolean;
    direction: number;
    pixelMovementPerSecond: number;
    pixelsHoldSeconds: number;
    x: number;
    y: number;
    firstRender: boolean;
    constructor(context: CanvasRenderingContext2D, renderOptions: RenderOptions, sprite: CharacterSprite, position: Position, direction: number, colour: string, addShot: Function) {
        this.health = 1;
        this.addShot = addShot;
        this.context = context;
        this.explosion = Explosion;
        this.canFire = false;
        this.sprite = sprite;
        this.colour = colour;
        this.direction = 0;
        this.renderOptions = renderOptions;
        this.x = position.x;
        this.y = position.y;
        this.pixelMovementPerSecond = 20;
        this.pixelsHoldSeconds = 0;
        this.firstRender = true;
        this.pixels = spriteFactory(this.sprite.rows, this.sprite.cols, this.renderOptions.scale, this.x, this.y, this.sprite.pixels, this.colour);
        const audioUrl = new URL('./../audio/invaderkilled.wav', import.meta.url);
        this.explosionSound = new Audio(audioUrl.toString());
        this.altActive = false;
    }

    clear() {
        this.pixels.forEach(pixel => {
            pixel.Update(this.context, pixel.x, pixel.y, "black");
        });
    }

    hit(laser: Laser): boolean {
        if(this.health === 0){
            return false;
        }
        for (let i = 0; i < this.pixels.length; i++) {
            for (let j = 0; j < laser.pixels.length - 1; j++) {
                if (Math.abs(laser.pixels[j].x - this.pixels[i].x) <= 2 && Math.abs(laser.pixels[j].y - this.pixels[i].y) <= 2) {
                    this.health = 0;
                    this.clear();
                    this.switchSprite();
                    this.pixelsHoldSeconds = 0;
                    this.explosionSound.play();
                    return true;
                }
            }
        }
        return false;
    }

    update(secondsElapsed: number, atLeftBoundary: boolean, atRightBoundary: boolean): boolean {
        let invaderMoved = false;
        
        let changeY = 0;
        let changeX = 0;

        this.clear();
        this.pixelsHoldSeconds += secondsElapsed;

        if (this.pixelsHoldSeconds >= 0.35 && this.health > 0) {
            this.switchSprite();            

            if (atRightBoundary) {
                this.direction = -1;
                changeY = characterConstants.cols * 3;
            }
            if (atLeftBoundary) {
                this.direction = 1;
            }

            changeX = Math.floor(this.pixelMovementPerSecond * this.pixelsHoldSeconds) * this.direction;
            this.pixelsHoldSeconds = 0;
            invaderMoved = true;
        }

        this.x += changeX;
        this.y += changeY;

        this.pixels.forEach(pixel => {
            pixel.Update(this.context, pixel.x += changeX, pixel.y += changeY, this.colour);
        });

        if (this.health > 0 && this.canFire) {
            this.fire();
        }

        if (this.firstRender) {
            this.direction = 1;
        }
        this.firstRender = false;
        
        return invaderMoved;
    }

    fire(): void {
        if (Math.random() >= 0.99) {
            this.addShot(new Laser(this.context, this.renderOptions, { x: this.pixels[this.sprite.laserPosition].x, y: this.pixels[this.sprite.laserPosition].y }, 1, 'rgb(255,15,0)'));
        }
    }

    setCanFire(pixels: Pixel[]): boolean {
        for (let i = 0; i < pixels.length; i++) {
            if (this.pixels.some(pixel => pixel.y === pixels[i].y)) {
                this.canFire = true;
                return true;
            }
        }
        return false;
    }

    switchSprite(): void {
        if (this.health === 0) {
            this.colour = "rgb(249, 200, 14)";
            this.pixels = spriteFactory(this.explosion.rows, this.explosion.cols, this.renderOptions.scale, this.x, this.y, this.explosion.pixels, this.colour);
            this.altActive = false;
        }
        else if (this.altActive) {
            this.pixels = spriteFactory(this.sprite.rows, this.sprite.cols, this.renderOptions.scale, this.x, this.y, this.sprite.alternatePixels, this.colour);
            this.altActive = false;
        } else {
            this.pixels = spriteFactory(this.sprite.rows, this.sprite.cols, this.renderOptions.scale, this.x, this.y, this.sprite.pixels, this.colour);
            this.altActive = true;
        }
    }
}

export { Invader }