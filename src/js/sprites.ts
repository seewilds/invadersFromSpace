import { CharacterSprite, Sprite } from "./types"

const ShieldSprite: Sprite = {
    rows: 16,
    cols: 22,
    pixels: [4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122, 123, 124, 125, 126, 127, 128, 129, 130, 131, 132, 133, 134, 135, 136, 137, 138, 139, 140, 141, 142, 143, 144, 145, 146, 147, 148, 149, 150, 151, 152, 153, 154, 155, 156, 157, 158, 159, 160, 161, 162, 163, 164, 165, 166, 167, 168, 169, 170, 171, 172, 173, 174, 175, 176, 177, 178, 179, 180, 181, 182, 183, 184, 185, 186, 187, 188, 189, 190, 191, 192, 193, 194, 195, 196, 197, 198, 199, 200, 201, 202, 203, 204, 205, 206, 207, 208, 209, 210, 211, 212, 213, 214, 215, 216, 217, 218, 219, 220, 221, 222, 223, 224, 225, 226, 227, 228, 229, 230, 231, 232, 233, 234, 235, 236, 237, 238, 239, 240, 241, 242, 243, 244, 245, 246, 247, 248, 249, 250, 251, 252, 253, 254, 255, 256, 257, 258, 259, 260, 261, 262, 263, 264, 265, 266, 267, 268, 269, 270, 286, 287, 288, 289, 290, 291, 308, 309, 310, 311, 312, 330, 331, 332, 333, 334, 279, 280, 281, 282, 283, 284, 285, 302, 303, 304, 305, 306, 307, 325, 326, 327, 328, 329, 347, 348, 349, 350, 351],
}

const Saucer: Sprite = {
    rows: 7,
    cols: 16,
    pixels: [4, 5, 6, 7, 8, 9, 10, 11, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 49, 50, 52, 53, 55, 56, 58, 59, 61, 62, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 81, 82, 83, 92, 93, 94, 98, 109],
}

const Shot: Sprite = {
    rows: 6,
    cols: 1,
    pixels: [1, 2, 3, 4, 5, 6]
}

const Explosion: Sprite = {
    rows: 8,
    cols: 12,
    pixels: [4, 7, 13, 17, 18, 22, 26, 33, 39, 44, 48, 49, 58, 59, 63, 68, 74, 77, 78, 81, 85, 88, 91, 94]
}

const DefenderSprite: Sprite = {
    rows: 13,
    cols: 8,
    pixels: [6, 18, 19, 20, 31, 32, 33, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99, 100, 101, 102, 103],
}

const Crab: CharacterSprite = {
    rows: 8,
    cols: 11,
    pixels: [2, 8, 14, 18, 24, 25, 26, 27, 28, 29, 30, 34, 35, 37, 38, 39, 41, 42, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 57, 58, 59, 60, 61, 62, 63, 65, 66, 68, 74, 76, 80, 81, 83, 84],
    alternatePixels: [2, 8, 11, 14, 18, 21, 22, 24, 25, 26, 27, 28, 29, 30, 32, 33, 34, 35, 37, 38, 39, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 57, 58, 59, 60, 61, 62, 63, 68, 74, 78, 86],
    laserPosition: 33
}

const Octopus: CharacterSprite = {
    rows: 8,
    cols: 12,
    pixels: [4, 5, 6, 7, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 41, 42, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 63, 64, 67, 68, 74, 75, 77, 78, 80, 81, 84, 85, 94, 95],
    alternatePixels: [4, 5, 6, 7, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 41, 42, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 62, 63, 64, 67, 68, 69, 73, 74, 77, 78, 81, 82, 86, 87, 92, 93],
    laserPosition: 52
}

const Squid: CharacterSprite = {
    rows: 8,
    cols: 8,
    pixels: [3, 4, 10, 11, 12, 13, 17, 18, 19, 20, 21, 22, 24, 25, 27, 28, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 42, 45, 49, 51, 52, 54, 56, 58, 61, 63],
    alternatePixels: [3, 4, 10, 11, 12, 13, 17, 18, 19, 20, 21, 22, 24, 25, 27, 28, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 41, 46, 48, 55, 57, 62],
    laserPosition: 21
}

const Zero: Sprite = {
    rows: 8,
    cols: 7,
    pixels: [9, 10, 11, 15, 19, 22, 25, 26, 29, 31, 33, 36, 37, 40, 43, 47, 51, 52, 53]
}

const One: Sprite = {
    rows: 8,
    cols: 7,
    pixels: [10, 16, 17, 24, 31, 38, 45, 51, 52, 53]
}

const Two: Sprite = {
    rows: 8,
    cols: 7,
    pixels: [9, 10, 11, 15, 19, 26, 31, 32, 37, 43, 50, 51, 52, 53, 54]
}

const Three: Sprite = {
    rows: 8,
    cols: 7,
    pixels: [8, 9, 10, 11, 12, 19, 25, 31, 32, 40, 43, 47, 51, 52, 53]
}

const Four: Sprite = {
    rows: 8,
    cols: 7,
    pixels: [11, 17, 18, 23, 25, 29, 32, 36, 37, 38, 39, 40, 46, 53]
}

const Five: Sprite = {
    rows: 8,
    cols: 7,
    pixels: [8, 9, 10, 11, 12, 15, 22, 23, 24, 25, 33, 40, 43, 47, 51, 52, 53]
}

const Six: Sprite = {
    rows: 8,
    cols: 7,
    pixels: [10, 11, 12, 16, 22, 29, 30, 31, 32, 36, 40, 43, 47, 51, 52, 53]
}

const Seven: Sprite = {
    rows: 8,
    cols: 7,
    pixels: [8, 9, 10, 11, 12, 19, 25, 31, 37, 44, 51]
}

const Eight: Sprite = {
    rows: 8,
    cols: 7,
    pixels: [9, 10, 11, 15, 19, 22, 26, 30, 31, 32, 36, 40, 43, 47, 51, 52, 53]
}

const Nine: Sprite = {
    rows: 8,
    cols: 7,
    pixels: [9, 10, 11, 15, 19, 22, 26, 30, 31, 32, 33, 40, 46, 50, 51, 52]
}

const A: Sprite = {
    rows: 8,
    cols: 7,
    pixels: [10, 16, 18, 22, 26, 29, 33, 36, 37, 38, 39, 40, 43, 47, 50, 54]
}

const B: Sprite = {
    rows: 8,
    cols: 7,
    pixels: [8, 9, 10, 11, 15, 19, 22, 26, 29, 30, 31, 32, 36, 40, 43, 47, 50, 51, 52, 53]
}

const C: Sprite = {
    rows: 8,
    cols: 7,
    pixels: [9, 10, 11, 15, 19, 22, 29, 36, 43, 47, 51, 52, 53]
}

const D: Sprite = {
    rows: 8,
    cols: 7,
    pixels: [8, 9, 10, 11, 15, 19, 22, 26, 29, 33, 36, 40, 43, 47, 50, 51, 52, 53]
}

const E: Sprite = {
    rows: 8,
    cols: 7,
    pixels: [8, 9, 10, 11, 12, 15, 22, 29, 30, 31, 32, 36, 43, 50, 51, 52, 53, 54]
}

const F: Sprite = {
    rows: 8,
    cols: 7,
    pixels: [8, 9, 10, 11, 12, 15, 22, 29, 30, 31, 32, 36, 43, 50]
}

const G: Sprite = {
    rows: 8,
    cols: 7,
    pixels: [9, 10, 11, 15, 19, 22, 29, 36, 38, 39, 40, 44, 47, 51, 52, 53]
}

const H: Sprite = {
    rows: 8,
    cols: 7,
    pixels: [8, 12, 15, 19, 22, 26, 29, 30, 31, 32, 33, 36, 40, 43, 47, 50, 54]
}

const I: Sprite = {
    rows: 8,
    cols: 7,
    pixels: [9, 10, 11, 17, 24, 31, 38, 45, 51, 52, 53]
}

const J: Sprite = {
    rows: 8,
    cols: 7,
    pixels: [8, 9, 10, 11, 12, 17, 24, 31, 38, 42, 45, 50, 51, 52]
}

const K: Sprite = {
    rows: 8,
    cols: 7,
    pixels: [8, 12, 15, 18, 22, 24, 29, 30, 36, 38, 43, 46, 50, 54]
}

const L: Sprite = {
    rows: 8,
    cols: 7,
    pixels: [8, 15, 22, 29, 36, 43, 50, 51, 52, 53, 54]
}

const M: Sprite = {
    rows: 8,
    cols: 7,
    pixels: [8, 12, 15, 16, 18, 19, 22, 24, 26, 29, 31, 33, 36, 40, 43, 47, 50, 54]
}

const N: Sprite = {
    rows: 8,
    cols: 7,
    pixels: [8, 12, 15, 19, 22, 23, 26, 29, 31, 33, 36, 39, 40, 43, 47, 50, 54]
}

const O: Sprite = {
    rows: 8,
    cols: 7,
    pixels: [9, 10, 11, 15, 19, 22, 26, 29, 33, 36, 40, 43, 47, 51, 52, 53]
}

const P: Sprite = {
    rows: 8,
    cols: 7,
    pixels: [8, 9, 10, 11, 15, 19, 22, 26, 29, 30, 31, 32, 36, 43, 50]
}

const Q: Sprite = {
    rows: 8,
    cols: 7,
    pixels: [9, 10, 11, 15, 19, 22, 26, 29, 31, 33, 36, 39, 40, 43, 47, 51, 52, 53, 55]
}

const R: Sprite = {
    rows: 8,
    cols: 7,
    pixels: [8, 9, 10, 11, 15, 19, 22, 26, 29, 30, 31, 32, 36, 38, 43, 46, 50, 54]
}

const S: Sprite = {
    rows: 8,
    cols: 7,
    pixels: [9, 10, 11, 15, 19, 22, 30, 31, 32, 40, 43, 47, 51, 52, 53]
}

const T: Sprite = {
    rows: 8,
    cols: 7,
    pixels: [8, 9, 10, 11, 12, 17, 24, 31, 38, 45, 52]
}

const U: Sprite = {
    rows: 8,
    cols: 7,
    pixels: [8, 12, 15, 19, 22, 26, 29, 33, 36, 40, 43, 47, 51, 52, 53]
}

const V: Sprite = {
    rows: 8,
    cols: 7,
    pixels: [8, 12, 15, 19, 22, 26, 29, 33, 36, 40, 44, 46, 52]
}

const W: Sprite = {
    rows: 8,
    cols: 7,
    pixels: [8, 12, 15, 19, 22, 26, 29, 33, 36, 38, 40, 43, 44, 46, 47, 50, 54]
}

const X: Sprite = {
    rows: 8,
    cols: 7,
    pixels: [8, 12, 16, 18, 24, 30, 37, 43, 45, 49, 53]
}

const Y: Sprite = {
    rows: 8,
    cols: 7,
    pixels: [8, 12, 16, 18, 24, 31, 38, 45, 52]
}

const Z: Sprite = {
    rows: 8,
    cols: 7,
    pixels: [8, 9, 10, 11, 12, 19, 25, 31, 37, 43, 50, 51, 52, 53, 54]
}

const SPACE: Sprite = {
    rows: 8,
    cols: 7,
    pixels: []
}

const characterConstants = {
    rows: 8,
    cols : 7
}

export { characterConstants, Zero, One, Two, Three, Four, Five, Six, Seven, Eight, Nine, A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P, Q, R, S, T, U, V, W, X, Y, Z, SPACE, ShieldSprite, Saucer, Shot, Explosion, DefenderSprite, Crab, Octopus, Squid }