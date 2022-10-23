import '../styles/globals.css'
import type { AppProps } from 'next/app'

import NavBar from '../components/Navbar';


function MyApp({ Component, pageProps }: AppProps) {
  return (
    <div className="h-screen min-w-full bg-[#eff8f2] font-mono">
      <NavBar/>
      <Component {...pageProps} />
    </div>
  );
}

export default MyApp
