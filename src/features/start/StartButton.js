import styled from 'styled-components'

const Bttn = styled.button`
    color: white;
    background-color: darkgreen;
    font-size: 1.5em;
    margin-top: 10px;
    cursor: pointer;
`

export function StartButton(props){
    const {
        gameOn,
        startNewGame,
        players,
    } = props

    // sets the text of the button
    let text
    gameOn ? text = 'New Game' : text = 'Start'

    // disables and styles the button if less than two players are selected
    let buttonDisabled = players.length < 2 
    
    let style
    if (buttonDisabled){
        style = {backgroundColor: 'grey', cursor: 'inherit'}
    }

    return <Bttn
        type='button'
        onClick={startNewGame}
        disabled={buttonDisabled}
        style={style}
    >{text}</Bttn>
}
