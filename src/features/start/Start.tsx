import styled from 'styled-components'
import {useAppSelector} from '../hooks'
import {Player} from './Player'
import {StartButton} from './StartButton'
import {Display} from './Display'

/** styled component for the Start component */
const StartContainer = styled.div`
    margin-bottom: 20px;
    @media only screen and (max-width: 600px) {
        font-size: 1.4em;
    }
`

/** component to start a new game */
export function Start() {
    const gameOn = useAppSelector(state => state.start.gameOn)
    const allPlayers: string[] = ['Yellow', 'Red', 'Green', 'Blue']

    return (
        <StartContainer>
            <div style={{display: gameOn? 'none' : 'block'}}>
                {allPlayers.map((player: string): JSX.Element => <Player key={player} player={player} />)}
            </div>
            <StartButton />
            <Display />
        </StartContainer>
    )
}
