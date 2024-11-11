import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import api from "../../../../config/URL";
import toast from "react-hot-toast";
import { TbXboxX } from "react-icons/tb";
import { SlTrash } from "react-icons/sl";

const VendorAdd = () => {
  const navigate = useNavigate();
  const [loading, setLoadIndicator] = useState(false);
  const [activeTab, setActiveTab] = useState("otherDetails");
  const [fields, setFields] = useState([
    {
      id: 1,
      accHolderName: "",
      bankName: "",
      accNum: "",
      reAccNum: "",
      ifsc: "",
    },
  ]);
  const [rows, setRows] = useState([
    {
      id: 1,
      salutation: "",
      vendorFirstName: "",
      vendorLastName: "",
      vendorEmail: "",
      vendorPhone: "",
      vendorMobile: "",
      skypeName: "",
      designation: "",
      department: "",
    },
  ]);

  const validationSchema = Yup.object({
    vendorDisplayName: Yup.string().required(
      "*Vendor Display Name is required"
    ),
    salutation: Yup.string().required("*Salutation is required"),
    firstName: Yup.string()
      .matches(/^[A-Za-z]+$/, "*First Name must contain only letters")
      .required("*First Name is required"),
    lastName: Yup.string()
      .matches(/^[A-Za-z]+$/, "*Last Name must contain only letters")
      .required("*Last Name is required"),
    vendorEmail: Yup.string()
      .email("*Enter a valid email address")
      .required("*Vendor Email is required"),
    vendorMobile: Yup.number()
      .typeError("*Mobile Number must be a number")
      .required("*Mobile Number is required"),
    vendorPhone: Yup.number().typeError("*Phone Number must be a number"),
  });

  const formik = useFormik({
    initialValues: {
      salutation: "",
      firstName: "",
      lastName: "",
      companyName: "",
      vendorDisplayName: "",
      vendorEmail: "",
      vendorMobile: "",
      currency: "",
      taxRate: "",
      paymentTerms: "",
      portalLanguage: "",
      documents: "",
      websiteUrl: "",
      department: "",
      designation: "",
      twitterUrl: "",
      skypeName: "",
      facebookUrl: "",
      billingAttention: "",
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
      emailAddress: "",
      workPhone: "",
      mobile: "",
      remark: "",
      contacts: [
        {
          salutation: "Mr",
          vendorFirstName: "",
          vendorLastName: "",
          vendorEmail: "",
          vendorPhone: "",
          vendorMobile: "",
          skypeName: "",
          designation: "",
          department: "",
          vendorId: "",
        },
      ],
      bankDetails: [
        {
          accountHolderName: "",
          bankName: "",
          accountNumber: "",
          reAccountNumber: "",
          ifsc: "",
          vendorId: "",
        },
      ],
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      setLoadIndicator(true);
      console.log(values);

      // const payload = {
      //   ...values,
      //   contacts: values.contacts.map((contact) => ({
      //     ...contact,
      //     salutation: "Mr",
      //   })),
      // };
      try {
        const response = await api.post("/createVendorWithBank", values, {});
        if (response.status === 200) {
          toast.success(response.data.message);
          navigate("/vendor");
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
        contacts: [
          {
            salutation: "",
            vendorFirstName: "",
            vendorLastName: "",
            vendorEmail: "",
            vendorPhone: "",
            vendorMobile: "",
            skypeName: "",
            designation: "",
            department: "",
          },
        ],
      },
    ]);
  };

  const handleInputChange = (rowIndex, field, value) => {
    setRows((prevRows) =>
      prevRows.map((row, idx) =>
        idx === rowIndex
          ? {
              ...row,
              contacts: row.contacts
                ? [
                    {
                      ...row.contacts[0],
                      [field]: value,
                    },
                  ]
                : [{ [field]: value }],
            }
          : row
      )
    );
  };

  const deleteRow = (index) => {
    const updatedRows = rows.filter((_, rowIndex) => rowIndex !== index);
    setRows(updatedRows);
  };

  const addFields = () => {
    setFields([
      ...fields,
      {
        id: fields.length + 1,
        accountHolderName: "",
        bankName: "",
        accountNumber: "",
        reAccountNumber: "",
        ifsc: "",
      },
    ]);
  };

  const deleteFields = (id) => {
    setFields(fields.filter((field) => field.id !== id));
  };

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
                  <h1 className="h4 ls-tight headingColor">Add Vendors</h1>
                </div>
              </div>
              <div className="col-auto">
                <div className="hstack gap-2 justify-content-end">
                  <Link to="/vendor">
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
          <div className="container mb-5">
            <div className="row py-4">
              <div className="col-md-6 col-12 mb-2">
                <lable className="form-lable">
                  Salutation<span className="text-danger">*</span>
                </lable>
                <div className="mb-3">
                  <select
                    type="text"
                    name="salutation"
                    className={`form-select  ${
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
                    className={`form-control ${
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
                    className={`form-control  ${
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
                  Vendor Display Name<span className="text-danger">*</span>
                </lable>
                <div className="mb-3">
                  <input
                    type="text"
                    name="vendorDisplayName"
                    className={`form-control  ${
                      formik.touched.vendorDisplayName &&
                      formik.errors.vendorDisplayName
                        ? "is-invalid"
                        : ""
                    }`}
                    {...formik.getFieldProps("vendorDisplayName")}
                  />
                  {formik.touched.vendorDisplayName &&
                    formik.errors.vendorDisplayName && (
                      <div className="invalid-feedback">
                        {formik.errors.vendorDisplayName}
                      </div>
                    )}
                </div>
              </div>

              <div className="col-md-6 col-12 mb-2">
                <lable className="form-lable">
                  Vendor Email<span className="text-danger">*</span>
                </lable>
                <div className="mb-3">
                  <input
                    type="text"
                    name="vendorEmail"
                    className={`form-control  ${
                      formik.touched.vendorEmail && formik.errors.vendorEmail
                        ? "is-invalid"
                        : ""
                    }`}
                    {...formik.getFieldProps("vendorEmail")}
                  />
                  {formik.touched.vendorEmail && formik.errors.vendorEmail && (
                    <div className="invalid-feedback">
                      {formik.errors.vendorEmail}
                    </div>
                  )}
                </div>
              </div>

              <div className="col-md-6 col-12 mb-2">
                <lable className="form-lable">
                  Vendor Mobile<span className="text-danger">*</span>
                </lable>
                <div className="mb-3">
                  <input
                    type="text"
                    name="vendorMobile"
                    className={`form-control  ${
                      formik.touched.vendorMobile && formik.errors.vendorMobile
                        ? "is-invalid"
                        : ""
                    }`}
                    {...formik.getFieldProps("vendorMobile")}
                  />
                  {formik.touched.vendorMobile &&
                    formik.errors.vendorMobile && (
                      <div className="invalid-feedback">
                        {formik.errors.vendorMobile}
                      </div>
                    )}
                </div>
              </div>
              <div className="col-md-6 col-12 mb-2">
                <lable className="form-lable">Vendor Phone</lable>
                <div className="mb-3">
                  <input
                    type="text"
                    name="vendorPhone"
                    className={`form-control  ${
                      formik.touched.vendorPhone && formik.errors.vendorPhone
                        ? "is-invalid"
                        : ""
                    }`}
                    {...formik.getFieldProps("vendorPhone")}
                  />
                  {formik.touched.vendorPhone && formik.errors.vendorPhone && (
                    <div className="invalid-feedback">
                      {formik.errors.vendorPhone}
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
                    activeTab === "bankDetails" ? "active" : ""
                  }`}
                  onClick={() => handleTabClick("bankDetails")}
                >
                  Bank Details
                </span>
              </li>
              {/* <li className="nav-item">
                <span
                  className={`nav-link ${
                    activeTab === "reportingTags" ? "active" : ""
                  }`}
                  onClick={() => handleTabClick("reportingTags")}
                >
                  Reporting Tags
                </span>
              </li> */}
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
                      <option></option>
                      <option value="INR">Indian Rupee</option>
                      <option value="SGD">Sigapore Dollor</option>
                      <option value="AED">United Arab Emirates</option>
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
                      <option value="1" selected>
                        Due on Receipt
                      </option>
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
                      name="priceList"
                      className={`form-select  ${
                        formik.touched.priceList && formik.errors.priceList
                          ? "is-invalid"
                          : ""
                      }`}
                      {...formik.getFieldProps("priceList")}
                    >
                      <option selected></option>
                      <option value="Indian Rupee">
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
                      name="documents"
                      className={`form-control  ${
                        formik.touched.documents && formik.errors.documents
                          ? "is-invalid"
                          : ""
                      }`}
                      {...formik.getFieldProps("documents")}
                    />
                    {formik.touched.documents && formik.errors.documents && (
                      <div className="invalid-feedback">
                        {formik.errors.documents}
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
                    <h3>Shipping Address</h3>
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
                      {rows.map((row, rowIndex) => (
                        <tr key={row.id}>
                          <td>
                            <input
                              type="text"
                              value={row.contacts?.[0]?.salutation || ""}
                              className="form-control"
                              onChange={(e) =>
                                handleInputChange(
                                  rowIndex,
                                  "salutation",
                                  e.target.value
                                )
                              }
                            />
                          </td>
                          <td>
                            <input
                              type="text"
                              value={row.contacts?.[0]?.vendorFirstName || ""}
                              className="form-control input-wide"
                              onChange={(e) =>
                                handleInputChange(
                                  rowIndex,
                                  "vendorFirstName",
                                  e.target.value
                                )
                              }
                            />
                          </td>
                          <td>
                            <input
                              type="text"
                              value={row.contacts?.[0]?.vendorLastName || ""}
                              className="form-control input-wide"
                              onChange={(e) =>
                                handleInputChange(
                                  rowIndex,
                                  "vendorLastName",
                                  e.target.value
                                )
                              }
                            />
                          </td>
                          <td>
                            <input
                              type="email"
                              value={row.contacts?.[0]?.vendorEmail || ""}
                              className="form-control input-wide"
                              onChange={(e) =>
                                handleInputChange(
                                  rowIndex,
                                  "vendorEmail",
                                  e.target.value
                                )
                              }
                            />
                          </td>
                          <td>
                            <input
                              type="text"
                              value={row.contacts?.[0]?.vendorPhone || ""}
                              className="form-control input-wide"
                              onChange={(e) =>
                                handleInputChange(
                                  rowIndex,
                                  "vendorPhone",
                                  e.target.value
                                )
                              }
                            />
                          </td>
                          <td>
                            <input
                              type="text"
                              value={row.contacts?.[0]?.vendorMobile || ""}
                              className="form-control input-wide"
                              onChange={(e) =>
                                handleInputChange(
                                  rowIndex,
                                  "vendorMobile",
                                  e.target.value
                                )
                              }
                            />
                          </td>
                          <td>
                            <input
                              type="text"
                              value={row.contacts?.[0]?.skypeName || ""}
                              className="form-control input-wide"
                              onChange={(e) =>
                                handleInputChange(
                                  rowIndex,
                                  "skypeName",
                                  e.target.value
                                )
                              }
                            />
                          </td>
                          <td>
                            <input
                              type="text"
                              value={row.contacts?.[0]?.designation || ""}
                              className="form-control input-wide"
                              onChange={(e) =>
                                handleInputChange(
                                  rowIndex,
                                  "designation",
                                  e.target.value
                                )
                              }
                            />
                          </td>
                          <td>
                            <input
                              type="text"
                              value={row.contacts?.[0]?.department || ""}
                              className="form-control input-wide"
                              onChange={(e) =>
                                handleInputChange(
                                  rowIndex,
                                  "department",
                                  e.target.value
                                )
                              }
                            />
                          </td>
                          <td>
                            {rowIndex !== 0 && (
                              <button
                                className="btn"
                                onClick={() => deleteRow(rowIndex)}
                              >
                                <TbXboxX
                                  style={{ fontSize: "25px", color: "red" }}
                                />
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

            {activeTab === "bankDetails" && (
              <div className="container-fluid">
                <div className="row">
                  {fields.map((row, index) => (
                    <div key={row.id}>
                      <div className="row">
                        <div className="col-md-6 col-12 mb-2">
                          <h4 className="mb-5">Bank {row.id}</h4>
                        </div>
                        <div className="col-md-6 col-12 mb-2 text-end">
                          {row.id > 1 && (
                            <button
                              type="button"
                              className="btn btn-sm"
                              onClick={() => deleteFields(row.id)}
                            >
                              <SlTrash style={{ color: "red" }} />
                            </button>
                          )}
                        </div>
                        <div className="col-md-6 col-12 my-2">
                          <label className="form-label">
                            Account Holder Name
                          </label>
                          <div className="mb-3">
                            <input
                              type="text"
                              name={`bankDetails[${index}].accountHolderName`}
                              className={`form-control ${
                                formik.touched.bankDetails?.[index]
                                  ?.accountHolderName &&
                                formik.errors.bankDetails?.[index]
                                  ?.accountHolderName
                                  ? "is-invalid"
                                  : ""
                              }`}
                              {...formik.getFieldProps(
                                `bankDetails[${index}].accountHolderName`
                              )}
                            />
                            {formik.touched.bankDetails?.[index]
                              ?.accountHolderName &&
                              formik.errors.bankDetails?.[index]
                                ?.accountHolderName && (
                                <div className="invalid-feedback">
                                  {
                                    formik.errors.bankDetails[index]
                                      .accountHolderName
                                  }
                                </div>
                              )}
                          </div>
                        </div>
                        <div className="col-md-6 col-12 mb-2">
                          <label className="form-label">Bank Name</label>
                          <div className="mb-3">
                            <input
                              type="text"
                              name={`bankDetails[${index}].bankName`}
                              className={`form-control ${
                                formik.touched.bankDetails?.[index]?.bankName &&
                                formik.errors.bankDetails?.[index]?.bankName
                                  ? "is-invalid"
                                  : ""
                              }`}
                              {...formik.getFieldProps(
                                `bankDetails[${index}].bankName`
                              )}
                            />
                            {formik.touched.bankDetails?.[index]?.bankName &&
                              formik.errors.bankDetails?.[index]?.bankName && (
                                <div className="invalid-feedback">
                                  {formik.errors.bankDetails[index].bankName}
                                </div>
                              )}
                          </div>
                        </div>
                        <div className="col-md-6 col-12 mb-2">
                          <label className="form-label">
                            Account Number<span className="text-danger">*</span>
                          </label>
                          <div className="mb-3">
                            <input
                              type="text"
                              name={`bankDetails[${index}].accountNumber`}
                              className={`form-control ${
                                formik.touched.bankDetails?.[index]
                                  ?.accountNumber &&
                                formik.errors.bankDetails?.[index]
                                  ?.accountNumber
                                  ? "is-invalid"
                                  : ""
                              }`}
                              {...formik.getFieldProps(
                                `bankDetails[${index}].accountNumber`
                              )}
                            />
                            {formik.touched.bankDetails?.[index]
                              ?.accountNumber &&
                              formik.errors.bankDetails?.[index]
                                ?.accountNumber && (
                                <div className="invalid-feedback">
                                  {
                                    formik.errors.bankDetails[index]
                                      .accountNumber
                                  }
                                </div>
                              )}
                          </div>
                        </div>
                        <div className="col-md-6 col-12 mb-2">
                          <label className="form-label">
                            Re-enter Account Number
                            <span className="text-danger">*</span>
                          </label>
                          <div className="mb-3">
                            <input
                              type="text"
                              name={`bankDetails[${index}].reAccountNumber`}
                              className={`form-control ${
                                formik.touched.bankDetails?.[index]
                                  ?.reAccountNumber &&
                                formik.errors.bankDetails?.[index]
                                  ?.reAccountNumber
                                  ? "is-invalid"
                                  : ""
                              }`}
                              {...formik.getFieldProps(
                                `bankDetails[${index}].reAccountNumber`
                              )}
                            />
                            {formik.touched.bankDetails?.[index]
                              ?.reAccountNumber &&
                              formik.errors.bankDetails?.[index]
                                ?.reAccountNumber && (
                                <div className="invalid-feedback">
                                  {
                                    formik.errors.bankDetails[index]
                                      .reAccountNumber
                                  }
                                </div>
                              )}
                          </div>
                        </div>
                        <div className="col-md-6 col-12 mb-2">
                          <label className="form-label">
                            IFSC<span className="text-danger">*</span>
                          </label>
                          <div className="mb-3">
                            <input
                              type="text"
                              name={`bankDetails[${index}].ifsc`}
                              className={`form-control ${
                                formik.touched.bankDetails?.[index]?.ifsc &&
                                formik.errors.bankDetails?.[index]?.ifsc
                                  ? "is-invalid"
                                  : ""
                              }`}
                              {...formik.getFieldProps(
                                `bankDetails[${index}].ifsc`
                              )}
                            />
                            {formik.touched.bankDetails?.[index]?.ifsc &&
                              formik.errors.bankDetails?.[index]?.ifsc && (
                                <div className="invalid-feedback">
                                  {formik.errors.bankDetails[index].ifsc}
                                </div>
                              )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  className="btn btn-sm btn-primary me-2"
                  onClick={addFields}
                >
                  Add New Bank
                </button>
              </div>
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
                      name="remark"
                      className={`form-control  ${
                        formik.touched.remark && formik.errors.remark
                          ? "is-invalid"
                          : ""
                      }`}
                      rows={`4`}
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

export default VendorAdd;
