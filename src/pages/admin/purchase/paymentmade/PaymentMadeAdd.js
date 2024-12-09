import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import api from "../../../../config/URL";
import toast from "react-hot-toast";

const PaymentMadeAdd = () => {
  const navigate = useNavigate();
  const [loading, setLoadIndicator] = useState(false);

  const validationSchema = Yup.object({
    contactName: Yup.string().required("*Contact Name is required"),
    accNumber: Yup.string().required("*Account Number is required"),
    primaryContact: Yup.string().required("*Primary Contact is required"),
    email: Yup.string().required("*Email is required"),
    phone: Yup.number().required("*Phone is required"),
    website: Yup.string().required("*Website is required"),
    bankAccName: Yup.string().required("*Account Nameis required"),
    bankAccNumber: Yup.string().required("*Account Number is required"),
  });

  const formik = useFormik({
    initialValues: {
      // companyName: "",
      contactName: "",
      accNumber: "",
      primaryContact: "",
      email: "",
      phone: "",
      website: "",
      bankAccName: "",
      bankAccNumber: "",
      deliCountry: "",
      deliAddress: "",
      deliCity: "",
      deliState: "",
      deliZip: "",
      deliAttention: "",
      billCountry: "",
      billAddress: "",
      billCity: "",
      billState: "",
      billZip: "",
      billAttention: "",
      notes: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      setLoadIndicator(true);
      console.log(values);
      try {
        const response = await api.post("/createMstrCustomer", values, {});
        if (response.status === 201) {
          toast.success(response.data.message);
          navigate("/customer");
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
    <div className="container-fluid px-2  minHeight m-0">
      <form onSubmit={formik.handleSubmit}>
        <div
          className="card shadow border-0 mb-2 top-header"
          style={{ borderRadius: "0" }}
        >
          <div className="container-fluid py-4">
            <div className="row align-items-center">
              <div className="col">
                <div className="d-flex align-items-center gap-4">
                  <h1 className="h4 ls-tight headingColor">Add Payment Made</h1>
                </div>
              </div>
              <div className="col-auto">
                <div className="hstack gap-2 justify-content-end">
                  <Link to="/paymentmade">
                    <button type="submit" className="btn btn-sm btn-light">
                      <span>Back</span>
                    </button>
                  </Link>
                  <button
                    type="submit"
                    className="btn btn-sm btn-buttonm btn-primary"
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
                  Vendor Name<span className="text-danger">*</span>
                </lable>
                <div className="mb-3">
                  <input
                    type="text"
                    name="vendorName"
                    className={`form-control ${
                      formik.touched.vendorName && formik.errors.vendorName
                        ? "is-invalid"
                        : ""
                    }`}
                    {...formik.getFieldProps("vendorName")}
                  />
                  {formik.touched.vendorName && formik.errors.vendorName && (
                    <div className="invalid-feedback">
                      {formik.errors.vendorName}
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
                    name="accNumber"
                    className={`form-control  ${
                      formik.touched.accNumber && formik.errors.accNumber
                        ? "is-invalid"
                        : ""
                    }`}
                    {...formik.getFieldProps("accNumber")}
                  />
                  {formik.touched.accNumber && formik.errors.accNumber && (
                    <div className="invalid-feedback">
                      {formik.errors.accNumber}
                    </div>
                  )}
                </div>
              </div>
              <div className="col-md-6 col-12 mb-2">
                <lable className="form-lable">
                  Payment Made<span className="text-danger">*</span>
                </lable>
                <div className="mb-3">
                  <input
                    type="text"
                    name="accNumber"
                    className={`form-control  ${
                      formik.touched.accNumber && formik.errors.accNumber
                        ? "is-invalid"
                        : ""
                    }`}
                    {...formik.getFieldProps("accNumber")}
                  />
                  {formik.touched.accNumber && formik.errors.accNumber && (
                    <div className="invalid-feedback">
                      {formik.errors.accNumber}
                    </div>
                  )}
                </div>
              </div>
              <div className="col-md-6 col-12 mb-2">
                <lable className="form-lable">
                  Payment Date<span className="text-danger">*</span>
                </lable>
                <div className="mb-3">
                  <input
                    type="date"
                    name="primaryContact"
                    className={`form-control ${
                      formik.touched.primaryContact &&
                      formik.errors.primaryContact
                        ? "is-invalid"
                        : ""
                    }`}
                    {...formik.getFieldProps("primaryContact")}
                  />
                  {formik.touched.primaryContact &&
                    formik.errors.primaryContact && (
                      <div className="invalid-feedback">
                        {formik.errors.primaryContact}
                      </div>
                    )}
                </div>
              </div>
              <div className="col-md-6 col-12 mb-2">
                <lable className="form-lable">Payment Mode</lable>
                <div className="mb-3">
                  <select
                    type="text"
                    name="email"
                    className={`form-select form-select-sm ${
                      formik.touched.email && formik.errors.email
                        ? "is-invalid"
                        : ""
                    }`}
                    {...formik.getFieldProps("email")}
                  >
                    <option selected></option>
                    <option value="Cash">Cash</option>
                    <option value="Bank Transfer">Bank Transfer</option>
                  </select>
                  {formik.touched.email && formik.errors.email && (
                    <div className="invalid-feedback">
                      {formik.errors.email}
                    </div>
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
                    name="bankAccName"
                    className={`form-control  ${
                      formik.touched.bankAccName && formik.errors.bankAccName
                        ? "is-invalid"
                        : ""
                    }`}
                    {...formik.getFieldProps("bankAccName")}
                  />
                  {formik.touched.bankAccName && formik.errors.bankAccName && (
                    <div className="invalid-feedback">
                      {formik.errors.bankAccName}
                    </div>
                  )}
                </div>
              </div>

              <div className="col-md-6 col-12 mb-2">
                <lable className="form-lable">
                  payment Mode<span className="text-danger">*</span>
                </lable>
                <div className="mb-3">
                  <input
                    type="text"
                    name="bankAccNumber"
                    className={`form-control  ${
                      formik.touched.bankAccNumber &&
                      formik.errors.bankAccNumber
                        ? "is-invalid"
                        : ""
                    }`}
                    {...formik.getFieldProps("bankAccNumber")}
                  />
                  {formik.touched.bankAccNumber &&
                    formik.errors.bankAccNumber && (
                      <div className="invalid-feedback">
                        {formik.errors.bankAccNumber}
                      </div>
                    )}
                </div>
              </div>
              <div className="col-md-6 col-12 mb-2">
                <lable className="form-lable">
                  Deposit To
                  <span className="text-danger">*</span>
                </lable>
                <div className="mb-3">
                  <input
                    type="text"
                    name="bankAccName"
                    className={`form-control  ${
                      formik.touched.bankAccName && formik.errors.bankAccName
                        ? "is-invalid"
                        : ""
                    }`}
                    {...formik.getFieldProps("bankAccName")}
                  />
                  {formik.touched.bankAccName && formik.errors.bankAccName && (
                    <div className="invalid-feedback">
                      {formik.errors.bankAccName}
                    </div>
                  )}
                </div>
              </div>
              <div className="col-md-6 col-12 mb-2">
                <lable className="form-lable">
                  Reference
                  <span className="text-danger">*</span>
                </lable>
                <div className="mb-3">
                  <input
                    type="text"
                    name="bankAccName"
                    className={`form-control  ${
                      formik.touched.bankAccName && formik.errors.bankAccName
                        ? "is-invalid"
                        : ""
                    }`}
                    {...formik.getFieldProps("bankAccName")}
                  />
                  {formik.touched.bankAccName && formik.errors.bankAccName && (
                    <div className="invalid-feedback">
                      {formik.errors.bankAccName}
                    </div>
                  )}
                </div>
              </div>
              <div className="col-md-6 col-12 mb-2">
                <lable className="form-lable">
                  Notes
                  <span className="text-danger">*</span>
                </lable>
                <div className="mb-3">
                  <input
                    type="text"
                    name="bankAccName"
                    className={`form-control  ${
                      formik.touched.bankAccName && formik.errors.bankAccName
                        ? "is-invalid"
                        : ""
                    }`}
                    {...formik.getFieldProps("bankAccName")}
                  />
                  {formik.touched.bankAccName && formik.errors.bankAccName && (
                    <div className="invalid-feedback">
                      {formik.errors.bankAccName}
                    </div>
                  )}
                </div>
              </div>
              <div className="col-md-6 col-12 mb-2">
                <lable className="form-lable">
                  Attach File
                  <span className="text-danger">*</span>
                </lable>
                <div className="mb-3">
                  <input
                    type="file"
                    name="bankAccName"
                    className={`form-control  ${
                      formik.touched.bankAccName && formik.errors.bankAccName
                        ? "is-invalid"
                        : ""
                    }`}
                    {...formik.getFieldProps("bankAccName")}
                  />
                  {formik.touched.bankAccName && formik.errors.bankAccName && (
                    <div className="invalid-feedback">
                      {formik.errors.bankAccName}
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

export default PaymentMadeAdd;
