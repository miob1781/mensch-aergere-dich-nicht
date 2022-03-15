import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {
    Field,
    HomeOrStartFields,
    BoardState,
    Player,
    FieldType,
    Fig,
    Positions,
    Move,
    MoveField,
    UpdateField,
    UpdateFieldAfterMove,
    UpdatePosition,
    ExecuteMove
} from '../types'
import {boardFields, startFields, homeFields} from './GetField';
import {allPositions, getStringFromPlayer} from './BoardFunctions'

const initialState: BoardState = {
    boardFields: boardFields,
    startFields: startFields,
    homeFields: homeFields,
    allPositions: allPositions,
    moves: [],
    moveFields: [],
    execution: undefined,
    dice: 3,
    playerOn: Player.Blue,
    readyToThrowDice: false,
    diceThrown: false,
    gotMoves: false,
    readyToExecuteMove: false,
    readyToCleanUp: false,
    goToNextPlayer: false,
    diceCount: 0,
    hasWon: undefined,
    mouseOverMoveFrom: false,
    figIndexMouse: undefined
}

/** slice for the functionality needed during the game */
const boardSlice = createSlice({
    name: 'board',
    initialState,
    reducers: {
        updateBoardFields: (state, action: PayloadAction<Field[]>) => {
            state.boardFields = action.payload
        },
        updateStartFields: (state, action: PayloadAction<HomeOrStartFields>) => {
            state.startFields = action.payload
        },
        updateHomeFields: (state, action: PayloadAction<HomeOrStartFields>) => {
            state.homeFields = action.payload
        },
        updatePositions: (state, action: PayloadAction<{[color: string] :Positions}>) => {
            state.allPositions = action.payload
        },
        updateFieldAfterDiceThrown: (state, action: PayloadAction<UpdateField>) => {
            const {fieldIndex, type, isMoveFrom, isMoveTo, figIndex, executeMove} = action.payload
            let field: Field
            const playerOn: Player = state.playerOn
            if (type === FieldType.Board) {
                field = state.boardFields[fieldIndex]
            } else if (type === FieldType.Start) {
                field = state.startFields[getStringFromPlayer(playerOn)][fieldIndex]
            } else {
                field = state.homeFields[getStringFromPlayer(playerOn)][fieldIndex]
            }
            field.isMoveFrom = isMoveFrom
            field.isMoveTo = isMoveTo
            field.figIndexArray.push(figIndex)
            field.executeMove = executeMove
        },
        updateFieldAfterMove: (state, action: PayloadAction<UpdateFieldAfterMove>) => {
            const {fieldIndex, type, player} = action.payload
            let field: Field, playerOnField: Player
            playerOnField = player !== Player.None ? player : state.playerOn
            if (type === FieldType.Board) {
                field = state.boardFields[fieldIndex]
            } else if (type === FieldType.Start) {
                field = state.startFields[getStringFromPlayer(playerOnField)][fieldIndex]
            } else {
                field = state.homeFields[getStringFromPlayer(playerOnField)][fieldIndex]
            }
            field.player = player
        },
        updatePosition: (state, action: PayloadAction<UpdatePosition>) => {
            const {player, figIndex, fieldIndex, type, changeNumFigsOut, decrementLastFreeHomeField} = action.payload
            const playerPositions: Positions = state.allPositions[getStringFromPlayer(player)] // @ts-ignore
            const fig: Fig = playerPositions.positions.find(f => f.figIndex === figIndex)
            fig.fieldIndex = fieldIndex
            fig.type = type
            if (changeNumFigsOut === 'increment') {
             playerPositions.numFigsOut++
            } else if (changeNumFigsOut === 'decrement') {
             playerPositions.numFigsOut--
            }
            if (decrementLastFreeHomeField) {
             playerPositions.lastFreeHomeField--
            }
        },
        setMoves: (state, action: PayloadAction<Move[]>) => {
            state.moves = action.payload
        },
        setMoveFields: (state, action: PayloadAction<MoveField[]>) => {
            state.moveFields = action.payload
        },
        setExecution: (state, action: PayloadAction<ExecuteMove>) => {
            state.execution = action.payload
        },
        throwDice: state => {
            const result: number = Math.floor(Math.random() * 6) + 1
            state.dice = result
        },
        setReadyToThrowDice: (state, action: PayloadAction<boolean>) => {
            state.readyToThrowDice = action.payload
        },
        setDiceThrown: (state, action: PayloadAction<boolean>) => {
            state.diceThrown = action.payload
        },
        setGotMoves: (state, action: PayloadAction<boolean>) => {
            state.gotMoves = action.payload
        },
        setReadyToExecuteMove: (state, action: PayloadAction<boolean>) => {
            state.readyToExecuteMove = action.payload
        },
        setReadyToCleanUp: (state, action: PayloadAction<boolean>) => {
            state.readyToCleanUp = action.payload
        },
        cleanUp: (state, action: PayloadAction<MoveField>) => {
            const [fieldIndex, type] = action.payload
            const playerOn: Player = state.playerOn
            let field: Field
            if (type === FieldType.Board) {
                field = state.boardFields[fieldIndex]
            } else if (type === FieldType.Start) {
                field = state.startFields[getStringFromPlayer(playerOn)][fieldIndex]
            } else {
                field = state.homeFields[getStringFromPlayer(playerOn)][fieldIndex]
            }
            field.isMoveFrom = false
            field.isMoveTo = false
            field.executeMove = null
            field.figIndexArray = []
        },
        setGoToNextPlayer: (state, action: PayloadAction<boolean>) => {
            state.goToNextPlayer = action.payload
        },
        getNextPlayer: (state, action: PayloadAction<Player[]>) => {
            const participatingPlayers: Player[] = action.payload
            const playerOn: Player = state.playerOn
            const currentIndex: number = participatingPlayers.indexOf(playerOn)
            const nextIndex: number = (currentIndex + 1) % participatingPlayers.length
            state.playerOn = participatingPlayers[nextIndex]
        },
        getInitialPlayer: (state, action: PayloadAction<Player[]>) => {
            const participatingPlayers: Player[] = action.payload
            const initialPlayerIndex: number = Math.floor(Math.random() * participatingPlayers.length)
            state.playerOn = participatingPlayers[initialPlayerIndex]            
        },
        incrementDiceCount: state => {
            state.diceCount++
        },
        resetDiceCount: state => {
            state.diceCount = 0
        },
        setHasWon: (state, action: PayloadAction<Player>) => {
            const winner: Player = action.payload
            state.hasWon = winner
        },
        setMouseOver: (state, action: PayloadAction<number>) => {
            state.mouseOverMoveFrom = true
            state.figIndexMouse = action.payload
        },
        setMouseOut: state => {
            state.mouseOverMoveFrom = false
            state.figIndexMouse = undefined
        },
        resetValues: state => {
            state.moves = []
            state.moveFields = []
            state.execution = undefined
            state.readyToThrowDice = false
            state.diceThrown = false
            state.gotMoves = false
            state.readyToExecuteMove = false
            state.readyToCleanUp = false
            state.goToNextPlayer = false
            state.hasWon = undefined
            state.mouseOverMoveFrom = false
        }
    }
})

export default boardSlice.reducer;
export const {
    updateBoardFields,
    updateStartFields,
    updateHomeFields,
    updatePositions,
    updateFieldAfterDiceThrown,
    updateFieldAfterMove,
    updatePosition,
    setMoves,
    setMoveFields,
    setExecution,
    throwDice,
    setReadyToThrowDice,
    setDiceThrown,
    setGotMoves,
    setReadyToExecuteMove,
    setReadyToCleanUp,
    cleanUp,
    getNextPlayer,
    setGoToNextPlayer,
    getInitialPlayer,
    incrementDiceCount,
    resetDiceCount,
    setHasWon,
    setMouseOver,
    setMouseOut,
    resetValues
} = boardSlice.actions;
