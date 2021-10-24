import styled from 'styled-components'

const fieldColors = {
    yellow: 'moccasin',
    red: 'salmon',
    green: 'lightgreen',
    blue: 'lightblue'
}

const getFieldContainer = (row, column, color, border) => {
    return styled.div`
        grid-row-start: ${row};
        grid-column-start: ${column};
        border-radius: 50%;
        border: ${border};
        background-color: ${color};
        cursor: pointer;
    `
}

export function Field(props){
    const {row, column, color, border, playingPlayers} = props
    let fieldColor
    color === 'white' ? fieldColor = 'white' : fieldColor = fieldColors[color]
    const FieldContainer = getFieldContainer(row, column, fieldColor, border)

    const handleChange = () => {
        
    }

    return (
        <FieldContainer
            onChange={handleChange} />        
    )
}
