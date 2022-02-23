import {useState} from 'react'
import {useAppSelector, useAppDispatch} from '../hooks'
import {Player} from '../types'
import {DiceContainer, getDiceDots} from './CreateDice'
import {selectReadyToClickOnDice} from '../start/StartSlice'
import {throwDice, setDiceThrown} from './BoardSlice'

/** dice component */
export function Dice() {
    const dispatch = useAppDispatch()
    const diceResult = useAppSelector(state => state.board.dice)
    const playerOn = useAppSelector(state => state.board.playerOn)
    const readyToClickOnDice = useAppSelector(selectReadyToClickOnDice)
    const diceWhite = useAppSelector(state => state.board.diceThrown || state.board.gotMoves)
    const [isPlaying, setIsPlaying] = useState(false)

    // sets position of dice
    let right: string, bottom: string
    const onPhone: boolean = window.innerWidth <= 600
    if (playerOn === Player.Yellow) {
        right = onPhone ? '-19vw' : '-115px'
        bottom = onPhone ? '23vw' : '130px'
    } else if (playerOn === Player.Red) {
        right = onPhone ? '-19vw' : '-115px'
        bottom = onPhone ? '-18vw' : '-110px'
    } else if (playerOn === Player.Green) {
        right = onPhone ? '23vw' : '130px'
        bottom = onPhone ? '-18vw' : '-110px'
    } else if (playerOn === Player.Blue) {
        right = onPhone ? '23vw' : '130px'
        bottom = onPhone ? '23vw' : '130px'
    }
    
    const style: {[attribute: string]: string} = { // @ts-ignore
        right: right, // @ts-ignore
        bottom: bottom,
        cursor: readyToClickOnDice ? 'pointer' : 'inherit',
        backgroundColor: diceWhite ? 'white' : 'lightgrey',
        animation: isPlaying ? 'diceLightUp 400ms ease-out 0s 1 normal forwards' : 'unset'
    }

    const handleClick = (): void => {
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
