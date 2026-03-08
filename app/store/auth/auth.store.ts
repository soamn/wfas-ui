import { create } from "zustand";
import { AuthActions, AuthStoreState } from "./auth.types";
import { getSession } from "./auth.api";

export const useAuthStore = create<AuthStoreState & AuthActions>((set) => ({
  user: null,

  storeAuthData: (user) =>
    set({
      user,
    }),

  deleteAuthData: () =>
    set({
      user: null,
    }),
  fetchUser: async () => {
    try {
      const res = await getSession();
      if (res.data?.user) {
        set({ user: res.data.user });
        return res.data.user;
      }
    } catch (error) {
      set({ user: null });
    }
  },
  updateUserCredentials: (credentials) =>
    set((state) => ({
      user: state.user ? { ...state.user, credentials } : null,
    })),
}));
