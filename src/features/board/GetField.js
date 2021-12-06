// creates field
const createField = () => {
    const field = {}
    field.index = null
    field.type = null
    field.color = null
    field.player = null
    field.row = null
    field.column = null
    field.figIndex = []
    field.isMoveFrom = false
    field.isMoveTo = false
    field.executeMove = null
    return field
}

// creates playing fields
const fields = []
for (let i = 0; i < 40; i++){
    const field = createField()
    field.index = i
    field.type = 'boardField'
    field.color = 'white'
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

const getField = (index, type, player, row, column) => {
    const field = createField()
    field.index = index
    field.type = type
    field.color = player
    field.row = row
    field.column = column
    return field   
}

const getStartFields = (player, row, column) => {
    let startFieldsForPlayer = [null]
    startFieldsForPlayer.push(getField(1, 'startField', player, row, column))
    startFieldsForPlayer.push(getField(2, 'startField', player, row + 1, column))
    startFieldsForPlayer.push(getField(3, 'startField', player, row, column + 1))
    startFieldsForPlayer.push(getField(4, 'startField', player, row + 1, column + 1))
    return startFieldsForPlayer
}

// creates start fields
const playerStart = {
    yellow: getStartFields('yellow', 1, 10),
    red: getStartFields('red', 10, 10),
    green: getStartFields('green', 10, 1),
    blue: getStartFields('blue', 1, 1)
}

// creates home fields
const playerHome = {
    yellow: [null],
    red: [null],
    green: [null],
    blue: [null]
}

playerHome.yellow.push(getField(1, 'homeField', 'yellow', 2, 6))
playerHome.yellow.push(getField(2, 'homeField', 'yellow', 3, 6))
playerHome.yellow.push(getField(3, 'homeField', 'yellow', 4, 6))
playerHome.yellow.push(getField(4, 'homeField', 'yellow', 5, 6,))
playerHome.red.push(getField(1, 'homeField', 'red', 6, 10))
playerHome.red.push(getField(2, 'homeField', 'red', 6, 9))
playerHome.red.push(getField(3, 'homeField', 'red', 6, 8))
playerHome.red.push(getField(4, 'homeField', 'red', 6, 7))
playerHome.green.push(getField(1, 'homeField', 'green', 10, 6))
playerHome.green.push(getField(2, 'homeField', 'green', 9, 6))
playerHome.green.push(getField(3, 'homeField', 'green', 8, 6))
playerHome.green.push(getField(4, 'homeField', 'green', 7, 6))
playerHome.blue.push(getField(1, 'homeField', 'blue', 6, 2))
playerHome.blue.push(getField(2, 'homeField', 'blue', 6, 3))
playerHome.blue.push(getField(3, 'homeField', 'blue', 6, 4))
playerHome.blue.push(getField(4, 'homeField', 'blue', 6, 5))

export {fields, playerStart, playerHome}
