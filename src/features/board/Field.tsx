import styled from 'styled-components'
import {useAppSelector, useAppDispatch} from '../hooks'
import {Field as F, FieldType, Player} from '../types'
import {getStringFromPlayer} from './BoardFunctions'
import {
    setMouseOver,
    setMouseOut,
    setGotMoves,
    setExecution,
    setReadyToExecuteMove
} from './BoardSlice'

interface PropsFieldContainer {
    row: number,
    column: number,
    fieldColor: string,
    borderColor: string,
    borderWidth: string,
    borderStyle: string,
    cursor: string
}

const FieldContainer = styled.div`
    grid-row-start: ${(props: PropsFieldContainer) => props.row};
    grid-column-start: ${props => props.column};
    border-radius: 50%;
    border-color: ${props => props.borderColor};
    border-width: ${props => props.borderWidth};
    border-style: ${props => props.borderStyle};
    background-color: ${props => props.fieldColor};
    cursor: ${props => props.cursor};
    @media only screen and (max-width: 600px) {
        border-width: ${props => props.borderColor === 'black' ? '0.8vw' : 'none'};
    }
`

interface FieldProps {
    index: number,
    row: number,
    column: number,
    type: FieldType,
    color: Player
}

/** field component */
export function Field(props: FieldProps) {
    const {index, row, column, type, color} = props
    const dispatch = useAppDispatch()

    // selects field-specific values from the global state
    const field: F = useAppSelector(state => {
        let field: F
        if (type === FieldType.Board) {
            field = state.board.boardFields[index]
        } else if (type === FieldType.Start) {
            field = state.board.startFields[color][index]
        } else {
            field = state.board.homeFields[color][index]
        }
        return field
    }) 
    const {player, isMoveFrom, isMoveTo, figIndexArray, executeMove} = field
    const readyToMove: boolean = useAppSelector(state => isMoveFrom && state.board.gotMoves)
    const displayDottedBorder: boolean = useAppSelector(state => {
        const playerOn: Player = state.board.playerOn
        const computerOn: boolean = state.start.players[getStringFromPlayer(playerOn)].computerPlays
        return isMoveTo && state.board.mouseOverMoveFrom && !computerOn // @ts-ignore
        && figIndexArray.includes(state.board.figIndexMouse)
    })
    const playerOn: Player|null = useAppSelector(state => {
        return displayDottedBorder ? state.board.playerOn : null
    })

    /** colors for home and start fields */
    const fieldColors: {[color: string]: string} = {
        Yellow: 'moccasin',
        Red: 'salmon',
        Green: 'lightgreen',
        Blue: 'lightblue'
    }

    // sets the field color displayed
    let fieldColor: string = 'white'
    if (player !== Player.None) {
        fieldColor = getStringFromPlayer(player).toLowerCase()
    } else if (player === Player.None && color !== Player.None) {
        fieldColor = fieldColors[getStringFromPlayer(color)]
    }

    // sets field border
    let borderColor: string, borderWidth: string, borderStyle: string
    if (displayDottedBorder && playerOn) {
        borderColor = getStringFromPlayer(playerOn)
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

    /** values for cursor if mouse over a field */
    const cursor: string = readyToMove ? 'pointer' : 'inherit'

    const handleMouseOver = () => {
        if (readyToMove && !('ontouchstart' in window)) {
            dispatch(setMouseOver(figIndexArray[0]))
        }
    }

    const handleMouseOut = () => {
        dispatch(setMouseOut())
    }

    const handleClick = () => {
        if (readyToMove && executeMove) {
            dispatch(setExecution(executeMove))
            dispatch(setGotMoves(false))
            dispatch(setReadyToExecuteMove(true))
        }
    }

    return (
        <FieldContainer
            row={row}
            column={column}
            fieldColor={fieldColor}
            borderColor={borderColor}
            borderWidth={borderWidth}
            borderStyle={borderStyle}
            cursor={cursor}
            onMouseOver={handleMouseOver}
            onMouseOut={handleMouseOut}
            onClick={handleClick}
        />
    )
}
