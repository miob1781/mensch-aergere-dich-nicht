import {useSelector, useDispatch} from 'react-redux'
import {fieldColors, getFieldContainer} from './BoardFunctions.js'
import {setMouseOver, setMouseOut} from './BoardSlice.js'

export function Field(props) {
    const {index, row, column, type, color} = props
    const dispatch = useDispatch()

    // selects field-specific values from the global state
    const field = useSelector(state => {
        let field
        if (type === 'boardField') {
            field = state.board.boardFields[index]
        } else if (type === 'startField') {
            field = state.board.startFields[color][index]
        } else {
            field = state.board.homeFields[color][index]
        }
        return field
    }) 
    const {player, isMoveFrom, isMoveTo, figIndex, executeMove} = field
    const readyToMove = useSelector(state => isMoveFrom && state.board.gotMoves)
    const displayDottedBorder = useSelector(state => {
        const playerOn = state.board.playerOn
        const computerOn = state.start.players[playerOn].computerPlays
        return isMoveTo && state.board.mouseOverMoveFrom && !computerOn && figIndex.includes(state.board.figIndexMouse)
    })
    const playerOn = useSelector(state => displayDottedBorder ? state.board.playerOn : null)

    // sets the field color displayed
    let fieldColor = color
    if (player) {
        fieldColor = player
    } else if (color !== 'white') {
        fieldColor = fieldColors[color]
    }

    // sets border
    let borderColor, borderWidth, borderStyle
    if (displayDottedBorder) {
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
    const cursor = readyToMove ? 'pointer' : 'inherit'

    // creates field
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
        if (readyToMove && !('ontouchstart' in window)) {
            dispatch(setMouseOver(figIndex[0]))
        }
    }

    const handleMouseOut = () => {
        dispatch(setMouseOut())
    }

    const handleClick = () => {
        if (readyToMove) {
            executeMove()
        }
    }

    return (
        <FieldContainer
            onMouseOver={handleMouseOver}
            onMouseOut={handleMouseOut}
            onClick={handleClick}
        />
    )
}
