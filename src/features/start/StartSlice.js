import {createSlice} from '@reduxjs/toolkit';

const startSlice = createSlice({
    name: 'start',
    initialState: {
        gameOn: false,
        players: {
            yellow: {
                plays: true,
                computerPlays: false
            },
            red: {
                plays: true,
                computerPlays: false
            },
            green: {
                plays: true,
                computerPlays: false
            },
            blue: {
                plays: true,
                computerPlays: false
            }
        }
    },
    reducers: {
        toggleGameOn: (state, action) => {
            state.gameOn = !state.gameOn
        },
        togglePlayerPlays: (state, action) => {
            const player = action.payload
            state.players[player].plays = !state.players[player].plays
        },
        toggleComputerPlays: (state, action) => {
            const player = action.payload
            state.players[player].computerPlays = !state.players[player].computerPlays
        }
    }
})

export const selectParticipatingPlayers = state => {
    const players = state.start.players
    const participatingPlayers = []
    for (let player in players) {
        if (players[player].plays) {
            participatingPlayers.push(player)
        }
    }
    return participatingPlayers
}

export const selectComputerOn = state => {
    const playerOn = state.board.playerOn
    const computerOn = state.start.players[playerOn].computerPlays
    return computerOn
}

export const selectReadyToClickOnDice = state => {
    const computerOn = selectComputerOn(state) 
    const readyToClickOnDice = state.start.gameOn && !computerOn && !state.board.diceThrown && !state.board.gotMoves && !state.board.readyToCleanUp
    return readyToClickOnDice
}

export default startSlice.reducer;
export const {toggleGameOn, togglePlayerPlays, toggleComputerPlays} = startSlice.actions;
