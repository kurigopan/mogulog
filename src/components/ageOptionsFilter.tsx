"use client";

import { useState, useEffect, useRef } from "react";
import { ExpandMoreIcon } from "@/icons";

type AgeOptionsFilterProps = {
  initialChildAgeStage: string;
  onChildAgeStageChange: (newStage: string) => void;
};

export default function AgeOptionsFilter({
  initialChildAgeStage,
  onChildAgeStageChange,
}: AgeOptionsFilterProps) {
  const [childAgeStage, setChildAgeStage] = useState(initialChildAgeStage);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const ageOptions = [
    { label: "5-6ヶ月", value: "初期" },
    { label: "7-8ヶ月", value: "中期" },
    { label: "9-11ヶ月", value: "後期" },
    { label: "12-18ヶ月", value: "完了期" },
  ];

  useEffect(() => {
    setChildAgeStage(initialChildAgeStage);
  }, [initialChildAgeStage]);

  const handleStageChange = (newStage: string) => {
    setChildAgeStage(newStage);
    setIsDropdownOpen(false);
    onChildAgeStageChange(newStage);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const currentAgeLabel = ageOptions.find(
    (option) => option.value === childAgeStage
  )?.label;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className="flex items-center p-1 rounded-full transition-colors"
      >
        <span className="text-sm text-stone-600 font-normal">月齢</span>
        <div className="flex items-center px-2 py-1 bg-violet-50 rounded-full ml-1 hover:bg-violet-100">
          <span className="text-sm text-violet-600 font-medium">
            {currentAgeLabel}
          </span>
          <ExpandMoreIcon />
        </div>
      </button>
      {isDropdownOpen && (
        <div className="absolute right-0 top-full mt-2 w-32 bg-white rounded-lg shadow-lg border border-stone-200 z-20 overflow-hidden">
          {ageOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => handleStageChange(option.value)}
              className={`block w-full text-left px-4 py-2 text-sm transition-colors ${
                childAgeStage === option.value
                  ? "bg-violet-100 text-violet-700 font-semibold"
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
