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

  const handleTimeChange = (index, timeRange) => {
    const { fromTime, toTime } = timeRange;
    const start = fromTime;
    const end = toTime;
    console.log(start, end, timeRange);

    const formatTime = (time) => {
      if (!time) return null;
      const date = new Date(time);
      return `${date.getHours().toString().padStart(2, "0")}:${date
        .getMinutes()
        .toString()
        .padStart(2, "0")}`; // Format as "HH:mm"
    };

    const formattedFromTime = formatTime(start);
    const formattedToTime = formatTime(end);

    const updatedDaysAndTimes = [...daysAndTimes];
    updatedDaysAndTimes[index].hours = {
      start: formattedFromTime,
      end: formattedToTime,
    };

    // Optionally store the date if `fromTime` exists
    if (start) {
      const date = new Date(start);
      updatedDaysAndTimes[index].date = `${date.getFullYear()}-${(
        date.getMonth() + 1
      )
        .toString()
        .padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`; // Format as "YYYY-MM-DD"
    }
    console.log("after upadte : ", updatedDaysAndTimes);

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
      const response = axios.post(
        "https://gp-backend-ikch.onrender.com/api/ticket/user/officeHours",
        requestBody
      );
      navigate("/");
    } catch (error) {
      console.log(error);
    } finally {
      console.log("Selected Days and Times:", daysAndTimes);
    }
    // Send this data to your backend or process it further here
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
              title="From Time"
              onTimeChange={(timeRange) => handleTimeChange(index, timeRange)}
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
