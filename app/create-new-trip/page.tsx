import React from 'react'
import ChatBox from './_components/ChatBox'

function CreateNewTrip() {
  return (
    <div className='h-screen animated-gradient-bg relative overflow-hidden'>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/20 to-white/40 pointer-events-none"></div>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-6 p-6 md:p-10 relative z-10 h-full'>
        <div className='rounded-2xl overflow-hidden flex flex-col min-h-0'>
          <ChatBox />
        </div>
        <div className='glassmorphism border border-white/50 rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 hidden md:flex items-center justify-center'>
          <div className='text-center'>
            <div className='text-4xl mb-4'>🗺️</div>
            <p className='text-gray-700 font-light'>Map and trip plan to display</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CreateNewTrip