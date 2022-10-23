import type { NextPage } from 'next'
import Link from "next/link";
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import Canvas from '../components/Canvas';

const Home: NextPage = () => {

  return (
    <div className="flex h-full flex-col items-center justify-center px-8 py-12">
      <div className="flex flex-col min-h-full items-center justify-center w-full max-w-md space-y-8 mb-20">
        <img src="/images/logowithtext.png" alt="website logo" className=''></img>
        <p>Paint in real-time</p>
      </div>
    </div>
  )
}
export default Home
