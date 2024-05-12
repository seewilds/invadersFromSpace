import { Battlefield } from "./battlefield";
import { TitleScreen, ScoreBoard, PlayerSection, TransitionScreen } from "./screens";
import { InvaderType, LevelState, Game as GameType } from "./types";

class Game {
    canvas: HTMLCanvasElement;
    context: CanvasRenderingContext2D | null;
    game: GameType;
    titleScreen: TitleScreen;
    battlefield: Battlefield;
    scoreBoard: ScoreBoard;
    transitionScreens : TransitionScreen;
    playerSection: PlayerSection;
    scale: number;
    updateInterval: number;
    gameId: number;
    levelNumber: number;
    levelState: LevelState;
    waitingToStartGame: boolean;
    levelTransition: boolean;
    framesPerSecond: number;
    interval: number;
    now: number;
    lastUpdate: number;
    secondsPaused: number;
    constructor(canvas: HTMLCanvasElement, scale: number, game: GameType, elementToInsertInto: HTMLElement, targetFramePerSecond: number = 30) {
        this.canvas = canvas;
        this.scale = scale;
        this.game = game;
        this.framesPerSecond = targetFramePerSecond;
        this.interval = 1000 / this.framesPerSecond;
        this.canvas.width = 196 * this.scale;
        this.canvas.height = 224 * this.scale;
        this.context = canvas.getContext("2d");
        this.context!.fillStyle = "black";
        this.context?.fillRect(0, 0, this.canvas.width, this.canvas.height);
        elementToInsertInto.appendChild(this.canvas);
        this.initializeGame();
        this.lastUpdate = performance.now();
        this.secondsPaused = 0;
        this.main = this.main.bind(this);
        requestAnimationFrame(this.main);
    }

    initializeGame():void{
        this.levelState = { points: 0, lives: 3, numberOfInvaders: 0, initialized: false, running: false };
        this.gameId = 0;
        this.levelNumber = -1;
        this.waitingToStartGame = true;
        this.levelTransition = false;
        this.initializeLevel();
        this.titleScreen = new TitleScreen(this.context!, this.scale);
        this.playerSection = new PlayerSection(1, 3, this.context!, this.scale);
        this.scoreBoard = new ScoreBoard(1, 3, this.context!, this.scale);
    }

    clear(): void {
        this.context!.fillStyle = "black";
        this.context?.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    initializeLevel(): void {
        this.secondsPaused = 0;
        this.levelNumber++;
        this.battlefield = new Battlefield(this.context!, 4, this.game.levels[this.levelNumber], this.levelState);
        this.transitionScreens = new TransitionScreen('GET READY', `LEVEL ${(this.levelNumber + 1).toString()}`, 'rgba(0, 255, 0, 1)', 'rgba(0, 255, 0, 1)', this.context!, this.scale);
        this.levelState.initialized = false;
    }

    main(timestamp: number): void {
        this.gameId = requestAnimationFrame(this.main);
        let delta = timestamp - this.lastUpdate;

        if (delta < this.interval) {
            return;
        }

        if (this.waitingToStartGame) {
            this.waitingToStartGame = this.titleScreen.update(timestamp);
            this.lastUpdate = performance.now();
        } else if (!this.levelState.initialized) {
            this.secondsPaused += delta;
            if (this.secondsPaused / 1000 <= 2) {
                this.transitionScreens.draw();
            }else{
                this.transitionScreens.clear();
                this.battlefield.setupLevel();
                this.levelState.running = true;
                this.secondsPaused = 0;
            }
        } else if (this.levelState.running) {
            this.levelState = this.battlefield.runLevel(timestamp);
            this.playerSection.draw(this.levelState.lives);
            this.scoreBoard.draw(this.levelState.points);
        } else if (this.secondsPaused === 0) {
            this.secondsPaused += delta;
            if(this.levelState.lives <= 0){
                this.transitionScreens.updateMainText("GAME OVER", 'red');
                this.transitionScreens.updateSubText(`POINTS ${this.levelState.points}`, 'red');
            }else{
                this.transitionScreens.updateMainText('WINNER', 'rgba(0, 255, 0, 1)');
                this.transitionScreens.updateSubText(`POINTS ${this.levelState.points}`, 'rgba(0, 255, 0, 1)');
            }
        } else {
            this.secondsPaused += delta;
            if(this.secondsPaused / 1000 >= 4){
                if(this.levelState.lives > 0 && this.levelNumber < this.game.levels.length - 1){
                    this.transitionScreens.clear();
                    this.initializeLevel();
                }else{
                    this.transitionScreens.clear();
                    this.levelState = { points: 0, lives: 3, numberOfInvaders: 0, initialized: false, running: false };
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


export { Game }