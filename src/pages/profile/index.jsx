import { useContext, useState } from "react";
import { GlobalContext } from "../../context";
import TimePickerRangeExample from "../../components/DropDown";
import axios from "axios";

export default function Profile() {
  const { userData, storedId, navigate } = useContext(GlobalContext);
  const [daysAndTimes, setDaysAndTimes] = useState([
    { date: "", day: "", hours: { start: null, end: null } },
  ]);

  const handleDayChange = (index, day) => {
    const updatedDaysAndTimes = [...daysAndTimes];
    updatedDaysAndTimes[index].day = day;
    setDaysAndTimes(updatedDaysAndTimes);
  };

  const handleTimeChange = (index, fromTime, toTime) => {
    if (!fromTime || !toTime) {
      console.error("Invalid start or end time:", { fromTime, toTime });
      return;
    }


    const formattedFromTime= fromTime;
    const formattedToTime =toTime;

    const generateMinutes = (start, end) => {
      const [startHour, startMinute] = start.split(":").map(Number);
      const [endHour, endMinute] = end.split(":").map(Number);
    
      console.log("Start Hour:", startHour);
      console.log("Start Minute:", startMinute);
      console.log("End Hour:", endHour);
      console.log("End Minute:", endMinute);
    
      const minutes = [];
    
      if (startHour === endHour) {
        // If the same hour, generate minutes from startMinute to endMinute
        minutes.push({
          hour: startHour,
          minutes: Array.from({ length: endMinute - startMinute + 1 }, (_, i) => startMinute + i),
        });
      } else {
        // If different hours, handle edge case where endMinute is 00
        if (endMinute === 0) {
          minutes.push({
            hour: startHour,
            minutes: Array.from({ length: 60 - startMinute }, (_, i) => startMinute + i),
          });
        } else {
          // Otherwise, handle start and end hours separately
          minutes.push({
            hour: startHour,
            minutes: Array.from({ length: 60 - startMinute }, (_, i) => startMinute + i),
          });
          minutes.push({
            hour: endHour,
            minutes: Array.from({ length: endMinute + 1 }, (_, i) => i),
          });
        }
      }
    
      return minutes;
    };
    

    const generatedMinutes = generateMinutes(fromTime, toTime);
    console.log("GENERATE MIN : ",generateMinutes);
    
    const updatedDaysAndTimes = [...daysAndTimes];
    updatedDaysAndTimes[index].hours = {
      start: formattedFromTime,
      end: formattedToTime,
      minutes: generatedMinutes,
    };

    const date = new Date(fromTime);
    updatedDaysAndTimes[index].date = `${date.getFullYear()}-${(
      date.getMonth() + 1
    )
      .toString()
      .padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`;

    setDaysAndTimes(updatedDaysAndTimes);
  };

  const handleAddAnotherDay = () => {
    setDaysAndTimes([
      ...daysAndTimes,
      { date: "", day: "", hours: { start: null, end: null } },
    ]);
  };

  const handleDeleteDay = (index) => {
    const updatedDaysAndTimes = daysAndTimes.filter((_, i) => i !== index);
    setDaysAndTimes(updatedDaysAndTimes);
  };

  const handleSubmit = async () => {
    try {
      const requestBody = { daysAndTimes, storedId };
      await axios.post(
        "http://127.0.0.1:4000/api/ticket/user/officeHours",
        requestBody
      );
      navigate("/");
    } catch (error) {
      console.log(error);
    } finally {
      console.log("Selected Days and Times:", daysAndTimes);
    }
  };

  return (
    <div className="flex items-center justify-center mt-12">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h1>Hello, {userData?.username}</h1>

        {daysAndTimes.map((entry, index) => (
          <div key={index} className="space-y-4">
            <div className="flex items-center justify-between">
              <select
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                value={entry.day}
                onChange={(e) => handleDayChange(index, e.target.value)}
                aria-label="Select a day"
              >
                <option value="" disabled>
                  Select a day
                </option>
                <option>Sunday</option>
                <option>Monday</option>
                <option>Tuesday</option>
                <option>Wednesday</option>
                <option>Thursday</option>
              </select>

              <button
                className="ml-4 px-3 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700"
                onClick={() => handleDeleteDay(index)}
              >
                Delete
              </button>
            </div>

            <TimePickerRangeExample
              title="From To Time"
              onTimeChange={(fromTime, toTime) =>
                handleTimeChange(index, fromTime, toTime)
              }
            />
          </div>
        ))}

        <button
          className="w-full px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
          onClick={handleAddAnotherDay}
        >
          Add Another Day
        </button>

        <button
          className="w-full px-4 py-2 mt-4 text-white bg-green-600 rounded-lg hover:bg-green-700"
          onClick={handleSubmit}
        >
          Submit
        </button>
      </div>
    </div>
  );
}
