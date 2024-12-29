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

    if (!fromTime || !toTime) {
      console.error("Invalid start or end time:", { fromTime, toTime });
      return;
    }

    const formatTime = (time) => {
      const date = new Date(time);
      return `${date.getHours().toString().padStart(2, "0")}:${date
        .getMinutes()
        .toString()
        .padStart(2, "0")}`;
    };

    const formattedFromTime = formatTime(fromTime);
    const formattedToTime = formatTime(toTime);

    const generateMinutes = (start, end) => {
      const startDate = new Date(start);
      const endDate = new Date(end);

      const startHour = startDate.getHours();
      const startMinute = startDate.getMinutes();
      const endHour = endDate.getHours();
      const endMinute = endDate.getMinutes();

      const minutes = [];
      for (
        let hour = startHour;
        hour <= (endHour >= startHour ? endHour : 23);
        hour++
      ) {
        const hourMinutes = [];
        if (hour === startHour && hour === endHour) {
          for (let minute = startMinute; minute <= endMinute; minute++) {
            hourMinutes.push(minute);
          }
        } else if (hour === startHour) {
          for (let minute = startMinute; minute < 60; minute++) {
            hourMinutes.push(minute);
          }
        } else if (hour === endHour) {
          for (let minute = 0; minute <= endMinute; minute++) {
            hourMinutes.push(minute);
          }
        } else {
          for (let minute = 0; minute < 60; minute++) {
            hourMinutes.push(minute);
          }
        }
        minutes.push({ hour, minutes: hourMinutes });
      }

      if (endHour < startHour) {
        // Handle crossing midnight
        for (let hour = 0; hour <= endHour; hour++) {
          const hourMinutes = [];
          for (
            let minute = 0;
            minute < (hour === endHour ? endMinute + 1 : 60);
            minute++
          ) {
            hourMinutes.push(minute);
          }
          minutes.push({ hour, minutes: hourMinutes });
        }
      }

      return minutes;
    };

    const generatedMinutes = generateMinutes(fromTime, toTime);

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
