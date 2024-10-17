import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import api from "../../../config/URL"
import toast from "react-hot-toast";

const CustomerEdit = () => {
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
  })

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
        const response = await api.put(`/updateMstrCustomer/${id}`, values, {
        });
        if (response.status === 200) {
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

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await api.get(`/getMstrCustomerById/${id}`);
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
        <div className="card shadow border-0 mb-2 top-header">
          <div className="container-fluid py-4">
            <div className="row align-items-center">
              <div className="col">
                <div className="d-flex align-items-center gap-4">
                  <h1 className="h4 ls-tight headingColor">Edit Customer</h1>
                </div>
              </div>
              <div className="col-auto">
                <div className="hstack gap-2 justify-content-end">
                  <Link to="/customer">
                    <button type="submit" className="btn btn-sm btn-light">
                      <span>Back</span>
                    </button>
                  </Link>
                  <button type="submit" className="btn btn-sm btn-button" disabled={loading}>
                    {loading ? (
                      <span className="spinner-border spinner-border-sm" aria-hidden="true"></span>
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

        <div className="card shadow border-0 my-2">
          <div className="row mt-3 me-2">
            <div className="col-12 text-end">

            </div>
          </div>
          <div className="container mb-5">
            <div className="row py-4">
              <div className="col-md-6 col-12 mb-2">
                <lable className="form-lable">
                  Customer Name
                </lable>
                <div className="mb-3">
                  <input
                    type="text"
                    name="contactName"
                    className={`form-control ${formik.touched.contactName && formik.errors.contactName
                      ? "is-invalid"
                      : ""
                      }`}
                    {...formik.getFieldProps("contactName")}
                  />
                  {formik.touched.contactName &&
                    formik.errors.contactName && (
                      <div className="invalid-feedback">
                        {formik.errors.contactName}
                      </div>
                    )}
                </div>
              </div>
              <div className="col-md-6 col-12 mb-2">
                <lable className="form-lable">
                  Account Number
                </lable>
                <div className="mb-3">
                  <input
                    type="text"
                    name="accNumber"
                    className={`form-control  ${formik.touched.accNumber && formik.errors.accNumber
                      ? "is-invalid"
                      : ""
                      }`}
                    {...formik.getFieldProps("accNumber")}
                  />
                  {formik.touched.accNumber &&
                    formik.errors.accNumber && (
                      <div className="invalid-feedback">
                        {formik.errors.accNumber}
                      </div>
                    )}
                </div>
              </div>

              <div className="col-md-6 col-12 mb-2">
                <lable className="form-lable">
                  Primary Contact
                </lable>
                <div className="mb-3">
                  <input
                    type="text"
                    name="primaryContact"
                    className={`form-control ${formik.touched.primaryContact && formik.errors.primaryContact
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
                  Customer Email
                </lable>
                <div className="mb-3">
                  <input
                    type="text"
                    name="email"
                    className={`form-control  ${formik.touched.email && formik.errors.email
                      ? "is-invalid"
                      : ""
                      }`}
                    {...formik.getFieldProps("email")}
                  />
                  {formik.touched.email &&
                    formik.errors.email && (
                      <div className="invalid-feedback">
                        {formik.errors.email}
                      </div>
                    )}
                </div>
              </div>

              <div className="col-md-6 col-12 mb-2">
                <lable className="form-lable">
                  Customer Phone
                </lable>
                <div className="mb-3">
                  <input
                    type="text"
                    name="phone"
                    className={`form-control  ${formik.touched.phone && formik.errors.phone
                      ? "is-invalid"
                      : ""
                      }`}
                    {...formik.getFieldProps("phone")}
                  />
                  {formik.touched.phone &&
                    formik.errors.phone && (
                      <div className="invalid-feedback">
                        {formik.errors.phone}
                      </div>
                    )}
                </div>
              </div>

              <div className="col-md-6 col-12 mb-2">
                <lable className="form-lable">
                  Website
                </lable>
                <div className="mb-3">
                  <input
                    type="text"
                    name="website"
                    className={`form-control  ${formik.touched.website && formik.errors.website
                      ? "is-invalid"
                      : ""
                      }`}
                    {...formik.getFieldProps("website")}
                  />
                  {formik.touched.website &&
                    formik.errors.website && (
                      <div className="invalid-feedback">
                        {formik.errors.website}
                      </div>
                    )}
                </div>
              </div>

              <div className="col-md-6 col-12 mb-2">
                <lable className="form-lable">
                  Bank Name
                </lable>
                <div className="mb-3">
                  <input
                    type="text"
                    name="bankAccName"
                    className={`form-control  ${formik.touched.bankAccName && formik.errors.bankAccName
                      ? "is-invalid"
                      : ""
                      }`}
                    {...formik.getFieldProps("bankAccName")}
                  />
                  {formik.touched.bankAccName &&
                    formik.errors.bankAccName && (
                      <div className="invalid-feedback">
                        {formik.errors.bankAccName}
                      </div>
                    )}
                </div>
              </div>

              <div className="col-md-6 col-12 mb-2">
                <lable className="form-lable">
                  Bank Account Number
                </lable>
                <div className="mb-3">
                  <input
                    type="text"
                    name="bankAccNumber"
                    className={`form-control  ${formik.touched.bankAccNumber && formik.errors.bankAccNumber
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

              <div className="col-12 mb-2 d-flex justify-content-end align-items-end">
                <div className="form-check">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id="copyAddress"
                    onChange={(e) => {
                      if (e.target.checked) {
                        formik.setFieldValue("billCountry", formik.values.deliCountry);
                        formik.setFieldValue("billAddress", formik.values.deliAddress);
                        formik.setFieldValue("billCity", formik.values.deliCity);
                        formik.setFieldValue("billState", formik.values.deliState);
                        formik.setFieldValue("billZip", formik.values.deliZip);
                        formik.setFieldValue("billAttention", formik.values.deliAttention);
                      }
                    }}
                  />
                  <label className="form-check-label" htmlFor="copyAddress">
                    Same as Shipping Address
                  </label>
                </div>
              </div>
              <div className="col-md-6 col-12 mb-2">
                <h3 className="my-5">Shipping Address</h3>
                <label className="form-label">
                  Shipping Country
                </label>
                <div className="mb-3">
                  <input
                    type="text"
                    name="deliCountry"
                    className={`form-control`}
                    {...formik.getFieldProps("deliCountry")}
                  />
                </div>
              </div>

              <div className="col-md-6 col-12 mb-2">
                <h3 className="my-5">Billing Address</h3>
                <label className="form-label">
                  Billing Country
                </label>
                <div className="mb-3">
                  <input
                    type="text"
                    name="billCountry"
                    className={`form-control`}
                    {...formik.getFieldProps("billCountry")}
                  />
                </div>
              </div>



              <div className="container mb-5">
                <div className="row py-4">
                  <div className="col-md-6 col-12 mb-2">
                    <label className="form-label">
                      Shipping Address
                    </label>
                    <div className="mb-3">
                      <input
                        type="text"
                        name="deliAddress"
                        className={`form-control ${formik.touched.deliAddress && formik.errors.deliAddress ? "is-invalid" : ""
                          }`}
                        {...formik.getFieldProps("deliAddress")}
                      />
                      {formik.touched.deliAddress && formik.errors.deliAddress && (
                        <div className="invalid-feedback">
                          {formik.errors.deliAddress}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="col-md-6 col-12 mb-2">
                    <label className="form-label">
                      Billing Address
                    </label>
                    <div className="mb-3">
                      <input
                        type="text"
                        name="billAddress"
                        className={`form-control ${formik.touched.billAddress && formik.errors.billAddress ? "is-invalid" : ""
                          }`}
                        {...formik.getFieldProps("billAddress")}
                      />
                      {formik.touched.billAddress && formik.errors.billAddress && (
                        <div className="invalid-feedback">
                          {formik.errors.billAddress}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="col-md-6 col-12 mb-2">
                    <label className="form-label">
                      Shipping City
                    </label>
                    <div className="mb-3">
                      <input
                        type="text"
                        name="deliCity"
                        className={`form-control ${formik.touched.deliCity && formik.errors.deliCity ? "is-invalid" : ""
                          }`}
                        {...formik.getFieldProps("deliCity")}
                      />
                      {formik.touched.deliCity && formik.errors.deliCity && (
                        <div className="invalid-feedback">
                          {formik.errors.deliCity}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="col-md-6 col-12 mb-2">
                    <label className="form-label">
                      Billing City
                    </label>
                    <div className="mb-3">
                      <input
                        type="text"
                        name="billCity"
                        className={`form-control ${formik.touched.billCity && formik.errors.billCity ? "is-invalid" : ""
                          }`}
                        {...formik.getFieldProps("billCity")}
                      />
                      {formik.touched.billCity && formik.errors.billCity && (
                        <div className="invalid-feedback">
                          {formik.errors.billCity}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="col-md-6 col-12 mb-2">
                    <label className="form-label">
                      Shipping State
                    </label>
                    <div className="mb-3">
                      <input
                        type="text"
                        name="deliState"
                        className={`form-control ${formik.touched.deliState && formik.errors.deliState ? "is-invalid" : ""
                          }`}
                        {...formik.getFieldProps("deliState")}
                      />
                      {formik.touched.deliState && formik.errors.deliState && (
                        <div className="invalid-feedback">
                          {formik.errors.deliState}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="col-md-6 col-12 mb-2">
                    <label className="form-label">
                      Billing State
                    </label>
                    <div className="mb-3">
                      <input
                        type="text"
                        name="billState"
                        className={`form-control ${formik.touched.billState && formik.errors.billState ? "is-invalid" : ""
                          }`}
                        {...formik.getFieldProps("billState")}
                      />
                      {formik.touched.billState && formik.errors.billState && (
                        <div className="invalid-feedback">
                          {formik.errors.billState}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="col-md-6 col-12 mb-2">
                    <label className="form-label">
                      Shipping Zip Code
                    </label>
                    <div className="mb-3">
                      <input
                        type="text"
                        name="deliZip"
                        className={`form-control ${formik.touched.deliZip && formik.errors.deliZip ? "is-invalid" : ""
                          }`}
                        {...formik.getFieldProps("deliZip")}
                      />
                      {formik.touched.deliZip && formik.errors.deliZip && (
                        <div className="invalid-feedback">
                          {formik.errors.deliZip}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="col-md-6 col-12 mb-2">
                    <label className="form-label">
                      Billing Zip Code
                    </label>
                    <div className="mb-3">
                      <input
                        type="text"
                        name="billZip"
                        className={`form-control ${formik.touched.billZip && formik.errors.billZip ? "is-invalid" : ""
                          }`}
                        {...formik.getFieldProps("billZip")}
                      />
                      {formik.touched.billZip && formik.errors.billZip && (
                        <div className="invalid-feedback">
                          {formik.errors.billZip}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="col-md-6 col-12 mb-2">
                    <label className="form-label">
                      Shipping Attention
                    </label>
                    <div className="mb-3">
                      <input
                        type="text"
                        name="deliAttention"
                        className={`form-control ${formik.touched.deliAttention && formik.errors.deliAttention ? "is-invalid" : ""
                          }`}
                        {...formik.getFieldProps("deliAttention")}
                      />
                      {formik.touched.deliAttention && formik.errors.deliAttention && (
                        <div className="invalid-feedback">
                          {formik.errors.deliAttention}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="col-md-6 col-12 mb-2">
                    <label className="form-label">
                      Billing Attention
                    </label>
                    <div className="mb-3">
                      <input
                        type="text"
                        name="billAttention"
                        className={`form-control ${formik.touched.billAttention && formik.errors.billAttention ? "is-invalid" : ""
                          }`}
                        {...formik.getFieldProps("billAttention")}
                      />
                      {formik.touched.billAttention && formik.errors.billAttention && (
                        <div className="invalid-feedback">
                          {formik.errors.billAttention}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="col-12">
                    <label htmlFor="exampleFormControlInput1" className="form-label">
                      Remarks
                    </label>
                    <div className="input-group mb-3">
                      <textarea
                        className="form-control"
                        {...formik.getFieldProps("notes")}
                        id="exampleFormControlTextarea1"
                        rows="5"
                      ></textarea>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}

export default CustomerEdit
