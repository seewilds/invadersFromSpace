import { spriteFactory } from "./factories";
import { Laser } from "./game";
import { Pixel } from "./pixel";
import { Explosion, Shot } from "./sprites";
import { CharacterSprite, Sprite } from "./types"

class Invader {
    context: CanvasRenderingContext2D;
    health: number;
    pixels: Pixel[];
    canFire: Boolean;
    addShot: Function;
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
    constructor(sprite: CharacterSprite, colour: string, pixelsPerPixel: number, x: number, y: number, direction: number, addShot: Function, context: CanvasRenderingContext2D) {
        this.health = 1;
        this.addShot = addShot;
        this.context = context;
        this.explosion = Explosion;
        this.canFire = false;
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

    clear() {
        this.pixels.forEach(pixel => {
            pixel.Update(this.context, pixel.x, pixel.y, "black");
        });
    }

    hit(laser : Laser): boolean {        
        for(let i = 0; i < this.pixels.length; i++){
            for(let j = 0; j < laser.pixels.length - 1; j++){
                if(Math.abs(laser.pixels[j].x - this.pixels[i].x) <= 2 && laser.pixels[j].y == this.pixels[i].y){
                    this.health = 0;
                    this.switchSprite(0, 0);
                    return true;
                }
            }   
        }
        return false;
    }

    update(){
        this.pixels.forEach(pixel => {
            pixel.Update(this.context, pixel.x, pixel.y);
        });
    }

    fire(): void{
        if(Math.random() >= 0.80){
            this.addShot(new Laser(Shot, this.pixelsPerPixel, this.pixels[0].x, this.pixels[0].y - 24, 1, this.context));
        }
    }

    switchSprite(deltaX: number, deltaY: number) {
        this.clear();
        this.fire();
        this.x += deltaX;
        this.y += deltaY;

        if (this.health === 0) {
            this.pixels = spriteFactory(this.explosion.rows, this.explosion.cols, this.pixelsPerPixel, this.x, this.y, this.explosion.pixels, "rgb(249, 200, 14)")
            this.altActive = false;
        }
        else if (this.altActive) {
            this.pixels = spriteFactory(this.sprite.rows, this.sprite.cols, this.pixelsPerPixel, this.x, this.y, this.sprite.alternatePixels, this.colour)
            this.altActive = false;
        } else {
            this.pixels = spriteFactory(this.sprite.rows, this.sprite.cols, this.pixelsPerPixel, this.x, this.y, this.sprite.pixels, this.colour);
            this.altActive = true;
        }
        this.update();
    }
}

export { Invader }