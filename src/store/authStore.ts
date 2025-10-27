import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import axios from "axios";
import { fetchMeApi, type User } from "@/api/auth.js";

interface AuthState {
  token: string | null;
  isLoggedIn: boolean;
  user: User | null;

  login: (token: string) => void;
  logout: () => void;
  fetchUser: () => Promise<void>;
}

const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      token: null,
      isLoggedIn: false,
      user: null,

      login: (token) => {
        set({ token, isLoggedIn: !!token });
      },
      logout: () => {
        set({ token: null, isLoggedIn: false, user: null });
      },

      fetchUser: async () => {
        const token = get().token;
        if (!token) return;

        try {
          const userData: User = await fetchMeApi(token);
          set({ user: userData, isLoggedIn: true });
        } catch (error) {
          console.error("Gagal mengambil data pengguna:", error);

          if (axios.isAxiosError(error) && error.response?.status === 401) {
            console.warn("Token expired atau tidak valid. Melakukan logout.");
          } else {
            console.error("Error non-Axios saat fetch user:", error);
          }

          // Lakukan logout
          get().logout();
          // Penting: re-throw error agar komponen pemanggil dapat menanganinya (misalnya, menavigasi ke Login)
          throw error;
        }
      },
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export default useAuthStore;
