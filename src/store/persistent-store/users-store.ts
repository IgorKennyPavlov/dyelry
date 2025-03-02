import { produce } from "immer";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { StateStorage } from "zustand/middleware/persist";

import { fileSystemStorage } from "./file-system";
import { USERS } from "../keys";

type Users = Record<string, boolean>;

interface UsersStore {
  [USERS]: Users;
  addUser: (name: string) => void;
  selectUser: (name: string) => void;
  deleteUser: (name: string) => void;
  signOut: () => void;
}

export const useUsersStore = create<UsersStore>()(
  persist(
    (set) => ({
      [USERS]: {} as Users,
      addUser: (name) =>
        set(
          produce((state: UsersStore) => {
            state[USERS][name] = false;
          }),
        ),
      selectUser: (name) =>
        set(
          produce((state: UsersStore) => {
            Object.keys(state[USERS]).forEach(
              (key) => (state[USERS][key] = false),
            );
            state[USERS][name] = true;
          }),
        ),
      deleteUser: (name) =>
        set(
          produce((state: UsersStore) => {
            delete state[USERS][name];
          }),
        ),
      signOut: () =>
        set(
          produce((state: UsersStore) => {
            Object.keys(state[USERS]).forEach(
              (key) => (state[USERS][key] = false),
            );
          }),
        ),
    }),
    {
      name: USERS,
      storage: createJSONStorage(() => fileSystemStorage as StateStorage),
    },
  ),
);
