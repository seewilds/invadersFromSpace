enum InvaderType{
    Squid,
    Crab,
    Octopus 
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

interface GameSetup {
    setup : InvaderRow[];
    shieldCount : number
}

interface Sprite {
    rows: number;
    cols: number;
    pixels: number[];
    
}

interface CharacterSprite extends Sprite {
    alternatePixels: number[];
}



export { Character, CharacterSprite, Sprite,  GameSetup, InvaderType }