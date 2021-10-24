import styled from 'styled-components'

const InputContainer = styled.div`
    background-color: white;
`

const RadioContainer = styled.div`
    margin-left: 20px;
`

export function Player(props){
    const {
        player,
        playingPlayers,
        setPlayingPlayers,
        computerPlays,
        setComputerPlays
    } = props

    const playerLabels = {yellow: 'Yellow', red: 'Red', green: 'Green', blue: 'Blue'}

    const handleCheckbox = () => {
        setPlayingPlayers(prev => ({...prev, [player]: !prev[player]}))
    }

    const handleRadio = () => {
        setComputerPlays(prev => ({...prev, [player]: !prev[player]}))
    }

    return (
        <InputContainer>
            <input
                type='checkbox'
                id={player}
                data-testid={'select-' + player}
                onChange={handleCheckbox}
                checked={playingPlayers[player]} />
            <label for={player}>{playerLabels[player]}</label>
            <br />
            <RadioContainer>
                <input
                    type='radio'
                    id={'human-' + player}
                    data-testid={'human-' + player}
                    name={'radio-' + player}
                    value='human'
                    onChange={handleRadio}
                    checked={!computerPlays[player]} />
                <label for={'human-' + player}>Human</label>
                <input
                    type='radio'
                    id={'computer-' + player}
                    data-testid={'computer-' + player}
                    name={'radio-' + player}
                    value='computer'
                    onChange={handleRadio}
                    checked={computerPlays[player]} />
                <label for={'computer-' + player}>Computer</label>
            </RadioContainer>
        </InputContainer>
    )
}
