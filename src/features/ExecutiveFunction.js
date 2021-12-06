import {useEffect} from 'react'
import {useSelector, useDispatch} from 'react-redux'
import {selectParticipatingPlayers, selectComputerOn} from './start/StartSlice.js'
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
    setHasWon,
    cleanUp
} from './board/BoardSlice.js'

export function ExecutiveFunction() {
    const dispatch = useDispatch()
    const boardFields = useSelector(state => state.board.boardFields)
    const homeFields = useSelector(state => state.board.homeFields)
    const positions = useSelector(state => state.board.positions)
    const diceResult = useSelector(state => state.board.dice)
    const diceCount = useSelector(state => state.board.diceCount)
    const gameOn = useSelector(state => state.start.gameOn)
    const moves = useSelector(state => state.board.moves)
    const moveFields = useSelector(state => state.board.moveFields)
    const playerOn = useSelector(state => state.board.playerOn)
    const diceThrown = useSelector(state => state.board.diceThrown)
    const gotMoves = useSelector(state => state.board.gotMoves)
    const readyToCleanUp = useSelector(state => state.board.readyToCleanUp)
    const goToNextPlayer = useSelector(state => state.board.goToNextPlayer)
    const hasWon = useSelector(state => state.board.hasWon)
    const participatingPlayers = useSelector(selectParticipatingPlayers)
    const computerOn = useSelector(selectComputerOn)

      // checks if an opponent is hit
      const checkHit = nextField => {
        if (nextField.player) {
          const oppPlayer = nextField.player
          const oppFig = positions[oppPlayer].positions.find(fig => fig.fieldIndex === nextField.index && fig.type === 'boardField')
          const oppFieldObject = {
            fieldIndex: oppFig.figIndex,
            type: 'startField',
            player: oppPlayer,
          }
          const oppPlayerObject = {
            player: oppPlayer,
            figIndex: oppFig.figIndex,
            fieldIndex: oppFig.figIndex,
            type: 'startField',
            changeNumFigsOut: 'decrement',
            decrementLastFreeHomeField: false
          }
          dispatch(updateFieldAfterMove(oppFieldObject))
          dispatch(updatePosition(oppPlayerObject))
        }
      }

      // sets move-specific values of fields
      const getMoveValues = (fieldIndex, typeField, nextField, figIndex, lastFreeHomeField, entryFieldIndex) => {
        const nextFieldIndex = nextField.index
        const typeNextField = nextField.type
        let changeNumFigsOut = null
        let decrementLastFreeHomeField = false
        let winning = false
        if (typeField === 'startField') {
            changeNumFigsOut = 'increment'
        }
        if (typeNextField === 'homeField' && nextFieldIndex === lastFreeHomeField) {
          decrementLastFreeHomeField = true
          if (lastFreeHomeField === 1) {
            winning = true
          }
        }
        const updateFieldObject = {
            fieldIndex: fieldIndex,
            type: typeField,
            isMoveFrom: true,
            isMoveTo: false,
            figIndex: figIndex,
            executeMove: () => {
                checkHit(nextField)
                const updateFieldAfterMoveObject = {
                    fieldIndex: fieldIndex,
                    type: typeField,
                    player: null
                }
                const updateNextFieldAfterMoveObject = {
                    fieldIndex: nextFieldIndex,
                    type: typeNextField,
                    player: playerOn
                }
                const updatePositionObject = {
                  player: playerOn,
                  figIndex: figIndex,
                  fieldIndex: nextFieldIndex,
                  type: typeNextField,
                  changeNumFigsOut: changeNumFigsOut,
                  decrementLastFreeHomeField: decrementLastFreeHomeField
                }
                dispatch(updateFieldAfterMove(updateFieldAfterMoveObject))
                dispatch(updateFieldAfterMove(updateNextFieldAfterMoveObject))
                dispatch(updatePosition(updatePositionObject))
                dispatch(setGotMoves(false))
                dispatch(setReadyToCleanUp(true))
                if (winning) {
                  dispatch(setHasWon(playerOn))
                }
                if (typeField === 'startField') {
                  dispatch(resetDiceCount())
                } else {
                  dispatch(setGoToNextPlayer(true))
                }
            }
        }
        const updateNextFieldObject = {
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
        let moveRating = 0
        if (computerOn) {
            if (decrementLastFreeHomeField) {
                moveRating += 10
            } else if (typeNextField === 'homeField') {
                moveRating += 8
            } else {
                if (nextField.player) {
                 moveRating += 5
                }
                let currentIndex = fieldIndex
                let count = 0
                const progress = Math.floor((nextFieldIndex - entryFieldIndex) % 40 / 10) + 1
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
        return [updateFieldObject.executeMove, moveRating]
      }
      
      // gets next available moves for player based on dice result
      // eslint-disable-next-line react-hooks/exhaustive-deps
      const getMoves = () => {
        const pos = positions[playerOn]
        const entryFields = {yellow: 0, red: 10, green: 20, blue: 30}
        const exitFields = {yellow: 39, red: 9, green: 19, blue: 29}  
        const entryFieldIndex = entryFields[playerOn]
        const exitFieldIndex = exitFields[playerOn]
        const onEntryField = boardFields[entryFieldIndex].player === playerOn
        let movesArray = []
        let moveFieldsArray = []
    
        // loops through each figure to get its available move
        for (let fig of pos.positions) {
          const figIndex = fig.figIndex
          const fieldIndex = fig.fieldIndex
          let nextFieldIndex, nextField
    
          //if the figure is on a start field
          if (fig.type === 'startField') {
            if (diceResult === 6 && !onEntryField) {
              nextFieldIndex = entryFieldIndex
              nextField = boardFields[nextFieldIndex]
              if (nextField.player === playerOn) {
                continue
              }
              const move = getMoveValues(fieldIndex, fig.type, nextField, figIndex, pos.lastFreeHomeField, entryFieldIndex)
              movesArray.push(move)
              moveFieldsArray.push([fieldIndex, fig.type])
              moveFieldsArray.push([nextFieldIndex, nextField.type])      
            } else if (pos.numFigsOut + pos.lastFreeHomeField === 4) {
              if (diceCount === 2) {
                dispatch(resetDiceCount())
                dispatch(getNextPlayer(participatingPlayers))
            } else {
                dispatch(incrementDiceCount())
              }
              return
            }
    
          // if the figure is on a board field or a home field
          } else {
            const moveFromEntryField = onEntryField && pos.numFigsOut < 4
                && !pos.positions.find(f => f.fieldIndex === entryFieldIndex + diceResult && f.type === 'boardField')
            if ((diceResult === 6 && !onEntryField && pos.numFigsOut < 4)
              || (moveFromEntryField && fieldIndex !== entryFieldIndex)) {
                continue
            }
            const passExitField = fieldIndex <= exitFieldIndex && fieldIndex + diceResult > exitFieldIndex
            if (fig.type === 'boardField' && !passExitField) {
              nextFieldIndex = (fieldIndex + diceResult) % 40
              nextField = boardFields[nextFieldIndex]
              if (nextField.player === playerOn) {
                continue
              }
            } else {
              if (fig.type === 'homeField') {
                nextFieldIndex = fieldIndex + diceResult
              } else {
                nextFieldIndex = diceResult - (exitFieldIndex - fieldIndex)
              }
              if (nextFieldIndex > pos.lastFreeHomeField) {
                continue
              }
              const inTheWay = homeFields[playerOn].find(f => {
                if (!f) {
                  return false
                }
                return f.player && nextFieldIndex >= f.index
                    && ((fieldIndex < f.index && fig.type === 'homeField') || fig.type === 'boardField')
              })
              if (inTheWay) {
                continue
              }
              nextField = homeFields[playerOn][nextFieldIndex]
            }
            const move = getMoveValues(fieldIndex, fig.type, nextField, figIndex, pos.lastFreeHomeField, entryFieldIndex)
            movesArray.push(move)
            moveFieldsArray.push([fieldIndex, fig.type])
            moveFieldsArray.push([nextFieldIndex, nextField.type])
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
          const computerMoves = () => {
            let bestMove
            let bestMoveRating = -Infinity
            for (let move of moves) {
                const moveRating = move[1]
                if (moveRating > bestMoveRating) {
                    bestMove = move
                    bestMoveRating = moveRating
                }
            }
            bestMove[0]()
          }
          if (computerOn && gotMoves && gameOn) {
              computerMoves()
          }
      }, [computerOn, gotMoves, gameOn, diceThrown, moves])
  
      useEffect(() => {
        if (readyToCleanUp) {
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
