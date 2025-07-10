import React from 'react'
import "./com.css"

const navbar = () => {
  return (
    <nav className=' bg-violet-700 flex justify-between py-2 w-vw items-center'>
        <div className=' mx-4'>
            <span className='font-bold text-white text-3xl'>Todo</span>
        </div>
        <ul className='flex gap-10  mx-4 text-white '>
            <li className='hover:text-lg cursor-pointer'>Home</li>
            <li className='hover:text-lg cursor-pointer'>About us</li>
        </ul>
    </nav>
  )
}

export default navbar
