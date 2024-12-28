import React, { useContext } from "react";
import ChatBotIcon from "../assets/chatbot-icon.png";
import { GlobalContext } from "../../../context";
// import ChatBot from "..";

const WelcomeMessage = () => {
  const { setQuery, generateTimestamp } = useContext(GlobalContext);

  // Helper function to detect Arabic text
  const isArabic = (text) => /[\u0600-\u06FF]/.test(text);

  // Welcoming texts and suggestions
  const welcomingText = [
    "Welcome to UniBot, your virtual university advisor! 👋",
    "I’m here to help with anything related to the Computer Science program, your professors, office hours, or even academic projects. You can ask me about:",
    "- Faculty members and their office hours",
    "- Admission criteria and program requirements",
    "- Course information and curriculum",
    "- Student profiles and achievements",
    "- Upcoming events or deadlines",
    "How can I assist you today? Feel free to ask your question!",
  ];

  const suggestions = [
    "When is Dr. Mostafa Ibrahim available for office hours?",
    "Can you tell me about Dr. Mohammed Aljammaz and his courses?",
    "Faculty members details?",
  ];

  // Format the timestamp (example: "12:00 PM" to "12:00 مساءً")

  return (
    <div className="Message-Suggests text-black">
      {/* Icon and Timestamp */}
      <div className="flex items-center space-x-3 mb-2">
        <img src={ChatBotIcon} alt="Siraj icon" className="w-20 h-20" />
        <div>
          <h2 className="text-lg font-semibold text-blue-800">MentorBot</h2>
          <p className="text-sm text-gray-600">{generateTimestamp()}</p>
        </div>
      </div>

      {/* Welcome Message */}
      <div className="bg-blue-600 text-black rounded-md p-4 mb-4">
        {welcomingText.map((line, index) => (
          <p
            className="text-md leading-relaxed mb-2"
            key={index}
            dir={isArabic(line) ? "rtl" : "ltr"}
          >
            {line}
          </p>
        ))}
      </div>

      {/* Suggested Questions */}
      <div className="grid gap-2 text-sm">
        {suggestions.map((suggestion, index) => (
          <button
            key={index}
            className="bg-blue-600 text-black rounded-md p-2 text-left hover:bg-white transition-shadow"
            onClick={() => setQuery(suggestion)}
            dir={isArabic(suggestion) ? "rtl" : "ltr"}
          >
            {suggestion}
          </button>
        ))}
      </div>
    </div>
  );
};

export default WelcomeMessage;
