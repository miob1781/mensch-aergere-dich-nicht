import styled from 'styled-components'
import {getStringFromPlayer} from '../board/BoardFunctions'
import {useAppSelector} from '../hooks'

const DisplayContainer = styled.div`
    max-width: 350px;
`

/** component that displays messages */
export function Display() {
    const gameOn = useAppSelector(state => state.start.gameOn)
    const playerOn = useAppSelector(state => state.board.playerOn)
    const hasWon = useAppSelector(state => state.board.hasWon)
    const initialText: string = 'Select the players you want to play and the players the computer is to play.'
    const nextPlayerText: string = `It's ${getStringFromPlayer(playerOn)}'s turn.`  // @ts-ignore
    const hasWonText: string = `Congratulations! ${getStringFromPlayer(hasWon)} has won.`  

    let text: string
    if (!gameOn) {
        text = initialText
    } else {
        text = !hasWon ? nextPlayerText : hasWonText
    }

    return (
        <DisplayContainer>
            <p>{text}</p>
        </DisplayContainer>
    )
}
