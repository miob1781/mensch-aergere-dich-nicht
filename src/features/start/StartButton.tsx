import styled from 'styled-components'
import {cloneDeep} from 'lodash'
import {useAppSelector, useAppDispatch} from '../hooks'
import {Player} from '../types'
import {allPositions} from '../board/BoardFunctions'
import {toggleGameOn, selectParticipatingPlayers} from './StartSlice'
import {
    updateBoardFields,
    updateStartFields,
    updateHomeFields,
    updatePositions,
    getInitialPlayer,
    resetValues,
    setReadyToThrowDice
} from '../board/BoardSlice'

/** styled component for StartButton */
const Bttn = styled.button`
    color: white;
    background-color: darkgreen;
    font-size: 1.5em;
    margin-top: 10px;
    cursor: pointer;
`

/** component for the start button */
export function StartButton() {
    const dispatch = useAppDispatch()
    const gameOn = useAppSelector(state => state.start.gameOn)
    const boardFields = cloneDeep(useAppSelector(state => state.board.boardFields))
    const startFields = cloneDeep(useAppSelector(state => state.board.startFields))
    const homeFields = cloneDeep(useAppSelector(state => state.board.homeFields))
    const participatingPlayers = useAppSelector(selectParticipatingPlayers)

    /** disables the button if less than two players are selected */
    let buttonDisabled: boolean = participatingPlayers.length < 2 
    const style = buttonDisabled ? {backgroundColor: 'grey', cursor: 'inherit'} : undefined

    /** function to start a new game when clicking on the start button */
    const startNewGame = () => {
        for (let startFieldsForPlayer in startFields) {
            for (let field of startFields[startFieldsForPlayer]) {
                if (!field) {
                    continue
                }
                if (participatingPlayers.includes(field.color)) {
                    field.player = field.color
                } else {
                    field.player = Player.None
                }
            }
        }
        for (let field of boardFields) {
            field.player = Player.None
        }
        for (let homeFieldsForPlayer in homeFields) {
            for (let field of homeFields[homeFieldsForPlayer]) {
                if (!field) {
                    continue
                }
            field.player = Player.None
            }
        } 
        dispatch(updateBoardFields(boardFields))
        dispatch(updateStartFields(startFields))
        dispatch(updateHomeFields(homeFields))
        dispatch(updatePositions(allPositions))
        dispatch(getInitialPlayer(participatingPlayers))
        dispatch(resetValues())
        dispatch(setReadyToThrowDice(true))
        dispatch(toggleGameOn())
    }

    return <Bttn
        type='button'
        onClick={startNewGame}
        disabled={buttonDisabled}
        style={style}
        data-testid={'start-button'}
    >{gameOn ? 'New Game' : 'Start'}</Bttn>
}
