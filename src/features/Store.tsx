import {configureStore} from '@reduxjs/toolkit';
import startReducer from './start/StartSlice';
import boardReducer from './board/BoardSlice';

export const store = configureStore({
    reducer: {
        start: startReducer,
        board: boardReducer
    }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
