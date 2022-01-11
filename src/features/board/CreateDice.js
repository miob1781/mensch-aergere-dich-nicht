import styled from 'styled-components'

export const DiceContainer = styled.div`
    @keyframes diceLightUp {
        from {
            background-color: lightgrey;
        }
        to {
            background-color: white;
        }
    }
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
    background-color: lightgrey;
    grid-area: 6/6/span 1/span 1;
    @media only screen and (max-width: 600px) {
        right: 25vw;
        bottom: 25vw;
        width: 7vw;
        height: 7vw;
        grid-template-columns: repeat(3, 2vw);
        grid-template-rows: repeat(3, 2vw);
        gap: 0.5vw;
        padding: 1.5vw;
        border: black 0.6vw solid;
    }
`

const getDiceDot = (key, row, column, dice) => {
    let visibility = 'hidden'
    switch(dice) {
        case 1:
            if (key === 22) {
                visibility = 'visible'
            }
            break
        case 2:
            if (key === 31 || key === 13) {
                visibility = 'visible'
            }
            break
        case 3:
            if (key === 31 || key === 22 || key === 13) {
                visibility = 'visible'
            }
            break
        case 4:
            if (key === 11 || key === 31 || key === 13 || key === 33) {
                visibility = 'visible'
            }
            break
        case 5:
            if (key === 11 || key === 31 || key === 22 || key === 13 || key === 33) {
                visibility = 'visible'
            }
            break
        case 6:
            if (key === 11 || key === 31 || key === 21 || key === 23 || key === 13 || key === 33) {
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

export const getDiceDots = dice => {
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
