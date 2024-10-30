import React, { useEffect, useRef, useState } from "react";
import "datatables.net-dt";
import "datatables.net-responsive-dt";
import $ from "jquery";
import { Link } from "react-router-dom";
import { FaPlus } from "react-icons/fa";
import api from "../../../../config/URL";
import DeleteModel from "../../../../components/admin/DeleteModel";

const PaymentReceived = () => {
    const tableRef = useRef(null);
    // const storedScreens = JSON.parse(sessionStorage.getItem("screens") || "{}");
    const [datas, setDatas] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getData = async () => {
            try {
                const response = await api.get("/getAllPaymentDetails");
                setDatas(response.data);
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };
        getData();
    }, []);

    useEffect(() => {
        if (!loading) {
            initializeDataTable();
        }
        return () => {
            destroyDataTable();
        };
    }, [loading]);

    const initializeDataTable = () => {
        if ($.fn.DataTable.isDataTable(tableRef.current)) {
            // DataTable already initialized, no need to initialize again
            return;
        }
        $(tableRef.current).DataTable({
            responsive: true,
        });
    };

    const destroyDataTable = () => {
        const table = $(tableRef.current).DataTable();
        if (table && $.fn.DataTable.isDataTable(tableRef.current)) {
            table.destroy();
        }
    };

    const refreshData = async () => {
        destroyDataTable();
        setLoading(true);
        try {
            const response = await api.get("/getAllPaymentDetails");
            setDatas(response.data);
            initializeDataTable(); // Reinitialize DataTable after successful data update
        } catch (error) {
            console.error("Error refreshing data:", error);
        }
        setLoading(false);
    };

    useEffect(() => {
        const table = $(tableRef.current).DataTable();

        return () => {
            table.destroy();
        };
    }, []);
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
                            <div className="row align-items-center justify-content-between ">
                                <div className="col">
                                    <div className="d-flex align-items-center gap-4">
                                        <h1 className="h4 ls-tight headingColor ">Payment Received</h1>
                                    </div>
                                </div>
                                <div className="col-auto">
                                    <div className="hstack gap-2 justify-content-end">
                                        {/* {/* {/ {storedScreens?.levelCreate && ( /} */}
                                        <Link to="/paymentreceived/add">
                                            <button
                                                type="submit"
                                                className="btn btn-sm btn-button btn-primary"
                                            >
                                                <span cla>
                                                    Add <FaPlus className="pb-1" />
                                                </span>
                                            </button>
                                        </Link>
                                        {/* {/ )} /} */}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* <hr className="removeHrMargin"></hr> */}
                    <div
                        className="card shadow border-0 my-2"
                        style={{ borderRadius: "0" }}
                    >
                        <div className="table-responsive p-2 minHeight">
                            <table ref={tableRef} className="display table ">
                                <thead className="thead-light">
                                    <tr>
                                        <th scope="col" style={{ whiteSpace: "nowrap" }}>
                                            S.NO
                                        </th>
                                        <th scope="col" className="text-center">
                                            CUSTOMER NAME
                                        </th>
                                        <th scope="col" className="text-center">
                                            AMOUNTRECEIVE
                                        </th>
                                        <th scope="col" className="text-center">
                                            DEPOSIT TO
                                        </th>
                                        <th scope="col" className="text-center">
                                            ACTION
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {datas.map((data, index) => (
                                        <tr key={index}>
                                            <td className="text-center">{index + 1}</td>
                                            <td className="text-center">{data.customerName}</td>
                                            <td className="text-center">{data.amountReceive}</td>
                                            <td className="text-center">{data.depositTo}</td>
                                            <td className="text-center">
                                                <div className="gap-2">
                                                    <Link to={`/paymentreceived/view/${data.id}`}>
                                                        <button className="btn btn-light btn-sm  shadow-none border-none">
                                                            View
                                                        </button>
                                                    </Link>
                                                    <Link
                                                        to={`/paymentreceived/edit/${data.id}`}
                                                        className="px-2"
                                                    >
                                                        <button className="btn btn-light  btn-sm shadow-none border-none">
                                                            Edit
                                                        </button>
                                                    </Link>
                                                    <DeleteModel
                                                        onSuccess={refreshData}
                                                        path={`/deletePaymentDetails/${data.id}`}
                                                    />
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div className="card-footer border-0 py-5"></div>
                </div>
            )}
        </div>
    );
};

export default PaymentReceived;
