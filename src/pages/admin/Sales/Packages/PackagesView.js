import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import jsPDF from "jspdf";
import "jspdf-autotable";
import api from "../../../../config/URL";
import toast from "react-hot-toast";
import { FaFilePdf } from "react-icons/fa";
import { BsThreeDotsVertical } from "react-icons/bs";

const PackagesView = () => {
  const { id } = useParams();
  const [data, setData] = useState({
    customerName: "John Doe",
    salesOrder: "SO12345",
    packageSlip: "PS98765",
    packageDate: new Date(),
    internalNotes: "Please deliver on time.",
    invoiceItemsModels: [
      { item: "Item 1", qty: 2, price: 100, disc: 10, taxRate: 5, amount: 190 },
      { item: "Item 2", qty: 1, price: 200, disc: 20, taxRate: 10, amount: 180 },
    ],
    subTotal: 370,
    totalTax: 15,
    total: 385,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getData = async () => {
      setLoading(true);
      try {
        const response = await api.get(`/getPackagesById/${id}`);
        // setData(response.data);
      } catch (e) {
        toast.error("Error fetching data: ", e?.response?.data?.message);
      } finally {
        setLoading(false);
      }
    };
    setLoading(false); 
    getData();
  }, [id]);

  const generatePDF = () => {
    const doc = new jsPDF();

    // Add title to the PDF
    doc.setFontSize(18);
    doc.text("View Packages", 14, 20);

    // Add customer details
    doc.setFontSize(12);
    doc.text(`Customer Name: ${data.customerName || ""}`, 14, 30);
    doc.text(`Sales Order: ${data.salesOrder || ""}`, 14, 40);
    doc.text(`Package Slip: ${data.packageSlip || ""}`, 14, 50);
    doc.text(
      `Package Date: ${data.packageDate ? new Date(data.packageDate).toLocaleDateString() : ""}`,
      14,
      60
    );
    doc.text(`Internal Notes: ${data.internalNotes || ""}`, 14, 70);

    // Add table data using autoTable
    if (data.invoiceItemsModels && data.invoiceItemsModels.length > 0) {
      const tableColumn = ["S.No", "Item Details", "Quantity", "Rate", "Discount", "Tax", "Amount"];
      const tableRows = [];

      data.invoiceItemsModels.forEach((item, index) => {
        const rowData = [
          index + 1,
          item.item || "",
          item.qty || "",
          item.price || "",
          item.disc || "",
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

    // Add the summary section
    doc.text(`Sub Total: ${data.subTotal || ""}`, 14, doc.previousAutoTable.finalY + 10);
    doc.text(`Total Tax: ${data.totalTax || ""}`, 14, doc.previousAutoTable.finalY + 20);
    doc.text(`Total (₹): ${data.total || ""}`, 14, doc.previousAutoTable.finalY + 30);

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
      printWindow.onload = () => {
        printWindow.print();
      };
    }
  };

  return (
    <div>
      {loading ? (
        <div className="loader-container">
          <div className="Loader-Div">
            <svg id="triangle" width="50px" height="50px" viewBox="-3 -4 39 39">
              <polygon
                fill="transparent"
                stroke="blue"
                strokeWidth="1.3"
                points="16,0 32,32 0,32"
              ></polygon>
            </svg>
          </div>
        </div>
      ) : (
        <div className="container-fluid py-4">
            <div className="card shadow border-0 mb-2 top-header p-4" style={{ borderRadius: "0" }}>
              <div className="row align-items-center">
                <div className="col">
                  <div className="d-flex align-items-center gap-4">
                    <h1 className="h4 ls-tight headingColor">View Packages</h1>
                  </div>
                </div>
                <div className="col-auto d-flex gap-4">
                <div className="hstack gap-2 justify-content-start">
                    <Link to="/packages">
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
                        <ul className="dropdown-menu" aria-labelledby="pdfDropdown">
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
            
          <div className="card shadow border-0 mb-2 minHeight" style={{ borderRadius: "0" }}>
            <div className="container-fluid">
              <div className="table-responsive my-5">
                <h3 className="text-light p-2" style={{ background: "#4066D5" }}>Item Table</h3>
                <table className="table">
                  <thead className="thead-light">
                    <tr>
                      <th>S.NO</th>
                      <th>ITEM DETAILS</th>
                      <th>QUANTITY</th>
                      <th>RATE</th>
                      <th>DISCOUNT</th>
                      <th>TAX</th>
                      <th>AMOUNT</th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* {data.invoiceItemsModels && data.invoiceItemsModels.map((item, index) => (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{item.item}</td>
                        <td>{item.qty}</td>
                        <td>{item.price}</td>
                        <td>{item.disc}</td>
                        <td>{item.taxRate}</td>
                        <td>{item.amount}</td>
                      </tr>
                    ))} */}
                  </tbody>
                </table>
              </div>
              <div className="summary-section">
                <p><strong>Sub Total:</strong> {data.subTotal}</p>
                <p><strong>Total Tax:</strong> {data.totalTax}</p>
                <p><strong>Total:</strong> {data.total}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PackagesView;
