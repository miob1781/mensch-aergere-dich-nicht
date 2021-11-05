import styled from 'styled-components'

const DisplayContainer = styled.div`
    width: 50%;
`

export function Display(props){
    const {gameOn, playerOn, hasWon} = props

    const playerNames = {yellow: 'Yellow', red: 'Red', green: 'Green', blue: 'Blue'}

    const initialText = 'Select the players you want to play and the players the computer is to play.'
    const nextPlayerText = `It's ${playerNames[playerOn]}'s turn.` 
    const hasWonText = `Congratulations! ${playerNames[hasWon]} has won.`  

    let text
    if (!gameOn){
        text = initialText
    } else if (gameOn){
        if(!hasWon){
            text = nextPlayerText
        } else {
            text = hasWonText
        }
    }

    return (
        <DisplayContainer>
            <p>{text}</p>
        </DisplayContainer>
    )
}