import { useState, useEffect } from 'react'
import styled from 'styled-components'
import { Start } from './features/start/Start.js'
import { Board } from './features/board/Board.js'
import { fields, playerStart, playerHome } from './features/board/GetField.js'

const AppBody = styled.body`
  width: 800px;
  background-color: white;
  font-family: Calibri;
  box-sizing: border-box;
`

const Header = styled.header`
  width: 100%;
`

const Main = styled.main`
  width: 100%;
`

const Footer = styled.footer`
  width: 100%;
  font-size: 0.8em;
`

function App() {
  const [display, setDisplay] = useState('Select the players you want to play and the players the computer is to play.')
  const [board, setBoard] = useState(fields)
  const [dice, setDice] = useState(null)
  const [gameOn, setGameOn] = useState(false)
  const [hasWon, setHasWon] = useState(false)
  const [playerOn, setPlayerOn] = useState(null)
  const [playingPlayers, setPlayingPlayers] = useState({
    yellow: true,
    red: true,
    green: true,
    blue: true
  })
  const [computerPlays, setComputerPlays] = useState({
    yellow: true,
    red: true,
    green: true,
    blue: true
  })

  const throwDice = () => {
    const result = Math.floor(Math.random() * 6) + 1
    setDice(result)
  }

  useEffect(() => {
    throwDice()

  }, [])

  return (
    <AppBody>
      <Header>
        <h1>Mensch ärgere dich nicht!</h1>
      </Header>
      <Main>
        <Start
          text={display}
          gameOn={gameOn}
          setGameOn={setGameOn}
          hasWon={hasWon}
          playerOn={playerOn}
          playingPlayers={playingPlayers}
          setPlayingPlayers={setPlayingPlayers}
          computerPlays={computerPlays}
          setComputerPlays={setComputerPlays} />
        <Board dice={dice} />
      </Main>
      <Footer>
        <p>Created by Michael Oberst</p>
      </Footer>
    </AppBody>
  )
}

export default App;
