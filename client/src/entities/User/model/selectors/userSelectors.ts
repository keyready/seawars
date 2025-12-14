import type { StateSchema } from '@/store/StateSchema';

export const getUserData = (state: StateSchema) => state.user.user;
export const getIsUserLoading = (state: StateSchema) => state.user.isLoading;
