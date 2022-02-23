import styled from 'styled-components'
import {useAppSelector, useAppDispatch} from '../hooks'
import {Player as P} from '../types'
import {getPlayer} from '../board/BoardFunctions'
import {togglePlayerPlays, toggleComputerPlays} from './StartSlice'

/** form component to start a new game */
const Form = styled.form`
    margin-bottom: 3px;
`

/** radio button component */
const Radio = styled.div`
    margin-left: 20px;
`

/** player component to make selections for each player */
export function Player(props: {player: string}) {
    const {player} = props
    const dispatch = useAppDispatch()
    const players = useAppSelector(state => state.start.players)
    const playerTyped: P = getPlayer(player)

    const handleCheckbox = () => {
        dispatch(togglePlayerPlays(playerTyped))
    }

    const handleRadio = () => {
        dispatch(toggleComputerPlays(playerTyped))
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
            <label htmlFor={player}>{player}</label>
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
                <label style={{marginRight: '10px'}} htmlFor={'human-' + player}>Human</label>
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
                <label htmlFor={'computer-' + player}>Computer</label>
            </Radio>
        </Form>
    )
}
