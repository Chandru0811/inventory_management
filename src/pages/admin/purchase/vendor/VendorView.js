import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../../../../config/URL";
import toast from "react-hot-toast";

const VendorView = () => {
  const { id } = useParams();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [rows, setRows] = useState(null);

  useEffect(() => {
    const getData = async () => {
      setLoading(false);
      try {
        const response = await api.get(`/vendorRetrievalWithBank/${id}`);
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
        <div
          className="container-fluid px-2 minHeight"
          style={{ borderRadius: "0" }}
        >
          <div
            className="card shadow border-0 mb-2 top-header sticky-top"
            style={{ borderRadius: "0", top: "66px" }}
          >
            <div className="container-fluid py-4">
              <div className="row align-items-center">
                <div className="col">
                  <div className="d-flex align-items-center gap-4">
                    <h1 className="h4 ls-tight headingColor">View Vendor</h1>
                  </div>
                </div>
                <div className="col-auto">
                  <div className="hstack gap-2 justify-content-start">
                    <Link to="/vendor">
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
            <div className="container">
              <div className="row mt-2 p-3">
                <div className="col-md-6 col-12">
                  <div className="row mb-3">
                    <div className="col-6 d-flex justify-content-start align-items-center">
                      <p className="text-sm">
                        <b>Salutation</b>
                      </p>
                    </div>
                    <div className="col-6">
                      <p className="text-muted text-sm">
                        : {data.salutation || ""}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="col-md-6 col-12">
                  <div className="row mb-3">
                    <div className="col-6 d-flex justify-content-start align-items-center">
                      <p className="text-sm">
                        <b>First Name</b>
                      </p>
                    </div>
                    <div className="col-6">
                      <p className="text-muted text-sm">
                        : {data.firstName || ""}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="col-md-6 col-12">
                  <div className="row mb-3">
                    <div className="col-6 d-flex justify-content-start align-items-center">
                      <p className="text-sm">
                        <b>Last Name </b>
                      </p>
                    </div>
                    <div className="col-6">
                      <p className="text-muted text-sm">
                        : {data.lastName || ""}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="col-md-6 col-12">
                  <div className="row mb-3">
                    <div className="col-6 d-flex justify-content-start align-items-center">
                      <p className="text-sm">
                        <b>Company Name</b>
                      </p>
                    </div>
                    <div className="col-6">
                      <p className="text-muted text-sm">
                        : {data.companyName || ""}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="col-md-6 col-12">
                  <div className="row mb-3">
                    <div className="col-6 d-flex justify-content-start align-items-center">
                      <p className="text-sm">
                        <b>Vendor Display Name </b>
                      </p>
                    </div>
                    <div className="col-6">
                      <p className="text-muted text-sm">
                        : {data.vendorDisplayName || ""}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="col-md-6 col-12">
                  <div className="row mb-3">
                    <div className="col-6 d-flex justify-content-start align-items-center">
                      <p className="text-sm">
                        <b>Vendor Email</b>
                      </p>
                    </div>
                    <div className="col-6">
                      <p className="text-muted text-sm">
                        : {data.vendorEmail || ""}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="col-md-6 col-12">
                  <div className="row mb-3">
                    <div className="col-6 d-flex justify-content-start align-items-center">
                      <p className="text-sm">
                        <b>Vendor Mobile</b>
                      </p>
                    </div>
                    <div className="col-6">
                      <p className="text-muted text-sm">
                        : {data.vendorMobile || ""}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="col-md-6 col-12">
                  <div className="row mb-3">
                    <div className="col-6 d-flex justify-content-start align-items-center">
                      <p className="text-sm">
                        <b>Vendor Phone</b>
                      </p>
                    </div>
                    <div className="col-6">
                      <p className="text-muted text-sm">
                        : {data.vendorPhone || ""}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="col-md-6 col-12">
                  <div className="row mb-3">
                    <div className="col-6 d-flex justify-content-start align-items-center">
                      <p className="text-sm">
                        <b>Pan</b>
                      </p>
                    </div>
                    <div className="col-6">
                      <p className="text-muted text-sm">: {data.pan || ""}</p>
                    </div>
                  </div>
                </div>
                <div className="col-md-6 col-12">
                  <div className="row mb-3">
                    <div className="col-6 d-flex justify-content-start align-items-center">
                      <p className="text-sm">
                        <b>Currency</b>
                      </p>
                    </div>
                    <div className="col-6">
                      <p className="text-muted text-sm">
                        : {data.currency || ""}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="col-md-6 col-12">
                  <div className="row mb-3">
                    <div className="col-6 d-flex justify-content-start align-items-center">
                      <p className="text-sm">
                        <b>Payment Terms</b>
                      </p>
                    </div>
                    <div className="col-6">
                      <p className="text-muted text-sm">
                        : {data.paymentTerms || ""}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="col-md-6 col-12">
                  <div className="row mb-3">
                    <div className="col-6 d-flex justify-content-start align-items-center">
                      <p className="text-sm">
                        <b>Document</b>
                      </p>
                    </div>
                    <div className="col-6">
                      <p className="text-muted text-sm">
                        :{" "}
                        {data.files ? (
                          <img
                            src={data.files}
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
                <div className="col-md-6 col-12">
                  <div className="row mb-3">
                    <div className="col-6 d-flex justify-content-start align-items-center">
                      <p className="text-sm">
                        <b>Department</b>
                      </p>
                    </div>
                    <div className="col-6">
                      <p className="text-muted text-sm">
                        : {data.department || ""}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="col-md-6 col-12">
                  <div className="row mb-3">
                    <div className="col-6 d-flex justify-content-start align-items-center">
                      <p className="text-sm">
                        <b>Designation</b>
                      </p>
                    </div>
                    <div className="col-6">
                      <p className="text-muted text-sm">
                        : {data.designation || ""}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="col-md-6 col-12">
                  <div className="row mb-3">
                    <div className="col-6 d-flex justify-content-start align-items-center">
                      <p className="text-sm">
                        <b>Twitter</b>
                      </p>
                    </div>
                    <div className="col-6">
                      <p className="text-muted text-sm">
                        : {data.twitterUrl || ""}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="col-md-6 col-12">
                  <div className="row mb-3">
                    <div className="col-6 d-flex justify-content-start align-items-center">
                      <p className="text-sm">
                        <b>Skype</b>
                      </p>
                    </div>
                    <div className="col-6">
                      <p className="text-muted text-sm">
                        : {data.skypeName || ""}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="col-md-6 col-12">
                  <div className="row mb-3">
                    <div className="col-6 d-flex justify-content-start align-items-center">
                      <p className="text-sm">
                        <b>Facebook</b>
                      </p>
                    </div>
                    <div className="col-6">
                      <p className="text-muted text-sm">
                        : {data.facebookUrl || ""}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="container">
              <div className="row mt-2 p-3">
                <div className=" col-md-6 col-12">
                  <h4>Billing Address</h4>
                  <div className="col-md-6 col-12 mt-5">
                    <div className="row mb-3">
                      <div className="col-6 d-flex justify-content-start align-items-center">
                        <p className="text-sm">
                          <b>Attention</b>
                        </p>
                      </div>
                      <div className="col-6">
                        <p className="text-muted text-sm">
                          : {data.billingAttention || ""}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6 col-12">
                    <div className="row mb-3">
                      <div className="col-6 d-flex justify-content-start align-items-center">
                        <p className="text-sm">
                          <b>Country/Region</b>
                        </p>
                      </div>
                      <div className="col-6">
                        <p className="text-muted text-sm">
                          : {data.billingCountry || ""}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6 col-12">
                    <div className="row mb-3">
                      <div className="col-6 d-flex justify-content-start align-items-center">
                        <p className="text-sm">
                          <b>Address</b>
                        </p>
                      </div>
                      <div className="col-6">
                        <p className="text-muted text-sm">
                          : {data.billingAddress || ""}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6 col-12">
                    <div className="row mb-3">
                      <div className="col-6 d-flex justify-content-start align-items-center">
                        <p className="text-sm">
                          <b>City</b>
                        </p>
                      </div>
                      <div className="col-6">
                        <p className="text-muted text-sm">
                          : {data.billingCity || ""}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6 col-12">
                    <div className="row mb-3">
                      <div className="col-6 d-flex justify-content-start align-items-center">
                        <p className="text-sm">
                          <b>State</b>
                        </p>
                      </div>
                      <div className="col-6">
                        <p className="text-muted text-sm">
                          : {data.billingState || ""}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="col-md-6 col-12">
                    <div className="row mb-3">
                      <div className="col-6 d-flex justify-content-start align-items-center">
                        <p className="text-sm">
                          <b>Zipcode</b>
                        </p>
                      </div>
                      <div className="col-6">
                        <p className="text-muted text-sm">
                          : {data.billingZipcode || ""}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6 col-12">
                    <div className="row mb-3">
                      <div className="col-6 d-flex justify-content-start align-items-center">
                        <p className="text-sm">
                          <b>Phone</b>
                        </p>
                      </div>
                      <div className="col-6">
                        <p className="text-muted text-sm">
                          : {data.billingPhone || ""}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6 col-12">
                    <div className="row mb-3">
                      <div className="col-6 d-flex justify-content-start align-items-center">
                        <p className="text-sm">
                          <b>Fax Number</b>
                        </p>
                      </div>
                      <div className="col-6">
                        <p className="text-muted text-sm">
                          : {data.billingFax || ""}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className=" col-md-6 col-12">
                  <h4>Shipping Address</h4>
                  <div className="col-md-6 col-12 mt-5">
                    <div className="row mb-3">
                      <div className="col-6 d-flex justify-content-start align-items-center">
                        <p className="text-sm">
                          <b>Attention</b>
                        </p>
                      </div>
                      <div className="col-6">
                        <p className="text-muted text-sm">
                          : {data.shippingAttention || ""}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6 col-12">
                    <div className="row mb-3">
                      <div className="col-6 d-flex justify-content-start align-items-center">
                        <p className="text-sm">
                          <b>Country/Region</b>
                        </p>
                      </div>
                      <div className="col-6">
                        <p className="text-muted text-sm">
                          : {data.shippingCountry || ""}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6 col-12">
                    <div className="row mb-3">
                      <div className="col-6 d-flex justify-content-start align-items-center">
                        <p className="text-sm">
                          <b>Address</b>
                        </p>
                      </div>
                      <div className="col-6">
                        <p className="text-muted text-sm">
                          : {data.shippingAddress || ""}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6 col-12">
                    <div className="row mb-3">
                      <div className="col-6 d-flex justify-content-start align-items-center">
                        <p className="text-sm">
                          <b>City</b>
                        </p>
                      </div>
                      <div className="col-6">
                        <p className="text-muted text-sm">
                          : {data.shippingCity || ""}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6 col-12">
                    <div className="row mb-3">
                      <div className="col-6 d-flex justify-content-start align-items-center">
                        <p className="text-sm">
                          <b>State</b>
                        </p>
                      </div>
                      <div className="col-6">
                        <p className="text-muted text-sm">
                          : {data.shippingState || ""}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="col-md-6 col-12">
                    <div className="row mb-3">
                      <div className="col-6 d-flex justify-content-start align-items-center">
                        <p className="text-sm">
                          <b>Zipcode</b>
                        </p>
                      </div>
                      <div className="col-6">
                        <p className="text-muted text-sm">
                          : {data.shippingZipcode || ""}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6 col-12">
                    <div className="row mb-3">
                      <div className="col-6 d-flex justify-content-start align-items-center">
                        <p className="text-sm">
                          <b>Phone</b>
                        </p>
                      </div>
                      <div className="col-6">
                        <p className="text-muted text-sm">
                          : {data.shippingPhone || ""}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6 col-12">
                    <div className="row mb-3">
                      <div className="col-6 d-flex justify-content-start align-items-center">
                        <p className="text-sm">
                          <b>Fax Number</b>
                        </p>
                      </div>
                      <div className="col-6">
                        <p className="text-muted text-sm">
                          : {data.shippingFax || ""}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="container-fluid">
              <div className="table-responsive mb-3">
                <h3>Contact Persons</h3>
                <table className="table table-bordered mt-4">
                  <thead>
                    <tr>
                      <th>Salutation</th>
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
                    {data?.contacts?.map((person) => (
                      <tr key={person.id}>
                        <td>{person.salutation || ""}</td>
                        <td>{person.vendorFirstName || ""}</td>
                        <td>{person.vendorLastName || ""}</td>
                        <td>{person.vendorEmail || ""}</td>
                        <td>{person.vendorPhone || ""}</td>
                        <td>{person.vendorMobile || ""}</td>
                        <td>{person.skypeName || ""}</td>
                        <td>{person.designation || ""}</td>
                        <td>{person.department || ""}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="container-fluid">
              <div className="mb-3">
                <h3>Bank Details</h3>
                <div className="container">
                  <div className="row mt-2 p-3">
                    {data.bankDetails?.map((bankDetail, index) => (
                      <div key={index} className="col-md-6 col-12">
                        <h5 className="text-primary my-3">Bank {index + 1}</h5>
                        {/* Heading for each bank */}
                        <div className="row mb-3">
                          <div className="col-6 d-flex justify-content-start align-items-center">
                            <p className="text-sm">
                              <b>Account Holder Name</b>
                            </p>
                          </div>
                          <div className="col-6">
                            <p className="text-muted text-sm">
                              : {bankDetail.accountHolderName || ""}
                            </p>
                          </div>
                        </div>
                        <div className="row mb-3">
                          <div className="col-6 d-flex justify-content-start align-items-center">
                            <p className="text-sm">
                              <b>Bank Name</b>
                            </p>
                          </div>
                          <div className="col-6">
                            <p className="text-muted text-sm">
                              : {bankDetail.bankName || ""}
                            </p>
                          </div>
                        </div>
                        <div className="row mb-3">
                          <div className="col-6 d-flex justify-content-start align-items-center">
                            <p className="text-sm">
                              <b>Account Number</b>
                            </p>
                          </div>
                          <div className="col-6">
                            <p className="text-muted text-sm">
                              : {bankDetail.accountNumber || ""}
                            </p>
                          </div>
                        </div>
                        <div className="row mb-3">
                          <div className="col-6 d-flex justify-content-start align-items-center">
                            <p className="text-sm">
                              <b>Re-enter Account Number</b>
                            </p>
                          </div>
                          <div className="col-6">
                            <p className="text-muted text-sm">
                              : {bankDetail.reAccountNumber || ""}
                            </p>
                          </div>
                        </div>
                        <div className="row mb-3">
                          <div className="col-6 d-flex justify-content-start align-items-center">
                            <p className="text-sm">
                              <b>IFSC</b>
                            </p>
                          </div>
                          <div className="col-6">
                            <p className="text-muted text-sm">
                              : {bankDetail.ifsc || ""}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="container my-5">
              <div className="row mb-3">
                <div className="col-2 d-flex justify-content-start align-items-center">
                  <p className="text-sm">
                    <b>Remarks</b>
                  </p>
                </div>
                <div className="col-10">
                  <p className="text-muted text-sm">: {data.remark || ""}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VendorView;
