"use client";

import { useState, useEffect, useRef } from "react";
import { ExpandLessIcon, ExpandMoreIcon } from "@/icons";
import { useAtom } from "jotai";
import { childAgeStageAtom } from "@/lib/utils/atoms";

type AgeOptionsFilterProps = {
  onChildAgeStageChange: (newStage: string) => void;
};

export default function AgeOptionsFilter({
  onChildAgeStageChange,
}: AgeOptionsFilterProps) {
  const [childAgeStage, setChildAgeStage] = useAtom(childAgeStageAtom);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const ageOptions = [
    { label: "5-6ヶ月", value: "初期" },
    { label: "7-8ヶ月", value: "中期" },
    { label: "9-11ヶ月", value: "後期" },
    { label: "12-18ヶ月", value: "完了期" },
  ];

  const handleStageChange = (newStage: string) => {
    setChildAgeStage(newStage);
    setIsDropdownOpen(false);
    onChildAgeStageChange(newStage);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        event.target instanceof Node &&
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
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
    (option) => option.value === childAgeStage,
  )?.label;

  return (
    <div className="relative" ref={dropdownRef}>
      <div className="flex items-center space-x-2">
        <span className="text-sm text-stone-600">月齢</span>
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="flex items-center rounded-full transition-colors space-x-2 px-4 py-2 bg-violet-100 shadow-sm hover:shadow-md hover:bg-violet-200"
        >
          <span className="text-sm text-violet-600">{currentAgeLabel}</span>
          {isDropdownOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        </button>
      </div>
      {isDropdownOpen && (
        <div className="absolute right-0 top-full mt-1 w-28 bg-white rounded-xl shadow-sm border border-stone-200 z-20 overflow-hidden">
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
