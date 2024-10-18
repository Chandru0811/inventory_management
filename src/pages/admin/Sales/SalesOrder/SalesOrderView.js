import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../../../../config/URL";

import toast from "react-hot-toast";

const SalesOrderView = () => {
    const { id } = useParams();
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getData = async () => {
            setLoading(true);
            try {
                const response = await api.get(`/getAllSalesOrdersById/${id}`);
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
                    <div className="card shadow border-0 mb-2 top-header">
                        <div className="container-fluid py-4">
                            <div className="row align-items-center">
                                <div className="col">
                                    <div className="d-flex align-items-center gap-4">
                                        <h1 className="h4 ls-tight headingColor">View Sales Order</h1>
                                    </div>
                                </div>
                                <div className="col-auto">
                                    <div className="hstack gap-2 justify-content-start">
                                        <Link to="/salesorder">
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
                                                <b>Sales Order</b>
                                            </p>
                                        </div>
                                        <div className="col-6">
                                            <p className="text-muted text-sm">
                                                : {data.salesOrder || ""}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-6 col-12">
                                    <div className="row mb-3">
                                        <div className="col-6 d-flex justify-content-start align-items-center">
                                            <p className="text-sm">
                                                <b>Reference Number</b>
                                            </p>
                                        </div>
                                        <div className="col-6">
                                            <p className="text-muted text-sm">
                                                : {data.referenceNumber || ""}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-6 col-12">
                                    <div className="row mb-3">
                                        <div className="col-6 d-flex justify-content-start align-items-center">
                                            <p className="text-sm">
                                                <b>SalesOrder Date</b>
                                            </p>
                                        </div>
                                        <div className="col-6">
                                            <p className="text-muted text-sm">: {data.salesOrderDate || ""}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-6 col-12">
                                    <div className="row mb-3">
                                        <div className="col-6 d-flex justify-content-start align-items-center">
                                            <p className="text-sm">
                                                <b>Expected Shipment Date</b>
                                            </p>
                                        </div>
                                        <div className="col-6">
                                            <p className="text-muted text-sm">: {data.expectedShipmentDate || ""}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="col-md-6 col-12">
                                    <div className="row mb-3">
                                        <div className="col-6 d-flex justify-content-start align-items-center">
                                            <p className="text-sm">
                                                <b>Payment Terms Id</b>
                                            </p>
                                        </div>
                                        <div className="col-6">
                                            <p className="text-muted text-sm">
                                                : {data.paymentTermsId || ""}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-6 col-12">
                                    <div className="row mb-3">
                                        <div className="col-6 d-flex justify-content-start align-items-center">
                                            <p className="text-sm">
                                                <b>Delivery Method</b>
                                            </p>
                                        </div>
                                        <div className="col-6">
                                            <p className="text-muted text-sm">
                                                : {data.deliveryMethod || ""}
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
                                
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SalesOrderView;
