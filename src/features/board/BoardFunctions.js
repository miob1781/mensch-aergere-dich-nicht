import styled from 'styled-components'

// functions to initialize and keep track of player positions
const getFig = (num, player) => {
    return {
        figIndex: num,
        player: player,
        type: 'startField',
        fieldIndex: num
    }
}

const getPositions = player => {
    let positions = []
    for (let num=1; num<5; num++) {
        positions.push(getFig(num, player))
    }
    return positions
}

export const positions = {}
for (let player of ['yellow', 'red', 'green', 'blue']) {
    positions[player] = {
        positions: getPositions(player),
        numFigsOut: 0,
        lastFreeHomeField: 4
    }
}

// colors for home and start fields
export const fieldColors = {
    yellow: 'moccasin',
    red: 'salmon',
    green: 'lightgreen',
    blue: 'lightblue'
}

// creates a field element
export const getFieldContainer = (row, column, fieldColor, borderColor, borderWidth, borderStyle, cursor) => {
    return styled.div`
        grid-row-start: ${row};
        grid-column-start: ${column};
        border-radius: 50%;
        border-color: ${borderColor};
        border-width: ${borderWidth};
        border-style: ${borderStyle};
        background-color: ${fieldColor};
        cursor: ${cursor};
        @media only screen and (max-width: 600px) {
            border-width: ${borderColor === 'black' ? '0.8vw' : 'none'};
        }
    `
}
