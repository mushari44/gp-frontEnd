import React, { useContext, useEffect, useState } from "react";
import { GlobalContext } from "../../context";
import Dropdown from "../../components/DropDown";
export default function CreateTicket() {
  const {
    handleCreateTicket,
    navigate,
    fetchAdvisers,
    adviser,
    setAdviser,
    adviserData,
    setFreeTime,
    freeTime,
    availableDurations,
    setAvailableDurations,
  } = useContext(GlobalContext);

  const [title, setTitle] = useState("");
  const [selectedHour, setSelectedHour] = useState("10");
  const [selectedMinute, setSelectedMinute] = useState("00");
  const [expectedDuration, setExpectedDuration] = useState("01");
  const [error, setError] = useState("");
  const [course, setCourse] = useState("");
  const [ten, setTen] = useState([]);
  const [eleven, setEleven] = useState([]);

  const MIN_HOUR = 10;
  const MAX_HOUR = 11;
  const MAX_MINUTE = 55;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!adviser) {
      setError("Please select an adviser");
      return;
    }
    if (!title.trim()) {
      setError("Please enter a valid title");
      return;
    }
    setError("");
    handleCreateTicket(
      title,
      course,
      selectedHour,
      selectedMinute,
      expectedDuration
    );
    setAdviser("");
    navigate("/tickets");
  };

  useEffect(() => {
    fetchAdvisers();
  }, []);

  useEffect(() => {
    if (adviser) {
      setFreeTime(adviser?.availableTimes);
      setTen(adviser?.availableTimes?.ten || []);
      setEleven(adviser?.availableTimes?.eleven || []);
    }
  }, [adviser]);
  console.log("dur : ", availableDurations);

  useEffect(() => {
    if (selectedHour === "10" && selectedMinute) {
      const sortedTen = [...ten].sort((a, b) => parseInt(a) - parseInt(b));
      for (let index = 0; index < sortedTen.length; index++) {
        if (sortedTen[index] > selectedMinute) {
          setAvailableDurations(
            parseInt(sortedTen[index]) - parseInt(selectedMinute)
          );
          break;
        }
      }
    } else if (selectedHour === "11") {
      setAvailableDurations(MAX_MINUTE - parseInt(selectedMinute));
    }
  }, [selectedHour, selectedMinute, ten]);

  return (
    <div className="flex justify-center  p-10 text-black">
      <div className="shadow-lg rounded-lg w-full max-w-lg p-6 bg-white">
        <h2 className="text-2xl font-semibold mb-6 text-center">
          Create Ticket
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="adviser"
              className="block text-sm font-medium text-gray-700"
            >
              Adviser
            </label>
            <select
              id="adviser"
              value={adviser ? adviser._id : ""}
              onChange={(e) => {
                const selectedAdviser = adviserData.find(
                  (adv) => adv._id === e.target.value
                );
                setAdviser(selectedAdviser);
                setFreeTime(selectedAdviser.availableTimes);
                setError("");
              }}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              aria-label="Select an adviser"
            >
              <option value="" disabled={true}>
                Select an Adviser
              </option>
              {adviserData.map((adviser) => (
                <option key={adviser._id} value={adviser._id}>
                  {adviser.username}
                </option>
              ))}
            </select>
            {error && <p className="text-red-500 text-xs mt-2">{error}</p>}
          </div>
          <div className="mb-4 text-black">
            <div className="flex space-x-4 text-black">
              <div className="flex-1 ">
                <label
                  htmlFor="title"
                  className="flex text-sm font-medium text-gray-700"
                >
                  Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter ticket title"
                  className="text-black mt-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm w-full"
                  required
                />
              </div>
              <div className="flex-1">
                <label
                  htmlFor="course"
                  className="text-sm font-medium text-gray-700"
                >
                  Course
                </label>
                <input
                  type="text"
                  value={course}
                  onChange={(e) => setCourse(e.target.value)}
                  placeholder="Enter your course"
                  className=" mt-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm w-full"
                  required
                />
              </div>
            </div>
          </div>

          <div className="mb-4" hidden={!!adviser ? false : true}>
            <label
              htmlFor="time"
              className="block text-sm font-medium text-gray-700"
            >
              Choose Time (between 10:00 AM and 11:55 AM)
            </label>
            <div className="flex space-x-4">
              <Dropdown title={"Select Time"} />
            </div>
          </div>

          <div className="mb-4" hidden={!!adviser ? false : true}>
            <label
              htmlFor="expected-time"
              className="block text-sm font-medium text-gray-700"
            >
              Expected Duration (minutes)
            </label>
            <span className="text-xs text-gray-500">
              Note: the adviser can update this time
            </span>
            <div className="w-full flex items-end justify-end">
              <select
                id="expected-time"
                value={expectedDuration}
                onChange={(e) => setExpectedDuration(e.target.value)}
                className="w-2/4 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-center overflow-auto max-h-32"
                aria-label="Select expected minutes"
              >
                <option key={0} value={0} disabled={true}>
                  Select the session duration
                </option>
                {[...Array(availableDurations).keys()].map((minute) => (
                  <option
                    key={minute + 1}
                    value={minute + 1 < 10 ? `0${minute + 1}` : minute + 1}
                  >
                    {minute + 1 < 10 ? `0${minute + 1}` : minute + 1}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="text-center">
            <button
              type="submit"
              className="inline-block bg-indigo-600 hover:bg-indigo-700 py-2 px-4 rounded-md text-sm font-medium text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Create Ticket
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
