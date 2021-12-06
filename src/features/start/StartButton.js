import styled from 'styled-components'
import {cloneDeep} from 'lodash'
import {useSelector, useDispatch} from 'react-redux'
import {positions} from '../board/BoardFunctions.js'
import {toggleGameOn, selectParticipatingPlayers} from './StartSlice.js'
import {
    updateBoardFields,
    updateStartFields,
    updateHomeFields,
    updatePositions,
    getInitialPlayer,
    resetValues
} from '../board/BoardSlice.js'

const Bttn = styled.button`
    color: white;
    background-color: darkgreen;
    font-size: 1.5em;
    margin-top: 10px;
    cursor: pointer;
`

export function StartButton() {
    const dispatch = useDispatch()
    const gameOn = useSelector(state => state.start.gameOn)
    const boardFields = cloneDeep(useSelector(state => state.board.boardFields))
    const startFields = cloneDeep(useSelector(state => state.board.startFields))
    const homeFields = cloneDeep(useSelector(state => state.board.homeFields))
    const participatingPlayers = useSelector(selectParticipatingPlayers)

    // disables the button if less than two players are selected
    let buttonDisabled = participatingPlayers.length < 2 
    const style = buttonDisabled ? {backgroundColor: 'grey', cursor: 'inherit'} : null

    // function to start a new game when clicking on the start button
    const startNewGame = () => {
        for (let startFieldsForPlayer in startFields) {
            for (let field of startFields[startFieldsForPlayer]) {
                if (!field) {
                    continue
                }
                if (participatingPlayers.includes(field.color)) {
                    field.player = field.color
                } else {
                    field.player = null
                }
            }
        }
        for (let field of boardFields) {
            field.player = null
        }
        for (let homeFieldsForPlayer in homeFields) {
            for (let field of homeFields[homeFieldsForPlayer]) {
                if (!field) {
                    continue
                }
            field.player = null
            }
        } 
        dispatch(updateBoardFields(boardFields))
        dispatch(updateStartFields(startFields))
        dispatch(updateHomeFields(homeFields))
        dispatch(updatePositions(positions))
        dispatch(getInitialPlayer(participatingPlayers))
        dispatch(resetValues())
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
