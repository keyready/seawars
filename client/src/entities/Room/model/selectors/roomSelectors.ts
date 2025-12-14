import type { StateSchema } from '@/store/StateSchema';

export const getRooms = (state: StateSchema) => state.rooms.rooms || [];
export const getRoomsIsLoading = (state: StateSchema) => state.rooms.isLoading;
