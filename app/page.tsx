import { Button } from "@/components/ui/button";
import Image from "next/image";
import Hero from "./_components/Hero";
import { PopularCityList } from "./_components/PopularCityList";

export default function Home() {
  return (
    <div className="min-h-screen animated-gradient-bg relative">
      {/* Additional subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/20 to-white/40 pointer-events-none"></div>
      
      <div className='relative z-10'>
        <Hero />
        <PopularCityList/>
      </div>
    </div>
  );
}
