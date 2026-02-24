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
    <header className="w-full border-b bg-white px-6 py-4">
      <div className="flex items-center justify-between">

        {/* Logo Section */}
        <div className="flex items-center gap-2">
          <Image src="/logo.svg" alt="Logo" width={40} height={40} />
          <h2 className="text-2xl font-bold">AI Trip Planner</h2>
        </div>

        {/* Menu Section */}
        <nav className="hidden md:flex items-center gap-8">
          {menuOptions.map((menu, index) => (
            <Link key={index} href={menu.path}>
              <span className="text-lg hover:text-primary hover:scale-105 transition-all cursor-pointer">
                {menu.name}
              </span>
            </Link>
          ))}
        </nav>

        {/* Right Section */}
        <div className="flex items-center gap-4">

          {!user ? (
            <SignInButton mode="modal">
              <Button className="cursor-pointer">
                Get Started
              </Button>
            </SignInButton>
          ) : (
            <>
              {/* Create New Trip Button */}
              <Link href="/create-new-trip">
                <Button className="cursor-pointer">
                  Create New Trip
                </Button>
              </Link>

              {/* Profile Pill */}
              <div className="flex items-center gap-3 bg-gray-100 px-4 py-2 rounded-full shadow-sm">

                {/* Username (hidden on small screens) */}
                <span className="text-sm font-medium hidden sm:block">
                  {user.firstName}
                </span>

                {/* Clerk User Avatar */}
                <UserButton
                  appearance={{
                    elements: {
                      avatarBox: "w-9 h-9",
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