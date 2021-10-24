import styled from 'styled-components'

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
    cursor: pointer;
    grid-area: 6/6/span 1/span 1;
`

export function Dice(props){
    const {diceResult} = props
    return (
        <DiceContainer>
            {getDice(diceResult)}
        </DiceContainer>
    )
}

const getDiceDot = (row, column) => {
    const Dot = styled.div`
        grid-row-start: ${row};
        grid-column-start: ${column};
        border-radius: 50%;
        background-color: black;
    `
    return <Dot />
}

const getDice = diceResult => {
    switch (diceResult){
        case 1:
            return [
                getDiceDot(2, 2)
            ]
        case 2:
            return [
                getDiceDot(1, 3),
                getDiceDot(3, 1)
            ]
        case 3:
            return [
                getDiceDot(1, 3),
                getDiceDot(2, 2),
                getDiceDot(3, 1)
            ]
        case 4:
            return [
                getDiceDot(1, 1),
                getDiceDot(1, 3),
                getDiceDot(3, 1),
                getDiceDot(3, 3)
            ]
        case 5:
            return [
                getDiceDot(1, 1),
                getDiceDot(1, 3),
                getDiceDot(2, 2),
                getDiceDot(3, 1),
                getDiceDot(3, 3)
            ]
        case 6:
            return [
                getDiceDot(1, 1),
                getDiceDot(1, 3),
                getDiceDot(2, 1),
                getDiceDot(2, 3),
                getDiceDot(3, 1),
                getDiceDot(3, 3)
            ]
        default: return null
    }
}
