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
    userData,
  } = useContext(GlobalContext);

  const [title, setTitle] = useState("");
  const [selectedHour, setSelectedHour] = useState("10");
  const [selectedMinute, setSelectedMinute] = useState("00");
  const [expectedDuration, setExpectedDuration] = useState("01");
  const [error, setError] = useState("");
  const [course, setCourse] = useState("");
  const [ten, setTen] = useState([]);
  const [eleven, setEleven] = useState([]);
  const [ticketType, setTicketType] = useState("");

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
  return (
    <div className="flex justify-center p-4 bg-gray-50">
      <div className="shadow-xl rounded-lg w-full max-w-2xl p-8 bg-white">
        <h2 className="text-3xl font-bold mb-6 text-center text-indigo-600">
          Create Ticket
        </h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label
              htmlFor="ticketType"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Ticket Type
            </label>
            <select
              id="ticketType"
              value={ticketType}
              onChange={(e) => {
                setTicketType(e.target.value);
                const temp = adviserData.find((advisers) => {
                  return advisers.username === userData.supervisor;
                });
                setAdviser(temp);
              }}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="" disabled>
                Select Ticket Type
              </option>
              <option>Course Ticket</option>
              <option>Supervisor Ticket</option>
            </select>
          </div>
          {ticketType === "Supervisor Ticket" && (
            <div>
              <h1>Supervisor :{userData.supervisor}</h1>
            </div>
          )}
          {ticketType === "Course Ticket" && (
            <div className="mb-6">
              <label
                htmlFor="adviser"
                className="block text-sm font-medium text-gray-700 mb-2"
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
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="" disabled>
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
          )}

          <div className="mb-6">
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter ticket title"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          {ticketType === "Course Ticket" && (
            <div className="mb-6">
              <label
                htmlFor="course"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Course
              </label>
              <input
                type="text"
                value={course}
                onChange={(e) => setCourse(e.target.value)}
                placeholder="Enter your course"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>
          )}

          {!!adviser && (
            <div className="mb-0">
              <label
                htmlFor="time"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Choose Time (between 10:00 AM and 11:55 AM)
              </label>

              <Dropdown title="Select Time" min />
            </div>
          )}

          {adviser && (
            <div className="mb-6">
              <label
                htmlFor="expected-time"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Expected Duration (minutes)
              </label>
              <span className="text-xs text-gray-500">
                Note: The adviser can update this time
              </span>
              <div className="mt-2">
                <Dropdown title="Select Minutes" min />
              </div>
            </div>
          )}

          <div className="text-center">
            <button
              type="submit"
              className="inline-block bg-indigo-600 hover:bg-indigo-700 py-2 px-6 rounded-lg text-sm font-medium text-white shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Create Ticket
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
