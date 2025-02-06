import { StateCreator } from "zustand";

export interface AuthState {
  isLoggedIn: boolean;
  authtoken: string;
  setIsLoggedIn: (isLoggedIn: boolean) => void;
  setAuthtoken: (authtoken: string) => void;
  apiUrl: string;
}
export const createAuthSlice: StateCreator<AuthState> = (set) => ({
  isLoggedIn: false,
  authtoken: "",
  apiUrl: "https://wolfpackapi.yupiter.tech/api",
  setAuthtoken: (authtoken) => set({ authtoken }),
  setIsLoggedIn: (isLoggedIn) => set({ isLoggedIn }),
});
