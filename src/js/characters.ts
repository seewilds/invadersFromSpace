import { Sprite, Character } from "./types"

const Zero : Sprite = {
    rows : 7, 
    cols: 8,
    pixels: [9,10,11,15,19,22,25,26,28,30,32,35,36,39,42,46,50,51,52]
}

const One : Sprite = {
    rows : 7, 
    cols: 8,
    pixels: [10,16,17,24,30,37,44,50,51,52]
}

const Two : Sprite = {
    rows : 7, 
    cols: 8,
    pixels: [9,10,11,15,19,26,30,31,36,42,49,50,51,52,53]
}

const Three : Sprite = {
    rows : 7, 
    cols: 8,
    pixels: [8,9,10,11,12,19,25,30,31,39,42,46,50,51,52]
}

const Four : Sprite = {
    rows : 7, 
    cols: 8,
    pixels: [11,17,18,23,25,28,31,35,36,37,38,39,45,52]
}

const Five : Sprite = {
    rows : 7, 
    cols: 8,
    pixels: [8,9,10,11,12,15,22,23,24,25,32,39,42,46,50,51,52]
}

const Six : Sprite = {
    rows : 7, 
    cols: 8,
    pixels: [10,11,12,16,22,28,29,30,31,35,39,42,46,50,51,52]
}

const Seven : Sprite = {
    rows : 7, 
    cols: 8,
    pixels: [8,9,10,11,12,19,25,30,36,43,50]
}

const Eight : Sprite = {
    rows : 7, 
    cols: 8,
    pixels: [9,10,11,15,19,22,26,29,30,31,35,39,42,46,50,51,52]
}

const Nine : Sprite = {
    rows : 7, 
    cols: 8,
    pixels: [9,10,11,15,19,22,26,29,30,31,32,39,45,49,50,51]
}


const ascii: Character = {
    "0" : Zero,
    "1" : One,
    "2" : Two,
    "3" : Three,
    "4" : Four,
    "5" : Five,
    "6" : Six,
    "7" : Seven, 
    "8" : Eight, 
    "9" : Nine
}