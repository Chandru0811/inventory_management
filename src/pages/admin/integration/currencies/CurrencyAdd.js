import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import api from "../../../../config/URL";
import toast from "react-hot-toast";

const CurrencyAdd = () => {
  const navigate = useNavigate();
  const [loading, setLoadIndicator] = useState(false);

  const validationSchema = Yup.object({
    currencyName: Yup.string().required("*Currency Name is required"),
  });
  const formik = useFormik({
    initialValues: {
      currencyName: "",
      currencyCode: "",
      currencySymbol: "",
      decimalPlaces: "",
      format: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      setLoadIndicator(true);
      console.log(values);
      try {
        const response = await api.post("/createCurrency", values);
        if (response.status === 201) {
          toast.success(response.data.message);
          navigate("/currency");
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
                  <h1 className="h4 ls-tight headingColor">Add Currency</h1>
                </div>
              </div>
              <div className="col-auto">
                <div className="hstack gap-2 justify-content-end">
                  <Link to="/currency">
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
          style={{ borderRadius: "0",minHeight:"70vh" }}
        >
          <div className="row mt-3 me-2">
            <div className="col-12 text-end"></div>
          </div>
          <div className="container mb-5">
            <div className="row py-4">
              <div className="col-md-6 col-12 mb-2">
                <lable className="form-lable">
                  Currency Name<span className="text-danger">*</span>
                </lable>
                <div className="mb-3">
                  <input
                    type="text"
                    name="currencyName"
                    className={`form-control ${
                      formik.touched.currencyName && formik.errors.currencyName
                        ? "is-invalid"
                        : ""
                    }`}
                    {...formik.getFieldProps("currencyName")}
                  />
                  {formik.touched.currencyName &&
                    formik.errors.currencyName && (
                      <div className="invalid-feedback">
                        {formik.errors.currencyName}
                      </div>
                    )}
                </div>
              </div>
              <div className="col-md-6 col-12 mb-2">
                <lable className="form-lable">
                  Currency Code<span className="text-danger">*</span>
                </lable>
                <div className="mb-3">
                  <input
                    type="text"
                    name="currencyCode"
                    className={`form-control ${
                      formik.touched.currencyCode && formik.errors.currencyCode
                        ? "is-invalid"
                        : ""
                    }`}
                    {...formik.getFieldProps("currencyCode")}
                  />
                  {formik.touched.currencyCode &&
                    formik.errors.currencyCode && (
                      <div className="invalid-feedback">
                        {formik.errors.currencyCode}
                      </div>
                    )}
                </div>
              </div>
              <div className="col-md-6 col-12 mb-2">
                <lable className="form-lable">
                  Currency Symbol<span className="text-danger">*</span>
                </lable>
                <div className="mb-3">
                  <input
                    type="text"
                    name="currencySymbol"
                    className={`form-control  ${
                      formik.touched.currencySymbol &&
                      formik.errors.currencySymbol
                        ? "is-invalid"
                        : ""
                    }`}
                    {...formik.getFieldProps("currencySymbol")}
                  />
                  {formik.touched.currencySymbol &&
                    formik.errors.currencySymbol && (
                      <div className="invalid-feedback">
                        {formik.errors.currencySymbol}
                      </div>
                    )}
                </div>
              </div>

              <div className="col-md-6 col-12 mb-2">
                <lable className="form-lable">
                  Decimal Places<span className="text-danger">*</span>
                </lable>
                <div className="mb-3">
                  <input
                    type="text"
                    name="decimalPlaces"
                    className={`form-control ${
                      formik.touched.decimalPlaces &&
                      formik.errors.decimalPlaces
                        ? "is-invalid"
                        : ""
                    }`}
                    {...formik.getFieldProps("decimalPlaces")}
                  />
                  {formik.touched.decimalPlaces &&
                    formik.errors.decimalPlaces && (
                      <div className="invalid-feedback">
                        {formik.errors.decimalPlaces}
                      </div>
                    )}
                </div>
              </div>
              <div className="col-md-6 col-12 mb-2">
                <lable className="form-lable">
                  Format<span className="text-danger">*</span>
                </lable>
                <div className="mb-3">
                  <input
                    type="text"
                    name="format"
                    className={`form-control  ${
                      formik.touched.format && formik.errors.format
                        ? "is-invalid"
                        : ""
                    }`}
                    {...formik.getFieldProps("format")}
                  />
                  {formik.touched.format && formik.errors.format && (
                    <div className="invalid-feedback">
                      {formik.errors.format}
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

export default CurrencyAdd;
