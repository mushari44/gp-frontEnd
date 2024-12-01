import React, { useContext, useState } from "react";
import { TimePicker } from "rsuite";
import "rsuite/dist/rsuite-no-reset.min.css";
import { GlobalContext } from "../context";
const TimePickerRangeExample = ({ title, onTimeChange }) => {
  const [fromTime, setFromTime] = useState(null);

  const [toTime, setToTime] = useState(null);
  const [date, setDate] = useState(null);
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

  const disableNonSundayMonday = (date) => {
    const day = date.getDay();
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set time to midnight for accurate comparison

    // Disable past dates and non-Sunday/Monday
    return date < today || (day !== 0 && day !== 1);
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
        <div>
          <Row title="Select Time">
            <TimePicker
              format="yyyy-MMM-dd HH:mm" // Display in a more user-friendly format
              onChange={(value) => setDate(value)}
              placeholder="Select Time"
              value={date} // Set default value to current time
              // Define available times by hiding unavailable ones
              hideHours={(hour) => hour < 8 || hour > 18}
              hideMinutes={(minute) => minute % 15 !== 0}
              hideSeconds={(second) => second % 30 !== 0}
              disabledDate={disableNonSundayMonday} // Disable non-Sunday/Monday and past dates
            />
          </Row>
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
