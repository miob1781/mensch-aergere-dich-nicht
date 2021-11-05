import styled from 'styled-components'
import {Player} from './Player.js'
import {StartButton} from './StartButton.js'
import {Display} from './Display.js'

const StartContainer = styled.div`

`

export function Start(props){
    const {
        gameOn,
        startNewGame,
        playingPlayers,
        setPlayingPlayers,
        players,
        playerOn,
        computerPlays, 
        setComputerPlays,
        hasWon
    } = props

    const allPlayers = ['yellow', 'red', 'green', 'blue']
    
    let display
    gameOn ? display = 'none' : display = 'block'

    return (
        <StartContainer>
            <div style={{display: display}}>
                {allPlayers.map(player => {
                    return <Player
                        player={player}
                        playingPlayers={playingPlayers}
                        setPlayingPlayers={setPlayingPlayers}
                        computerPlays={computerPlays}
                        setComputerPlays={setComputerPlays} />
                })}
            </div>
            <StartButton
                gameOn={gameOn}
                startNewGame={startNewGame}
                players={players} />
            <Display
                gameOn={gameOn}
                playerOn={playerOn}
                hasWon={hasWon} />
        </StartContainer>
    )
}
