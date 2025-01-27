import { StateCreator } from "zustand";

export interface AuthState {
  isLoggedIn: boolean;
  authtoken: string;
  setIsLoggedIn: (isLoggedIn: boolean) => void;
  setAuthtoken: (authtoken: string) => void;
  apiUrl: string;
  selectedRole: string;
  setSelectedRole: (selectedRole: string) => void;
}
export const createAuthSlice: StateCreator<AuthState> = (set) => ({
  isLoggedIn: false,
  authtoken: "",
  apiUrl: "https://wolfpack.yupiter.tech/api",
  selectedRole: "",
  setSelectedRole: (selectedRole) => set({ selectedRole }),
  setAuthtoken: (authtoken) => set({ authtoken }),
  setIsLoggedIn: (isLoggedIn) => set({ isLoggedIn }),
});
