import { Battlefield } from "./battlefield";
import { TitleScreen, ScoreBoard, PlayerSection } from "./screens";
import { Crab, Octopus, Squid } from "./sprites";
import { InvaderType, LevelState } from "./types";

class Game {
    canvas: HTMLCanvasElement;
    context: CanvasRenderingContext2D | null;
    game: Game;
    titleScreen: TitleScreen;
    battlefield: Battlefield;
    scoreBoard: ScoreBoard;
    playerSection: PlayerSection;
    scale: number;
    updateInterval: number;
    gameId: number;
    levelNumber: number;
    levelState: LevelState;
    waitingToStartGame: boolean;
    levelTransition: boolean;
    framesPerSecond: number = 30;
    interval : number = 1000 / 30;
    now: number;
    lastUpdate: number;
    constructor(canvas: HTMLCanvasElement, scale: number, game: Game) {
        this.canvas = canvas;
        this.scale = scale;
        this.game = game;
        this.gameId = 0;
        this.levelNumber = 0;
        this.levelState = { points: 0, lives: 3 };
        this.waitingToStartGame = true;
        this.levelTransition = false;
        this.canvas.width = 196 * this.scale;
        this.canvas.height = 224 * this.scale;
        this.context = canvas.getContext("2d");
        this.context!.fillStyle = "black";
        this.context?.fillRect(0, 0, this.canvas.width, this.canvas.height);
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.titleScreen = new TitleScreen(this.context!, this.scale);
        this.playerSection = new PlayerSection(1, 3, this.context!, this.scale);
        this.scoreBoard = new ScoreBoard(1, 3, this.context!, this.scale);
        this.battlefield = new Battlefield(
            this.context!,
            4,
            {
                levels: [{
                    setup: [
                        { count: 11, colour: "rgb(186, 18, 0)", type: InvaderType.Squid, sprite: Squid, directionStart: -1 },
                        { count: 11, colour: "rgb(28, 93, 153)", type: InvaderType.Octopus, sprite: Octopus, directionStart: 1 },
                        { count: 11, colour: "rgb(244, 91, 105)", type: InvaderType.Crab, sprite: Crab, directionStart: -1 },
                        { count: 11, colour: "rgb(4, 240, 106)", type: InvaderType.Octopus, sprite: Octopus, directionStart: 1 }
                    ],
                    shieldCount: 4
                }]
            }, this.levelState);
        this.lastUpdate = performance.now();
        requestAnimationFrame(this.main.bind(this));
    }

    clear(): void {
        this.context?.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.context!.fillStyle = "black";
        this.context?.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    main(timestamp: number): void {
        this.gameId = requestAnimationFrame(this.main.bind(this));
        let delta = timestamp - this.lastUpdate;
        if(delta >= this.interval){
            if (!this.waitingToStartGame) {
                this.waitingToStartGame = this.titleScreen.update(timestamp);
                this.lastUpdate = performance.now();
            } else {
                this.levelState = this.battlefield.runLevel(timestamp);
                this.playerSection.draw(this.levelState.lives);
                this.scoreBoard.draw(this.levelState.points);                
                this.lastUpdate = timestamp - (delta % this.interval);
            }
        }       
    }

}


export { Game }