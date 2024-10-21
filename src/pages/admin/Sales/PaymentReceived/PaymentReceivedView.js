import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../../../../config/URL";

import toast from "react-hot-toast";

const PaymentReceivedView = () => {
    const { id } = useParams();
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

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
                    <div className="card shadow border-0 mb-2 top-header"
                        style={{ borderRadius: "0" }}>
                        <div className="container-fluid py-4">
                            <div className="row align-items-center">
                                <div className="col">
                                    <div className="d-flex align-items-center gap-4">
                                        <h1 className="h4 ls-tight headingColor">View Payment Received</h1>
                                    </div>
                                </div>
                                <div className="col-auto">
                                    <div className="hstack gap-2 justify-content-start">
                                        <Link to="/paymentreceived">
                                            <button type="submit" className="btn btn-sm btn-light">
                                                <span>Back</span>
                                            </button>
                                        </Link>
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
                                            <p className="text-muted text-sm">: {data.paymentCharges || ""}</p>
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
                                            <p className="text-muted text-sm">: {data.taxDeduction || ""}</p>
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
                                                : {data.attachFile || ""}
                                            </p>
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
                                            <p className="text-muted text-sm">
                                                : {data.notes || ""}
                                            </p>
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
