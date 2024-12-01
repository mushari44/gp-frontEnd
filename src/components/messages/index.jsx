import React, {
  useState,
  useEffect,
  useContext,
  useRef,
  useCallback,
} from "react";
import axios from "axios";
import { GlobalContext } from "../../context";

export default function MessageContainer({ ticket }) {
  const { storedId, userType, userData, socket } = useContext(GlobalContext);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const messageEndRef = useRef(null);
  const messageContainerRef = useRef(null);

  // Fetch Messages
  const fetchMessages = useCallback(async () => {
    try {
      const response = await axios.get(
        `https://gp-backend-ikch.onrender.com/api/ticket/messages/${ticket._id}`
      );
      setMessages(response.data);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  }, [ticket._id]);

  // Handle Send Message
  const handleSendMessage = useCallback(
    async (e) => {
      e.preventDefault();
      if (!newMessage.trim()) return;
      const senderName = userData.username;
      const ticketId = ticket._id;
      try {
        // Save the message to the server
        await axios.post(
          `https://gp-backend-ikch.onrender.com/api/ticket/messages/${ticketId}`,
          {
            ReceiverTicketId: ticket.ReceiverTicketId,
            content: newMessage,
            userId: storedId,
            sender: userType,
            receiverName: ticket.name,
            senderName,
          }
        );

        // Emit the message to both rooms (student and adviser)
        socket.emit("newMessage", {
          studentTicketId:
            userType === "student" ? ticket._id : ticket.ReceiverTicketId,
          adviserTicketId:
            userType === "student" ? ticket.ReceiverTicketId : ticket._id,
          newMessage,
        });

        setNewMessage(""); // Clear input after sending
      } catch (error) {
        console.error("Error sending message:", error);
      }
    },
    [newMessage, storedId, ticket, userData, socket, userType]
  );

  // Join and Leave Rooms
  useEffect(() => {
    if (!socket) return;

    const joinRooms = () => {
      const studentTicketId =
        userType === "student" ? ticket._id : ticket.ReceiverTicketId;
      const adviserTicketId =
        userType === "student" ? ticket.ReceiverTicketId : ticket._id;

      socket.emit("joinTicketRoom", { studentTicketId, adviserTicketId });
    };

    joinRooms(); // Join rooms on mount

    socket.on("newMessage", fetchMessages); // Listen for new messages

    return () => {
      const studentTicketId =
        userType === "student" ? ticket._id : ticket.ReceiverTicketId;
      const adviserTicketId =
        userType === "student" ? ticket.ReceiverTicketId : ticket._id;

      socket.emit("leaveTicketRoom", { studentTicketId, adviserTicketId });
      socket.off("newMessage", fetchMessages); // Cleanup the event listener
    };
  }, [socket, ticket._id, ticket.ReceiverTicketId, userType, fetchMessages]);

  // Fetch messages on component mount
  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  // Scroll to bottom
  useEffect(() => {
    if (messageEndRef.current && messageContainerRef.current) {
      messageContainerRef.current.scrollTo({
        top: messageEndRef.current.offsetTop,
        behavior: "smooth",
      });
    }
  }, [messages]);

  return (
    <div className="relative border-2  text-right border-black/20  bg-white/100 rounded-lg  shadow-2xl overflow-hidden flex flex-col h-[70vh] sm:max-h-[70vh] max-h-[55vh] mx-auto w-full max-w-3xl ">
      <div ref={messageContainerRef} className="flex-1 overflow-y-auto p-2 ">
        {messages.map((msg, index) => (
          <div key={index} className="mb-4 ">
            <div
              className={`text-xs mb-1 font-semibold text-black ${
                msg.sender === userType ? "text-right mr-3" : "text-left ml-2"
              }`}
            >
              {msg.senderName}
            </div>
            <div
              className={`flex ${
                msg.sender === userType ? "justify-end" : "justify-start"
              } `}
            >
              <div
                className={`p-3 rounded-lg  text-sm ${
                  msg.sender === userType
                    ? "bg-blue-500 text-white"
                    : "bg-gray-300 text-gray-800"
                }`}
              >
                {msg.content}
                <div
                  className={`text-xs mt-1 ${
                    msg.sender === userType ? "text-blue-200" : "text-gray-600"
                  }`}
                >
                  {new Date(msg.timeStamp).toLocaleDateString() +
                    " " +
                    new Date(msg.timeStamp).toLocaleTimeString()}
                </div>
              </div>
            </div>
          </div>
        ))}
        <div ref={messageEndRef} />
      </div>
      <div className="flex p-2 sm:p-4 bg-gray-200 border-t border-gray-300 w-full ">
        <form onSubmit={(e) => handleSendMessage(e)} className="flex w-full  ">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="flex-grow placeholder:text-sm border w-10/12 border-gray-300 rounded-lg px-4 py-2 mr-2 text-gray-700"
            placeholder="Type a message"
          />
          <button
            onClick={handleSendMessage}
            className="bg-blue-600 text-white text-sm sm:text-base rounded-lg px-2 py-2 sm:px-4 sm:py-2  transition-colors duration-200 hover:bg-blue-700"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
}
