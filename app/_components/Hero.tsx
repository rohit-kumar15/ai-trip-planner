"use client"
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { ArrowDown, Globe2, Landmark, Plane, Send } from 'lucide-react'
import { HeroVideoDialog } from "@/components/ui/hero-video-dialog"
import { title } from 'process'
import React from 'react'
import { useUser } from '@clerk/nextjs'
import { useRouter } from 'next/dist/client/components/navigation'

export const suggestions = [
    {
        title: 'Create New Trip',
        icon: <Globe2 className='text-blue-400 h-5 w-5' />
    },
    {
        title: 'Inspire me where to go',
        icon: <Plane className='text-green-500 h-5 w-5' />
    },
    {
        title: 'Discover Hidden Gems',
        icon: <Landmark className='text-orange-500 h-5 w-5' />
    },
    {
        title: 'Adventure Destinations',
        icon: <Globe2 className='text-yellow-600 h-5 w-5' />
    }
]
function Hero() {

    const { user } = useUser();
    const router = useRouter();
    const onSend = () => {
        if (!user) {
            router.push('/sign-in');
            return;
        }
        router.push('/create-new-trip');
    }
    return (
        <div className='relative min-h-screen flex items-center justify-center px-4 overflow-hidden'>
            {/* Animated Background Blobs */}
            <div className='absolute inset-0 pointer-events-none overflow-hidden'>
                <div className='absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-orange-200 to-transparent rounded-full blur-3xl float-blob-1 opacity-40'></div>
                <div className='absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-purple-200 to-transparent rounded-full blur-3xl float-blob-2 opacity-30'></div>
                <div className='absolute top-1/2 right-1/4 w-72 h-72 bg-gradient-to-br from-blue-100 to-transparent rounded-full blur-3xl opacity-20' style={{ animation: 'float-blob-1 12s ease-in-out infinite reverse' }}></div>
            </div>

            {/* content */}
            <div className='max-w-5xl w-full text-center space-y-10 relative z-10'>
                <div className='space-y-6'>
                    <h1 className='text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-bold leading-tight tracking-tight'>
                        Hey, I'm your personal <span className="glowing-text bg-gradient-to-r from-orange-500 via-pink-500 to-purple-600 bg-clip-text text-transparent animate-pulse">Trip Planner</span>
                    </h1>
                    <p className='text-base md:text-lg lg:text-xl text-gray-600 leading-relaxed max-w-3xl mx-auto font-light'>
                        Tell me what you want, and I'll handle the rest: Flights, Hotels, Trip Planning - all in seconds
                    </p>
                </div>

                {/* Input box - Glassmorphism */}
                <div className='pt-8 flex justify-center'>
                    <div className='w-full max-w-2xl glassmorphism glow-input rounded-3xl p-6 relative group hover-lift'>
                        <Textarea placeholder='Create a trip for Paris from India'
                            className='w-full h-32 pr-16 bg-transparent border-none focus-visible:ring-0 shadow-none resize-none text-base placeholder:text-gray-500 placeholder:font-light' />
                        <div className='absolute bottom-6 right-6'>
                            <Button size={'icon'} className='cursor-pointer transition-all duration-300 hover:scale-110 gradient-button-hover shadow-lg hover:shadow-2xl' onClick={() => onSend()}>
                                <Send className='h-5 w-5' />
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Suggestion list - Premium Pills */}
                <div className='flex flex-wrap gap-3 justify-center pt-6'>
                    {suggestions.map((suggestions, index) => (
                        <div key={index} className='flex items-center gap-3 px-5 py-3 rounded-full cursor-pointer glassmorphism hover-lift micro-scale transition-all duration-300 group border border-white/50 hover:border-orange-300/50'>
                            <span className='text-lg group-hover:scale-110 transition-transform duration-300'>{suggestions.icon}</span>
                            <h2 className='text-sm font-medium text-gray-700 group-hover:text-orange-600 transition-colors duration-300'>{suggestions.title}</h2>
                        </div>
                    ))}
                </div>

                <div className='flex items-center justify-center flex-col pt-8'>
                    <h2 className='flex gap-2 text-center text-gray-600 text-sm md:text-base font-light'>Not Sure where to start? <strong className='text-gray-800'>See how it works</strong> <ArrowDown className='h-4 w-4 animate-bounce' /> </h2>
                    {/* Video Section */}
                    <div className='mt-12'>
                        <HeroVideoDialog
                            className="block dark:hidden"
                            animationStyle="from-center"
                            videoSrc="https://www.example.com/dummy-video"
                            thumbnailSrc="https://mma.prnewswire.com/media/2401528/1MindtripProduct.jpg?p=facebook"
                            thumbnailAlt="Dummy Video Thumbnail"
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Hero