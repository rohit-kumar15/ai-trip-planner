"use client";

import React, { useEffect, useState } from "react";
import { MapPin, Clock, Ticket, Navigation, Calendar } from "lucide-react";
import { Timeline } from "@/components/ui/timeline";

type Activity = {
  place_name: string;
  place_details: string;
  place_image_url: string;
  geo_coordinates: {
    latitude: number;
    longitude: number;
  };
  place_address: string;
  ticket_pricing: string;
  time_travel_each_location: string;
  best_time_to_visit: string;
};

type DayPlan = {
  day: number;
  day_plan: string;
  best_time_to_visit_day: string;
  activities: Activity[];
};

type TripInfo = {
  budget: string;
  destination: string;
  duration: string;
  group_size: string;
  origin: string;
  hotels: any;
  itinerary: DayPlan[];
};

const UNSPLASH_KEY = "Cndv0b7KmBLZkfQKYnup7mClgyW_loeHQ4tkto4WF5k";

// ✅ Global image cache to prevent duplicate API calls
const imageCache: Record<string, string> = {};

// ✅ Fetch real place image from Unsplash API
async function fetchPlaceImage(placeName: string): Promise<string | null> {
  if (imageCache[placeName]) return imageCache[placeName];

  try {
    const response = await fetch(
      `https://api.unsplash.com/search/photos?query=${encodeURIComponent(placeName)}&per_page=1&client_id=${UNSPLASH_KEY}`
    );
    const data = await response.json();

    if (data.results && data.results.length > 0) {
      const url = data.results[0].urls.regular;
      imageCache[placeName] = url;
      return url;
    }
    return null;
  } catch (error) {
    console.error("Unsplash image fetch error:", error);
    return null;
  }
}

function getGoogleMapsUrl(placeName: string): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(placeName)}`;
}

// ✅ Place Card Component with Unsplash API images
function PlaceCard({ activity }: { activity: Activity }) {
  const [image, setImage] = useState<string>(
    `https://source.unsplash.com/600x400/?${encodeURIComponent(activity.place_name)}`
  );

  useEffect(() => {
    const loadImage = async () => {
      // Priority 1: place_image_url from API
      if (
        activity.place_image_url &&
        activity.place_image_url !== "string" &&
        !activity.place_image_url.includes("example")
      ) {
        setImage(activity.place_image_url);
        return;
      }

      // Priority 2: Unsplash API search
      const unsplashImage = await fetchPlaceImage(activity.place_name);
      if (unsplashImage) {
        setImage(unsplashImage);
        return;
      }

      // Priority 3: Unsplash source fallback (already set as default)
    };

    loadImage();
  }, [activity.place_name, activity.place_image_url]);

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] overflow-hidden border border-orange-100/50 hover:border-orange-200 flex flex-col group">
      {/* Image */}
      <img
        src={image}
        alt={activity.place_name}
        className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-500"
        onError={(e) => {
          const target = e.target as HTMLImageElement;
          target.src = `https://source.unsplash.com/600x400/?${encodeURIComponent(activity.place_name)}`;
        }}
      />

      {/* Content */}
      <div className="p-5 flex flex-col flex-1 gap-2">
        <h4 className="text-lg font-bold text-gray-900 leading-tight">
          {activity.place_name}
        </h4>

        <p className="text-sm text-gray-600 leading-relaxed line-clamp-3">
          {activity.place_details}
        </p>

        <div className="mt-auto space-y-1.5 pt-2">
          {activity.ticket_pricing && (
            <div className="flex items-center gap-2 text-sm">
              <Ticket className="h-4 w-4 text-emerald-500 shrink-0" />
              <span className="text-emerald-600 font-semibold">{activity.ticket_pricing}</span>
            </div>
          )}

          {activity.best_time_to_visit && (
            <div className="flex items-center gap-2 text-sm">
              <Clock className="h-4 w-4 text-orange-500 shrink-0" />
              <span className="text-gray-600">{activity.best_time_to_visit}</span>
            </div>
          )}

          {activity.time_travel_each_location && (
            <div className="flex items-center gap-2 text-sm">
              <Navigation className="h-4 w-4 text-blue-500 shrink-0" />
              <span className="text-gray-600">{activity.time_travel_each_location}</span>
            </div>
          )}
        </div>

        {/* ✅ View on Map Button */}
        <a
          href={getGoogleMapsUrl(activity.place_name)}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-xl px-4 py-2.5 text-sm font-medium hover:from-orange-600 hover:to-pink-600 hover:shadow-lg transition-all duration-300"
        >
          <MapPin className="h-4 w-4" />
          View on Map
          <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </a>
      </div>
    </div>
  );
}

// ✅ Hotel Card Component with Unsplash API images
function HotelCard({ hotel, destination }: { hotel: any; destination: string }) {
  const [hotelImage, setHotelImage] = useState<string>("");

  useEffect(() => {
    const loadImage = async () => {
      if (hotel.hotel_image_url && hotel.hotel_image_url !== "string" && !hotel.hotel_image_url.includes("example")) {
        setHotelImage(hotel.hotel_image_url);
        return;
      }

      // Try with destination + hotel name for best results
      const query1 = `${hotel.hotel_name} ${destination} hotel`;
      const img1 = await fetchPlaceImage(query1);
      if (img1) { setHotelImage(img1); return; }

      // Fallback: just destination + hotel
      const query2 = `${destination} luxury hotel room`;
      const img2 = await fetchPlaceImage(query2);
      if (img2) { setHotelImage(img2); return; }

      // Final fallback: generic hotel
      const img3 = await fetchPlaceImage("luxury hotel room");
      if (img3) { setHotelImage(img3); return; }
    };

    loadImage();
  }, [hotel.hotel_name, hotel.hotel_image_url, destination]);

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] overflow-hidden border border-orange-100/50 hover:border-orange-200 group">
      {hotelImage ? (
        <img
          src={hotelImage}
          alt={hotel.hotel_name}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
        />
      ) : (
        <div className="w-full h-48 bg-gradient-to-br from-blue-100 via-purple-50 to-pink-100 flex items-center justify-center">
          <span className="text-4xl">🏨</span>
        </div>
      )}
      <div className="p-4">
        <h4 className="font-bold text-gray-900">{hotel.hotel_name}</h4>
        <p className="text-sm text-gray-500 mt-1">{hotel.hotel_address}</p>
        <div className="flex items-center justify-between mt-2">
          <span className="flex items-center gap-1 text-sm text-green-700 font-medium">
            <Ticket className="h-4 w-4" />
            {hotel.price_per_night}
          </span>
          <span className="flex items-center gap-1 text-sm text-yellow-600">
            ⭐ {hotel.rating}
          </span>
        </div>
        <a
          href={getGoogleMapsUrl(hotel.hotel_name)}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-xl px-4 py-2.5 text-sm font-medium hover:from-orange-600 hover:to-pink-600 hover:shadow-lg transition-all duration-300"
        >
          View on Map
        </a>
      </div>
    </div>
  );
}

export default function TripTimeline({ tripData }: { tripData: TripInfo }) {
  if (!tripData?.itinerary || tripData.itinerary.length === 0) {
    return null;
  }

  // ✅ Build Aceternity Timeline data
  // First entry: Hotels
  // Subsequent entries: Day 1, Day 2, Day 3...
  const timelineData: { title: string; content: React.ReactNode }[] = [];

  // Hotels section
  if (tripData.hotels && tripData.hotels.length > 0) {
    timelineData.push({
      title: "Hotels",
      content: (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {tripData.hotels.map((hotel: any, idx: number) => (
            <HotelCard key={idx} hotel={hotel} destination={tripData.destination} />
          ))}
        </div>
      ),
    });
  }

  // Day-wise itinerary
  tripData.itinerary.forEach((day: DayPlan) => {
    timelineData.push({
      title: `Day ${day.day}`,
      content: (
        <div>
          {day.best_time_to_visit_day && (
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-50 to-pink-50 border border-orange-200/50 rounded-full px-4 py-1.5 mb-4">
              <Clock className="h-4 w-4 text-orange-500" />
              <span className="text-base md:text-lg font-semibold bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent">
                Best Time: {day.best_time_to_visit_day}
              </span>
            </div>
          )}

          {day.day_plan && (
            <p className="text-base md:text-lg text-gray-600 leading-relaxed mb-4">{day.day_plan}</p>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {day.activities?.map((activity: Activity, actIdx: number) => (
              <PlaceCard key={actIdx} activity={activity} />
            ))}
          </div>
        </div>
      ),
    });
  });

  return (
    <div className="w-full">
      {/* ✅ Fixed Header - No "Create New Trip" text */}
      <div className="px-4 md:px-8 pt-8 pb-4">
        <h1 className="text-3xl md:text-4xl font-bold leading-tight">
          <span className="text-gray-900">Your Trip Itinerary from </span>
          <span className="bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent">{tripData?.origin}</span>
          <span className="text-gray-900"> to </span>
          <span className="bg-gradient-to-r from-emerald-500 to-teal-500 bg-clip-text text-transparent">{tripData?.destination}</span>
          <span className="text-gray-900"> is Ready</span>
        </h1>
        <div className="flex flex-wrap items-center gap-4 mt-4">
          <span className="inline-flex items-center gap-2 bg-orange-50 border border-orange-200/50 rounded-full px-4 py-2 text-sm font-medium text-gray-700">
            <Calendar className="h-4 w-4 text-orange-500" />
            {tripData.duration}
          </span>
          <span className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-200/50 rounded-full px-4 py-2 text-sm font-medium text-gray-700">
            <Ticket className="h-4 w-4 text-emerald-500" />
            {tripData.budget}
          </span>
          <span className="inline-flex items-center gap-2 bg-purple-50 border border-purple-200/50 rounded-full px-4 py-2 text-sm font-medium text-gray-700">
            👥 {tripData.group_size}
          </span>
        </div>
      </div>

      {/* ✅ Aceternity UI Timeline */}
      <Timeline data={timelineData} />
    </div>
  );
}
