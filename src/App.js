import { useState, useEffect } from 'react'
import styled from 'styled-components'
import { Start } from './features/start/Start.js'
import { Board } from './features/board/Board.js'
import { fields as playingFields, playerStart, playerHome } from './features/board/GetField.js'

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
  const [fields, setFields] = useState(playingFields)
  const [startFields, setStartFields] = useState(playerStart)
  const [homeFields, setHomeFields] = useState(playerHome)
  const [gameOn, setGameOn] = useState(false)
  const [dice, setDice] = useState(3)
  const [hasWon, setHasWon] = useState(null)
  const [playerOn, setPlayerOn] = useState(null)
  const [diceCount, setDiceCount] = useState(0)
  const [gotMoves, setGotMoves] = useState(false)

  const [countGetMoves, setCountGetMoves] = useState(0)

  const [playingPlayers, setPlayingPlayers] = useState({
    yellow: true,
    red: true,
    green: true,
    blue: true
  })

  const [computerPlays, setComputerPlays] = useState({
    yellow: false,
    red: false,
    green: false,
    blue: false
  })

  // gets participating players
  const players = []
  for (let player in playingPlayers){
    if (playingPlayers[player]){
      players.push(player)
    }
  }

  // sets initial player
  const getInitialPlayer = () => {
    const initialPlayerIndex = Math.floor(Math.random() * players.length)
    return players[initialPlayerIndex]
  }

  // gets the next player
  const getNextPlayer = () => {
    let nextPlayer
    const allPlayers = ['yellow', 'red', 'green', 'blue']
    let currentIndex = allPlayers.indexOf(playerOn)
    let current = allPlayers[currentIndex]
      
    while(!nextPlayer){
      currentIndex = (currentIndex + 1) % 4
      current = allPlayers[currentIndex]
      if (playingPlayers[current]){
        nextPlayer = current
        setPlayerOn(nextPlayer)
      }
    }
  }

  // keeps track of player positions and initializes them
  const entryFields = {yellow: 0, red: 10, green: 20, blue: 30}
  const exitFields = {yellow: 39, red: 9, green: 19, blue: 29}

  const getFig = (num, player) => {
    return {
      figIndex: num,
      player: player,
      type: 'startField',
      index: num
    }
  }
 
  const getPositions = player => {
    let positions = []
    for (let num=1; num<5; num++){
      positions.push(getFig(num, player))
    }
    return positions
  }

  const playerPositions = {}
  for (let player of players){
    playerPositions[player] = {
      positions: getPositions(player),
      numFigsOut: 0,
      lastFreeHomeField: 4,
      onEntryField: false
    }
  }

  const [positions, setPositions] = useState(playerPositions)
  
  // function to start a new game when clicking on the start button
  const startNewGame = () => {
    for (let startFieldsForPlayer in startFields) {
        for (let field of startFields[startFieldsForPlayer]) {
            if (!field) {
              continue
            }
            if (players.includes(field.color)) {
                field.player = field.color
            } else {
                field.player = null
            }
        }
    }
    for (let field of fields) {
      field.player = null
    }
    for (let homeFieldsForPlayer in homeFields) {
      for (let field of homeFields[homeFieldsForPlayer]) {
        if (!field) {
          continue
        }
        field.player = null
      }
    } 
    setPositions(playerPositions)
    setHasWon(null)
    setGameOn(prev => !prev)
    setGotMoves(false)
    setPlayerOn(getInitialPlayer())
  }

  // checks if a player is hit and sent back to the start fields
  const checkHit = nextField => {
    if (nextField.player) {
      const oppPlayer = nextField.player
      const oppFig = positions[oppPlayer].positions.find(fig => fig.index === nextField.index && fig.type === 'boardField')
      oppFig.type = 'startField'
      oppFig.index = oppFig.figIndex
      positions[oppPlayer].numFigsOut--
      const oppStartField = startFields[oppPlayer][oppFig.index]
      oppStartField.player = oppPlayer
    }
  }

  // sets move-specific values of fields
  const getMoveValues = (field, nextField, figIndex) => {
    field.isMoveFrom = true
    field.figIndex.push(figIndex)
    nextField.isMoveTo = true
    nextField.figIndex.push(figIndex)
  }

  // resets move-specific values of fields
  const resetMoveFields = moveFields => {
    for (let fields of moveFields) {
      const [field, nextField] = fields
      field.isMoveFrom = false
      field.figIndex = []
      field.executeMove = null
      nextField.isMoveTo = false
      nextField.figIndex = []
    }
  }

  // gets next available moves for player based on dice result
  const getMoves = diceResult => {
    setCountGetMoves(prev => prev + 1)
    const pos = positions[playerOn]
    const entryFieldIndex = entryFields[playerOn]
    const exitFieldIndex = exitFields[playerOn]
    let movePossible = false
    let moveFields = []

    // loops through each figure to get its available move
    for (let fig of pos.positions){
      const figIndex = fig.figIndex
      const fieldIndex = fig.index
      let field, nextFieldIndex, nextField

      //if the figure is on a start field
      if (fig.type === 'startField') {
        if (diceResult === 6 && !pos.onEntryField) {
          field = startFields[playerOn][fieldIndex]
          nextField = fields[entryFieldIndex]
          if (nextField.player === playerOn) {
            continue
          }
          getMoveValues(field, nextField, figIndex)
          field.executeMove = () => {
            field.player = null
            checkHit(nextField)
            nextField.player = playerOn
            fig.index = entryFieldIndex
            fig.type = nextField.type
            pos.numFigsOut++
            pos.onEntryField = true
            setDiceCount(0)
            resetMoveFields(moveFields)
            setGotMoves(false)            
            }
          movePossible = true
          moveFields.push([field, nextField])

        } else if (pos.numFigsOut + pos.lastFreeHomeField === 4) {
          if (diceCount === 2) {
            setDiceCount(0)
            getNextPlayer()
          } else {
            setDiceCount(prev => prev + 1)
          }
          setGotMoves(false)
          return
        }

      // if the figure is on a board field or a home field
      } else {
        if (diceResult === 6 && !pos.onEntryField) {
          if (!(pos.numFigsOut + pos.lastFreeHomeField === 4)) {
            continue
          }
        }
        const passExitField = fieldIndex <= exitFieldIndex && fieldIndex + diceResult > exitFieldIndex
        if (fig.type === 'boardField' && !passExitField) {
          field = fields[fieldIndex]
          nextFieldIndex = (fieldIndex + diceResult) % 40
          nextField = fields[nextFieldIndex]
          if (nextField.player === playerOn || (pos.onEntryField && fieldIndex !== entryFieldIndex)) {
            continue
          }
        } else {
          if (fig.type === 'homeField') {
            field = homeFields[playerOn][fieldIndex]
            nextFieldIndex = fieldIndex + diceResult
          } else {
            field = fields[fieldIndex]
            nextFieldIndex = diceResult - (exitFieldIndex - fieldIndex)
          }
          if (nextFieldIndex > pos.lastFreeHomeField) {
            continue
          }
          const nothingInTheWay = homeFields[playerOn].find(f => {
            if (!f) {
              return false
            }
            return f.player && f.index < fieldIndex
          })
          if (nothingInTheWay) {
            continue
          }
          nextField = homeFields[playerOn][nextFieldIndex]
        }
        getMoveValues(field, nextField, figIndex)
        field.executeMove = () => {
          field.player = null
          checkHit(nextField)
          nextField.player = playerOn
          fig.index = nextFieldIndex
          fig.type = nextField.type
          if (pos.onEntryField) {
            pos.onEntryField = false
          } else if (nextField.type === 'homeField' && nextField.index === pos.lastFreeHomeField){
            pos.lastFreeHomeField--
            if (pos.lastFreeHomeField === 0){
              setHasWon(playerOn)
            }
          }
          resetMoveFields(moveFields)
          setGotMoves(false)
          getNextPlayer()
        }
        movePossible = true
        moveFields.push([field, nextField])
      }
    }

    // if there is no possible move
    if (!movePossible) {
      getNextPlayer()
    }

    setGotMoves(true)
  }

  // throws the dice
  const throwDice = () => {
    const result = Math.floor(Math.random() * 6) + 1
    setDice(result)
    setGotMoves(true)
    getMoves(result)
}

  const computerMoves = () => {}

  useEffect(() => {
    if (computerPlays[playerOn]){
      computerMoves()
      setPlayerOn(getNextPlayer())
    }
  }, [gotMoves])

  return (
    <AppBody>
      <Header>
        <h1>Mensch ärgere dich nicht!</h1>
      </Header>
      <Main>
        <Start
          gameOn={gameOn}
          startNewGame={startNewGame}
          playingPlayers={playingPlayers}
          setPlayingPlayers={setPlayingPlayers}
          players={players}
          computerPlays={computerPlays}
          setComputerPlays={setComputerPlays}
          playerOn={playerOn}
          hasWon={hasWon} />
        <Board
          dice={dice}
          fields={fields}
          startFields={startFields}
          homeFields={homeFields}
          gameOn={gameOn}
          playerOn={playerOn}
          throwDice={throwDice}
          gotMoves={gotMoves} />
      </Main>
      <p>gameOn: {gameOn ? 'true' : 'false'},
        playerOn: {playerOn},
        gotMoves: {gotMoves ? 'true' : 'false'},
        diceCount: {diceCount},
        countGetMoves: {countGetMoves}
      </p>
      <Footer>
        <p>Created by Michael Oberst</p>
      </Footer>
    </AppBody>
  )
}

export default App;
