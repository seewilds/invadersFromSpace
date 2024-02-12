class Defender {
  context: CanvasRenderingContext2D;
  health: number;
  pixels: Pixel[];
  key: boolean;
  deltaX: number;
  constructor(context: CanvasRenderingContext2D) {
    this.context = context;
    this.deltaX = 0;
    this.pixels = new Array(14);
    for (let i = 0; i < 5; i++) {
      this.pixels[i] = new Pixel(5, 5, 300 + i * 5, 440, "#20FF20");
    }
    for (let i = 5; i < 10; i++) {
      this.pixels[i] = new Pixel(5, 5, 300 + (i - 5) * 5, 435, "#20FF20");
    }
    for (let i = 10; i < 13; i++) {
      this.pixels[i] = new Pixel(5, 5, 305 + (i - 10) * 5, 430, "#20FF20");
    }
    this.pixels[13] = new Pixel(5, 5, 310, 425, "#20FF20");
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
      this.deltaX = -1;
    }
    if (event.key == 'd') {
      this.deltaX = 1;
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