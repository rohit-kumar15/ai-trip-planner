import Link  from 'next/link'
import Image from 'next/image'

import React from 'react'
import { Button } from '@/components/ui/button'
import { SignInButton } from '@clerk/nextjs'

const menuOptions = [
    {
        name: 'Home',
        path: '/'
    },
    {
        name: 'Pricing',
        path: '/pricing'
    },
    {
        name: 'Contact Us',
        path: '/contact-us'
    }
]

function Header() {
  return (
    <div className='flex justify-between items-center p-4'>
        {/* logo */}
        <div className='flex gap-2 items-center'>
            <Image src="/logo.svg" alt="Logo" width={40} height={40} />
            <h2 className='font-bold text-2xl'>AI Trip Planner</h2>
        </div>
        {/* Menu option */}
        <div className='flex gap-8 items-center'>
            {menuOptions.map((menu, index) => (
                <Link href={menu.path} >
                    <h2 className='text-lg hover:scale-105 transition-all hover:text-primary'>{menu.name}</h2>
                </Link>

            ))}
        </div>
        {/* get Started Button */}

        <SignInButton mode='modal'>
        <Button className='cursor-pointer'>Get Started</Button>
        </SignInButton>

    </div>
  )
}

export default Header