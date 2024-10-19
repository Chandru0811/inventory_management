import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import api from "../../../../config/URL";
import toast from "react-hot-toast";
import WareHouse from "./WareHouse";

const WareHouseEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoadIndicator] = useState(false);

  const validationSchema = Yup.object({
    contactName: Yup.string().required("*Contact Name is required"),
    accNumber: Yup.string().required("*Account Number is required"),
    primaryContact: Yup.string().required("*Primary Contact is required"),
    email: Yup.string().required("*Email is required"),
    phone: Yup.number().required("*Phone is required"),
    website: Yup.string().required("*Website is required"),
    bankAccName: Yup.string().required("*Account Name is required"),
    bankAccNumber: Yup.string().required("*Account Number is required"),

    // deliCountry: Yup.number().required("*Country is required"),
    // deliAddress: Yup.string().required("*Address is required"),
    // deliCity: Yup.string().required("*City is required"),
    // deliState: Yup.string().required("*State is required"),
    // deliZip: Yup.number().required("*Zip is required"),
    // deliAttention: Yup.number().required("*Attention is required"),

    // billCountry: Yup.number().required("*Country is required"),
    // billAddress: Yup.string().required("*Address is required"),
    // billCity: Yup.string().required("*City is required"),
    // billState: Yup.string().required("*State is required"),
    // billZip: Yup.number().required("*Zip is required"),
    // billAttention: Yup.number().required("*Attention is required"),
    // notes: Yup.number().required("*Remarks is required"),
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
      //   try {
      //     const response = await api.put(`/updateMstrCustomer/${id}`, values, {});
      //     if (response.status === 200) {
      //       toast.success(response.data.message);
      //       navigate("/customer");
      //     } else {
      //       toast.error(response.data.message);
      //     }
      //   } catch (e) {
      //     toast.error("Error fetching data: ", e?.response?.data?.message);
      //   } finally {
      //     setLoadIndicator(false);
      //   }
    },
  });

  useEffect(() => {
    const getData = async () => {
      //   try {
      //     const response = await api.get(`/getMstrCustomerById/${id}`);
      //     formik.setValues(response.data);
      //   } catch (e) {
      //     toast.error("Error fetching data: ", e?.response?.data?.message);
      //   }
    };

    getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
                  <h1 className="h4 ls-tight headingColor">Edit Ware House</h1>
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
                    name="contactName"
                    className={`form-control ${
                      formik.touched.contactName && formik.errors.contactName
                        ? "is-invalid"
                        : ""
                    }`}
                    {...formik.getFieldProps("contactName")}
                  />
                  {formik.touched.contactName && formik.errors.contactName && (
                    <div className="invalid-feedback">
                      {formik.errors.contactName}
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
                    type="text"
                    name="contactName"
                    className={`form-control ${
                      formik.touched.contactName && formik.errors.contactName
                        ? "is-invalid"
                        : ""
                    }`}
                    {...formik.getFieldProps("contactName")}
                  />
                  {formik.touched.contactName && formik.errors.contactName && (
                    <div className="invalid-feedback">
                      {formik.errors.contactName}
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
                  Street1<span className="text-danger">*</span>
                </lable>
                <div className="mb-3">
                  <input
                    type="text"
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
                <lable className="form-lable">
                  Street2<span className="text-danger">*</span>
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
                  City<span className="text-danger">*</span>
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
                  Country<span className="text-danger">*</span>
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
                  State
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
                  Zip Code
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
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default WareHouseEdit;
