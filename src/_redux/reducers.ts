import { combineReducers } from '@reduxjs/toolkit';

import { InjectedReducersType } from '_types/injector_typings';

const createReducer = (injectedReducers: InjectedReducersType = {}) => {
    return combineReducers({
        ...injectedReducers,
    });
};

export default createReducer;
