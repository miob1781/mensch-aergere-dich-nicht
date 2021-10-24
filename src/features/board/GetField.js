// creates playing fields

export const fields = []

for (let i = 0; i < 40; i++){
    const field = {}
    field.index = i
    field.player = null
    field.exit = null
    field.row = null
    field.column = null

    switch(i){
        case 9:
            field.exit = 'yellow'
            break
        case 19:
            field.exit = 'read'
            break
        case 29:
            field.exit = 'green'
            break
        case 39: 
            field.exit = 'blue'
            break
        default:
            field.exit = null
    }

    switch(i){
        case 0:
            field.row = 1
            field.column = 7
            break
        case 1:
            field.row = 2
            field.column = 7
            break
        case 2:
            field.row = 3
            field.column = 7
            break
        case 3:
            field.row = 4
            field.column = 7
            break
        case 4:
            field.row = 5
            field.column = 7
            break
        case 5:
            field.row = 5
            field.column = 8
            break
        case 6:
            field.row = 5
            field.column = 9
            break
        case 7:
            field.row = 5
            field.column = 10
            break
        case 8:
            field.row = 5
            field.column = 11
            break
        case 9:
            field.row = 6
            field.column = 11
            break
        case 10:
            field.row = 7
            field.column = 11
            break
        case 11:
            field.row = 7
            field.column = 10
            break
        case 12:
            field.row = 7
            field.column = 9
            break
        case 13:
            field.row = 7
            field.column = 8
            break
        case 14:
            field.row = 7
            field.column = 7
            break
        case 15:
            field.row = 8
            field.column = 7
            break
        case 16:
            field.row = 9
            field.column = 7
            break
        case 17:
            field.row = 10
            field.column = 7
            break
        case 18:
            field.row = 11
            field.column = 7
            break
        case 19:
            field.row = 11
            field.column = 6
            break
        case 20:
            field.row = 11
            field.column = 5
            break
        case 21:
            field.row = 10
            field.column = 5
            break
        case 22:
            field.row = 9
            field.column = 5
            break
        case 23:
            field.row = 8
            field.column = 5
            break
        case 24:
            field.row = 7
            field.column = 5
            break
        case 25:
            field.row = 7
            field.column = 4
            break
        case 26:
            field.row = 7
            field.column = 3
            break
        case 27:
            field.row = 7
            field.column = 2
            break
        case 28:
            field.row = 7
            field.column = 1
            break
        case 29:
            field.row = 6
            field.column = 1
            break
        case 30:
            field.row = 5
            field.column = 1
            break
        case 31:
            field.row = 5
            field.column = 2
            break
        case 32:
            field.row = 5
            field.column = 3
            break
        case 33:
            field.row = 5
            field.column = 4
            break
        case 34:
            field.row = 5
            field.column = 5
            break
        case 35:
            field.row = 4
            field.column = 5
            break
        case 36:
            field.row = 3
            field.column = 5
            break
        case 37:
            field.row = 2
            field.column = 5
            break
        case 38:
            field.row = 1
            field.column = 5
            break
        case 39:
            field.row = 1
            field.column = 6
            break
        default:
            alert('cannot assign a place to this field')
    }

    fields.push(field)
}

// creates start fields

export const playerStart = []

const getField = (index, player, row, column, isOccupied) => {
    const field = {}
    field.index = index
    field.player = player
    field.row = row
    field.column = column
    field.isOccupied = isOccupied
    return field   
}

const getStartFields = (player, row, column) => {
    playerStart.push(getField(1, player, row, column, true))
    playerStart.push(getField(2, player, row + 1, column, true))
    playerStart.push(getField(3, player, row, column + 1, true))
    playerStart.push(getField(4, player, row + 1, column + 1, true))
}

getStartFields('yellow', 1, 10)
getStartFields('red', 10, 10)
getStartFields('green', 10, 1)
getStartFields('blue', 1, 1)

// creates home fields

export const playerHome = []

playerHome.push(getField(1, 'yellow', 2, 6, false))
playerHome.push(getField(2, 'yellow', 3, 6, false))
playerHome.push(getField(3, 'yellow', 4, 6, false))
playerHome.push(getField(4, 'yellow', 5, 6, false))
playerHome.push(getField(1, 'red', 6, 10, false))
playerHome.push(getField(2, 'red', 6, 9, false))
playerHome.push(getField(3, 'red', 6, 8, false))
playerHome.push(getField(4, 'red', 6, 7, false))
playerHome.push(getField(1, 'green', 10, 6, false))
playerHome.push(getField(2, 'green', 9, 6, false))
playerHome.push(getField(3, 'green', 8, 6, false))
playerHome.push(getField(4, 'green', 7, 6, false))
playerHome.push(getField(1, 'blue', 6, 2, false))
playerHome.push(getField(2, 'blue', 6, 3, false))
playerHome.push(getField(3, 'blue', 6, 4, false))
playerHome.push(getField(4, 'blue', 6, 5, false))
