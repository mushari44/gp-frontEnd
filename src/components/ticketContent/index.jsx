import { useContext, useEffect, useState } from "react";
import { useLocation } from "react-router-dom"; // Import this to access the current URL
import { GlobalContext } from "../../context";
import StudentTicketTile from "../ticket-tile/student-tile";
import AdviserTicketTile from "../ticket-tile/adviser-tile";
import { useNavigate } from "react-router-dom";

export default function TicketsContents() {
  const { userData, userType, fetchUser, storedId, loading, error, tickets } =
    useContext(GlobalContext);

  const [activeTicket, setActiveTicket] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const location = useLocation();
  const navigate = useNavigate();

  // Fetch user data if not available
  useEffect(() => {
    if (storedId && !userData) {
      fetchUser();
    }
  }, [storedId, userData, fetchUser]);

  // Button click handler for navigation
  const handleNavigation = () => {
    const newPath =
      location.pathname === "/supervisorTickets"
        ? "/tickets"
        : "/supervisorTickets";
    navigate(newPath);
  };

  // Filter tickets based on the current URL and user type
  const filteredTickets = tickets.filter((ticket) => {
    const matchesSearch = Object.values(ticket).some((value) =>
      String(value).toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (!matchesSearch) return false;

    if (location.pathname === "/supervisorTickets") {
      return userType === "student"
        ? userData?.supervisor === ticket?.name
        : ticket?.supervisor === userData?.name;
    } else {
      return userType === "student"
        ? userData?.supervisor !== ticket?.name
        : ticket?.supervisor !== userData?.name;
    }
  });

  // Loading and error states
  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 border-opacity-75"></div>
      </div>
    );

  if (error)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-500 font-semibold text-xl">
          Error: {error.message}
        </div>
      </div>
    );

  return (
    <div className="relative flex flex-col items-center p-6 text-white">
      {/* Cool Modern Button */}
      <button
        className="mb-6 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-purple-600 hover:to-blue-500 text-white font-semibold text-lg rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105 active:scale-95"
        onClick={handleNavigation}
      >
        {location.pathname === "/supervisorTickets"
          ? "Courses Tickets"
          : "Supervisor Tickets"}
      </button>

      <input
        className="w-1/3 bg-gradient-to-r from-gray-100 to-gray-200 text-black text-sm p-3 mb-8 rounded-lg shadow-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="🔍 Search by name, title, course, or date..."
      />

      {filteredTickets.length ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-6 w-full">
          {filteredTickets.map((ticket, index) =>
            userType === "student" ? (
              <StudentTicketTile
                key={index}
                ticketItem={ticket}
                setActiveTicket={setActiveTicket}
                activeTicket={activeTicket}
              />
            ) : (
              <AdviserTicketTile
                key={index}
                ticketItem={ticket}
                setActiveTicket={setActiveTicket}
                activeTicket={activeTicket}
              />
            )
          )}
        </div>
      ) : (
        <div className="min-h-[80vh] flex flex-col items-center justify-center text-center">
          <h1 className="text-gray-800 font-extrabold text-4xl mb-4">
            No Tickets Found
          </h1>
          <p className="text-gray-500 text-lg">Try adjusting your search.</p>
        </div>
      )}
    </div>
  );
}
