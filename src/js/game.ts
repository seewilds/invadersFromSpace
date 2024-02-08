class Defender {
  health : number;
}

class Battlefield {
  canvas : HTMLCanvasElement;
  context : CanvasRenderingContext2D | null;
  interval: number |undefined;
  constructor() {
    this.canvas.width = 480;
    this.canvas.height = 270;
    this.context = this.canvas.getContext("2d");
    document.body.insertBefore(this.canvas, document.body.childNodes[0]);
    //this.interval = setInterval(updateGameArea, 20);
  }

  Clear() : void {
    this.context?.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }
}
