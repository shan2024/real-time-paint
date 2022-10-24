import React, { useState } from 'react'

export const CanvasMenu = ({setColor, setWidth, setOpacity, setClear, width} : any) => {

  return (
    <div className='flex gap-4 p-5'>
      <div className='flex flex-col gap-2 justify-start items-center'>
        <label className='text-center font-medium text-xl'>Color </label>
        <input className='w-[75px] h-[75px]' type="color" onChange={(e) => {setColor(e.target.value)}}/>
      </div>
      <div className='flex flex-col gap-2 justify-start items-center'>
        <label className='text-center font-medium text-xl'>Width</label>
        <div className='slider'>
          <input type="range" min="1" max="100" onChange={(e) => {setWidth(e.target.value);}} className= 'form-range appearance-none w-full h-6 p-0 bg- focus:outline-none focus:ring-0 focus:shadow-none'/>
          <p>{width}</p>
        </div>
      </div>
      <div className='flex flex-col gap-2 justify-start items-center '>
        <label className='text-center font-medium text-xl'>Clear</label>
        <button type="button" onClick={setClear} className={`min-h-[50px] text-white bg-white hover:bg-gray-100 px-3 py-2 rounded-md text-[20px] font-medium`}>&#10060;</button>
      </div>
    </div>
  )
}
