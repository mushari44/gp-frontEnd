import React, { useState, useEffect, useContext } from "react";
import { GlobalContext } from "../../../context";
import MessageContainer from "../../messages";

const StudentTicketTile = ({ ticketItem, setActiveTicket, activeTicket }) => {
  const [expectedDuration, setExpectedDuration] = useState(ticketItem.Duration);
  const [conclusion, setConclusion] = useState(ticketItem.conclusion);
  const { socket } = useContext(GlobalContext);

  // Helper function to format time
  const formatTime = (hour, minute) =>
    `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`;

  // Calculate the end time
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

  useEffect(() => {
    if (!socket) return;

    const handleDurationUpdate = (ticketDetails) => {
      // Update only if this ticket is affected

      if (ticketItem._id === ticketDetails._id) {
        setExpectedDuration(ticketDetails.Duration);
        ticketItem.Duration = ticketDetails.Duration;
        ticketItem.Hour = ticketDetails.Hour;
        ticketItem.Minutes = ticketDetails.Minutes;
        ticketItem.confirmedDuration = true;
        // console.log(newDuration);
      }
    };

    // Join ticket rooms on component mount
    const joinRooms = () => {
      const studentTicketId = ticketItem._id;
      const adviserTicketId = ticketItem.ReceiverTicketId;

      socket.emit("joinTicketRoom", { studentTicketId, adviserTicketId });
    };

    joinRooms();

    socket.on("durationUpdated", handleDurationUpdate);

    // Clean up the event listener on unmount
    return () => {
      socket.off("durationUpdated", handleDurationUpdate);
    };
  }, [socket, ticketItem, expectedDuration]);
  useEffect(() => {
    if (!socket) return;

    const handleSessionEnded = (sessionDetails) => {
      // Update the student's ticket with the session conclusion
      console.log("session details : ", sessionDetails);

      if (ticketItem._id === sessionDetails.studentTicketId) {
        setConclusion(sessionDetails.conclusion);
        ticketItem.conclusion = sessionDetails.conclusion;
        console.log("?");
      }
    };

    socket.on("sessionEnded", handleSessionEnded);

    return () => {
      socket.off("sessionEnded", handleSessionEnded);
    };
  }, [socket, ticketItem, conclusion]);

  return (
    <div
      id="product"
      className="relative border border-gray-300 rounded-2xl shadow-lg hover:shadow-xl transition-transform duration-300 ease-in-out transform hover:scale-105 p-6 mt-8 mb-6 w-11/12 mx-auto animate__animated animate__fadeIn"
    >
      <div className="   absolute inset-0 bg-gradient-to-br from-transparent to-blue-400 opacity-30 -z-10" />
      <div className="   flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-6">
        <div className=" break-words whitespace-normal max-w-full w-1/2 flex-1 text-center sm:text-left">
          <h1 className="text-2xl font-semibold  mb-2">
            Doctor: <span className="font-normal ">{ticketItem.name}</span>
          </h1>
          <h1 className="text-2xl font-semibold mb-2">
            Title: <span className="font-normal">{ticketItem.title}</span>
          </h1>
          <h1 className="text-2xl font-semibold mb-2">
            Course: <span className="font-normal ">{ticketItem.course}</span>
          </h1>
          <h1 className="text-2xl font-semibold  mb-2">
            From:{" "}
            <span className="font-normal">
              {formatTime(startHour, startMinute)}
            </span>{" "}
            to{" "}
            <span className="font-normal ">
              {ticketItem.confirmedDuration
                ? formatTime(endHour, endMinute)
                : "?"}
            </span>
          </h1>
          {!ticketItem.confirmedDuration && (
            <p className="text-sm text-yellow-500 mb-2 animate__animated animate__pulse animate__infinite">
              Waiting for the adviser to confirm it
            </p>
          )}
          <h1 className="text-2xl font-semibold mb-2">
            Duration:{" "}
            <span className="font-normal ">{ticketItem.Duration} minutes</span>
          </h1>
          {ticketItem.conclusion && (
            <div className="  w-full">
              <h1 className="text-2xl font-semibold ">
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
            {ticketItem._id === activeTicket
              ? "Hide Messages"
              : "Show Messages"}
          </button>
          <p className="text-red-600 font-bold mt-2">
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
    </div>
  );
};

export default StudentTicketTile;
