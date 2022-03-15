import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {RootState} from '../Store'
import {StartState, StartPlayer, Player} from '../types';
import {getPlayer, getStringFromPlayer} from '../board/BoardFunctions';

const initialState: StartState = {
    gameOn: false,
    players: {
        Yellow: {
            plays: true,
            computerPlays: false
        },
        Red: {
            plays: true,
            computerPlays: false
        },
        Green: {
            plays: true,
            computerPlays: false
        },
        Blue: {
            plays: true,
            computerPlays: false
        }
    }
}

/** slice for the functionality needed to start a game */
const startSlice = createSlice({
    name: 'start',
    initialState,
    reducers: {
        toggleGameOn: state => {
            state.gameOn = !state.gameOn
        },
        togglePlayerPlays: (state, action: PayloadAction<Player>) => {
            const player: Player = action.payload
            state.players[player].plays = !state.players[player].plays
        },
        toggleComputerPlays: (state, action: PayloadAction<Player>) => {
            const player: Player = action.payload
            state.players[player].computerPlays = !state.players[player].computerPlays
        }
    }
})

/** selector for an array with the participating players */
export const selectParticipatingPlayers = (state: RootState): Player[] => {
    const players: {[color: string]: StartPlayer} = state.start.players
    const participatingPlayers: Player[] = []
    for (let playerString in players) {
        if (players[playerString].plays) {
            const player: Player = getPlayer(playerString)
            participatingPlayers.push(player)
        }
    }
    return participatingPlayers
}

/** selector to determine whether the computer is to move */
export const selectComputerOn = (state: RootState): boolean => {
    const playerOn: Player = state.board.playerOn
    const computerOn: boolean = state.start.players[getStringFromPlayer(playerOn)].computerPlays
    return computerOn
}

export default startSlice.reducer;
export const {toggleGameOn, togglePlayerPlays, toggleComputerPlays} = startSlice.actions;
