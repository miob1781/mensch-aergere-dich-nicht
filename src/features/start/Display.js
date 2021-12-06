import styled from 'styled-components'
import {useSelector} from 'react-redux'

const DisplayContainer = styled.div`
    width: 50%;
`

export function Display() {
    const gameOn = useSelector(state => state.start.gameOn)
    const playerOn = useSelector(state => state.board.playerOn)
    const hasWon = useSelector(state => state.board.hasWon)
    const playerNames = {yellow: 'Yellow', red: 'Red', green: 'Green', blue: 'Blue'}
    const initialText = 'Select the players you want to play and the players the computer is to play.'
    const nextPlayerText = `It's ${playerNames[playerOn]}'s turn.` 
    const hasWonText = `Congratulations! ${playerNames[hasWon]} has won.`  

    let text
    if (!gameOn) {
        text = initialText
    } else {
        !hasWon ? text = nextPlayerText : text = hasWonText
    }

    return (
        <DisplayContainer>
            <p>{text}</p>
        </DisplayContainer>
    )
}
