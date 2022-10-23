import create from "zustand";
import {persist, devtools} from 'zustand/middleware'

// Provides a react hook for central state on whether the user is logged in or not

interface ProfileState {
  isLoggedIn: boolean,
  setLoggedIn: (loggedIn: boolean)=>void
}

const useProfileStore = create<ProfileState>()(
  devtools(
    persist(
      (set) => ({
        isLoggedIn: false,
        setLoggedIn: (loggedIn: boolean) => set({ isLoggedIn: loggedIn }),
      }),
      {
        name: 'profile-store',
      }
    )
  )
)

export default useProfileStore;