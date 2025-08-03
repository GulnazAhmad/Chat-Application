/*This defines the auth slice of your store:

userInfo: holds data of the logged-in user (initially undefined).

setUserInfo: a setter function to update userInfo.

The set function comes from Zustand and is used to update the store state.

*/
export const createAuthSlice = (set) => ({
  userInfo: undefined,
  setUserInfo: (userInfo) => set({ userInfo }),
});
