import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import deals from "../../assets/CRMLogo.png";
import { BsBarChartFill } from "react-icons/bs";
import { BiLogOut, BiSolidCategory } from "react-icons/bi";
import { MdCategory } from "react-icons/md";
import { FaChevronDown, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { AiOutlineBarChart, AiOutlineShoppingCart } from "react-icons/ai";
import { FiSettings } from "react-icons/fi";
import { RiFileList3Line } from "react-icons/ri";

function AdminSidebar({ handleLogout }) {
  const navigate = useNavigate();
  const handleLogOutClick = () => {
    handleLogout();
    navigate("/");
  };

  const [activeSubmenu, setActiveSubmenu] = useState(null);

  const toggleSubmenu = (menuName) => {
    setActiveSubmenu((prev) => (prev === menuName ? null : menuName));
  };

  return (
    <nav
      className="navbar show navbar-vertical h-screen navbar-expand-lg p-0 navbar-light border-bottom border-bottom-lg-0 border-end-lg"
      id="navbarVertical"
    >
      <div className="container-fluid">
        <button
          className="navbar-toggler mx-2 p-1"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#sidebarCollapse"
          aria-controls="sidebarCollapse"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <NavLink
          className="nav-logo py-lg-2 px-lg-6 m-0 d-flex align-items-center justify-content-start gap-3"
          to="/"
        >
          <img
            src={deals}
            alt="deals"
            className="img-fluid sidebar-logo rounded-circle"
            style={{
              background: "#fff",
              borderRadius: "5px",
              width: "50px",
              height: "50px",
            }}
          />
          <p className="text-white">Inventory</p>
        </NavLink>
        <div
          className="collapse navbar-collapse sidebar-bg"
          id="sidebarCollapse"
        >
          <ul className="navbar-nav">
            <li className="nav-item">
              <NavLink className="nav-link" to="/">
                <BsBarChartFill className="me-2" />
                Home
              </NavLink>
            </li>

            <li className="nav-item">
              <div
                className="nav-link d-flex justify-content-between align-items-center"
                onClick={() => toggleSubmenu("inventory")}
              >
                <span>
                  <BiSolidCategory className="me-2" />
                  Inventory
                </span>
                {activeSubmenu === "inventory" ? (
                  <FaChevronDown />
                ) : (
                  <FaChevronRight />
                )}
              </div>
              {activeSubmenu === "inventory" && (
                <ul className="list-unstyled ps-3">
                  <li>
                    <NavLink className="nav-link" to="/item">
                      Items
                    </NavLink>
                  </li>
                  <li>
                    <NavLink className="nav-link" to="/itemgroup">
                      Group Items
                    </NavLink>
                  </li>
                  <li>
                    <NavLink className="nav-link" to="/inventoryadjustment">
                      Inventory Adjustment
                    </NavLink>
                  </li>
                </ul>
              )}
            </li>

            <li className="nav-item">
              <div
                className="nav-link d-flex justify-content-between align-items-center"
                onClick={() => toggleSubmenu("sales")}
              >
                <span>
                  <MdCategory className="me-2" />
                  Sales
                </span>
                {activeSubmenu === "sales" ? (
                  <FaChevronDown />
                ) : (
                  <FaChevronRight />
                )}
              </div>
              {activeSubmenu === "sales" && (
                <ul className="list-unstyled ps-3">
                  <li>
                    <NavLink className="nav-link" to="/customers">
                      Customers
                    </NavLink>
                  </li>
                  <li>
                    <NavLink className="nav-link" to="/sales-order">
                      Sales Order
                    </NavLink>
                  </li>
                </ul>
              )}
            </li>
            <li className="nav-item">
              <div
                className="nav-link d-flex justify-content-between align-items-center"
                onClick={() => toggleSubmenu("purchases")}
              >
                <span>
                  <AiOutlineShoppingCart className="me-2" />
                  Purchases
                </span>
                {activeSubmenu === "purchases" ? (
                  <FaChevronDown />
                ) : (
                  <FaChevronRight />
                )}
              </div>
              {activeSubmenu === "purchases" && (
                <ul className="list-unstyled ps-3">
                  <li>
                    <NavLink className="nav-link" to="/vendors">
                      Vendors
                    </NavLink>
                  </li>
                  <li>
                    <NavLink className="nav-link" to="/purchase-order">
                      Purchases Order
                    </NavLink>
                  </li>
                </ul>
              )}
            </li>

            <li className="nav-item">
              <NavLink className="nav-link" to="/integrations">
                <FiSettings className="me-2" />
                Integrations
              </NavLink>
            </li>

            <li className="nav-item">
              <NavLink className="nav-link" to="/reports">
                <AiOutlineBarChart className="me-2" />
                Reports
              </NavLink>
            </li>

            <li className="nav-item">
              <NavLink className="nav-link" to="/documents">
                <RiFileList3Line className="me-2" />
                Documents
              </NavLink>
            </li>
          </ul>
          <div className="mt-auto w-100 mb-4 nav-logo">
            <button
              style={{ width: "100%", color: "#fff" }}
              className="nav-link"
              onClick={handleLogOutClick}
            >
              <BiLogOut />
              &nbsp;&nbsp; Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default AdminSidebar;
