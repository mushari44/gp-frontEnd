import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { GlobalContext } from "../../../context";
import MessageContainer from "../../messages";

export default function AdviserTicketTile({
  ticketItem,
  setActiveTicket,
  activeTicket,
}) {
  const [showMessages, setShowMessages] = useState(false);
  const [changeTime, setChangeTime] = useState(false);
  const [durationChanged, setDurationChanged] = useState(false);
  // const [expectedDuration, setExpectedDuration] = useState(ticketItem.Duration);
  const [endSession, setEndSession] = useState(false);
  const [conclusion, setConclusion] = useState("");
  const { storedId, socket } = useContext(GlobalContext);

  // Update expectedDuration whenever ticketItem prop changes
  useEffect(() => {
    // setExpectedDuration(ticketItem.Duration);
    setDurationChanged(false);
    setChangeTime(false);
    setEndSession(false);
    setConclusion("");
  }, [ticketItem]);

  // Handle socket events
  useEffect(() => {
    if (socket) {
      const handleDurationUpdate = (ticketDetails) => {
        // Update only if this ticket is affected

        if (ticketItem._id === ticketDetails._id) {
          console.log("YES");

          // setExpectedDuration(ticketDetails.Duration);
          ticketItem.Duration = ticketDetails.Duration;
          ticketItem.Hour = ticketDetails.Hour;
          ticketItem.Minutes = ticketDetails.Minutes;
          ticketItem.confirmedDuration = true;
          // console.log(newDuration);
        }
      };

      const joinRooms = () => {
        const studentTicketId = ticketItem.ReceiverTicketId;
        const adviserTicketId = ticketItem._id;
        socket.emit("joinTicketRoom", { studentTicketId, adviserTicketId });
      };

      joinRooms();
      socket.on("durationUpdated", handleDurationUpdate);

      return () => {
        socket.off("durationUpdated", handleDurationUpdate);
      };
    }
  }, [socket, ticketItem]);

  async function handleSelect(Duration) {
    setChangeTime(false);
    setDurationChanged(true);
    // setExpectedDuration(Duration);
    ticketItem.confirmedDuration = true;
    ticketItem.Duration = Duration;
    const requestBody = {
      studentId: ticketItem.ReceiverId,
      adviserId: storedId,
      ReceiverTicketId: ticketItem.ReceiverTicketId,
      ticketId: ticketItem._id,
      newDuration: Duration,
      selectedHour: ticketItem.Hour,
      selectedMinute: ticketItem.Minutes,
    };

    try {
      const response = await axios.put(
        "https://gp-back-end-23b2cebb8602.herokuapp.com/api/ticket/user/expectedDuration",
        requestBody
      );
      const data = response.data;
      socket.emit("durationUpdated", {
        data,
      });
      // setExpectedDuration(""); // Reset duration after update
    } catch (error) {
      console.log(error);
    }
  }

  // Handle session conclusion input change
  const handleConclusionChange = (e) => {
    setConclusion(e.target.value);
  };

  // API call to handle session end
  const handleEndSession = async () => {
    try {
      const response = await axios.put(
        "https://gp-back-end-23b2cebb8602.herokuapp.com/api/ticket/user/endSession",
        {
          adviserId: storedId,
          studentId: ticketItem.ReceiverId,
          ticketId: ticketItem._id,
          ReceiverTicketId: ticketItem.ReceiverTicketId,
          conclusion,
        }
      );
      const sessionDetails = {
        adviserTicketId: ticketItem._id,
        studentTicketId: ticketItem.ReceiverTicketId,
        conclusion: conclusion,
      };
      console.log(response.data);
      socket.emit("sessionEnded", sessionDetails);
      setEndSession(false);
      ticketItem.conclusion = response.data;
    } catch (error) {
      console.log(error);
    }
  };

  const formatTime = (hour, minute) =>
    `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`;

  const calculateEndTime = (startHour, startMinute, durationMinutes) => {
    const totalMinutes = parseInt(startMinute) + parseInt(durationMinutes);
    const endHour = startHour + Math.floor(totalMinutes / 60);
    const endMinute = totalMinutes % 60;
    return { endHour, endMinute };
  };

  const startHour = parseInt(ticketItem.Hour);
  const startMinute = parseInt(ticketItem.Minutes);
  const duration = parseInt(ticketItem.Duration);
  const { endHour, endMinute } = calculateEndTime(
    startHour,
    startMinute,
    duration
  );

  return (
    <div
      id="product"
      className="relative  animate__slideInRight  bg-gradient-to-r from-gray-100 via-gray-200 to-gray-300 border border-gray-300 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out transform hover:scale-105 p-6 mt-8 mb-6 w-11/12 mx-auto  animate__animated animate__fadeIn"
    >
      <div className="   absolute inset-0 bg-gradient-to-br from-transparent to-blue-400 opacity-30 -z-10" />
      <div className="   flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-6">
        <div className=" break-words whitespace-normal max-w-full w-1/2  space-y-3 flex-1 text-center sm:text-left">
          <h1 className="md:text-xl font-bold text-xs">
            Student name: {ticketItem.name}
          </h1>
          <h1 className="md:text-xl font-bold text-xs">
            Title: {ticketItem.title}
          </h1>
          <h1 className="md:text-xl font-bold text-xs">
            Course: {ticketItem.course}
          </h1>
          <h1 className="md:text-xl font-bold text-xs">
            From: {formatTime(startHour, startMinute)} to{" "}
            {ticketItem.confirmedDuration
              ? formatTime(endHour, endMinute)
              : "?"}
          </h1>
          <h1 className="md:text-xl font-bold text-xs">
            Duration: {duration} minutes
          </h1>

          <div hidden={ticketItem.confirmedDuration}>
            {!durationChanged ? (
              <div className="w-full">
                <button
                  className="mr-6 bg-blue-200 p-1 rounded-md font-bold text-black"
                  onClick={() => handleSelect(duration)}
                >
                  Confirm Duration
                </button>
                <button
                  className="mr-6 bg-red-200 p-1 rounded-md font-bold text-black"
                  onClick={() => setChangeTime(true)}
                >
                  Change Time
                </button>
              </div>
            ) : null}

            {changeTime ? (
              <div className="w-full flex items-end justify-end">
                <select
                  id="expected-time"
                  onChange={(e) => handleSelect(e.target.value)}
                  className="w-2/4 text-black px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-center overflow-auto max-h-32"
                  aria-label="Select expected minutes"
                >
                  <option key={0} value={0} disabled={false}>
                    Select the session duration
                  </option>
                  {[...Array(20).keys()].map((minute) => (
                    <option key={minute + 1} value={minute + 1}>
                      {minute + 1}
                    </option>
                  ))}
                </select>
              </div>
            ) : null}
          </div>

          {ticketItem.conclusion && (
            <div className="w-full">
              <h1 className="text-2xl font-semibold  mt-2">
                Session Conclusion:{" "}
                <span className="font-normal ">{ticketItem.conclusion}</span>
              </h1>
            </div>
          )}

          <button
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg px-6 py-3 mt-4 transition-transform duration-300 transform hover:scale-105 hover:shadow-lg"
            onClick={() =>
              activeTicket === ticketItem._id
                ? setActiveTicket(null)
                : setActiveTicket(ticketItem._id)
            }
          >
            {showMessages ? "Hide Messages" : "Show Messages"}
          </button>
          {!ticketItem.conclusion ? (
            <button
              className="bg-red-600 ml-5 hover:bg-red-700 text-white font-semibold rounded-lg px-6 py-3 mt-4 transition-transform duration-300 transform hover:scale-105 hover:shadow-lg"
              onClick={() => setEndSession(!endSession)}
            >
              End Session
            </button>
          ) : null}

          <p className="text-red-600 font-extrabold">
            <span className="text-xs text-gray-500">Created at: </span>
            {ticketItem.date}
          </p>
        </div>
        {ticketItem._id === activeTicket && (
          <div className="animate__animated animate__fadeIn animate__delay-1s w-1/2 h-full max-h-full overflow-y-auto">
            <MessageContainer ticket={ticketItem} />
          </div>
        )}
      </div>

      {endSession && (
        <div className="w-full flex flex-col items-end mt-4">
          <textarea
            className="w-full h-24 border-2 border-gray-400 rounded-lg p-2 text-black"
            placeholder="Write your conclusion here..."
            value={conclusion}
            onChange={handleConclusionChange}
          />
          <button
            className="mt-2 bg-blue-500 text-white p-2 rounded-lg"
            onClick={handleEndSession}
          >
            Submit Conclusion
          </button>
        </div>
      )}
    </div>
  );
}
