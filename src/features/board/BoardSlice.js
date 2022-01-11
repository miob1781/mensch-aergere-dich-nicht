import {createSlice} from '@reduxjs/toolkit';
import {fields, playerStart, playerHome} from './GetField.js';
import {positions} from './BoardFunctions.js'

const boardSlice = createSlice({
    name: 'board',
    initialState: {
        boardFields: fields,
        startFields: playerStart,
        homeFields: playerHome,
        positions: positions,
        moves: [],
        moveFields: [],
        dice: 3,
        playerOn: 'blue',
        diceThrown: false,
        gotMoves: false,
        readyToCleanUp: false,
        goToNextPlayer: false,
        diceCount: 0,
        hasWon: null,
        mouseOverMoveFrom: false,
        figIndexMouse: null
    },
    reducers: {
        updateBoardFields: (state, action) => {
            state.boardFields = action.payload
        },
        updateStartFields: (state, action) => {
            state.startFields = action.payload
        },
        updateHomeFields: (state, action) => {
            state.homeFields = action.payload
        },
        updatePositions: (state, action) => {
            state.positions = action.payload
        },
        updateFieldAfterDiceThrown: (state, action) => {
            const {fieldIndex, type, isMoveFrom, isMoveTo, figIndex, executeMove} = action.payload
            let field
            const playerOn = state.playerOn
            if (type === 'boardField') {
                field = state.boardFields[fieldIndex]
            } else if (type === 'startField') {
                field = state.startFields[playerOn][fieldIndex]
            } else {
                field = state.homeFields[playerOn][fieldIndex]
            }
            field.isMoveFrom = isMoveFrom
            field.isMoveTo = isMoveTo
            field.figIndex.push(figIndex)
            field.executeMove = executeMove
        },
        updateFieldAfterMove: (state, action) => {
            const {fieldIndex, type, player} = action.payload
            let field, playerOnField
            player ? playerOnField = player : playerOnField = state.playerOn
            if (type === 'boardField') {
                field = state.boardFields[fieldIndex]
            } else if (type === 'startField') {
                field = state.startFields[playerOnField][fieldIndex]
            } else {
                field = state.homeFields[playerOnField][fieldIndex]
            }
            field.player = player
        },
        updatePosition: (state, action) => {
            const {player, figIndex, fieldIndex, type, changeNumFigsOut, decrementLastFreeHomeField} = action.payload
            const pos = state.positions[player]
            const fig = pos.positions.find(f => f.figIndex === figIndex)
            fig.fieldIndex = fieldIndex
            fig.type = type
            if (changeNumFigsOut === 'increment') {
                pos.numFigsOut++
            } else if (changeNumFigsOut === 'decrement') {
                pos.numFigsOut--
            }
            if (decrementLastFreeHomeField) {
                pos.lastFreeHomeField--
            }
        },
        setMoves: (state, action) => {
            state.moves = action.payload
        },
        setMoveFields: (state, action) => {
            state.moveFields = action.payload
        },
        throwDice: (state, action) => {
            const result = Math.floor(Math.random() * 6) + 1
            state.dice = result
        },
        setDiceThrown: (state, action) => {
            state.diceThrown = action.payload
        },
        setGotMoves: (state, action) => {
            state.gotMoves = action.payload
        },
        setReadyToCleanUp: (state, action) => {
            state.readyToCleanUp = action.payload
        },
        cleanUp: (state, action) => {
            const [fieldIndex, type] = action.payload
            let field
            if (type === 'boardField') {
                field = state.boardFields[fieldIndex]
            } else if (type === 'startField') {
                field = state.startFields[state.playerOn][fieldIndex]
            } else {
                field = state.homeFields[state.playerOn][fieldIndex]
            }
            field.isMoveFrom = false
            field.isMoveTo = false
            field.executeMove = null
            field.figIndex = []
        },
        setGoToNextPlayer: (state, action) => {
            state.goToNextPlayer = action.payload
        },
        getNextPlayer: (state, action) => {
            const participatingPlayers = action.payload
            const playerOn = state.playerOn
            const currentIndex = participatingPlayers.indexOf(playerOn)
            const nextIndex = (currentIndex + 1) % participatingPlayers.length
            state.playerOn = participatingPlayers[nextIndex]
        },
        getInitialPlayer: (state, action) => {
            const participatingPlayers = action.payload
            const initialPlayerIndex = Math.floor(Math.random() * participatingPlayers.length)
            state.playerOn = participatingPlayers[initialPlayerIndex]            
        },
        incrementDiceCount: (state, action) => {
            state.diceCount++
        },
        resetDiceCount: (state, action) => {
            state.diceCount = 0
        },
        setHasWon: (state, action) => {
            const winner = action.payload
            state.hasWon = winner
        },
        setMouseOver: (state, action) => {
            state.mouseOverMoveFrom = true
            state.figIndexMouse = action.payload
        },
        setMouseOut: (state, action) => {
            state.mouseOverMoveFrom = false
            state.figIndexMouse = null
        },
        resetValues: (state, action) => {
            state.diceThrown = false
            state.gotMoves = false
            state.readyToCleanUp = false
            state.goToNextPlayer = false
            state.hasWon = null
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
    throwDice,
    setDiceThrown,
    setGotMoves,
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
