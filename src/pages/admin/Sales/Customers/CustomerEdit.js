import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import api from "../../../../config/URL";
import toast from "react-hot-toast";
import { TbXboxX } from "react-icons/tb";

const CustomerEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoadIndicator] = useState(false);
  const [activeTab, setActiveTab] = useState("otherDetails");
  const [rows, setRows] = useState([
    {
      id: 1,
      salutation: "",
      firstName: "",
      lastName: "",
      email: "",
      workPhone: "",
      mobile: "",
      skype: "",
      designation: "",
      department: "",
    },
  ]);

  const validationSchema = Yup.object({
    customerType: Yup.string().required("*Customer Type is required"),
    companyName: Yup.string().required("*Company Name is required"),
    primaryContact: Yup.string().required("*Primary Contact is required"),
    customerEmail: Yup.string().required("*Email is required"),
    customerPhoneNumber: Yup.string().required("*Phone is required"),
    customerDisplayName: Yup.string().required("*Display Name is required"),
  });

  const formik = useFormik({
    initialValues: {
      // companyName: "",
      customerType: "",
      companyName: "",
      primaryContact: "",
      customerEmail: "",
      customerPhoneNumber: "",
      customerDisplayName: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      setLoadIndicator(true);
      console.log(values);
      const payload = {
        ...values,
        customerPhoneNumber: Number(values.customerPhoneNumber) || 0,
      };
      try {
        const response = await api.put(`/updateCustomers/${id}`, payload, {});
        if (response.status === 201) {
          toast.success(response.data.message);
          navigate("/customers");
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
  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };
  const addRow = () => {
    setRows([
      ...rows,
      {
        id: rows.length + 1,
        salutation: "",
        firstName: "",
        lastName: "",
        email: "",
        workPhone: "",
        mobile: "",
        skype: "",
        designation: "",
        department: "",
      },
    ]);
  };

  const handleInputChange = (index, field, value) => {
    const updatedRows = rows.map((row, rowIndex) =>
      rowIndex === index ? { ...row, [field]: value } : row
    );
    setRows(updatedRows);
  };

  const deleteRow = (index) => {
    const updatedRows = rows.filter((_, rowIndex) => rowIndex !== index);
    setRows(updatedRows);
  };

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await api.get(`/getAllCustomersById/${id}`);
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
        <div
          className="card shadow border-0 mb-2 top-header"
          style={{ borderRadius: "0" }}
        >
          <div className="container-fluid py-4">
            <div className="row align-items-center">
              <div className="col">
                <div className="d-flex align-items-center gap-4">
                  <h1 className="h4 ls-tight headingColor">Edit Customer</h1>
                </div>
              </div>
              <div className="col-auto">
                <div className="hstack gap-2 justify-content-end">
                  <Link to="/customers">
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

        <div
          className="card shadow border-0 my-2"
          style={{ borderRadius: "0" }}
        >
          <div className="container mb-5">
            <div className="row py-4">
              <div className="col-md-6 col-12 mb-2">
                <lable className="form-lable">
                  Customer Type<span className="text-danger">*</span>
                </lable>
                <div className="mb-3">
                  <select
                    name="customerType"
                    className={`form-select  ${
                      formik.touched.customerType && formik.errors.customerType
                        ? "is-invalid"
                        : ""
                    }`}
                    {...formik.getFieldProps("customerType")}
                  >
                    <option value=""></option>
                    <option value="Business">Business</option>
                    {/* <option value="INDIVITUALS">Individual</option> */}
                  </select>
                  {formik.touched.customerType &&
                    formik.errors.customerType && (
                      <div className="invalid-feedback">
                        {formik.errors.customerType}
                      </div>
                    )}
                </div>
              </div>
              <div className="col-md-6 col-12 mb-2">
                <lable className="form-lable">
                  Company Name<span className="text-danger">*</span>
                </lable>
                <div className="mb-3">
                  <input
                    type="text"
                    name="companyName"
                    className={`form-control ${
                      formik.touched.companyName && formik.errors.companyName
                        ? "is-invalid"
                        : ""
                    }`}
                    {...formik.getFieldProps("companyName")}
                  />
                  {formik.touched.companyName && formik.errors.companyName && (
                    <div className="invalid-feedback">
                      {formik.errors.companyName}
                    </div>
                  )}
                </div>
              </div>

              <div className="col-md-6 col-12 mb-2">
                <lable className="form-lable">
                  Primary Contact<span className="text-danger">*</span>
                </lable>
                <div className="mb-3">
                  <input
                    type="text"
                    name="primaryContact"
                    className={`form-control  ${
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
                  Customer Email<span className="text-danger">*</span>
                </lable>
                <div className="mb-3">
                  <input
                    type="text"
                    name="customerEmail"
                    className={`form-control  ${
                      formik.touched.customerEmail &&
                      formik.errors.customerEmail
                        ? "is-invalid"
                        : ""
                    }`}
                    {...formik.getFieldProps("customerEmail")}
                  />
                  {formik.touched.customerEmail &&
                    formik.errors.customerEmail && (
                      <div className="invalid-feedback">
                        {formik.errors.customerEmail}
                      </div>
                    )}
                </div>
              </div>

              <div className="col-md-6 col-12 mb-2">
                <lable className="form-lable">
                  Customer Phone<span className="text-danger">*</span>
                </lable>
                <div className="mb-3">
                  <input
                    type="text"
                    name="customerPhoneNumber"
                    className={`form-control  ${
                      formik.touched.customerPhoneNumber &&
                      formik.errors.customerPhoneNumber
                        ? "is-invalid"
                        : ""
                    }`}
                    {...formik.getFieldProps("customerPhoneNumber")}
                  />
                  {formik.touched.customerPhoneNumber &&
                    formik.errors.customerPhoneNumber && (
                      <div className="invalid-feedback">
                        {formik.errors.customerPhoneNumber}
                      </div>
                    )}
                </div>
              </div>

              <div className="col-md-6 col-12 mb-2">
                <lable className="form-lable">
                  Customer Display Name<span className="text-danger">*</span>
                </lable>
                <div className="mb-3">
                  <input
                    type="text"
                    name="customerDisplayName"
                    className={`form-control  ${
                      formik.touched.customerDisplayName &&
                      formik.errors.customerDisplayName
                        ? "is-invalid"
                        : ""
                    }`}
                    {...formik.getFieldProps("customerDisplayName")}
                  />
                  {formik.touched.customerDisplayName &&
                    formik.errors.customerDisplayName && (
                      <div className="invalid-feedback">
                        {formik.errors.customerDisplayName}
                      </div>
                    )}
                </div>
              </div>
              <ul
              className="nav nav-underline border-bottom"
              style={{ cursor: "pointer" }}
            >
              <li className="nav-item">
                <span
                  className={`nav-link ${
                    activeTab === "otherDetails" ? "active" : ""
                  }`}
                  onClick={() => handleTabClick("otherDetails")}
                >
                  Other Details
                </span>
              </li>
              <li className="nav-item">
                <span
                  className={`nav-link ${
                    activeTab === "address" ? "active" : ""
                  }`}
                  onClick={() => handleTabClick("address")}
                >
                  Address
                </span>
              </li>
              <li className="nav-item">
                <span
                  className={`nav-link ${
                    activeTab === "contactPersons" ? "active" : ""
                  }`}
                  onClick={() => handleTabClick("contactPersons")}
                >
                  Contact Persons
                </span>
              </li>
              <li className="nav-item">
                <span
                  className={`nav-link ${
                    activeTab === "customFields" ? "active" : ""
                  }`}
                  onClick={() => handleTabClick("customFields")}
                >
                  Custom Fields
                </span>
              </li>
              <li className="nav-item">
                <span
                  className={`nav-link ${
                    activeTab === "reportingTags" ? "active" : ""
                  }`}
                  onClick={() => handleTabClick("reportingTags")}
                >
                  Reporting Tags
                </span>
              </li>
              <li className="nav-item">
                <span
                  className={`nav-link ${
                    activeTab === "remarks" ? "active" : ""
                  }`}
                  onClick={() => handleTabClick("remarks")}
                >
                  Remarks
                </span>
              </li>
            </ul>
            </div>
          </div>
          <div className="mt-3">
            {activeTab === "otherDetails" && (
              <div className="row container-fluid">
                <div className="col-md-6 col-12 mb-2">
                  <lable className="form-lable">Pan</lable>
                  <div className="mb-3">
                    <input
                      type="text"
                      name="pan"
                      className={`form-control  ${
                        formik.touched.pan && formik.errors.pan
                          ? "is-invalid"
                          : ""
                      }`}
                      {...formik.getFieldProps("pan")}
                    />
                    {formik.touched.pan && formik.errors.pan && (
                      <div className="invalid-feedback">
                        {formik.errors.pan}
                      </div>
                    )}
                  </div>
                </div>
                <div className="col-md-6 col-12 mb-2">
                  <lable className="form-lable">Currency</lable>
                  <div className="mb-3">
                    <select
                      type="text"
                      name="currency"
                      className={`form-select  ${
                        formik.touched.currency && formik.errors.currency
                          ? "is-invalid"
                          : ""
                      }`}
                      {...formik.getFieldProps("currency")}
                      disabled
                    >
                      <option value="Indian Rupee" selected>
                        Indian Rupee
                      </option>
                    </select>
                    {formik.touched.currency && formik.errors.currency && (
                      <div className="invalid-feedback">
                        {formik.errors.currency}
                      </div>
                    )}
                  </div>
                </div>
                <div className="col-md-6 col-12 mb-2">
                  <lable className="form-lable">Payment Terms</lable>
                  <div className="mb-3">
                    <select
                      type="text"
                      name="dueOnReceipt"
                      className={`form-select  ${
                        formik.touched.dueOnReceipt &&
                        formik.errors.dueOnReceipt
                          ? "is-invalid"
                          : ""
                      }`}
                      {...formik.getFieldProps("dueOnReceipt")}
                    >
                      <option value="DueOnReceipt" selected>
                        Due on Receipt
                      </option>
                    </select>
                    {formik.touched.dueOnReceipt &&
                      formik.errors.dueOnReceipt && (
                        <div className="invalid-feedback">
                          {formik.errors.dueOnReceipt}
                        </div>
                      )}
                  </div>
                </div>
                <div className="col-md-6 col-12 mb-2">
                  <lable className="form-lable">Price List</lable>
                  <div className="mb-3">
                    <select
                      type="text"
                      name="priceList"
                      className={`form-select  ${
                        formik.touched.priceList && formik.errors.priceList
                          ? "is-invalid"
                          : ""
                      }`}
                      {...formik.getFieldProps("priceList")}
                    >
                      <option value="Indian Rupee" selected>
                        Indian Rupee
                      </option>
                    </select>
                    {formik.touched.priceList && formik.errors.priceList && (
                      <div className="invalid-feedback">
                        {formik.errors.priceList}
                      </div>
                    )}
                  </div>
                </div>
                <div className="col-md-6 col-12 mb-2">
                  <lable className="form-lable">Document</lable>
                  <div className="mb-3">
                    <input
                      type="file"
                      name="document"
                      className={`form-control  ${
                        formik.touched.document && formik.errors.document
                          ? "is-invalid"
                          : ""
                      }`}
                      {...formik.getFieldProps("document")}
                    />
                    {formik.touched.document && formik.errors.document && (
                      <div className="invalid-feedback">
                        {formik.errors.document}
                      </div>
                    )}
                  </div>
                </div>
                <div className="col-md-6 col-12 mb-2">
                  <label className="form-label">Website URL</label>
                  <div className="input-group mb-3">
                    <span className="input-group-text">
                      <i className="fas fa-globe"></i>
                    </span>
                    <input
                      type="text"
                      name="websiteUrl"
                      className={`form-control ${
                        formik.touched.websiteUrl && formik.errors.websiteUrl
                          ? "is-invalid"
                          : ""
                      }`}
                      {...formik.getFieldProps("websiteUrl")}
                    />
                    {formik.touched.websiteUrl && formik.errors.websiteUrl && (
                      <div className="invalid-feedback">
                        {formik.errors.websiteUrl}
                      </div>
                    )}
                  </div>
                </div>
                <div className="col-md-6 col-12 mb-2">
                  <lable className="form-lable">Department</lable>
                  <div className="mb-3">
                    <input
                      type="text"
                      name="department"
                      className={`form-control  ${
                        formik.touched.department && formik.errors.department
                          ? "is-invalid"
                          : ""
                      }`}
                      {...formik.getFieldProps("department")}
                    />
                    {formik.touched.department && formik.errors.department && (
                      <div className="invalid-feedback">
                        {formik.errors.department}
                      </div>
                    )}
                  </div>
                </div>
                <div className="col-md-6 col-12 mb-2">
                  <lable className="form-lable">Designation</lable>
                  <div className="mb-3">
                    <input
                      type="text"
                      name="designation"
                      className={`form-control  ${
                        formik.touched.designation && formik.errors.designation
                          ? "is-invalid"
                          : ""
                      }`}
                      {...formik.getFieldProps("designation")}
                    />
                    {formik.touched.designation &&
                      formik.errors.designation && (
                        <div className="invalid-feedback">
                          {formik.errors.designation}
                        </div>
                      )}
                  </div>
                </div>
                <div className="col-md-6 col-12 mb-2">
                  <label className="form-label">Twitter</label>
                  <div className="input-group mb-3">
                    <span className="input-group-text">
                      <i className="fab fa-twitter"></i>
                    </span>
                    <input
                      type="text"
                      name="twitter"
                      className={`form-control ${
                        formik.touched.twitter && formik.errors.twitter
                          ? "is-invalid"
                          : ""
                      }`}
                      {...formik.getFieldProps("twitter")}
                    />
                    {formik.touched.twitter && formik.errors.twitter && (
                      <div className="invalid-feedback">
                        {formik.errors.twitter}
                      </div>
                    )}
                  </div>
                </div>
                <div className="col-md-6 col-12 mb-2">
                  <label className="form-label">Skype Name/Number</label>
                  <div className="input-group mb-3">
                    <span className="input-group-text">
                      <i className="fab fa-skype"></i>
                    </span>
                    <input
                      type="text"
                      name="skype"
                      className={`form-control ${
                        formik.touched.skype && formik.errors.skype
                          ? "is-invalid"
                          : ""
                      }`}
                      {...formik.getFieldProps("skype")}
                    />
                    {formik.touched.skype && formik.errors.skype && (
                      <div className="invalid-feedback">
                        {formik.errors.skype}
                      </div>
                    )}
                  </div>
                </div>
                <div className="col-md-6 col-12 mb-2">
                  <label className="form-label">Facebook</label>
                  <div className="input-group mb-3">
                    <span className="input-group-text">
                      <i className="fab fa-facebook"></i>
                    </span>
                    <input
                      type="text"
                      name="facebook"
                      className={`form-control ${
                        formik.touched.facebook && formik.errors.facebook
                          ? "is-invalid"
                          : ""
                      }`}
                      {...formik.getFieldProps("facebook")}
                    />
                    {formik.touched.facebook && formik.errors.facebook && (
                      <div className="invalid-feedback">
                        {formik.errors.facebook}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {activeTab === "address" && (
              <div className="container-fluid row">
                <div className="col-md-6 col-12">
                  <h3 className="ps-5">Billing Address</h3>
                  <div className="row">
                    <div className="col-12 mb-2">
                      <lable className="form-lable">Attention</lable>
                      <div className="mb-3">
                        <input
                          type="text"
                          name="billingAttention"
                          className={`form-control  ${
                            formik.touched.billingAttention &&
                            formik.errors.billingAttention
                              ? "is-invalid"
                              : ""
                          }`}
                          {...formik.getFieldProps("billingAttention")}
                        />
                        {formik.touched.billingAttention &&
                          formik.errors.billingAttention && (
                            <div className="invalid-feedback">
                              {formik.errors.billingAttention}
                            </div>
                          )}
                      </div>
                    </div>
                    <div className="col-12 mb-2">
                      <lable className="form-lable">Country/Region</lable>
                      <div className="mb-3">
                        <input
                          type="text"
                          name="billingCountryRegion"
                          className={`form-control  ${
                            formik.touched.billingCountryRegion &&
                            formik.errors.billingCountryRegion
                              ? "is-invalid"
                              : ""
                          }`}
                          {...formik.getFieldProps("billingCountryRegion")}
                        />
                        {formik.touched.billingCountryRegion &&
                          formik.errors.billingCountryRegion && (
                            <div className="invalid-feedback">
                              {formik.errors.billingCountryRegion}
                            </div>
                          )}
                      </div>
                    </div>
                    <div className="col-12 mb-2">
                      <lable className="form-lable">Address</lable>
                      <div className="mb-3">
                        <input
                          type="text"
                          name="billingAddress"
                          className={`form-control  ${
                            formik.touched.billingAddress &&
                            formik.errors.billingAddress
                              ? "is-invalid"
                              : ""
                          }`}
                          {...formik.getFieldProps("billingAddress")}
                        />
                        {formik.touched.billingAddress &&
                          formik.errors.billingAddress && (
                            <div className="invalid-feedback">
                              {formik.errors.billingAddress}
                            </div>
                          )}
                      </div>
                    </div>
                    <div className="col-12 mb-2">
                      <lable className="form-lable">City</lable>
                      <div className="mb-3">
                        <input
                          type="text"
                          name="billingCity"
                          className={`form-control  ${
                            formik.touched.billingCity &&
                            formik.errors.billingCity
                              ? "is-invalid"
                              : ""
                          }`}
                          {...formik.getFieldProps("billingCity")}
                        />
                        {formik.touched.billingCity &&
                          formik.errors.billingCity && (
                            <div className="invalid-feedback">
                              {formik.errors.billingCity}
                            </div>
                          )}
                      </div>
                    </div>
                    <div className="col-12 mb-2">
                      <lable className="form-lable">State</lable>
                      <div className="mb-3">
                        <input
                          type="text"
                          name="billingState"
                          className={`form-control  ${
                            formik.touched.billingState &&
                            formik.errors.billingState
                              ? "is-invalid"
                              : ""
                          }`}
                          {...formik.getFieldProps("billingState")}
                        />
                        {formik.touched.billingState &&
                          formik.errors.billingState && (
                            <div className="invalid-feedback">
                              {formik.errors.billingState}
                            </div>
                          )}
                      </div>
                    </div>
                    <div className="col-12 mb-2">
                      <lable className="form-lable">Zipcode</lable>
                      <div className="mb-3">
                        <input
                          type="text"
                          name="billingZipcode"
                          className={`form-control  ${
                            formik.touched.billingZipcode &&
                            formik.errors.billingZipcode
                              ? "is-invalid"
                              : ""
                          }`}
                          {...formik.getFieldProps("billingZipcode")}
                        />
                        {formik.touched.billingZipcode &&
                          formik.errors.billingZipcode && (
                            <div className="invalid-feedback">
                              {formik.errors.billingZipcode}
                            </div>
                          )}
                      </div>
                    </div>
                    <div className="col-12 mb-2">
                      <lable className="form-lable">Phone</lable>
                      <div className="mb-3">
                        <input
                          type="text"
                          name="billingPhone"
                          className={`form-control  ${
                            formik.touched.billingPhone &&
                            formik.errors.billingPhone
                              ? "is-invalid"
                              : ""
                          }`}
                          {...formik.getFieldProps("billingPhone")}
                        />
                        {formik.touched.billingPhone &&
                          formik.errors.billingPhone && (
                            <div className="invalid-feedback">
                              {formik.errors.billingPhone}
                            </div>
                          )}
                      </div>
                    </div>
                    <div className="col-12 mb-2">
                      <lable className="form-lable">Fax Number</lable>
                      <div className="mb-3">
                        <input
                          type="text"
                          name="billingFaxnumber"
                          className={`form-control  ${
                            formik.touched.billingFaxnumber &&
                            formik.errors.billingFaxnumber
                              ? "is-invalid"
                              : ""
                          }`}
                          {...formik.getFieldProps("billingFaxnumber")}
                        />
                        {formik.touched.billingFaxnumber &&
                          formik.errors.billingFaxnumber && (
                            <div className="invalid-feedback">
                              {formik.errors.billingFaxnumber}
                            </div>
                          )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-md-6 col-12">
                  <div className="d-flex justify-content-around">
                    <h3>Shipping Address </h3>
                    <div className="form-check">
                      <input
                        type="checkbox"
                        className="form-check-input"
                        id="sameAsBilling"
                        onChange={(e) => {
                          if (e.target.checked) {
                            formik.setFieldValue(
                              "shippingAttention",
                              formik.values.billingAttention
                            );
                            formik.setFieldValue(
                              "shippingCountryRegion",
                              formik.values.billingCountryRegion
                            );
                            formik.setFieldValue(
                              "shippingAddress",
                              formik.values.billingAddress
                            );
                            formik.setFieldValue(
                              "shippingCity",
                              formik.values.billingCity
                            );
                            formik.setFieldValue(
                              "shippingState",
                              formik.values.billingState
                            );
                            formik.setFieldValue(
                              "shippingZipcode",
                              formik.values.billingZipcode
                            );
                            formik.setFieldValue(
                              "shippingPhone",
                              formik.values.billingPhone
                            );
                            formik.setFieldValue(
                              "shippingFaxnumber",
                              formik.values.billingFaxnumber
                            );
                          } else {
                            formik.setFieldValue("shippingAttention", "");
                            formik.setFieldValue("shippingCountryRegion", "");
                            formik.setFieldValue("shippingAddress", "");
                            formik.setFieldValue("shippingCity", "");
                            formik.setFieldValue("shippingState", "");
                            formik.setFieldValue("shippingZipcode", "");
                            formik.setFieldValue("shippingPhone", "");
                            formik.setFieldValue("shippingFaxnumber", "");
                          }
                        }}
                      />
                      <label
                        className="form-check-label"
                        htmlFor="sameAsBilling"
                      >
                        Copy Billing Address
                      </label>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-12 mb-2">
                      <lable className="form-lable">Attention</lable>
                      <div className="mb-3">
                        <input
                          type="text"
                          name="shippingAttention"
                          className={`form-control  ${
                            formik.touched.shippingAttention &&
                            formik.errors.shippingAttention
                              ? "is-invalid"
                              : ""
                          }`}
                          {...formik.getFieldProps("shippingAttention")}
                        />
                        {formik.touched.shippingAttention &&
                          formik.errors.shippingAttention && (
                            <div className="invalid-feedback">
                              {formik.errors.shippingAttention}
                            </div>
                          )}
                      </div>
                    </div>
                    <div className="col-12 mb-2">
                      <lable className="form-lable">Country/Region</lable>
                      <div className="mb-3">
                        <input
                          type="text"
                          name="shippingCountryRegion"
                          className={`form-control  ${
                            formik.touched.shippingCountryRegion &&
                            formik.errors.shippingCountryRegion
                              ? "is-invalid"
                              : ""
                          }`}
                          {...formik.getFieldProps("shippingCountryRegion")}
                        />
                        {formik.touched.shippingCountryRegion &&
                          formik.errors.shippingCountryRegion && (
                            <div className="invalid-feedback">
                              {formik.errors.shippingCountryRegion}
                            </div>
                          )}
                      </div>
                    </div>
                    <div className="col-12 mb-2">
                      <lable className="form-lable">Address</lable>
                      <div className="mb-3">
                        <input
                          type="text"
                          name="shippingAddress"
                          className={`form-control  ${
                            formik.touched.shippingAddress &&
                            formik.errors.shippingAddress
                              ? "is-invalid"
                              : ""
                          }`}
                          {...formik.getFieldProps("shippingAddress")}
                        />
                        {formik.touched.shippingAddress &&
                          formik.errors.shippingAddress && (
                            <div className="invalid-feedback">
                              {formik.errors.shippingAddress}
                            </div>
                          )}
                      </div>
                    </div>
                    <div className="col-12 mb-2">
                      <lable className="form-lable">City</lable>
                      <div className="mb-3">
                        <input
                          type="text"
                          name="shippingCity"
                          className={`form-control  ${
                            formik.touched.shippingCity &&
                            formik.errors.shippingCity
                              ? "is-invalid"
                              : ""
                          }`}
                          {...formik.getFieldProps("shippingCity")}
                        />
                        {formik.touched.shippingCity &&
                          formik.errors.shippingCity && (
                            <div className="invalid-feedback">
                              {formik.errors.shippingCity}
                            </div>
                          )}
                      </div>
                    </div>
                    <div className="col-12 mb-2">
                      <lable className="form-lable">State</lable>
                      <div className="mb-3">
                        <input
                          type="text"
                          name="shippingState"
                          className={`form-control  ${
                            formik.touched.shippingState &&
                            formik.errors.shippingState
                              ? "is-invalid"
                              : ""
                          }`}
                          {...formik.getFieldProps("shippingState")}
                        />
                        {formik.touched.shippingState &&
                          formik.errors.shippingState && (
                            <div className="invalid-feedback">
                              {formik.errors.shippingState}
                            </div>
                          )}
                      </div>
                    </div>
                    <div className="col-12 mb-2">
                      <lable className="form-lable">Zipcode</lable>
                      <div className="mb-3">
                        <input
                          type="text"
                          name="shippingZipcode"
                          className={`form-control  ${
                            formik.touched.shippingZipcode &&
                            formik.errors.shippingZipcode
                              ? "is-invalid"
                              : ""
                          }`}
                          {...formik.getFieldProps("shippingZipcode")}
                        />
                        {formik.touched.shippingZipcode &&
                          formik.errors.shippingZipcode && (
                            <div className="invalid-feedback">
                              {formik.errors.shippingZipcode}
                            </div>
                          )}
                      </div>
                    </div>
                    <div className="col-12 mb-2">
                      <lable className="form-lable">Phone</lable>
                      <div className="mb-3">
                        <input
                          type="text"
                          name="shippingPhone"
                          className={`form-control  ${
                            formik.touched.shippingPhone &&
                            formik.errors.shippingPhone
                              ? "is-invalid"
                              : ""
                          }`}
                          {...formik.getFieldProps("shippingPhone")}
                        />
                        {formik.touched.shippingPhone &&
                          formik.errors.shippingPhone && (
                            <div className="invalid-feedback">
                              {formik.errors.shippingPhone}
                            </div>
                          )}
                      </div>
                    </div>
                    <div className="col-12 mb-2">
                      <lable className="form-lable">Fax Number</lable>
                      <div className="mb-3">
                        <input
                          type="text"
                          name="shippingFaxnumber"
                          className={`form-control  ${
                            formik.touched.shippingFaxnumber &&
                            formik.errors.shippingFaxnumber
                              ? "is-invalid"
                              : ""
                          }`}
                          {...formik.getFieldProps("shippingFaxnumber")}
                        />
                        {formik.touched.shippingFaxnumber &&
                          formik.errors.shippingFaxnumber && (
                            <div className="invalid-feedback">
                              {formik.errors.shippingFaxnumber}
                            </div>
                          )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "contactPersons" && (
              <div className="container-fluid">
                <div className="table-responsive mb-3">
                  <table className="table table-bordered">
                    <thead>
                      <tr>
                        <th>Salutation</th>
                        <th>First Name</th>
                        <th>Last Name</th>
                        <th>Email Address</th>
                        <th>Work Phone</th>
                        <th>Mobile</th>
                        <th>Skype Name/Number</th>
                        <th>Designation</th>
                        <th>Department</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {rows.map((row, index) => (
                        <tr key={row.id}>
                          <td>
                            <input
                              type="text"
                              value={row.salutation}
                              className="form-control"
                              onChange={(e) =>
                                handleInputChange(
                                  index,
                                  "salutation",
                                  e.target.value
                                )
                              }
                            />
                          </td>
                          <td>
                            <input
                              type="text"
                              value={row.firstName}
                              className="form-control input-wide"
                              onChange={(e) =>
                                handleInputChange(
                                  index,
                                  "firstName",
                                  e.target.value
                                )
                              }
                            />
                          </td>
                          <td>
                            <input
                              type="text"
                              value={row.lastName}
                              className="form-control input-wide"
                              onChange={(e) =>
                                handleInputChange(
                                  index,
                                  "lastName",
                                  e.target.value
                                )
                              }
                            />
                          </td>
                          <td>
                            <input
                              type="email"
                              value={row.email}
                              className="form-control input-wide"
                              onChange={(e) =>
                                handleInputChange(
                                  index,
                                  "email",
                                  e.target.value
                                )
                              }
                            />
                          </td>
                          <td>
                            <input
                              type="text"
                              value={row.workPhone}
                              className="form-control input-wide"
                              onChange={(e) =>
                                handleInputChange(
                                  index,
                                  "workPhone",
                                  e.target.value
                                )
                              }
                            />
                          </td>
                          <td>
                            <input
                              type="text"
                              value={row.mobile}
                              className="form-control input-wide"
                              onChange={(e) =>
                                handleInputChange(
                                  index,
                                  "mobile",
                                  e.target.value
                                )
                              }
                            />
                          </td>
                          <td>
                            <input
                              type="text"
                              value={row.skype}
                              className="form-control input-wide"
                              onChange={(e) =>
                                handleInputChange(
                                  index,
                                  "skype",
                                  e.target.value
                                )
                              }
                            />
                          </td>
                          <td>
                            <input
                              type="text"
                              value={row.designation}
                              className="form-control input-wide"
                              onChange={(e) =>
                                handleInputChange(
                                  index,
                                  "designation",
                                  e.target.value
                                )
                              }
                            />
                          </td>
                          <td>
                            <input
                              type="text"
                              value={row.department}
                              className="form-control input-wide"
                              onChange={(e) =>
                                handleInputChange(
                                  index,
                                  "department",
                                  e.target.value
                                )
                              }
                            />
                          </td>
                          <td>
                            {index === 1 && (
                              <button
                                className="btn"
                                onClick={() => deleteRow(index)}
                              >
                                <TbXboxX style={{ fontSize: "25px", color: "red"}}/>
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={addRow}
                >
                  Add More
                </button>
              </div>
            )}

            {activeTab === "customFields" && (
              <div className="container-fluid row"></div>
            )}
            {activeTab === "reportingTags" && (
              <div className="container-fluid row">
                <div className="col-md-6 col-12 mb-2">
                  <lable className="form-lable">ea</lable>
                  <div className="mb-3">
                    <select
                      name="ea"
                      className={`form-select  ${
                        formik.touched.ea && formik.errors.ea
                          ? "is-invalid"
                          : ""
                      }`}
                      {...formik.getFieldProps("ea")}
                    >
                      <option value=""></option>
                      <option value="sunt">sunt</option>
                      <option value="excepturi">excepturi</option>
                    </select>
                    {formik.touched.ea && formik.errors.ea && (
                      <div className="invalid-feedback">{formik.errors.ea}</div>
                    )}
                  </div>
                </div>
                <div className="col-md-6 col-12 mb-2">
                  <lable className="form-lable">rem</lable>
                  <div className="mb-3">
                    <select
                      name="rem"
                      className={`form-select  ${
                        formik.touched.rem && formik.errors.rem
                          ? "is-invalid"
                          : ""
                      }`}
                      {...formik.getFieldProps("rem")}
                    >
                      <option value=""></option>
                      <option value="et">et</option>
                      <option value="ipsam">ipsam</option>
                    </select>
                    {formik.touched.rem && formik.errors.rem && (
                      <div className="invalid-feedback">
                        {formik.errors.rem}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
            {activeTab === "remarks" && (
              <div className="container-fluid row">
                <div className="col-md-6 col-12 mb-2">
                  <lable className="form-lable">Remarks</lable>
                  <div className="mb-3">
                    <textarea
                      name="remarks"
                      className={`form-control  ${
                        formik.touched.remarks && formik.errors.remarks
                          ? "is-invalid"
                          : ""
                      }`}
                      {...formik.getFieldProps("remarks")}
                    ></textarea>
                    {formik.touched.remarks && formik.errors.remarks && (
                      <div className="invalid-feedback">
                        {formik.errors.remarks}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </form>
    </div>
  );
};

export default CustomerEdit;
