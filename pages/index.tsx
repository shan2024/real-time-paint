import type { NextPage } from 'next'
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import useProfileStore from "../state/profile";

const Home: NextPage = () => {
  const {isLoggedIn, username, setLoggedIn} = useProfileStore();
  const [userLogged, setUserLogged] = useState(false);
  
  useEffect(()=> {
    setUserLogged(isLoggedIn);
  }, [isLoggedIn, setLoggedIn]);

  return (
    <div className="flex h-full flex-col items-center justify-center px-8 py-12">
      <div className="flex flex-col min-h-full items-center justify-center w-full max-w-md space-y-8 mb-20">
        <img src="/images/logowithtext.png" alt="website logo" className=''></img>
        <p className='text-xl'>Paint in real-time with others.</p>
        {userLogged ? (
          <p>Go to your <a href={`/${username}/profile`} className = "font-medium text-[#49beb7] hover:text-[#239a8f]">profile</a>  to get started.</p>
        ): (
          <p><a href="/login" className = "font-medium text-[#49beb7] hover:text-[#239a8f]">Login</a>  to get started.</p>
        )}
      </div>
    </div>
  )
}
export default Home
