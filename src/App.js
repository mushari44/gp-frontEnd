import React from "react";
import { Route, Routes } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import Tickets from "./pages/tickets";
import CreateTicket from "./pages/createTicket";
import NavBar from "./components/NavBar";
import Home from "./pages/home";

function App() {
  return (
    <div>
      <NavBar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/tickets" element={<Tickets />} />
        <Route path="/createTicket" element={<CreateTicket />} />
      </Routes>
    </div>
  );
}

export default App;
