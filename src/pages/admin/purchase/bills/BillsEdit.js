import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import api from "../../../../config/URL";
import toast from "react-hot-toast";
// import fetchAllCustomerWithIds from "../../List/CustomerList";
// import fetchAllItemWithIds from "../../List/ItemList";

function BillsEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoadIndicator] = useState(false);
  const [customerData, setCustomerData] = useState(null);
  const [itemData, setItemData] = useState(null);
  const [vendorData, setVendorData] = useState(null);
  const [itemAccData, setItemAccData] = useState(null);
  const [itemCustomerData, setItemCustomerData] = useState(null);

  const validationSchema = Yup.object({
    vendorName: Yup.string().required("*Vendor name is required"),
    billNumber: Yup.string().required("*Bill Number is required"),
    billDate: Yup.string().required("*Bill Date is required"),
  });

  const formik = useFormik({
    initialValues: {
      vendorName: "",
      billNumber: "",
      orderNumber: "",
      billDate: "",
      dueDate: "",
      subject: "",
      subTotal: "",
      discount: "",
      adjustments: "",
      total: "",
      notes: "",
      txnInvoiceOrderItemsModels: [
        {
          itemId: "",
          quantity: "",
          rate: "",
          customerId: "",
          accountId: "",
          amount: "",
        },
      ],
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      setLoadIndicator(true);
      try {
        const response = await api.put(`/updateBills/${id}`, values);
        if (response.status === 200) {
          toast.success(response.data.message);
          navigate("/bills");
        } else {
          toast.error(response.data.message);
        }
      } catch (error) {
        toast.error("Error: Unable to save sales order.");
      } finally {
        setLoadIndicator(false);
      }
    },
  });

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await api.get(`/getBillsById/${id}`);
        const rest = response.data;

        formik.setValues({
          vendorName: rest.vendorName || "",
          billNumber: rest.billNumber || "",
          billDate: rest.billDate || "",
          dueDate: rest.dueDate || "",
          subject: rest.subject || "",
          subTotal: rest.subTotal || "",
          discount: rest.discount || "",
          adjustments: rest.adjustments || "",
          total: rest.total || "",
          notes: rest.notes || "",
          txnInvoiceOrderItemsModels: rest.itemDetails
            ? rest.itemDetails.map((item) => ({
                itemId: item.itemId,
                quantity: item.quantity,
                rate: item.rate,
                customerId: item.customerId,
                accountId: item.accountId,
                amount: item.amount,
              }))
            : [
                {
                  itemId: "",
                  quantity: 0,
                  rate: 0,
                  customerId: "",
                  accountId: "",
                  amount: 0,
                },
              ],
        });
      } catch (e) {
        toast.error("Error fetching data: ", e?.response?.data?.message);
      }
    };

    getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchData = async () => {
    try {
      const [
        vendorResponse,
        itemsResponse,
        accountsResponse,
        customersResponse,
      ] = await Promise.all([
        api.get("getAllVendorContact"),
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

  const AddRowContent = () => {
    formik.setFieldValue("billsItemDetailsModels", [
      ...formik.values.billsItemDetailsModels,
      {
        item: "",
        quantity: "",
        price: "",
        customer: "",
        taxRate: "",
        amount: "",
      },
    ]);
  };

  const deleteRow = (index) => {
    if (formik.values.billsItemDetailsModels?.length === 1) {
      return;
    }
    const updatedRows = [...formik.values.billsItemDetailsModels];
    updatedRows.pop();
    formik.setFieldValue("billsItemDetailsModels", updatedRows);
  };

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
                    {...formik.getFieldProps("vendorName")}
                    className={`form-select    ${
                      formik.touched.vendorName && formik.errors.vendorName
                        ? "is-invalid"
                        : ""
                    }`}
                  >
                    <option selected></option>
                    {vendorData &&
                      vendorData?.map((itemId) => (
                        <option key={itemId.id} value={itemId.id}>
                          {itemId.vendorFirstName}
                        </option>
                      ))}
                  </select>
                  {formik.touched.vendorName && formik.errors.vendorName && (
                    <div className="invalid-feedback">
                      {formik.errors.vendorName}
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
                      {formik.values.billsItemDetailsModels?.map(
                        (item, index) => (
                          <tr key={index}>
                            <th scope="row">{index + 1}</th>
                            <td>
                              <select
                                name={`billsItemDetailsModels[${index}].item`}
                                {...formik.getFieldProps(
                                  `billsItemDetailsModels[${index}].item`
                                )}
                                className={`form-select ${
                                  formik.touched.billsItemDetailsModels?.[index]
                                    ?.item &&
                                  formik.errors.billsItemDetailsModels?.[index]
                                    ?.item
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
                              {formik.touched.billsItemDetailsModels?.[index]
                                ?.item &&
                                formik.errors.billsItemDetailsModels?.[index]
                                  ?.item && (
                                  <div className="invalid-feedback">
                                    {
                                      formik.errors.billsItemDetailsModels[
                                        index
                                      ].item
                                    }
                                  </div>
                                )}
                            </td>
                            <td>
                              <select
                                name={`billsItemDetailsModels[${index}].accountId`}
                                {...formik.getFieldProps(
                                  `billsItemDetailsModels[${index}].accountId`
                                )}
                                className={`form-select ${
                                  formik.touched.billsItemDetailsModels?.[index]
                                    ?.accountId &&
                                  formik.errors.billsItemDetailsModels?.[index]
                                    ?.accountId
                                    ? "is-invalid"
                                    : ""
                                }`}
                              >
                                <option selected> </option>
                                {itemAccData &&
                                  itemAccData?.map((accData) => (
                                    <option key={accData.id} value={accData.id}>
                                      {accData.lastModifiedBy}
                                    </option>
                                  ))}
                              </select>
                              {formik.touched.billsItemDetailsModels?.[index]
                                ?.accountId &&
                                formik.errors.billsItemDetailsModels?.[index]
                                  ?.accountId && (
                                  <div className="invalid-feedback">
                                    {
                                      formik.errors.billsItemDetailsModels[
                                        index
                                      ].accountId
                                    }
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
                                name={`billsItemDetailsModels[${index}].quantity`}
                                className={`form-control ${
                                  formik.touched.billsItemDetailsModels?.[index]
                                    ?.quantity &&
                                  formik.errors.billsItemDetailsModels?.[index]
                                    ?.quantity
                                    ? "is-invalid"
                                    : ""
                                }`}
                                {...formik.getFieldProps(
                                  `billsItemDetailsModels[${index}].quantity`
                                )}
                              />
                              {formik.touched.billsItemDetailsModels?.[index]
                                ?.quantity &&
                                formik.errors.billsItemDetailsModels?.[index]
                                  ?.quantity && (
                                  <div className="invalid-feedback">
                                    {
                                      formik.errors.billsItemDetailsModels[
                                        index
                                      ].quantity
                                    }
                                  </div>
                                )}
                            </td>
                            <td>
                              <input
                                type="text"
                                name={`billsItemDetailsModels[${index}].price`}
                                className={`form-control ${
                                  formik.touched.billsItemDetailsModels?.[index]
                                    ?.price &&
                                  formik.errors.billsItemDetailsModels?.[index]
                                    ?.price
                                    ? "is-invalid"
                                    : ""
                                }`}
                                {...formik.getFieldProps(
                                  `billsItemDetailsModels[${index}].price`
                                )}
                              />
                              {formik.touched.billsItemDetailsModels?.[index]
                                ?.price &&
                                formik.errors.billsItemDetailsModels?.[index]
                                  ?.price && (
                                  <div className="invalid-feedback">
                                    {
                                      formik.errors.billsItemDetailsModels[
                                        index
                                      ].price
                                    }
                                  </div>
                                )}
                            </td>
                            <td>
                              <select
                                name={`billsItemDetailsModels[${index}].customer`}
                                {...formik.getFieldProps(
                                  `billsItemDetailsModels[${index}].customer`
                                )}
                                className={`form-select ${
                                  formik.touched.billsItemDetailsModels?.[index]
                                    ?.customer &&
                                  formik.errors.billsItemDetailsModels?.[index]
                                    ?.customer
                                    ? "is-invalid"
                                    : ""
                                }`}
                              >
                                <option selected> </option>
                                {itemCustomerData &&
                                  itemCustomerData?.map((customer) => (
                                    <option
                                      key={customer.id}
                                      value={customer.id}
                                    >
                                      {customer.customerFirstName}
                                    </option>
                                  ))}
                              </select>
                              {formik.touched.billsItemDetailsModels?.[index]
                                ?.customer &&
                                formik.errors.billsItemDetailsModels?.[index]
                                  ?.customer && (
                                  <div className="invalid-feedback">
                                    {
                                      formik.errors.billsItemDetailsModels[
                                        index
                                      ].customer
                                    }
                                  </div>
                                )}
                            </td>
                            <td>
                              <input
                                type="text"
                                name={`billsItemDetailsModels[${index}].amount`}
                                className={`form-control ${
                                  formik.touched.billsItemDetailsModels?.[index]
                                    ?.amount &&
                                  formik.errors.billsItemDetailsModels?.[index]
                                    ?.amount
                                    ? "is-invalid"
                                    : ""
                                }`}
                                {...formik.getFieldProps(
                                  `billsItemDetailsModels[${index}].amount`
                                )}
                              />
                              {formik.touched.billsItemDetailsModels?.[index]
                                ?.amount &&
                                formik.errors.billsItemDetailsModels?.[index]
                                  ?.amount && (
                                  <div className="invalid-feedback">
                                    {
                                      formik.errors.billsItemDetailsModels[
                                        index
                                      ].amount
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

              <div>
                <button
                  className="btn btn-button btn-sm my-4 mx-1"
                  type="button"
                  onClick={AddRowContent}
                >
                  Add row
                </button>
                {formik.values.billsItemDetailsModels?.length > 1 && (
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
                    <label className="col-sm-4 col-form-label">
                      Sub Total<span className="text-danger">*</span>
                    </label>
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
                    <label className="col-sm-4 col-form-label">
                      Total Discount<span className="text-danger">*</span>
                    </label>
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
                    <label className="col-sm-4 col-form-label">Total Tax</label>
                    <div className="col-sm-4"></div>
                    <div className="col-sm-4">
                      <input
                        type="text"
                        className={`form-control ${
                          formik.touched.totalTax && formik.errors.totalTax
                            ? "is-invalid"
                            : ""
                        }`}
                        {...formik.getFieldProps("totalTax")}
                      />
                      {formik.touched.totalTax && formik.errors.totalTax && (
                        <div className="invalid-feedback">
                          {formik.errors.totalTax}
                        </div>
                      )}
                    </div>
                  </div>

                  <hr />
                  <div className="row mb-3 mt-2">
                    <label className="col-sm-4 col-form-label">Total</label>
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

export default BillsEdit;
