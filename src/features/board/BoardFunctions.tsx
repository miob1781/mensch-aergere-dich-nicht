import {Player, FieldType, Fig, Positions} from '../types'

/** utility function to create the position of an individual piece */
const getFig = (num: number, player: Player): Fig => {
    return {
        figIndex: num,
        player: player,
        type: FieldType.Start,
        fieldIndex: num
    }
}

/** utility function to return the positions of an indivdual player from a Player key */
const getPlayerPositions = (player: Player): Fig[] => {
    let positions: Fig[] = []
    for (let num=1; num<5; num++) {
        positions.push(getFig(num, player))
    }
    return positions
}

/** utility function to return a Player key from a Player value */
export const getPlayer = (color: string): Player => {
    if (color === 'yellow' || color === 'Yellow') {return Player.Yellow}
    else if (color === 'red' || color === 'Red') {return Player.Red}
    else if (color === 'green' || color === 'Green') {return Player.Green}
    else if (color === 'blue' || color === 'Blue') {return Player.Blue}
    else {return Player.None}
}

/** utility function to return a Player value from a Player key */
export const getStringFromPlayer = (color: Player): string => {
    if (color === Player.Yellow) {return 'Yellow'}
    else if (color === Player.Red) {return 'Red'}
    else if (color === Player.Green) {return 'Green'}
    else if (color === Player.Blue) {return 'Blue'}
    else {return 'None'}
}

/** contains positions of all players */
export const allPositions: {[color: string]: Positions} = {}
for (let playerString in Player) {
    const player: Player = getPlayer(playerString)
    if (player === Player.None) {continue}
    allPositions[playerString] = {
        positions: getPlayerPositions(player),
        numFigsOut: 0,
        lastFreeHomeField: 4
    }
}
