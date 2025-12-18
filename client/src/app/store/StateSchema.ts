import type { EnhancedStore, Reducer, ReducersMapObject, UnknownAction } from '@reduxjs/toolkit';

import type { AxiosInstance } from 'axios';

import type { ChatSchema } from '@/features/Chat';

import type { GameBoardSchema } from '@/entities/GameBoard';
import type { LeaderboardSchema } from '@/entities/Leaderboard';
import type { RoomSchema } from '@/entities/Room';
import type { StatisticsSchema } from '@/entities/Statistics';
import type { UserSchema } from '@/entities/User';

export interface StateSchema {
    user: UserSchema;
    statistics: StatisticsSchema;
    board: GameBoardSchema;
    leaderboard: LeaderboardSchema;
    rooms: RoomSchema;
    chat: ChatSchema;

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
