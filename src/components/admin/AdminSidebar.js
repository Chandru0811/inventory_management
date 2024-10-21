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
      className="navbar show navbar-vertical max-h-screen navbar-expand-lg p-0 navbar-light border-bottom border-bottom-lg-0 border-end-lg"
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
                    <NavLink className="nav-link" to="/compositeitem">
                      Composite Items
                    </NavLink>
                  </li>
                  <li>
                    <NavLink className="nav-link" to="/itemgroup">
                      Item Groups
                    </NavLink>
                  </li>
                  <li>
                    <NavLink className="nav-link" to="/pricelist">
                      Price Lists
                    </NavLink>
                  </li>
                  <li>
                    <NavLink className="nav-link" to="/inventoryadjustment">
                      Inventory Adjustments
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
                    <NavLink className="nav-link" to="/salesorder">
                      Sales Order
                    </NavLink>
                  </li>
                  <li>
                    <NavLink className="nav-link" to="/packages">
                      Packages
                    </NavLink>
                  </li>
                  <li>
                    <NavLink className="nav-link" to="/shipment">
                      Shipment
                    </NavLink>
                  </li>
                  <li>
                    <NavLink className="nav-link" to="/paymentreceived">
                      Payment Received
                    </NavLink>
                  </li>
                  <li>
                    <NavLink className="nav-link" to="/creditnotes">
                      Credit Notes
                    </NavLink>
                  </li>
                  <li>
                    <NavLink className="nav-link" to="/challan">
                      Delivery Challans
                    </NavLink>
                  </li>
                  <li>
                    <NavLink className="nav-link" to="/invoice">
                      Invoices
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
                    <NavLink className="nav-link" to="/vendor">
                      Vendors
                    </NavLink>
                  </li>
                  <li>
                    <NavLink className="nav-link" to="/order">
                      Purchases Order
                    </NavLink>
                  </li>
                  <li>
                    <NavLink className="nav-link" to="/purchasereceive">
                      Purchases Receives
                    </NavLink>
                  </li>

                  <li>
                    <NavLink className="nav-link" to="/bills">
                      Bills
                    </NavLink>
                  </li>
                  <li>
                    <NavLink className="nav-link" to="/vendorcredit">
                      Vendor credit
                    </NavLink>
                  </li>
                  <li>
                    <NavLink className="nav-link" to="/paymentmade">
                      Payment Made
                    </NavLink>
                  </li>
                </ul>
              )}
            </li>

            <li className="nav-item">
              <div
                className="nav-link d-flex justify-content-between align-items-center"
                onClick={() => toggleSubmenu("integrations")}
              >
                <span>
                  <FiSettings className="me-2" />
                  Integrations
                </span>
                {activeSubmenu === "integrations" ? (
                  <FaChevronDown />
                ) : (
                  <FaChevronRight />
                )}
              </div>
              {activeSubmenu === "integrations" && (
                <ul className="list-unstyled ps-3">
                  <li>
                    <NavLink className="nav-link" to="/warehouse">
                      Warehouses
                    </NavLink>
                  </li>
                  <li>
                    <NavLink className="nav-link" to="/brand">
                      Branding
                    </NavLink>
                  </li>
                  <li>
                    <NavLink className="nav-link" to="/currency">
                      Currencies
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
