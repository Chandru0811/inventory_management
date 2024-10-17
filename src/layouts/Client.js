import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "../pages/client/Home";
import "../styles/client.css";
function Client({
  handleLogout,
  handleLogin,
  handleClientLogin,
  isClientLogin,
}) {
  return (
    <div>
      <div>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home handleLogin={handleLogin} />} />
          </Routes>
        </BrowserRouter>
      </div>
    </div>
  );
}

export default Client;
