import styled from 'styled-components'
import {Field as F, HomeOrStartFields} from '../types'
import {Field} from './Field'
import {Dice} from './Dice'
import {boardFields, startFields, homeFields} from './GetField';

/** styled component for Board */
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

/** component that contains the board of the game */
export function Board() {
    /** utility function to return a text particle for the testid attribute */
    const getTestidParticle = (array: F[]|HomeOrStartFields): string => {
        if (array === boardFields) {
            return 'field-'
        } else if (array === startFields) {
            return 'startField-'
        } else {
            return 'homeField-'
        }
    }

    /** utility function to return the field components of the board */
    const getFieldComponents = (array: F[]): (JSX.Element|null)[] => {
        return (
            array.map((field: F): JSX.Element|null => {
                if (field.row === -1) {
                    return null
                }
                return <Field
                    key={Number(field.index).toString()}
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
            {getFieldComponents(boardFields)}
            {getFieldComponents(startFields.Yellow)}
            {getFieldComponents(startFields.Red)}
            {getFieldComponents(startFields.Green)}
            {getFieldComponents(startFields.Blue)}
            {getFieldComponents(homeFields.Yellow)}
            {getFieldComponents(homeFields.Red)}
            {getFieldComponents(homeFields.Green)}
            {getFieldComponents(homeFields.Blue)}
        </BoardContainer>
    )
}
