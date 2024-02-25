import { Sprite, Shot, Explosion, GameSetup, InvaderType, ShieldSprite, Crab, Octopus, DefenderSprite } from "./types.ts"

class Defender {
  context: CanvasRenderingContext2D;
  health: number;
  pixels: Pixel[];
  key: boolean;
  sprite: Sprite;
  x: number;
  y: number;
  deltaX: number;
  pixelsPerPixel: number;
  updateInterval: number;
  lastUpdate: number;
  addShots: Function;
  constructor(pixelsPerPixel: number, width: number, height: number, addShots: Function, context: CanvasRenderingContext2D) {
    this.context = context;
    this.sprite = DefenderSprite;
    this.deltaX = 0;
    this.pixelsPerPixel = pixelsPerPixel;
    this.x = width / 2;
    this.y = height - this.sprite.cols * this.pixelsPerPixel - 2 * this.pixelsPerPixel;
    this.updateInterval = 10;
    this.lastUpdate = performance.now();
    this.pixels = spriteFactory(this.sprite.cols, this.sprite.rows, this.pixelsPerPixel, this.x, this.y, this.sprite.activePixels, "#1FFE1F");
    this.addShots = addShots;
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
      this.addShots(new Laser(Shot, this.pixelsPerPixel, this.pixels[0].x, this.pixels[0].y - 24, this.context));
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
    this.deltaY = 5;
    this.pixelsPerPixel = pixelsPerPixel;
    this.x = x;
    this.y = y;
    this.direction = 0;
    this.updateInterval = 10;
    this.lastUpdate = performance.now();
    this.pixels = spriteFactory(this.sprite.rows, this.sprite.cols, this.pixelsPerPixel, this.x, this.y, this.sprite.activePixels, "orange");
  }
  Update() {
    this.Clear();
    this.pixels.forEach((pixel, index) => {
      pixel.Update(this.context, pixel.x, pixel.y -= this.deltaY);
    });
  }
  Clear() {
    this.context.fillStyle = "black";
    this.context.fillRect(this.pixels[0].x, this.pixels[0].y, this.sprite.cols * this.pixelsPerPixel, this.sprite.rows * this.pixelsPerPixel);
  }
}



class Invader {
  context: CanvasRenderingContext2D;
  health: number;
  pixels: Pixel[];
  sprite: Sprite;
  explosion: Sprite;
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
  getWidth() {
    return this.sprite.cols * this.pixelsPerPixel;
  }
  Clear() {
    this.context.fillStyle = "black";
    this.context.fillRect(this.pixels[0].x - this.sprite.activePixels[0] * this.pixelsPerPixel, this.pixels[0].y, this.sprite.cols * this.pixelsPerPixel, this.sprite.rows * this.pixelsPerPixel);
  }
  Update() {
    this.Clear();
    if (this.health === 0) {
      this.pixels = spriteFactory(this.explosion.rows, this.explosion.cols, this.pixelsPerPixel, this.x, this.y, this.explosion.activePixels, this.colour)
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
  invaders: Invader[];
  defender: Defender;
  laserShots: Laser[];
  shields: Shield[];
  constructor(canvas: HTMLCanvasElement, scale: number, gameSetup: GameSetup) {
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
    this.laserShots = [];
    this.shields = [];
    this.defender = new Defender(this.pixelsPerPixel, this.canvas.width, this.canvas.height, this.addShots, this.context!);
    this.setupInvaders(gameSetup);
    this.setupShields(gameSetup);
    this.updateInterval = 100;
    this.lastUpdate = performance.now();
  }

  Clear(): void {
    this.context?.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.context!.fillStyle = "black";
    this.context?.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }

  start() {
    requestAnimationFrame(this.Update.bind(this));
  }

  addShots = (laser: Laser) => {
    this.laserShots = [...this.laserShots, laser];
  };

  setupInvaders(gameSetup: GameSetup) {
    let arrayIndex = 0;
    let rowIndex = 0;
    gameSetup.setup.forEach(element => {
      let invaderWidth = element.sprite.cols * this.pixelsPerPixel;
      element.count = element.count * invaderWidth >= this.canvas.width ? Math.floor(this.canvas.width / invaderWidth) : element.count;
      let invaderHeight = element.sprite.cols * this.pixelsPerPixel;
      let remainder = this.canvas.width - invaderWidth * element.count;
      let spaceBetween = Math.floor(remainder / (element.count + 2));
      if (element.type == InvaderType.Squid) {
        for (let i = 0; i < element.count; i++) {
          this.invaders[arrayIndex] = new Invader(element.sprite, element.colour, this.pixelsPerPixel, i * (invaderWidth + spaceBetween) + spaceBetween, rowIndex * invaderHeight + 5, this.context!);
          arrayIndex++;
        }
        rowIndex++;
      }
      if (element.type == InvaderType.Octopus) {
        for (let i = 0; i < element.count; i++) {
          this.invaders[arrayIndex] = new Invader(element.sprite, element.colour, this.pixelsPerPixel, i * (invaderWidth + spaceBetween) + spaceBetween, rowIndex * invaderHeight, this.context!);
          arrayIndex++;
        }
        rowIndex++;
      }
      if (element.type == InvaderType.Crab) {
        for (let i = 0; i < element.count; i++) {
          this.invaders[arrayIndex] = new Invader(element.sprite, element.colour, this.pixelsPerPixel, i * (invaderWidth + spaceBetween) + spaceBetween, rowIndex * invaderHeight, this.context!);
          arrayIndex++;
        }
        rowIndex++;
      }
    });
  }

  setupShields(gameSetup: GameSetup) {
    let shieldWidth = ShieldSprite.cols * this.pixelsPerPixel;
    gameSetup.shieldCount = gameSetup.shieldCount * shieldWidth >= this.canvas.width ? Math.floor(this.canvas.width / shieldWidth) : gameSetup.shieldCount;
    let invaderHeight = ShieldSprite.cols * this.pixelsPerPixel;
    let remainder = this.canvas.width - shieldWidth * gameSetup.shieldCount;
    let spaceBetween = Math.floor(remainder / (gameSetup.shieldCount + 2));
  
    for (let i = 0; i < gameSetup.shieldCount; i++) {
      this.shields[i] = new Shield(ShieldSprite, this.pixelsPerPixel, i * (shieldWidth + spaceBetween) + spaceBetween, 4.5 * invaderHeight + 5, this.context!);
    }
  }

  Update(timestamp) {
    const deltaTime = timestamp - this.lastUpdate;
    if (deltaTime >= this.updateInterval) {


      this.laserShots.forEach(element => {
        element.Clear()
        element.Update();
      });

      this.lastUpdate = timestamp;
    }
    else if (deltaTime >= 20) {
      this.invaders.forEach(( element, index ) => {
        if(element.health === 0){
          element.Clear();
          this.invaders.splice(index, 1);
        }else{
          element.Update()
        }
      });

      this.laserShots.forEach(element => {
        element.Clear()
        element.Update();
      });

      this.shields.forEach(element => {
        element.Update();
      });



      for (let j = this.invaders.length - 1; j >= 0; j--) {
        if (this.invaders[j].health == 0) {
          this.invaders[j].Clear();
          this.invaders.splice(j, 1);
          continue;
        }
        // for (let l = this.invaders[j].pixels.length - 1; l >= 0; l--) {
        //   for (let i = this.laserShots.length - 1; i >= 0; i--) {
        //     for (let k = this.laserShots[i].pixels.length - 2; k >= 0; k--) {
        //       if (this.laserShots[i].pixels[k].x === this.invaders[j].pixels[l].x && this.invaders[j].pixels[l].y >= this.laserShots[i].pixels[k].y) {
        //         this.invaders[j].health = 0;
        //         this.laserShots[i].Clear();
        //         this.laserShots.splice(j, 1);
        //       } else if (this.laserShots[i].pixels[k].y <= 0) {
        //         this.laserShots[i].Clear();
        //         this.laserShots.splice(i, 1);
        //       }
        //     }
        //   }
        // }
      }


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