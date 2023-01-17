import styled from 'styled-components'
import {getStringFromPlayer} from '../board/BoardFunctions'
import {useAppSelector} from '../hooks'
import {Player} from '../types'

const DisplayContainer = styled.div`
    max-width: 350px;
`

/** component that displays messages */
export function Display() {
    const gameOn: boolean = useAppSelector(state => state.start.gameOn)
    const playerOn: Player = useAppSelector(state => state.board.playerOn)
    const hasWon: Player = useAppSelector(state => state.board.hasWon)!
    const initialText: string = 'Select at least two players.'
    const nextPlayerText: string = `It's ${getStringFromPlayer(playerOn)}'s turn.`
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
