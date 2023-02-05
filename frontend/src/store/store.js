import { configureStore } from '@reduxjs/toolkit';
import dataSlice from './userSlice';

const store = configureStore({
    reducer: dataSlice,
});

export {store};