import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import api from "../../../../config/URL";
import toast from "react-hot-toast";

function BillsAdd() {
  const navigate = useNavigate();
  const [loading, setLoadIndicator] = useState(false);
  const [vendorData, setVendorData] = useState(null);
  const [itemData, setItemData] = useState(null);
  const [itemAccData, setItemAccData] = useState(null);
  const [itemCustomerData, setItemCustomerData] = useState(null);

  const validationSchema = Yup.object({
    vendorId: Yup.string().required("*Vendor name is required"),
    billNumber: Yup.string().required("*Bill Number is required"),
    billDate: Yup.string().required("*Bill Date is required"),
  });

  const formik = useFormik({
    initialValues: {
      vendorId: "",
      billNumber: "",
      orderNumber: "",
      billDate: "",
      dueDate: "",
      subject: "",
      subTotal: "",
      discount: "",
      total: "",
      notes: "",
      adjustments: "",
      itemDetails: [
        {
          itemId: "",
          quantity: "",
          rate: "",
          customerDetail: "",
          accountId: "",
          amount: "",
        },
      ],
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      setLoadIndicator(true);
      console.log("Form Data: ", values);

      try {
        const formData = new FormData();
        formData.append("vendorId", values.vendorId);
        formData.append("billNumber", values.billNumber);
        formData.append("orderNumber", values.orderNumber);
        formData.append("billDate", values.billDate);
        formData.append("dueDate", values.dueDate);
        formData.append("subject", values.subject);
        formData.append("subTotal", values.subTotal);
        formData.append("discount", values.discount);
        formData.append("total", values.total);
        formData.append("notes", values.notes);
        formData.append("adjustments", values.adjustments);
        formData.append("companyId ", 1);
        formData.append(
          "itemDetails",
          JSON.stringify(
            values.itemDetails?.map((item) => ({
              itemId: item.itemId,
              quantity: item.quantity,
              rate: item.rate,
              customerDetail: item.customerDetail,
              accountId: item.accountId,
              amount: item.amount,
            }))
          )
        );

        const response = await api.post("billsCreationWithItems", formData);

        if (response.status === 201) {
          toast.success(response.data.message);
          navigate("/bills");
        } else {
          toast.error(response.data.message);
        }
      } catch (error) {
        console.error("Error submitting form:", error);
        toast.error("Error: Unable to save sales order.");
      } finally {
        setLoadIndicator(false);
      }
    },
  });

  const AddRowContent = () => {
    formik.setFieldValue("itemDetails", [
      ...formik.values.itemDetails,
      {
        itemId: "",
        quantity: "",
        rate: "",
        customer: "",
        taxRate: "",
        amount: "",
      },
    ]);
  };

  const deleteRow = (index) => {
    if (formik.values.itemDetails.length === 1) {
      return;
    }
    const updatedRows = [...formik.values.itemDetails];
    updatedRows.pop();
    formik.setFieldValue("itemDetails", updatedRows);
  };

  const fetchData = async () => {
    try {
      const [
        vendorResponse,
        itemsResponse,
        accountsResponse,
        customersResponse,
      ] = await Promise.all([
        api.get("vendorIdsWithDisplayNames"),
        api.get("itemId-name"),
        api.get("getAllAccounts"),
        api.get("getAllCustomerContact"),
      ]);

      setVendorData(vendorResponse.data || []);
      setItemData(itemsResponse.data || []);
      setItemAccData(accountsResponse.data || []);
      setItemCustomerData(customersResponse.data || []);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
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
                  <h1 className="h4 ls-tight headingColor">Add Bills</h1>
                </div>
              </div>
              <div className="col-auto">
                <div className="hstack gap-2 justify-content-end">
                  <Link to="/bills">
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
          <div className="container mb-5 mt-5">
            <div className="row py-4">
              <div className="col-md-6 col-12 mb-3">
                <lable className="form-lable">
                  Vendor Name<span className="text-danger">*</span>
                </lable>
                <div className="mb-3">
                  <select
                    {...formik.getFieldProps("vendorId")}
                    className={`form-select    ${
                      formik.touched.vendorId && formik.errors.vendorId
                        ? "is-invalid"
                        : ""
                    }`}
                  >
                    <option selected></option>
                    {vendorData &&
                      vendorData?.map((itemId) => (
                        <option key={itemId.id} value={itemId.id}>
                          {itemId.vendorDisplayName}
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

              <div className="col-md-6 col-12 mb-3">
                <lable className="form-lable">
                  Bill Number<span className="text-danger">*</span>
                </lable>
                <div className="mb-3">
                  <input
                    type="text"
                    className={`form-control  ${
                      formik.touched.billNumber && formik.errors.billNumber
                        ? "is-invalid"
                        : ""
                    }`}
                    {...formik.getFieldProps("billNumber")}
                  />
                  {formik.touched.billNumber && formik.errors.billNumber && (
                    <div className="invalid-feedback">
                      {formik.errors.billNumber}
                    </div>
                  )}
                </div>
              </div>

              <div className="col-md-6 col-12 mb-3">
                <lable className="form-lable">Order Number</lable>
                <div className="">
                  <input
                    type="text"
                    className={`form-control ${
                      formik.touched.orderNumber && formik.errors.orderNumber
                        ? "is-invalid"
                        : ""
                    }`}
                    {...formik.getFieldProps("orderNumber")}
                  />
                  {formik.touched.orderNumber && formik.errors.orderNumber && (
                    <div className="invalid-feedback">
                      {formik.errors.orderNumber}
                    </div>
                  )}
                </div>
              </div>

              <div className="col-md-6 col-12 mb-3">
                <lable className="form-lable">Subject</lable>
                <div className="">
                  <input
                    type="text"
                    className={`form-control ${
                      formik.touched.subject && formik.errors.subject
                        ? "is-invalid"
                        : ""
                    }`}
                    {...formik.getFieldProps("subject")}
                  />
                  {formik.touched.subject && formik.errors.subject && (
                    <div className="invalid-feedback">
                      {formik.errors.subject}
                    </div>
                  )}
                </div>
              </div>

              <div className="col-md-6 col-12 mb-3">
                <lable className="form-lable">
                  Bill Date<span className="text-danger">*</span>
                </lable>
                <div className="">
                  <input
                    type="date"
                    className={`form-control ${
                      formik.touched.billDate && formik.errors.billDate
                        ? "is-invalid"
                        : ""
                    }`}
                    {...formik.getFieldProps("billDate")}
                  />
                  {formik.touched.billDate && formik.errors.billDate && (
                    <div className="invalid-feedback">
                      {formik.errors.billDate}
                    </div>
                  )}
                </div>
              </div>
              <div className="col-md-6 col-12 mb-3">
                <lable className="form-lable">Due Date</lable>
                <div className="">
                  <input
                    type="date"
                    className={`form-control ${
                      formik.touched.dueDate && formik.errors.dueDate
                        ? "is-invalid"
                        : ""
                    }`}
                    {...formik.getFieldProps("dueDate")}
                  />
                  {formik.touched.dueDate && formik.errors.dueDate && (
                    <div className="invalid-feedback">
                      {formik.errors.dueDate}
                    </div>
                  )}
                </div>
              </div>

              <div className="row">
                <div className="">
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
                        <th>S.NO</th>
                        <th style={{ width: "20%" }}>Item</th>
                        <th style={{ width: "25%" }}>Account</th>
                        <th style={{ width: "15%" }}>Quantity</th>
                        <th style={{ width: "15%" }}>Rate</th>
                        <th style={{ width: "15%" }}>Customer Details</th>
                        <th style={{ width: "15%" }}>Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {formik.values.itemDetails?.map((item, index) => (
                        <tr key={index}>
                          <th scope="row">{index + 1}</th>
                          <td>
                            <select
                              name={`itemDetails[${index}].itemId`}
                              {...formik.getFieldProps(
                                `itemDetails[${index}].itemId`
                              )}
                              className={`form-select ${
                                formik.touched.itemDetails?.[index]?.itemId &&
                                formik.errors.itemDetails?.[index]?.itemId
                                  ? "is-invalid"
                                  : ""
                              }`}
                            >
                              <option selected> </option>
                              {itemData &&
                                itemData?.map((itemId) => (
                                  <option key={itemId.id} value={itemId.id}>
                                    {itemId.name}
                                  </option>
                                ))}
                            </select>
                            {formik.touched.itemDetails?.[index]?.itemId &&
                              formik.errors.itemDetails?.[index]?.itemId && (
                                <div className="invalid-feedback">
                                  {formik.errors.itemDetails[index].itemId}
                                </div>
                              )}
                          </td>
                          <td>
                            <select
                              name={`itemDetails[${index}].accountId`}
                              {...formik.getFieldProps(
                                `itemDetails[${index}].accountId`
                              )}
                              className={`form-select ${
                                formik.touched.itemDetails?.[index]
                                  ?.accountId &&
                                formik.errors.itemDetails?.[index]?.accountId
                                  ? "is-invalid"
                                  : ""
                              }`}
                            >
                              <option selected> </option>
                              {itemAccData &&
                                itemAccData?.map((accData) => (
                                  <option key={accData.id} value={accData.id}>
                                    {accData.accountName}
                                  </option>
                                ))}
                            </select>
                            {formik.touched.itemDetails?.[index]?.accountId &&
                              formik.errors.itemDetails?.[index]?.accountId && (
                                <div className="invalid-feedback">
                                  {formik.errors.itemDetails[index].accountId}
                                </div>
                              )}
                          </td>
                          <td>
                            <input
                              onInput={(event) => {
                                event.target.value = event.target.value
                                  .replace(/[^0-9]/g, "")
                                  .slice(0, 2);
                              }}
                              type="text"
                              name={`itemDetails[${index}].quantity`}
                              className={`form-control ${
                                formik.touched.itemDetails?.[index]?.quantity &&
                                formik.errors.itemDetails?.[index]?.quantity
                                  ? "is-invalid"
                                  : ""
                              }`}
                              {...formik.getFieldProps(
                                `itemDetails[${index}].quantity`
                              )}
                            />
                            {formik.touched.itemDetails?.[index]?.quantity &&
                              formik.errors.itemDetails?.[index]?.quantity && (
                                <div className="invalid-feedback">
                                  {formik.errors.itemDetails[index].quantity}
                                </div>
                              )}
                          </td>
                          <td>
                            <input
                              type="text"
                              name={`itemDetails[${index}].rate`}
                              className={`form-control ${
                                formik.touched.itemDetails?.[index]?.rate &&
                                formik.errors.itemDetails?.[index]?.rate
                                  ? "is-invalid"
                                  : ""
                              }`}
                              {...formik.getFieldProps(
                                `itemDetails[${index}].rate`
                              )}
                            />
                            {formik.touched.itemDetails?.[index]?.rate &&
                              formik.errors.itemDetails?.[index]?.rate && (
                                <div className="invalid-feedback">
                                  {formik.errors.itemDetails[index].rate}
                                </div>
                              )}
                          </td>
                          <td>
                            <select
                              name={`itemDetails[${index}].customerDetail`}
                              {...formik.getFieldProps(
                                `itemDetails[${index}].customerDetail`
                              )}
                              className={`form-select ${
                                formik.touched.itemDetails?.[index]
                                  ?.customerDetail &&
                                formik.errors.itemDetails?.[index]
                                  ?.customerDetail
                                  ? "is-invalid"
                                  : ""
                              }`}
                            >
                              <option selected> </option>
                              {itemCustomerData &&
                                itemCustomerData?.map((customer) => (
                                  <option key={customer.id} value={customer.id}>
                                    {customer.customerFirstName}
                                  </option>
                                ))}
                            </select>
                            {formik.touched.itemDetails?.[index]
                              ?.customerDetail &&
                              formik.errors.itemDetails?.[index]
                                ?.customerDetail && (
                                <div className="invalid-feedback">
                                  {
                                    formik.errors.itemDetails[index]
                                      .customerDetail
                                  }
                                </div>
                              )}
                          </td>
                          <td>
                            <input
                              type="text"
                              name={`itemDetails[${index}].amount`}
                              className={`form-control ${
                                formik.touched.itemDetails?.[index]?.amount &&
                                formik.errors.itemDetails?.[index]?.amount
                                  ? "is-invalid"
                                  : ""
                              }`}
                              {...formik.getFieldProps(
                                `itemDetails[${index}].amount`
                              )}
                            />
                            {formik.touched.itemDetails?.[index]?.amount &&
                              formik.errors.itemDetails?.[index]?.amount && (
                                <div className="invalid-feedback">
                                  {formik.errors.itemDetails[index].amount}
                                </div>
                              )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div>
                <button
                  className="btn btn-button btn-sm my-4 mx-1"
                  type="button"
                  onClick={AddRowContent}
                >
                  Add row
                </button>
                {formik.values.itemDetails.length > 1 && (
                  <button
                    className="btn btn-sm my-4 mx-1 delete border-danger bg-white text-danger"
                    onClick={deleteRow}
                  >
                    Delete
                  </button>
                )}
              </div>
              <div className="row mt-5 pt-0">
                <div className="col-md-6 col-12 mb-3 pt-0">
                  <lable className="form-lable">Customer Notes</lable>
                  <div className="mb-3">
                    <textarea
                      type="text"
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
                <div
                  className="col-md-6 col-12 mt-5 rounded"
                  style={{ border: "1px solid lightgrey" }}
                >
                  <div className="row mb-3 mt-2">
                    <label className="col-sm-4 col-form-label">Sub Total</label>
                    <div className="col-sm-4"></div>
                    <div className="col-sm-4">
                      <input
                        type="text"
                        className={`form-control ${
                          formik.touched.subTotal && formik.errors.subTotal
                            ? "is-invalid"
                            : ""
                        }`}
                        {...formik.getFieldProps("subTotal")}
                      />
                      {formik.touched.subTotal && formik.errors.subTotal && (
                        <div className="invalid-feedback">
                          {formik.errors.subTotal}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="row mb-3 mt-2">
                    <label className="col-sm-4 col-form-label">Discount</label>
                    <div className="col-sm-4"></div>
                    <div className="col-sm-4">
                      <input
                        type="text"
                        className={`form-control ${
                          formik.touched.discount && formik.errors.discount
                            ? "is-invalid"
                            : ""
                        }`}
                        {...formik.getFieldProps("discount")}
                      />
                      {formik.touched.discount && formik.errors.discount && (
                        <div className="invalid-feedback">
                          {formik.errors.discount}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="row mb-3">
                    <label className="col-sm-4 col-form-label">
                      Adjustment
                    </label>
                    <div className="col-sm-4"></div>
                    <div className="col-sm-4">
                      <input
                        type="text"
                        className={`form-control ${
                          formik.touched.adjustments &&
                          formik.errors.adjustments
                            ? "is-invalid"
                            : ""
                        }`}
                        {...formik.getFieldProps("adjustments")}
                      />
                      {formik.touched.adjustments &&
                        formik.errors.adjustments && (
                          <div className="invalid-feedback">
                            {formik.errors.adjustments}
                          </div>
                        )}
                    </div>
                  </div>

                  <hr />
                  <div className="row mb-3 mt-2">
                    <label className="col-sm-4 col-form-label">
                      Total ( ₹ )
                    </label>
                    <div className="col-sm-4"></div>
                    <div className="col-sm-4">
                      <input
                        type="text"
                        className={`form-control ${
                          formik.touched.total && formik.errors.total
                            ? "is-invalid"
                            : ""
                        }`}
                        {...formik.getFieldProps("total")}
                      />
                      {formik.touched.total && formik.errors.total && (
                        <div className="invalid-feedback">
                          {formik.errors.total}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

export default BillsAdd;
