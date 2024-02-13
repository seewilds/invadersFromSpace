class Defender {
  context: CanvasRenderingContext2D;
  health: number;
  pixels: Pixel[];
  key: boolean;
  deltaX: number;
  pixelsPerPixel : number;
  constructor(pixelsPerPixel : number, boardDimension : number, context: CanvasRenderingContext2D) {
    this.context = context;
    this.deltaX = 0;
    this.pixels = new Array(14);
    this.pixelsPerPixel = pixelsPerPixel;
    let bottom = boardDimension - this.pixelsPerPixel * 2;
    let left = Math.round(boardDimension / 2 - 13 / 2);
    let row1, row2, row3, row4, row5, row6, row7, row8 = 0;
    for (row1 = 0; row1 < 13; row1++) {
      this.pixels[row1] = new Pixel(this.pixelsPerPixel, this.pixelsPerPixel, left + row1 * this.pixelsPerPixel, bottom, "#20FF20");
    }
    for (row2 = row1; row2 < 26; row2++) {
      this.pixels[row2] = new Pixel(this.pixelsPerPixel, this.pixelsPerPixel, left + (row2 - row1) * this.pixelsPerPixel, bottom - this.pixelsPerPixel, "#20FF20");
    }
    for (row3 = row2; row3 < 39; row3++) {
      this.pixels[row3] = new Pixel(this.pixelsPerPixel, this.pixelsPerPixel, left + (row3 - row2) * this.pixelsPerPixel, bottom - this.pixelsPerPixel * 2, "#20FF20");
    }
    for (row4 = row3; row4 < 52; row4++) {
      this.pixels[row4] = new Pixel(this.pixelsPerPixel, this.pixelsPerPixel, left + (row4 - row3) * this.pixelsPerPixel,  bottom - this.pixelsPerPixel * 3, "#20FF20");
    }
    for (row5 = row4; row5 < 63; row5++) {
      this.pixels[row5] = new Pixel(this.pixelsPerPixel, this.pixelsPerPixel, left + this.pixelsPerPixel + (row5 - row4) * this.pixelsPerPixel,  bottom - this.pixelsPerPixel * 4, "#20FF20");
    }
    for (row6 = row5; row6 < 66; row6++) {
      this.pixels[row6] = new Pixel(this.pixelsPerPixel, this.pixelsPerPixel, left + 5 * this.pixelsPerPixel + (row6 - row5) * this.pixelsPerPixel,  bottom - this.pixelsPerPixel * 5, "#20FF20");
    }
    for (row7 = row6; row7 < 66; row7++) {
      this.pixels[row7] = new Pixel(this.pixelsPerPixel, this.pixelsPerPixel, (left + 5 * this.pixelsPerPixel + 1) + (row7 - row6) * this.pixelsPerPixel,  bottom - this.pixelsPerPixel * 6, "#20FF20");
    }
    this.pixels[row7] = new Pixel(this.pixelsPerPixel, this.pixelsPerPixel, (left + 6 * this.pixelsPerPixel), bottom - this.pixelsPerPixel * 6, "#20FF20");
    window.addEventListener('keydown', (event) => this.HandleKeyDown(event));
    window.addEventListener('keyup', (event) => this.HandleKeyUp(event));
  }
  Update() {
    this.pixels.forEach(pixel => {
      pixel.Update(this.context, pixel.x += this.deltaX, pixel.y);
    });
  }
  HandleKeyDown(event: KeyboardEvent) {
    if (event.key == 'a') {
      this.deltaX = -this.pixelsPerPixel;
    }
    if (event.key == 'd') {
      this.deltaX = this.pixelsPerPixel;
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

// space invaders is 128 x 128 pixels
class Battlefield {
  canvas: HTMLCanvasElement;
  context: CanvasRenderingContext2D | null;
  interval: number | undefined;
  constructor(canvas : HTMLCanvasElement, width: number, height: number, updateBattleField: Function) {
    this.canvas = canvas;
    this.canvas.width = width;
    this.canvas.height = height;
    this.context = canvas.getContext("2d");
    this.context!.fillStyle = "black";
    this.context?.fillRect(0, 0, this.canvas.width, this.canvas.height);
    document.body.insertBefore(this.canvas, document.body.childNodes[0]);
    this.interval = setInterval(updateBattleField, 20);
  }

  Clear(): void {
    this.context?.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.context!.fillStyle = "black";
    this.context?.fillRect(0, 0, this.canvas.width, this.canvas.height);
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

export { Defender, Battlefield };