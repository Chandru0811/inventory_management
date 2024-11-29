import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../../../../config/URL";
import jsPDF from "jspdf";
import { BsThreeDotsVertical } from "react-icons/bs";

function BillsView() {
  const { id } = useParams();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getData = async () => {
      setLoading(true);
      try {
        const response = await api.get(`getBillsById/${id}`);
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
    doc.text(`Vendor Name: ${data.vendorName || ""}`, 14, 30);
    doc.text(`Bill Number: ${data.billNumber || ""}`, 14, 40);
    doc.text(`Order Number: ${data.orderNumber || ""}`, 14, 50);
    doc.text(`Subject: ${data.subject || ""}`, 14, 60);
    doc.text(
      `Bill Date: ${
        data.billDate ? new Date(data.billDate).toLocaleDateString() : ""
      }`,
      14,
      70
    );
    doc.text(
      `Due Date: ${
        data.dueDate ? new Date(data.dueDate).toLocaleDateString() : ""
      }`,
      14,
      80
    );
    doc.text(`Notes: ${data.notes || ""}`, 14, 90);

    // Table
    if (data.billsItemDetailsModels && data.billsItemDetailsModels.length > 0) {
      const tableColumn = [
        "S.No",
        "ITEM",
        "ACCOUNT",
        "QUANTITY",
        "RATE",
        "CUSTOMER DETAILS",
        "AMOUNT",
      ];
      const tableRows = data.billsItemDetailsModels.map((item, index) => [
        String(index + 1),
        String(item.itemId || ""),
        String(item.accountName || ""),
        String(item.quantity || ""),
        String(item.rate || ""),
        String(item.customerDetail || ""),
        String(item.amount || ""),
      ]);

      doc.autoTable({
        startY: 100,
        head: [tableColumn],
        body: tableRows,
        theme: "grid",
      });
    }

    // Totals
    const lastTableY = doc.lastAutoTable ? doc.lastAutoTable.finalY + 10 : 100;
    doc.text(`Sub Total: ${data.subTotal || "N/A"}`, 14, lastTableY);
    doc.text(`Discount: ${data.discount || "N/A"}`, 14, lastTableY + 10);
    doc.text(`Adjustments: ${data.adjustments || "N/A"}`, 14, lastTableY + 20);
    doc.text(`Total: ${data.total || "N/A"}`, 14, lastTableY + 30);

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
            style={{ top: "66px" }}
          >
            <div className="container-fluid py-4">
              <div className="row align-items-center">
                <div className="row align-items-center">
                  <div className="col">
                    <div className="d-flex align-items-center gap-4">
                      <h1 className="h4 ls-tight headingColor">View Bills</h1>
                    </div>
                  </div>
                  <div className="col-auto d-flex gap-4">
                    <div className="hstack gap-2 justify-content-start">
                      <Link to="/bills">
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
          </div>
          <div className="card shadow border-0 mb-2 minHeight">
            <div className="container">
              <div className="row mt-2 p-3">
                <div className="col-md-6 col-12">
                  <div className="row mb-3">
                    <div className="col-6 d-flex justify-content-start align-items-center">
                      <p className="text-sm">
                        <b>Vendor Name</b>
                      </p>
                    </div>
                    <div className="col-6">
                      <p className="text-muted text-sm">
                        : {data.vendorName || ""}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="col-md-6 col-12">
                  <div className="row mb-3">
                    <div className="col-6 d-flex justify-content-start align-items-center">
                      <p className="text-sm">
                        <b>Bill Number</b>
                      </p>
                    </div>
                    <div className="col-6">
                      <p className="text-muted text-sm">
                        : {data.billNumber || ""}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="col-md-6 col-12">
                  <div className="row mb-3">
                    <div className="col-6 d-flex justify-content-start align-items-center">
                      <p className="text-sm">
                        <b>Order Number</b>
                      </p>
                    </div>
                    <div className="col-6">
                      <p className="text-muted text-sm">
                        : {data.orderNumber || ""}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="col-md-6 col-12">
                  <div className="row mb-3">
                    <div className="col-6 d-flex justify-content-start align-items-center">
                      <p className="text-sm">
                        <b>Subject</b>
                      </p>
                    </div>
                    <div className="col-6">
                      <p className="text-muted text-sm">
                        : {data.subject || ""}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="col-md-6 col-12">
                  <div className="row mb-3">
                    <div className="col-6 d-flex justify-content-start align-items-center">
                      <p className="text-sm">
                        <b>Bill Date</b>
                      </p>
                    </div>
                    <div className="col-6">
                      <p className="text-muted text-sm">
                        :{" "}
                        {data.billDate
                          ? new Date(data.billDate).toLocaleDateString()
                          : ""}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="col-md-6 col-12">
                  <div className="row mb-3">
                    <div className="col-6 d-flex justify-content-start align-items-center">
                      <p className="text-sm">
                        <b>Due Date</b>
                      </p>
                    </div>
                    <div className="col-6">
                      <p className="text-muted text-sm">
                        :{" "}
                        {data.dueDate
                          ? new Date(data.dueDate).toLocaleDateString()
                          : ""}
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
                          <th>S.NO</th>
                          <th>ITEM</th>
                          <th>ACCOUNT</th>
                          <th>QUANTITY</th>
                          <th>RATE</th>
                          <th>CUSTOMER DETAILS</th>
                          <th>AMOUNT</th>
                        </tr>
                      </thead>
                      <tbody className="table-group">
                        {data &&
                          data.billsItemDetailsModels &&
                          data.billsItemDetailsModels.map((item, index) => (
                            <tr key={index}>
                              <th scope="row">{index + 1}</th>
                              <td>{item.itemId}</td>
                              <td>{item.accountName}</td>
                              <td>{item.quantity}</td>
                              <td>{item.rate}</td>
                              <td>{item.customerDetail}</td>
                              <td>{item.amount}</td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
              <div class="row mt-5">
                <div className="col-md-6 col-12 mb-3 mt-5">
                  <div className="mb-3">
                    Customer Notes : {data.notes || ""}
                  </div>
                </div>
                <div
                  className="col-md-6 col-12 mt-5 mb-3 rounded"
                  style={{ border: "1px solid lightgrey" }}
                >
                  <div class="row mb-3 mt-2">
                    <label class="col-sm-4 col-form-label">Sub Total</label>
                    <div class="col-sm-4"></div>
                    <div class="col-sm-4 ">: {data.subTotal || ""}</div>
                  </div>
                  <div class="row mb-3 mt-2">
                    <label class="col-sm-4 col-form-label">Discount</label>
                    <div class="col-sm-4"></div>
                    <div class="col-sm-4 ">: {data.discount || ""}</div>
                  </div>
                  <div class="row mb-3">
                    <label class="col-sm-4 col-form-label">Adjustments</label>
                    <div class="col-sm-4"></div>
                    <div class="col-sm-4">: {data.adjustments || ""}</div>
                    <div class="col-sm-4 "></div>
                  </div>
                  <hr></hr>
                  <div class="row mb-3">
                    <label class="col-sm-4 col-form-label">Total ( ₹ )</label>
                    <div class="col-sm-4"></div>
                    <div class="col-sm-4 ">: {data.total}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default BillsView;
