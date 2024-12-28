// import React, { useState } from "react";

// const ChatBot = () => {
//   const [messages, setMessages] = useState([]);
//   const [userInput, setUserInput] = useState("");
//   const [isLoading, setIsLoading] = useState(false);

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!userInput.trim()) {
//       alert("Please enter a message.");
//       return;
//     }

//     const userMessage = { type: "user", text: userInput.trim() };
//     setMessages((prevMessages) => [...prevMessages, userMessage]);
//     setUserInput("");
//     setIsLoading(true);

//     try {
//       const response = await fetch("http://127.0.0.1:4000/api/ticket/chatbot", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ message: userMessage.text }),
//       });

//       const data = await response.json();
//       const chatbotMessage = {
//         type: "chatbot",
//         text: data.reply || "Sorry, I couldn't process your request.",
//       };
//       setMessages((prevMessages) => [...prevMessages, chatbotMessage]);
//     } catch (error) {
//       const errorMessage = {
//         type: "chatbot",
//         text: "Sorry, something went wrong. Please try again.",
//       };
//       setMessages((prevMessages) => [...prevMessages, errorMessage]);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex flex-col items-center bg-gray-100 py-10">
//       <div className="w-full max-w-3xl bg-white shadow-lg rounded-lg p-6">
//         <h1 className="text-2xl font-bold text-gray-800 mb-4 text-center">
//           University Advising Chatbot
//         </h1>
//         <form onSubmit={handleSubmit} className="flex items-center gap-3 mb-6">
//           <input
//             type="text"
//             placeholder="Ask me about advisors..."
//             value={userInput}
//             onChange={(e) => setUserInput(e.target.value)}
//             required
//             className="flex-grow px-4 py-3 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//           />
//           <button
//             type="submit"
//             className="bg-blue-600 text-white font-medium px-5 py-3 rounded-md shadow-md hover:bg-blue-700 transition duration-300"
//           >
//             Send
//           </button>
//         </form>
//         <div className="space-y-4">
//           {messages.map((message, index) => (
//             <div
//               key={index}
//               className={`p-4 rounded-lg shadow ${
//                 message.type === "user"
//                   ? "bg-blue-100 text-blue-900 text-right"
//                   : "bg-gray-100 text-gray-900 text-left"
//               }`}
//             >
//               {message.text}
//             </div>
//           ))}
//           {isLoading && (
//             <div className="text-gray-500 italic text-center">
//               Chatbot is typing...
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ChatBot;
