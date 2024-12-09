import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";

const TransferOrdersAdd = () => {
  const navigate = useNavigate();
  const [loading, setLoadIndicator] = useState(false);

  const validationSchema = Yup.object({
    transferOrder: Yup.string().required("*Transfer Order is required"),
    // date: Yup.string().required("*Date is required"),
    // reason: Yup.string().required("*Reason is required"),
    sourceWarehouse: Yup.string().required("*Source Warehouse is required"),
    destinationWarehouse: Yup.string().required(
      "*Destination Warehouse is required"
    ),
    attachFile: Yup.mixed().nullable().required("*File is required"),
    // quantityAdjustmentItems: Yup.array().of(
    //   Yup.object().shape({
    //     itemId: Yup.string().required("*Item is required"),
    //     quantityAvailable: Yup.string(),
    //     quantityOnHand: Yup.string(),
    //     quantityAdjusted: Yup.string(),
    //   })
    // ),
  });

  const formik = useFormik({
    initialValues: {
      transferOrder: "",
      date: "",
      reason: "",
      sourceWarehouse: "",
      destinationWarehouse: "",
      attachFile: null,
      quantityAdjustmentItems: [
        {
          itemId: "",
          quantityAvailable: "",
          quantityOnHand: "",
          quantityAdjusted: "",
        },
      ],
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      setLoadIndicator(true);
      console.log(values);
      setLoadIndicator(false);
      navigate("/transferOrder");
    },
  });

  return (
    <div className="container-fluid px-2 minHeight m-0">
      <form onSubmit={formik.handleSubmit}>
        {/* Top Header */}
        <div
          className="card shadow border-0 mb-2 sticky-top"
          style={{ borderRadius: "0", top: "66px" }}
        >
          <div className="container-fluid py-4">
            <div className="row align-items-center">
              <div className="col">
                <h1 className="h4 ls-tight">Add Transfer Order</h1>
              </div>
              <div className="col-auto">
                <div className="hstack gap-2">
                  <Link to="/transferOrder">
                    <button type="button" className="btn btn-sm btn-light">
                      Back
                    </button>
                  </Link>
                  <button
                    type="submit"
                    className="btn btn-sm btn-primary"
                    disabled={loading}
                  >
                    {loading ? (
                      <span className="spinner-border spinner-border-sm" />
                    ) : (
                      "Save"
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Form Inputs */}
        <div
          className="card shadow border-0 my-2"
          style={{ borderRadius: "0" }}
        >
          <div className="container mb-5">
            <div className="row py-4">
              <div className="col-md-6 mb-3">
                <label className="form-label">Transfer Order</label>
                <span className="text-danger">*</span>
                <input
                  type="text"
                  className={`form-control ${
                    formik.touched.transferOrder && formik.errors.transferOrder
                      ? "is-invalid"
                      : ""
                  }`}
                  {...formik.getFieldProps("transferOrder")}
                />
                {formik.touched.transferOrder &&
                  formik.errors.transferOrder && (
                    <div className="invalid-feedback">
                      {formik.errors.transferOrder}
                    </div>
                  )}
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label">Date</label>
                <input
                  type="date"
                  className={`form-control ${
                    formik.touched.date && formik.errors.date
                      ? "is-invalid"
                      : ""
                  }`}
                  {...formik.getFieldProps("date")}
                />
                {formik.touched.date && formik.errors.date && (
                  <div className="invalid-feedback">{formik.errors.date}</div>
                )}
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label">Source Warehouse</label>
                <span className="text-danger">*</span>
                <input
                  type="text"
                  className={`form-control ${
                    formik.touched.sourceWarehouse &&
                    formik.errors.sourceWarehouse
                      ? "is-invalid"
                      : ""
                  }`}
                  {...formik.getFieldProps("sourceWarehouse")}
                />
                {formik.touched.sourceWarehouse &&
                  formik.errors.sourceWarehouse && (
                    <div className="invalid-feedback">
                      {formik.errors.sourceWarehouse}
                    </div>
                  )}
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label">Destination Warehouse</label>
                <span className="text-danger">*</span>
                <input
                  type="text"
                  className={`form-control ${
                    formik.touched.destinationWarehouse &&
                    formik.errors.destinationWarehouse
                      ? "is-invalid"
                      : ""
                  }`}
                  {...formik.getFieldProps("destinationWarehouse")}
                />
                {formik.touched.destinationWarehouse &&
                  formik.errors.destinationWarehouse && (
                    <div className="invalid-feedback">
                      {formik.errors.destinationWarehouse}
                    </div>
                  )}
              </div>

              <div className="row">
                <div className="col-md-6 col-12 mb-2">
                  <lable className="form-lable">Reason</lable>
                  <div className="mb-3">
                    <textarea
                      type="text"
                      name="reason"
                      className={`form-control  ${
                        formik.touched.reason && formik.errors.reason
                          ? "is-invalid"
                          : ""
                      }`}
                      rows="4"
                      {...formik.getFieldProps("reason")}
                    />
                    {formik.touched.reason && formik.errors.reason && (
                      <div className="invalid-feedback">
                        {formik.errors.reason}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default TransferOrdersAdd;
