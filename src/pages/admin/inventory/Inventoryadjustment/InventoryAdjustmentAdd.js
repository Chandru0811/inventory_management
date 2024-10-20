import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import api from "../../../../config/URL";
import toast from "react-hot-toast";
import InventoryAdjustment from "./InventoryAdjustment";

const InventoryAdjustmentAdd = () => {
  const navigate = useNavigate();
  const [loading, setLoadIndicator] = useState(false);

  const validationSchema = Yup.object({
    date: Yup.string().required("*Primary Contact is required"),
  });
  const formik = useFormik({
    initialValues: {
      // companyName: "",
      modeOfAdjustment: "",
      reference_number: "",
      date: "",
      reason: "",
      descOfAdjustment: "",
      // inventoryAdjustmentsFile: "",
      accountId: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      setLoadIndicator(true);
      console.log(values);
      try {
        const response = await api.post(
          "/createInventoryAdjustments",
          values,
          {}
        );
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
                    Add Inventory Adjustment
                  </h1>
                </div>
              </div>
              <div className="col-auto">
                <div className="hstack gap-2 justify-content-end">
                  <Link to="/inventoryadjustment">
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
                  Mode Of Adjustment <span className="text-danger">*</span>
                </lable>
                <div className="mb-3">
                  <input
                    type="text"
                    name="modeOfAdjustment"
                    className={`form-control ${
                      formik.touched.modeOfAdjustment &&
                      formik.errors.modeOfAdjustment
                        ? "is-invalid"
                        : ""
                    }`}
                    {...formik.getFieldProps("modeOfAdjustment")}
                  />
                  {formik.touched.modeOfAdjustment &&
                    formik.errors.modeOfAdjustment && (
                      <div className="invalid-feedback">
                        {formik.errors.modeOfAdjustment}
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
                    name="reference_number"
                    className={`form-control  ${
                      formik.touched.reference_number &&
                      formik.errors.reference_number
                        ? "is-invalid"
                        : ""
                    }`}
                    {...formik.getFieldProps("reference_number")}
                  />
                  {formik.touched.reference_number &&
                    formik.errors.reference_number && (
                      <div className="invalid-feedback">
                        {formik.errors.reference_number}
                      </div>
                    )}
                </div>
              </div>

              <div className="col-md-6 col-12 mb-2">
                <lable className="form-lable">
                  Date<span className="text-danger">*</span>
                </lable>
                <div className="mb-3">
                  <input
                    type="date"
                    name="date"
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
              </div>
              <div className="col-md-6 col-12 mb-2">
                <lable className="form-lable">
                  Account Id<span className="text-danger">*</span>
                </lable>
                <div className="mb-3">
                  <input
                    type="text"
                    name="email"
                    className={`form-control  ${
                      formik.touched.email && formik.errors.email
                        ? "is-invalid"
                        : ""
                    }`}
                    {...formik.getFieldProps("email")}
                  />
                  {formik.touched.email && formik.errors.email && (
                    <div className="invalid-feedback">
                      {formik.errors.email}
                    </div>
                  )}
                </div>
              </div>

              <div className="col-md-6 col-12 mb-2">
                <lable className="form-lable">
                  Reason<span className="text-danger">*</span>
                </lable>
                <div className="mb-3">
                  <input
                    type="text"
                    name="reason"
                    className={`form-control  ${
                      formik.touched.reason && formik.errors.reason
                        ? "is-invalid"
                        : ""
                    }`}
                    {...formik.getFieldProps("reason")}
                  />
                  {formik.touched.reason && formik.errors.reason && (
                    <div className="invalid-feedback">
                      {formik.errors.reason}
                    </div>
                  )}
                </div>
              </div>

              <div className="col-md-6 col-12 mb-2">
                <lable className="form-lable">
                  Descending Of Adjustment<span className="text-danger">*</span>
                </lable>
                <div className="mb-3">
                  <input
                    type="text"
                    name="descOfAdjustment"
                    className={`form-control  ${
                      formik.touched.descOfAdjustment &&
                      formik.errors.descOfAdjustment
                        ? "is-invalid"
                        : ""
                    }`}
                    {...formik.getFieldProps("descOfAdjustment")}
                  />
                  {formik.touched.descOfAdjustment &&
                    formik.errors.descOfAdjustment && (
                      <div className="invalid-feedback">
                        {formik.errors.descOfAdjustment}
                      </div>
                    )}
                </div>
              </div>
              {/* <div className="col-md-6 col-12 mb-2">
                <lable className="form-lable">
                  Inventory Adjustment File
                  <span className="text-danger">*</span>
                </lable>
                <div className="mb-3">
                  <input
                    type="file"
                    name="inventoryAdjustmentsFile"
                    className={`form-control  ${
                      formik.touched.inventoryAdjustmentsFile &&
                      formik.errors.inventoryAdjustmentsFile
                        ? "is-invalid"
                        : ""
                    }`}
                    {...formik.getFieldProps("inventoryAdjustmentsFile")}
                  />
                  {formik.touched.inventoryAdjustmentsFile &&
                    formik.errors.inventoryAdjustmentsFile && (
                      <div className="invalid-feedback">
                        {formik.errors.inventoryAdjustmentsFile}
                      </div>
                    )}
                </div>
              </div> */}
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default InventoryAdjustmentAdd;
