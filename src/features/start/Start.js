import styled from 'styled-components'
import {useState} from 'react'
import {Player} from './Player.js'
import {StartButton} from './StartButton.js'
import {Display} from './Display.js'

const StartContainer = styled.div`

`

export function Start(props){
    const {
        text,
        gameOn,
        setGameOn,
        hasWon,
        playerOn,
        playingPlayers,
        setPlayingPlayers,
        computerPlays, 
        setComputerPlays
    } = props

    const players = ['yellow', 'red', 'green', 'blue']

    return (
        <StartContainer>
            {players.map(player => {
                return <Player
                    player={player}
                    playingPlayers={playingPlayers}
                    setPlayingPlayers={setPlayingPlayers}
                    computerPlays={computerPlays}
                    setComputerPlays={setComputerPlays} />
            })}
            <StartButton
                gameOn={gameOn}
                setGameOn={setGameOn}
                playingPlayers={playingPlayers} />
            <Display text={text} />
        </StartContainer>
    )
}
