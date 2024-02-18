class Defender {
  context: CanvasRenderingContext2D;
  health: number;
  pixels: Pixel[];
  key: boolean;
  deltaX: number;
  pixelsPerPixel : number;
  interval : number | undefined;
  constructor(pixelsPerPixel : number, boardDimension : number, context: CanvasRenderingContext2D) {
    this.context = context;
    this.deltaX = 0;
    this.pixelsPerPixel = pixelsPerPixel;
    let bottom = boardDimension  - 13 * pixelsPerPixel;
    let left = Math.round(boardDimension / 2 - 13 / 2);
    this.pixels = spriteFactory(8, 13, pixelsPerPixel, left, bottom,  [6,18,19,20,31,32,33,40,41,42,43,44,45,46,47,48,49,50,52,53,54,55,56,57,58,59,60,61,62,63,64,65,66,67,68,69,70,71,72,73,74,75,76,77,78,79,80,81,82,83,84,85,86,87,88,89,90,91,92,93,94,95,96,97,98,99,100,101,102,103], "#1FFE1F");
    this.interval = setInterval(()=>this.Update(), 20); 
    window.addEventListener('keydown', (event) => this.HandleKeyDown(event));
    window.addEventListener('keyup', (event) => this.HandleKeyUp(event));

  }
  Update() {
    this.context.fillStyle = "black";
    this.context.clearRect(this.pixels[0].x - 6 * this.pixelsPerPixel, this.pixels[0].y, 13 * this.pixelsPerPixel, 8 * this.pixelsPerPixel);
    this.context.fillRect(this.pixels[0].x - 6 * this.pixelsPerPixel, this.pixels[0].y, 13 * this.pixelsPerPixel, 8 * this.pixelsPerPixel);
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

function spriteFactory(height : number, width : number, pixelsPerPixel : number, xStart :number, yStart : number, activePixels : number[], colour : string){
  let spriteArray = new Array(activePixels.length);
  let activePixelsSet = 0;
  let loopNumber = 0;
  for(let i = 0; i < height; i++){
    for(let j = 0; j < width; j++){      
      
      if(activePixels.includes(loopNumber)){
        spriteArray[activePixelsSet] = new Pixel(pixelsPerPixel, pixelsPerPixel, xStart - j * pixelsPerPixel, yStart + pixelsPerPixel * i , colour);
        activePixelsSet++;
      }
      loopNumber++;
    }
  }
  return spriteArray;
}

class Octopus {
  context: CanvasRenderingContext2D;
  health: number;
  pixels: Pixel[];
  pixelAActive : boolean;
  key: boolean;
  deltaX: number;
  pixelsPerPixel : number;
  left : number;
  bottom : number;
  interval: number | undefined;
  constructor(pixelsPerPixel : number, boardDimension : number, context: CanvasRenderingContext2D) {
    this.context = context;
    this.deltaX = 0;
    this.pixelsPerPixel = pixelsPerPixel;
    this.bottom = boardDimension / 2;
    this.left = Math.round(boardDimension / 2 - 13 / 2);
    this.pixels = spriteFactory(8, 12, pixelsPerPixel, this.left, this.bottom, [4,5,6,7,13,14,15,16,17,18,19,20,21,22,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,41,42,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,63,64,67,68,74,75,77,78,80,81,84,85,94,95], "blue");
    this.pixelAActive = true;
    this.interval = setInterval(() => this.Update(), 200);
  }
  Update() {
    this.context.fillStyle = "black";
    this.context.fillRect(this.pixels[0].x - 7 * this.pixelsPerPixel, this.pixels[0].y, 12 * this.pixelsPerPixel, 8 * this.pixelsPerPixel);
    if(this.pixelAActive){
      this.pixels = spriteFactory(8, 12, this.pixelsPerPixel, this.left, this.bottom, [4,5,6,7,13,14,15,16,17,18,19,20,21,22,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,41,42,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,62,63,64,67,68,69,73,74,77,78,81,82,86,87,92,93], "blue")
      this.pixelAActive = false;
    } else{
      this.pixels = spriteFactory(8, 12, this.pixelsPerPixel, this.left, this.bottom, [4,5,6,7,13,14,15,16,17,18,19,20,21,22,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,41,42,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,63,64,67,68,74,75,77,78,80,81,84,85,94,95], "blue");
      this.pixelAActive = true;
    }
    this.pixels.forEach(pixel => {
      pixel.Update(this.context, pixel.x += this.deltaX, pixel.y);
    });
  }
}


class Shield {
  context: CanvasRenderingContext2D;
  pixels: Pixel[];
  key: boolean;
  deltaX: number;
  pixelsPerPixel : number;
  constructor(pixelsPerPixel : number, boardDimension : number, context: CanvasRenderingContext2D) {
    this.context = context;
    this.deltaX = 0;
    this.pixelsPerPixel = pixelsPerPixel;
    let bottom = boardDimension / 4;
    let left = Math.round(boardDimension / 2 - 13 / 2);
    this.pixels = spriteFactory(16, 22, pixelsPerPixel, left, bottom, [4,5,6,7,8,9,10,11,12,13,14,15,16,17,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,67,68,69,70,71,72,73,74,75,76,77,78,79,80,81,82,83,84,85,86,88,89,90,91,92,93,94,95,96,97,98,99,100,101,102,103,104,105,106,107,108,109,110,111,112,113,114,115,116,117,118,119,120,121,122,123,124,125,126,127,128,129,130,131,132,133,134,135,136,137,138,139,140,141,142,143,144,145,146,147,148,149,150,151,152,153,154,155,156,157,158,159,160,161,162,163,164,165,166,167,168,169,170,171,172,173,174,175,176,177,178,179,180,181,182,183,184,185,186,187,188,189,190,191,192,193,194,195,196,197,198,199,200,201,202,203,204,205,206,207,208,209,210,211,212,213,214,215,216,217,218,219,220,221,222,223,224,225,226,227,228,229,230,231,232,233,234,235,236,237,238,239,240,241,242,243,244,245,246,247,248,249,250,251,252,253,254,255,256,257,258,259,260,261,262,263,264,265,266,267,268,269,270,286,287,288,289,290,291,308,309,310,311,312,330,331,332,333,334,279,280,281,282,283,284,285,302,303,304,305,306,307,325,326,327,328,329,347,348,349,350,351], "#1FFE1F");
  }
  Update() {
    this.pixels.forEach(pixel => {
      pixel.Update(this.context, pixel.x += this.deltaX, pixel.y);
    });
  }
}

class Spaceship {
  context: CanvasRenderingContext2D;
  pixels: Pixel[];
  key: boolean;
  deltaX: number;
  pixelsPerPixel : number;
  constructor(pixelsPerPixel : number, boardDimension : number, context: CanvasRenderingContext2D) {
    this.context = context;
    this.deltaX = 0;
    this.pixelsPerPixel = pixelsPerPixel;
    let bottom = boardDimension / 4;
    let left = Math.round(boardDimension / 2 - 13 / 2);
    this.pixels = spriteFactory(7, 16, pixelsPerPixel, left, bottom, [4,5,6,7,8,9,10,11,19,20,21,22,23,24,25,26,27,28,34,35,36,37,38,39,40,41,42,43,44,45,49,50,52,53,55,56,58,59,61,62,64,65,66,67,68,69,70,71,72,73,74,75,76,77,78,79,81,82,83,92,93,94,98,109], "orange");
  }
  Update() {
    this.pixels.forEach(pixel => {
      pixel.Update(this.context, pixel.x += this.deltaX, pixel.y);
    });
  }
}

class Crab {
  context: CanvasRenderingContext2D;
  health: number;
  pixels: Pixel[];
  pixelAActive : boolean;
  key: boolean;
  deltaX: number;
  pixelsPerPixel : number;
  left : number;
  bottom : number;
  interval: number | undefined;
  constructor(pixelsPerPixel : number, boardDimension : number, context: CanvasRenderingContext2D) {
    this.context = context;
    this.deltaX = 0;
    this.pixelsPerPixel = pixelsPerPixel;
    this.bottom = boardDimension / 2;// - this.pixelsPerPixel * 2;
    this.left = Math.round(boardDimension / 2 - 13 / 2);
    this.pixels = spriteFactory(8, 11, this.pixelsPerPixel, this.left, this.bottom, [2,8,14,18,24,25,26,27,28,29,30,34,35,37,38,39,41,42,44,45,46,47,48,49,50,51,52,53,54,55,57,58,59,60,61,62,63,65,66,68,74,76,80,81,83,84], "pink");
    this.pixelAActive = true;
    this.interval = setInterval(() => this.Update(), 200);
    console.log(this.pixels[0])
    console.log(this)
  }
  Update() {
    this.context.fillStyle = "black";    
    this.context.fillRect(this.pixels[0].x - 8 * this.pixelsPerPixel, this.pixels[0].y, 11 * this.pixelsPerPixel, 8 * this.pixelsPerPixel);
    if(this.pixelAActive){
      this.pixels = spriteFactory(8, 11, this.pixelsPerPixel, this.left, this.bottom, [2,8,11,14,18,21,22,24,25,26,27,28,29,30,32,33,34,35,37,38,39,41,42,43,44,45,46,47,48,49,50,51,52,53,54,57,58,59,60,61,62,63,68,74,78,86], "pink");
      this.pixelAActive = false;
    } else{
      this.pixels = spriteFactory(8, 11, this.pixelsPerPixel, this.left, this.bottom, [2,8,14,18,24,25,26,27,28,29,30,34,35,37,38,39,41,42,44,45,46,47,48,49,50,51,52,53,54,55,57,58,59,60,61,62,63,65,66,68,74,76,80,81,83,84], "pink");
      this.pixelAActive = true;
    }
    this.pixels.forEach(pixel => {
      pixel.Update(this.context, pixel.x += this.deltaX, pixel.y);
    });
  }
}



class Squid {
  context: CanvasRenderingContext2D;
  health: number;
  pixels: Pixel[];
  pixelAActive : boolean;
  key: boolean;
  deltaX: number;
  pixelsPerPixel : number;
  left : number;
  bottom : number;
  interval: number | undefined;
  constructor(pixelsPerPixel : number, boardDimension : number, context: CanvasRenderingContext2D) {
    this.context = context;
    this.deltaX = 0;
    this.pixels = new Array(14);
    this.pixelsPerPixel = pixelsPerPixel;
    this.bottom = boardDimension / 7;
    this.left = Math.round(boardDimension / 2 - 13 / 2);
    this.pixels = spriteFactory(8, 8, pixelsPerPixel, this.left, this.bottom,  [3,4,10,11,12,13,17,18,19,20,21,22,24,25,27,28,30,31,32,33,34,35,36,37,38,39,42,45,49,51,52,54,56,58,61,63], "red");
    this.pixelAActive = true;
    this.interval = setInterval(() => this.Update(), 200);
  }
  Update() {
    this.context.fillStyle = "black";
    this.context.fillRect(this.pixels[0].x - 4 * this.pixelsPerPixel - 1, this.pixels[0].y, 8 * this.pixelsPerPixel + 2, 8 * this.pixelsPerPixel + 1);
    if(this.pixelAActive){
      this.pixels = spriteFactory(8, 8, this.pixelsPerPixel, this.left, this.bottom, [3,4,10,11,12,13,17,18,19,20,21,22,24,25,27,28,30,31,32,33,34,35,36,37,38,39,42,45,49,51,52,54,56,58,61,63], "red");
      this.pixelAActive = false;
    } else{
      this.pixels = spriteFactory(8, 8, this.pixelsPerPixel, this.left, this.bottom, [3,4,10,11,12,13,17,18,19,20,21,22,24,25,27,28,30,31,32,33,34,35,36,37,38,39,41,46,48,55,57,62], "red");
      this.pixelAActive = true;
    }
    this.pixels.forEach(pixel => {
      pixel.Update(this.context, pixel.x += this.deltaX, pixel.y);
    });
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
    //this.interval = setInterval(updateBattleField, 20);
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

export { Defender, Octopus, Battlefield, Crab, Squid, Shield, Spaceship };