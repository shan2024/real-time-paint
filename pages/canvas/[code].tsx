import React, {useState, useEffect, useRef} from 'react'
import { fetchAllCodes } from '../../db/code';
import Canvas from '../../components/Canvas';


// This component defines a guest canvas for guest users
const CanvasRoom = ({code}:{code:string}) => {
  return (
    <div>
      <Canvas roomCode={code}/>
      <p>Your room code is: {code}</p>
      <p>Share this with others to let them join your room.</p>
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
