import {useEffect} from 'react'
import {useAppSelector, useAppDispatch} from './hooks'
import {getStringFromPlayer} from './board/BoardFunctions'
import {selectParticipatingPlayers, selectComputerOn} from './start/StartSlice'
import {
    Field,
    FieldType,
    Player,
    Fig,
    Positions,
    Move,
    MoveField,
    CheckHit,
    UpdateField,
    UpdateFieldAfterMove,
    UpdatePosition,
    ExecuteMove
} from './types'
import {
    updateFieldAfterDiceThrown,
    updateFieldAfterMove,
    updatePosition,
    setMoves,
    setMoveFields,
    throwDice,
    setDiceThrown,
    setGotMoves,
    setReadyToCleanUp,
    setGoToNextPlayer,
    getNextPlayer,
    incrementDiceCount,
    resetDiceCount,
    cleanUp,
    setHasWon
} from './board/BoardSlice'

/** utility component to execute most of the code during the game */
export function ExecutiveFunction() {
    const dispatch = useAppDispatch()
    const boardFields = useAppSelector(state => state.board.boardFields)
    const homeFields = useAppSelector(state => state.board.homeFields)
    const allPositions = useAppSelector(state => state.board.allPositions)
    const diceResult = useAppSelector(state => state.board.dice)
    const diceCount = useAppSelector(state => state.board.diceCount)
    const gameOn = useAppSelector(state => state.start.gameOn)
    const moves = useAppSelector(state => state.board.moves)
    const moveFields = useAppSelector(state => state.board.moveFields)
    const playerOn = useAppSelector(state => state.board.playerOn)
    const diceThrown = useAppSelector(state => state.board.diceThrown)
    const gotMoves = useAppSelector(state => state.board.gotMoves)
    const readyToCleanUp = useAppSelector(state => state.board.readyToCleanUp)
    const goToNextPlayer = useAppSelector(state => state.board.goToNextPlayer)
    const hasWon = useAppSelector(state => state.board.hasWon)
    const participatingPlayers = useAppSelector(selectParticipatingPlayers)
    const computerOn = useAppSelector(selectComputerOn)

    /** checks if an opponent is hit */
    const checkHit = (nextField: Field): CheckHit|undefined => {
        if (nextField.player === Player.None) {
            return
        } else {
            const oppPlayer: Player = nextField.player // @ts-ignore
            const oppFig: Fig = allPositions[getStringFromPlayer(oppPlayer)].positions.find(fig => fig.fieldIndex === nextField.index && fig.type === FieldType.Board)
            const oppFieldObject: UpdateFieldAfterMove = {
                fieldIndex: oppFig.figIndex,
                type: FieldType.Start,
                player: oppPlayer,
            }
            const oppPlayerObject: UpdatePosition = {
                player: oppPlayer,
                figIndex: oppFig.figIndex,
                fieldIndex: oppFig.figIndex,
                type: FieldType.Start,
                changeNumFigsOut: 'decrement',
                decrementLastFreeHomeField: false
            }
            const checkHitObject: CheckHit = {
                oppFieldObject: oppFieldObject,
                oppPlayerObject: oppPlayerObject
            }
            return checkHitObject
        }
    }

    /** function to set move-specific values of fields */
    const getMoveValues = (
        fieldIndex: number,
        typeField: FieldType,
        nextField: Field,
        figIndex: number,
        lastFreeHomeField: number,
        entryFieldIndex: number
    ): Move => {
        const nextFieldIndex: number = nextField.index
        const typeNextField: FieldType = nextField.type
        let changeNumFigsOut: string = 'no change'
        let decrementLastFreeHomeField: boolean = false
        let winning: boolean = false
        if (typeField === FieldType.Start) {
            changeNumFigsOut = 'increment'
        }
        if (typeNextField === FieldType.Home && nextFieldIndex === lastFreeHomeField) {
            decrementLastFreeHomeField = true
            if (lastFreeHomeField === 1) {
                winning = true
            }
        }
        const updateFieldObject: UpdateField = {
            fieldIndex: fieldIndex,
            type: typeField,
            isMoveFrom: true,
            isMoveTo: false,
            figIndex: figIndex,
            executeMove: {
                winning: winning,
                checkHitObject: checkHit(nextField),
                updateFieldAfterMoveObject: {
                    fieldIndex: fieldIndex,
                    type: typeField,
                    player: Player.None
                },
                updateNextFieldAfterMoveObject: {
                    fieldIndex: nextFieldIndex,
                    type: typeNextField,
                    player: playerOn
                },
                updatePositionObject: {
                    player: playerOn,
                    figIndex: figIndex,
                    fieldIndex: nextFieldIndex,
                    type: typeNextField,
                    changeNumFigsOut: changeNumFigsOut,
                    decrementLastFreeHomeField: decrementLastFreeHomeField
                }
            } // end executeMove
        }
        const updateNextFieldObject: UpdateField = {
            fieldIndex: nextFieldIndex,
            type: typeNextField,
            isMoveFrom: false,
            isMoveTo: true,
            figIndex: figIndex,
            executeMove: null
        }
        dispatch(updateFieldAfterDiceThrown(updateFieldObject))
        dispatch(updateFieldAfterDiceThrown(updateNextFieldObject))

        // calculates move rating
        let moveRating: number = 0
        if (computerOn) {
            if (decrementLastFreeHomeField) {
                moveRating += 10
            } else if (typeNextField === FieldType.Home) {
                moveRating += 8
            } else {
                if (nextField.player) {
                    moveRating += 5
                }
                let currentIndex: number = fieldIndex
                let count: number = 0
                const progress: number = Math.floor((nextFieldIndex - entryFieldIndex) % 40 / 10) + 1
                while (count < 6) {
                    if ((boardFields[currentIndex].player && boardFields[currentIndex].player !== playerOn)
                        || currentIndex % 10 === 0) {
                        moveRating += progress
                    }
                    if (currentIndex === 0) {
                        currentIndex = 39
                    } else {
                        currentIndex--
                    }
                    count++
                }
                currentIndex = nextFieldIndex
                count = 0
                while (count < 6) {
                    if ((boardFields[currentIndex].player && boardFields[currentIndex].player !== playerOn)
                    || currentIndex % 10 === 0) {
                        moveRating -= progress
                    }
                    if (currentIndex === 0) {
                        currentIndex = 39
                    } else {
                        currentIndex--
                    }
                    count++
                }
                moveRating += progress
            }
        } // @ts-ignore
        const move: Move = [updateFieldObject.executeMove, moveRating]
        return move
    }
      
    /** gets next available moves for player based on dice result */
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const getMoves = () => {
        const playerPositions: Positions = allPositions[getStringFromPlayer(playerOn)]
        const entryFields: {[color: string]: number} = {Yellow: 0, Red: 10, Green: 20, Blue: 30}
        const exitFields: {[color: string]: number} = {Yellow: 39, Red: 9, Green: 19, Blue: 29}  
        const entryFieldIndex: number = entryFields[getStringFromPlayer(playerOn)]
        const exitFieldIndex: number = exitFields[getStringFromPlayer(playerOn)]
        const onEntryField: boolean = boardFields[entryFieldIndex].player === playerOn
        let move: Move, moveField: MoveField, movesArray: Move[] = [], moveFieldsArray: MoveField[] = []
    
        // loops through each piece to get its available move
        for (let fig of playerPositions.positions) {
            const figIndex: number = fig.figIndex
            const fieldIndex: number = fig.fieldIndex
            let nextFieldIndex: number, nextField: Field
        
            //if the piece is on a start field
            if (fig.type === FieldType.Start) {
                if (diceResult === 6 && !onEntryField) {
                    nextFieldIndex = entryFieldIndex
                    nextField = boardFields[nextFieldIndex]
                    if (nextField.player === playerOn) {
                        continue
                    }
                    move = getMoveValues(
                        fieldIndex,
                        fig.type,
                        nextField,
                        figIndex,
                        playerPositions.lastFreeHomeField,
                        entryFieldIndex
                    )
                    movesArray.push(move)
                    moveField = [fieldIndex, fig.type]
                    moveFieldsArray.push(moveField)
                    moveField = [nextFieldIndex, nextField.type]
                    moveFieldsArray.push(moveField)      
                } else if (playerPositions.numFigsOut + playerPositions.lastFreeHomeField === 4) {
                    if (diceCount === 2) {
                        dispatch(resetDiceCount())
                        dispatch(getNextPlayer(participatingPlayers))
                    } else {
                        dispatch(incrementDiceCount())
                    }
                    return
                }
        
            // if the piece is on a board field or a home field
            } else {
                const moveFromEntryField: boolean = onEntryField && playerPositions.numFigsOut < 4
                && !playerPositions.positions.find(f => f.fieldIndex === entryFieldIndex + diceResult && f.type === FieldType.Board)
                if ((diceResult === 6 && !onEntryField && playerPositions.numFigsOut < 4)
                || (moveFromEntryField && fieldIndex !== entryFieldIndex)) {
                    continue
                }
                const passExitField: boolean = fieldIndex <= exitFieldIndex
                && fieldIndex + diceResult > exitFieldIndex
                if (fig.type === FieldType.Board && !passExitField) {
                    nextFieldIndex = (fieldIndex + diceResult) % 40
                    nextField = boardFields[nextFieldIndex]
                    if (nextField.player === playerOn) {
                        continue
                    }
                } else {
                    if (fig.type === FieldType.Home) {
                        nextFieldIndex = fieldIndex + diceResult
                    } else {
                        nextFieldIndex = diceResult - (exitFieldIndex - fieldIndex)
                    }
                    if (nextFieldIndex > playerPositions.lastFreeHomeField) {
                        continue
                    }
                    const inTheWay: Field|undefined = homeFields[getStringFromPlayer(playerOn)].find((f: Field) => {
                        if (f.index === 0) {
                            return false
                        }
                        return f.player !== Player.None && nextFieldIndex >= f.index
                        && ((fieldIndex < f.index && fig.type === FieldType.Home)
                        || fig.type === FieldType.Board)
                    })
                    if (inTheWay) {
                        continue
                    }
                    nextField = homeFields[getStringFromPlayer(playerOn)][nextFieldIndex]
                }
                move = getMoveValues(
                    fieldIndex,
                    fig.type,
                    nextField,
                    figIndex,
                    playerPositions.lastFreeHomeField,
                    entryFieldIndex
                )
                movesArray.push(move)
                moveField = [fieldIndex, fig.type]
                moveFieldsArray.push(moveField)
                moveField = [nextFieldIndex, nextField.type]
                moveFieldsArray.push(moveField)
            }
        }
        if (movesArray.length === 0) {
            dispatch(getNextPlayer(participatingPlayers))
        } else {
            dispatch(setGotMoves(true))
            dispatch(setMoves(movesArray))
            dispatch(setMoveFields(moveFieldsArray))
        }
    }

    useEffect(() => {
        if (computerOn && !gotMoves && !diceThrown && !readyToCleanUp && gameOn && !hasWon) {
            dispatch(throwDice())
            dispatch(setDiceThrown(true))
        }
    }, [computerOn, diceThrown, dispatch, gotMoves, playerOn, gameOn, hasWon, readyToCleanUp])
  
    useEffect(() => {
        if (diceThrown && gameOn) {
            getMoves()
            dispatch(setDiceThrown(false))
        }
      }, [diceThrown, dispatch, getMoves, gameOn])
      
    useEffect(() => {
        const computerMoves = (): void => {
            if (moves) {
                let bestMove: Move = moves[0]
                let bestMoveRating: number = -Infinity
                for (let move of moves) {
                    const moveRating: number = move[1]
                    if (moveRating > bestMoveRating) {
                        bestMove = move
                        bestMoveRating = moveRating
                    }
                }
                const executeMove: ExecuteMove = bestMove[0]
                const {
                    winning,
                    checkHitObject,
                    updateFieldAfterMoveObject,
                    updateNextFieldAfterMoveObject,
                    updatePositionObject
                } = executeMove
                const fieldType: FieldType = updateFieldAfterMoveObject.type
                if (winning && playerOn) {
                    dispatch(setHasWon(playerOn))
                }
                if (checkHitObject) {
                    dispatch(updateFieldAfterMove(checkHitObject.oppFieldObject))
                    dispatch(updatePosition(checkHitObject.oppPlayerObject))    
                }
                if (fieldType === FieldType.Start) {
                    dispatch(resetDiceCount())
                } else {
                    dispatch(setGoToNextPlayer(true))
                }
                dispatch(updateFieldAfterMove(updateFieldAfterMoveObject))
                dispatch(updateFieldAfterMove(updateNextFieldAfterMoveObject))
                dispatch(updatePosition(updatePositionObject))
                dispatch(setGotMoves(false))
                dispatch(setReadyToCleanUp(true))
            }
        }
        if (computerOn && gotMoves && gameOn) {
            computerMoves()
        }
    }, [computerOn, gotMoves, gameOn, diceThrown, moves, playerOn, dispatch])
  
    useEffect(() => {
        if (readyToCleanUp) { // @ts-ignore
            moveFields.forEach(mf => dispatch(cleanUp(mf)))
            dispatch(setReadyToCleanUp(false))
            if (goToNextPlayer) {
                dispatch(getNextPlayer(participatingPlayers))
                dispatch(setGoToNextPlayer(false))
            }
        }
    }, [dispatch, goToNextPlayer, moveFields, participatingPlayers, readyToCleanUp])
  
    return <div />
}