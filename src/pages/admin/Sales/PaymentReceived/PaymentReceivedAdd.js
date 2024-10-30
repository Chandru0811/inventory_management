import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import api from "../../../../config/URL";
import toast from "react-hot-toast";

const PaymentReceivedAdd = () => {
  const navigate = useNavigate();
  const [loading, setLoadIndicator] = useState(false);

  const validationSchema = Yup.object({
    customerName: Yup.string().required("*Customer name is required"),
    amountReceive: Yup.string().required("*Amount receive is required"),
    payment: Yup.string().required("*Payment is required"),
    depositTo: Yup.string().required("*Deposit to is required"),
    taxDeduction: Yup.string().required("*Tax deduction is required"),
  });

  const formik = useFormik({
    initialValues: {
      customerName: "",
      payment: "",
      amountReceive: "",
      paymentCharges: "",
      taxDeduction: "",
      paymentMode: "",
      depositTo: "",
      reference: "",
      notes: "",
      file: null,
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      setLoadIndicator(true);
      console.log(values);

      const formData = new FormData();
      // Append each value to the FormData instance
      for (const key in values) {
        if (values.hasOwnProperty(key)) {
          formData.append(key, values[key]);
        }
      }

      try {
        const response = await api.post(
          "/createPaymentDetailsProfileImage",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        if (response.status === 201) {
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

  return (
    <div className="container-fluid px-2 minHeight m-0">
      <form onSubmit={formik.handleSubmit}>
        <div
          className="card shadow border-0 mb-2 top-header"
          style={{ borderRadius: "0" }}
        >
          <div className="container-fluid py-4">
            <div className="row align-items-center">
              <div className="col">
                <div className="d-flex align-items-center gap-4">
                  <h1 className="h4 ls-tight headingColor">
                    Add Payment Received
                  </h1>
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
                    &nbsp;<span>Save</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div
          className="card shadow border-0 my-2"
          style={{ borderRadius: "0" }}
        >
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
                    className={`form-control ${
                      formik.touched.customerName && formik.errors.customerName
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
                    className={`form-control  ${
                      formik.touched.payment && formik.errors.payment
                        ? "is-invalid"
                        : ""
                    }`}
                    {...formik.getFieldProps("payment")}
                  />
                  {formik.touched.payment && formik.errors.payment && (
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
                    className={`form-control  ${
                      formik.touched.amountReceive &&
                      formik.errors.amountReceive
                        ? "is-invalid"
                        : ""
                    }`}
                    {...formik.getFieldProps("amountReceive")}
                  />
                  {formik.touched.amountReceive &&
                    formik.errors.amountReceive && (
                      <div className="invalid-feedback">
                        {formik.errors.amountReceive}
                      </div>
                    )}
                </div>
              </div>

              <div className="col-md-6 col-12 mb-2">
                <lable className="form-lable">Payment Charges</lable>
                <div className="mb-3">
                  <input
                    type="text"
                    name="paymentCharges"
                    className={`form-control  ${
                      formik.touched.paymentCharges &&
                      formik.errors.paymentCharges
                        ? "is-inpaymentChargesalid"
                        : ""
                    }`}
                    {...formik.getFieldProps("paymentCharges")}
                  />
                  {formik.touched.paymentCharges &&
                    formik.errors.paymentCharges && (
                      <div className="valid-feedback">
                        {formik.errors.paymentCharges}
                      </div>
                    )}
                </div>
              </div>

              <div className="col-md-6 col-12 mb-3">
                <div>
                  <label for="exampleFormControlInput1" className="form-label">
                    Tax Deduction<span className="text-danger">*</span>
                  </label>
                </div>
                <div className="form-check form-check-inline">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="taxDeduction"
                    id="NO_TAX"
                    value="NO_TAX"
                    onChange={formik.handleChange}
                    checked={formik.values.taxDeduction === "NO_TAX"}
                  />
                  <label className="form-check-label">No Tax deducted</label>
                </div>
                <div className="form-check form-check-inline">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="taxDeduction"
                    id="YES_TDS"
                    value="YES_TDS"
                    onChange={formik.handleChange}
                    checked={formik.values.taxDeduction === "YES_TDS"}
                  />
                  <label className="form-check-label">
                    Yes, TDS (Income Tax)
                  </label>
                </div>
                {formik.errors.taxDeduction && formik.touched.taxDeduction && (
                  <div className="text-danger" style={{ fontSize: ".875em" }}>
                    {formik.errors.taxDeduction}
                  </div>
                )}
              </div>

              <div className="col-md-6 col-12 mb-2">
                <lable className="form-lable">Payment Mode</lable>
                <div className="mb-3">
                  <select
                    name="paymentMode"
                    className={`form-select  ${
                      formik.touched.paymentMode && formik.errors.paymentMode
                        ? "is-invalid"
                        : ""
                    }`}
                    {...formik.getFieldProps("paymentMode")}
                  >
                    <option value=""></option>
                    <option value="CASH">Cash</option>
                    <option value="BANK_REMITTANCE">Bank Remittance</option>
                    <option value="CHEQUE">Check</option>
                    <option value="CREDIT_CARD">Credit Card</option>
                    <option value="UPI">UPI</option>
                    <option value="BANK_TRANSFER">Bank Transfer</option>
                  </select>
                  {formik.touched.paymentMode && formik.errors.paymentMode && (
                    <div className="invalid-feedback">
                      {formik.errors.paymentMode}
                    </div>
                  )}
                </div>
              </div>

              {/* <div className="col-md-6 col-12 mb-2">
                <lable className="form-lable">
                  Deposit To<span className="text-danger">*</span>
                </lable>
                <div className="mb-3">
                  <input
                    type="text"
                    name="depositTo"
                    className={`form-control  ${
                      formik.touched.depositTo && formik.errors.depositTo
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
              </div> */}

              <div className="col-md-6 col-12 mb-2">
                <lable className="form-lable">
                  Deposit To<span className="text-danger">*</span>
                </lable>
                <div className="mb-3">
                  <select
                    name="depositTo"
                    className={`form-select  ${
                      formik.touched.depositTo && formik.errors.depositTo
                        ? "is-invalid"
                        : ""
                    }`}
                    {...formik.getFieldProps("depositTo")}
                  >
                    <option value=""></option>
                    <option value="PETTY_CASH">Petty Cash</option>
                    <option value="UNDEPOSITED_FUND">Undeposited Fund</option>
                    <option value="EMPLOYEE_REIMBURSEMENTS">Employee Reimbursements</option>
                    <option value="OPENING_BALANCE_ADJUSTMENTS">Opening Balance Adjustments</option>
                    <option value="TDS_PAYABLE">TDS Payable</option>
                  </select>
                  {formik.touched.depositTo && formik.errors.depositTo && (
                    <div className="invalid-feedback">
                      {formik.errors.depositTo}
                    </div>
                  )}
                </div>
              </div>

              <div className="col-md-6 col-12 mb-2">
                <lable className="form-lable">
                  Reference
                </lable>
                <div className="mb-3">
                  <input
                    type="text"
                    name="reference"
                    className={`form-control  ${
                      formik.touched.reference && formik.errors.reference
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
                <lable className="form-lable">Attach File</lable>
                <div className="mb-3">
                  <input
                    type="file"
                    className="form-control"
                    onChange={(event) => {
                      formik.setFieldValue("file", event.target.files[0]);
                    }}
                    onBlur={formik.handleBlur}
                  />
                  {formik.touched.file && formik.errors.file && (
                    <div className="invalid-feedback">{formik.errors.file}</div>
                  )}
                </div>
              </div>

              <div className="col-md-6 col-12 mb-2">
                <lable className="form-lable">Notes</lable>
                <div className="mb-3">
                  <textarea
                    type="text"
                    name="notes"
                    className={`form-control  ${
                      formik.touched.notes && formik.errors.notes
                        ? "is-invalid"
                        : ""
                    }`}
                    rows="4"
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
      </form>
    </div>
  );
};

export default PaymentReceivedAdd;
