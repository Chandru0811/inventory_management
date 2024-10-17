import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Dashboard from "../pages/admin/Dashboard";
import "../styles/admin.css";
function Admin({ handleLogout }) {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Dashboard handleLogout={handleLogout} />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default Admin;
