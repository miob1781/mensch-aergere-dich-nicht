import {configureStore} from '@reduxjs/toolkit';
import startReducer from './features/start/StartSlice.js';
import boardReducer from './features/board/BoardSlice.js';

export const store = configureStore({
    reducer: {
        start: startReducer,
        board: boardReducer
    }
})
