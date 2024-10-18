import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import api from "../../../../config/URL";
import toast from "react-hot-toast";

const SalesOrderEdit = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoadIndicator] = useState(false);

    const validationSchema = Yup.object({
        customerName: Yup.string().required("*Customer Name is required"),
        salesOrder: Yup.string().required("*Sales Order is required"),
        referenceNumber: Yup.string().required("*Reference Number is required"),
        salesOrderDate: Yup.string().required("*Sales Order Date is required"),
        expectedShipmentDate: Yup.string().required("*Expected Shipment Date is required"),
        paymentTermsId: Yup.number().required("*Payment Terms Id is required"),
        deliveryMethod: Yup.number().required("*Delivery Method is required"),
        salesPerson: Yup.number().required("*Sales Person is required"),
    });
    const formik = useFormik({
        initialValues: {
            // companyName: "",
            customerName: "",
            salesOrder: "",
            referenceNumber: "",
            salesOrderDate: "",
            expectedShipmentDate: "",
            paymentTermsId: "",
            deliveryMethod: "",
            salesPerson: "",
        },
        validationSchema: validationSchema,
        onSubmit: async (values) => {
            setLoadIndicator(true);
            console.log(values);
            try {
                const response = await api.put(`/updateSalesOrders/${id}`, values, {});
                if (response.status === 200) {
                    toast.success(response.data.message);
                    navigate("/salesorder");
                } else {
                    toast.error(response.data.message);
                }
            } catch (e) {
                toast.error("Error fetching data: ", e?.response?.data?.message);
            } finally {
                setLoadIndicator(false);
            }
        },
    });

    useEffect(() => {
        const getData = async () => {
            try {
                const response = await api.get(`/getAllSalesOrdersById/${id}`);
                formik.setValues(response.data);
            } catch (e) {
                toast.error("Error fetching data: ", e?.response?.data?.message);
            }
        };

        getData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className="container-fluid p-2 minHeight m-0">
            <form onSubmit={formik.handleSubmit}>
                <div className="card shadow border-0 mb-2 top-header">
                    <div className="container-fluid py-4">
                        <div className="row align-items-center">
                            <div className="col">
                                <div className="d-flex align-items-center gap-4">
                                    <h1 className="h4 ls-tight headingColor">Edit Sales Order</h1>
                                </div>
                            </div>
                            <div className="col-auto">
                                <div className="hstack gap-2 justify-content-end">
                                    <Link to="/salesorder">
                                        <button type="submit" className="btn btn-sm btn-light">
                                            <span>Back</span>
                                        </button>
                                    </Link>
                                    <button
                                        type="submit"
                                        className="btn btn-sm btn-button"
                                        disabled={loading}
                                    >
                                        {loading ? (
                                            <span
                                                className="spinner-border spinner-border-sm"
                                                aria-hidden="true"
                                            ></span>
                                        ) : (
                                            <span></span>
                                        )}
                                        &nbsp;<span>Save</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="card shadow border-0 my-2">
                    <div className="row mt-3 me-2">
                        <div className="col-12 text-end"></div>
                    </div>
                    <div className="container mb-5">
                        <div className="row py-4">
                            <div className="col-md-6 col-12 mb-2">
                                <lable className="form-lable">
                                    Customer Name<span className="text-danger">*</span>
                                </lable>
                                <div className="mb-3">
                                    <input
                                        type="text"
                                        name="customerName"
                                        className={`form-control ${formik.touched.customerName &&
                                            formik.errors.customerName
                                            ? "is-invalid"
                                            : ""
                                            }`}
                                        {...formik.getFieldProps("customerName")}
                                    />
                                    {formik.touched.customerName &&
                                        formik.errors.customerName && (
                                            <div className="invalid-feedback">
                                                {formik.errors.customerName}
                                            </div>
                                        )}
                                </div>
                            </div>

                            <div className="col-md-6 col-12 mb-2">
                                <lable className="form-lable">
                                    salesOrder<span className="text-danger">*</span>
                                </lable>
                                <div className="mb-3">
                                    <input
                                        type="text"
                                        name="salesOrder"
                                        className={`form-control  ${formik.touched.salesOrder &&
                                            formik.errors.salesOrder
                                            ? "is-invalid"
                                            : ""
                                            }`}
                                        {...formik.getFieldProps("salesOrder")}
                                    />
                                    {formik.touched.salesOrder &&
                                        formik.errors.salesOrder && (
                                            <div className="invalid-feedback">
                                                {formik.errors.salesOrder}
                                            </div>
                                        )}
                                </div>
                            </div>

                            <div className="col-md-6 col-12 mb-2">
                                <lable className="form-lable">
                                    Sales Order Date<span className="text-danger">*</span>
                                </lable>
                                <div className="mb-3">
                                    <input
                                        type="date"
                                        name="salesOrderDate"
                                        className={`form-control  ${formik.touched.salesOrderDate && formik.errors.salesOrderDate
                                            ? "is-invalid"
                                            : ""
                                            }`}
                                        {...formik.getFieldProps("salesOrderDate")}
                                    />
                                    {formik.touched.salesOrderDate && formik.errors.salesOrderDate && (
                                        <div className="invalid-feedback">
                                            {formik.errors.salesOrderDate}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="col-md-6 col-12 mb-2">
                                <lable className="form-lable">
                                    Expected Shipment Date<span className="text-danger">*</span>
                                </lable>
                                <div className="mb-3">
                                    <input
                                        type="date"
                                        name="expectedShipmentDate"
                                        className={`form-control  ${formik.touched.expectedShipmentDate && formik.errors.expectedShipmentDate
                                            ? "is-invalid"
                                            : ""
                                            }`}
                                        {...formik.getFieldProps("expectedShipmentDate")}
                                    />
                                    {formik.touched.expectedShipmentDate && formik.errors.expectedShipmentDate && (
                                        <div className="invalid-feedback">
                                            {formik.errors.expectedShipmentDate}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="col-md-6 col-12 mb-2">
                                <lable className="form-lable">
                                    Reference Number<span className="text-danger">*</span>
                                </lable>
                                <div className="mb-3">
                                    <input
                                        type="text"
                                        name="referenceNumber"
                                        className={`form-control  ${formik.touched.referenceNumber && formik.errors.referenceNumber
                                            ? "is-invalid"
                                            : ""
                                            }`}
                                        {...formik.getFieldProps("referenceNumber")}
                                    />
                                    {formik.touched.referenceNumber && formik.errors.referenceNumber && (
                                        <div className="invalid-feedback">
                                            {formik.errors.referenceNumber}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="col-md-6 col-12 mb-2">
                                <lable className="form-lable">
                                    Payment Terms Id<span className="text-danger">*</span>
                                </lable>
                                <div className="mb-3">
                                    <input
                                        type="text"
                                        name="paymentTermsId"
                                        className={`form-control  ${formik.touched.paymentTermsId && formik.errors.paymentTermsId
                                            ? "is-invalid"
                                            : ""
                                            }`}
                                        {...formik.getFieldProps("paymentTermsId")}
                                    />
                                    {formik.touched.paymentTermsId && formik.errors.paymentTermsId && (
                                        <div className="invalid-feedback">
                                            {formik.errors.paymentTermsId}
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="col-md-6 col-12 mb-2">
                                <lable className="form-lable">
                                    Delivery Method<span className="text-danger">*</span>
                                </lable>
                                <div className="mb-3">
                                    <input
                                        type="text"
                                        name="deliveryMethod"
                                        className={`form-control  ${formik.touched.deliveryMethod && formik.errors.deliveryMethod
                                            ? "is-invalid"
                                            : ""
                                            }`}
                                        {...formik.getFieldProps("deliveryMethod")}
                                    />
                                    {formik.touched.deliveryMethod && formik.errors.deliveryMethod && (
                                        <div className="invalid-feedback">
                                            {formik.errors.deliveryMethod}
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="col-md-6 col-12 mb-2">
                                <lable className="form-lable">
                                    Sales Person<span className="text-danger">*</span>
                                </lable>
                                <div className="mb-3">
                                    <input
                                        type="text"
                                        name="salesPerson"
                                        className={`form-control  ${formik.touched.salesPerson && formik.errors.salesPerson
                                            ? "is-invalid"
                                            : ""
                                            }`}
                                        {...formik.getFieldProps("salesPerson")}
                                    />
                                    {formik.touched.salesPerson && formik.errors.salesPerson && (
                                        <div className="invalid-feedback">
                                            {formik.errors.salesPerson}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </form >
        </div >
    );
};

export default SalesOrderEdit;
