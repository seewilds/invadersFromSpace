import { Sprite, Level, InvaderType, CharacterSprite, InvaderRow, Game, LevelState } from "./types.ts"
import { Invader } from "./invader.ts"
import { Pixel } from "./pixel.ts";
import { DefenderSprite, Saucer, ShieldSprite, Shot, characterConstants } from "./sprites.ts";
import { spriteFactory } from "./factories.ts";
import { Text } from "./characters.ts"
import { Defender } from "./defender.ts";

class Shield {
  context: CanvasRenderingContext2D;
  hits: number[];
  pixels: Pixel[];
  sprite: Sprite;
  key: boolean;
  deltaX: number;
  scale: number;
  x: number;
  y: number;
  x0: number;
  y0: number;
  constructor(sprite: Sprite, scale: number, x: number, y: number, context: CanvasRenderingContext2D) {
    this.context = context;
    this.hits = [];
    this.sprite = sprite;
    this.deltaX = 0;
    this.scale = scale;
    this.x = x;
    this.y = y;
    this.pixels = spriteFactory(this.sprite.rows, this.sprite.cols, this.scale, this.x, this.y, this.sprite.pixels, "#1FFE1F");
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
        if (Math.abs(laser.pixels[j].x - this.pixels[i].x) <= 2 && laser.pixels[j].y == this.pixels[i].y) {
          this.pixels.splice(i);
          return true;
        }
      }
    }
    return false;
  }

  update(): void {
    this.pixels.forEach(pixel => {
      pixel.Update(this.context, pixel.x, pixel.y);
    });
  }
}

class Spaceship {
  context: CanvasRenderingContext2D;
  pixels: Pixel[];
  sprite: Sprite;
  scale: number;
  colour: string;
  x: number;
  y: number;
  deltaX: number;
  deltaY: number;
  direction: number;
  constructor(scale: number, x: number, y: number, colour: string, context: CanvasRenderingContext2D) {
    this.context = context;
    this.sprite = Saucer;
    this.colour = colour;
    this.scale = scale;
    this.x = x;
    this.y = y;
    this.deltaX = 6;
    this.deltaY = 6;
    this.direction = 0;
    this.pixels = spriteFactory(this.sprite.rows, this.sprite.cols, this.scale, this.x, this.y, this.sprite.pixels, this.colour);
  }

  clear(colour: string = "black"): void {
    this.pixels.forEach(pixel => {
      pixel.Update(this.context, pixel.x, pixel.y, colour);
    });
  }

  getPosition() {
    // left, right, top, bottom
    return [this.pixels[40], this.pixels[55], this.pixels[0], this.pixels[62]]
  }

  update(deltaX: number, deltaY: number, colour: string = this.colour): void {
    this.clear();
    this.deltaX = deltaX;
    this.deltaY = deltaY;
    this.colour = colour;
    this.pixels = spriteFactory(this.sprite.rows, this.sprite.cols, this.scale, this.x += this.deltaX, this.y += this.deltaY, this.sprite.pixels, this.colour);
    this.pixels.forEach(pixel => {
      pixel.Update(this.context, pixel.x, pixel.y, this.colour);
    });
  }
}

class Laser {
  context: CanvasRenderingContext2D;
  pixels: Pixel[];
  sprite: Sprite;
  key: boolean;
  deltaY: number;
  scale: number;
  x: number;
  y: number;
  direction: number;
  lastUpdate: number;
  constructor(sprite: Sprite, scale: number, x: number, y: number, direction: number, context: CanvasRenderingContext2D) {
    this.context = context;
    this.sprite = sprite;
    this.deltaY = 10 * direction;
    this.scale = scale;
    this.x = x;
    this.y = y;
    this.direction = 0;
    this.lastUpdate = performance.now();
    this.pixels = spriteFactory(this.sprite.rows, this.sprite.cols, this.scale, this.x, this.y, this.sprite.pixels, "rgb(248, 102, 36)");
  }

  update(): void {
    this.clear();
    this.pixels.forEach((pixel, index) => {
      pixel.Update(this.context, pixel.x, pixel.y += this.deltaY, "rgb(248, 102, 36)");
    });
  }

  clear(): void {
    this.pixels.forEach(pixel => {
      pixel.Update(this.context, pixel.x, pixel.y, "black");
    });
  }
}


class Battlefield {
  context: CanvasRenderingContext2D | null;
  game: Game;
  scale: number;
  updateInterval: number;
  lastUpdate: number;
  invaders: Invader[];
  invaderRow: Invader[][];
  invaderUpdateDelta: number = 240;
  defender: Defender;
  laserShots: Laser[];
  shields: Shield[];
  headerFooterPercentage: number;
  gameId: number;
  levelNumber: number;
  levelState: LevelState;
  direction: number;
  deltaX: number;
  deltaY: number;
  constructor(context: CanvasRenderingContext2D, scale: number, game: Game, levelState: LevelState) {
    this.gameId = 0;
    this.levelNumber = 0;
    this.levelState = levelState;
    this.game = game;
    this.invaders = new Array();
    this.direction = 1;
    this.deltaX = 5;
    this.deltaY = 0;
    this.scale = scale;
    this.context = context;
    this.laserShots = [];
    this.shields = [];
    this.headerFooterPercentage = 0.10;
    this.defender = new Defender(this.scale, this.context.canvas.width, this.context.canvas.height - Math.floor(this.context.canvas.height * this.headerFooterPercentage), this.addShots, this.context!);
    this.setupLevel(0);
    this.lastUpdate = 0;
  }

  clear(): void {
    this.context!.fillStyle = "black";
    this.context!.fillRect(0, 0, this.context!.canvas.width, this.context!.canvas.height);
  }

  setupLevel(index: number) {
    this.invaderRow = new Array(this.game.levels[index].setup.length);
    this.levelState.numberOfInvaders = this.invaderRow.length * this.game.levels[0].setup[0].count;
    console.log(this.levelState.numberOfInvaders)
    for (let i = 0; i < this.invaderRow.length; i++) {
      this.invaderRow[i] = this.setupInvaders(this.game.levels[index].setup[i], i);
    }
    for (let i = 0; i < this.invaderRow[this.invaderRow.length - 1].length; i++) {
      this.invaderRow[this.invaderRow.length - 1][i].canFire = true;
    }
    this.shields = this.setupShields(this.game.levels[index]);
  }

  getHorizontalSpace(sprite: Sprite, numberInRow: number): number {
    let invaderWidth = sprite.cols * this.scale;
    numberInRow = numberInRow * invaderWidth > this.context!.canvas.width ? Math.floor(this.context!.canvas.width / invaderWidth) : numberInRow;
    let remainder = this.context!.canvas.width - invaderWidth * numberInRow;
    return Math.floor(remainder / (numberInRow + 1));
  }

  setupInvaders(invaderRow: InvaderRow, row: number): Invader[] {
    let invaders = new Array<Invader>(invaderRow.count);
    let topOffset = Math.floor(this.context!.canvas.height * this.headerFooterPercentage);
    let spaceBetween = this.getHorizontalSpace(invaderRow.sprite, invaderRow.count);
    let invaderWidth = invaderRow.sprite.cols * this.scale;
    let invaderHeight = invaderRow.sprite.rows * this.scale + this.scale * this.scale;
    for (let i = 0; i < invaders.length; i++) {
      invaders[i] = new Invader(invaderRow.sprite, invaderRow.colour, this.scale, i * (invaderWidth + spaceBetween) + spaceBetween, row * invaderHeight + topOffset, 0, this.addShots, this.context!);
    }
    return invaders;
  }

  setupShields(level: Level): Shield[] {
    let shields = new Array<Shield>(level.shieldCount);
    let spaceBetween = this.getHorizontalSpace(ShieldSprite, level.shieldCount);
    let shieldWidth = ShieldSprite.cols * this.scale;
    let shieldHeight = ShieldSprite.rows * this.scale + this.scale * this.scale;

    for (let i = 0; i < level.shieldCount; i++) {
      shields[i] = new Shield(ShieldSprite, this.scale, i * (shieldWidth + spaceBetween) + spaceBetween, 4.5 * shieldHeight + 5 + Math.floor(this.context!.canvas.height * 0.30), this.context!);
    }
    return shields;
  }

  anyAtRightEdge(): Boolean {
    for (let i = 0; i < this.invaderRow.length; i++) {
      for (let j = 0; j < this.invaderRow[i].length; j++) {
        if (this.invaderRow[i][this.invaderRow[i].length - 1].pixels.some(pixel => pixel.x >= this.context!.canvas.width)) {
          return true;
        }
      }
    }
    return false;
  }

  anyAtLeftEdge(): Boolean {
    for (let i = 0; i < this.invaderRow.length; i++) {
      for (let j = 0; j < this.invaderRow[i].length; j++) {
        if (this.invaderRow[i][0].pixels.some(pixel => pixel.x <= 0)) {
          return true;
        }
      }
    }
    return false;
  }

  updateInvaders(timestamp: number): void {
    let delta = timestamp - this.lastUpdate;
    if (delta > this.invaderUpdateDelta) {
      this.removeInvaders();

      let atLeftBoundary = this.anyAtLeftEdge();
      let atRightBoundary = this.anyAtRightEdge();

      if (atRightBoundary) {
        this.deltaX = -5;
      }

      if (atLeftBoundary) {
        this.deltaX = 5;
        this.deltaY = 8 * 3;
      }

      for (let i = 0; i < this.invaderRow.length; i++) {
        for (let j = 0; j < this.invaderRow[i].length; j++) {
          this.invaderRow[i][j].switchSprite(this.deltaX, this.deltaY);
        }
      }
      this.deltaY = 0;
      this.lastUpdate = timestamp;
    }
  }

  updateShields(): void {
    for (let i = this.shields.length - 1; i >= 0; i--) {
      if (this.shields[i].pixels.length === 0) {
        this.removeShield(i);
      } else {
        this.shields[i].update();
      }
    }
  }

  addShots = (laser: Laser) => {
    this.laserShots = [...this.laserShots, laser];
  };

  updateLasers(): void {
    this.laserShots.forEach(shot => {
      shot.update();
    });
  }

  reset(): void {
    for (let i = this.laserShots.length - 1; i >= 0; i--) {
      this.removeLaserShot(i);
    }
    this.defender.clear();
    this.defender.reset();
  }

  updateHits() {
    this.invaderRow.forEach((invaders, index) => {
      for (let i = invaders.length - 1; i >= 0; i--) {
        for (let j = this.laserShots.length - 1; j >= 0; j--) {
          if (invaders[i].hit(this.laserShots[j])) {
            this.removeLaserShot(j);
            this.levelState.points += 10 + (4 % (i + 1)) * 10; 
          }
        }
      }
    })

    for (let i = this.shields.length - 1; i >= 0; i--) {
      for (let j = this.laserShots.length - 1; j >= 0; j--) {
        if (this.shields[i].hit(this.laserShots[j])) {
          this.removeLaserShot(j);
        }
      }
    }
    if (this.defender.health > 0) {
      for (let i = 0; i < this.laserShots.length; i++) {
        if (this.defender.hit(this.laserShots[i])) {
          this.levelState.lives -= 1;
          this.defender.health = 0;
        }
      }
    }
  }

  removeInvader(row: number, col: number) {
    this.invaderRow[row][col].clear();
    this.invaderRow[row].splice(col, 1);
    this.invaderUpdateDelta -= 2;
  }

  removeInvaders(): void {
    for (let i = this.invaderRow.length - 1; i >= 0; i--) {
      for (let j = this.invaderRow[i].length - 1; j >= 0; j--) {
        if (this.invaderRow[i][j].health === 0) {
          this.enableLasers(i, j);
          this.removeInvader(i, j);
          this.levelState.numberOfInvaders--;
        }
      }
    }
  }

  enableLasers(row: number, index: number): void {
    for (let i = row - 1; i >= 0; i--) {
      if (this.invaderRow[i].length - 1 >= index
        && this.invaderRow[i][index].setCanFire(this.invaderRow[i][index].pixels)) {
        return;
      }
    }
  }

  removeShield(index: number) {
    this.shields[index].clear();
    this.shields.splice(index, 1);
  }

  removeLaserShot(index: number) {
    this.laserShots[index].clear();
    this.laserShots.splice(index, 1);
  }

  runLevel(timestamp: number): LevelState {
    let delta = timestamp - this.lastUpdate;
    if (this.defender.health > 0) {
      this.defender.update(timestamp);
      this.updateInvaders(timestamp);
      this.updateShields();
      this.updateLasers();
      this.updateHits();
    } else {
      if (delta <= 300) {
        this.defender.update(timestamp);
      }
      else {
        this.reset();
      }
    }
    return this.levelState;
  }
}

export { Defender, Battlefield, Shield, Spaceship, Laser };