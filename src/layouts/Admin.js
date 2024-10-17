import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Dashboard from "../pages/admin/Dashboard";
import "../styles/admin.css";
import "../styles/admincdn.css";
import AdminSidebar from "../components/admin/AdminSidebar";
import AdminHeader from "../components/admin/AdminHeader";
function Admin({ handleLogout }) {
  return (
    <div>
    <BrowserRouter>
          <div className="d-flex flex-column flex-lg-row bg-surface-secondary">
            <AdminSidebar handleLogout={handleLogout} />
            <div className="flex-grow-1 h-screen overflow-y-auto">
              <AdminHeader />
              <main className="pt-3 bg-surface-secondary">
                <div style={{ minHeight: "90vh" }}>
                  <Routes>
                    <Route path="/" element={<Dashboard />} />
                  </Routes>
                </div>
              </main>
            </div>
          </div>
        </BrowserRouter>
    </div>
  );
}

export default Admin;
