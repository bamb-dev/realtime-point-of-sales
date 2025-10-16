import { INITIAL_STATE_PROFILE } from "@/constants/auth-constant";
import { Profile } from "@/types/auth";
import { User } from "@supabase/supabase-js";
import { create } from "zustand";

type AuthStore = {
  user: User | null;
  profile: Profile | null;
  setUser: (user: User | null) => void;
  setProfile: (profile: Profile) => void;
};

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  profile: INITIAL_STATE_PROFILE,
  setUser: (user) => set({ user }),
  setProfile: (profile) => set({ profile }),
}));
