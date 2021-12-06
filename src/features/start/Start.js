import styled from 'styled-components'
import {useSelector} from 'react-redux'
import {Player} from './Player.js'
import {StartButton} from './StartButton.js'
import {Display} from './Display.js'

const StartContainer = styled.div``

export function Start() {
    const gameOn = useSelector(state => state.start.gameOn)
    const allPlayers = ['yellow', 'red', 'green', 'blue']

    return (
        <StartContainer>
            <div
                style={{display: gameOn? 'none' : 'block'}}
            >
                {allPlayers.map(player => <Player player={player}  />)}
            </div>
            <StartButton />
            <Display />
        </StartContainer>
    )
}
