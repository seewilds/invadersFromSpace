enum InvaderType{
    Squid,
    Crab,
    Octopus 
}

interface Position{
    x: number;
    y: number
}

interface Sprite {
    rows: number;
    cols: number;
    pixels: number[];    
}

interface CharacterSprite extends Sprite {
    alternatePixels: number[];
    laserPosition: number
}

type Character = {
    [key : string] : Sprite;  
}

interface InvaderRow {
    count : number;
    type : InvaderType;
    sprite : CharacterSprite;
    colour : string;
    directionStart : number
}

interface Level {
    setup : InvaderRow[];
    shieldCount : number
}

interface LevelState {
    points: number;
    lives: number;
    numberOfInvaders: number;
    initialized: boolean;
    running : boolean;
}

interface Game {
    levels: Level[]
}

interface RenderOptions{
    scale: number;
    targetFramesPerSecond: number
}

export { Character, CharacterSprite, Sprite,  Level, Game, InvaderType, InvaderRow, LevelState, RenderOptions, Position }