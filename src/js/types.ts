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

interface Game {
    levels: Level[]
}

export { Character, CharacterSprite, Sprite,  Level, Game, InvaderType, InvaderRow }