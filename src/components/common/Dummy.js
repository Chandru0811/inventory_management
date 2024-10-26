import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { IoCloudDownloadSharp } from "react-icons/io5";
import { FaFilePdf, FaTelegramPlane } from "react-icons/fa";
// import Logo from "../../../assets/AccountsLogo.png";
import toast from "react-hot-toast";
import api from "../../../../config/URL";
import jsPDF from "jspdf";
import { BsThreeDotsVertical } from "react-icons/bs";
import "jspdf-autotable";

// import jsPDF from "jspdf";
// import "jspdf-autotable";
// import GeneratePdf from "../../GeneratePdf";

function VendorCreditView() {
  const { id } = useParams();
  const [data, setData] = useState([]);
  const [data1, setData1] = useState({
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
  const [items, setItems] = useState([]);
  const [customerData, setCustomerData] = useState([]);
  const [loading, setLoading] = useState(false);
  console.log("invoice", data);

  useEffect(() => {
    const getData = async () => {
        setLoading(true);
        try {
          const response = await api.get(`invoice/${id}`);
          setData(response.data);
        } catch (e) {
          // toast.error("Error fetching data: ", e?.response?.data?.message);
        } finally {
          setLoading(false);
        }
    };

    getData();
  }, [id]);

  const customer = (id) => {
    const name = customerData.find((item) => item.id === id);
    return name?.contactName;
  };

  const itemName = (id) => {
    const name = items.find((item) => item.id == id);
    return name?.itemName;
  };

  const generatePDF = () => {
    const doc = new jsPDF();
  
    // Add title to the PDF
    doc.setFontSize(18);
    doc.text("View Packages", 14, 20);
  
    // Add customer details
    doc.setFontSize(12);
    doc.text(`Customer Name: ${data1.customerName || ""}`, 14, 30);
    doc.text(`Sales Order: ${data1.salesOrder || ""}`, 14, 40);
    doc.text(`Package Slip: ${data1.packageSlip || ""}`, 14, 50);
    doc.text(
      `Package Date: ${data1.packageDate ? new Date(data1.packageDate).toLocaleDateString() : ""}`,
      14,
      60
    );
    doc.text(`Internal Notes: ${data1.internalNotes || ""}`, 14, 70);
  
    // Check if invoiceItemsModels has valid data
    if (data1.invoiceItemsModels && data1.invoiceItemsModels.length > 0) {
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
    const finalY = doc.lastAutoTable?.finalY || 80; // use default startY if no table was generated
    doc.text(`Sub Total: ${data1.subTotal || ""}`, 14, finalY + 10);
    doc.text(`Total Tax: ${data1.totalTax || ""}`, 14, finalY + 20);
    doc.text(`Total (₹): ${data1.total || ""}`, 14, finalY + 30);
  
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
            className="card shadow border-0 mb-2 top-header"
            style={{ borderRadius: "0" }}
          >
            <div className="container-fluid py-4">
              <div className="row align-items-center">
                <div className="row align-items-center">
                  <div className="col">
                    <div className="d-flex align-items-center gap-4">
                      <h1 className="h4 ls-tight headingColor">
                        View Delivery Challan
                      </h1>
                    </div>
                  </div>
                  <div className="col-auto d-flex gap-4">
                  <div className="hstack gap-2 justify-content-start">
                    <Link to="/challan">
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
            </div>
          </div>
          <div className="card shadow border-0 mb-2 minHeight"
            style={{ borderRadius: "0" }}>
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
                        <b>Delivery Challan</b>
                      </p>
                    </div>
                    <div className="col-6">
                      <p className="text-muted text-sm">
                        : {data.deliveryChallan || ""}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="col-md-6 col-12">
                  <div className="row mb-3">
                    <div className="col-6 d-flex justify-content-start align-items-center">
                      <p className="text-sm">
                        <b>Delivery Challan Date</b>
                      </p>
                    </div>
                    <div className="col-6">
                      <p className="text-muted text-sm">
                        : {data.deliveryChallanDate ? new Date(data.deliveryChallanDate).toLocaleDateString('en-GB') : ""}
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
                          <th>ITEM DETAILS</th>
                          <th>QUANTITY</th>
                          <th>RATE</th>
                          <th>DISCOUNT</th>
                          <th>TAX</th>
                          <th>AMOUNT</th>
                        </tr>
                      </thead>
                      <tbody className="table-group">
                        {data &&
                          data.invoiceItemsModels &&
                          data.invoiceItemsModels.map((item, index) => (
                            <tr key={index}>
                              <th scope="row">{index + 1}</th>
                              <td>{itemName(item.item)}</td>
                              <td>{item.qty}</td>
                              <td>{item.price}</td>
                              <td>{item.discount}</td>
                              <td>{item.taxRate}</td>
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
                  <lable className="form-lable">Customer Notes :</lable>
                  <div className="mb-3">{data.customerNotes || ""}</div>
                  <lable className="form-lable">Terms Condition :</lable>
                  <div className="mb-3">{data.customerNotes || ""}</div>
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
                  <div class="row mb-3">
                    <label class="col-sm-4 col-form-label">Total Tax</label>
                    <div class="col-sm-4"></div>
                    <div class="col-sm-4">: {data.totalTax || ""}</div>
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

export default VendorCreditView;
