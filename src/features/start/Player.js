import styled from 'styled-components'
import {useSelector, useDispatch} from 'react-redux'
import {togglePlayerPlays, toggleComputerPlays} from './StartSlice.js'

const Form = styled.form`
    margin-bottom: 3px;
`

const Radio = styled.div`
    margin-left: 20px;
`

export function Player(props) {
    const {player} = props
    const playerLabels = {yellow: 'Yellow', red: 'Red', green: 'Green', blue: 'Blue'}
    const dispatch = useDispatch()
    const players = useSelector(state => state.start.players)

    const handleCheckbox = () => {
        dispatch(togglePlayerPlays(player))
    }

    const handleRadio = () => {
        dispatch(toggleComputerPlays(player))
    }

    return (
        <Form data-testid={'select-' + player}>
            <input
                type='checkbox'
                id={player}
                name={player}
                onChange={handleCheckbox}
                checked={players[player].plays}
            />
            <label for={player}>{playerLabels[player]}</label>
            <br />
            <Radio>
                <input
                    type='radio'
                    id={'human-' + player}
                    name={'radio-' + player}
                    value='human'
                    onChange={handleRadio}
                    checked={!players[player].computerPlays}
                    disabled={!players[player].plays}
                />
                <label style={{marginRight: '10px'}} for={'human-' + player}>Human</label>
                <input
                    type='radio'
                    id={'computer-' + player}
                    name={'radio-' + player}
                    value='computer'
                    onChange={handleRadio}
                    checked={players[player].computerPlays}
                    disabled={!players[player].plays}
                    data-testid={player + '-computer'}
                />
                <label for={'computer-' + player}>Computer</label>
            </Radio>
        </Form>
    )
}
