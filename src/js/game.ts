import { Sprite, Level, InvaderType, CharacterSprite, InvaderRow, Game } from "./types.ts"
import { Invader } from "./invader.ts"
import { Pixel } from "./pixel.ts";
import { DefenderSprite, Saucer, ShieldSprite, Shot, characterConstants } from "./sprites.ts";
import { spriteFactory } from "./factories.ts";
import { Text } from "./characters"


class Defender {
  context: CanvasRenderingContext2D;
  health: number;
  pixels: Pixel[];
  key: boolean;
  sprite: Sprite;
  x: number;
  y: number;
  deltaX: number;
  scale: number;
  updateInterval: number;
  lastUpdate: number;
  addShots: Function;
  constructor(scale: number, width: number, height: number, addShots: Function, context: CanvasRenderingContext2D) {
    this.context = context;
    this.sprite = DefenderSprite;
    this.deltaX = 0;
    this.scale = scale;
    this.x = width / 2;
    this.y = height - this.sprite.cols * this.scale - 2 * this.scale;
    this.updateInterval = 10;
    this.lastUpdate = performance.now();
    this.pixels = spriteFactory(this.sprite.cols, this.sprite.rows, this.scale, this.x, this.y, this.sprite.pixels, "rgb(204, 218, 209)");
    this.addShots = addShots;
    window.addEventListener('keydown', (event) => this.handleKeyDown(event));
    window.addEventListener('keyup', (event) => this.handleKeyUp(event));
  }

  update(timestamp): void {
    const deltaTime = timestamp - this.lastUpdate;
    if (deltaTime >= this.updateInterval) {
      if (
        this.pixels.some(pixel => pixel.x <= 10) && this.deltaX < 0
        || this.pixels.some(pixel => pixel.x >= this.context.canvas.width - 10) && this.deltaX > 0
      ) {
        this.deltaX = 0;
      }
      this.context.fillStyle = "black";
      this.context.clearRect(this.pixels[0].x - 6 * this.scale, this.pixels[0].y, 13 * this.scale, 8 * this.scale);
      this.context.fillRect(this.pixels[0].x - 6 * this.scale, this.pixels[0].y, 13 * this.scale, 8 * this.scale);
      this.pixels.forEach(pixel => {
        pixel.Update(this.context, pixel.x += this.deltaX, pixel.y);
      });
      this.lastUpdate = timestamp;
    }
  }

  handleKeyDown(event: KeyboardEvent): void {
    if (event.key == 'a') {
      this.deltaX = -this.scale;
      return;
    }
    if (event.key == 'd') {
      this.deltaX = this.scale;
      return;
    }
    if (event.key === ' ') {
      this.addShots(new Laser(Shot, this.scale, this.pixels[0].x, this.pixels[0].y - 24, -1, this.context));
    }
  }

  handleKeyUp(event: KeyboardEvent): void {
    if (event.key == 'a') {
      this.deltaX = 0;
    }
    if (event.key == 'd') {
      this.deltaX = 0;
    }
  }
}

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
    this.context.fillStyle = "black";
    this.context.fillRect(this.x0 - this.sprite.pixels[0] * this.scale, this.y0, this.sprite.cols * this.scale, this.sprite.rows * this.scale);
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
    this.deltaX = 2;
    this.deltaY = 2;
    this.direction = 0;
    this.pixels = spriteFactory(this.sprite.rows, this.sprite.cols, this.scale, this.x, this.y, this.sprite.pixels, this.colour);
  }

  clear(colour: string = "black"): void {
    this.pixels.forEach(pixel => pixel.Update(this.context, pixel.x, pixel.y, colour));
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
  updateInterval: number;
  lastUpdate: number;
  constructor(sprite: Sprite, scale: number, x: number, y: number, direction: number,  context: CanvasRenderingContext2D) {
    this.context = context;
    this.sprite = sprite;
    this.deltaY = 5 * direction;
    this.scale = scale;
    this.x = x;
    this.y = y;
    this.direction = 0;
    this.updateInterval = 10;
    this.lastUpdate = performance.now();
    this.pixels = spriteFactory(this.sprite.rows, this.sprite.cols, this.scale, this.x, this.y, this.sprite.pixels, "rgb(248, 102, 36)");
  }

  update(): void {
    this.clear();
    this.pixels.forEach((pixel, index) => {
      pixel.Update(this.context, pixel.x, pixel.y += this.deltaY);
    });
  }

  clear(): void {
    this.context.fillStyle = "black";
    this.context.fillRect(this.pixels[0].x, this.pixels[0].y, this.sprite.cols * this.scale, this.sprite.rows * this.scale);
  }
}

class TitleScreen {
  canvas: HTMLCanvasElement;
  context: CanvasRenderingContext2D | null;
  scale: number;
  startGame: number;

  title: Text;
  titleScale: number;
  titleYCurent: number;
  titleYStart: number;
  titleYEnd: number;
  titleOpacity: number;

  subtitle: Text;
  subTitleScale: number;

  pressStart: Text;
  pressStartScale: number;
  pressStartFadeCurrent: number;
  pressStartFadeStart: number;
  pressStartFadeEnd: number;

  spaceship: Spaceship;

  stars: Pixel[];

  lastUpdate: number;
  constructor(canvas: HTMLCanvasElement, scale: number) {
    this.scale = scale;
    this.startGame = 0;
    this.titleScale = this.scale;
    this.pressStartScale = this.scale / 2;
    this.canvas = canvas;
    this.canvas.width = 128 * this.scale;
    this.canvas.height = 128 * this.scale;
    this.context = canvas.getContext("2d");
    this.context!.fillStyle = "black";
    this.context?.fillRect(0, 0, this.canvas.width, this.canvas.height);
    document.body.insertBefore(this.canvas, document.body.childNodes[0]);

    this.spaceship = new Spaceship(this.scale, 5, 5, "silver", this.context!);

    this.titleYStart = -100;
    this.titleYEnd = this.centreY("INVADERS FROM SPACE", this.titleScale) - characterConstants.rows * this.titleScale;
    this.titleYCurent = -100;
    this.titleOpacity = 1;
    this.title = new Text("INVADERS FROM SPACE", "rgba(0, 255, 0, 1)", this.scale, this.centreX("INVADERS FROM SPACE", this.titleScale, 6), -100, this.context!, 6);

    this.pressStartFadeCurrent = 0;
    this.pressStartFadeStart = 0;
    this.pressStartFadeEnd = 0.8;
    this.pressStart = new Text("PRESS SPACE TO START", `rgba(178, 34, 34, ${this.pressStartFadeCurrent})`, this.pressStartScale, this.centreX("PRESS SPACE TO START", this.pressStartScale), this.centreY("PRESS SPACE TO START", this.pressStartScale), this.context!);

    this.lastUpdate = performance.now();
    this.stars = this.setStars();
    window.addEventListener('keydown', (event) => this.handleSpace(event));
  }

  centreX(text: string, scale: number, spacingOverride: number = characterConstants.cols): number {
    return (this.canvas.width - (spacingOverride * scale * text.length)) / 2;
  }

  centreY(text: string, scale: number) {
    return (this.canvas.height - (characterConstants.rows * scale)) / 2;
  }

  start(): void {
    requestAnimationFrame(this.update.bind(this));
  }

  update(timestamp: number): boolean {
    this.updateStars();
    let begin = false;
    if (this.startGame > 0) {
      this.updateSpaceship();
    }
    if (this.startGame > 1) {
      begin = this.fadeOut();
      window.removeEventListener('keydown', (event) => this.handleSpace(event));
    } else {
      this.updateTitle();
      this.updatePressStart();
    }
    requestAnimationFrame(this.update.bind(this));
    return begin;
  }

  updateTitle() {
    if (this.titleYCurent < this.titleYEnd) {
      this.titleYCurent += 2;
      this.title.updateTextPosition(0, 2);
    }
  }

  updatePressStart() {
    if (this.titleYCurent != this.titleYEnd) {
      return;
    }
    if (this.pressStartFadeCurrent < this.pressStartFadeEnd) {
      this.pressStartFadeCurrent += 0.02;
      this.pressStart.updateTextPosition(0, 0, `rgba(178, 34, 34, ${this.pressStartFadeCurrent})`);
    }
    else {
      this.startGame = 1;
    }
  }

  updateSpaceship() {
    let position = this.spaceship.getPosition();
    let deltaX = this.spaceship.deltaX;
    let deltaY = this.spaceship.deltaY;
    // || position[0].x < 0
    if (position[1].x > this.canvas.width) {
      deltaX = -1 * this.spaceship.deltaX;
    }
    if (position[2].y < 0 || position[3].y > this.canvas.height / 3) {
      deltaY = -1 * this.spaceship.deltaY;
    }
    this.spaceship.update(deltaX, deltaY, 'rgb(192,192,192, 0.7)');
  }

  setTextToFinal(): void {
    let remainder = 0;
    if (this.titleYCurent < 0) {
      remainder = this.titleYEnd + this.titleYCurent * -1;
    } else {
      remainder = this.titleYEnd - this.titleYCurent;
    }
    this.titleYCurent = this.titleYEnd;
    this.title.updateTextPosition(0, remainder);
    this.pressStartFadeCurrent = this.pressStartFadeEnd;
    this.pressStart.updateTextPosition(0, 0, `rgba(178, 34, 34, ${this.pressStartFadeEnd})`);
  }

  fadeOut(): boolean {
    if (this.titleOpacity > 0 || this.pressStartFadeCurrent > 0) {
      this.titleOpacity -= 0.01;
      this.pressStartFadeCurrent -= 0.01;
      this.title.updateTextPosition(0, 0, `rgba(0, 255, 0, ${this.titleOpacity})`);
      this.pressStart.updateTextPosition(0, 0, `rgba(205, 62, 81, ${this.pressStartFadeCurrent})`);
      return false;
    }
    return true;
  }

  setStars(): Pixel[] {
    let starPixels: Pixel[] = [];
    for (let i = 0; i < 75; i++) {
      let pixel = new Pixel(this.scale, this.scale, Math.floor(Math.random() * (this.canvas.width)), Math.floor(Math.random() * (this.canvas.height)), "white");
      starPixels.push(pixel)
    }
    return starPixels;
  }

  updateStars() {
    this.stars.forEach(star => {
      star.Update(this.context!, star.x, star.y);
    });
  }

  handleSpace(event: KeyboardEvent): void {
    if (event.key === " " && this.startGame === 0) {
      this.setTextToFinal();
    }
    this.startGame += 1;
  }

}

// space invaders is 128 x 128 pixels
class Battlefield {
  canvas: HTMLCanvasElement;
  context: CanvasRenderingContext2D | null;
  game: Game;
  scale: number;
  updateInterval: number;
  lastUpdate: number;
  invaders: Invader[];
  invaderRow: Invader[][];
  defender: Defender;
  laserShots: Laser[];
  shields: Shield[];
  titleScreen: TitleScreen;
  headerFooterPercentage: number;
  gameId: number;
  levelNumber: number;
  direction: number;
  deltaX: number;
  deltaY: number;
  constructor(canvas: HTMLCanvasElement, scale: number, game: Game) {
    this.gameId = 0;
    this.levelNumber = 0;
    this.game = game;
    this.invaders = new Array();
    this.direction = 1;
    this.deltaX = 5;
    this.deltaY = 0;
    this.scale = scale;
    this.canvas = canvas;
    this.canvas.width = 196 * this.scale;
    this.canvas.height = 224 * this.scale;
    this.context = canvas.getContext("2d");
    this.context!.fillStyle = "black";
    this.context?.fillRect(0, 0, this.canvas.width, this.canvas.height);
    document.body.insertBefore(this.canvas, document.body.childNodes[0]);
    this.laserShots = [];
    this.shields = [];
    this.headerFooterPercentage = 0.10;
    this.defender = new Defender(this.scale, this.canvas.width, this.canvas.height - Math.floor(this.canvas.height * this.headerFooterPercentage), this.addShots, this.context!);
    this.setupLevel(0);
//    this.titleScreen = new TitleScreen(this.canvas, this.scale);
    this.updateInterval = 200;
    this.lastUpdate = performance.now();
  }

  clear(): void {
    this.context?.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.context!.fillStyle = "black";
    this.context?.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }


  start(): void {
    //this.titleScreen.start();
    requestAnimationFrame(this.main.bind(this));
  }

  setupLevel(index: number){
    this.invaderRow = new Array(this.game.levels[index].setup.length);
    for(let i = 0; i < this.invaderRow.length; i++){
      this.invaderRow[i] = this.setupInvaders(this.game.levels[index].setup[i], i);
    }
    for(let i = 0; i < this.invaderRow[this.invaderRow.length - 1].length; i++){
      this.invaderRow[this.invaderRow.length - 1][i].canFire = true;
    }
    this.shields = this.setupShields(this.game.levels[index]);
  }

  getHorizontalSpace(sprite: Sprite, numberInRow: number):number{
    let invaderWidth = sprite.cols * this.scale;
    numberInRow = numberInRow * invaderWidth > this.canvas.width ? Math.floor(this.canvas.width / invaderWidth) : numberInRow;
    let remainder = this.canvas.width - invaderWidth * numberInRow;
    return Math.floor(remainder / (numberInRow + 1));
  }

  setupInvaders(invaderRow: InvaderRow, row: number): Invader[] {
    let invaders = new Array<Invader>(invaderRow.count);
    let topOffset = Math.floor(this.canvas.height * this.headerFooterPercentage);
    let spaceBetween = this.getHorizontalSpace(invaderRow.sprite, invaderRow.count);
    let invaderWidth = invaderRow.sprite.cols * this.scale;
    let invaderHeight = invaderRow.sprite.rows * this.scale + this.scale * this.scale;
    for(let i = 0; i < invaders.length; i++){
      invaders[i] = new Invader(invaderRow.sprite, invaderRow.colour, this.scale, i * (invaderWidth + spaceBetween) + spaceBetween, row * invaderHeight  + topOffset, 0, this.addShots, this.context!);
    }
    return invaders;
  }
  
  setupShields(level: Level): Shield[] {
    let shields = new Array<Shield>(level.shieldCount);
    let spaceBetween = this.getHorizontalSpace(ShieldSprite, level.shieldCount);
    let shieldWidth = ShieldSprite.cols * this.scale;
    let shieldHeight = ShieldSprite.rows * this.scale + this.scale * this.scale;

    for (let i = 0; i < level.shieldCount; i++) {
      shields[i] = new Shield(ShieldSprite, this.scale, i * (shieldWidth + spaceBetween) + spaceBetween, 4.5 * shieldHeight + 5 + Math.floor(this.canvas.height * 0.30), this.context!);
    }
    return shields;
  }


  anyAtRightEdge(): Boolean{
    for(let i = 0; i < this.invaderRow.length; i++){
      for(let j = 0; j < this.invaderRow[i].length; j++){
        if(this.invaderRow[i][this.invaderRow[i].length - 1].pixels.some(pixel => pixel.x >= this.canvas.width)){
          return true;
        }
      }
    }
    return false;
  }

  anyAtLeftEdge(): Boolean{
    for(let i = 0; i < this.invaderRow.length; i++){
      for(let j = 0; j < this.invaderRow[i].length; j++){
        if(this.invaderRow[i][0].pixels.some(pixel => pixel.x <= 0)){
          return true;
        }
      }
    }
    return false;
  }

  updateInvaders():void{
    this.removeInvaders();

    let atLeftBoundary = this.anyAtLeftEdge();
    let atRightBoundary = this.anyAtRightEdge();

    if(atRightBoundary){
      this.deltaX = -5;
    }

    if(atLeftBoundary){
      this.deltaX = 5;
      this.deltaY = 8 * 3;
    }

    for(let i = 0; i < this.invaderRow.length; i++){
      for(let j = 0; j < this.invaderRow[i].length; j++){
        this.invaderRow[i][j].switchSprite(this.deltaX, this.deltaY);
      }
    }
    this.deltaY = 0;
  }

  updateShields(): void{
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
  
  updateLasers(): void{
    this.laserShots.forEach(shot => {
      shot.update();
    });    
  }

  updateHits(){
    this.invaderRow.forEach( (invaders, index) =>{
      for (let i = invaders.length - 1; i >= 0; i--) {
        for (let j = this.laserShots.length - 1; j >= 0; j--) {
          if (invaders[i].hit(this.laserShots[j])) {
            this.removeLaserShot(j);
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
  }

  removeInvader(row: number, col: number){
    this.invaderRow[row][col].clear();
    this.invaderRow[row].splice(col, 1);
  }

  removeInvaders(): void{
    for(let i = this.invaderRow.length - 1; i >= 0; i--){
      for(let j = this.invaderRow[i].length - 1; j >= 0; j--){
        if(this.invaderRow[i][j].health === 0){
          this.enableLasers(i, j);
          this.removeInvader(i, j);
        }
      }
    }
  }

  enableLasers(row: number, index: number): void{
    console.log(index, row)
    for(let i = row - 1; i >= 0; i--){
      if(this.invaderRow[i].length >= index
        && this.invaderRow[i][index].setCanFire(this.invaderRow[i][index].pixels)){
        return;
      }
      
    }
  }
  
  removeShield(index: number){
    this.shields[index].clear();
    this.shields.splice(index, 1);
  }

  removeLaserShot(index: number){
    this.laserShots[index].clear();
    this.laserShots.splice(index, 1);
  }

  main(timestamp: number): void {
    const deltaTime = timestamp - this.lastUpdate;
    if (deltaTime >= this.updateInterval) {
      this.defender.update(timestamp)
      this.updateInvaders();
      this.updateShields();

      this.lastUpdate = timestamp;
    }
    else if (deltaTime >= 20) {
      this.defender.update(timestamp);
      this.updateLasers();
      this.updateHits();
    }
    this.gameId = requestAnimationFrame(this.main.bind(this));
  }
}

export { Defender, Battlefield, Shield, Spaceship, Laser, TitleScreen };