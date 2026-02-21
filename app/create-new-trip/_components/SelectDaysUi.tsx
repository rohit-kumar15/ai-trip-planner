"use client";

import React, { useState } from "react";
import { Minus, Plus } from "lucide-react";

type Props = {
  onSelectedOption: (value: string) => void;
};

function SelectDaysUi({ onSelectedOption }: Props) {
  const [days, setDays] = useState<number>(3);

  const increaseDays = () => {
    setDays((prev) => prev + 1);
  };

  const decreaseDays = () => {
    if (days > 1) {
      setDays((prev) => prev - 1);
    }
  };

  return (
    <div className="mt-3 p-5 bg-white border rounded-2xl shadow-sm text-center">

      <h2 className="text-lg font-semibold mb-5">
        How many days do you want to travel?
      </h2>

      <div className="flex items-center justify-center gap-6 mb-5">

        {/* Minus Button */}
        <button
          onClick={decreaseDays}
          className="w-12 h-12 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center transition"
        >
          <Minus size={18} />
        </button>

        {/* Days Text */}
        <span className="text-2xl font-bold">
          {days} Days
        </span>

        {/* Plus Button */}
        <button
          onClick={increaseDays}
          className="w-12 h-12 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center transition"
        >
          <Plus size={18} />
        </button>
      </div>

      {/* Confirm Button */}
      <button
        onClick={() => onSelectedOption(`${days} Days`)}
        className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg font-medium transition"
      >
        Confirm
      </button>
    </div>
  );
}

export default SelectDaysUi;
