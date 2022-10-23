import React from 'react'

export const CanvasMenu = ({setColor, setWidth, setOpacity, setClear} : any) => {
  return (
    <div className='flex flex-wrap gap-4'>
      <div className='flex flex-col gap-2 justify-center items-center'>
        <label className='text-center font-medium text-xl'>Color </label>
        <input className='w-[50px] h-[50px] xl:w-[75px] xl:h-[75px]' type="color" onChange={(e) => {setColor(e.target.value)}}/>
      </div>
      <div className='flex flex-col gap-2 justify-center items-center'>
        <label className='text-center font-medium text-xl'>Width</label>
        <input type="range" min="1" max="20" onChange={(e) => {setWidth(e.target.value)}} className='form-range appearance-none w-full h-6 p-0 bg- focus:outline-none focus:ring-0 focus:shadow-none'/>
      </div>
      {/* <div className='flex flex-col gap-2 justify-center items-center'>
        <label className='text-center font-medium text-xl'>Opacity</label>
        <input type="range" min="1" max="100" onChange={(e : any) => {setOpacity(e.target.value / 100)}} className='form-range appearance-none w-full h-6 p-0 bg- focus:outline-none focus:ring-0 focus:shadow-none'/>
      </div> */}
      <button type="button" onClick={setClear} className={`text-white bg-[#49beb7] hover:bg-[#239a8f] px-3 py-2 rounded-md text-[50px] font-medium `}>Clear</button>
    </div>
  )
}
