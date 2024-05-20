import { Pixel } from "./pixel";
import { DefenderSprite, characterConstants } from "./sprites";
import { Text } from "./characters";
import { spriteFactory } from "./factories";
import { Spaceship } from "./saucer";
import { RenderOptions } from "./types";

class TitleScreen {
    context: CanvasRenderingContext2D;
    renderOptions: RenderOptions;
    startGame: number;
    title: Text;
    titleScale: number;
    titleYCurent: number;
    titleYStart: number;
    titleYEnd: number;
    titleOpacity: number;
    pressStart: Text;
    pressStartScale: number;
    pressStartFadeCurrent: number;
    pressStartFadeStart: number;
    pressStartFadeEnd: number;
    spaceship: Spaceship;
    stars: Pixel[];

    constructor(context: CanvasRenderingContext2D, renderOptions: RenderOptions) {
        this.context = context;
        this.renderOptions = renderOptions;
        this.startGame = 0;
        this.titleScale = this.renderOptions.scale;
        this.pressStartScale = this.renderOptions.scale / 2;
        this.spaceship = new Spaceship(this.context!, this.renderOptions, { x: 5, y: 5 }, "silver");

        this.titleYStart = -100;
        this.titleYEnd = this.centreY("INVADERS FROM SPACE", this.titleScale) - characterConstants.rows * this.titleScale;
        this.titleYCurent = -100;
        this.titleOpacity = 1;
        this.title = new Text(this.context!, this.renderOptions.scale, { x: this.centreX("INVADERS FROM SPACE", this.titleScale, 6), y: -100 }, "INVADERS FROM SPACE", "rgba(0, 255, 0, 1)", 6);

        this.pressStartFadeCurrent = 0;
        this.pressStartFadeStart = 0;
        this.pressStartFadeEnd = 0.8;
        this.pressStart = new Text(this.context!, this.pressStartScale, { x: this.centreX("PRESS SPACE TO START", this.pressStartScale), y: this.centreY("PRESS SPACE TO START", this.pressStartScale) }, "PRESS SPACE TO START", `rgba(178, 34, 34, ${this.pressStartFadeCurrent})`);

        this.stars = this.setStars();
        window.addEventListener('keydown', (event) => this.handleSpace(event));
    }


    clear(): void {
        this.context?.clearRect(0, 0, this.context.canvas.width, this.context.canvas.height);
        this.context!.fillStyle = "black";
        this.context?.fillRect(0, 0, this.context.canvas.width, this.context.canvas.height);
    }

    centreX(text: string, scale: number, spacingOverride: number = characterConstants.cols): number {
        return (this.context.canvas.width - (spacingOverride * scale * text.length)) / 2;
    }

    centreY(text: string, scale: number) {
        return (this.context.canvas.height - (characterConstants.rows * scale)) / 2;
    }

    update(timestamp: number): boolean {
        this.updateStars();
        let begin = true;
        if (this.titleYCurent === this.titleYEnd) {
            this.updateSpaceship();
        }
        if (this.startGame > 1) {
            begin = this.fadeOut();
            window.removeEventListener('keydown', (event) => this.handleSpace(event));
        } else {
            this.updateTitle();
            this.updatePressStart();
        }
        return begin;
    }

    updateTitle(): void {
        if (this.titleYCurent < this.titleYEnd) {
            this.titleYCurent += 2;
            this.title.updateTextPosition(0, 2);
        }
    }

    updatePressStart(): void {
        if (this.titleYCurent != this.titleYEnd) {
            return;
        }
        if (this.pressStartFadeCurrent < this.pressStartFadeEnd) {
            this.pressStartFadeCurrent += 0.1;
            this.pressStart.updateTextPosition(0, 0, `rgba(178, 34, 34, ${this.pressStartFadeCurrent})`);
        }
        else {
            this.startGame = 1;
        }
    }

    updateSpaceship(): void {
        let position = this.spaceship.getPosition();
        let deltaX = this.spaceship.deltaX;
        let deltaY = this.spaceship.deltaY;
        if (position[1].x > this.context.canvas.width) {
            deltaX = -1 * this.spaceship.deltaX;
        }
        if (position[2].y < 0 || position[3].y > this.context.canvas.height / 3) {
            deltaY = -1 * this.spaceship.deltaY;
        }
        this.spaceship.update(deltaX, deltaY, `rgb(192,192,192, ${this.titleOpacity})`);
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
            this.titleOpacity -= 0.1;
            this.pressStartFadeCurrent -= 0.1;
            this.title.updateTextPosition(0, 0, `rgba(0, 255, 0, ${this.titleOpacity})`);
            this.pressStart.updateTextPosition(0, 0, `rgba(205, 62, 81, ${this.pressStartFadeCurrent})`);
            this.updateSpaceship();
            return true;
        }
        this.clear();
        return false;
    }

    setStars(): Pixel[] {
        let starPixels: Pixel[] = [];
        for (let i = 0; i < 75; i++) {
            let pixel = new Pixel(this.renderOptions.scale, this.renderOptions.scale, Math.floor(Math.random() * (this.context.canvas.width)), Math.floor(Math.random() * (this.context.canvas.height)), "white");
            starPixels.push(pixel)
        }
        return starPixels;
    }

    updateStars(): void {
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

class TransitionScreen {
    context: CanvasRenderingContext2D;
    renderOptions: RenderOptions;
    scale: number;
    mainText: Text;
    subText: Text;

    constructor(context: CanvasRenderingContext2D, renderOptions: RenderOptions, mainText: string, subText: string, mainColour: string, subColour: string) {
        this.context = context;
        this.renderOptions = renderOptions;
        this.mainText = new Text(this.context!, this.renderOptions.scale, { x: this.centreX(mainText, this.renderOptions.scale, 6), y: 200 }, mainText, mainColour, 6);
        this.subText = new Text(this.context!, this.renderOptions.scale, { x: this.centreX(subText, this.renderOptions.scale, 6), y: 250 }, subText, subColour, 6);
    }

    updateMainText(text: string, colour: string): void {
        this.mainText.x = this.centreX(text, this.renderOptions.scale);
        this.mainText.setText(text, colour);
    }

    updateSubText(text: string, colour: string): void {
        this.subText.x = this.centreX(text, this.renderOptions.scale);
        this.subText.setText(text, colour);
    }

    clear(): void {
        this.mainText.updateTextPosition(0, 0, 'black');
        this.subText.updateTextPosition(0, 0, 'black');
    }

    draw(): void {
        this.mainText.updateTextPosition(0, 0);
        this.subText.updateTextPosition(0, 0);
    }

    centreX(text: string, scale: number, spacingOverride: number = characterConstants.cols): number {
        return (this.context.canvas.width - (spacingOverride * scale * text.length)) / 2;
    }
}

class PlayerSection {
    context: CanvasRenderingContext2D;
    renderOptions: RenderOptions;
    level: number;
    lives: number;
    livesText: Text;
    defenderLives: Pixel[][];

    constructor(context: CanvasRenderingContext2D, renderOptions: RenderOptions, level: number, lives: number) {
        this.context = context;
        this.renderOptions = renderOptions;
        this.level = level;
        this.lives = lives;
        this.livesText = new Text(this.context, 3, { x: 10, y: 850 }, `${this.lives.toString()}`, "white");
        this.setupDefenderLives(this.lives);
    }

    setupDefenderLives(lives: number): void {
        this.defenderLives = new Array<Pixel[]>(lives);
        let startPixel = 80;
        for (let i = 0; i < lives; i++) {
            this.defenderLives[i] = spriteFactory(DefenderSprite.cols, DefenderSprite.rows, 3, startPixel, 850, DefenderSprite.pixels, "rgb(204, 218, 209)");
            startPixel += DefenderSprite.cols * this.renderOptions.scale + 25;
        }
    }

    clearDefenders() {
        this.defenderLives.forEach(pixels => pixels.forEach(pixel => {
            pixel.Update(this.context, pixel.x, pixel.y, "black");
        }));
    }

    draw(lives: number): void {
        this.livesText.setText(lives.toString());
        this.livesText.updateTextPosition(0, 0);
        if (lives !== this.lives) {
            this.lives = lives;
            this.clearDefenders();
            this.setupDefenderLives(this.lives);
        }
        this.defenderLives.forEach((defender, index) => {
            defender.forEach(pixel => {
                pixel.Update(this.context!, pixel.x, pixel.y);
            });
        });
    }
}

class ScoreBoard {
    context: CanvasRenderingContext2D;
    renderOptions: RenderOptions;
    level: number;
    lives: number;
    currentPoints: number;
    currentScoreText: Text;
    currentScore: Text;
    hiPoints: number;
    hiScoreText: Text;
    hiScore: Text;
    constructor(context: CanvasRenderingContext2D, renderOptions: RenderOptions, level: number, lives: number) {
        this.context = context;
        this.renderOptions = renderOptions;
        this.level = level;
        this.lives = lives;
        this.hiPoints = 0;
        this.currentPoints = 0;
        this.currentScoreText = new Text(this.context!, 2, { x: 10, y: 10 }, `CURRENT SCORE`, 'white');
        this.currentScore = new Text(this.context!, 2, { x: 10, y: 40 }, `${this.currentPoints.toString()}`, 'white');
        this.hiScoreText = new Text(this.context!, 2, { x: 250, y: 10 }, `HIGH SCORE`, 'white');
        this.hiScore = new Text(this.context!, 2, { x: 250, y: 40 }, `${this.hiPoints.toString()}`, 'white');
    }

    updateScore(score: number): void {
        this.currentScore.setText(score.toString());
    }

    draw(points: number): void {
        this.currentPoints = points;
        this.currentScoreText.updateTextPosition(0, 0);
        this.currentScore.setText(this.currentPoints.toString());
        this.currentScore.updateTextPosition(0, 0);
        this.hiScoreText.updateTextPosition(0, 0);
        if (this.currentPoints >= this.hiPoints) {
            this.hiPoints = this.currentPoints;
            this.hiScore.setText(this.hiPoints.toString());
        }
        this.hiScore.updateTextPosition(0, 0);
    }
}

export { TitleScreen, ScoreBoard, PlayerSection, TransitionScreen }