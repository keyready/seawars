import type { EnhancedStore, Reducer, ReducersMapObject, UnknownAction } from '@reduxjs/toolkit';

import type { AxiosInstance } from 'axios';

import type { GameBoardSchema } from '@/entities/GameBoard';

import type { GameSocketSchema } from '@/shared/hooks/useGameSocket';

export interface StateSchema {
    board: GameBoardSchema;
    gameSocket: GameSocketSchema;

    // asynchronous reducers
}

export type StateSchemaKey = keyof StateSchema;
export type MountedReducers = OptionalRecord<StateSchemaKey, boolean>;
export interface reducerManager {
    getReducerMap: () => ReducersMapObject<StateSchema>;
    reduce: (state: StateSchema, action: UnknownAction) => StateSchema;
    add: (key: StateSchemaKey, reducer: Reducer) => void;
    remove: (key: StateSchemaKey) => void;
    getMountedReducers: () => MountedReducers;
}

export interface ReduxStoreWithManager extends EnhancedStore<StateSchema> {
    reducerManager: reducerManager;
}

export interface ThunkExtraArg {
    api: AxiosInstance;
}

export interface ThunkConfig<T> {
    rejectValue: T;
    extra: ThunkExtraArg;
    state: StateSchema;
}
