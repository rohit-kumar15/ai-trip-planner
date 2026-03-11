import { Button } from '@/components/ui/button'
import { Globe2, Loader } from 'lucide-react'
import React from 'react'

function FinalUi({ viewTrip, loading, tripReady }: {
  viewTrip: () => void;
  loading?: boolean;
  tripReady?: boolean;
}) {
  return (
    <div className="flex flex-col items-center justify-center mt-6 p-6 bg-white rounded">
      <Globe2 className="text-primary text-4xl animate-bounce" />
      <h2 className="mt-3 text-lg font-semibold text-primary">
        ✈️ Planning your dream trip...
      </h2>
      <p className="text-gray-500 text-sm text-center mt-1">
        {loading
          ? "Generating your personalized travel plan..."
          : tripReady
            ? "Your trip plan is ready!"
            : "Gathering best destinations, activities, and travel details for you."}
      </p>

      <Button
        disabled={loading}
        onClick={viewTrip}
        className='mt-2 w-full'
      >
        {loading ? (
          <span className="flex items-center gap-2">
            <Loader className="h-4 w-4 animate-spin" />
            Generating...
          </span>
        ) : tripReady ? (
          "View Trip ✨"
        ) : (
          "View Trip"
        )}
      </Button>
    </div>
  )
}

export default FinalUi
