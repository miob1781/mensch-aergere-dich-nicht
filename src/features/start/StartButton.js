import styled from 'styled-components'

const Bttn = styled.button`
    color: white;
    background-color: darkgreen;
    font-size: 1.5em;
    margin-top: 10px;
    cursor: pointer;
`

export function StartButton(props){
    const {gameOn, setGameOn, playingPlayers} = props

    // sets the text of the button
    let text
    gameOn ? text = 'New Game' : text = 'Start'

    // disables the button if less than two players are selected
    let buttonDisabled
    let count = 0
    for (let player in playingPlayers){
        if (playingPlayers[player]){
            count++
            if (count === 2){
                break
            }
        }
    }
    count === 2 ? buttonDisabled = false : buttonDisabled = true

    // styles the button if disabled
    let style
    if (buttonDisabled){
        style = {backgroundColor: 'grey', cursor: 'inherit'}
    }

    const handleClick = () => {
        setGameOn(prev => !prev)
    }

    return <Bttn
        type='button'
        onClick={handleClick}
        disabled={buttonDisabled}
        style={style}
    >{text}</Bttn>
}
