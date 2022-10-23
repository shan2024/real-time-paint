import React, {useState} from 'react'
import axios from 'axios';
import { fetchAllUsers } from '../../db/users';
import {fetchCode} from '../../db/code';
import Link from 'next/link';
import { JoinPopup } from '../../components/JoinPopup';
import { useRouter } from 'next/router';
import cryptoRandomString from 'crypto-random-string';


const UserProfile = ({username, code} : {username:string, code:string}) => {
  const [joinPopup, setJoinPopup] = useState(false); // Controls the popup for joining a room
  const [isValid, setIsValid] = useState(true) // Controls whether the state is valid

  const router = useRouter();

  // This function handles the room code given by the user
  async function handleForm(event: any) {
    event.preventDefault();
    
    const roomCode = event.target.code.value;
    if (!event.target.code.value){
      console.log("Error: join room code not available");
    }

    // Check that room with given code is currently activated
    
    // We want to push router to link to canvas page of room code
    router.push(`/canvas/${roomCode}`);
  }

  function CreateRoom() {
    // Generate a random code and hand it to the canvas component; every time a user creates a new room
    // they will recieve a new code.
    var randCode:string = cryptoRandomString({length: 15, type: 'url-safe'});
    router.push(`/canvas/${randCode}`);
  }

  return (
    <div className='flex flex-col w-full h-full justify-center items-center'>
      <div className='flex flex-col gap-4 border-solid border-gray-400 bg-[#d9f0ed] w-[500px] justify-center items-center'>
        <h1 className='text-[50px]'>Welcome <i><b>{username}</b></i></h1>
        <p className='text-center'>Create a new room to make a fresh canvas. Use your join code to add others to your canvas room.</p>
      </div>
      <div className='flex flex-col flex-wrap gap-9 text-center mt-10'>
        <button onClick={CreateRoom} className={`text-white bg-[#49beb7] hover:bg-[#239a8f] px-3 py-2 rounded-md text-[50px] font-medium `}>Create room</button>
        <button onClick={()=>setJoinPopup(true)} className="text-white bg-[#49beb7] hover:bg-[#239a8f] px-3 py-2 rounded-md text-[50px] font-medium">Join room</button>
      </div>
      {joinPopup && 
      <JoinPopup  setPopup={()=>setJoinPopup(false)} joinRoom={handleForm}/>
      }
  
    </div>
  )
}

export default UserProfile;

export async function getStaticPaths() {
  const users = await fetchAllUsers();
  return {
    paths: users,
    fallback: true,
  } 
}

export async function getStaticProps({params} : {params:{username:string}}) {
  // Fetch the code for the user
  var code = await fetchCode(params.username);

  return {
    props: {
      username: params.username,
      code
    }
  }
}