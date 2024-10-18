import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "../pages/client/Home";
import "../styles/client.css";
import Register from "../pages/client/Register";
import ForgotPage from "../pages/client/ForgoPage";
import ForgotSuccess from "../pages/client/ForgotSuccess";
import ResetPage from "../pages/client/ResetPage";
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
            <Route path="*" element={<Home handleLogin={handleLogin} />} />
            <Route path="/forgotsuccess" element={<ForgotSuccess />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot" element={<ForgotPage />} />
            <Route path="/resetpassword" element={<ResetPage />} />
          </Routes>
        </BrowserRouter>
      </div>
    </div>
  );
}

export default Client;
