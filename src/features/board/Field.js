import styled from 'styled-components'

const fieldColors = {
    yellow: 'moccasin',
    red: 'salmon',
    green: 'lightgreen',
    blue: 'lightblue'
}

const getFieldContainer = (row, column, fieldColor, borderColor, borderWidth, borderStyle, cursor) => {
    return styled.div`
        grid-row-start: ${row};
        grid-column-start: ${column};
        border-radius: 50%;
        border-color: ${borderColor};
        border-width: ${borderWidth};
        border-style: ${borderStyle};
        background-color: ${fieldColor};
        cursor: ${cursor};
    `
}

export function Field(props) {
    const {
        field,
        playerOn,
        gotMoves,
        mouseOverMoveFrom,
        setMouseOverMoveFrom,
        figIndexMouse,
        setFigIndexMouse
    } = props

    const {
        index,
        row,
        column,
        color,
        player,
        isMoveFrom,
        isMoveTo,
        figIndex,
        executeMove
    } = field
    
    // sets the field color displayed
    let fieldColor = color
    if (player) {
        fieldColor = player
    } else if (color !== 'white') {
        fieldColor = fieldColors[color]
    }

    // sets border
    let borderColor, borderWidth, borderStyle
    if (mouseOverMoveFrom && isMoveTo && figIndex.includes(figIndexMouse)) {
        borderColor = playerOn
        borderWidth = '5px'
        borderStyle = 'dotted'
    } else if (index % 10 === 0) {
        borderColor = 'black'
        borderWidth = '4px'
        borderStyle = 'solid'
    } else {
        borderColor = 'none'
        borderWidth = 'none'
        borderStyle = 'none'
    }

    // sets cursor
    let cursor
    isMoveFrom ? cursor = 'pointer' : cursor = 'inherit'

    // creates FieldContainer
    const FieldContainer = getFieldContainer(
        row,
        column,
        fieldColor,
        borderColor,
        borderWidth,
        borderStyle,
        cursor
    )

    const handleMouseOver = () => {
        if (isMoveFrom && gotMoves) {
            setMouseOverMoveFrom(true)
            setFigIndexMouse(figIndex[0])
        }
    }

    const handleMouseOut = () => {
        setMouseOverMoveFrom(false)
    }

    const handleClick = () => {
        if (isMoveFrom && gotMoves) {
            executeMove()
        }
    }

    return (
        <FieldContainer
            onMouseOver={handleMouseOver}
            onMouseOut={handleMouseOut}
            onClick={handleClick} />
    )
}
