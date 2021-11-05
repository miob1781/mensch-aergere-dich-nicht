import styled from 'styled-components'
import {Field} from './Field.js'
import {Dice} from './Dice.js'
import {useState} from 'react'

const BoardContainer = styled.div`
    display: inline-grid;
    width: 490px;
    height: 490px;
    padding: 20px;
    margin-left: 50px;
    grid-template-columns: repeat(11, 40px);
    grid-template-rows: repeat(11, 40px);
    gap: 5px;
    background-color: maroon;
`

export function Board(props){
    const {
        dice,
        fields,
        startFields,
        homeFields,
        gameOn,
        playerOn,
        throwDice,
        gotMoves
    } = props

    const [mouseOverMoveFrom, setMouseOverMoveFrom] = useState(false)
    const [figIndexMouse, setFigIndexMouse] = useState(null)

    const getTestidParticle = array => {
        if (array === fields){
            return 'field-'
        } else if (array === startFields){
            return 'startField-'
        } else {
            return 'homeField-'
        }
    }

    const getFieldComponents = array => {
        return (
            array.map(field => {
                if (!field) {
                    return null
                }
                return <Field
                    key={field.index}
                    data-testid={getTestidParticle(array) + field.player + field.index}
                    field={field}
                    playerOn={playerOn}
                    gotMoves={gotMoves}
                    mouseOverMoveFrom={mouseOverMoveFrom}
                    setMouseOverMoveFrom={setMouseOverMoveFrom}
                    figIndexMouse={figIndexMouse}
                    setFigIndexMouse={setFigIndexMouse} />
            })
        )
    }

    return (
        <BoardContainer>
            <Dice
                dice={dice}
                gameOn={gameOn}
                playerOn={playerOn}
                throwDice={throwDice}
                gotMoves={gotMoves}
            />
            {getFieldComponents(fields)}
            {getFieldComponents(startFields.yellow)}
            {getFieldComponents(startFields.red)}
            {getFieldComponents(startFields.green)}
            {getFieldComponents(startFields.blue)}
            {getFieldComponents(homeFields.yellow)}
            {getFieldComponents(homeFields.red)}
            {getFieldComponents(homeFields.green)}
            {getFieldComponents(homeFields.blue)}

        </BoardContainer>
    )
}
