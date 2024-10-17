import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Dashboard from "../pages/admin/Dashboard";
import "../styles/admin.css";
import "../styles/admincdn.css";
import AdminSidebar from "../components/admin/AdminSidebar";
import AdminHeader from "../components/admin/AdminHeader";
import Items from "../pages/admin/inventory/items/Items";
import ItemsAdd from "../pages/admin/inventory/items/ItemsAdd";
import ItemsEdit from "../pages/admin/inventory/items/ItemsEdit";
import ItemsView from "../pages/admin/inventory/items/ItemsView";
import ItemGroup from "../pages/admin/Itemgroup/ItemGroup";
import ItemGroupAdd from "../pages/admin/Itemgroup/ItemGroupAdd";
import ItemGroupEdit from "../pages/admin/Itemgroup/ItemGroupEdit";
import ItemGroupView from "../pages/admin/Itemgroup/ItemGroupView";
import Customers from "../pages/admin/Customers/Customer";
import CustomerAdd from "../pages/admin/Customers/CustomerAdd";
import CustomerEdit from "../pages/admin/Customers/CustomerEdit";
import CustomerView from "../pages/admin/Customers/CustomerView";
import InventoryAdjustment from "../pages/admin/inventory/Inventoryadjustment/InventoryAdjustment";
import InventoryAdjustmentAdd from "../pages/admin/inventory/Inventoryadjustment/InventoryAdjustmentAdd";
import InventoryAdjustmentEdit from "../pages/admin/inventory/Inventoryadjustment/InventoryAdjustmentEdit";
import InventoryAdjustmentView from "../pages/admin/inventory/Inventoryadjustment/InventoryAdjustmentView";
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
                  <Route path="/item" element={<Items />} />
                  <Route path="/item/add" element={<ItemsAdd />} />
                  <Route path="/item/edit" element={<ItemsEdit />} />
                  <Route path="/item/view" element={<ItemsView />} />

                  <Route path="/itemgroup" element={<ItemGroup />} />
                  <Route path="/itemgroup/add" element={<ItemGroupAdd />} />
                  <Route path="/itemgroup/edit" element={<ItemGroupEdit />} />
                  <Route path="/itemgroup/view" element={<ItemGroupView />} />

                  <Route
                    path="/inventoryadjustment"
                    element={<InventoryAdjustment />}
                  />
                  <Route
                    path="/inventoryadjustment/add"
                    element={<InventoryAdjustmentAdd />}
                  />
                  <Route
                    path="/inventoryadjustment/edit"
                    element={<InventoryAdjustmentEdit />}
                  />
                  <Route
                    path="/inventoryadjustment/view"
                    element={<InventoryAdjustmentView />}
                  />

                  <Route path="/customers" element={<Customers />} />
                  <Route path="/customer/add" element={<CustomerAdd />} />
                  <Route path="/customer/edit/id" element={<CustomerEdit />} />
                  <Route path="/customer/view/id" element={<CustomerView />} />
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
