import React from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import Tickets from "./pages/tickets";
import CreateTicket from "./pages/createTicket";
import NavBar from "./components/NavBar";
import Home from "./pages/home";
import Profile from "./pages/profile";

function App() {
  const location = useLocation(); // Get the current location (URL path)

  // Check if the current route is `/profile`
  const hideNavBar = location.pathname === "/profile";

  return (
    <div>
      {!hideNavBar && <NavBar />} {/* Conditionally render NavBar */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/tickets" element={<Tickets />} />
        <Route path="/createTicket" element={<CreateTicket />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </div>
  );
}

export default App;
