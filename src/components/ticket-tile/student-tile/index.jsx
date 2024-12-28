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
      if (ticketItem._id === ticketDetails._id) {
        setExpectedDuration(ticketDetails.Duration);
        ticketItem.Duration = ticketDetails.Duration;
        ticketItem.Hour = ticketDetails.Hour;
        ticketItem.Minutes = ticketDetails.Minutes;
        ticketItem.confirmedDuration = true;
      }
    };

    const joinRooms = () => {
      const studentTicketId = ticketItem._id;
      const adviserTicketId = ticketItem.ReceiverTicketId;

      socket.emit("joinTicketRoom", { studentTicketId, adviserTicketId });
    };

    joinRooms();

    socket.on("durationUpdated", handleDurationUpdate);

    return () => {
      socket.off("durationUpdated", handleDurationUpdate);
    };
  }, [socket, ticketItem, expectedDuration]);

  useEffect(() => {
    if (!socket) return;

    const handleSessionEnded = (sessionDetails) => {
      if (ticketItem._id === sessionDetails.studentTicketId) {
        setConclusion(sessionDetails.conclusion);
        ticketItem.conclusion = sessionDetails.conclusion;
      }
    };

    socket.on("sessionEnded", handleSessionEnded);

    return () => {
      socket.off("sessionEnded", handleSessionEnded);
    };
  }, [socket, ticketItem, conclusion]);

  return (
    <div className="relative bg-neutral-100 border border-gray-300 rounded-lg shadow-lg p-6 mb-6 w-full max-w-3xl mx-auto hover:shadow-xl transition-transform transform hover:scale-105 slide-in">
      <div className="absolute inset-0 bg-gradient-to-br from-transparent to-blue-400 opacity-30 -z-10" />
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex-1 text-center sm:text-left">
          <h2 className="text-lg font-bold text-gray-800">
            Doctor: <span className="font-normal">{ticketItem.name}</span>
          </h2>
          <p className="text-sm text-gray-600">Title: {ticketItem.title}</p>
          <p className="text-sm text-gray-600">Course: {ticketItem.course}</p>
          <p className="text-sm text-gray-600">
            From:{" "}
            <span className="font-normal">
              {formatTime(startHour, startMinute)}
            </span>{" "}
            to{" "}
            <span className="font-normal">
              {ticketItem.confirmedDuration
                ? formatTime(endHour, endMinute)
                : "?"}
            </span>
          </p>
          {!ticketItem.confirmedDuration && (
            <p className="text-sm text-yellow-500 mb-2 animate__animated animate__pulse animate__infinite">
              Waiting for the adviser to confirm it
            </p>
          )}
          <p className="text-sm text-gray-600">
            Duration:{" "}
            <span className="font-normal">{ticketItem.Duration} minutes</span>
          </p>
          {ticketItem.conclusion && (
            <div className="w-full">
              <h1 className="text-black">
                Session Conclusion:{" "}
                <span className="font-normal">{ticketItem.conclusion}</span>
              </h1>
            </div>
          )}
        </div>
        <div className="flex gap-2">
          <button
            className=" bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg px-6 py-3 mt-4 transition-transform duration-300 transform hover:scale-105 hover:shadow-lg"
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
        </div>
      </div>

      {activeTicket === ticketItem._id && (
        <div className="mt-4 bg-gray-50 border border-gray-200 rounded-lg p-4">
          <MessageContainer ticket={ticketItem} />
        </div>
      )}

      <p className="text-red-600 font-bold mt-2">
        <span className="text-xs text-gray-500">Created at: </span>
        {ticketItem.date}
      </p>
    </div>
  );
};

export default StudentTicketTile;
