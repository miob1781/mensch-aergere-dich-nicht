import styled from 'styled-components'
import { useState } from 'react'

const DiceContainer = styled.div`
    display: inline-grid;
    position: relative;
    right: 130px;
    bottom: 130px;
    width: 36px;
    height: 36px;
    grid-template-columns: repeat(3, 10px);
    grid-template-rows: repeat(3, 10px);
    gap: 3px;
    padding: 8px;
    border: black 2px solid;
    border-radius: 15%;
    background-color: white;
    grid-area: 6/6/span 1/span 1;
`

export function Dice(props){
    const {
        dice,
        gameOn,
        playerOn,
        throwDice,
        gotMoves
    } = props

    let cursor = 'inherit'
    if (gameOn && !gotMoves) {
        cursor = 'pointer'
    }

    let right, bottom
    if (playerOn === 'yellow') {
        right = '-115px'
        bottom = '130px'
    } else if (playerOn === 'red') {
        right = '-115px'
        bottom = '-110px'
    } else if (playerOn === 'green') {
        right = '130px'
        bottom = '-110px'
    } else {
        right = '130px'
        bottom = '130px'
    }

    const [countDice, setCountDice] = useState(0)

    const handleClick = () => {
        setCountDice(prev => prev + 1)
    if (gameOn && !gotMoves) {
            throwDice()
        }
    }

    return (
        <DiceContainer
            onClick={handleClick}
            style={{cursor: cursor, right: right, bottom: bottom}}>
            {getDiceDots(dice)}
            <p>countDice: {countDice}</p>
        </DiceContainer>
    )
}

const getDiceDot = (key, row, column, dice) => {
    let visibility = 'hidden'
    switch(dice){
        case 1:
            if (key === 22){
                visibility = 'visible'
            }
            break
        case 2:
            if (key === 31 || key === 13){
                visibility = 'visible'
            }
            break
        case 3:
            if (key === 31 || key === 22 || key === 13){
                visibility = 'visible'
            }
            break
        case 4:
            if (key === 11 || key === 31 || key === 13 || key === 33){
                visibility = 'visible'
            }
            break
        case 5:
            if (key === 11 || key === 31 || key === 22 || key === 13 || key === 33){
                visibility = 'visible'
            }
            break
        case 6:
            if (key === 11 || key === 31 || key === 21 || key === 23 || key === 13 || key === 33){
                visibility = 'visible'
            }
            break
        default: alert('no dice')
        }

    const Dot = styled.div`
        grid-row-start: ${row};
        grid-column-start: ${column};
        border-radius: 50%;
        background-color: black;
        visibility: ${visibility};
    `
    return <Dot key={key} />
}

const getDiceDots = dice => {
    let diceDots = []
    let key
    for (let i=1; i<4; i++){
        for (let j=1; j<4; j++){
            key = i * 10 + j
            diceDots.push(getDiceDot(key, i, j, dice))
        }
    }
    return diceDots
}
