import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import api from "../../../../config/URL";
import toast from "react-hot-toast";
import VendorList from "../../../list/VendorList";

const PaymentMadeEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoadIndicator] = useState(false);
  const [vendor, setVendor] = useState(null);

  const validationSchema = Yup.object({
    vendorId: Yup.string().required("*Vendor Name is required"),
    payment: Yup.string().required("*Payment is required"),
    paymentMade: Yup.string().required("*Payment Made is required"),
    paymentDate: Yup.string().required("*Payment Date is required"),
    paidThrough: Yup.string().required("*Paid Through is required"),
  });

  const formik = useFormik({
    initialValues: {
      vendorId: "",
      payment: "",
      paymentMade: "",
      paymentDate: "",
      paymentMode: "",
      paidThrough: "",
      reference: "",
      imageFile: "",
      notes: "",
      purchaseOrderItemsJson: [
        {
          itemId: "",
          ordered: "",
          received: "",
          transit: "",
          quantity: "",
          amount: "",
        },
      ],
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      setLoadIndicator(true);
      console.log(values);
      try {
        const response = await api.put(`/updateMstrCustomer/${id}`, values);
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

  const getVendorData = async () => {
    try {
      const currencyData = await VendorList();
      setVendor(currencyData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    getVendorData();
  }, []);

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
                  <h1 className="h4 ls-tight headingColor">
                    Edit Payment Made
                  </h1>
                </div>
              </div>
              <div className="col-auto">
                <div className="hstack gap-2 justify-content-end">
                  <Link to="/paymentmade">
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
          <div className="row mt-3 me-2">
            <div className="col-12 text-end"></div>
          </div>
          <div className="container mb-5">
            <div className="row py-4">
              <div className="col-md-6 col-12 mb-3">
                <lable className="form-lable">
                  Vendor Name<span className="text-danger">*</span>
                </lable>
                <div className="mb-3">
                  <select
                    {...formik.getFieldProps("vendorId")}
                    className={`form-select form-select-sm   ${
                      formik.touched.vendorId && formik.errors.vendorId
                        ? "is-invalid"
                        : ""
                    }`}
                  >
                    <option selected></option>
                    {vendor &&
                      vendor.map((data) => (
                        <option key={data.id} value={data.id}>
                          {data.vendorDisplayName}
                        </option>
                      ))}
                  </select>
                  {formik.touched.vendorId && formik.errors.vendorId && (
                    <div className="invalid-feedback">
                      {formik.errors.vendorId}
                    </div>
                  )}
                </div>
              </div>
              <div className="col-md-6 col-12 mb-2">
                <lable className="form-lable">
                  Payment<span className="text-danger">*</span>
                </lable>
                <div className="mb-3">
                  <input
                    type="text"
                    name="payment"
                    className={`form-control form-control-sm ${
                      formik.touched.payment && formik.errors.payment
                        ? "is-invalid"
                        : ""
                    }`}
                    {...formik.getFieldProps("payment")}
                  />
                  {formik.touched.payment && formik.errors.payment && (
                    <div className="invalid-feedback">
                      {formik.errors.payment}
                    </div>
                  )}
                </div>
              </div>
              <div className="col-md-6 col-12 mb-2">
                <label className="form-label">
                  Payment Made<span className="text-danger">*</span>
                </label>
                <div className="input-group mb-3">
                  <span className="input-group-text">INR</span>{" "}
                  <input
                    type="text"
                    name="paymentMade"
                    className={`form-control form-control-sm ${
                      formik.touched.paymentMade && formik.errors.paymentMade
                        ? "is-invalid"
                        : ""
                    }`}
                    {...formik.getFieldProps("paymentMade")}
                  />
                  {formik.touched.paymentMade && formik.errors.paymentMade && (
                    <div className="invalid-feedback">
                      {formik.errors.paymentMade}
                    </div>
                  )}
                </div>
              </div>
              <div className="col-md-6 col-12 mb-2">
                <lable className="form-lable">
                  Payment Date<span className="text-danger">*</span>
                </lable>
                <div className="mb-3">
                  <input
                    type="date"
                    name="paymentDate"
                    className={`form-control form-control-sm ${
                      formik.touched.paymentDate && formik.errors.paymentDate
                        ? "is-invalid"
                        : ""
                    }`}
                    {...formik.getFieldProps("paymentDate")}
                  />
                  {formik.touched.paymentDate && formik.errors.paymentDate && (
                    <div className="invalid-feedback">
                      {formik.errors.paymentDate}
                    </div>
                  )}
                </div>
              </div>
              <div className="col-md-6 col-12 mb-2">
                <lable className="form-lable">Payment Mode</lable>
                <div className="mb-3">
                  <select
                    type="text"
                    name="paymentMode"
                    className={`form-select form-select-sm ${
                      formik.touched.paymentMode && formik.errors.paymentMode
                        ? "is-invalid"
                        : ""
                    }`}
                    {...formik.getFieldProps("paymentMode")}
                  >
                    <option selected></option>
                    <option value="Cash">Cash</option>
                    <option value="Check">Check</option>
                    <option value="Bank Transfer">Bank Transfer</option>
                  </select>
                  {formik.touched.paymentMode && formik.errors.paymentMode && (
                    <div className="invalid-feedback">
                      {formik.errors.paymentMode}
                    </div>
                  )}
                </div>
              </div>
              <div className="col-md-6 col-12 mb-2">
                <lable className="form-lable">
                  Paid Through<span className="text-danger">*</span>
                </lable>
                <div className="mb-3">
                  <select
                    type="text"
                    name="paidThrough"
                    className={`form-select form-select-sm ${
                      formik.touched.paidThrough && formik.errors.paidThrough
                        ? "is-invalid"
                        : ""
                    }`}
                    {...formik.getFieldProps("paidThrough")}
                  >
                    <option selected></option>
                    <option value="Petty Cash">Petty Cash</option>
                    <option value="Undeposited Funds">Undeposited Funds</option>
                    <option value="Net Salary Payable">
                      Net Salary Payable
                    </option>
                  </select>
                  {formik.touched.paidThrough && formik.errors.paidThrough && (
                    <div className="invalid-feedback">
                      {formik.errors.paidThrough}
                    </div>
                  )}
                </div>
              </div>

              <div className="col-md-6 col-12 mb-2">
                <lable className="form-lable">Reference</lable>
                <div className="mb-3">
                  <input
                    type="text"
                    name="reference"
                    className={`form-control form-control-sm  ${
                      formik.touched.reference && formik.errors.reference
                        ? "is-invalid"
                        : ""
                    }`}
                    {...formik.getFieldProps("reference")}
                  />
                  {formik.touched.reference && formik.errors.reference && (
                    <div className="invalid-feedback">
                      {formik.errors.reference}
                    </div>
                  )}
                </div>
              </div>
              <div className="col-md-6 col-12 mb-2">
                <lable className="form-lable">Attach File</lable>
                <div className="mb-3">
                  <input
                    type="file"
                    className="form-control form-control-sm"
                    onChange={(event) => {
                      formik.setFieldValue("imageFile", event.target.files[0]);
                    }}
                    onBlur={formik.handleBlur}
                  />
                  {formik.touched.imageFile && formik.errors.imageFile && (
                    <div className="invalid-feedback">
                      {formik.errors.imageFile}
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="row mt-5">
              <div className="">
                <h3
                  style={{ background: "#4066D5" }}
                  className="text-light p-2"
                >
                  Bills
                </h3>
              </div>
              <div className="table-responsive">
                <table className="table table-sm table-nowrap">
                  <thead>
                    <tr>
                      <th style={{ width: "15%" }}>Bill</th>
                      <th style={{ width: "15%" }}>Purchase Order</th>
                      <th style={{ width: "15%" }}>Date</th>
                      <th style={{ width: "15%" }}>Bill Amount</th>
                      <th style={{ width: "15%" }}>Amount Due</th>
                      <th style={{ width: "15%" }}>Payment</th>
                    </tr>
                  </thead>
                  <tbody>
                    {formik.values.purchaseOrderItemsJson?.map(
                      (item, index) => (
                        <tr key={index}>
                          <td>
                            <input
                              type="text"
                              name={`purchaseOrderItemsJson[${index}].itemId`}
                              className={`form-control ${
                                formik.touched.purchaseOrderItemsJson?.[index]
                                  ?.itemId &&
                                formik.errors.purchaseOrderItemsJson?.[index]
                                  ?.itemId
                                  ? "is-invalid"
                                  : ""
                              }`}
                              {...formik.getFieldProps(
                                `purchaseOrderItemsJson[${index}].itemId`
                              )}
                              readOnly
                            />
                            {formik.touched.purchaseOrderItemsJson?.[index]
                              ?.itemId &&
                              formik.errors.purchaseOrderItemsJson?.[index]
                                ?.itemId && (
                                <div className="invalid-feedback">
                                  {
                                    formik.errors.purchaseOrderItemsJson[index]
                                      .itemId
                                  }
                                </div>
                              )}
                          </td>
                          <td>
                            <input
                              type="text"
                              name={`purchaseOrderItemsJson[${index}].ordered`}
                              className={`form-control ${
                                formik.touched.purchaseOrderItemsJson?.[index]
                                  ?.ordered &&
                                formik.errors.purchaseOrderItemsJson?.[index]
                                  ?.ordered
                                  ? "is-invalid"
                                  : ""
                              }`}
                              {...formik.getFieldProps(
                                `purchaseOrderItemsJson[${index}].ordered`
                              )}
                              readOnly
                            />
                            {formik.touched.purchaseOrderItemsJson?.[index]
                              ?.ordered &&
                              formik.errors.purchaseOrderItemsJson?.[index]
                                ?.ordered && (
                                <div className="invalid-feedback">
                                  {
                                    formik.errors.purchaseOrderItemsJson[index]
                                      .ordered
                                  }
                                </div>
                              )}
                          </td>
                          <td>
                            <input
                              type="text"
                              name={`purchaseOrderItemsJson[${index}].received`}
                              className={`form-control ${
                                formik.touched.purchaseOrderItemsJson?.[index]
                                  ?.received &&
                                formik.errors.purchaseOrderItemsJson?.[index]
                                  ?.received
                                  ? "is-invalid"
                                  : ""
                              }`}
                              {...formik.getFieldProps(
                                `purchaseOrderItemsJson[${index}].received`
                              )}
                              readOnly
                            />
                            {formik.touched.purchaseOrderItemsJson?.[index]
                              ?.received &&
                              formik.errors.purchaseOrderItemsJson?.[index]
                                ?.received && (
                                <div className="invalid-feedback">
                                  {
                                    formik.errors.purchaseOrderItemsJson[index]
                                      .received
                                  }
                                </div>
                              )}
                          </td>
                          <td>
                            <input
                              type="text"
                              name={`purchaseOrderItemsJson[${index}].transit`}
                              className={`form-control ${
                                formik.touched.purchaseOrderItemsJson?.[index]
                                  ?.transit &&
                                formik.errors.purchaseOrderItemsJson?.[index]
                                  ?.transit
                                  ? "is-invalid"
                                  : ""
                              }`}
                              {...formik.getFieldProps(
                                `purchaseOrderItemsJson[${index}].transit`
                              )}
                              readOnly
                            />
                            {formik.touched.purchaseOrderItemsJson?.[index]
                              ?.transit &&
                              formik.errors.purchaseOrderItemsJson?.[index]
                                ?.transit && (
                                <div className="invalid-feedback">
                                  {
                                    formik.errors.purchaseOrderItemsJson[index]
                                      .transit
                                  }
                                </div>
                              )}
                          </td>
                          <td>
                            <input
                              type="text"
                              name={`purchaseOrderItemsJson[${index}].quantity`}
                              className={`form-control ${
                                formik.touched.purchaseOrderItemsJson?.[index]
                                  ?.quantity &&
                                formik.errors.purchaseOrderItemsJson?.[index]
                                  ?.quantity
                                  ? "is-invalid"
                                  : ""
                              }`}
                              {...formik.getFieldProps(
                                `purchaseOrderItemsJson[${index}].quantity`
                              )}
                              readOnly
                            />
                            {formik.touched.purchaseOrderItemsJson?.[index]
                              ?.quantity &&
                              formik.errors.purchaseOrderItemsJson?.[index]
                                ?.quantity && (
                                <div className="invalid-feedback">
                                  {
                                    formik.errors.purchaseOrderItemsJson[index]
                                      .quantity
                                  }
                                </div>
                              )}
                          </td>
                          <td>
                            <input
                              type="text"
                              name={`purchaseOrderItemsJson[${index}].amount`}
                              className={`form-control ${
                                formik.touched.purchaseOrderItemsJson?.[index]
                                  ?.amount &&
                                formik.errors.purchaseOrderItemsJson?.[index]
                                  ?.amount
                                  ? "is-invalid"
                                  : ""
                              }`}
                              {...formik.getFieldProps(
                                `purchaseOrderItemsJson[${index}].amount`
                              )}
                            />
                            {formik.touched.purchaseOrderItemsJson?.[index]
                              ?.amount &&
                              formik.errors.purchaseOrderItemsJson?.[index]
                                ?.amount && (
                                <div className="invalid-feedback">
                                  {
                                    formik.errors.purchaseOrderItemsJson[index]
                                      .amount
                                  }
                                </div>
                              )}
                          </td>
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="row mt-5">
              <div className="col-md-6 col-12 mb-2">
                <lable className="form-lable">Notes</lable>
                <div className="mb-3">
                  <textarea
                    type="text"
                    name="notes"
                    className={`form-control  ${
                      formik.touched.notes && formik.errors.notes
                        ? "is-invalid"
                        : ""
                    }`}
                    rows="4"
                    {...formik.getFieldProps("notes")}
                  />
                  {formik.touched.notes && formik.errors.notes && (
                    <div className="invalid-feedback">
                      {formik.errors.notes}
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

export default PaymentMadeEdit;
