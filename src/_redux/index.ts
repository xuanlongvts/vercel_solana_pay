import { createSlice as createSliceOriginal, SliceCaseReducers, CreateSliceOptions } from '@reduxjs/toolkit';
import { useInjectReducer as useReducer, useInjectSaga as useSaga } from 'redux-injectors';

import { InjectReducerParams, RootStateKeyType, InjectSagaParams } from '_types/injector_typings';

export function useInjectReducer<Key extends RootStateKeyType>(params: InjectReducerParams<Key>) {
    return useReducer(params);
}

export const useInjectSaga = (params: InjectSagaParams) => useSaga(params);

export const createSlice = <State, CaseReducers extends SliceCaseReducers<State>, Name extends RootStateKeyType>(
    options: CreateSliceOptions<State, CaseReducers, Name>,
) => {
    return createSliceOriginal(options);
};
