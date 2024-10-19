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
import InventoryAdjustment from "../pages/admin/inventory/Inventoryadjustment/InventoryAdjustment";
import InventoryAdjustmentAdd from "../pages/admin/inventory/Inventoryadjustment/InventoryAdjustmentAdd";
import InventoryAdjustmentEdit from "../pages/admin/inventory/Inventoryadjustment/InventoryAdjustmentEdit";
import InventoryAdjustmentView from "../pages/admin/inventory/Inventoryadjustment/InventoryAdjustmentView";

import Customer from "../pages/admin/Sales/Customers/Customer";
import CustomerAdd from "../pages/admin/Sales/Customers/CustomerAdd";
import CustomerEdit from "../pages/admin/Sales/Customers/CustomerEdit";
import CustomerView from "../pages/admin/Sales/Customers/CustomerView";
import SalesOrder from "../pages/admin/Sales/SalesOrder/SalesOrder";
import SalesOrderAdd from "../pages/admin/Sales/SalesOrder/SalesOrderAdd";
import SalesOrderEdit from "../pages/admin/Sales/SalesOrder/SalesOrderEdit";
import SalesOrderView from "../pages/admin/Sales/SalesOrder/SalesOrderView";
import Packages from "../pages/admin/Sales/Packages/Packages";
import PackagesAdd from "../pages/admin/Sales/Packages/PackagesAdd";
import PackagesEdit from "../pages/admin/Sales/Packages/PackagesEdit";
import PackagesView from "../pages/admin/Sales/Packages/PackagesView";
import Shipment from "../pages/admin/Sales/Shipment/Shipment";
import ShipmentAdd from "../pages/admin/Sales/Shipment/ShipmentAdd";
import ShipmentEdit from "../pages/admin/Sales/Shipment/ShipmentEdit";
import ShipmentView from "../pages/admin/Sales/Shipment/ShipmentView";

import PriceList from "../pages/admin/inventory/pricelist/PriceList";
import PriceListAdd from "../pages/admin/inventory/pricelist/PriceListAdd";
import PriceListEdit from "../pages/admin/inventory/pricelist/PriceListEdit";
import PriceListView from "../pages/admin/inventory/pricelist/PriceListView";
import CompositeItem from "../pages/admin/inventory/compositeitem/CompositeItem";
import CompositeItemAdd from "../pages/admin/inventory/compositeitem/CompositeItemAdd";
import CompositeItemEdit from "../pages/admin/inventory/compositeitem/CompositeItemEdit";
import CompositeItemView from "../pages/admin/inventory/compositeitem/CompositeItemView";
import Vendor from "../pages/admin/purchase/vendor/Vendor";
import VendorAdd from "../pages/admin/purchase/vendor/VendorAdd";
import VendorEdit from "../pages/admin/purchase/vendor/VendorEdit";
import VendorView from "../pages/admin/purchase/vendor/VendorView";
import PurchaseReceive from "../pages/admin/purchase/vendor/Purchasereceives/PurchaseReceive";
import PurchaseReceiveAdd from "../pages/admin/purchase/vendor/Purchasereceives/PurchaseReceiveAdd";
import PurchaseReceiveEdit from "../pages/admin/purchase/vendor/Purchasereceives/PurchaseReceiveEdit";
import PurchaseReceiveView from "../pages/admin/purchase/vendor/Purchasereceives/PurchaseReceiveView";
import Bills from "../pages/admin/purchase/vendor/bills/Bills";
import BillsAdd from "../pages/admin/purchase/vendor/bills/BillsAdd";
import BillsEdit from "../pages/admin/purchase/vendor/bills/BillsEdit";
import BillsView from "../pages/admin/purchase/vendor/bills/BillsView";
import VendorCredit from "../pages/admin/purchase/vendorcredit/VendorCredit";
import VendorCreditAdd from "../pages/admin/purchase/vendorcredit/VendorCreditAdd";
import VendorCreditEdit from "../pages/admin/purchase/vendorcredit/VendorCreditEdit";
import VendorCreditView from "../pages/admin/purchase/vendorcredit/VendorcreditView";
import ChallanAdd from "../pages/admin/Sales/DeliveryChallans/ChallanAdd";
import ChallanView from "../pages/admin/Sales/DeliveryChallans/ChallanView";
import ChallanEdit from "../pages/admin/Sales/DeliveryChallans/ChallanEdit";
import Challan from "../pages/admin/Sales/DeliveryChallans/Challan";
import Order from "../pages/admin/purchase/Orders/Order";
import OrderAdd from "../pages/admin/purchase/Orders/OrderAdd";
import OrderEdit from "../pages/admin/purchase/Orders/OrderEdit";
import OrderView from "../pages/admin/purchase/Orders/OrderView";
import Invoices from "../pages/admin/Sales/Invoices/Invoices";
import InvoicesAdd from "../pages/admin/Sales/Invoices/InvoicesAdd";
import InvoicesEdit from "../pages/admin/Sales/Invoices/InvoicesEdit";
import InvoicesView from "../pages/admin/Sales/Invoices/InvoicesView";
import PaymentReceived from "../pages/admin/Sales/PaymentReceived/PaymentReceived";
import PaymentReceivedAdd from "../pages/admin/Sales/PaymentReceived/PaymentReceivedAdd";
import PaymentReceivedEdit from "../pages/admin/Sales/PaymentReceived/PaymentReceivedEdit";
import PaymentReceivedView from "../pages/admin/Sales/PaymentReceived/PaymentReceivedView";
import CreditNotes from "../pages/admin/Sales/CreditNotes/CreditNotes";
import CreditNotesAdd from "../pages/admin/Sales/CreditNotes/CreditNotesAdd";
import CreditNotesEdit from "../pages/admin/Sales/CreditNotes/CreditNotesEdit";
import CreditNotesView from "../pages/admin/Sales/CreditNotes/CreditNotesView";

import PaymentMade from "../pages/admin/purchase/paymentmade/PaymentMade";
import PaymentMadeAdd from "../pages/admin/purchase/paymentmade/PaymentMadeAdd";
import PaymentMadeEdit from "../pages/admin/purchase/paymentmade/PaymentMadeEdit";
import PaymentMadeView from "../pages/admin/purchase/paymentmade/PaymentMadeView";
import WareHouse from "../pages/admin/integration/warehouse/WareHouse";
import WareHouseAdd from "../pages/admin/integration/warehouse/WareHouseAdd";
import WareHouseEdit from "../pages/admin/integration/warehouse/WareHouseEdit";
import WareHouseView from "../pages/admin/integration/warehouse/WareHouseView";
import Branding from "../pages/admin/integration/warehouse/branding/Branding";
import BrandingAdd from "../pages/admin/integration/warehouse/branding/BrandingAdd";
import BrandingEdit from "../pages/admin/integration/warehouse/branding/BrandingEdit";
import BrandingView from "../pages/admin/integration/warehouse/branding/BrandingView";
import CurrencyAdd from "../pages/admin/integration/currencies/CurrencyAdd";
import Currency from "../pages/admin/integration/currencies/Currency";
import CurrencyEdit from "../pages/admin/integration/currencies/CurrencyEdit";
import CurrencyView from "../pages/admin/integration/currencies/CurrencyView";


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


                  <Route path="/warehouse" element={<WareHouse />} />
                  <Route path="/warehouse/add" element={<WareHouseAdd />} />
                  <Route path="/warehouse/edit" element={<WareHouseEdit />} />
                  <Route path="/warehouse/view" element={<WareHouseView />} />

                  <Route path="/brand" element={<Branding />} />
                  <Route path="/brand/add" element={<BrandingAdd />} />
                  <Route path="/brand/edit" element={<BrandingEdit />} />
                  <Route path="/brand/view" element={<BrandingView />} />

                  <Route path="/currency" element={<Currency />} />
                  <Route path="/currency/add" element={<CurrencyAdd />} />
                  <Route path="/currency/edit" element={<CurrencyEdit />} />
                  <Route path="/currency/view" element={<CurrencyView />} />

                  <Route path="/paymentmade" element={<PaymentMade />} />
                  <Route path="/paymentmade/add" element={<PaymentMadeAdd />} />
                  <Route
                    path="/paymentmade/edit"
                    element={<PaymentMadeEdit />}
                  />
                  <Route
                    path="/paymentmade/view"
                    element={<PaymentMadeView />}
                  />
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

                  {/* Sales */}
                  <Route path="/customers" element={<Customer />} />
                  <Route path="/customers/add" element={<CustomerAdd />} />
                  <Route path="/customers/edit" element={<CustomerEdit />} />
                  <Route path="/customers/view" element={<CustomerView />} />

                  <Route path="/salesorder" element={<SalesOrder />} />
                  <Route path="/salesorder/add" element={<SalesOrderAdd />} />
                  <Route path="/salesorder/edit" element={<SalesOrderEdit />} />
                  <Route path="/salesorder/view" element={<SalesOrderView />} />

                  <Route path="/packages" element={<Packages />} />
                  <Route path="/packages/add" element={<PackagesAdd />} />
                  <Route path="/packages/edit" element={<PackagesEdit />} />
                  <Route path="/packages/view" element={<PackagesView />} />

                  <Route path="/shipment" element={<Shipment />} />
                  <Route path="/shipment/add" element={<ShipmentAdd />} />
                  <Route path="/shipment/edit" element={<ShipmentEdit />} />
                  <Route path="/shipment/view" element={<ShipmentView />} />

                  <Route path="/paymentreceived" element={<PaymentReceived />} />
                  <Route path="/paymentreceived/add" element={<PaymentReceivedAdd />} />
                  <Route path="/paymentreceived/edit" element={<PaymentReceivedEdit />} />
                  <Route path="/paymentreceived/view" element={<PaymentReceivedView />} />

                  <Route path="/creditnotes" element={<CreditNotes />} />
                  <Route path="/creditnotes/add" element={<CreditNotesAdd />} />
                  <Route path="/creditnotes/edit" element={<CreditNotesEdit />} />
                  <Route path="/creditnotes/view" element={<CreditNotesView />} />

                  <Route path="/pricelist" element={<PriceList />} />
                  <Route path="/pricelist/add" element={<PriceListAdd />} />
                  <Route path="/pricelist/edit" element={<PriceListEdit />} />
                  <Route path="/pricelist/view" element={<PriceListView />} />

                  <Route path="/compositeitem" element={<CompositeItem />} />
                  <Route
                    path="/compositeitem/add"
                    element={<CompositeItemAdd />}
                  />
                  <Route
                    path="/compositeitem/edit"
                    element={<CompositeItemEdit />}
                  />
                  <Route
                    path="/compositeitem/view"
                    element={<CompositeItemView />}
                  />

                  <Route path="/vendor" element={<Vendor />} />
                  <Route path="/vendor/add" element={<VendorAdd />} />
                  <Route path="/vendor/edit" element={<VendorEdit />} />
                  <Route path="/vendor/view" element={<VendorView />} />

                  <Route path="/bills" element={<Bills />} />
                  <Route path="/bills/add" element={<BillsAdd />} />
                  <Route path="/bills/edit" element={<BillsEdit />} />
                  <Route path="/bills/view" element={<BillsView />} />

                  <Route path="/vendorcredit" element={<VendorCredit />} />
                  <Route
                    path="/vendorcredit/add"
                    element={<VendorCreditAdd />}
                  />
                  <Route
                    path="/vendorcredit/edit"
                    element={<VendorCreditEdit />}
                  />
                  <Route
                    path="/vendorcredit/view"
                    element={<VendorCreditView />}
                  />

                  <Route
                    path="/purchasereceive"
                    element={<PurchaseReceive />}
                  />
                  <Route
                    path="/purchasereceive/add"
                    element={<PurchaseReceiveAdd />}
                  />
                  <Route
                    path="/purchasereceive/edit"
                    element={<PurchaseReceiveEdit />}
                  />
                  <Route
                    path="/purchasereceive/view"
                    element={<PurchaseReceiveView />}
                  />

                  <Route path="/challan" element={<Challan />} />
                  <Route path="/challan/add" element={<ChallanAdd />} />
                  <Route path="/challan/edit" element={<ChallanEdit />} />
                  <Route path="/challan/view" element={<ChallanView />} />

                  <Route path="/invoice" element={<Invoices />} />
                  <Route path="/invoice/add" element={<InvoicesAdd />} />
                  <Route path="/invoice/edit" element={<InvoicesEdit />} />
                  <Route path="/invoice/view" element={<InvoicesView />} />

                  {/* {/ order /} */}
                  <Route path="/order" element={<Order />} />
                  <Route path="/order/add" element={<OrderAdd />} />
                  <Route path="/order/edit" element={<OrderEdit />} />
                  <Route path="/order/view" element={<OrderView />} />
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
