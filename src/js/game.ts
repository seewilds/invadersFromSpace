import { Sprite, Shot, Explosion, GameSetup, InvaderType, Squid, Crab, Octopus, DefenderSprite } from "./types.ts"

class Defender {
  context: CanvasRenderingContext2D;
  health: number;
  pixels: Pixel[];
  shots : Laser[];
  key: boolean;
  sprite : Sprite;
  x: number;
  y: number;
  deltaX: number;
  pixelsPerPixel: number;
  updateInterval: number;
  lastUpdate: number;
  constructor(pixelsPerPixel: number, width: number, height: number, context: CanvasRenderingContext2D) {
    this.context = context;
    this.sprite = DefenderSprite;
    this.deltaX = 0;
    this.shots = [];
    this.pixelsPerPixel = pixelsPerPixel;
    this.x = width / 2 ;
    this.y = height - this.sprite.cols * this.pixelsPerPixel - 2 * this.pixelsPerPixel;
    this.updateInterval = 10;
    this.lastUpdate = performance.now();
    this.pixels = spriteFactory(this.sprite.cols, this.sprite.rows, this.pixelsPerPixel, this.x, this.y, this.sprite.activePixels, "#1FFE1F");
    window.addEventListener('keydown', (event) => this.HandleKeyDown(event));
    window.addEventListener('keyup', (event) => this.HandleKeyUp(event));
    requestAnimationFrame(this.Update.bind(this));
  }
  Update(timestamp) {
    const deltaTime = timestamp - this.lastUpdate;
    if (deltaTime >= this.updateInterval) {
      this.context.fillStyle = "black";
      this.context.clearRect(this.pixels[0].x - 6 * this.pixelsPerPixel, this.pixels[0].y, 13 * this.pixelsPerPixel, 8 * this.pixelsPerPixel);
      this.context.fillRect(this.pixels[0].x - 6 * this.pixelsPerPixel, this.pixels[0].y, 13 * this.pixelsPerPixel, 8 * this.pixelsPerPixel);
      this.pixels.forEach(pixel => {
        pixel.Update(this.context, pixel.x += this.deltaX, pixel.y);
      });
      this.shots.forEach((shot, i) => {
        if(shot.y >= 453){
          this.shots.splice(i,1);
        }
        shot.Update();
      })
      this.lastUpdate = timestamp;
    }
    requestAnimationFrame(this.Update.bind(this));
  }
  HandleKeyDown(event: KeyboardEvent) {
    if (event.key == 'a') {
      this.deltaX = -this.pixelsPerPixel;
    }
    if (event.key == 'd') {
      this.deltaX = this.pixelsPerPixel;
    }
    if (event.key == ' ') {
      this.shots = [...this.shots, new Laser(Shot, this.pixelsPerPixel, this.pixels[0].x, this.pixels[0].y - 24 , this.context)]
    }
  }
  HandleKeyUp(event: KeyboardEvent) {
    if (event.key == 'a') {
      this.deltaX = 0;
    }
    if (event.key == 'd') {
      this.deltaX = 0;
    }
  }
}

function spriteFactory(height: number, width: number, pixelsPerPixel: number, xStart: number, yStart: number, activePixels: number[], colour: string) {
  let spriteArray = new Array(activePixels.length);
  let activePixelsSet = 0;
  let loopNumber = 0;
  for (let i = 0; i < height; i++) {
    for (let j = 0; j < width; j++) {
      if (activePixels.includes(loopNumber)) {
        spriteArray[activePixelsSet] = new Pixel(pixelsPerPixel, pixelsPerPixel, xStart + j * pixelsPerPixel, yStart + pixelsPerPixel * i, colour);
        activePixelsSet++;
      }
      loopNumber++;
    }
  }
  return spriteArray;
}


class Shield {
  context: CanvasRenderingContext2D;
  pixels: Pixel[];
  sprite: Sprite;
  key: boolean;
  deltaX: number;
  pixelsPerPixel: number;
  x: number;
  y: number;
  constructor(sprite: Sprite, pixelsPerPixel: number, x: number, y: number, context: CanvasRenderingContext2D) {
    this.context = context;
    this.sprite = sprite;
    this.deltaX = 0;
    this.pixelsPerPixel = pixelsPerPixel;
    this.x = x;
    this.y = y;
    this.pixels = spriteFactory(this.sprite.rows, this.sprite.cols, this.pixelsPerPixel, this.x, this.y, this.sprite.activePixels, "#1FFE1F");
    requestAnimationFrame(this.Update.bind(this));
  }
  Update() {
    this.pixels.forEach(pixel => {
      pixel.Update(this.context, pixel.x += this.deltaX, pixel.y);
    });
  }
}

class Spaceship {
  context: CanvasRenderingContext2D;
  pixels: Pixel[];
  sprite: Sprite;
  key: boolean;
  deltaX: number;
  deltaY: number;
  pixelsPerPixel: number;
  x: number;
  y: number;
  direction: number;
  updateInterval: number;
  lastUpdate: number;
  constructor(sprite: Sprite, pixelsPerPixel: number, x: number, y: number, context: CanvasRenderingContext2D) {
    this.context = context;
    this.sprite = sprite;
    this.deltaX = 5;
    this.deltaY = 2;
    this.pixelsPerPixel = pixelsPerPixel;
    this.x = x;
    this.y = y;
    this.direction = 0;
    this.updateInterval = 10;
    this.lastUpdate = performance.now();
    this.pixels = spriteFactory(this.sprite.rows, this.sprite.cols, this.pixelsPerPixel, this.x, this.y, this.sprite.activePixels, "silver");
    requestAnimationFrame(this.Update.bind(this));
  }
  Update(timestamp) {
    const deltaTime = timestamp - this.lastUpdate;
    if (deltaTime >= this.updateInterval) {
      this.context.fillStyle = "black";
      this.context.fillRect(this.pixels[0].x - this.sprite.activePixels[0] * this.pixelsPerPixel, this.pixels[0].y, this.sprite.cols * this.pixelsPerPixel, this.sprite.rows * this.pixelsPerPixel);
      if (this.pixels[0].x < 0) {
        this.deltaX = 5
      }
      if (this.pixels[0].x > 512) {
        this.deltaX = -5
      }
      if (this.pixels[0].x < 200) {
        this.deltaY = 1
      }
      if (this.pixels[0].x > 300) {
        this.deltaY = -1
      }
      this.pixels.forEach(pixel => {
        pixel.Update(this.context, pixel.x += this.deltaX, pixel.y += this.deltaY);
      });
      this.lastUpdate = timestamp;
    }
    requestAnimationFrame(this.Update.bind(this));
  }
}

class Laser {
  context: CanvasRenderingContext2D;
  pixels: Pixel[];
  sprite: Sprite;
  key: boolean;
  deltaY: number;
  pixelsPerPixel: number;
  x: number;
  y: number;
  direction: number;
  updateInterval: number;
  lastUpdate: number;
  constructor(sprite: Sprite, pixelsPerPixel: number, x: number, y: number, context: CanvasRenderingContext2D) {
    this.context = context;
    this.sprite = sprite;
    this.deltaY = 3;
    this.pixelsPerPixel = pixelsPerPixel;
    this.x = x;
    this.y = y;
    this.direction = 0;
    this.updateInterval = 10;
    this.lastUpdate = performance.now();
    this.pixels = spriteFactory(this.sprite.rows, this.sprite.cols, this.pixelsPerPixel, this.x, this.y, this.sprite.activePixels, "pink ");
    requestAnimationFrame(this.Update.bind(this));
  }
  Update() {
    this.context.fillStyle = "black";
    this.context.fillRect(this.pixels[0].x - this.sprite.activePixels[0] * this.pixelsPerPixel, this.pixels[0].y, this.sprite.rows * this.pixelsPerPixel, this.sprite.rows * this.pixelsPerPixel);
    this.pixels.forEach(pixel => {
      pixel.Update(this.context, pixel.x, pixel.y -= this.deltaY);
    });

    requestAnimationFrame(this.Update.bind(this));
  }
}



class Invader {
  context: CanvasRenderingContext2D;
  health: number;
  pixels: Pixel[];
  sprite: Sprite;
  explosion : Sprite;
  colour: string;
  altActive: boolean;
  deltaX: number;
  pixelsPerPixel: number;
  x: number;
  y: number;
  updateInterval: number;
  lastUpdate: number;
  constructor(sprite: Sprite, colour: string, pixelsPerPixel: number, x: number, y: number, context: CanvasRenderingContext2D) {
    this.health = 1;
    this.context = context;
    this.explosion = Explosion;
    this.sprite = sprite;
    this.colour = colour;
    this.deltaX = 0;
    this.pixelsPerPixel = pixelsPerPixel;
    this.x = x;
    this.y = y;
    this.updateInterval = 200;
    this.lastUpdate = performance.now();
    this.pixels = spriteFactory(this.sprite.rows, this.sprite.cols, this.pixelsPerPixel, this.x, this.y, this.sprite.activePixels, this.colour);
    this.altActive = false;
  }
  Update() {
    this.context.fillStyle = "black";
    this.context.fillRect(this.pixels[0].x - this.sprite.activePixels[0] * this.pixelsPerPixel, this.pixels[0].y, this.sprite.cols * this.pixelsPerPixel, this.sprite.rows * this.pixelsPerPixel);
    if(this.health === 0){
      this.pixels = spriteFactory(this.explosion.rows, this.explosion.cols, this.pixelsPerPixel, this.x, this.y, this.explosion.activePixels, "orange")
      this.altActive = false;        
    }
    else if (this.altActive) {
      this.pixels = spriteFactory(this.sprite.rows, this.sprite.cols, this.pixelsPerPixel, this.x, this.y, this.sprite.activePixelsAlt, this.colour)
      this.altActive = false;
    } else {
      this.pixels = spriteFactory(this.sprite.rows, this.sprite.cols, this.pixelsPerPixel, this.x, this.y, this.sprite.activePixels, this.colour);
      this.altActive = true;
    }
    this.pixels.forEach(pixel => {
      pixel.Update(this.context, pixel.x += this.deltaX, pixel.y);
    });
  }
}


// space invaders is 128 x 128 pixels
class Battlefield {
  canvas: HTMLCanvasElement;
  context: CanvasRenderingContext2D | null;
  scale: number;
  pixelsPerPixel: number;
  updateInterval: number;
  lastUpdate: number;
  invaders : Invader[];
  defender : Defender;
  laserShots : Laser[];
  constructor(canvas: HTMLCanvasElement, scale: number, gameSetup : GameSetup) {
    this.invaders = new Array();
    this.scale = scale;
    this.canvas = canvas;    
    this.pixelsPerPixel = this.scale * this.scale;
    this.canvas.width = 128 * this.pixelsPerPixel;
    this.canvas.height = 128 * this.pixelsPerPixel;    
    this.context = canvas.getContext("2d");
    this.context!.fillStyle = "black";
    this.context?.fillRect(0, 0, this.canvas.width, this.canvas.height);
    document.body.insertBefore(this.canvas, document.body.childNodes[0]);
    this.defender = new Defender(this.pixelsPerPixel, this.canvas.width, this.canvas.height, this.context!);
    this.setupInvaders(gameSetup);
    this.updateInterval = 200;
    this.lastUpdate = performance.now();
    requestAnimationFrame(this.Update.bind(this));
  }

  Clear(): void {
    this.context?.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.context!.fillStyle = "black";
    this.context?.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }

  setupInvaders(gameSetup : GameSetup){
    let arrayIndex = 0;
    let rowIndex = 0;
    gameSetup.setup.forEach(element => {
      if(element.type == InvaderType.Squid){
        for(let i = 0; i < element.count; i++){
          this.invaders[arrayIndex] = new Invader(element.sprite, element.colour, this.pixelsPerPixel, i * 50, rowIndex * 50 + 10, this.context!);
          arrayIndex++;
        }
        rowIndex++;
      }
      if(element.type == InvaderType.Octopus){
        for(let i = 0; i < element.count; i++){
          this.invaders[arrayIndex] = new Invader(element.sprite, element.colour, this.pixelsPerPixel, i * 50, rowIndex * 50 + 10, this.context!);
          arrayIndex++;
        }
        rowIndex++;
      }
      if(element.type == InvaderType.Crab){
        for(let i = 0; i < element.count; i++){
          this.invaders[arrayIndex] = new Invader(element.sprite, element.colour, this.pixelsPerPixel, i * 50, rowIndex * 50 + 10, this.context!);
          arrayIndex++;
        }
        rowIndex++;
      }
    });
  }

  Update(timestamp){
    const deltaTime = timestamp - this.lastUpdate;
    if (deltaTime >= this.updateInterval) {
      this.invaders.forEach(element => {
        element.Update();
      });
      this.lastUpdate = timestamp;      
    } 
    requestAnimationFrame(this.Update.bind(this));   
  }
}

class Pixel {
  width: number;
  height: number;
  x: number;
  y: number;
  colour: string;
  constructor(width: number, height: number, x: number, y: number, colour: string) {
    this.width = width;
    this.height = height;
    this.x = x;
    this.y = y;
    this.colour = colour;
  }
  Update(context: CanvasRenderingContext2D, x: number, y: number) {
    this.x = x;
    this.y = y;
    context.fillStyle = this.colour;
    context.fillRect(this.x, this.y, this.width, this.height);
  }
}

export { Defender, Battlefield, Invader, Shield, Spaceship, Laser };