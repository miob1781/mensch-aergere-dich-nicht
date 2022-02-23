import {Field, HomeOrStartFields, FieldType, Player} from '../types'

/** function to create a new generic field */
const createField = (index: number, type: FieldType, color: Player, row: number, column: number): Field => {
    const field: Field = {
        index: index,
        type: type,
        color: color,
        player: Player.None,
        row: row,
        column: column,
        figIndexArray: [],
        isMoveFrom: false,
        isMoveTo: false,
        executeMove: null
    }
    return field
}

// creates board fields
/** array of all board fields */
const boardFields: Field[] = []
let row: number, column: number
for (let i = 0; i < 40; i++){
    switch(i){
        case 0:
            row = 1
            column = 7
            break
        case 1:
            row = 2
            column = 7
            break
        case 2:
            row = 3
            column = 7
            break
        case 3:
            row = 4
            column = 7
            break
        case 4:
            row = 5
            column = 7
            break
        case 5:
            row = 5
            column = 8
            break
        case 6:
            row = 5
            column = 9
            break
        case 7:
            row = 5
            column = 10
            break
        case 8:
            row = 5
            column = 11
            break
        case 9:
            row = 6
            column = 11
            break
        case 10:
            row = 7
            column = 11
            break
        case 11:
            row = 7
            column = 10
            break
        case 12:
            row = 7
            column = 9
            break
        case 13:
            row = 7
            column = 8
            break
        case 14:
            row = 7
            column = 7
            break
        case 15:
            row = 8
            column = 7
            break
        case 16:
            row = 9
            column = 7
            break
        case 17:
            row = 10
            column = 7
            break
        case 18:
            row = 11
            column = 7
            break
        case 19:
            row = 11
            column = 6
            break
        case 20:
            row = 11
            column = 5
            break
        case 21:
            row = 10
            column = 5
            break
        case 22:
            row = 9
            column = 5
            break
        case 23:
            row = 8
            column = 5
            break
        case 24:
            row = 7
            column = 5
            break
        case 25:
            row = 7
            column = 4
            break
        case 26:
            row = 7
            column = 3
            break
        case 27:
            row = 7
            column = 2
            break
        case 28:
            row = 7
            column = 1
            break
        case 29:
            row = 6
            column = 1
            break
        case 30:
            row = 5
            column = 1
            break
        case 31:
            row = 5
            column = 2
            break
        case 32:
            row = 5
            column = 3
            break
        case 33:
            row = 5
            column = 4
            break
        case 34:
            row = 5
            column = 5
            break
        case 35:
            row = 4
            column = 5
            break
        case 36:
            row = 3
            column = 5
            break
        case 37:
            row = 2
            column = 5
            break
        case 38:
            row = 1
            column = 5
            break
        case 39:
            row = 1
            column = 6
            break
        default:
            row = -1
            column = -1
            break
    }
    const field: Field = createField(i, FieldType.Board, Player.None, row, column)
    boardFields.push(field)
}

/** function to create start fields */
const getStartFields = (color: Player, row: number, column: number): Field[]  => {
    let startFieldsForPlayer: Field[] = []
    // dummy entry to match index of array with index of field
    startFieldsForPlayer.push(createField(0, FieldType.Start, color, -1, -1))
    startFieldsForPlayer.push(createField(1, FieldType.Start, color, row, column))
    startFieldsForPlayer.push(createField(2, FieldType.Start, color, row + 1, column))
    startFieldsForPlayer.push(createField(3, FieldType.Start, color, row, column + 1))
    startFieldsForPlayer.push(createField(4, FieldType.Start, color, row + 1, column + 1))
    return startFieldsForPlayer
}

/** object of all start fields */
const startFields: HomeOrStartFields = {
    Yellow: getStartFields(Player.Yellow, 1, 10),
    Red: getStartFields(Player.Red, 10, 10),
    Green: getStartFields(Player.Green, 10, 1),
    Blue: getStartFields(Player.Blue, 1, 1)
}

// creates home fields
/** object of all home fields */
const homeFields: HomeOrStartFields = {
    Yellow: [],
    Red: [],
    Green: [],
    Blue: []
}

// dummy entry to match index of array with index of field
homeFields.Yellow.push(createField(0, FieldType.Home, Player.Yellow, -1, -1))
homeFields.Yellow.push(createField(1, FieldType.Home, Player.Yellow, 2, 6))
homeFields.Yellow.push(createField(2, FieldType.Home, Player.Yellow, 3, 6))
homeFields.Yellow.push(createField(3, FieldType.Home, Player.Yellow, 4, 6))
homeFields.Yellow.push(createField(4, FieldType.Home, Player.Yellow, 5, 6,))

// dummy entry to match index of array with index of field
homeFields.Red.push(createField(0, FieldType.Home, Player.Red, -1, -1))
homeFields.Red.push(createField(1, FieldType.Home, Player.Red, 6, 10))
homeFields.Red.push(createField(2, FieldType.Home, Player.Red, 6, 9))
homeFields.Red.push(createField(3, FieldType.Home, Player.Red, 6, 8))
homeFields.Red.push(createField(4, FieldType.Home, Player.Red, 6, 7))

// dummy entry to match index of array with index of field
homeFields.Green.push(createField(0, FieldType.Home, Player.Green, -1, -1))
homeFields.Green.push(createField(1, FieldType.Home, Player.Green, 10, 6))
homeFields.Green.push(createField(2, FieldType.Home, Player.Green, 9, 6))
homeFields.Green.push(createField(3, FieldType.Home, Player.Green, 8, 6))
homeFields.Green.push(createField(4, FieldType.Home, Player.Green, 7, 6))

// dummy entry to match index of array with index of field
homeFields.Blue.push(createField(0, FieldType.Home, Player.Blue, -1, -1))
homeFields.Blue.push(createField(1, FieldType.Home, Player.Blue, 6, 2))
homeFields.Blue.push(createField(2, FieldType.Home, Player.Blue, 6, 3))
homeFields.Blue.push(createField(3, FieldType.Home, Player.Blue, 6, 4))
homeFields.Blue.push(createField(4, FieldType.Home, Player.Blue, 6, 5))

export {boardFields, startFields, homeFields}
