import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../../../../config/URL";
import toast from "react-hot-toast";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { BsThreeDotsVertical } from "react-icons/bs";

const InventoryAdjustmentView = () => {
  const { id } = useParams();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [customerData, setCustomerData] = useState({
    invoiceItemsModels: [
      { item: "Item 1", qty: 2, price: 100, disc: 10, taxRate: 5, amount: 190 },
      {
        item: "Item 2",
        qty: 1,
        price: 200,
        disc: 20,
        taxRate: 10,
        amount: 180,
      },
    ],
    subTotal: 370,
    totalTax: 15,
    total: 385,
  });

  useEffect(() => {
    const getData = async () => {
      setLoading(false);
      try {
        const response = await api.get(`/getAllInventoryAdjustmentsById/${id}`);
        setData(response.data);
      } catch (e) {
        toast.error("Error fetching data: ", e?.response?.data?.message);
      } finally {
        setLoading(false);
      }
    };
    getData();
  }, [id]);

  const generatePDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("Inventory Adjustment", 14, 20);

    // Add customer details
    doc.setFontSize(12);
    doc.text(`Mode of Adjustment: ${data.modeOfAdjustment || ""}`, 14, 40);
    doc.text(`Reference Number: ${data.reference_number || ""}`, 14, 50);
    doc.text(
      `Date: ${
        data.date ? new Date(data.date).toLocaleDateString("en-GB") : ""
      }`,
      14,
      60
    );

    if (
      customerData.invoiceItemsModels &&
      customerData.invoiceItemsModels.length > 0
    ) {
      const tableColumn = [
        "S.No",
        "Item Details",
        "Quantity",
        "Rate",
        "Discount",
        "Tax",
        "Amount",
      ];
      const tableRows = [];

      customerData.invoiceItemsModels.forEach((item, index) => {
        const rowData = [
          index + 1,
          item.item || "",
          item.qty || "",
          item.price || "",
          item.discount || "",
          item.taxRate || "",
          item.amount || "",
        ];
        tableRows.push(rowData);
      });

      doc.autoTable({
        startY: 80,
        head: [tableColumn],
        body: tableRows,
        theme: "grid",
      });
    }

    const finalY = doc.lastAutoTable?.finalY || 80;
    doc.text(`Sub Total: ${customerData.subTotal || ""}`, 14, finalY + 10);
    doc.text(`Total Tax: ${customerData.totalTax || ""}`, 14, finalY + 20);
    doc.text(`Total:  ${customerData.total || ""}`, 14, finalY + 30);

    return doc;
  };

  const handlePDFAction = (action) => {
    const doc = generatePDF();

    if (action === "open") {
      const pdfBlob = doc.output("blob");
      const pdfUrl = URL.createObjectURL(pdfBlob);
      window.open(pdfUrl, "_blank");
    } else if (action === "download") {
      doc.save("packages.pdf");
    } else if (action === "print") {
      const pdfBlob = doc.output("blob");
      const pdfUrl = URL.createObjectURL(pdfBlob);
      const printWindow = window.open(pdfUrl);
      if (printWindow) {
        printWindow.onload = () => {
          printWindow.print();
        };
      } else {
        console.error("Unable to open print window.");
      }
    }
  };

  return (
    <div>
      {loading ? (
        <div className="loader-container">
          <div class="Loader-Div">
            <svg id="triangle" width="50px" height="50px" viewBox="-3 -4 39 39">
              <polygon
                fill="transparent"
                stroke="blue"
                stroke-width="1.3"
                points="16,0 32,32 0,32"
              ></polygon>
            </svg>
          </div>
        </div>
      ) : (
        <div className="container-fluid px-2 minHeight" v>
          <div
            className="card shadow border-0 mb-2 top-header sticky-top"
            style={{ borderRadius: "0", top: "66px" }}
          >
            <div className="container-fluid py-4">
              <div className="row align-items-center">
                <div className="col">
                  <div className="d-flex align-items-center gap-4">
                    <h1 className="h4 ls-tight headingColor">
                      View Inventory Adjustment
                    </h1>
                  </div>
                </div>
                <div className="col-auto d-flex gap-4">
                  <div className="hstack gap-2 justify-content-start">
                    <Link to="/inventoryadjustment">
                      <button type="submit" className="btn btn-sm btn-light">
                        <span>Back</span>
                      </button>
                    </Link>
                  </div>
                  <div className="hstack gap-2 justify-content-start">
                    <div className="dropdown">
                      <button
                        className="btn btn-sm btn-light"
                        type="button"
                        id="pdfDropdown"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                      >
                        <BsThreeDotsVertical />
                      </button>
                      <ul
                        className="dropdown-menu"
                        aria-labelledby="pdfDropdown"
                      >
                        <li>
                          <button
                            className="dropdown-item"
                            onClick={() => handlePDFAction("open")}
                          >
                            Open PDF
                          </button>
                        </li>
                        <li>
                          <button
                            className="dropdown-item"
                            onClick={() => handlePDFAction("download")}
                          >
                            Download PDF
                          </button>
                        </li>
                        <li>
                          <button
                            className="dropdown-item"
                            onClick={() => handlePDFAction("print")}
                          >
                            Print PDF
                          </button>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div
            className="card shadow border-0 mb-2 minHeight"
            style={{ borderRadius: "0" }}
          >
            <div className="container">
              <div className="row mt-2 p-3">
                <div className="col-md-6 col-12">
                  <div className="row mb-3">
                    <div className="col-6 d-flex justify-content-start align-items-center">
                      <p className="text-sm">
                        <b>Mode of Adjustment</b>
                      </p>
                    </div>
                    <div className="col-6">
                      <p className="text-muted text-sm">
                        : {data.modeOfAdjustment || ""}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="col-md-6 col-12">
                  <div className="row mb-3">
                    <div className="col-6 d-flex justify-content-start align-items-center">
                      <p className="text-sm">
                        <b>Reference Number </b>
                      </p>
                    </div>
                    <div className="col-6">
                      <p className="text-muted text-sm">
                        : {data.referenceNumber || ""}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="col-md-6 col-12">
                  <div className="row mb-3">
                    <div className="col-6 d-flex justify-content-start align-items-center">
                      <p className="text-sm">
                        <b>Date</b>
                      </p>
                    </div>
                    <div className="col-6">
                      <p className="text-muted text-sm">
                        :{" "}
                        {data.date
                          ? new Date(data.date).toLocaleDateString("en-GB")
                          : ""}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="col-md-6 col-12">
                  <div className="row mb-3">
                    <div className="col-6 d-flex justify-content-start align-items-center">
                      <p className="text-sm">
                        <b>Account</b>
                      </p>
                    </div>
                    <div className="col-6">
                      <p className="text-muted text-sm">
                        : {data.accountId || ""}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="col-md-6 col-12">
                  <div className="row mb-3">
                    <div className="col-6 d-flex justify-content-start align-items-center">
                      <p className="text-sm">
                        <b>Reason</b>
                      </p>
                    </div>
                    <div className="col-6">
                      <p className="text-muted text-sm">
                        : {data.reason || ""}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="col-md-6 col-12">
                  <div className="row mb-3">
                    <div className="col-6 d-flex justify-content-start align-items-center">
                      <p className="text-sm">
                        <b>Descending of Adjustment</b>
                      </p>
                    </div>
                    <div className="col-6">
                      <p className="text-muted text-sm">
                        : {data.descOfAdjustment || ""}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="col-md-6 col-12">
                  <div className="row mb-3">
                    <div className="col-6 d-flex justify-content-start align-items-center">
                      <p className="text-sm">
                        <b>Inventory Adjustment File</b>
                      </p>
                    </div>
                    <div className="col-6">
                      <p className="text-muted text-sm">
                        : {data.inventoryAdjustmentsFile || ""}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="row mt-5 flex-nowrap">
                <div className="col-12">
                  <div className="table-responsive ">
                    <div className="">
                      <h3
                        style={{ background: "#4066D5" }}
                        className="text-light p-2"
                      >
                        Item Table
                      </h3>
                    </div>
                    <table class="table">
                      <thead className="thead-light">
                        <tr>
                          <th>ITEM DETAILS</th>
                          <th>Quantity Available</th>
                          <th>New Quantity on hand</th>
                          <th>Quantity Adjusted</th>
                        </tr>
                      </thead>
                      <tbody className="table-group">
                        {data &&
                          data.quantityAdjustmentItems &&
                          data.quantityAdjustmentItems.map((item, index) => (
                            <tr key={index}>
                              <td>{item.itemName}</td>
                              <td>{item.quantityAvailable}</td>
                              <td>{item.quantityOnHand}</td>
                              <td>{item.quantityAdjusted}</td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
            {/* Users Information */}
          </div>
        </div>
      )}
    </div>
  );
};

export default InventoryAdjustmentView;
