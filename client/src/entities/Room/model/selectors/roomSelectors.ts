import type { StateSchema } from '@/app/store';

export const getRooms = (state: StateSchema) => state.rooms.rooms || [];
export const getRoomsIsLoading = (state: StateSchema) => state.rooms.isLoading;
