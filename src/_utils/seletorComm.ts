import { createSelector } from '@reduxjs/toolkit';

export const funcSelectComm = (name_reducer: any, FIELD: string) => createSelector([name_reducer], i => i[FIELD]);
