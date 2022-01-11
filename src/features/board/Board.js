import styled from 'styled-components'
import {Field} from './Field.js'
import {Dice} from './Dice.js'
import {fields, playerStart, playerHome} from './GetField.js';

const BoardContainer = styled.div`
    display: inline-grid;
    max-width: 490px;
    padding: 20px;
    margin-left: 50px;
    margin-right: 10px;
    grid-template-columns: repeat(11, minmax(0, 40px));
    grid-template-rows: repeat(11, minmax(0, 40px));
    gap: 5px;
    background-color: maroon;
    @media only screen and (max-width: 600px) {
        margin-left: 0px;
        margin-right: 20px;
        display: grid;
        width: 84vw;
        height: 84vw;
        gap: 0.9vw;
        padding: 4.2vw;
    }
`

export function Board() {
    const getTestidParticle = array => {
        if (array === fields) {
            return 'field-'
        } else if (array === playerStart) {
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
                    data-testid={getTestidParticle(array) + field.color + field.index}
                    row={field.row}
                    column={field.column}
                    index={field.index}
                    type={field.type}
                    color={field.color}
                />
            })
        )
    }

    return (
        <BoardContainer>
            <Dice />
            {getFieldComponents(fields)}
            {getFieldComponents(playerStart.yellow)}
            {getFieldComponents(playerStart.red)}
            {getFieldComponents(playerStart.green)}
            {getFieldComponents(playerStart.blue)}
            {getFieldComponents(playerHome.yellow)}
            {getFieldComponents(playerHome.red)}
            {getFieldComponents(playerHome.green)}
            {getFieldComponents(playerHome.blue)}
        </BoardContainer>
    )
}
