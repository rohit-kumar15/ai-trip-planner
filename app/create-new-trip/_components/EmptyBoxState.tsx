import { suggestions } from '@/app/_components/Hero'
import React from 'react'


function EmptyBoxState({onSelectOption}: any) {
  return (
    <div className='mt-7'>
        <h2 className='font-bold text-3xl text-center'>Start Planning your new <strong className='text-primary'>Trip</strong> using AI</h2>
        <p className='text-center mt-2 text-gray-600'>Discover personalized travel itineraries, find the best places to visit, and plan your perfect trip effortlessly with our AI-powered assistant. Let our smart assistant do the hard work while you enjoy your journey.!</p>
    
        <div className='flex flex-col gap-5 mt-7'>
                    {suggestions.map((suggestions, index) => (
                        <div key={index} 
                        onClick={() => onSelectOption(suggestions.title)}
                        
                        className='flex items-center gap-2 border rounded-xl p-3 cursor-pointer hover:border-primary hover:text-primary transition'>
                            {suggestions.icon}
                            <h2 className='text-lg'>{suggestions.title}</h2>
                        </div>
                        ))}
                </div>
    
    </div>
  )
}

export default EmptyBoxState