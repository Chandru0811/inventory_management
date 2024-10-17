import React, { useEffect, useState } from 'react'
import { Link, useParams } from "react-router-dom";
import api from "../../../config/URL";
import toast from 'react-hot-toast';

const CustomerView = () => {
  const { id } = useParams();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getData = async () => {
      setLoading(true);
      try{
      const response = await api.get(`/getMstrCustomerById/${id}`);
      setData(response.data);
      }catch(e){
        toast.error("Error fetching data: ", e?.response?.data?.message);
      }finally{
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
            <polygon fill="transparent" stroke="blue" stroke-width="1.3" points="16,0 32,32 0,32"></polygon>
        </svg>
    </div>
      </div>
    ) : (
    <div className="container-fluid px-2 minHeight">
      <div className="card shadow border-0 mb-2 top-header">
        <div className="container-fluid py-4">
          
            <div className="row align-items-center">
              <div className="col">
                <div className="d-flex align-items-center gap-4">
                  <h1 className="h4 ls-tight headingColor">View Customer</h1>
                </div>
              </div>
              <div className="col-auto">
                <div className="hstack gap-2 justify-content-start">
                  <Link to="/customer">
                    <button type="submit" className="btn btn-sm btn-light">
                      <span>Back</span>
                    </button>
                  </Link>
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
                    <b>Customer Name</b>
                  </p>
                </div>
                <div className="col-6">
                  <p className="text-muted text-sm">: {data.contactName || ""}</p>
                </div>
              </div>
            </div>
            <div className="col-md-6 col-12">
              <div className="row mb-3">
                <div className="col-6 d-flex justify-content-start align-items-center">
                  <p className="text-sm">
                    <b>Account Number </b>
                  </p>
                </div>
                <div className="col-6">
                  <p className="text-muted text-sm">: {data.accNumber || ""}</p>
                </div>
              </div>
            </div>
            <div className="col-md-6 col-12">
              <div className="row mb-3">
                <div className="col-6 d-flex justify-content-start align-items-center">
                  <p className="text-sm">
                    <b>Primary Contact</b>
                  </p>
                </div>
                <div className="col-6">
                  <p className="text-muted text-sm">: {data.primaryContact || ""}</p>
                </div>
              </div>
            </div>
            <div className="col-md-6 col-12">
              <div className="row mb-3">
                <div className="col-6 d-flex justify-content-start align-items-center">
                  <p className="text-sm">
                    <b>Customer Email </b>
                  </p>
                </div>
                <div className="col-6">
                  <p className="text-muted text-sm">: {data.email || ""}</p>
                </div>
              </div>
            </div>
            <div className="col-md-6 col-12">
              <div className="row mb-3">
                <div className="col-6 d-flex justify-content-start align-items-center">
                  <p className="text-sm">
                    <b>Customer Phone</b>
                  </p>
                </div>
                <div className="col-6">
                  <p className="text-muted text-sm">: {data.phone || ""}</p>
                </div>
              </div>
            </div>

            <div className="col-md-6 col-12">
              <div className="row mb-3">
                <div className="col-6 d-flex justify-content-start align-items-center">
                  <p className="text-sm">
                    <b>Website</b>
                  </p>
                </div>
                <div className="col-6">
                  <p className="text-muted text-sm">: {data.website || ""}</p>
                </div>
              </div>
            </div>
            <div className="col-md-6 col-12">
              <div className="row mb-3">
                <div className="col-6 d-flex justify-content-start align-items-center">
                  <p className="text-sm">
                    <b>Bank Name</b>
                  </p>
                </div>
                <div className="col-6">
                  <p className="text-muted text-sm">: {data.bankAccName || ""}</p>
                </div>
              </div>
            </div>
            <div className="col-md-6 col-12">
              <div className="row mb-3">
                <div className="col-6 d-flex justify-content-start align-items-center">
                  <p className="text-sm">
                    <b>Bank Account Number</b>
                  </p>
                </div>
                <div className="col-6">
                  <p className="text-muted text-sm">: {data.bankAccNumber || ""}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Users Information */}
        <div className="container-fluid fw-bold fs-5 my-2 ms-2">
          Billing Address
         </div>
        <div className="container">
          <div className="row mt-2 p-3">
            <div className="col-md-6 col-12">
              <div className="row mb-3">
                <div className="col-6 d-flex justify-content-start align-items-center">
                  <p className="text-sm">
                    <b>Billing Country</b>
                  </p>
                </div>
                <div className="col-6">
                  <p className="text-muted text-sm">: {data.billCountry || ""}</p>
                </div>
              </div>
            </div>
            <div className="col-md-6 col-12">
              <div className="row mb-3">
                <div className="col-6 d-flex justify-content-start align-items-center">
                  <p className="text-sm">
                    <b>Billing Address </b>
                  </p>
                </div>
                <div className="col-6">
                  <p className="text-muted text-sm">: {data.billAddress || ""}</p>
                </div>
              </div>
            </div>
            <div className="col-md-6 col-12">
              <div className="row mb-3">
                <div className="col-6 d-flex justify-content-start align-items-center">
                  <p className="text-sm">
                    <b>Billing City</b>
                  </p>
                </div>
                <div className="col-6">
                  <p className="text-muted text-sm">: {data.billCity || ""}</p>
                </div>
              </div>
            </div>
            <div className="col-md-6 col-12">
              <div className="row mb-3">
                <div className="col-6 d-flex justify-content-start align-items-center">
                  <p className="text-sm">
                    <b>Billing State</b>
                  </p>
                </div>
                <div className="col-6">
                  <p className="text-muted text-sm">: {data.billState || ""}</p>
                </div>
              </div>
            </div>
            <div className="col-md-6 col-12">
              <div className="row mb-3">
                <div className="col-6 d-flex justify-content-start align-items-center">
                  <p className="text-sm">
                    <b>Billing Zip Code</b>
                  </p>
                </div>
                <div className="col-6">
                  <p className="text-muted text-sm">: {data.billZip || ""}</p>
                </div>
              </div>
            </div>
            <div className="col-md-6 col-12">
              <div className="row mb-3">
                <div className="col-6 d-flex justify-content-start align-items-center">
                  <p className="text-sm">
                    <b>Billing Attention</b>
                  </p>
                </div>
                <div className="col-6">
                  <p className="text-muted text-sm">: {data.billAttention || ""}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="container-fluid fw-bold fs-5 my-2 ms-2">
          Shipping Address
         </div>
        <div className="container">
          <div className="row mt-2 p-3">
            <div className="col-md-6 col-12">
              <div className="row mb-3">
                <div className="col-6 d-flex justify-content-start align-items-center">
                  <p className="text-sm">
                    <b>Shipping Country</b>
                  </p>
                </div>
                <div className="col-6">
                  <p className="text-muted text-sm">: {data.deliCountry || ""}</p>
                </div>
              </div>
            </div>
            <div className="col-md-6 col-12">
              <div className="row mb-3">
                <div className="col-6 d-flex justify-content-start align-items-center">
                  <p className="text-sm">
                    <b>Shipping Address </b>
                  </p>
                </div>
                <div className="col-6">
                  <p className="text-muted text-sm">: {data.deliAddress || ""}</p>
                </div>
              </div>
            </div>
            <div className="col-md-6 col-12">
              <div className="row mb-3">
                <div className="col-6 d-flex justify-content-start align-items-center">
                  <p className="text-sm">
                    <b>Shipping City</b>
                  </p>
                </div>
                <div className="col-6">
                  <p className="text-muted text-sm">: {data.deliCity || ""}</p>
                </div>
              </div>
            </div>
            <div className="col-md-6 col-12">
              <div className="row mb-3">
                <div className="col-6 d-flex justify-content-start align-items-center">
                  <p className="text-sm">
                    <b> Shipping State</b>
                  </p>
                </div>
                <div className="col-6">
                  <p className="text-muted text-sm">: {data.deliState || ""}</p>
                </div>
              </div>
            </div>
            <div className="col-md-6 col-12">
              <div className="row mb-3">
                <div className="col-6 d-flex justify-content-start align-items-center">
                  <p className="text-sm">
                    <b>Shipping Zip Code</b>
                  </p>
                </div>
                <div className="col-6">
                  <p className="text-muted text-sm">: {data.deliZip || ""}</p>
                </div>
              </div>
            </div>
            <div className="col-md-6 col-12">
              <div className="row mb-3">
                <div className="col-6 d-flex justify-content-start align-items-center">
                  <p className="text-sm">
                    <b>Shipping Attention</b>
                  </p>
                </div>
                <div className="col-6">
                  <p className="text-muted text-sm">: {data.deliAttention || ""}</p>
                </div>
              </div>
            </div>

            <div className="col-md-6 col-12">
              <div className="row mb-3">
                <div className="col-6 d-flex justify-content-start align-items-center">
                  <p className="text-sm">
                    <b>Remarks</b>
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
  )
}

export default CustomerView
