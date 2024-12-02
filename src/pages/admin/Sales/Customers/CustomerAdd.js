import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import api from "../../../../config/URL";
import toast from "react-hot-toast";
import { TbXboxX } from "react-icons/tb";
import { IoMdInformationCircleOutline } from "react-icons/io";

const CustomerAdd = () => {
  const navigate = useNavigate();
  const [loading, setLoadIndicator] = useState(false);
  const [activeTab, setActiveTab] = useState("otherDetails");
  const [enablePortal, setEnablePortal] = useState(false);
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
    // salutation: Yup.string().required("*salutation is required"),
    // firstName: Yup.string()
    //   .matches(/^[A-Za-z]+$/, "*First Name must contain only letters")
    //   .required("*First Name is required"),
    // lastName: Yup.string()
    //   .matches(/^[A-Za-z]+$/, "*Last Name must contain only letters")
    //   .required("*Last Name is required"),
    customerEmail: Yup.string().required("*Customer Email is required"),
    customerDisplayName: Yup.string().required(
      "*Customer Display Name is required"
    ),
  });
  const formik = useFormik({
    initialValues: {
      customerType: "",
      primaryContact: "",
      companyName: "",
      customerDisplayName: "",
      customerEmail: "",
      customerPhoneNumber: "",
      currency: "",
      taxRate: "",
      pan: "",
      currencyId: "",
      paymentTerms: "",
      enablePortal: "",
      websiteUrl: "",
      department: "",
      designation: "",
      twitterUrl: "",
      skypeName: "",
      facebookUrl: "",
      billingAttention: "",
      billingCountry: "",
      billingAddress: "",
      billingCity: "",
      billingState: "",
      billingZipcode: "",
      billingPhone: "",
      billingFax: "",
      shippingAttention: "",
      shippingCountry: "",
      shippingAddress: "",
      shippingCity: "",
      shippingState: "",
      shippingZipcode: "",
      shippingPhone: "",
      shippingFax: "",
      remark: "",
      fileAttachment: "",
      contactsJson: [
        {
          salutation: "",
          customerFirstName: "",
          customerLastName: "",
          customerEmail: "",
          customerPhone: "",
          customerMobile: "",
          skypeName: "",
          designation: "",
          department: "",
        },
      ],
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      setLoadIndicator(true);
      console.log("Items :", values.contactsJson);

      const formData = new FormData();
      formData.append("customerType", values.customerType);
      formData.append("salutation", values.salutation);
      formData.append("firstName", values.firstName);
      formData.append("pan", values.pan);
      formData.append("currencyId", values.currencyId);
      formData.append("lastName", values.lastName);
      formData.append("companyName", values.companyName);
      formData.append("customerDisplayName", values.customerDisplayName);
      formData.append("customerEmail", values.customerEmail);
      formData.append("customerPhoneNumber", values.customerPhoneNumber);
      formData.append("currency", values.currency);
      formData.append("paymentTerms", values.paymentTerms);
      formData.append("enablePortal", enablePortal);
      formData.append("portalLanguage", values.portalLanguage);
      formData.append("websiteUrl", values.websiteUrl);
      formData.append("department", values.department);
      formData.append("designation", values.designation);
      formData.append("twitterUrl", values.twitterUrl);
      formData.append("skypeName", values.skypeName);
      formData.append("facebookUrl", values.facebookUrl);
      formData.append("billingAttention", values.billingAttention);
      formData.append("billingCountry", values.billingCountry);
      formData.append("billingAddress", values.billingAddress);
      formData.append("billingCity", values.billingCity);
      formData.append("billingState", values.billingState);
      formData.append("billingZipcode", values.billingZipcode);
      formData.append("billingPhone", values.billingPhone);
      formData.append("billingFax", values.billingFax);
      formData.append("shippingAttention", values.shippingAttention);
      formData.append("shippingCountry", values.shippingCountry);
      formData.append("shippingAddress", values.shippingAddress);
      formData.append("shippingCity", values.shippingCity);
      formData.append("shippingState", values.shippingState);
      formData.append("shippingZipcode", values.shippingZipcode);
      formData.append("shippingPhone", values.shippingPhone);
      formData.append("shippingFax", values.shippingFax);
      formData.append("remark", values.remark);
      formData.append("fileAttachment", values.fileAttachment);
      formData.append(
        "contactsJson",
        JSON.stringify(
          values.contactsJson.map((item) => ({
            salutation: item.salutation,
            customerFirstName: item.customerFirstName,
            customerLastName: item.customerLastName,
            customerEmail: item.customerEmail,
            customerPhone: item.customerPhone,
            customerMobile: item.customerMobile,
            skypeName: item.skypeName,
            designation: item.designation,
            department: item.department,
          }))
        )
      );
      try {
        const response = await api.post(
          "/createCustomerWithContacts",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        if (response.status === 200) {
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

  const AddRowContent = () => {
    formik.setFieldValue("contactsJson", [
      ...formik.values.contactsJson,
      {
        salutation: "",
        customerFirstName: "",
        customerLastName: "",
        customerEmail: "",
        customerPhone: "",
        customerMobile: "",
        skypeName: "",
        designation: "",
        department: "",
      },
    ]);
  };

  const deleteRow = (index) => {
    if (formik.values.contactsJson.length === 1) {
      return;
    }
    const updatedRows = [...formik.values.contactsJson];
    updatedRows.pop();
    formik.setFieldValue("contactsJson", updatedRows);
  };

  const handleCheckboxChange = (event) => {
    setEnablePortal(event.target.checked);
  };

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
                  <h1 className="h4 ls-tight headingColor">Add Customer</h1>
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
          <div className="container mb-5">
            <div className="row py-4">
              <div className="col-md-6 col-12 mb-2">
                <lable className="form-lable">
                  salutation<span className="text-danger">*</span>
                </lable>
                <div className="mb-3">
                  <select
                    type="text"
                    name="salutation"
                    className={`form-select form-select-sm  ${
                      formik.touched.salutation && formik.errors.salutation
                        ? "is-invalid"
                        : ""
                    }`}
                    {...formik.getFieldProps("salutation")}
                  >
                    <option></option>
                    <option value="Mr">Mr.</option>
                    <option value="Mrs.">Mrs.</option>
                    <option value="Ms.">Ms.</option>
                    <option value="Miss.">Miss.</option>
                    <option value="Dr.">Dr.</option>
                  </select>
                  {formik.touched.salutation && formik.errors.salutation && (
                    <div className="invalid-feedback">
                      {formik.errors.salutation}
                    </div>
                  )}
                </div>
              </div>
              <div className="col-md-6 col-12 mb-2">
                <lable className="form-lable">
                  First Name<span className="text-danger">*</span>
                </lable>
                <div className="mb-3">
                  <input
                    type="text"
                    name="firstName"
                    className={`form-control form-control-sm ${
                      formik.touched.firstName && formik.errors.firstName
                        ? "is-invalid"
                        : ""
                    }`}
                    {...formik.getFieldProps("firstName")}
                  />
                  {formik.touched.firstName && formik.errors.firstName && (
                    <div className="invalid-feedback">
                      {formik.errors.firstName}
                    </div>
                  )}
                </div>
              </div>
              <div className="col-md-6 col-12 mb-2">
                <lable className="form-lable">
                  Last Name<span className="text-danger">*</span>
                </lable>
                <div className="mb-3">
                  <input
                    type="text"
                    name="lastName"
                    className={`form-control form-control-sm  ${
                      formik.touched.lastName && formik.errors.lastName
                        ? "is-invalid"
                        : ""
                    }`}
                    {...formik.getFieldProps("lastName")}
                  />
                  {formik.touched.lastName && formik.errors.lastName && (
                    <div className="invalid-feedback">
                      {formik.errors.lastName}
                    </div>
                  )}
                </div>
              </div>
              <div className="col-md-6 col-12 mb-3">
                <div>
                  <label for="exampleFormControlInput1" className="form-label">
                    Customer Type<span className="text-danger">*</span>
                  </label>
                </div>
                <div className="form-check form-check-inline">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="customerType"
                    id="Business"
                    value="Business"
                    onChange={formik.handleChange}
                    checked={formik.values.customerType === "Business"}
                  />
                  <label className="form-check-label">Business</label>
                </div>
                <div className="form-check form-check-inline">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="customerType"
                    id="Individual"
                    value="Individual"
                    onChange={formik.handleChange}
                    checked={formik.values.customerType === "Individual"}
                  />
                  <label className="form-check-label">Individual</label>
                </div>
                {formik.errors.customerType && formik.touched.customerType && (
                  <div className="text-danger" style={{ fontSize: ".875em" }}>
                    {formik.errors.customerType}
                  </div>
                )}
              </div>
              <div className="col-md-6 col-12 mb-2">
                <lable className="form-lable">Company Name</lable>
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
                <lable className="form-lable">Customer Phone</lable>
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
                    activeTab === "remark" ? "active" : ""
                  }`}
                  onClick={() => handleTabClick("remark")}
                >
                  remarks
                </span>
              </li>
            </ul>
          </div>

          <div className="my-3">
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
                    >
                      <option selected></option>
                      <option value="INR - Indian Rupee">
                        INR - Indian Rupee
                      </option>
                      <option value="USD - United States Dollar">
                        USD - United States Dollar
                      </option>
                      <option value="EUR - Euro">EUR - Euro</option>
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
                      name="paymentTerms"
                      className={`form-select  ${
                        formik.touched.paymentTerms &&
                        formik.errors.paymentTerms
                          ? "is-invalid"
                          : ""
                      }`}
                      {...formik.getFieldProps("paymentTerms")}
                    >
                      <option selected></option>
                      <option value="1">Due on Receipt</option>
                      <option value="2">Due end of the month</option>
                    </select>
                    {formik.touched.paymentTerms &&
                      formik.errors.paymentTerms && (
                        <div className="invalid-feedback">
                          {formik.errors.paymentTerms}
                        </div>
                      )}
                  </div>
                </div>
                <div className="col-md-6 col-12 mb-2">
                  <lable className="form-lable">Price List</lable>
                  <div className="mb-3">
                    <select
                      type="text"
                      name="currencyId"
                      className={`form-select  ${
                        formik.touched.currencyId && formik.errors.currencyId
                          ? "is-invalid"
                          : ""
                      }`}
                      {...formik.getFieldProps("currencyId")}
                    >
                      <option selected></option>
                      <option value="Pen [ 10% Markup]">
                        Pen [ 10% Markup]
                      </option>
                    </select>
                    {formik.touched.currencyId && formik.errors.currencyId && (
                      <div className="invalid-feedback">
                        {formik.errors.currencyId}
                      </div>
                    )}
                  </div>
                </div>
                <div className="col-md-6 col-12 mb-2">
                  <div className="d-flex align-items-center">
                    <label className="form-label mb-0">Enable Portal</label>
                    <span
                      className="infoField"
                      title="Give your customers access to portal to view transactions and make online payments"
                    >
                      <IoMdInformationCircleOutline />
                    </span>
                  </div>
                  <div className="form-check">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      checked={enablePortal}
                      onChange={handleCheckboxChange}
                    />
                    <label className="form-check-label">
                      Allow portal access for this vendor
                    </label>
                  </div>
                </div>
                <div className="col-md-6 col-12 mb-2">
                  <div className="d-flex align-items-center">
                    <label className="form-label mb-0">Portal Language</label>
                    <span
                      className="infoField"
                      title="This will change the contact's portal in corresponding languages"
                    >
                      <IoMdInformationCircleOutline />
                    </span>
                  </div>
                  <div className="mb-3">
                    <select
                      type="text"
                      name="portalLanguage"
                      className={`form-select form-select-sm  ${
                        formik.touched.portalLanguage &&
                        formik.errors.portalLanguage
                          ? "is-invalid"
                          : ""
                      }`}
                      {...formik.getFieldProps("portalLanguage")}
                    >
                      <option selected></option>
                      <option value="English">English</option>
                      <option value="Tamil">Tamil</option>
                      <option value="Hindi">Hindi</option>
                    </select>
                    {formik.touched.portalLanguage &&
                      formik.errors.portalLanguage && (
                        <div className="invalid-feedback">
                          {formik.errors.portalLanguage}
                        </div>
                      )}
                  </div>
                </div>
                <div className="col-md-6 col-12 mb-2">
                  <lable className="form-lable">Document</lable>
                  <div className="mb-3">
                    <input
                      type="file"
                      className="form-control form-control-sm"
                      onChange={(event) => {
                        formik.setFieldValue(
                          "fileAttachment",
                          event.target.files[0]
                        );
                      }}
                      onBlur={formik.handleBlur}
                    />
                    {formik.touched.fileAttachment &&
                      formik.errors.fileAttachment && (
                        <div className="invalid-feedback">
                          {formik.errors.fileAttachment}
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
                      name="twitterUrl"
                      className={`form-control ${
                        formik.touched.twitterUrl && formik.errors.twitterUrl
                          ? "is-invalid"
                          : ""
                      }`}
                      {...formik.getFieldProps("twitterUrl")}
                    />
                    {formik.touched.twitterUrl && formik.errors.twitterUrl && (
                      <div className="invalid-feedback">
                        {formik.errors.twitterUrl}
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
                      name="skypeName"
                      className={`form-control ${
                        formik.touched.skypeName && formik.errors.skypeName
                          ? "is-invalid"
                          : ""
                      }`}
                      {...formik.getFieldProps("skypeName")}
                    />
                    {formik.touched.skypeName && formik.errors.skypeName && (
                      <div className="invalid-feedback">
                        {formik.errors.skypeName}
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
                      name="facebookUrl"
                      className={`form-control ${
                        formik.touched.facebookUrl && formik.errors.facebookUrl
                          ? "is-invalid"
                          : ""
                      }`}
                      {...formik.getFieldProps("facebookUrl")}
                    />
                    {formik.touched.facebookUrl &&
                      formik.errors.facebookUrl && (
                        <div className="invalid-feedback">
                          {formik.errors.facebookUrl}
                        </div>
                      )}
                  </div>
                </div>
              </div>
            )}

            {activeTab === "address" && (
              <div className="container-fluid row">
                <div className="col-md-6 col-12">
                  <h3 className="">Billing Address</h3>
                  <div className="row mt-5">
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
                          name="billingCountry"
                          className={`form-control  ${
                            formik.touched.billingCountry &&
                            formik.errors.billingCountry
                              ? "is-invalid"
                              : ""
                          }`}
                          {...formik.getFieldProps("billingCountry")}
                        />
                        {formik.touched.billingCountry &&
                          formik.errors.billingCountry && (
                            <div className="invalid-feedback">
                              {formik.errors.billingCountry}
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
                          name="billingFax"
                          className={`form-control  ${
                            formik.touched.billingFax &&
                            formik.errors.billingFax
                              ? "is-invalid"
                              : ""
                          }`}
                          {...formik.getFieldProps("billingFax")}
                        />
                        {formik.touched.billingFax &&
                          formik.errors.billingFax && (
                            <div className="invalid-feedback">
                              {formik.errors.billingFax}
                            </div>
                          )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-md-6 col-12">
                  <div className="d-flex justify-content-between">
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
                              "shippingCountry",
                              formik.values.billingCountry
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
                              "shippingFax",
                              formik.values.billingFax
                            );
                          } else {
                            formik.setFieldValue("shippingAttention", "");
                            formik.setFieldValue("shippingCountry", "");
                            formik.setFieldValue("shippingAddress", "");
                            formik.setFieldValue("shippingCity", "");
                            formik.setFieldValue("shippingState", "");
                            formik.setFieldValue("shippingZipcode", "");
                            formik.setFieldValue("shippingPhone", "");
                            formik.setFieldValue("shippingFax", "");
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
                  <div className="row mt-5">
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
                          name="shippingCountry"
                          className={`form-control  ${
                            formik.touched.shippingCountry &&
                            formik.errors.shippingCountry
                              ? "is-invalid"
                              : ""
                          }`}
                          {...formik.getFieldProps("shippingCountry")}
                        />
                        {formik.touched.shippingCountry &&
                          formik.errors.shippingCountry && (
                            <div className="invalid-feedback">
                              {formik.errors.shippingCountry}
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
                          name="shippingFax"
                          className={`form-control  ${
                            formik.touched.shippingFax &&
                            formik.errors.shippingFax
                              ? "is-invalid"
                              : ""
                          }`}
                          {...formik.getFieldProps("shippingFax")}
                        />
                        {formik.touched.shippingFax &&
                          formik.errors.shippingFax && (
                            <div className="invalid-feedback">
                              {formik.errors.shippingFax}
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
                        <th>salutation</th>
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
                      {formik.values.contactsJson?.map((contact, index) => (
                        <tr key={index}>
                          <td>
                            <input
                              type="text"
                              name={`contactsJson.${index}.salutation`}
                              {...formik.getFieldProps(
                                `contactsJson.${index}.salutation`
                              )}
                              className="form-control"
                            />
                          </td>
                          <td>
                            <input
                              type="text"
                              name={`contactsJson.${index}.customerFirstName`}
                              {...formik.getFieldProps(
                                `contactsJson.${index}.customerFirstName`
                              )}
                              className="form-control"
                            />
                          </td>
                          <td>
                            <input
                              type="text"
                              name={`contactsJson.${index}.customerLastName`}
                              {...formik.getFieldProps(
                                `contactsJson.${index}.customerLastName`
                              )}
                              className="form-control"
                            />
                          </td>
                          <td>
                            <input
                              type="email"
                              name={`contactsJson.${index}.customerEmail`}
                              {...formik.getFieldProps(
                                `contactsJson.${index}.customerEmail`
                              )}
                              className="form-control"
                            />
                          </td>
                          <td>
                            <input
                              type="text"
                              name={`contactsJson.${index}.customerPhone`}
                              {...formik.getFieldProps(
                                `contactsJson.${index}.customerPhone`
                              )}
                              className="form-control"
                            />
                          </td>
                          <td>
                            <input
                              type="text"
                              name={`contactsJson.${index}.customerMobile`}
                              {...formik.getFieldProps(
                                `contactsJson.${index}.customerMobile`
                              )}
                              className="form-control"
                            />
                          </td>
                          <td>
                            <input
                              type="text"
                              name={`contactsJson.${index}.skypeName`}
                              {...formik.getFieldProps(
                                `contactsJson.${index}.skypeName`
                              )}
                              className="form-control"
                            />
                          </td>
                          <td>
                            <input
                              type="text"
                              name={`contactsJson.${index}.designation`}
                              {...formik.getFieldProps(
                                `contactsJson.${index}.designation`
                              )}
                              className="form-control"
                            />
                          </td>
                          <td>
                            <input
                              type="text"
                              name={`contactsJson.${index}.department`}
                              {...formik.getFieldProps(
                                `contactsJson.${index}.department`
                              )}
                              className="form-control"
                            />
                          </td>
                          <td>
                            <div>
                              {formik.values.contactsJson?.length > 1 && (
                                <button
                                  className="btn btn-sm my-4 mx-1 delete border-danger bg-white text-danger"
                                  onClick={deleteRow}
                                >
                                  Delete
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <button
                  className="btn btn-button btn-sm my-4 mx-1"
                  type="button"
                  onClick={AddRowContent}
                >
                  Add row
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
            {activeTab === "remark" && (
              <div className="container-fluid row">
                <div className="col-md-6 col-12 mb-2">
                  <lable className="form-lable">remarks</lable>
                  <div className="mb-3">
                    <textarea
                      name="remark"
                      className={`form-control  ${
                        formik.touched.remark && formik.errors.remark
                          ? "is-invalid"
                          : ""
                      }`}
                      rows="4"
                      {...formik.getFieldProps("remark")}
                    ></textarea>
                    {formik.touched.remark && formik.errors.remark && (
                      <div className="invalid-feedback">
                        {formik.errors.remark}
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

export default CustomerAdd;
