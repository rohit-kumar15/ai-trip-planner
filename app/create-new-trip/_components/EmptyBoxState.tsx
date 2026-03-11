import { suggestions } from '@/app/_components/Hero'
import React from 'react'


function EmptyBoxState({onSelectOption}: any) {
  return (
    <div className='mt-12'>
        <h2 className='font-bold text-4xl md:text-5xl text-center leading-tight'>Start Planning your new <span className='glowing-text bg-gradient-to-r from-orange-500 via-pink-500 to-purple-600 bg-clip-text text-transparent'>Trip</span> using AI</h2>
        <p className='text-center mt-6 text-gray-600 max-w-2xl mx-auto leading-relaxed font-light text-base md:text-lg'>Discover personalized travel itineraries, find the best places to visit, and plan your perfect trip effortlessly with our AI-powered assistant. Let our smart assistant do the hard work while you enjoy your journey.</p>
    
        <div className='flex flex-col gap-4 mt-10'>
                    {suggestions.map((suggestions, index) => (
                        <div key={index} 
                        onClick={() => onSelectOption(suggestions.title)}
                        className='flex items-center gap-4 glassmorphism border border-white/50 rounded-xl p-5 cursor-pointer hover:border-orange-300/50 transition-all duration-300 group hover-lift micro-scale'>
                            <span className='text-2xl group-hover:scale-125 transition-transform duration-300'>{suggestions.icon}</span>
                            <h2 className='text-base font-medium text-gray-700 group-hover:text-orange-600 transition-colors duration-300'>{suggestions.title}</h2>
                        </div>
                        ))}
                </div>
    
    </div>
  )
}

export default EmptyBoxState