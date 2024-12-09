import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../../../../config/URL";

import toast from "react-hot-toast";
import { BsThreeDotsVertical } from "react-icons/bs";
import jsPDF from "jspdf";

const PaymentReceivedView = () => {
  const { id } = useParams();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [customerData, setCustomerData] = useState({
    customerName: "John Doe",
    salesOrder: "SO12345",
    packageSlip: "PS98765",
    packageDate: new Date(),
    internalNotes: "Please deliver on time.",
    invoiceItemsModels: [
      {
        date: "09-12-2022",
        invoiceNumber: 2682677594,
        invoiceAmount: 150,
        invoiceDue: 10,
        payment: 100,
      },
    ],
    subAmountExcess: "100",
    subAmountPayment: "120",
    subAmountReceived: "112",
    subAmountRefunded: "0",
  });

  useEffect(() => {
    const getData = async () => {
      setLoading(true);
      try {
        const response = await api.get(`/getAllPaymentDetailsById/${id}`);
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
    doc.text("Shipment", 14, 20);

    // Add customer details
    doc.setFontSize(12);
    doc.text(`Customer Name: ${customerData.customerName || ""}`, 14, 30);
    doc.text(`Sales Order: ${customerData.salesOrder || ""}`, 14, 40);
    doc.text(`Package Slip: ${customerData.packageSlip || ""}`, 14, 50);
    doc.text(
      `Package Date: ${
        customerData.packageDate
          ? new Date(customerData.packageDate).toLocaleDateString()
          : ""
      }`,
      14,
      60
    );
    doc.text(`Internal Notes: ${customerData.internalNotes || ""}`, 14, 70);

    if (
      customerData.invoiceItemsModels &&
      customerData.invoiceItemsModels.length > 0
    ) {
      const tableColumn = [
        "Date",
        "Invoice Number",
        "Invoice Amount",
        "Invoice Due",
        "Payment",
      ];
      const tableRows = [];

      customerData.invoiceItemsModels.forEach((item, index) => {
        const rowData = [
          index + 1,
          item.date || "",
          item.invoiceNumber || "",
          item.invoiceAmount || "",
          item.invoiceDue || "",
          item.payment || "",
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
        <div className="container-fluid px-2 minHeight">
          <div
            className="card shadow border-0 mb-2 top-header sticky-top"
            style={{ borderRadius: "0", top: "66px" }}
          >
            <div className="container-fluid py-4">
              <div className="row align-items-center">
                <div className="col">
                  <div className="d-flex align-items-center gap-4">
                    <h1 className="h4 ls-tight headingColor">
                      View Payment Received
                    </h1>
                  </div>
                </div>
                <div className="col-auto d-flex gap-4">
                  <div className="hstack gap-2 justify-content-start">
                    <Link to="/paymentreceived">
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
                        <b>Customer Name</b>
                      </p>
                    </div>
                    <div className="col-6">
                      <p className="text-muted text-sm">
                        : {data.customerName || ""}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="col-md-6 col-12">
                  <div className="row mb-3">
                    <div className="col-6 d-flex justify-content-start align-items-center">
                      <p className="text-sm">
                        <b>Payment</b>
                      </p>
                    </div>
                    <div className="col-6">
                      <p className="text-muted text-sm">
                        : {data.payment || ""}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="col-md-6 col-12">
                  <div className="row mb-3">
                    <div className="col-6 d-flex justify-content-start align-items-center">
                      <p className="text-sm">
                        <b>Amount Receive</b>
                      </p>
                    </div>
                    <div className="col-6">
                      <p className="text-muted text-sm">
                        : {data.amountReceive || ""}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="col-md-6 col-12">
                  <div className="row mb-3">
                    <div className="col-6 d-flex justify-content-start align-items-center">
                      <p className="text-sm">
                        <b>Payment Charges</b>
                      </p>
                    </div>
                    <div className="col-6">
                      <p className="text-muted text-sm">
                        : {data.paymentCharges || ""}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="col-md-6 col-12">
                  <div className="row mb-3">
                    <div className="col-6 d-flex justify-content-start align-items-center">
                      <p className="text-sm">
                        <b>Tax Deduction</b>
                      </p>
                    </div>
                    <div className="col-6">
                      <p className="text-muted text-sm">
                        : {data.taxDeduction || ""}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="col-md-6 col-12">
                  <div className="row mb-3">
                    <div className="col-6 d-flex justify-content-start align-items-center">
                      <p className="text-sm">
                        <b>Payment Mode</b>
                      </p>
                    </div>
                    <div className="col-6">
                      <p className="text-muted text-sm">
                        : {data.paymentMode || ""}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="col-md-6 col-12">
                  <div className="row mb-3">
                    <div className="col-6 d-flex justify-content-start align-items-center">
                      <p className="text-sm">
                        <b>Deposit To</b>
                      </p>
                    </div>
                    <div className="col-6">
                      <p className="text-muted text-sm">
                        : {data.depositTo || ""}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="col-md-6 col-12">
                  <div className="row mb-3">
                    <div className="col-6 d-flex justify-content-start align-items-center">
                      <p className="text-sm">
                        <b>Reference</b>
                      </p>
                    </div>
                    <div className="col-6">
                      <p className="text-muted text-sm">
                        : {data.reference || ""}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="col-md-6 col-12">
                  <div className="row mb-3">
                    <div className="col-6 d-flex justify-content-start align-items-center">
                      <p className="text-sm">
                        <b>Attach File</b>
                      </p>
                    </div>
                    <div className="col-6">
                      <p className="text-muted text-sm">
                        :{" "}
                        {data.attachFile ? (
                          <img
                            src={data.attachFile}
                            className="img-fluid ms-2 w-100 rounded"
                            alt="Profile Image"
                          />
                        ) : (
                          <></>
                        )}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="row mt-5 flex-nowrap container-fluid">
                  <div className="col-12">
                    <div className="table-responsive">
                      <div>
                        <h3
                          style={{ background: "#4066D5" }}
                          className="text-light p-2"
                        >
                          Item Table
                        </h3>
                      </div>
                      <table className="table">
                        <thead className="thead-light">
                          <tr>
                            <th>date</th>
                            <th>invoice number</th>
                            <th>invoice amount</th>
                            <th>invoice due</th>
                            <th>payment</th>
                          </tr>
                        </thead>
                        <tbody className="table-group">
                          {customerData.invoiceItemsModels &&
                            customerData.invoiceItemsModels.map(
                              (item, index) => (
                                <tr key={index}>
                                  <td>{item.date}</td>
                                  <td>{item.invoiceNumber}</td>
                                  <td>{item.invoiceAmount}</td>
                                  <td>{item.invoiceDue}</td>
                                  <td>{item.payment}</td>
                                </tr>
                              )
                            )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                <div className="row mt-5 container-fluid">
                  <div className="col-md-6 col-12 mb-3 mt-5"></div>
                  <div
                    className="col-md-6 col-12 mt-5 mb-3 rounded"
                    style={{ border: "1px solid lightgrey" }}
                  >
                    <div className="row mb-3 mt-2">
                      <label className="col-sm-4 col-form-label">
                        Amount Received
                      </label>
                      <div className="col-sm-4"></div>
                      <div className="col-sm-4 ">
                        : {customerData.subAmountReceived || ""}
                      </div>
                    </div>
                    <div className="row mb-3">
                      <label className="col-sm-4 col-form-label">
                        Amount used for Payments
                      </label>
                      <div className="col-sm-4"></div>
                      <div className="col-sm-4">
                        : {customerData.subAmountPayment || ""}
                      </div>
                      <div className="col-sm-4 "></div>
                    </div>
                    <div className="row mb-3">
                      <label className="col-sm-4 col-form-label">
                        Amount Refunded
                      </label>
                      <div className="col-sm-4"></div>
                      <div className="col-sm-4">
                        : {customerData.subAmountRefunded || ""}
                      </div>
                      <div className="col-sm-4 "></div>
                    </div>
                    <div className="row mb-3">
                      <label className="col-sm-4 col-form-label">
                        Amount in Excess
                      </label>
                      <div className="col-sm-4"></div>
                      <div className="col-sm-4 ">
                        {" "}
                        : {customerData.subAmountExcess}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-md-6 col-12">
                  <div className="row mb-3">
                    <div className="col-6 d-flex justify-content-start align-items-center">
                      <p className="text-sm">
                        <b>Notes</b>
                      </p>
                    </div>
                    <div className="col-6">
                      <p className="text-muted text-sm">: {data.notes || ""}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentReceivedView;
