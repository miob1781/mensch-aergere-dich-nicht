import styled from 'styled-components'
import {Field} from './Field.js'
import {fields, playerStart, playerHome} from './GetField.js'
import {Dice} from './Dice.js'

const BoardContainer = styled.div`
    display: inline-grid;
    width: 490px;
    height: 490px;
    padding: 20px;
    margin-left: 50px;
    grid-template-columns: repeat(11, 40px);
    grid-template-rows: repeat(11, 40px);
    gap: 5px;
    background-color: brown;
`

export function Board(props){
    const {dice} = props
    return (
        <BoardContainer>
            <Dice
                diceResult = {dice}
            />
            {fields.map(field => {
                return <Field
                    key={field.index}
                    data-testid={'field-' + field.index}
                    row={field.row}
                    column={field.column}
                    color='white'
                    border={field.index % 10 === 0 ? 'black 4px solid' : ''} />
            })}
            {playerStart.map(field => {
                return <Field
                    key={field.index}
                    data-testid={'startField-' + field.player + field.index}
                    row={field.row}
                    column={field.column}
                    color={field.player} />
            })}            
            {playerHome.map(field => {
                return <Field
                    key={field.index}
                    data-testid={'homeField-' + field.player + field.index}
                    row={field.row}
                    column={field.column}
                    color={field.player} />
            })}
        </BoardContainer>
    )
}