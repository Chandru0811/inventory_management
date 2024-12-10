import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import api from "../../../../config/URL";
import toast from "react-hot-toast";
import CustomerList from "../../../list/CustomerList";

const PaymentReceivedEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [loading, setLoadIndicator] = useState(false);
  const [customerData, setCustomerData] = useState(null);

  const validationSchema = Yup.object({
    customerName: Yup.string().required("*Customer Name is required"),
    amountReceive: Yup.string().required("*Amount Receive is required"),
    depositTo: Yup.string().required("*Deposit to is required"),
    taxDeduction: Yup.string().required("*Tax Deduction is required"),
  });

  const formik = useFormik({
    initialValues: {
      customerName: "",
      amountReceive: "",
      paymentCharges: "",
      taxDeduction: "",
      paymentMode: "",
      depositTo: "",
      reference: "",
      notes: "",
      file: "",
      salesOrderItemsJson: [
        {
          date: "",
          invoiceNumber: "",
          invoiceAmount: "",
          amountDue: "",
          payment: "",
        },
      ],
      subAmountExcess: "",
      subAmountPayment: "",
      subAmountReceived: "",
      subAmountRefunded: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      setLoadIndicator(true);
      console.log(values);

      const formData = new FormData();

      formData.append("customerName", values.customerName);
      formData.append("payment", values.payment || "2");
      formData.append("amountReceive", values.amountReceive);
      formData.append("paymentCharges", values.paymentCharges);
      formData.append("taxDeduction", values.taxDeduction);
      formData.append("paymentMode", values.paymentMode);
      formData.append("depositTo", values.depositTo);
      formData.append("reference", values.reference);
      formData.append("notes", values.notes);
      formData.append("companyId", values.companyId || "1");
      formData.append("file", values.file);
      // formData.append(
      //   "salesOrderItemsJson",
      //   JSON.stringify(
      //     values.salesOrderItemsJson?.map((item) => ({
      //       itemId: item.itemId?.id || item.itemId,
      //       quantity: item.quantity,
      //       rate: item.rate,
      //       discount: item.discount,
      //       amount: item.amount,
      //     }))
      //   )
      // );

      try {
        const response = await api.put(
          `/updatePaymentDetailProfileImage/${id}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        if (response.status === 201) {
          toast.success(response.data.message);
          navigate("/paymentreceived");
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

  const getCustomerName = async () => {
    try {
      const currencyData = await CustomerList();
      setCustomerData(currencyData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    getCustomerName();
  }, []);

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await api.get(`/getAllPaymentDetailsById/${id}`);
        formik.setValues(response.data);
        setData(response.data);
      } catch (e) {
        toast.error("Error fetching data: ", e?.response?.data?.message);
      }
    };

    getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="container-fluid px-2 minHeight m-0">
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
                    Edit Payment Received
                  </h1>
                </div>
              </div>
              <div className="col-auto">
                <div className="hstack gap-2 justify-content-end">
                  <Link to="/paymentreceived">
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
          <div className="row mt-3 me-2">
            <div className="col-12 text-end"></div>
          </div>
          <div className="container mb-5">
            <div className="row py-4">
              <div className="col-md-6 col-12 mb-2">
                <lable className="form-lable">
                  Customer Name<span className="text-danger">*</span>
                </lable>
                <div className="mb-3">
                  <select
                    {...formik.getFieldProps("customerName")}
                    className={`form-select form-select-sm   ${
                      formik.touched.customerId && formik.errors.customerId
                        ? "is-invalid"
                        : ""
                    }`}
                  >
                    <option selected></option>
                    {customerData &&
                      customerData.map((data) => (
                        <option key={data.customer_id} value={data.customer_id}>
                          {data.customer_name}
                        </option>
                      ))}
                  </select>
                  {formik.touched.customerId && formik.errors.customerId && (
                    <div className="invalid-feedback">
                      {formik.errors.customerId}
                    </div>
                  )}
                </div>
              </div>
              {/* <div className="col-md-6 col-12 mb-2">
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
              </div> */}
              <div className="col-md-6 col-12 mb-2">
                <lable className="form-lable">
                  Amount Receive<span className="text-danger">*</span>
                </lable>
                <div className="mb-3">
                  <input
                    type="text"
                    name="amountReceive"
                    className={`form-control form-control-sm ${
                      formik.touched.amountReceive &&
                      formik.errors.amountReceive
                        ? "is-invalid"
                        : ""
                    }`}
                    {...formik.getFieldProps("amountReceive")}
                  />
                  {formik.touched.amountReceive &&
                    formik.errors.amountReceive && (
                      <div className="invalid-feedback">
                        {formik.errors.amountReceive}
                      </div>
                    )}
                </div>
              </div>

              <div className="col-md-6 col-12 mb-2">
                <lable className="form-lable">Payment Charges</lable>
                <div className="mb-3">
                  <input
                    type="text"
                    name="paymentCharges"
                    className={`form-control form-control-sm ${
                      formik.touched.paymentCharges &&
                      formik.errors.paymentCharges
                        ? "is-inpaymentChargesalid"
                        : ""
                    }`}
                    {...formik.getFieldProps("paymentCharges")}
                  />
                  {formik.touched.paymentCharges &&
                    formik.errors.paymentCharges && (
                      <div className="valid-feedback">
                        {formik.errors.paymentCharges}
                      </div>
                    )}
                </div>
              </div>

              <div className="col-md-6 col-12 mb-3">
                <div>
                  <label for="exampleFormControlInput1" className="form-label">
                    Tax Deduction<span className="text-danger">*</span>
                  </label>
                </div>
                <div className="form-check form-check-inline">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="taxDeduction"
                    id="NO_TAX"
                    value="NO_TAX"
                    onChange={formik.handleChange}
                    checked={formik.values.taxDeduction === "NO_TAX"}
                  />
                  <label className="form-check-label">No Tax deducted</label>
                </div>
                <div className="form-check form-check-inline">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="taxDeduction"
                    id="YES_TDS"
                    value="YES_TDS"
                    onChange={formik.handleChange}
                    checked={formik.values.taxDeduction === "YES_TDS"}
                  />
                  <label className="form-check-label">
                    Yes, TDS (Income Tax)
                  </label>
                </div>
                {formik.errors.taxDeduction && formik.touched.taxDeduction && (
                  <div className="text-danger" style={{ fontSize: ".875em" }}>
                    {formik.errors.taxDeduction}
                  </div>
                )}
              </div>

              <div className="col-md-6 col-12 mb-2">
                <lable className="form-lable">Payment Mode</lable>
                <div className="mb-3">
                  <select
                    name="paymentMode"
                    className={`form-select form-select-sm ${
                      formik.touched.paymentMode && formik.errors.paymentMode
                        ? "is-invalid"
                        : ""
                    }`}
                    {...formik.getFieldProps("paymentMode")}
                  >
                    <option value=""></option>
                    <option value="CASH">Cash</option>
                    <option value="BANK_REMITTANCE">Bank Remittance</option>
                    <option value="CHEQUE">Check</option>
                    <option value="CREDIT_CARD">Credit Card</option>
                    <option value="UPI">UPI</option>
                    <option value="BANK_TRANSFER">Bank Transfer</option>
                  </select>
                  {formik.touched.paymentMode && formik.errors.paymentMode && (
                    <div className="invalid-feedback">
                      {formik.errors.paymentMode}
                    </div>
                  )}
                </div>
              </div>

              {/* <div className="col-md-6 col-12 mb-2">
                <lable className="form-lable">
                  Deposit To<span className="text-danger">*</span>
                </lable>
                <div className="mb-3">
                  <input
                    type="text"
                    name="depositTo"
                    className={`form-control  ${
                      formik.touched.depositTo && formik.errors.depositTo
                        ? "is-invalid"
                        : ""
                    }`}
                    {...formik.getFieldProps("depositTo")}
                  />
                  {formik.touched.depositTo && formik.errors.depositTo && (
                    <div className="invalid-feedback">
                      {formik.errors.depositTo}
                    </div>
                  )}
                </div>
              </div> */}

              <div className="col-md-6 col-12 mb-2">
                <lable className="form-lable">
                  Deposit To<span className="text-danger">*</span>
                </lable>
                <div className="mb-3">
                  <select
                    name="depositTo"
                    className={`form-select form-select-sm ${
                      formik.touched.depositTo && formik.errors.depositTo
                        ? "is-invalid"
                        : ""
                    }`}
                    {...formik.getFieldProps("depositTo")}
                  >
                    <option value=""></option>
                    <option value="PETTY_CASH">Petty Cash</option>
                    <option value="UNDEPOSITED_FUND">Undeposited Fund</option>
                    <option value="EMPLOYEE_REIMBURSEMENTS">
                      Employee Reimbursements
                    </option>
                    <option value="OPENING_BALANCE_ADJUSTMENTS">
                      Opening Balance Adjustments
                    </option>
                    <option value="TDS_PAYABLE">TDS Payable</option>
                  </select>
                  {formik.touched.depositTo && formik.errors.depositTo && (
                    <div className="invalid-feedback">
                      {formik.errors.depositTo}
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
                    className={`form-control form-control-sm ${
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
                      formik.setFieldValue("file", event.target.files[0]);
                    }}
                    onBlur={formik.handleBlur}
                  />
                  {formik.touched.file && formik.errors.file && (
                    <div className="invalid-feedback">{formik.errors.file}</div>
                  )}
                </div>
              </div>

              <div className="row mt-5 mb-4">
                <div>
                  <h3
                    style={{ background: "#4066D5" }}
                    className="text-light p-2"
                  >
                    Item Table
                  </h3>
                </div>
                <div className="table-responsive">
                  <table className="table table-sm table-nowrap">
                    <thead>
                      <tr>
                        <th style={{ width: "35%" }}>Date</th>
                        <th style={{ width: "15%" }}>Invoice Number</th>
                        <th style={{ width: "15%" }}>Invoice Amount</th>
                        <th style={{ width: "15%" }}>Amount Due</th>
                        <th style={{ width: "20%" }}>Payment</th>
                      </tr>
                    </thead>
                    <tbody>
                      {formik.values.salesOrderItemsJson?.map((item, index) => (
                        <tr key={index}>
                          <td>
                            <input
                              type="text"
                              name={`salesOrderItemsJson[${index}].date`}
                              className={`form-control form-control-sm ${
                                formik.touched.salesOrderItemsJson?.[index]
                                  ?.date &&
                                formik.errors.salesOrderItemsJson?.[index]?.date
                                  ? "is-invalid"
                                  : ""
                              }`}
                              {...formik.getFieldProps(
                                `salesOrderItemsJson[${index}].date`
                              )}
                              readOnly
                            />
                            {formik.touched.salesOrderItemsJson?.[index]
                              ?.date &&
                              formik.errors.salesOrderItemsJson?.[index]
                                ?.date && (
                                <div className="invalid-feedback">
                                  {
                                    formik.errors.salesOrderItemsJson[index]
                                      .date
                                  }
                                </div>
                              )}
                          </td>
                          <td>
                            <input
                              type="text"
                              name={`salesOrderItemsJson[${index}].invoiceNumber`}
                              className={`form-control form-control-sm ${
                                formik.touched.salesOrderItemsJson?.[index]
                                  ?.invoiceNumber &&
                                formik.errors.salesOrderItemsJson?.[index]
                                  ?.invoiceNumber
                                  ? "is-invalid"
                                  : ""
                              }`}
                              {...formik.getFieldProps(
                                `salesOrderItemsJson[${index}].invoiceNumber`
                              )}
                              readOnly
                            />
                            {formik.touched.salesOrderItemsJson?.[index]
                              ?.invoiceNumber &&
                              formik.errors.salesOrderItemsJson?.[index]
                                ?.invoiceNumber && (
                                <div className="invalid-feedback">
                                  {
                                    formik.errors.salesOrderItemsJson[index]
                                      .invoiceNumber
                                  }
                                </div>
                              )}
                          </td>
                          <td>
                            <input
                              type="text"
                              name={`salesOrderItemsJson[${index}].invoiceAmount`}
                              className={`form-control form-control-sm ${
                                formik.touched.salesOrderItemsJson?.[index]
                                  ?.invoiceAmount &&
                                formik.errors.salesOrderItemsJson?.[index]
                                  ?.invoiceAmount
                                  ? "is-invalid"
                                  : ""
                              }`}
                              {...formik.getFieldProps(
                                `salesOrderItemsJson[${index}].invoiceAmount`
                              )}
                              readOnly
                            />
                            {formik.touched.salesOrderItemsJson?.[index]
                              ?.invoiceAmount &&
                              formik.errors.salesOrderItemsJson?.[index]
                                ?.invoiceAmount && (
                                <div className="invalid-feedback">
                                  {
                                    formik.errors.salesOrderItemsJson[index]
                                      .invoiceAmount
                                  }
                                </div>
                              )}
                          </td>
                          <td>
                            <input
                              type="text"
                              name={`salesOrderItemsJson[${index}].invoiceDue`}
                              className={`form-control form-control-sm ${
                                formik.touched.salesOrderItemsJson?.[index]
                                  ?.invoiceDue &&
                                formik.errors.salesOrderItemsJson?.[index]
                                  ?.invoiceDue
                                  ? "is-invalid"
                                  : ""
                              }`}
                              {...formik.getFieldProps(
                                `salesOrderItemsJson[${index}].invoiceDue`
                              )}
                              readOnly
                            />
                            {formik.touched.salesOrderItemsJson?.[index]
                              ?.invoiceDue &&
                              formik.errors.salesOrderItemsJson?.[index]
                                ?.invoiceDue && (
                                <div className="invalid-feedback">
                                  {
                                    formik.errors.salesOrderItemsJson[index]
                                      .invoiceDue
                                  }
                                </div>
                              )}
                          </td>
                          <td>
                            <input
                              type="text"
                              name={`salesOrderItemsJson[${index}].payment`}
                              className={`form-control form-control-sm ${
                                formik.touched.salesOrderItemsJson?.[index]
                                  ?.payment &&
                                formik.errors.salesOrderItemsJson?.[index]
                                  ?.payment
                                  ? "is-invalid"
                                  : ""
                              }`}
                              {...formik.getFieldProps(
                                `salesOrderItemsJson[${index}].payment`
                              )}
                            />
                            {formik.touched.salesOrderItemsJson?.[index]
                              ?.payment &&
                              formik.errors.salesOrderItemsJson?.[index]
                                ?.payment && (
                                <div className="invalid-feedback">
                                  {
                                    formik.errors.salesOrderItemsJson[index]
                                      .payment
                                  }
                                </div>
                              )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="col-md-6 col-12 mb-2">
                <lable className="form-lable">Notes</lable>
                <div className="mb-3">
                  <textarea
                    type="text"
                    name="notes"
                    className={`form-control ${
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

              <div
                className="col-md-6 col-12 mt-5 rounded"
                style={{ border: "1px solid lightgrey" }}
              >
                <div className="row mb-3 mt-2">
                  <label className="col-sm-4 col-form-label">
                    Amount Received
                  </label>
                  <div className="col-sm-4"></div>
                  <div className="col-sm-4">
                    <input
                      type="text"
                      className={`form-control form-control-sm${
                        formik.touched.subAmountReceived &&
                        formik.errors.subAmountReceived
                          ? "is-invalid"
                          : ""
                      }`}
                      {...formik.getFieldProps("subAmountReceived")}
                    />
                    {formik.touched.subAmountReceived &&
                      formik.errors.subAmountReceived && (
                        <div className="invalid-feedback">
                          {formik.errors.subAmountReceived}
                        </div>
                      )}
                  </div>
                </div>
                <div className="row mb-3">
                  <label className="col-sm-4 col-form-label">
                    Amount used for Payments
                  </label>
                  <div className="col-sm-4"></div>
                  <div className="col-sm-4">
                    <input
                      type="text"
                      className={`form-control form-control-sm ${
                        formik.touched.subAmountPayment &&
                        formik.errors.subAmountPayment
                          ? "is-invalid"
                          : ""
                      }`}
                      {...formik.getFieldProps("subAmountPayment")}
                    />
                    {formik.touched.subAmountPayment &&
                      formik.errors.subAmountPayment && (
                        <div className="invalid-feedback">
                          {formik.errors.subAmountPayment}
                        </div>
                      )}
                  </div>
                </div>
                <div className="row mb-3">
                  <label className="col-sm-4 col-form-label">
                    Amount Refunded
                  </label>
                  <div className="col-sm-4"></div>
                  <div className="col-sm-4">
                    <input
                      type="text"
                      className={`form-control form-control-sm ${
                        formik.touched.subAmountRefunded &&
                        formik.errors.subAmountRefunded
                          ? "is-invalid"
                          : ""
                      }`}
                      {...formik.getFieldProps("subAmountRefunded")}
                    />
                    {formik.touched.subAmountRefunded &&
                      formik.errors.subAmountRefunded && (
                        <div className="invalid-feedback">
                          {formik.errors.subAmountRefunded}
                        </div>
                      )}
                  </div>
                </div>
                <div className="row mb-3 mt-2">
                  <label className="col-sm-4 col-form-label">
                    Amount in Excess
                  </label>
                  <div className="col-sm-4"></div>
                  <div className="col-sm-4">
                    <input
                      type="text"
                      className={`form-control form-control-sm ${
                        formik.touched.subAmountExcess &&
                        formik.errors.subAmountExcess
                          ? "is-invalid"
                          : ""
                      }`}
                      {...formik.getFieldProps("subAmountExcess")}
                    />
                    {formik.touched.subAmountExcess &&
                      formik.errors.subAmountExcess && (
                        <div className="invalid-feedback">
                          {formik.errors.subAmountExcess}
                        </div>
                      )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default PaymentReceivedEdit;
