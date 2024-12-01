import React, { useContext, useEffect, useState, useRef } from "react";
import axios from "axios";
import { GlobalContext } from "../../../context";
import MessageContainer from "../../messages";
import TimePickerExample from "../../DropDown";

export default function AdviserTicketTile({
  ticketItem,
  setActiveTicket,
  activeTicket,
  availableDurations,
  setAvailableDurations,
}) {
  const [changeTime, setChangeTime] = useState(false);
  const [durationChanged, setDurationChanged] = useState(false);
  const [endSession, setEndSession] = useState(false);
  const [conclusion, setConclusion] = useState("");
  const { storedId, socket } = useContext(GlobalContext);

  // Ref to target the message container
  const messageContainerRef = useRef(null);

  useEffect(() => {
    setDurationChanged(false);
    setChangeTime(false);
    setEndSession(false);
    setConclusion("");
  }, [ticketItem]);

  useEffect(() => {
    if (socket) {
      const handleDurationUpdate = (ticketDetails) => {
        if (ticketItem._id === ticketDetails._id) {
          ticketItem.Duration = ticketDetails.Duration;
          ticketItem.Hour = ticketDetails.Hour;
          ticketItem.Minutes = ticketDetails.Minutes;
          ticketItem.confirmedDuration = true;
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

  const handleSelect = async (Duration) => {
    setChangeTime(false);
    setDurationChanged(true);
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
        "http://127.0.0.1:4000/api/ticket/user/expectedDuration",
        requestBody
      );
      const data = response.data;
      socket.emit("durationUpdated", { data });
    } catch (error) {
      console.log(error);
    }
  };

  const handleConclusionChange = (e) => setConclusion(e.target.value);

  const handleEndSession = async () => {
    try {
      const response = await axios.put(
        "http://127.0.0.1:4000/api/ticket/user/endSession",
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

  const toggleMessages = () => {
    // If the current ticket is already active, close it
    if (activeTicket === ticketItem._id) {
      setActiveTicket(null);
    } else {
      // Open the current ticket and close any others
      setActiveTicket(ticketItem._id);
    }
  };

  useEffect(() => {
    if (activeTicket === ticketItem._id && messageContainerRef.current) {
      setTimeout(() => {
        const elementPosition =
          messageContainerRef.current.getBoundingClientRect().top +
          window.pageYOffset;
        const adjustedPosition = elementPosition - 100; // Subtract 50 pixels

        window.scrollTo({
          top: adjustedPosition,
          behavior: "smooth",
        });
      }, 100); // Delay to ensure DOM updates
    }
  }, [activeTicket, ticketItem._id]);

  return (
    <div className="relative bg-neutral-100 border border-gray-300 rounded-lg shadow-lg p-6 mb-6 w-full max-w-3xl mx-auto hover:shadow-xl transition-transform transform hover:scale-105">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex-1 text-center sm:text-left">
          {changeTime ? (
            <div className="  w-full text-black items-start justify-start flex">
              {/* <DropDown
                handleSelect={handleSelect}
                minutes={availableDurations}
              ></DropDown> */}
              <TimePickerExample title={"From Time"} />
            </div>
          ) : null}
          <h2 className="text-lg font-bold text-gray-800  ">
            Student: {ticketItem.name}
          </h2>
          <p className="text-sm text-gray-600">Title: {ticketItem.title}</p>
          <p className="text-sm text-gray-600">Course: {ticketItem.course}</p>
          <p className="text-sm text-gray-600">
            Time: {formatTime(startHour, startMinute)} -{" "}
            {ticketItem.confirmedDuration
              ? formatTime(endHour, endMinute)
              : "Pending"}
          </p>
          <p className="text-sm text-gray-600">Duration: {duration} minutes</p>
          {ticketItem.conclusion && (
            <div className="w-full">
              <h1 className="text-black">
                Session Conclusion:{" "}
                <span className="font-normal ">{ticketItem.conclusion}</span>
              </h1>
            </div>
          )}
        </div>
        <div className="flex gap-2">
          {!ticketItem.confirmedDuration && !durationChanged && (
            <button
              className="bg-green-500 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-green-600"
              onClick={() => handleSelect(duration)}
            >
              Confirm Duration
            </button>
          )}
          {!ticketItem.confirmedDuration && (
            <button
              className="bg-yellow-500 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-yellow-600"
              onClick={() => setChangeTime((prev) => !prev)}
            >
              Change Time
            </button>
          )}

          {!ticketItem.conclusion ? (
            <button
              className="bg-red-500 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-red-600"
              onClick={() => setEndSession(!endSession)}
            >
              End Session
            </button>
          ) : null}
        </div>
      </div>

      {activeTicket === ticketItem._id && (
        <div
          className="mt-4 bg-gray-50 border border-gray-200 rounded-lg p-4"
          ref={messageContainerRef}
        >
          <MessageContainer ticket={ticketItem} />
        </div>
      )}

      <button
        className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg text-sm font-semibold w-full hover:bg-blue-700"
        onClick={toggleMessages}
      >
        {ticketItem._id === activeTicket ? "Hide Messages" : "Show Messages"}{" "}
      </button>
      <p className="text-red-600  text-xs font-bold mt-2">
        <span className="text-xs text-gray-500">Created at: </span>
        {ticketItem.date}
      </p>
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
