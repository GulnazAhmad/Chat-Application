import { create } from "zustand"; //Zustand is used to create the store.
import { createAuthSlice } from "./slices/auth-slice";
import { createChatSlice } from "./slices/chat-slice";

export const useAppStore = create()((...a) => ({
  //(...a) => ({ ...createAuthSlice(...a) }): This spreads the result of createAuthSlice, injecting Zustand's set, get, and api if needed.
  ...createAuthSlice(...a),
  ...createChatSlice(...a),
}));
//The result is a complete Zustand store that includes userInfo and setUserInfo.
