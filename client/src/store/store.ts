import { configureStore, type ReducersMapObject } from '@reduxjs/toolkit';

import { GameboardReducer } from '@/entities/GameBoard';

import { $api } from '@/shared/api';

import { createReducerManager } from './reducerManager';
import type { StateSchema } from './StateSchema';

export function CreateReduxStore(
    initialState?: StateSchema,
    lazyReducers?: ReducersMapObject<StateSchema>,
) {
    const rootReducers: ReducersMapObject<StateSchema> = {
        ...lazyReducers,

        board: GameboardReducer,
    };

    const reducerManager = createReducerManager(rootReducers);

    const store = configureStore({
        // @ts-expect-error bullshit
        reducer: reducerManager.reduce as ReducersMapObject<StateSchema>,
        preloadedState: initialState,
        middleware: (getDefaultMiddleware) =>
            getDefaultMiddleware({
                thunk: {
                    extraArgument: {
                        api: $api,
                    },
                },
            }),
    });

    // @ts-expect-error bullshit
    store.reducerManager = reducerManager;

    return store;
}

export type AppDispatch = ReturnType<typeof CreateReduxStore>['dispatch'];
