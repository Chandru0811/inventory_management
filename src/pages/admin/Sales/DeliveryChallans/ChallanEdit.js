import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
// import api from "../../../config/URL";
import toast from "react-hot-toast";

const ChallanEdit = () => {
  const navigate = useNavigate();
  const [loading, setLoadIndicator] = useState(false);

  const validationSchema = Yup.object({
    customerName: Yup.string().required("*Customer Name is required"),
    deliveryChallan: Yup.string().required("*Delivery Challan is required"),
    deliveryChallanDate: Yup.string().required(
      "*Delivery Challan Date is required"
    ),
    challanType: Yup.string().required("*Challan Type required"),
  });
  const formik = useFormik({
    initialValues: {
      // companyName: "",
      customerName: "",
      deliveryChallan: "",
      deliveryChallanDate: "",
      challanType: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      setLoadIndicator(true);
      console.log(values);
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
                    Edit Delivery Challan
                  </h1>
                </div>
              </div>
              <div className="col-auto">
                <div className="hstack gap-2 justify-content-end">
                  <Link to="/challan">
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
                        className="spinner-border spinner-border-sm btn-primary"
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
                  Delivery Challan<span className="text-danger">*</span>
                </lable>
                <div className="mb-3">
                  <input
                    type="text"
                    name="deliveryChallan"
                    className={`form-control  ${
                      formik.touched.deliveryChallan &&
                      formik.errors.deliveryChallan
                        ? "is-invalid"
                        : ""
                    }`}
                    {...formik.getFieldProps("deliveryChallan")}
                  />
                  {formik.touched.deliveryChallan &&
                    formik.errors.deliveryChallan && (
                      <div className="invalid-feedback">
                        {formik.errors.deliveryChallan}
                      </div>
                    )}
                </div>
              </div>

              <div className="col-md-6 col-12 mb-2">
                <lable className="form-lable">Reference</lable>
                <div className="mb-3">
                  <input
                    type="text"
                    name="reference"
                    className={`form-control ${
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
                <lable className="form-lable">
                  Delivery Challan Date<span className="text-danger">*</span>
                </lable>
                <div className="mb-3">
                  <input
                    type="date"
                    name="deliveryChallanDate"
                    className={`form-control  ${
                      formik.touched.deliveryChallanDate &&
                      formik.errors.deliveryChallanDate
                        ? "is-invalid"
                        : ""
                    }`}
                    {...formik.getFieldProps("deliveryChallanDate")}
                  />
                  {formik.touched.deliveryChallanDate &&
                    formik.errors.deliveryChallanDate && (
                      <div className="invalid-feedback">
                        {formik.errors.deliveryChallanDate}
                      </div>
                    )}
                </div>
              </div>

              <div className="col-md-6 col-12 mb-2">
                <lable className="form-lable">
                  Challan Type<span className="text-danger">*</span>
                </lable>
                <div className="mb-3">
                  <input
                    type="text"
                    name="challanType"
                    className={`form-control  ${
                      formik.touched.challanType && formik.errors.challanType
                        ? "is-invalid"
                        : ""
                    }`}
                    {...formik.getFieldProps("challanType")}
                  />
                  {formik.touched.challanType && formik.errors.challanType && (
                    <div className="invalid-feedback">
                      {formik.errors.challanType}
                    </div>
                  )}
                </div>
              </div>

              <div className="col-md-6 col-12 mb-2">
                <lable className="form-lable">Attach File</lable>
                <div className="mb-3">
                  <input
                    type="file"
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
                <lable className="form-lable">Customer Notes</lable>
                <div className="mb-3">
                  <textarea
                    type="text"
                    name="customerNotes"
                    className={`form-control  ${
                      formik.touched.customerNotes &&
                      formik.errors.customerNotes
                        ? "is-invalid"
                        : ""
                    }`}
                    {...formik.getFieldProps("customerNotes")}
                    rows="4"
                  />
                  {formik.touched.customerNotes &&
                    formik.errors.customerNotes && (
                      <div className="invalid-feedback">
                        {formik.errors.customerNotes}
                      </div>
                    )}
                </div>
              </div>
              <div className="col-md-6 col-12 mb-2">
                <lable className="form-lable">Terms & Conditions</lable>
                <div className="mb-3">
                  <textarea
                    type="text"
                    name="termsAndCondition"
                    className={`form-control  ${
                      formik.touched.termsAndCondition &&
                      formik.errors.termsAndCondition
                        ? "is-invalid"
                        : ""
                    }`}
                    rows="4"
                    {...formik.getFieldProps("termsAndCondition")}
                  />
                  {formik.touched.termsAndCondition &&
                    formik.errors.termsAndCondition && (
                      <div className="invalid-feedback">
                        {formik.errors.termsAndCondition}
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

export default ChallanEdit;
