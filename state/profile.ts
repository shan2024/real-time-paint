import create from "zustand";
import {persist, devtools} from 'zustand/middleware'

// Provides a react hook for central state on whether the user is logged in or not

interface ProfileState {
  isLoggedIn: boolean,
  username: string,
  setLoggedIn: (loggedIn: boolean)=>void
  setUsername: (name: string)=>void
}

const useProfileStore = create<ProfileState>()(
  devtools(
    persist(
      (set) => ({
        isLoggedIn: false,
        username: '',
        setLoggedIn: (loggedIn: boolean) => set({ isLoggedIn: loggedIn }),
        setUsername: (name: string) => set({username: name}),
      }),
      {
        name: 'profile-store',
      }
    )
  )
)

export default useProfileStore;