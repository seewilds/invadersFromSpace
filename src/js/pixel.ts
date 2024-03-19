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
    hit(x: number, y: number): boolean {
        return Math.abs(x - this.x) <= 2 && y == this.y;
    }
}

export { Pixel }