"use client";

import Link from "next/link";
import Image from "next/image";
import React from "react";
import { Button } from "@/components/ui/button";
import {
  SignInButton,
  useUser,
  UserButton,
} from "@clerk/nextjs";

const menuOptions = [
  { name: "Home", path: "/" },
  { name: "Pricing", path: "/pricing" },
  { name: "Contact Us", path: "/contact-us" },
];

function Header() {
  const { user } = useUser();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/20 backdrop-blur-xl bg-white/70 px-6 py-4 transition-all duration-300 premium-shadow group">
      <div className="flex items-center justify-between">

        {/* Logo Section */}
        <div className="flex items-center gap-3 group/logo cursor-pointer transition-all duration-300 hover:scale-105">
          <Image src="/logo.svg" alt="Logo" width={40} height={40} className='transition-transform duration-300 group-hover/logo:rotate-12' />
          <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">AI Trip Planner</h2>
        </div>

        {/* Menu Section */}
        <nav className="hidden md:flex items-center gap-8">
          {menuOptions.map((menu, index) => (
            <Link key={index} href={menu.path}>
              <span className="text-base relative font-medium text-gray-700 hover:text-orange-600 transition-colors duration-300 group/nav cursor-pointer">
                {menu.name}
                <span className='absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-orange-500 to-purple-600 transition-all duration-300 group-hover/nav:w-full'></span>
              </span>
            </Link>
          ))}
        </nav>

        {/* Right Section */}
        <div className="flex items-center gap-4">

          {!user ? (
            <SignInButton mode="modal">
              <Button className="cursor-pointer gradient-button-hover shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                Get Started
              </Button>
            </SignInButton>
          ) : (
            <>
              {/* Create New Trip Button */}
              <Link href="/create-new-trip">
                <Button className="cursor-pointer gradient-button-hover shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                  Create New Trip
                </Button>
              </Link>

              {/* Profile Pill */}
              <div className="flex items-center gap-3 glassmorphism px-4 py-2 rounded-full shadow-md hover:shadow-xl transition-all duration-300 hover:scale-105 hover:-translate-y-1 cursor-pointer group/profile">

                {/* Username (hidden on small screens) */}
                <span className="text-sm font-medium hidden sm:block text-gray-700">
                  {user.firstName}
                </span>

                {/* Clerk User Avatar */}
                <UserButton
                  appearance={{
                    elements: {
                      avatarBox: "w-9 h-9 transition-transform duration-300 group-hover/profile:scale-110",
                    },
                  }}
                />
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;