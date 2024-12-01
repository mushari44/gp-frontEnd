import React, { useState, useRef, useEffect } from "react";

export default function DurationDropdown({ handleSelect, minutes }) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedDuration, setSelectedDuration] = useState(null);
  const dropdownRef = useRef(null);

  const durations = [...Array(minutes).keys()].map((minute) => minute + 1);

  // Toggles the dropdown open/close state
  const toggleDropdown = () => {
    setIsOpen((prev) => !prev);
  };

  // Closes the dropdown when clicking outside
  const handleClickOutside = (e) => {
    if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleOptionClick = (value) => {
    if (value === 5) return;
    setSelectedDuration(value);
    handleSelect(value);
    setIsOpen(false);
  };
  return (
    <div className="relative w-56 " ref={dropdownRef}>
      <button
        className="w-full text-left px-4 py-2 border rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-600 flex justify-between items-center"
        onClick={toggleDropdown}
      >
        {selectedDuration ? `${selectedDuration} minutes` : "Select Duration"}
        <svg
          className={`w-4 h-4 transform transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={5}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute z-10 mt-2 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-40 overflow-y-auto">
          {durations.map((minute) => (
            <div
              key={minute}
              className={`px-4 py-1 cursor-pointer hover:bg-blue-100 ${
                minute === 5 ? "bg-red-50 cursor-not-allowed" : " "
              }`}
              onClick={() => handleOptionClick(minute)}
            >
              <h3>
                {minute} minute{minute > 1 ? "s" : ""}
              </h3>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
