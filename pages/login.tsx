import { exec } from "child_process";
import { NextPage } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import {useState } from "react";
import SignUpMessage from "../components/SignUpMessage";
import useProfileStore from "../state/profile";

const inputCssClass: string = `relative block w-full appearance-none rounded-none rounded-t-md rounded-b-md
 border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 
 focus:outline-none focus:ring-indigo-500 sm:text-sm`;

 const buttonCssClass: string = `group relative flex w-full justify-center rounded-md border border-transparent 
 bg-[#49beb7] py-2 px-4 text-sm font-medium text-white hover:bg-[#239a8f] focus:outline-none focus:ring-2 
 focus:ring-indigo-500 focus:ring-offset-2`;

const iconCss: string = `w-6 h-6`;

const Login: NextPage = () => {
  const router = useRouter();
  const {isLoggedIn, setLoggedIn} = useProfileStore();

  // Handle submit will take the input username/password from the user, and
  // make sure that they exist in the database. If they exist, the user will 
  // be redirected to their login page
  const handleSubmit = async (event: any): Promise<any> => {
    // Prevent page from refreshing
    event.preventDefault();

    // If any paramters do not exist, then there was an error
    if (!event.target.username.value || !event.target.password.value) {
      console.log("Error: User login paramters were not recieved");
    }

    const data = {
      username: event.target.username.value,
      password: event.target.password.value
    }

    const JSONData = JSON.stringify(data);
    const endpoint = "/api/login";

    const putReq = { 
      method: "Put",
      headers: {
        'Accept': 'application/json',
        'Content-Type': "application/json"
      },
      body: JSONData
    }

    const response = await fetch(endpoint, putReq);
    const result = await response.json();

    // If user exists, then can safely redirect to the user's profile page
    if (result.userExists) {
      setLoggedIn(true);
      router.push(`/${data.username}/profile`);
    }
  }

  return (
    <div className="flex min-h-full items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div>
          <img className="mx-auto h-12 w-auto" src= "/images/logo.png" alt= "Website logo"></img>
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
            Login to your account
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="-space-y-px rounded-md shadow-sm">
            <div className="space-y-4">
              <label htmlFor="username" className="sr-only">Username</label>
              <input id="username" name="username" type="text" required 
              className={inputCssClass} placeholder="Username"/>
            </div>
            <div className="space-y-4">
              <label htmlFor="password" className="sr-only">Password</label>
              <input id="password" name="password" type="password" autoComplete="current-password" required 
              className={inputCssClass} placeholder="Password"/>
            </div>
          </div>
          <div>
            <button type="submit" className={buttonCssClass}>
              <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className={iconCss} aria-hidden={true}>
                  <path fillRule="evenodd" clipRule="evenodd" d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z" />
                </svg>
              </span>
              Log In
            </button>
          </div>
          <div>
            <a href="/">
            <button type="button" className={buttonCssClass}>
              <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={iconCss}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" />
                </svg>
              </span>
              Back
            </button>
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}


export default Login;