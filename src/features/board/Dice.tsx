import {useState, useEffect} from 'react'
import {useAppSelector, useAppDispatch} from '../hooks'
import {Player} from '../types'
import {DiceContainer, getDiceDots} from './CreateDice'
import {selectComputerOn} from '../start/StartSlice'
import {throwDice, setDiceThrown, setReadyToThrowDice} from './BoardSlice'

/** dice component */
export function Dice() {
    const dispatch = useAppDispatch()
    const gameOn = useAppSelector(state => state.start.gameOn)
    const diceResult = useAppSelector(state => state.board.dice)
    const playerOn = useAppSelector(state => state.board.playerOn)
    const computerOn = useAppSelector(selectComputerOn)
    const readyToThrowDice = useAppSelector(state => state.board.readyToThrowDice)
    const diceWhite = useAppSelector(state => state.board.diceThrown || state.board.gotMoves)
    const [isPlaying, setIsPlaying] = useState(false)

    // sets position of dice
    let right: string = ''
    let bottom: string = ''
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

    const style: {[attribute: string]: string} = {
        right: right,
        bottom: bottom,
        cursor: readyToThrowDice && !computerOn ? 'pointer' : 'inherit',
        backgroundColor: diceWhite ? 'white' : 'lightgrey',
        animation: isPlaying ? 'diceLightUp 400ms ease-out 0s 1 normal forwards' : 'unset'
    }

    const handleClick = () => {
        if (!computerOn && readyToThrowDice && gameOn) {
            setIsPlaying(true)
            dispatch(setReadyToThrowDice(false))
            dispatch(throwDice())
        }
    }

    const handleAnimationEnd = () => {
        setIsPlaying(false)
        dispatch(setDiceThrown(true))
    }

    useEffect(() => {
        if (computerOn && readyToThrowDice && gameOn) {
            setIsPlaying(true)
            dispatch(setReadyToThrowDice(false))
            dispatch(throwDice())
        }
    }, [dispatch, gameOn, computerOn, playerOn, readyToThrowDice])

    return (
        <DiceContainer
            style={style}
            onClick={handleClick}
            onAnimationEnd={handleAnimationEnd}
            data-testid={'dice'}
        >
            {getDiceDots(diceResult)}
        </DiceContainer>
    )
}
