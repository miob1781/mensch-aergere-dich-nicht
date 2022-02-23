import styled from 'styled-components'

/** styled component for the dice */
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
interface DotProps {
    row: number,
    column: number,
    visibility: string
}

/** component for the dots on the dice */
const Dot = styled.div`
    grid-row-start: ${(props: DotProps) => props.row};
    grid-column-start: ${props => props.column};
    border-radius: 50%;
    background-color: black;
    visibility: ${props => props.visibility};
`

/** utility function to return a component for a dot of the dice */
const getDotValues = (key: number, row: number, column: number, dice: number): [number, number, number, string] => {
    let visibility: string = 'hidden'
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
        default: console.log('no dice')
        }
    const dotValues: [number, number, number, string] = [key, row, column, visibility]
    return dotValues
}

/** function to return the dice dots */
export const getDiceDots = (dice: number): JSX.Element[] => {
    let diceDots: JSX.Element[] = []
    for (let i=1; i<4; i++) {
        for (let j=1; j<4; j++) {
            const keyValue: number = i * 10 + j
            const dotValues: [number, number, number, string] = getDotValues(keyValue, i, j, dice)
            const [key, row, column, visibility] = dotValues
            const dot: JSX.Element = <Dot
                key={Number(key).toString()}
                row={row}
                column={column}
                visibility={visibility}
            />
            diceDots.push(dot)
        }
    }
    return diceDots
}
