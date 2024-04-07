enum InvaderType{
    Squid,
    Crab,
    Octopus 
}

interface Sprite {
    rows: number;
    cols: number;
    pixels: number[];    
}

interface CharacterSprite extends Sprite {
    alternatePixels: number[];
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

export { Character, CharacterSprite, Sprite,  GameSetup, InvaderType, InvaderRow }