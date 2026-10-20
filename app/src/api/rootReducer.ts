import { combineSlices } from '@reduxjs/toolkit';
import { firestoreApi } from './firestoreApi';

export const rootReducer = combineSlices(firestoreApi);
