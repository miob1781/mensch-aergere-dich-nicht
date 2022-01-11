import {useState} from 'react'
import {useSelector, useDispatch} from 'react-redux'
import {DiceContainer, getDiceDots} from './CreateDice.js'
import {selectReadyToClickOnDice} from '../start/StartSlice.js'
import {throwDice, setDiceThrown} from './BoardSlice.js'

export function Dice() {
    const dispatch = useDispatch()
    const diceResult = useSelector(state => state.board.dice)
    const playerOn = useSelector(state => state.board.playerOn)
    const readyToClickOnDice = useSelector(selectReadyToClickOnDice)
    const diceWhite = useSelector(state => state.board.diceThrown || state.board.gotMoves)
    const [isPlaying, setIsPlaying] = useState(false)

    // sets position of dice
    let right, bottom
    const onPhone = window.innerWidth <= 600
    if (playerOn === 'yellow') {
        right = onPhone ? '-19vw' : '-115px'
        bottom = onPhone ? '23vw' : '130px'
    } else if (playerOn === 'red') {
        right = onPhone ? '-19vw' : '-115px'
        bottom = onPhone ? '-18vw' : '-110px'
    } else if (playerOn === 'green') {
        right = onPhone ? '23vw' : '130px'
        bottom = onPhone ? '-18vw' : '-110px'
    } else {
        right = onPhone ? '23vw' : '130px'
        bottom = onPhone ? '23vw' : '130px'
    }
    
    const style = {
        right: right,
        bottom: bottom,
        cursor: readyToClickOnDice ? 'pointer' : 'inherit',
        backgroundColor: diceWhite ? 'white' : 'lightgrey',
        animation: isPlaying ? 'diceLightUp 400ms ease-out 0s 1 normal forwards' : 'unset'
    }

    const handleClick = () => {
      if (readyToClickOnDice) {
        setIsPlaying(true)
        dispatch(throwDice())
        dispatch(setDiceThrown(true))
      }
    }

    return (
        <DiceContainer
            onClick={handleClick}
            style={style}
            data-testid={'dice'}
            onAnimationEnd={() => {setIsPlaying(false)}}
        >
            {getDiceDots(diceResult)}
        </DiceContainer>
    )
}
