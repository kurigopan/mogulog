"use client";

import { useState, useEffect, useRef } from "react";
import { ExpandMoreIcon } from "@/icons";

export default function AgeOptionsFilter() {
  const [childAge, setChildAge] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const ageOptions = [
    { label: "5-6ヶ月", value: "5-6" },
    { label: "7-8ヶ月", value: "7-8" },
    { label: "9-11ヶ月", value: "9-11" },
    { label: "12-18ヶ月", value: "12-18" },
  ];

  const handleAgeChange = (newAge) => {
    setChildAge(newAge);
    setIsDropdownOpen(false);
    // In a real application, you would trigger a data fetch or state update here
    // to filter the content based on the new age.
  };

  useEffect(() => {
    // localStorage is not supported in this environment, using mock data
    setChildAge("7-8");
  }, []);

  useEffect(() => {
    // Function to handle clicks outside the dropdown to close it
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    // Add event listener
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className="flex items-center p-1 rounded-full transition-colors"
      >
        <span className="text-sm text-stone-600 font-normal">月齢</span>
        <div className="flex items-center px-2 py-1 bg-purple-50 rounded-full ml-1 hover:bg-purple-100">
          <span className="text-sm text-purple-600 font-medium">
            {childAge}ヶ月
          </span>
          <ExpandMoreIcon />
        </div>
      </button>
      {isDropdownOpen && (
        <div className="absolute right-0 top-full mt-2 w-32 bg-white rounded-lg shadow-lg border border-stone-200 z-20 overflow-hidden">
          {ageOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => handleAgeChange(option.value)}
              className={`block w-full text-left px-4 py-2 text-sm transition-colors ${
                childAge === option.value
                  ? "bg-purple-100 text-purple-700 font-semibold"
                  : "text-stone-700 hover:bg-stone-100"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
