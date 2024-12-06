import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import api from "../../../../config/URL";
import toast from "react-hot-toast";
import { TbXboxX } from "react-icons/tb";
import { SlTrash } from "react-icons/sl";
import { IoMdInformationCircleOutline } from "react-icons/io";

const VendorEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loader, setLoadIndicator] = useState(false);
  const [activeTab, setActiveTab] = useState("otherDetails");
  const [enablePortal, setEnablePortal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
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
      enablePortal: "",
      portalLanguage: "",
      fileAttachment: "",
      websiteUrl: "",
      department: "",
      designation: "",
      twitterUrl: "",
      skypeName: "",
      facebookUrl: "",
      billingAttention: "",
      billingAddress: "",
      billingCountry: "",
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

      const formData = new FormData();
      formData.append("salutation", values.salutation);
      formData.append("firstName", values.firstName);
      formData.append("lastName", values.lastName);
      formData.append("companyName", values.companyName);
      formData.append("vendorDisplayName", values.vendorDisplayName);
      formData.append("vendorEmail", values.vendorEmail);
      formData.append("vendorPhone", values.vendorPhone);
      formData.append("vendorMobile", values.vendorMobile);
      formData.append("currency", values.currency);
      formData.append("taxRate", values.taxRate);
      formData.append("paymentTerms", values.paymentTerms);
      formData.append("enablePortal", enablePortal);
      formData.append("portalLanguage", values.portalLanguage);
      formData.append("websiteUrl", values.websiteUrl);
      formData.append("department", values.department);
      // formData.append("department", values.department);
      formData.append("designation", values.designation || "");
      formData.append("twitterUrl", values.twitterUrl);
      formData.append("skypeName", values.skypeName);
      formData.append("facebookUrl", values.facebookUrl);
      formData.append("billingAttention", values.billingAttention);
      formData.append("billingCountry", values.billingCountry);
      formData.append("billingAddress", values.billingAddress);
      formData.append("billingCity", values.billingCity || "");
      formData.append("billingState", values.billingState || "");
      formData.append("billingZipcode", values.billingZipcode || "");
      formData.append("billingPhone", values.billingPhone || "");
      formData.append("billingFax", values.billingFax || "");
      formData.append("shippingAttention", values.shippingAttention);
      formData.append("shippingCountry", values.shippingCountry);
      formData.append("shippingAddress", values.shippingAddress);
      formData.append("shippingCity", values.shippingCity);
      formData.append("shippingState", values.shippingState);
      formData.append("shippingZipcode", values.shippingZipcode);
      formData.append("shippingPhone", values.shippingPhone);
      formData.append("shippingFax", values.shippingFax);
      formData.append("remark", values.remark);
      formData.append("pan", values.pan);
      formData.append("fileAttachment", values.fileAttachment);
      formData.append(
        "contacts",
        JSON.stringify(
          values.contacts
            .filter(
              (item) =>
                item.salutation &&
                item.vendorFirstName &&
                item.vendorLastName &&
                item.vendorEmail &&
                item.vendorPhone &&
                item.vendorMobile &&
                item.skypeName &&
                item.designation &&
                item.department
            ) // Filter out incomplete items
            .map((item) => ({
              salutation: item.salutation,
              vendorFirstName: item.vendorFirstName,
              vendorLastName: item.vendorLastName,
              vendorEmail: item.vendorEmail,
              vendorPhone: item.vendorPhone,
              vendorMobile: item.vendorMobile,
              skypeName: item.skypeName,
              designation: item.designation,
              department: item.department,
            }))
        )
      );
      formData.append(
        "bankDetails",
        JSON.stringify(
          values.bankDetails
            .filter(
              (item) =>
                item.accountHolderName &&
                item.bankName &&
                item.accountNumber &&
                item.reAccountNumber &&
                item.ifsc
            )
            .map((item) => ({
              accountHolderName: item.accountHolderName,
              bankName: item.bankName,
              accountNumber: parseFloat(item.accountNumber),
              reAccountNumber: parseFloat(item.reAccountNumber),
              ifsc: parseFloat(item.ifsc),
            }))
        )
      );

      try {
        const response = await api.put(
          `/updateVendorWithBank/${id}`,
          formData,
          {}
        );
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

  useEffect(() => {
    if (formik.values.contacts) {
      setRows(formik.values.contacts);
    }
  }, [formik.values.contacts]);

  const handleInputChange = (rowIndex, field, value) => {
    setRows((prevRows) =>
      prevRows.map((row, idx) =>
        idx === rowIndex ? { ...row, [field]: value } : row
      )
    );

    formik.setFieldValue(`contacts[${rowIndex}].${field}`, value);
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

  const handleCheckboxChange = (event) => {
    setEnablePortal(event.target.checked);
  };

  useEffect(() => {
    const getData = async () => {
      setLoading(true);
      try {
        const response = await api.get(`/vendorRetrievalWithBank/${id}`);
        formik.setValues(response.data);
        setEnablePortal(response.data.enablePortal || false);
        const contactRows = response.data.contacts.map((contact) => ({
          id: contact.id,
          salutation: contact.salutation,
          vendorFirstName: contact.vendorFirstName,
          vendorLastName: contact.vendorLastName,
          vendorEmail: contact.vendorEmail,
          vendorPhone: contact.vendorPhone,
          vendorMobile: contact.vendorMobile,
          skypeName: contact.skypeName,
          designation: contact.designation,
          department: contact.department,
        }));

        setRows(contactRows);

        const bankFields = response.data.bankDetails.map((bank) => ({
          id: bank.id,
          accountHolderName: bank.accountHolderName,
          bankName: bank.bankName,
          accountNumber: bank.accountNumber,
          reAccountNumber: bank.reAccountNumber,
          ifsc: bank.ifsc,
          vendorId: bank.vendorId,
        }));

        setFields(bankFields);
        setData(response.data);
      } catch (e) {
        toast.error("Error fetching data: ", e?.response?.data?.message);
      } finally {
        setLoading(false);
      }
    };

    getData();
  }, [id]);

  return (
    <div className="container-fluid px-2  minHeight m-0">
      <form onSubmit={formik.handleSubmit}>
        <div
          className="card shadow border-0 mb-2 top-header sticky-top"
          style={{ borderRadius: "0", top: "66px" }}
        >
          <div className="container-fluid py-4">
            <div className="row align-items-center">
              <div className="col">
                <div className="d-flex align-items-center gap-4">
                  <h1 className="h4 ls-tight headingColor">Edit Vendors</h1>
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
                  Salutation<span className="text-danger">*</span>
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

              <div className="col-md-6 col-12 mb-2">
                <lable className="form-lable">Company Name</lable>
                <div className="mb-3">
                  <input
                    type="text"
                    name="companyName"
                    className={`form-control form-control-sm ${
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
                    className={`form-control form-control-sm  ${
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
                    className={`form-control form-control-sm  ${
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
                    className={`form-control form-control-sm  ${
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
                    className={`form-control form-control-sm  ${
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
                      className={`form-control form-control-sm  ${
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
                      className={`form-select form-select-sm  ${
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
                      className={`form-select form-select-sm  ${
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
                  <label className="form-label mb-0">TDS</label>
                  <div className="mb-3">
                    <select
                      type="text"
                      name="taxRate"
                      className={`form-select form-select-sm ${
                        formik.touched.taxRate && formik.errors.taxRate
                          ? "is-invalid"
                          : ""
                      }`}
                      {...formik.getFieldProps("taxRate")}
                    >
                      <option selected></option>
                      <option value="1">Dividend</option>
                      <option value="2">Commission or Brokerage</option>
                      <option value="3">Professional Fees</option>
                    </select>
                    {formik.touched.taxRate && formik.errors.taxRate && (
                      <div className="invalid-feedback">
                        {formik.errors.taxRate}
                      </div>
                    )}
                  </div>
                </div>
                <div className="col-md-6 col-12 mb-2">
                  <div className="d-flex align-items-center">
                    <label className="form-label mb-0">Enable Portal</label>
                    <span
                      className="infoField"
                      title="Give your vendors access to portal to view transactions and payments"
                    >
                      <IoMdInformationCircleOutline />
                    </span>
                  </div>
                  <div className="form-check">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      checked={enablePortal}
                      onChange={handleCheckboxChange} // Handle checkbox state changes dynamically
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
                      className={`form-control form-control-sm ${
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
                      className={`form-control form-control-sm  ${
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
                      className={`form-control form-control-sm  ${
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
                      className={`form-control form-control-sm ${
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
                      className={`form-control form-control-sm ${
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
                      className={`form-control form-control-sm ${
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
                  <div className="row mt-3">
                    <div className="col-12 mb-2">
                      <lable className="form-lable">Attention</lable>
                      <div className="mb-3">
                        <input
                          type="text"
                          name="billingAttention"
                          className={`form-control form-control-sm  ${
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
                          className={`form-control form-control-sm  ${
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
                          className={`form-control form-control-sm  ${
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
                          className={`form-control form-control-sm  ${
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
                          className={`form-control form-control-sm  ${
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
                          className={`form-control form-control-sm  ${
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
                          className={`form-control form-control-sm  ${
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
                          className={`form-control form-control-sm  ${
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
                  <div className="row mt-3">
                    <div className="col-12 mb-2">
                      <lable className="form-lable">Attention</lable>
                      <div className="mb-3">
                        <input
                          type="text"
                          name="shippingAttention"
                          className={`form-control form-control-sm  ${
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
                          className={`form-control form-control-sm  ${
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
                          className={`form-control form-control-sm  ${
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
                          className={`form-control form-control-sm  ${
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
                          className={`form-control form-control-sm  ${
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
                          className={`form-control form-control-sm  ${
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
                          className={`form-control form-control-sm  ${
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
                          className={`form-control form-control-sm  ${
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
                      {formik.values.contacts?.map((item, index) => (
                        <tr key={index}>
                          <td>
                            <input
                              type="text"
                              name={`contacts[${index}].salutation`}
                              className={`form-control ${
                                formik.touched.contacts?.[index]?.salutation &&
                                formik.errors.contacts?.[index]?.salutation
                                  ? "is-invalid"
                                  : ""
                              }`}
                              {...formik.getFieldProps(
                                `contacts[${index}].salutation`
                              )}
                            />
                            {formik.touched.contacts?.[index]?.salutation &&
                              formik.errors.contacts?.[index]?.salutation && (
                                <div className="invalid-feedback">
                                  {formik.errors.contacts[index].salutation}
                                </div>
                              )}
                          </td>
                          <td>
                            <input
                              type="text"
                              name={`contacts[${index}].vendorFirstName`}
                              className={`form-control input-wide ${
                                formik.touched.contacts?.[index]
                                  ?.vendorFirstName &&
                                formik.errors.contacts?.[index]?.vendorFirstName
                                  ? "is-invalid"
                                  : ""
                              }`}
                              {...formik.getFieldProps(
                                `contacts[${index}].vendorFirstName`
                              )}
                            />
                            {formik.touched.contacts?.[index]
                              ?.vendorFirstName &&
                              formik.errors.contacts?.[index]
                                ?.vendorFirstName && (
                                <div className="invalid-feedback">
                                  {
                                    formik.errors.contacts[index]
                                      .vendorFirstName
                                  }
                                </div>
                              )}
                          </td>
                          <td>
                            <input
                              type="text"
                              name={`contacts[${index}].vendorLastName`}
                              className={`form-control input-wide ${
                                formik.touched.contacts?.[index]
                                  ?.vendorLastName &&
                                formik.errors.contacts?.[index]?.vendorLastName
                                  ? "is-invalid"
                                  : ""
                              }`}
                              {...formik.getFieldProps(
                                `contacts[${index}].vendorLastName`
                              )}
                            />
                            {formik.touched.contacts?.[index]?.vendorLastName &&
                              formik.errors.contacts?.[index]
                                ?.vendorLastName && (
                                <div className="invalid-feedback">
                                  {formik.errors.contacts[index].vendorLastName}
                                </div>
                              )}
                          </td>
                          <td>
                            <input
                              type="text"
                              name={`contacts[${index}].vendorEmail`}
                              className={`form-control input-wide ${
                                formik.touched.contacts?.[index]?.vendorEmail &&
                                formik.errors.contacts?.[index]?.vendorEmail
                                  ? "is-invalid"
                                  : ""
                              }`}
                              {...formik.getFieldProps(
                                `contacts[${index}].vendorEmail`
                              )}
                            />
                            {formik.touched.contacts?.[index]?.vendorEmail &&
                              formik.errors.contacts?.[index]?.vendorEmail && (
                                <div className="invalid-feedback">
                                  {formik.errors.contacts[index].vendorEmail}
                                </div>
                              )}
                          </td>
                          <td>
                            <input
                              type="text"
                              name={`contacts[${index}].vendorPhone`}
                              className={`form-control input-wide ${
                                formik.touched.contacts?.[index]?.vendorPhone &&
                                formik.errors.contacts?.[index]?.vendorPhone
                                  ? "is-invalid"
                                  : ""
                              }`}
                              {...formik.getFieldProps(
                                `contacts[${index}].vendorPhone`
                              )}
                            />
                            {formik.touched.contacts?.[index]?.vendorPhone &&
                              formik.errors.contacts?.[index]?.vendorPhone && (
                                <div className="invalid-feedback">
                                  {formik.errors.contacts[index].vendorPhone}
                                </div>
                              )}
                          </td>
                          <td>
                            <input
                              type="text"
                              name={`contacts[${index}].vendorPhone`}
                              className={`form-control input-wide ${
                                formik.touched.contacts?.[index]?.vendorPhone &&
                                formik.errors.contacts?.[index]?.vendorPhone
                                  ? "is-invalid"
                                  : ""
                              }`}
                              {...formik.getFieldProps(
                                `contacts[${index}].vendorPhone`
                              )}
                            />
                            {formik.touched.contacts?.[index]?.vendorPhone &&
                              formik.errors.contacts?.[index]?.vendorPhone && (
                                <div className="invalid-feedback">
                                  {formik.errors.contacts[index].vendorPhone}
                                </div>
                              )}
                          </td>
                          <td>
                            <input
                              type="text"
                              name={`contacts[${index}].skypeName`}
                              className={`form-control input-wide ${
                                formik.touched.contacts?.[index]?.skypeName &&
                                formik.errors.contacts?.[index]?.skypeName
                                  ? "is-invalid"
                                  : ""
                              }`}
                              {...formik.getFieldProps(
                                `contacts[${index}].skypeName`
                              )}
                            />
                            {formik.touched.contacts?.[index]?.skypeName &&
                              formik.errors.contacts?.[index]?.skypeName && (
                                <div className="invalid-feedback">
                                  {formik.errors.contacts[index].skypeName}
                                </div>
                              )}
                          </td>
                          <td>
                            <input
                              type="text"
                              name={`contacts[${index}].designation`}
                              className={`form-control input-wide ${
                                formik.touched.contacts?.[index]?.designation &&
                                formik.errors.contacts?.[index]?.designation
                                  ? "is-invalid"
                                  : ""
                              }`}
                              {...formik.getFieldProps(
                                `contacts[${index}].designation`
                              )}
                            />
                            {formik.touched.contacts?.[index]?.designation &&
                              formik.errors.contacts?.[index]?.designation && (
                                <div className="invalid-feedback">
                                  {formik.errors.contacts[index].designation}
                                </div>
                              )}
                          </td>
                          <td>
                            <input
                              type="text"
                              name={`contacts[${index}].department`}
                              className={`form-control input-wide ${
                                formik.touched.contacts?.[index]?.department &&
                                formik.errors.contacts?.[index]?.department
                                  ? "is-invalid"
                                  : ""
                              }`}
                              {...formik.getFieldProps(
                                `contacts[${index}].department`
                              )}
                            />
                            {formik.touched.contacts?.[index]?.department &&
                              formik.errors.contacts?.[index]?.department && (
                                <div className="invalid-feedback">
                                  {formik.errors.contacts[index].department}
                                </div>
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
                        <div className="col-md-6 col-12 mb-2">
                          <label className="form-label">
                            Account Holder Name
                            <span className="text-danger">*</span>
                          </label>
                          <div className="mb-3">
                            <input
                              type="text"
                              name={`bankDetails[${index}].accountHolderName`}
                              className={`form-control form-control-sm ${
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
                          <label className="form-label">
                            Bank Name<span className="text-danger">*</span>
                          </label>
                          <div className="mb-3">
                            <input
                              type="text"
                              name={`bankDetails[${index}].bankName`}
                              className={`form-control form-control-sm ${
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
                              className={`form-control form-control-sm ${
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
                              className={`form-control form-control-sm ${
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
                              className={`form-control form-control-sm ${
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

export default VendorEdit;
