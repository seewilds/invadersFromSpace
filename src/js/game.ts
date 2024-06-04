import { Battlefield } from "./battlefield.js";
import {
  TitleScreen,
  ScoreBoard,
  PlayerSection,
  TransitionScreen,
} from "./screens.js";
import type { RenderOptions, LevelState, Game as GameType } from "./types.js";

export class Game {
  canvas: HTMLCanvasElement;
  context: CanvasRenderingContext2D | null;
  game: GameType;
  renderOptions: RenderOptions;
  titleScreen!: TitleScreen;
  battlefield!: Battlefield;
  scoreBoard!: ScoreBoard;
  transitionScreens!: TransitionScreen;
  playerSection!: PlayerSection;
  highScore: number;
  scale: number;
  updateInterval!: number;
  gameId!: number;
  levelNumber!: number;
  levelState!: LevelState;
  waitingToStartGame!: boolean;
  levelTransition!: boolean;
  framesPerSecond!: number;
  interval: number;
  lastUpdate: number;
  secondsPaused: number;
  constructor(
    elementToInsertInto: HTMLElement,
    game: GameType,
    renderOptions: RenderOptions,
  ) {
    window.addEventListener("keydown", function (event: KeyboardEvent) {
      if (event.key === " ") {
        event.preventDefault();
      }
    });
    this.renderOptions = renderOptions;
    this.scale = this.renderOptions.scale;
    this.game = game;
    this.highScore = 0;
    this.framesPerSecond = this.renderOptions.targetFramesPerSecond;
    this.interval = 1000 / this.framesPerSecond;
    (this.canvas = document.createElement("canvas")),
      (this.canvas.width = 196 * this.scale);
    this.canvas.height = 224 * this.scale;
    this.context = this.canvas.getContext("2d");
    this.context!.fillStyle = "black";
    this.context?.fillRect(0, 0, this.canvas.width, this.canvas.height);
    elementToInsertInto.appendChild(this.canvas);
    this.initializeGame();
    this.lastUpdate = performance.now();
    this.secondsPaused = 0;
    this.main = this.main.bind(this);
    requestAnimationFrame(this.main);
  }

  initializeGame(): void {
    this.levelState = {
      points: 0,
      lives: 3,
      numberOfInvaders: 0,
      initialized: false,
      running: false,
    };
    this.gameId = 0;
    this.levelNumber = -1;
    this.waitingToStartGame = true;
    this.levelTransition = false;
    this.initializeLevel();
    this.titleScreen = new TitleScreen(this.context!, this.renderOptions);
    this.playerSection = new PlayerSection(
      this.context!,
      this.renderOptions,
      1,
      3,
    );
    this.scoreBoard = new ScoreBoard(this.context!, this.renderOptions, 1, 3, this.highScore);
  }

  clear(): void {
    this.context!.fillStyle = "black";
    this.context?.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }

  initializeLevel(): void {
    this.secondsPaused = 0;
    this.levelNumber++;
    this.battlefield = new Battlefield(
      this.context!,
      this.renderOptions,
      this.game.levels[this.levelNumber],
      this.levelState,
    );
    this.transitionScreens = new TransitionScreen(
      this.context!,
      this.renderOptions,
      "GET READY",
      `LEVEL ${(this.levelNumber + 1).toString()}`,
      "rgba(0, 255, 0, 1)",
      "rgba(0, 255, 0, 1)",
    );
    this.levelState.initialized = false;
  }

  main(timestamp: number): void {
    this.gameId = requestAnimationFrame(this.main);
    let delta = timestamp - this.lastUpdate;

    if (delta < this.interval) {
      return;
    }

    if (this.waitingToStartGame) {
      this.waitingToStartGame = this.titleScreen.update(delta);
      this.lastUpdate = performance.now();
    } else if (!this.levelState.initialized) {
      this.secondsPaused += delta;
      if (this.secondsPaused / 1000 <= 2) {
        this.transitionScreens.draw();
      } else {
        this.transitionScreens.clear();
        this.battlefield.setupLevel();
        this.levelState.running = true;
        this.secondsPaused = 0;
      }
    } else if (this.levelState.running) {
      this.levelState = this.battlefield.runLevel(delta);
      this.playerSection.draw(this.levelState.lives);
      this.scoreBoard.draw(this.levelState.points);
    } else if (this.secondsPaused === 0) {
      this.secondsPaused += delta;
      if (this.levelState.lives <= 0) {
        this.transitionScreens.updateMainText("GAME OVER", "red");
        this.transitionScreens.updateSubText(
          `POINTS ${this.levelState.points}`,
          "red",
        );
      } else {
        let message = "WINNER";
        if(this.levelState.points > this.highScore){
          message = "NEW HIGH SCORE";
        }
        this.transitionScreens.updateMainText(message, "rgba(0, 255, 0, 1)");
        this.transitionScreens.updateSubText(
          `POINTS ${this.levelState.points}`,
          "rgba(0, 255, 0, 1)",
        );
      }
    } else {
      this.secondsPaused += delta;
      if (this.secondsPaused / 1000 >= 4) {
        this.highScore = this.levelState.points > this.highScore ?  this.levelState.points : this.highScore;
        if (
          this.levelState.lives > 0 &&
          this.levelNumber < this.game.levels.length - 1
        ) {
          this.transitionScreens.clear();
          this.initializeLevel();
        } else {
          this.transitionScreens.clear();
          this.levelState = {
            points: 0,
            lives: 3,
            numberOfInvaders: 0,
            initialized: false,
            running: false,
          };
          this.levelNumber = -1;
          this.initializeGame();
        }
      } else if (this.secondsPaused / 1000 >= 1) {
        this.clear();
        this.transitionScreens.draw();
      }
    }
    this.lastUpdate = timestamp - (delta % this.interval);
  }
}
