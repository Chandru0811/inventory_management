import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import api from "../../../../config/URL";
import toast from "react-hot-toast";

const PaymentReceivedEdit = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoadIndicator] = useState(false);

    const validationSchema = Yup.object({
        customerName: Yup.string().required("*Customer Name is required"),
        payment: Yup.string().required("*Payment is required"),
        amountReceive: Yup.string().required("*Amount Receive is required"),
        paymentCharges: Yup.string().required("*Payment Charges is required"),
        taxDeduction: Yup.string().required("*Tax Deduction is required"),
        taxDeduction: Yup.string().required("*Tax Deduction is required"),
        paymentMode: Yup.string().required("*Payment Mode is required"),
        depositTo: Yup.string().required("*Deposit To is required"),
        reference: Yup.string().required("*Reference is required"),
        attachFile: Yup.string().required("*File is required"),
        notes: Yup.string().required("*notes is required"),
    });
    const formik = useFormik({
        initialValues: {
            // companyName: "",
            customerName: "",
            payment: "",
            amountReceive: "",
            paymentCharges: "",
            taxDeduction: "",
            paymentMode: "",
            depositTo: "",
            reference: "",
            notes: "",
            attachFile: null,
        },
        validationSchema: validationSchema,
        onSubmit: async (values) => {
            setLoadIndicator(true);
            console.log(values);
            try {
                const response = await api.put(`/updatePaymentDetails/${id}`, values, {});
                if (response.status === 200) {
                    toast.success(response.data.message);
                    navigate("/paymentreceived");
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
                const response = await api.get(`/getAllPaymentDetailsById/${id}`);
                formik.setValues(response.data);
            } catch (e) {
                toast.error("Error fetching data: ", e?.response?.data?.message);
            }
        };

        getData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className="container-fluid px-2 minHeight m-0">
            <form onSubmit={formik.handleSubmit}>
                <div className="card shadow border-0 mb-2 top-header"
                    style={{ borderRadius: "0" }}>
                    <div className="container-fluid py-4">
                        <div className="row align-items-center">
                            <div className="col">
                                <div className="d-flex align-items-center gap-4">
                                    <h1 className="h4 ls-tight headingColor">Edit Payment Received</h1>
                                </div>
                            </div>
                            <div className="col-auto">
                                <div className="hstack gap-2 justify-content-end">
                                    <Link to="/paymentreceived">
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
                                    Payment<span className="text-danger">*</span>
                                </lable>
                                <div className="mb-3">
                                    <input
                                        type="text"
                                        name="payment"
                                        className={`form-control  ${formik.touched.payment &&
                                            formik.errors.payment
                                            ? "is-invalid"
                                            : ""
                                            }`}
                                        {...formik.getFieldProps("payment")}
                                    />
                                    {formik.touched.payment &&
                                        formik.errors.payment && (
                                            <div className="invalid-feedback">
                                                {formik.errors.payment}
                                            </div>
                                        )}
                                </div>
                            </div>

                            <div className="col-md-6 col-12 mb-2">
                                <lable className="form-lable">
                                    Amount Receive<span className="text-danger">*</span>
                                </lable>
                                <div className="mb-3">
                                    <input
                                        type="text"
                                        name="amountReceive"
                                        className={`form-control  ${formik.touched.amountReceive && formik.errors.amountReceive
                                            ? "is-invalid"
                                            : ""
                                            }`}
                                        {...formik.getFieldProps("amountReceive")}
                                    />
                                    {formik.touched.amountReceive && formik.errors.amountReceive && (
                                        <div className="invalid-feedback">
                                            {formik.errors.amountReceive}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="col-md-6 col-12 mb-2">
                                <lable className="form-lable">
                                    Payment Charges<span className="text-danger">*</span>
                                </lable>
                                <div className="mb-3">
                                    <input
                                        type="text"
                                        name="paymentCharges"
                                        className={`form-control  ${formik.touched.paymentCharges && formik.errors.paymentCharges
                                            ? "is-inpaymentChargesalid"
                                            : ""
                                            }`}
                                        {...formik.getFieldProps("paymentCharges")}
                                    />
                                    {formik.touched.paymentCharges && formik.errors.paymentCharges && (
                                        <div className="valid-feedback">
                                            {formik.errors.paymentCharges}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="col-md-6 col-12 mb-2">
                                <label className="form-label">
                                    Attach File<span className="text-danger">*</span>
                                </label>
                                <div className="mb-3">
                                    <input
                                        type="file"
                                        name="attachFile"
                                        className={`form-control ${formik.touched.attachFile && formik.errors.attachFile
                                                ? "is-invalid"
                                                : ""
                                            }`}
                                        onChange={(event) => {
                                            formik.setFieldValue("attachFile", event.target.files[0]); // Manually set file
                                        }}
                                    />
                                    {formik.touched.attachFile && formik.errors.attachFile && (
                                        <div className="invalid-feedback">{formik.errors.attachFile}</div>
                                    )}
                                </div>
                            </div>
                            <div className="col-md-6 col-12 mb-2">
                                <lable className="form-lable">
                                    Tax Deduction<span className="text-danger">*</span>
                                </lable>
                                <div className="mb-3">
                                    <input
                                        type="text"
                                        name="taxDeduction"
                                        className={`form-control  ${formik.touched.taxDeduction && formik.errors.taxDeduction
                                            ? "is-invalid"
                                            : ""
                                            }`}
                                        {...formik.getFieldProps("taxDeduction")}
                                    />
                                    {formik.touched.taxDeduction && formik.errors.taxDeduction && (
                                        <div className="invalid-feedback">
                                            {formik.errors.taxDeduction}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="col-md-6 col-12 mb-2">
                                <lable className="form-lable">
                                    Payment Mode<span className="text-danger">*</span>
                                </lable>
                                <div className="mb-3">
                                    <input
                                        type="text"
                                        name="paymentMode"
                                        className={`form-control  ${formik.touched.paymentMode && formik.errors.paymentMode
                                            ? "is-invalid"
                                            : ""
                                            }`}
                                        {...formik.getFieldProps("paymentMode")}
                                    />
                                    {formik.touched.paymentMode && formik.errors.paymentMode && (
                                        <div className="invalid-feedback">
                                            {formik.errors.paymentMode}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="col-md-6 col-12 mb-2">
                                <lable className="form-lable">
                                    DepositTo<span className="text-danger">*</span>
                                </lable>
                                <div className="mb-3">
                                    <input
                                        type="text"
                                        name="depositTo"
                                        className={`form-control  ${formik.touched.depositTo && formik.errors.depositTo
                                            ? "is-invalid"
                                            : ""
                                            }`}
                                        {...formik.getFieldProps("depositTo")}
                                    />
                                    {formik.touched.depositTo && formik.errors.depositTo && (
                                        <div className="invalid-feedback">
                                            {formik.errors.depositTo}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="col-md-6 col-12 mb-2">
                                <lable className="form-lable">
                                    Reference<span className="text-danger">*</span>
                                </lable>
                                <div className="mb-3">
                                    <input
                                        type="text"
                                        name="reference"
                                        className={`form-control  ${formik.touched.reference && formik.errors.reference
                                            ? "is-invalid"
                                            : ""
                                            }`}
                                        {...formik.getFieldProps("reference")}
                                    />
                                    {formik.touched.reference && formik.errors.reference && (
                                        <div className="invalid-feedback">
                                            {formik.errors.reference}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="col-md-6 col-12 mb-2">
                                <lable className="form-lable">
                                    Notes<span className="text-danger">*</span>
                                </lable>
                                <div className="mb-3">
                                    <textarea
                                        type="text"
                                        name="notes"
                                        className={`form-control  ${formik.touched.notes && formik.errors.notes
                                            ? "is-invalid"
                                            : ""
                                            }`}
                                        {...formik.getFieldProps("notes")}
                                    />
                                    {formik.touched.notes && formik.errors.notes && (
                                        <div className="invalid-feedback">
                                            {formik.errors.notes}
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

export default PaymentReceivedEdit;
