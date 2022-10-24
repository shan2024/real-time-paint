import React, {useState, useEffect, useRef} from 'react'
import { fetchAllCodes } from '../../db/code';
import Canvas from '../../components/Canvas';
import useProfileStore from '../../state/profile';


// This component defines a guest canvas for guest users
const CanvasRoom = ({code}:{code:string}) => {
  const {isLoggedIn, setLoggedIn} = useProfileStore();
  const [userLogged, setUserLogged] = useState(false);

  useEffect(()=> {
    setUserLogged(isLoggedIn);
  }, [isLoggedIn, setLoggedIn]);

  if (!userLogged) {
    return (
      <div className='flex h-[80%] m-auto justify-center items-center'>
        <p className='text-xl'>404 Error: Page not found.</p>
      </div>
    );
  }

  return (
    <div className='flex items-center gap-4'>
      <Canvas roomCode={code} />
      <div className='min-w-[300px] flex flex-col justify-center items-center text-center text-lg ml-auto mr-auto'>
        <p>Your room code is: <b>{code}</b></p>
        <p>Share this with others to let them join your room.</p>
      </div>
    </div>
  )
}

export default CanvasRoom;

export async function getStaticPaths() {
  const codes = await fetchAllCodes();
  return {
    paths: codes,
    fallback: true,
  } 
}

export async function getStaticProps({params} : {params:{code:string}}) {
  // Fetch the code for the user
  return {
    props: {
      code: params.code
    }
  }
}
