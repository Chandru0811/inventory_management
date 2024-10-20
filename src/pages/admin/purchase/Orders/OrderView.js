import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Logo from "../../../../assets/CRMLogo.png";
import api from "../../../../config/URL";
import toast from "react-hot-toast";

function OrderView() {
  const { id } = useParams();
  const [data, setData] = useState([]);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getData = async () => {
      setLoading(true);
      try {
        const response = await api.get(`getAllPurchaseOrderById/${id}`);
        setData(response.data);
      } catch (e) {
        toast.error("Error fetching data: ", e?.response?.data?.message);
      } finally {
        setLoading(false);
      }
    };
    getData();
  }, [id]);

  const itemName = (id) => {
    const name = items.find((item) => item.id == id);
    return name?.itemName;
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
          <div className="card shadow border-0 mb-2 top-header">
            <div className="container-fluid py-4">
              <div className="row align-items-center">
                <div className="row align-items-center">
                  <div className="col">
                    <div className="d-flex align-items-center gap-4">
                      <h1 className="h4 ls-tight headingColor">View Order</h1>
                    </div>
                  </div>
                  <div className="col-auto">
                    <div className="hstack gap-2 justify-content-start">
                      <Link to="/order">
                        <button
                          type="button"
                          className="btn btn-light btn-sm me-1"
                        >
                          <span>Back</span>
                        </button>
                      </Link>
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
                        <b>Delivery Address Category</b>
                      </p>
                    </div>
                    <div className="col-6">
                      <p className="text-muted text-sm">
                        : {data.deliveryAddressCategory || ""}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="col-md-6 col-12">
                  <div className="row mb-3">
                    <div className="col-6 d-flex justify-content-start align-items-center">
                      <p className="text-sm">
                        <b>Delivery Address</b>
                      </p>
                    </div>
                    <div className="col-6">
                      <p className="text-muted text-sm">
                        : {data.deliveryAddress || ""}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="col-md-6 col-12">
                  <div className="row mb-3">
                    <div className="col-6 d-flex justify-content-start align-items-center">
                      <p className="text-sm">
                        <b>Purchase Order</b>
                      </p>
                    </div>
                    <div className="col-6">
                      <p className="text-muted text-sm">
                        : {data.purchaseOrderNumber || ""}
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
                        : {data.purchaseOrderRef || ""}
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
                          ? new Date(data.date).toLocaleDateString()
                          : ""}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="col-md-6 col-12">
                  <div className="row mb-3">
                    <div className="col-6 d-flex justify-content-start align-items-center">
                      <p className="text-sm">
                        <b>Delivery Date</b>
                      </p>
                    </div>
                    <div className="col-6">
                      <p className="text-muted text-sm">
                        :{" "}
                        {data.deliveryDate
                          ? new Date(data.deliveryDate).toLocaleDateString()
                          : ""}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="col-md-6 col-12">
                  <div className="row mb-3">
                    <div className="col-6 d-flex justify-content-start align-items-center">
                      <p className="text-sm">
                        <b>Payment Term</b>
                      </p>
                    </div>
                    <div className="col-6">
                      <p className="text-muted text-sm">
                        : {data.paymentTerm || ""}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="col-md-6 col-12">
                  <div className="row mb-3">
                    <div className="col-6 d-flex justify-content-start align-items-center">
                      <p className="text-sm">
                        <b>Shipment Preference</b>
                      </p>
                    </div>
                    <div className="col-6">
                      <p className="text-muted text-sm">
                        : {data.shipmentPreference || ""}
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
                  <lable className="form-lable">Customer Notes</lable>
                  <div className="mb-3">{data.notes || ""}</div>
                  <lable className="form-lable mt-2">Terms & Conditions</lable>
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

export default OrderView;
