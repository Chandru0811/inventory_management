import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../../../../config/URL";
import toast from "react-hot-toast";

const CustomerView = () => {
  const { id } = useParams();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getData = async () => {
      setLoading(true);
      try {
        const response = await api.get(`/customerRetrievalWithContact/${id}`);
        setData(response.data);
      } catch (e) {
        toast.error("Error fetching data: ", e?.response?.data?.message);
      } finally {
        setLoading(false);
      }
    };
    getData();
  }, [id]);

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
        <div className="container-fluid px-2 minHeight">
          <div
            className="card shadow border-0 mb-2 top-header"
            style={{ borderRadius: "0" }}
          >
            <div className="container-fluid py-4">
              <div className="row align-items-center">
                <div className="col">
                  <div className="d-flex align-items-center gap-4">
                    <h1 className="h4 ls-tight headingColor">View Customer</h1>
                  </div>
                </div>
                <div className="col-auto">
                  <div className="hstack gap-2 justify-content-start">
                    <Link to="/customers">
                      <button type="submit" className="btn btn-sm btn-light">
                        <span>Back</span>
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div
            className="card shadow border-0 mb-2 minHeight"
            style={{ borderRadius: "0" }}
          >
            <div className="row mt-5 container-fluid">
              <div className="col-md-6 col-12">
                <div className="d-flex justify-content-center flex-column align-items-start">
                  <h3>Bill To</h3>
                  <span>
                    {data.salutation || ""} {data.firstName || ""}{" "}
                    {data.lastName || ""}
                  </span>
                  <p className="fw-small">{data.customerType}</p>
                  <p className="fw-small">{data.companyName}</p>
                  <p className="fw-small">{data.customerDisplayName}</p>
                  <p className="fw-small">{data.customerEmail}</p>
                  <p className="fw-small">{data.customerPhoneNumber}</p>
                </div>
              </div>
              <div className="col-md-6 col-12 text-end">
                <div className="row mb-2 d-flex justify-content-end align-items-end">
                  <div className="col-6">
                    <p className="text-sm">
                      <b>Issues Date</b>
                    </p>
                  </div>
                  <div className="col-6">
                    <p className="text-muted text-sm">
                      :{" "}
                      {data.createdDate
                        ?.split("T")[0]
                        ?.split("-")
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
                      :{" "}
                      {data.lastModifiedDate
                        ?.split("T")[0]
                        ?.split("-")
                        .reverse()
                        .join("-") || ""}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="container">
              <div className="row mt-2 p-3">
                <h4>
                  <b>Other Details</b>
                </h4>
                {[
                  { label: "Pan", value: data.pan ? data.pan : "N/A" },
                  { label: "Currency", value: data.currency },
                  { label: "Payment Terms", value: data.paymentTerms },
                  {
                    label: "Price List",
                    value: data.priceList ? data.priceList : "N/A",
                  },
                  {
                    label: "Enable Portal",
                    value: data.enablePortal ? "true" : "false",
                  },
                  { label: "Portal Language", value: data.portalLanguage },
                  { label: "Website URL", value: data.websiteUrl },
                  { label: "Department", value: data.department },
                  { label: "Designation", value: data.designation },
                  { label: "Twitter", value: data.twitterUrl },
                  { label: "Skype", value: data.twitterUrl },
                  { label: "Facebook", value: data.facebookUrl },
                ].map((item, index) => (
                  <div className="col-md-6 col-12" key={index}>
                    <div className="row mb-3">
                      <div className="col-6 d-flex justify-content-start align-items-center">
                        <p className="text-sm">
                          <b>{item.label}</b>
                        </p>
                      </div>
                      <div className="col-6">
                        <p className="text-muted text-sm">
                          : {item.value || ""}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="container">
              <div className="row mt-2 p-3">
                <div className="row text-start py-4">
                  <div className="col-6">
                    <h4>
                      <b>Billing Address </b>
                    </h4>
                  </div>
                  <div className="col-6">
                    <h4>
                      <b>Shipping Address </b>
                    </h4>
                  </div>
                </div>
                {[
                  { label: "Billing Attention", value: data.billingAttention },
                  {
                    label: "Shipping Attention",
                    value: data.shippingAttention,
                  },
                  {
                    label: "Billing Country/Region",
                    value: data.billingCountry,
                  },
                  {
                    label: "Shipping Country/Region",
                    value: data.shippingCountry,
                  },
                  {
                    label: "Billing Address",
                    value: data.billingAddress,
                  },
                  {
                    label: "Shipping Address",
                    value: data.shippingAddress,
                  },
                  {
                    label: "Billing City",
                    value: data.billingCity,
                  },
                  {
                    label: "Shipping City",
                    value: data.shippingCity,
                  },
                  {
                    label: "Billing State",
                    value: data.billingState,
                  },
                  {
                    label: "Shipping State",
                    value: data.shippingState,
                  },
                  {
                    label: "Billing Zipcode",
                    value: data.billingZipcode,
                  },
                  {
                    label: "Shipping Zipcode",
                    value: data.shippingZipcode,
                  },
                  {
                    label: "Billing Phone",
                    value: data.billingPhone,
                  },
                  {
                    label: "Shipping Phone",
                    value: data.shippingPhone,
                  },
                  {
                    label: "Billing Fax Number",
                    value: data.billingFax,
                  },
                  {
                    label: "Shipping Fax Number",
                    value: data.shippingFax,
                  },
                ].map((item, index) => (
                  <div className="col-md-6 col-12" key={index}>
                    <div className="row mb-3">
                      <div className="col-6 d-flex justify-content-start align-items-center">
                        <p className="text-sm">
                          <b>{item.label}</b>
                        </p>
                      </div>
                      <div className="col-6">
                        <p className="text-muted text-sm">
                          : {item.value || ""}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="row mt-5 flex-nowrap container-fluid">
              <div className="col-12">
                <div className="table-responsive">
                  <h3
                    style={{ background: "#4066D5" }}
                    className="text-light p-2"
                  >
                    PERSONAL CONTACTS
                  </h3>
                  <table className="table">
                    <thead className="thead-light">
                      <tr>
                        <th>S.NO</th>
                        <th>salutation</th>
                        <th>First Name</th>
                        <th>Last Name</th>
                        <th>Email Address</th>
                        <th>Work Phone</th>
                        <th>Mobile</th>
                        <th>Skype Name/Number</th>
                        <th>Designation</th>
                        <th>Department</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.contacts?.map((item, index) => (
                        <tr key={index}>
                          <td>{index + 1}</td>
                          <td>{item.salutation}</td>
                          <td>{item.customerFirstName}</td>
                          <td>{item.customerLastName}</td>
                          <td>{item.customerEmail}</td>
                          <td>{item.customerPhone}</td>
                          <td>{item.customerMobile}</td>
                          <td>{item.skypeName}</td>
                          <td>{item.designation}</td>
                          <td>{item.department}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            <div className="row mt-5 container-fluid text-start">
              <div className="col-md-2 col-12">
                <label className="form-label">Remarks Notes :</label>
              </div>
              <div className="col-md-10 col-12">{data.remark || ""}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerView;
