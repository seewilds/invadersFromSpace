import { spriteFactory } from "./factories";
import { Laser } from "./laser";
import { Pixel } from "./pixel";
import { Explosion } from "./sprites";
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
    x: number;
    y: number;
    constructor(context: CanvasRenderingContext2D, renderOptions: RenderOptions, sprite: CharacterSprite, position: Position, direction: number, colour: string, addShot: Function) {
        this.health = 1;
        this.addShot = addShot;
        this.context = context;
        this.explosion = Explosion;
        this.canFire = false;
        this.sprite = sprite;
        this.colour = colour;
        this.direction = direction;
        this.renderOptions = renderOptions;
        this.x = position.x;
        this.y = position.y;
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

    hit(laser : Laser): boolean {        
        for(let i = 0; i < this.pixels.length; i++){
            for(let j = 0; j < laser.pixels.length - 1; j++){
                if(Math.abs(laser.pixels[j].x - this.pixels[i].x) <= 2 && laser.pixels[j].y == this.pixels[i].y){
                    this.health = 0;
                    this.switchSprite(0, 0);
                    this.explosionSound.play();
                    return true;
                }
            }   
        }
        return false;
    }

    update(){
        if(this.health > 0 && this.canFire){
            this.fire();
        }
        this.pixels.forEach(pixel => {
            pixel.Update(this.context, pixel.x, pixel.y);
        });

    }

    fire(): void{
        if(Math.random() >= 0.90){
            this.addShot(new Laser(this.context, this.renderOptions, {x: this.pixels[this.sprite.laserPosition].x, y: this.pixels[this.sprite.laserPosition].y}, 1, 'rgb(255,15,0)'));
        }
    }

    setCanFire(pixels: Pixel[]): boolean {
        for(let i = 0; i < pixels.length; i++){
            if(this.pixels.some(pixel => pixel.y === pixels[i].y)){
                this.canFire = true;
                return true;
            }
        }
        return false;
    }

    switchSprite(deltaX: number, deltaY: number) {
        this.clear();
        this.x += deltaX;
        this.y += deltaY;

        if (this.health === 0) {
            this.pixels = spriteFactory(this.explosion.rows, this.explosion.cols, this.renderOptions.scale, this.x, this.y, this.explosion.pixels, "rgb(249, 200, 14)")
            this.altActive = false;
        }
        else if (this.altActive) {
            this.pixels = spriteFactory(this.sprite.rows, this.sprite.cols, this.renderOptions.scale, this.x, this.y, this.sprite.alternatePixels, this.colour)
            this.altActive = false;
        } else {
            this.pixels = spriteFactory(this.sprite.rows, this.sprite.cols, this.renderOptions.scale, this.x, this.y, this.sprite.pixels, this.colour);
            this.altActive = true;
        }
        this.update();
    }
}

export { Invader }