import { PricingTable } from '@clerk/nextjs'
import React from 'react'

function Pricing() {
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated gradient background matching the project */}
      <div className="absolute inset-0 animated-gradient-bg"></div>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/20 to-white/40 pointer-events-none"></div>

      {/* Floating blurred blobs */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-orange-300/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-pink-300/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-purple-300/10 rounded-full blur-3xl animate-pulse delay-500"></div>

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 py-16 md:py-24">
        {/* Header Section */}
        <div className="text-center mb-12">
          <span className="inline-flex items-center gap-2 bg-orange-50 border border-orange-200/50 rounded-full px-4 py-1.5 text-sm font-medium text-orange-600 mb-6">
            ✨ Choose Your Plan
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-4">
            <span className="text-gray-900">Simple, </span>
            <span className="bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent">Transparent </span>
            <span className="text-gray-900">Pricing</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Start planning your dream trips for free. Upgrade anytime to unlock unlimited AI-powered itineraries and premium features.
          </p>
        </div>

        {/* Pricing Table Container */}
        <div className="backdrop-blur-xl bg-white/60 rounded-3xl border border-white/50 shadow-2xl p-6 md:p-10 hover:shadow-3xl transition-all duration-500">
          <PricingTable />
        </div>

        {/* Bottom trust badges */}
        <div className="flex flex-wrap items-center justify-center gap-6 mt-10 text-sm text-gray-500">
          <span className="inline-flex items-center gap-2 bg-white/60 backdrop-blur-sm border border-white/50 rounded-full px-4 py-2">
            🔒 Secure Payments
          </span>
          <span className="inline-flex items-center gap-2 bg-white/60 backdrop-blur-sm border border-white/50 rounded-full px-4 py-2">
            ⚡ Instant Access
          </span>
          <span className="inline-flex items-center gap-2 bg-white/60 backdrop-blur-sm border border-white/50 rounded-full px-4 py-2">
            🔄 Cancel Anytime
          </span>
        </div>
      </div>
    </div>
  )
}

export default Pricing