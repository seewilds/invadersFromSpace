enum InvaderType{
    Squid,
    Crab,
    Octopus
}

interface InvaderRow {
    count : number;
    type : InvaderType;
    sprite : Sprite;
    colour : string
}

interface GameSetup {
    setup : InvaderRow[];
}

interface Sprite {
    rows: number;
    cols: number;
    activePixels: number[];
    activePixelsAlt: number[];
}

const Crab: Sprite = {
    rows: 8,
    cols: 11,
    activePixels: [2, 8, 14, 18, 24, 25, 26, 27, 28, 29, 30, 34, 35, 37, 38, 39, 41, 42, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 57, 58, 59, 60, 61, 62, 63, 65, 66, 68, 74, 76, 80, 81, 83, 84],
    activePixelsAlt: [2, 8, 11, 14, 18, 21, 22, 24, 25, 26, 27, 28, 29, 30, 32, 33, 34, 35, 37, 38, 39, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 57, 58, 59, 60, 61, 62, 63, 68, 74, 78, 86],
}

const Octopus: Sprite = {
    rows: 8,
    cols: 12,
    activePixels: [4, 5, 6, 7, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 41, 42, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 63, 64, 67, 68, 74, 75, 77, 78, 80, 81, 84, 85, 94, 95],
    activePixelsAlt: [4, 5, 6, 7, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 41, 42, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 62, 63, 64, 67, 68, 69, 73, 74, 77, 78, 81, 82, 86, 87, 92, 93],
}

const Squid: Sprite = {
    rows: 8,
    cols: 8,
    activePixels: [3, 4, 10, 11, 12, 13, 17, 18, 19, 20, 21, 22, 24, 25, 27, 28, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 42, 45, 49, 51, 52, 54, 56, 58, 61, 63],
    activePixelsAlt: [3, 4, 10, 11, 12, 13, 17, 18, 19, 20, 21, 22, 24, 25, 27, 28, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 41, 46, 48, 55, 57, 62],
}

const Shield : Sprite = {
    rows: 16,
    cols: 22,
    activePixels: [4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122, 123, 124, 125, 126, 127, 128, 129, 130, 131, 132, 133, 134, 135, 136, 137, 138, 139, 140, 141, 142, 143, 144, 145, 146, 147, 148, 149, 150, 151, 152, 153, 154, 155, 156, 157, 158, 159, 160, 161, 162, 163, 164, 165, 166, 167, 168, 169, 170, 171, 172, 173, 174, 175, 176, 177, 178, 179, 180, 181, 182, 183, 184, 185, 186, 187, 188, 189, 190, 191, 192, 193, 194, 195, 196, 197, 198, 199, 200, 201, 202, 203, 204, 205, 206, 207, 208, 209, 210, 211, 212, 213, 214, 215, 216, 217, 218, 219, 220, 221, 222, 223, 224, 225, 226, 227, 228, 229, 230, 231, 232, 233, 234, 235, 236, 237, 238, 239, 240, 241, 242, 243, 244, 245, 246, 247, 248, 249, 250, 251, 252, 253, 254, 255, 256, 257, 258, 259, 260, 261, 262, 263, 264, 265, 266, 267, 268, 269, 270, 286, 287, 288, 289, 290, 291, 308, 309, 310, 311, 312, 330, 331, 332, 333, 334, 279, 280, 281, 282, 283, 284, 285, 302, 303, 304, 305, 306, 307, 325, 326, 327, 328, 329, 347, 348, 349, 350, 351],
    activePixelsAlt: [4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122, 123, 124, 125, 126, 127, 128, 129, 130, 131, 132, 133, 134, 135, 136, 137, 138, 139, 140, 141, 142, 143, 144, 145, 146, 147, 148, 149, 150, 151, 152, 153, 154, 155, 156, 157, 158, 159, 160, 161, 162, 163, 164, 165, 166, 167, 168, 169, 170, 171, 172, 173, 174, 175, 176, 177, 178, 179, 180, 181, 182, 183, 184, 185, 186, 187, 188, 189, 190, 191, 192, 193, 194, 195, 196, 197, 198, 199, 200, 201, 202, 203, 204, 205, 206, 207, 208, 209, 210, 211, 212, 213, 214, 215, 216, 217, 218, 219, 220, 221, 222, 223, 224, 225, 226, 227, 228, 229, 230, 231, 232, 233, 234, 235, 236, 237, 238, 239, 240, 241, 242, 243, 244, 245, 246, 247, 248, 249, 250, 251, 252, 253, 254, 255, 256, 257, 258, 259, 260, 261, 262, 263, 264, 265, 266, 267, 268, 269, 270, 286, 287, 288, 289, 290, 291, 308, 309, 310, 311, 312, 330, 331, 332, 333, 334, 279, 280, 281, 282, 283, 284, 285, 302, 303, 304, 305, 306, 307, 325, 326, 327, 328, 329, 347, 348, 349, 350, 351],
}

const Saucer : Sprite = {
    rows: 7,
    cols: 16,
    activePixels: [4, 5, 6, 7, 8, 9, 10, 11, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 49, 50, 52, 53, 55, 56, 58, 59, 61, 62, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 81, 82, 83, 92, 93, 94, 98, 109],
    activePixelsAlt: [4, 5, 6, 7, 8, 9, 10, 11, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 49, 50, 52, 53, 55, 56, 58, 59, 61, 62, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 81, 82, 83, 92, 93, 94, 98, 109],
}

const Shot : Sprite = {
    rows: 6,
    cols: 1,
    activePixels: [1,2,3,4,5,6],
    activePixelsAlt: [1,2,3,4,5,6],
}

const Explosion : Sprite = {
    rows: 13,
    cols: 8,
    activePixels: [4,8,14,18,20,24,28,36,42,48,42,43,53,54,5864,70,73,75,78,72,75,79,82],
    activePixelsAlt: [4,8,14,18,20,24,28,36,42,48,42,43,53,54,5864,70,73,75,78,72,75,79,82],
}

const DefenderSprite : Sprite = {
    rows: 13,
    cols: 8,
    activePixels:  [6, 18, 19, 20, 31, 32, 33, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99, 100, 101, 102, 103],
    activePixelsAlt:  [6, 18, 19, 20, 31, 32, 33, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99, 100, 101, 102, 103],
}

export { Sprite, Octopus, Crab, Squid, Shield, Saucer, Shot, Explosion, GameSetup, InvaderType, DefenderSprite }