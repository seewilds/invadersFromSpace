import { Sprite, Level, InvaderRow, LevelState } from "./types.ts"
import { Invader } from "./invader.ts"
import { ShieldSprite } from "./sprites.ts";
import { Defender } from "./defender.ts";
import { Laser } from "./laser.ts";
import { Shield } from "./shield.ts";


class Battlefield {
  context: CanvasRenderingContext2D | null;
  level: Level;
  scale: number;
  updateInterval: number;
  lastUpdate: number;
  invaders: Invader[];
  invaderRow: Invader[][];
  invaderPrimarySound: HTMLAudioElement;
  invaderAltSound: HTMLAudioElement;
  soundIsPrimary: boolean;
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
  constructor(context: CanvasRenderingContext2D, scale: number, level: Level, levelState: LevelState) {
    this.gameId = 0;
    this.levelNumber = 0;
    this.levelState = levelState;
    this.level = level;
    this.invaders = new Array();
    const audioPrimaryUrl = new URL('./../audio/fastinvader1.wav', import.meta.url);
    this.invaderPrimarySound = new Audio(audioPrimaryUrl.toString());
    const audioAltUrl = new URL('./../audio/fastinvader2.wav', import.meta.url);
    this.invaderAltSound = new Audio(audioAltUrl.toString());
    this.soundIsPrimary = true;
    this.direction = 1;
    this.deltaX = 5;
    this.deltaY = 0;
    this.scale = scale;
    this.context = context;
    this.laserShots = [];
    this.shields = [];
    this.headerFooterPercentage = 0.10;
    this.defender = new Defender(this.scale, this.context.canvas.width, this.context.canvas.height - Math.floor(this.context.canvas.height * this.headerFooterPercentage), this.addShots, this.context!);
    this.lastUpdate = 0;
  }

  clear(): void {
    this.context!.fillStyle = "black";
    this.context!.fillRect(0, 0, this.context!.canvas.width, this.context!.canvas.height);
  }

  playInvaderMoveSound(): void {
    if (this.soundIsPrimary) {
      this.invaderPrimarySound.play();
    } else {
      this.invaderAltSound.play();
    }
    this.soundIsPrimary = !this.soundIsPrimary;
  }

  setupLevel(): void {
    this.invaderRow = new Array(this.level.setup.length);
    this.levelState.numberOfInvaders = this.invaderRow.length * this.level.setup[0].count;
    for (let i = 0; i < this.invaderRow.length; i++) {
      this.invaderRow[i] = this.setupInvaders(this.level.setup[i], i);
    }
    for (let i = 0; i < this.invaderRow[this.invaderRow.length - 1].length; i++) {
      this.invaderRow[this.invaderRow.length - 1][i].canFire = true;
    }
    this.shields = this.setupShields(this.level);
    this.defender.addEventListeners();
    this.levelState.initialized = true;
  }

  teardownLevel(): void{
    this.defender.removeEventListeners();
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
      shields[i] = new Shield(this.scale, i * (shieldWidth + spaceBetween) + spaceBetween, 4.5 * shieldHeight + 5 + Math.floor(this.context!.canvas.height * 0.30), this.context!);
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
          this.playInvaderMoveSound();
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
    });

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

    for (let j = this.laserShots.length - 1; j >= 0; j--) {
      if (this.laserShots[j].pixels.some(pixel => {
        return pixel.y < (this.context!.canvas.height * this.headerFooterPercentage)
          || pixel.y > (this.context!.canvas.height * (1 - this.headerFooterPercentage))
      })) {
        this.removeLaserShot(j);
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
      this.defender.update();
      this.updateInvaders(timestamp);
      this.updateShields();
      this.updateLasers();
      this.updateHits();
    } else {
      if (delta <= 300) {
        this.defender.update();
      }
      else {
        this.reset();
      }
    }
    this.levelState.running = this.levelState.numberOfInvaders !== 0 && this.levelState.lives !== 0;
    if(!this.levelState.running){
      this.teardownLevel();
    }
    return this.levelState;
  }
}

export { Battlefield };