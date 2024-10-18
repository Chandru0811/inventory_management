import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import api from "../../../../config/URL";
import toast from "react-hot-toast";

const PackagesEdit = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoadIndicator] = useState(false);

    const validationSchema = Yup.object({
        customerName: Yup.string().required("*Customer Name is required"),
        salesOrder: Yup.string().required("*Sales Order is required"),
        packageSlip: Yup.string().required("*Reference Number is required"),
        packageDate: Yup.string().required("*Sales Order Date is required"),
        internalNotes: Yup.string().required("*Expected Shipment Date is required"),
        customerId: Yup.string().required("*Payment Terms Id is required"),
        salesId: Yup.string().required("*Delivery Method is required"),
        itemId: Yup.string().required("*Sales Person is required"),
    });
    const formik = useFormik({
        initialValues: {
            // companyName: "",
            customerName: "",
            salesOrder: "",
            customerName: "",
            salesOrder: "",
            packageSlip: "",
            packageDate: "",
            internalNotes: "",
            customerId: "",
            salesId: "",
            itemId: ""
        },
        validationSchema: validationSchema,
        onSubmit: async (values) => {
            setLoadIndicator(true);
            console.log(values);
            try {
                const response = await api.put(`/updatePackages/${id}`, values, {});
                if (response.status === 200) {
                    toast.success(response.data.message);
                    navigate("/packages");
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
                const response = await api.get(`/getPackagesById/${id}`);
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
                <div className="card shadow border-0 mb-2 top-header"
                    style={{ borderRadius: "0" }}>
                    <div className="container-fluid py-4">
                        <div className="row align-items-center">
                            <div className="col">
                                <div className="d-flex align-items-center gap-4">
                                    <h1 className="h4 ls-tight headingColor">Edit Packages</h1>
                                </div>
                            </div>
                            <div className="col-auto">
                                <div className="hstack gap-2 justify-content-end">
                                    <Link to="/packages">
                                        <button type="submit" className="btn btn-sm btn-light">
                                            <span>Back</span>
                                        </button>
                                    </Link>
                                    <button
                                        type="submit"
                                        className="btn btn-sm btn-button btn-primary"
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
                                        &nbsp;<span>Update</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="card shadow border-0 my-2"
                    style={{ borderRadius: "0" }}>
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
                                    Package Slip<span className="text-danger">*</span>
                                </lable>
                                <div className="mb-3">
                                    <input
                                        type="date"
                                        name="packageSlip"
                                        className={`form-control  ${formik.touched.packageSlip && formik.errors.packageSlip
                                            ? "is-invalid"
                                            : ""
                                            }`}
                                        {...formik.getFieldProps("packageSlip")}
                                    />
                                    {formik.touched.packageSlip && formik.errors.packageSlip && (
                                        <div className="invalid-feedback">
                                            {formik.errors.packageSlip}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="col-md-6 col-12 mb-2">
                                <lable className="form-lable">
                                    Package Date<span className="text-danger">*</span>
                                </lable>
                                <div className="mb-3">
                                    <input
                                        type="date"
                                        name="packageDate"
                                        className={`form-control  ${formik.touched.packageDate && formik.errors.packageDate
                                            ? "is-invalid"
                                            : ""
                                            }`}
                                        {...formik.getFieldProps("packageDate")}
                                    />
                                    {formik.touched.packageDate && formik.errors.packageDate && (
                                        <div className="invalid-feedback">
                                            {formik.errors.packageDate}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="col-md-6 col-12 mb-2">
                                <lable className="form-lable">
                                    Internal Notes<span className="text-danger">*</span>
                                </lable>
                                <div className="mb-3">
                                    <input
                                        type="text"
                                        name="internalNotes"
                                        className={`form-control  ${formik.touched.internalNotes && formik.errors.internalNotes
                                            ? "is-invalid"
                                            : ""
                                            }`}
                                        {...formik.getFieldProps("internalNotes")}
                                    />
                                    {formik.touched.internalNotes && formik.errors.internalNotes && (
                                        <div className="invalid-feedback">
                                            {formik.errors.internalNotes}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="col-md-6 col-12 mb-2">
                                <lable className="form-lable">
                                    Customer Id<span className="text-danger">*</span>
                                </lable>
                                <div className="mb-3">
                                    <input
                                        type="text"
                                        name="customerId"
                                        className={`form-control  ${formik.touched.customerId && formik.errors.customerId
                                            ? "is-invalid"
                                            : ""
                                            }`}
                                        {...formik.getFieldProps("customerId")}
                                    />
                                    {formik.touched.customerId && formik.errors.customerId && (
                                        <div className="invalid-feedback">
                                            {formik.errors.customerId}
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="col-md-6 col-12 mb-2">
                                <lable className="form-lable">
                                    Sales Id<span className="text-danger">*</span>
                                </lable>
                                <div className="mb-3">
                                    <input
                                        type="text"
                                        name="salesId"
                                        className={`form-control  ${formik.touched.salesId && formik.errors.salesId
                                            ? "is-invalid"
                                            : ""
                                            }`}
                                        {...formik.getFieldProps("salesId")}
                                    />
                                    {formik.touched.salesId && formik.errors.salesId && (
                                        <div className="invalid-feedback">
                                            {formik.errors.salesId}
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="col-md-6 col-12 mb-2">
                                <lable className="form-lable">
                                    Item Id<span className="text-danger">*</span>
                                </lable>
                                <div className="mb-3">
                                    <input
                                        type="text"
                                        name="itemId"
                                        className={`form-control  ${formik.touched.itemId && formik.errors.itemId
                                            ? "is-invalid"
                                            : ""
                                            }`}
                                        {...formik.getFieldProps("itemId")}
                                    />
                                    {formik.touched.itemId && formik.errors.itemId && (
                                        <div className="invalid-feedback">
                                            {formik.errors.itemId}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </form >
        </div>
    );
};

export default PackagesEdit;
