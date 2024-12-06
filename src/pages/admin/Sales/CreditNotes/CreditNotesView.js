import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../../../../config/URL";
import { BsThreeDotsVertical } from "react-icons/bs";
import jsPDF from "jspdf";

function CreditNotesView() {
  const { id } = useParams();
  const [data, setData] = useState([]);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [customerData, setCustomerData] = useState({
    customerName: "John Doe",
    salesOrder: "SO12345",
    packageSlip: "PS98765",
    packageDate: new Date(),
    internalNotes: "Please deliver on time.",
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
      setLoading(true);
      try {
        const response = await api.get(`/getAllCreditNotesById/${id}`);
        setData(response.data);
      } catch (e) {
        toast.error("Error fetching data: ", e?.response?.data?.message);
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
                        View Credit Notes
                      </h1>
                    </div>
                  </div>
                  <div className="col-auto d-flex gap-4">
                    <div className="hstack gap-2 justify-content-start">
                      <Link to="/creditnotes">
                        <button
                          type="submit"
                          className="btn btn-light btn-sm me-1"
                        >
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
                        <b>Credit Note</b>
                      </p>
                    </div>
                    <div className="col-6">
                      <p className="text-muted text-sm">
                        : {data.creditNote || ""}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="col-md-6 col-12">
                  <div className="row mb-3">
                    <div className="col-6 d-flex justify-content-start align-items-center">
                      <p className="text-sm">
                        <b>Sales Person</b>
                      </p>
                    </div>
                    <div className="col-6">
                      <p className="text-muted text-sm">
                        : {data.salesPerson || ""}
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
                        <b>Credit Note Date</b>
                      </p>
                    </div>
                    <div className="col-6">
                      <p className="text-muted text-sm">
                        :{" "}
                        {data.creditNoteDate
                          ? new Date(data.creditNoteDate).toLocaleDateString(
                              "en-GB"
                            )
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
                          <th>ITEM DETAILS</th>
                          <th>Account</th>
                          <th>QUANTITY</th>
                          <th>RATE</th>
                          <th>DISCOUNT</th>
                          <th>AMOUNT</th>
                        </tr>
                      </thead>
                      <tbody className="table-group">
                        {data &&
                          data.creditNotesItmDetModels &&
                          data.creditNotesItmDetModels?.map((item, index) => (
                            <tr key={index}>
                              <th scope="row">{index + 1}</th>
                              {/* <td>{itemName(item.item)}</td> */}
                              <td>{item.itemName}</td>
                              <td>{item.accountName}</td>
                              <td>{item.quantity}</td>
                              <td>{item.rate}</td>
                              <td>{item.discount}</td>
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
                  <div className="mb-3">{data.termsCondition || ""}</div>
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
                    <label class="col-sm-4 col-form-label">Adjustment</label>
                    <div class="col-sm-4"></div>
                    <div class="col-sm-4">: {data.adjustment || ""}</div>
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

export default CreditNotesView;
