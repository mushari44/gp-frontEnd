import React, { useContext, useState } from "react";
import { TimePicker, DatePicker } from "rsuite";
import "rsuite/dist/rsuite-no-reset.min.css";
import { GlobalContext } from "../context";
import "../index.css";
const TimePickerRangeExample = ({ title ,onTimeChange}) => {
  const [fromTime, setFromTime] = useState(null);
  const [toTime, setToTime] = useState(null);
  const [date, setDate] = useState(null);
  const { adviser } =
    useContext(GlobalContext);
  const [allowedHours, setAllowedHours] = useState([]);
  const [allowedMinutesByHour, setAllowedMinutesByHour] = useState({});
  const[adviserFromTime,setAdviserFromTime]=useState(null)
  const[adviserToTime,setAdviserToTime]=useState(<null></null>)
  const handleFromTimeChange = (value) => {
    setFromTime(value);
    if (toTime && value > toTime) {
      setToTime(null);
    }
    // setExpectedDuration(value);
    console.log("From Time changed:", { fromTime: value, toTime });
  };


console.log("FRom TIME : ",adviserFromTime);
console.log("TO TIME : ",adviserToTime);

  const disableNonAllowedDays = (date) => {
    if (!adviser || !adviser.availableTimes || !adviser.availableTimes.Days) {
      return true;
    }
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
    const day = date.getDay();
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return date < today || !allowedDays.includes(day);
  };

  const handleDateChange = (value) => {
    setDate(value);

    // Reset related states when date changes
    setFromTime(null);
    setToTime(null);
    setAllowedHours([]);
    setAllowedMinutesByHour({});

    if (!adviser || !adviser.availableTimes || !adviser.availableTimes.Days) {
      return;
    }

    const selectedDay = adviser.availableTimes.Days.find(
      (day) =>
        day.day.toLowerCase() ===
        value.toLocaleDateString("en-US", { weekday: "long" }).toLowerCase()
    );

    if (selectedDay && selectedDay.hours) {
      const hours = [];
      const minutesByHour = {};

      selectedDay.hours.forEach((hour) => {
        const hourStart = Number(hour.start.split(":")[0]);
        const hourEnd = Number(hour.end.split(":")[0]);
          console.log("HOYR??",hourStart);
          console.log("HOYR end ??",hourEnd);
          
        hour.minutes.forEach((minuteBlock) => {
          const hour = minuteBlock.hour;
          hours.push(hour);

          if (!minutesByHour[hour]) {
            minutesByHour[hour] = [];
          }
          minutesByHour[hour].push(...minuteBlock.minutes);
        });
      });

      setAllowedHours([...new Set(hours)]);
      setAllowedMinutesByHour(minutesByHour);
    }
  };

  const disabledHours = (hour) => !allowedHours.includes(hour);
  const disabledMinutes = (minute) => {
    if (!fromTime) return false;
    const selectedHour = new Date(fromTime).getHours();
    return !(allowedMinutesByHour[selectedHour] || []).includes(minute);
  };
 
  const handleTimeChange = (from, to) => {
    const formattedFrom = from
      ? from.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hourCycle: "h23" })
      : null;
    const formattedTo = to
      ? to.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hourCycle: "h23" })
      : null;

    setAdviserFromTime(formattedFrom);
    setAdviserToTime(formattedTo);

    if (onTimeChange) {
      onTimeChange(formattedFrom, formattedTo);
    }
  };
  console.log("ONTIME   ",onTimeChange);
  
  return (
    <div>
      {title === "Select Time" && (
        <div className="w-full flex space-x-1">
          <h1>Select Date:</h1>
          <DatePicker
            format="yyyy-MM-dd"
            onChange={handleDateChange}
            placeholder="Select Date"
            value={date}
            disabledDate={disableNonAllowedDays}
            showNow={false}
          />
          <div className="flex space-x-1">
            <h1 hidden={date === null}>Select Start Time:</h1>
            <TimePicker
              className="custom-time-picker"
              format="HH:mm"
              placeholder="Select time"
              hideHours={disabledHours}
              hideMinutes={disabledMinutes}
              hidden={date === null}
              value={fromTime}
              onSelect={handleFromTimeChange}
              showNow={false}
            />
          </div>
        </div>
      )}

      {title === "Select Minutes" && (
        <div className="flex space-x-1">
          <h1 hidden={date === null}>Select Duration:</h1>
          <TimePicker
            format="mm"
            placeholder="Select time"
            value={fromTime}
            hideMinutes={(minute) => minute >= 15}
            onSelect={handleFromTimeChange}
            showNow={false}
            className="custom-time-picker"
          />
        </div>
      )}

{title === "From To Time" && (
        <div>
          <h1>From Time</h1>
          <TimePicker
            className="custom-time-picker"
            format="HH:mm"
            placeholder="Select time"
            value={fromTime}
            onSelect={(value) => {
              setFromTime(value);
              handleTimeChange(value, toTime);
            }}
            showNow={false}
          />
          <div className="mt-4">
            <h1>To Time</h1>
            <TimePicker
              className="custom-time-picker"
              format="HH:mm"
              placeholder="Select time"
              value={toTime}
              onSelect={(value) => {
                setToTime(value);
                handleTimeChange(fromTime, value);
              }}
              showNow={false}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default TimePickerRangeExample;
