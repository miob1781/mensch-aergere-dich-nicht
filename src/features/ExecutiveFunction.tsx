import {useEffect} from 'react'
import {useAppSelector, useAppDispatch} from './hooks'
import {getStringFromPlayer} from './board/BoardFunctions'
import {selectParticipatingPlayers, selectComputerOn} from './start/StartSlice'
import {
    Field,
    HomeOrStartFields,
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
    setMoves,
    setMoveFields,
    setDiceThrown,
    setGotMoves,
    setReadyToCleanUp,
    setGoToNextPlayer,
    getNextPlayer,
    incrementDiceCount,
    resetDiceCount,
    cleanUp,
    setExecution,
    setHasWon,
    setReadyToExecuteMove,
    updateFieldAfterMove,
    updatePosition,
    setReadyToThrowDice
} from './board/BoardSlice'

/** utility component to execute most of the code during the game */
export function ExecutiveFunction() {
    const dispatch = useAppDispatch()
    const boardFields: Field[] = useAppSelector(state => state.board.boardFields)
    const homeFields: HomeOrStartFields = useAppSelector(state => state.board.homeFields)
    const allPositions: {[color: string]: Positions} = useAppSelector(state => state.board.allPositions)
    const diceResult: number = useAppSelector(state => state.board.dice)
    const diceCount: number = useAppSelector(state => state.board.diceCount)
    const gameOn: boolean = useAppSelector(state => state.start.gameOn)
    const hasWon: Player|undefined = useAppSelector(state => state.board.hasWon)
    const moveFields: MoveField[]|undefined = useAppSelector(state => state.board.moveFields)
    const moves: Move[]|undefined = useAppSelector(state => state.board.moves)
    const execution: ExecuteMove|undefined = useAppSelector(state => state.board.execution)
    const playerOn: Player = useAppSelector(state => state.board.playerOn)
    const diceThrown: boolean = useAppSelector(state => state.board.diceThrown)
    const gotMoves: boolean = useAppSelector(state => state.board.gotMoves)
    const readyToExecuteMove: boolean = useAppSelector(state => state.board.readyToExecuteMove)
    const readyToCleanUp: boolean = useAppSelector(state => state.board.readyToCleanUp)
    const participatingPlayers: Player[] = useAppSelector(selectParticipatingPlayers)
    const computerOn: boolean = useAppSelector(selectComputerOn)
    const goToNextPlayer: boolean = useAppSelector(state => state.board.goToNextPlayer)

    useEffect(() => {
        /** checks if an opponent is hit */
        const checkHit = (nextField: Field): CheckHit|undefined => {
            if (nextField.player === Player.None) {
                return
            } else {
                const oppPlayer: Player = nextField.player
                const oppFig: Fig = allPositions[getStringFromPlayer(oppPlayer)].positions.find(fig => fig.fieldIndex === nextField.index && fig.type === FieldType.Board)!
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
            }
            const move: Move = [updateFieldObject.executeMove!, moveRating]
            return move
        }
        
        /** gets next available moves for player based on dice result */
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
                            dispatch(setReadyToThrowDice(true))
                        } else {
                            dispatch(incrementDiceCount())
                            dispatch(setReadyToThrowDice(true))
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
                dispatch(setReadyToThrowDice(true))
            } else {
                dispatch(setMoves(movesArray))
                dispatch(setMoveFields(moveFieldsArray))
                dispatch(setGotMoves(true))
            }
        }

        if (diceThrown && gameOn) {
            getMoves()
            dispatch(setDiceThrown(false))
        }
    }, [dispatch, diceThrown, gameOn, allPositions, playerOn, computerOn, boardFields, diceResult, diceCount, participatingPlayers, homeFields])

    useEffect(() => {
        if (computerOn && moves && gotMoves) {
            let bestMove: Move = moves[0]
            let bestMoveRating: number = -Infinity
            for (let move of moves) {
                const moveRating: number = move[1]
                if (moveRating > bestMoveRating) {
                    bestMove = move
                    bestMoveRating = moveRating
                }
            }
            dispatch(setExecution(bestMove[0]))
            dispatch(setGotMoves(false))
            dispatch(setReadyToExecuteMove(true))
        }
    }, [dispatch, computerOn, moves, gameOn, gotMoves])

    useEffect(() => {
        if (readyToExecuteMove && execution) {
            const {
                winning,
                checkHitObject,
                updateFieldAfterMoveObject,
                updateNextFieldAfterMoveObject,
                updatePositionObject
            } = execution
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
            dispatch(setReadyToExecuteMove(false))
            dispatch(setReadyToCleanUp(true))
        }
    }, [dispatch, playerOn, computerOn, readyToExecuteMove, execution])

    useEffect(() => {
        const delay = computerOn ? 1000 : 0
        const timer = setTimeout(() => {
            if (readyToCleanUp) {
                moveFields!.forEach(mf => dispatch(cleanUp(mf)))
                if (goToNextPlayer && !hasWon) {
                    dispatch(getNextPlayer(participatingPlayers))
                    dispatch(setGoToNextPlayer(false))
                }
                dispatch(setReadyToCleanUp(false))
                if (!hasWon) {
                    dispatch(setReadyToThrowDice(true))
                }
            }
        }, delay)
        return () => clearTimeout(timer)
    }, [dispatch, computerOn, hasWon, moveFields, participatingPlayers, readyToCleanUp, goToNextPlayer])

    return <div />
}
