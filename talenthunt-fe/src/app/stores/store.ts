import { create } from "zustand";
import { persist } from "zustand/middleware";
import { createAuthSlice, AuthState } from "./authSlice";

type CombinedState = AuthState;

const useStore = create<CombinedState>()(
  persist(
    (...a) => ({
      ...createAuthSlice(...a),
    }),
    {
      name: "auth-storage",
    }
  )
);

export default useStore;
