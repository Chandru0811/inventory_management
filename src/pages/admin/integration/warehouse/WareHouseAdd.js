import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import api from "../../../../config/URL";
import toast from "react-hot-toast";

const WareHouseAdd = () => {
  const navigate = useNavigate();
  const [loading, setLoadIndicator] = useState(false);

  const validationSchema = Yup.object({
    warehouseName: Yup.string().required("*warehouse Name is required"),
  });
  const formik = useFormik({
    initialValues: {
      warehouseName:"",
      attention:"",
      street1:"",
      street2:"",
      city:"",
      country:"",
      state:"",
      zipCode:"",
      phone:"",
      email:""
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      setLoadIndicator(true);
      console.log(values);
      try {
        const response = await api.post("/createWarehouses", values, {});
        if (response.status === 201) {
          toast.success(response.data.message);
          navigate("/warehouse");
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
                  <h1 className="h4 ls-tight headingColor">Add Ware House</h1>
                </div>
              </div>
              <div className="col-auto">
                <div className="hstack gap-2 justify-content-end">
                  <Link to="/warehouse">
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
                  WareHouse Name <span className="text-danger">*</span>
                </lable>
                <div className="mb-3">
                  <input
                    type="text"
                    name="warehouseName"
                    className={`form-control ${
                      formik.touched.warehouseName && formik.errors.warehouseName
                        ? "is-invalid"
                        : ""
                    }`}
                    {...formik.getFieldProps("warehouseName")}
                  />
                  {formik.touched.warehouseName && formik.errors.warehouseName && (
                    <div className="invalid-feedback">
                      {formik.errors.warehouseName}
                    </div>
                  )}
                </div>
              </div>
              <div className="col-md-6 col-12 mb-2">
                <lable className="form-lable">
                  Email <span className="text-danger">*</span>
                </lable>
                <div className="mb-3">
                  <input
                    type="email"
                    name="email"
                    className={`form-control ${
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
                  Attention<span className="text-danger">*</span>
                </lable>
                <div className="mb-3">
                  <input
                    type="text"
                    name="attention"
                    className={`form-control  ${
                      formik.touched.attention && formik.errors.attention
                        ? "is-invalid"
                        : ""
                    }`}
                    {...formik.getFieldProps("attention")}
                  />
                  {formik.touched.attention && formik.errors.attention && (
                    <div className="invalid-feedback">
                      {formik.errors.attention}
                    </div>
                  )}
                </div>
              </div>
              <div className="col-md-6 col-12 mb-2">
                <lable className="form-lable">
                  phone<span className="text-danger">*</span>
                </lable>
                <div className="mb-3">
                  <input
                    type="text"
                    name="phone"
                    className={`form-control  ${
                      formik.touched.phone && formik.errors.phone
                        ? "is-invalid"
                        : ""
                    }`}
                    {...formik.getFieldProps("phone")}
                  />
                  {formik.touched.phone && formik.errors.phone && (
                    <div className="invalid-feedback">
                      {formik.errors.phone}
                    </div>
                  )}
                </div>
              </div>

              <div className="col-md-6 col-12 mb-2">
                <lable className="form-lable">
                  Street1<span className="text-danger">*</span>
                </lable>
                <div className="mb-3">
                  <input
                    type="text"
                    name="street1"
                    className={`form-control ${
                      formik.touched.street1 &&
                      formik.errors.street1
                        ? "is-invalid"
                        : ""
                    }`}
                    {...formik.getFieldProps("street1")}
                  />
                  {formik.touched.street1 &&
                    formik.errors.street1 && (
                      <div className="invalid-feedback">
                        {formik.errors.street1}
                      </div>
                    )}
                </div>
              </div>
              <div className="col-md-6 col-12 mb-2">
                <lable className="form-lable">
                  Street2<span className="text-danger">*</span>
                </lable>
                <div className="mb-3">
                  <input
                    type="text"
                    name="street2"
                    className={`form-control  ${
                      formik.touched.street2 && formik.errors.street2
                        ? "is-invalid"
                        : ""
                    }`}
                    {...formik.getFieldProps("street2")}
                  />
                  {formik.touched.street2 && formik.errors.street2 && (
                    <div className="invalid-feedback">
                      {formik.errors.street2}
                    </div>
                  )}
                </div>
              </div>

              <div className="col-md-6 col-12 mb-2">
                <lable className="form-lable">
                  City<span className="text-danger">*</span>
                </lable>
                <div className="mb-3">
                  <input
                    type="text"
                    name="city"
                    className={`form-control  ${
                      formik.touched.city && formik.errors.city
                        ? "is-invalid"
                        : ""
                    }`}
                    {...formik.getFieldProps("city")}
                  />
                  {formik.touched.city && formik.errors.city && (
                    <div className="invalid-feedback">
                      {formik.errors.city}
                    </div>
                  )}
                </div>
              </div>

              <div className="col-md-6 col-12 mb-2">
                <lable className="form-lable">
                  Country<span className="text-danger">*</span>
                </lable>
                <div className="mb-3">
                  <input
                    type="text"
                    name="country"
                    className={`form-control  ${
                      formik.touched.country &&
                      formik.errors.country
                        ? "is-invalid"
                        : ""
                    }`}
                    {...formik.getFieldProps("country")}
                  />
                  {formik.touched.country &&
                    formik.errors.country && (
                      <div className="invalid-feedback">
                        {formik.errors.country}
                      </div>
                    )}
                </div>
              </div>
              <div className="col-md-6 col-12 mb-2">
                <lable className="form-lable">
                  State
                  <span className="text-danger">*</span>
                </lable>
                <div className="mb-3">
                  <input
                    type="text"
                    name="state"
                    className={`form-control  ${
                      formik.touched.state && formik.errors.state
                        ? "is-invalid"
                        : ""
                    }`}
                    {...formik.getFieldProps("state")}
                  />
                  {formik.touched.state && formik.errors.state && (
                    <div className="invalid-feedback">
                      {formik.errors.state}
                    </div>
                  )}
                </div>
              </div>
              <div className="col-md-6 col-12 mb-2">
                <lable className="form-lable">
                  Zip Code
                  <span className="text-danger">*</span>
                </lable>
                <div className="mb-3">
                  <input
                    type="text"
                    name="zipCode"
                    className={`form-control  ${
                      formik.touched.zipCode && formik.errors.zipCode
                        ? "is-invalid"
                        : ""
                    }`}
                    {...formik.getFieldProps("zipCode")}
                  />
                  {formik.touched.zipCode && formik.errors.zipCode && (
                    <div className="invalid-feedback">
                      {formik.errors.zipCode}
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

export default WareHouseAdd;
