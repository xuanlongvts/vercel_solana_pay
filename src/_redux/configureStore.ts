import { configureStore, StoreEnhancer } from '@reduxjs/toolkit';
import { createInjectorsEnhancer } from 'redux-injectors';
import createSagaMiddleware from 'redux-saga';
import { createWrapper } from 'next-redux-wrapper';

import ENV, { envName } from '_config';

import rootSaga from './sagas';
import createReducer from './reducers';

const storeConfig = (initialState = {}) => {
    const sagaMiddleware = createSagaMiddleware({});

    const middlewares = [sagaMiddleware];

    const enhancers = [
        createInjectorsEnhancer({
            createReducer,
            runSaga: sagaMiddleware.run,
        }),
    ] as StoreEnhancer[];

    const store = configureStore({
        reducer: createReducer(),
        preloadedState: initialState,
        middleware: [...middlewares],
        devTools: ENV !== envName.production,
        enhancers,
    });

    sagaMiddleware.run(rootSaga);

    return store;
};

export default storeConfig;
export const wrapperStore = createWrapper(storeConfig, { debug: true });
