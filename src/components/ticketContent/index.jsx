import { useContext, useEffect, useState } from "react";
import { GlobalContext } from "../../context";
import StudentTicketTile from "../ticket-tile/student-tile";
import AdviserTicketTile from "../ticket-tile/adviser-tile";

export default function TicketsContents() {
  const {
    userData,
    navigate,
    userType,
    fetchUser,
    storedId,
    loading,
    error,
    tickets,
  } = useContext(GlobalContext);
  const [activeTicket, setActiveTicket] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (storedId && !userData) {
      fetchUser();
    }
  }, [storedId, userData, userType]);

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

  const filteredTickets = tickets.filter((ticket) =>
    Object.values(ticket).some((value) => {
      return String(value).toLowerCase().includes(searchQuery.toLowerCase());
    })
  );

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center p-6 text-white">
      <input
        className="w-1/3 bg-gradient-to-r from-gray-100 to-gray-200 text-black text-sm p-3 mb-8 rounded-lg shadow-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="🔍 Search by name, title, course, or date..."
      />

      {filteredTickets.length ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-6 w-full ">
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
