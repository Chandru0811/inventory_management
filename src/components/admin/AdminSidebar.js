import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import deals from "../../assets/CRMLogo.png";
import { BsBarChartFill } from "react-icons/bs";
import { BiLogOut, BiSolidCategory } from "react-icons/bi";
import { MdCategory } from "react-icons/md";
import { FaChevronDown, FaChevronRight } from "react-icons/fa";
import { AiOutlineBarChart, AiOutlineShoppingCart } from "react-icons/ai";
import { FiSettings, FiTool } from "react-icons/fi";
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
      className="navbar max-h-screen overflow-y-auto  show navbar-vertical navbar-expand-lg p-0 navbar-light border-bottom border-bottom-lg-0 border-end-lg"
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
          className="nav-logo py-2 px-lg-6 m-0 d-flex align-items-center justify-content-start gap-3"
          to="/"
        >
          <img
            src={deals}
            alt="deals"
            className="img-fluid sidebar-logo rounded-circle "
            style={{
              background: "#fff",
              borderRadius: "5px",
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
              <NavLink className="nav-link" to="/dashboard">
                <BsBarChartFill className="me-2" />
                Home
              </NavLink>
            </li>

            <li className="nav-item">
              <div
                className={`nav-link submenu d-flex justify-content-between align-items-center ${
                  activeSubmenu === "inventory" ? "active" : ""
                }`}
                onClick={() => toggleSubmenu("inventory")}
              >
                <span style={{ cursor: "pointer" }}>
                  <BiSolidCategory className="me-2" />
                  Inventory
                </span>
                {activeSubmenu === "inventory" ? (
                  <FaChevronDown className="chevron-icon" />
                ) : (
                  <FaChevronRight className="chevron-icon" />
                )}
              </div>
              {activeSubmenu === "inventory" && (
                <ul className="list-unstyled navbar-nav ps-3">
                  <li className="nav-item">
                    <NavLink className="nav-link" to="/item">
                      Items
                    </NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink className="nav-link" to="/compositeitem">
                      Composite Items
                    </NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink className="nav-link" to="/itemgroup">
                      Item Groups
                    </NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink className="nav-link" to="/pricelist">
                      Price Lists
                    </NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink className="nav-link" to="/inventoryadjustment">
                      Inventory Adjustments
                    </NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink className="nav-link" to="/transferOrder">
                      Transfer Orders
                    </NavLink>
                  </li>
                </ul>
              )}
            </li>

            <li className="nav-item">
              <div
                className={`nav-link submenu d-flex justify-content-between align-items-center ${
                  activeSubmenu === "sales" ? "active" : ""
                }`}
                onClick={() => toggleSubmenu("sales")}
              >
                <span style={{ cursor: "pointer" }}>
                  <MdCategory className="me-2" />
                  Sales
                </span>
                {activeSubmenu === "sales" ? (
                  <FaChevronDown className="chevron-icon" />
                ) : (
                  <FaChevronRight className="chevron-icon" />
                )}
              </div>
              {activeSubmenu === "sales" && (
                <ul className="list-unstyled navbar-nav ps-3">
                  <li className="nav-item">
                    <NavLink className="nav-link" to="/customers">
                      Customers
                    </NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink className="nav-link" to="/salesorder">
                      Sales Order
                    </NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink className="nav-link" to="/packages">
                      Packages
                    </NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink className="nav-link" to="/shipment">
                      Shipment
                    </NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink className="nav-link" to="/challan">
                      Delivery Challans
                    </NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink className="nav-link" to="/invoice">
                      Invoices
                    </NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink className="nav-link" to="/paymentreceived">
                      Payment Received
                    </NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink className="nav-link" to="/creditnotes">
                      Credit Notes
                    </NavLink>
                  </li>
                </ul>
              )}
            </li>
            <li className="nav-item">
              <div
                className={`nav-link submenu d-flex justify-content-between align-items-center ${
                  activeSubmenu === "purchases" ? "active" : ""
                }`}
                onClick={() => toggleSubmenu("purchases")}
              >
                <span style={{ cursor: "pointer" }}>
                  <AiOutlineShoppingCart className="me-2" />
                  Purchases
                </span>
                {activeSubmenu === "purchases" ? (
                  <FaChevronDown className="chevron-icon" />
                ) : (
                  <FaChevronRight className="chevron-icon" />
                )}
              </div>
              {activeSubmenu === "purchases" && (
                <ul className="list-unstyled navbar-nav ps-3">
                  <li className="nav-item">
                    <NavLink className="nav-link" to="/vendor">
                      Vendors
                    </NavLink>
                  </li>
                  {/* <li className="nav-item">
                    <NavLink className="nav-link" to="/expense">
                      Expense
                    </NavLink>
                  </li> */}
                  <li className="nav-item">
                    <NavLink className="nav-link" to="/order">
                      Purchases Order
                    </NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink className="nav-link" to="/purchasereceive">
                      Purchases Receives
                    </NavLink>
                  </li>

                  <li className="nav-item">
                    <NavLink className="nav-link" to="/bills">
                      Bills
                    </NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink className="nav-link" to="/paymentmade">
                      Payment Made
                    </NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink className="nav-link" to="/vendorcredit">
                      Vendor credit
                    </NavLink>
                  </li>
                </ul>
              )}
            </li>

            <li className="nav-item">
              <div
                className={`nav-link submenu d-flex justify-content-between align-items-center ${
                  activeSubmenu === "integrations" ? "active" : ""
                }`}
                onClick={() => toggleSubmenu("integrations")}
              >
                <span style={{ cursor: "pointer" }}>
                  <FiTool className="me-2" />
                  Integrations
                </span>
                {activeSubmenu === "integrations" ? (
                  <FaChevronDown className="chevron-icon" />
                ) : (
                  <FaChevronRight className="chevron-icon" />
                )}
              </div>
              {activeSubmenu === "integrations" && (
                <ul className="list-unstyled navbar-nav ps-3">
                  <li className="nav-item">
                    <NavLink className="nav-link" to="/warehouse">
                      Warehouses
                    </NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink className="nav-link" to="/brand">
                      Branding
                    </NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink className="nav-link" to="/currency">
                      Currencies
                    </NavLink>
                  </li>
                </ul>
              )}
            </li>
            <li className="nav-item">
              <div
                className={`nav-link submenu d-flex justify-content-between align-items-center ${
                  activeSubmenu === "settings" ? "active" : ""
                }`}
                onClick={() => toggleSubmenu("settings")}
              >
                <span style={{ cursor: "pointer" }}>
                  <FiSettings className="me-2" />
                  Settings
                </span>
                {activeSubmenu === "settings" ? (
                  <FaChevronDown className="chevron-icon" />
                ) : (
                  <FaChevronRight className="chevron-icon" />
                )}
              </div>
              {activeSubmenu === "settings" && (
                <ul className="list-unstyled navbar-nav ps-3">
                  <li className="nav-item">
                    <NavLink className="nav-link" to="/salesPersons">
                      Sales Persons
                    </NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink className="nav-link" to="/tax">
                      Tax
                    </NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink className="nav-link" to="/manufacture">
                      Manufacture
                    </NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink className="nav-link" to="/unit">
                      Unit
                    </NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink className="nav-link" to="/terms">
                      Payment Terms
                    </NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink className="nav-link" to="/reason">
                      Reason
                    </NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink className="nav-link" to="/account">
                      Account
                    </NavLink>
                  </li>
                </ul>
              )}
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
              className="nav-link d-flex justify-content-between"
              onClick={handleLogOutClick}
            >
              {" "}
              Logout
              <BiLogOut />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default AdminSidebar;
