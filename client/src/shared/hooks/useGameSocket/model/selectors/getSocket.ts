import type { StateSchema } from '@/store/StateSchema';

export const getGameSocket = (state: StateSchema) => state.gameSocket.socket;
