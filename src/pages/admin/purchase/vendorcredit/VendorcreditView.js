import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { IoCloudDownloadSharp } from "react-icons/io5";
import { FaTelegramPlane } from "react-icons/fa";
// import Logo from "../../../assets/AccountsLogo.png";
import toast from "react-hot-toast";
import api from "../../../../config/URL";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { BsThreeDotsVertical } from "react-icons/bs";

function VendorCreditView() {
  const { id } = useParams();
  const [data, setData] = useState([]);
  const [items, setItems] = useState([]);
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
      setLoading(true);
      try {
        const response = await api.get(`getAllVendorCreditsById/${id}`);
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
    doc.text("Vendor Credit", 14, 20);

    // Add customer details
    doc.setFontSize(12);
    doc.text(`Credit Note Number: ${data.creditNoteNum || ""}`, 14, 40);
    doc.text(`Order Number: ${data.orderNumber || ""}`, 14, 50);
    doc.text(
      `Order Credit Date: ${
        data.orderCreditDdate
          ? new Date(data.orderCreditDdate).toLocaleDateString("en-GB")
          : ""
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
                        View Vendor Credit
                      </h1>
                    </div>
                  </div>
                  <div className="col-auto d-flex gap-4">
                    <div className="hstack gap-2 justify-content-start">
                      <Link to="/vendorcredit">
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
          <div
            className="card shadow border-0 mb-2 minHeight"
            style={{ borderRadius: "0" }}
          >
            <div className="container">
              <div className="row">
                <div className="col-md-6 col-12">
                  <div className="d-flex justify-content-center flex-column align-items-start">
                    <div class="d-flex">
                      {/* <img src={Logo} alt=".." className="mt-3" width={130} /> */}
                    </div>
                    <p className="fw-small mt-2">
                      Cloud ECS Infotech Pte Ltd<br></br>
                      Anna Salai<br></br>
                      Chennai - 600002,<br></br>
                      Tamil Nadu
                    </p>
                  </div>
                </div>
                <div className="col-md-6 col-12 d-flex justify-end flex-column align-items-end mt-2">
                  <h1>VENDORCREDIT</h1>
                  <h3>#{data.orderNumber || "#1234"}</h3>
                  {/* <span className="text-muted mt-4">Balance Due</span>
              <h3>₹3000</h3> */}
                </div>
              </div>
              <div className="row mt-5">
                <div className="col-md-6 col-12">
                  <div className="d-flex justify-content-center flex-column align-items-start">
                    <h3>Bill To</h3>
                    <span style={{ color: "#2196f3" }}>Manikandan</span>
                    <p className="fw-small">
                      Purasaiwalkam,<br></br>
                      Chennai - 600002,<br></br>
                      Tamil Nadu
                    </p>
                  </div>
                </div>
                <div className="col-md-6 col-12 text-end">
                  <div className="row mb-2 d-flex justify-content-end align-items-end">
                    <div className="col-6">
                      <p className="text-sm">
                        <b>Order Credit Date</b>
                      </p>
                    </div>
                    <div className="col-6">
                      <p className="text-muted text-sm">
                        :{" "}
                        {data.orderCreditDdate
                          ?.split("T")[0] // Splitting at "T" to remove the time part
                          .split("-")
                          .reverse()
                          .join("-") || ""}
                      </p>
                    </div>
                  </div>

                  <div className="row mb-2 d-flex justify-content-end align-items-end">
                    <div className="col-6">
                      <p className="text-sm">
                        <b>Due Date</b>
                      </p>
                    </div>
                    <div className="col-6">
                      <p className="text-muted text-sm">
                        : {data.dueDate?.split("-").reverse().join("-") || ""}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="row mt-5">
                <div className="col-md-6 col-12">
                  <div className="d-flex justify-content-center flex-column align-items-start">
                    <h3>Subject</h3>
                    <p className="fw-small">
                      Full Stack Developer Training Program
                    </p>
                  </div>
                </div>
              </div>
              <div className="row mt-2 p-3">
                <div className="col-md-6 col-12">
                  <div className="row mb-3">
                    <div className="col-6 d-flex justify-content-start align-items-center">
                      <p className="text-sm">
                        <b>Credit Note Number </b>
                      </p>
                    </div>
                    <div className="col-6">
                      <p className="text-muted text-sm">
                        : {data.creditNoteNum || ""}
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
                        : {data.creditNoteNum || ""}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="col-md-6 col-12">
                  <div className="row mb-3">
                    <div className="col-6 d-flex justify-content-start align-items-center">
                      <p className="text-sm">
                        <b>Vendor Credit File</b>
                      </p>
                    </div>
                    <div className="col-6">
                      <p className="text-muted text-sm">
                        :{" "}
                        {data.vendorCreditsFile ? (
                          <img
                            src={data.vendorCreditsFile}
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
                              <td>{item.disc}</td>
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
                  <lable className="form-lable">
                    Customer Notes : {data.notes}
                  </lable>
                  <div className="mb-3">Thanks For Your Bussiness</div>
                  <lable className="form-lable mt-2">Terms & Conditions</lable>
                  <div className="mb-3">{/* <p>{data.}</p> */}</div>
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
                {/* <div className="col-md-6 col-12"></div>
            <div className="col-md-6 col-12 ">
              <div class="row mt-2">
                <label class="col-sm-4 col-form-label">Payment Made</label>
                <div class="col-sm-4"></div>
                <div class="col-sm-4 text-danger">
                  (-)3,500.00
                </div>
              </div>
            </div>
            <div className="col-md-6 col-12"></div>
            <div className="col-md-6 col-12 mb-3">
              <div class="row mt-2">
                <label class="col-sm-4 col-form-label">Balance Due</label>
                <div class="col-sm-4"></div>
                <div class="col-sm-4 ">
                  ₹3000
                </div>
              </div>
            </div> */}
              </div>
              <div className="col-md-6 col-12 mb-5">
                Authorized Signature _____________________________
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default VendorCreditView;
