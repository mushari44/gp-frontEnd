import React, { useContext, useState } from "react";
import { TimePicker } from "rsuite";
import "rsuite/dist/rsuite-no-reset.min.css";
import { GlobalContext } from "../context";
import "../index.css";
const TimePickerRangeExample = ({ title, onTimeChange }) => {
  const [fromTime, setFromTime] = useState(null);
  const { adviser, availableDurations, setAvailableDurations } =
    useContext(GlobalContext);
  const [toTime, setToTime] = useState(null);
  const [date, setDate] = useState(null);
  const [duration, setDuration] = useState(0);
  const handleFromTimeChange = (value) => {
    setFromTime(value);
    // Reset the "toTime" if it's before the "fromTime"
    if (toTime && value > toTime) {
      setToTime(null);
    }
    onTimeChange({ fromTime: value, toTime });
  };

  const handleToTimeChange = (value) => {
    setToTime(value);
    onTimeChange({ fromTime, toTime: value });
  };
  const disableNonAllowedDays = (date) => {
    if (!adviser || !adviser.availableTimes || !adviser.availableTimes.Days) {
      return true; // Disable all dates if data is unavailable
    }

    // Get the numeric representation of allowed days (0 = Sunday, 1 = Monday, etc.)
    const allowedDays = adviser.availableTimes.Days.map((day) => {
      switch (day.day.toLowerCase()) {
        case "sunday":
          return 0;
        case "monday":
          return 1;
        case "tuesday":
          return 2;
        case "wednesday":
          return 3;
        case "thursday":
          return 4;
        default:
          return null;
      }
    });
    // console.log("allowed days : ", allowedDays);

    const day = date.getDay();
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset to midnight for comparison

    // Disable if the date is in the past or not in the allowed days
    return date < today || !allowedDays.includes(day);
  };

  const handleToggle = (open) => {
    const picker = document.querySelector(".time-picker-drop-up");
    if (picker) {
      const rect = picker.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      if (spaceBelow < 200) {
        picker.classList.add("drop-up");
      } else {
        picker.classList.remove("drop-up");
      }
    }
  };

  return (
    <div>
      {title === "From Time" ? (
        <div className="text-black">
          <Row title="From Time">
            <TimePicker
              format="HH:mm"
              value={fromTime}
              onChange={handleFromTimeChange}
              placeholder="Select start time"
              hideHours={(hour) => hour < 8 || hour > 15} // Limit hours to 8 AM - 6 PM
              // hideMinutes={(minute) => minute % 15 !== 0} // Only allow 15-minute intervals
            />
          </Row>
          <Row title="To Time">
            <TimePicker
              format="HH:mm"
              value={toTime}
              onChange={handleToTimeChange}
              placeholder="Select end time"
              hideHours={(hour) => hour < 8 || hour > 15}
              // hideMinutes={(minute) => minute % 15 !== 0}
            />
          </Row>

          <div style={{ marginTop: 20 }}>
            <strong>Selected Time Range:</strong>
            <p>
              From: {fromTime ? fromTime.toLocaleTimeString() : "Not Selected"}{" "}
              To: {toTime ? toTime.toLocaleTimeString() : "Not Selected"}
            </p>
          </div>
        </div>
      ) : null}
      {title === "Select Time" ? (
        <div className="w-full flex space-x-1 ">
          <h1>Select Date:</h1>
          <TimePicker
            format="MMM-dd" // Display in a more user-friendly format
            onChange={(value) => setDate(value)}
            placeholder="Select Date"
            value={date} // Set default value to current time
            // Define available times by hiding unavailable ones

            disabledDate={disableNonAllowedDays} // Disable non-Sunday/Monday and past dates
          />
          <h1>Select Time:</h1>

          <TimePicker
            format="HH:mm " // Display in a more user-friendly format
            onChange={(value) => setDate(value)}
            placeholder="Select Time"
            value={date} // Set default value to current time
            // Define available times by hiding unavailable ones

            hideHours={(hour) => hour < 8 || hour > 15}
            disabledDate={disableNonAllowedDays} // Disable non-Sunday/Monday and past dates
          />
        </div>
      ) : null}
      {title === "Select Hour" ? (
        <div>
          <Row title="Select Time">
            <TimePicker
              format="HH:mm" // Display in a more user-friendly format
              onChange={(value) => setDate(value)}
              placeholder="Select Time"
              value={date} // Set default value to current time
            />
          </Row>
        </div>
      ) : null}
      {title === "Select Minute" ? (
        <div>
          <Row title="Select Duration">
            <TimePicker
              className="time-picker-drop-up"
              format="mm" // Display in a more user-friendly format
              onChange={(value) => setDuration(value)}
              placeholder="Select Minute"
              value={duration} // Set default value to current time
              onOpen={() => handleToggle(true)}
              onClose={() => handleToggle(false)}
            />
          </Row>
        </div>
      ) : null}
    </div>
  );
};

const Row = ({ children, title }) => {
  return (
    <div style={{ marginBottom: 10 }}>
      <label style={{ width: 120, display: "inline-block", marginTop: 10 }}>
        {title}
      </label>
      {children}
    </div>
  );
};

export default TimePickerRangeExample;
