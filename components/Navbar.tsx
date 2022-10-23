import { NextPage } from "next";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import useProfileStore from "../state/profile";
const NavBar: NextPage = () => {
  const {isLoggedIn, setLoggedIn} = useProfileStore();
  const [userLogged, setUserLogged] = useState(false);
  const router = useRouter();
  function LogOut() {
    setLoggedIn(false);
    setUserLogged(false);
  }

  function Home() {
    router.push(`/`);
  }

  useEffect(()=> {
    setUserLogged(isLoggedIn);
  }, [isLoggedIn, setLoggedIn]);

  return (
    <nav className = "bg-[#d9f0ed]">
      <div className="max-w-auto mx-auto px-2 sm:px-6 lg:px-8">
        <div className="relative flex h-16 items-center justify-between">
          <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
            <div className="flex flex-shrink-0 items-center mr-auto">
              <img className = "block h-8 w-auto cursor-pointer hover:sepia " src= "/images/logo.png" onClick={Home} 
               alt = "Image of website logo"/>
            </div>
            <div className="hidden sm:ml-6 sm:block">
              <div className="flex space-x-4">
                {userLogged ? (
                  <a onClick={LogOut} href="/" className="text-[#49beb7] hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-lg font-bold">Sign Out</a>
                ): (
                  <div>
                    <a href="/signup" className="text-[#49beb7]  hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-lg font-bold mr-4" >Sign Up</a>
                    <a href="/login" className="text-[#49beb7] hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-lg font-bold">Login</a>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default NavBar;