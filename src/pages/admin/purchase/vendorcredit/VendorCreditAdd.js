import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import api from "../../../../config/URL";
import toast from "react-hot-toast";

// import fetchAllCustomerWithIds from "../../List/CustomerList";
// import fetchAllItemWithIds from "../../List/ItemList";

function VendorCreditAdd() {
  const navigate = useNavigate();
  const [loading, setLoadIndicator] = useState(false);
  const [customerData, setCustomerData] = useState(null);
  const [itemData, setItemData] = useState(null);

  const validationSchema = Yup.object({
    customerId: Yup.string().required("*Customer name is required"),
    invoiceNumber: Yup.string().required("*Invoice Number is required"),
    issuesDate: Yup.string().required("*Issues Date is required"),
    dueDate: Yup.string().required("*Due Date is required"),
    amountsAre: Yup.string().required("*Amount Are is required"),
    txnInvoiceOrderItemsModels: Yup.array().of(
      Yup.object({
        item: Yup.string().required("item is required"),
      })
    ),
  });

  const formik = useFormik({
    initialValues: {
      customerId: "",
      issuesDate: "",
      dueDate: "",
      invoiceNumber: "",
      reference: "",
      amountsAre: "",
      subTotal: "",
      totalTax: "",
      discountAmount: "",
      total: "",
      files: null,
      txnInvoiceOrderItemsModels: [
        {
          item: "",
          qty: "",
          price: "",
          disc: "",
          taxRate: "",
          amount: "",
        },
      ],
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      setLoadIndicator(true);
      try {
        const formData = new FormData();

        formData.append("customerId", values.customerId);
        formData.append("issuesDate", values.issuesDate);
        formData.append("reference", values.reference);
        formData.append("dueDate", values.dueDate);
        formData.append("invoiceNumber", values.invoiceNumber);
        formData.append("AmountsAre", values.amountsAre);
        formData.append("subTotal", values.subTotal);
        formData.append("totalTax", values.totalTax);
        formData.append("discountAmount", values.discountAmount);
        formData.append("total", values.total);
        values.txnInvoiceOrderItemsModels.forEach((item) => {
          formData.append("item", item.item);
          formData.append("qty", item.qty);
          formData.append("price", item.price);
          formData.append("taxRate", item.taxRate);
          formData.append("disc", item.disc);
          formData.append("amount", item.amount);
          formData.append("mstrItemsId", item.item);
          formData.append("description", "item.item");
          formData.append("account", "item.item");
          formData.append("taxAmount", "000");
          formData.append("project", "000");
        });
        if (values.files) {
          formData.append("files", values.files);
        }
        const response = await api.post("invoice-invoice-item", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        if (response.status === 201) {
          toast.success(response.data.message);
          navigate("/invoice");
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
    const updateAndCalculate = async () => {
      try {
        let totalRate = 0;
        let totalAmount = 0;
        let totalTax = 0;
        let discAmount = 0;
        const updatedItems = await Promise.all(
          formik.values.txnInvoiceOrderItemsModels.map(async (item, index) => {
            if (item.item) {
              try {
                const response = await api.get(`itemsById/${item.item}`);
                const updatedItem = {
                  ...item,
                  price: response.data.salesPrice,
                  qty: 1,
                };
                const amount = calculateAmount(
                  updatedItem.qty,
                  updatedItem.price,
                  updatedItem.disc,
                  updatedItem.taxRate
                );
                const itemTotalRate = updatedItem.qty * updatedItem.price;
                const itemTotalTax =
                  itemTotalRate * (updatedItem.taxRate / 100);
                const itemTotalDisc = itemTotalRate * (updatedItem.disc / 100);
                discAmount += itemTotalDisc;
                totalRate += updatedItem.price;
                totalAmount += amount;
                totalTax += itemTotalTax;
                return { ...updatedItem, amount };
              } catch (error) {
                toast.error(
                  "Error fetching data: ",
                  error?.response?.data?.message
                );
              }
            }
            return item;
          })
        );
        formik.setValues({
          ...formik.values,
          txnInvoiceOrderItemsModels: updatedItems,
        });
        formik.setFieldValue("subTotal", totalRate);
        formik.setFieldValue("total", totalAmount);
        formik.setFieldValue("totalTax", totalTax);
        formik.setFieldValue("discountAmount", discAmount);
      } catch (error) {
        toast.error("Error updating items: ", error.message);
      }
    };

    updateAndCalculate();
  }, [
    formik.values.txnInvoiceOrderItemsModels.map((item) => item.item).join(""),
  ]);

  useEffect(() => {
    const updateAndCalculate = async () => {
      try {
        let totalRate = 0;
        let totalAmount = 0;
        let totalTax = 0;
        let discAmount = 0;
        const updatedItems = await Promise.all(
          formik.values.txnInvoiceOrderItemsModels.map(async (item, index) => {
            if (
              item.qty &&
              item.price &&
              item.disc !== undefined &&
              item.taxRate !== undefined
            ) {
              const amount = calculateAmount(
                item.qty,
                item.price,
                item.disc,
                item.taxRate
              );
              const itemTotalRate = item.qty * item.price;
              const itemTotalTax = itemTotalRate * (item.taxRate / 100);
              const itemTotalDisc = itemTotalRate * (item.disc / 100);
              discAmount += itemTotalDisc;
              totalRate += item.price;
              totalAmount += amount;
              totalTax += itemTotalTax;
              return { ...item, amount };
            }
            return item;
          })
        );
        formik.setValues({
          ...formik.values,
          txnInvoiceOrderItemsModels: updatedItems,
        });
        formik.setFieldValue("subTotal", totalRate);
        formik.setFieldValue("total", totalAmount);
        formik.setFieldValue("totalTax", totalTax);
        formik.setFieldValue("discountAmount", discAmount);
      } catch (error) {
        toast.error("Error updating items: ", error.message);
      }
    };

    updateAndCalculate();
  }, [
    formik.values.txnInvoiceOrderItemsModels.map((item) => item.qty).join(""),
    formik.values.txnInvoiceOrderItemsModels.map((item) => item.price).join(""),
    formik.values.txnInvoiceOrderItemsModels.map((item) => item.disc).join(""),
    formik.values.txnInvoiceOrderItemsModels
      .map((item) => item.taxRate)
      .join(""),
  ]);

  const calculateAmount = (qty, price, disc, taxRate) => {
    const totalRate = qty * price;
    const discountAmount = totalRate * (disc / 100);
    const taxableAmount = totalRate * (taxRate / 100);
    const totalAmount = totalRate + taxableAmount - discountAmount;
    return totalAmount;
  };

  const AddRowContent = () => {
    formik.setFieldValue("txnInvoiceOrderItemsModels", [
      ...formik.values.txnInvoiceOrderItemsModels,
      {
        item: "",
        qty: "",
        price: "",
        disc: "",
        taxRate: "",
        amount: "",
      },
    ]);
  };

  const deleteRow = (index) => {
    if (formik.values.txnInvoiceOrderItemsModels.length === 1) {
      return;
    }
    const updatedRows = [...formik.values.txnInvoiceOrderItemsModels];
    updatedRows.pop();
    formik.setFieldValue("txnInvoiceOrderItemsModels", updatedRows);
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
                  <h1 className="h4 ls-tight headingColor">
                    Add Vendor Credit
                  </h1>
                </div>
              </div>
              <div className="col-auto">
                <div className="hstack gap-2 justify-content-end">
                  <Link to="/vendorcredit">
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
                  Credit Note Number<span className="text-danger">*</span>
                </lable>
                <div className="mb-3">
                  <select
                    {...formik.getFieldProps("customerId")}
                    className={`form-select    ${
                      formik.touched.customerId && formik.errors.customerId
                        ? "is-invalid"
                        : ""
                    }`}
                  >
                    <option selected></option>
                    {customerData &&
                      customerData.map((customerId) => (
                        <option key={customerId.id} value={customerId.id}>
                          {customerId.contactName}
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

              {/* <div className="col-md-6 col-12 mb-3">
                <lable className="form-lable">
                  Invoice<span className="text-danger">*</span>
                </lable>
                <div className="mb-3">
                  <input
                    type="text"
                    className={`form-control  ${
                      formik.touched.invoice && formik.errors.invoice
                        ? "is-invalid"
                        : ""
                    }`}
                    {...formik.getFieldProps("invoice")}
                  />
                  {formik.touched.invoice && formik.errors.invoice && (
                    <div className="invalid-feedback">
                      {formik.errors.invoice}
                    </div>
                  )}
                </div>
              </div> */}

              <div className="col-md-6 col-12 mb-3">
                <lable className="form-lable">
                  Order Number<span className="text-danger">*</span>
                </lable>
                <div className="mb-3">
                  <input
                    type="text"
                    className={`form-control  ${
                      formik.touched.invoiceNumber &&
                      formik.errors.invoiceNumber
                        ? "is-invalid"
                        : ""
                    }`}
                    {...formik.getFieldProps("invoiceNumber")}
                  />
                  {formik.touched.invoiceNumber &&
                    formik.errors.invoiceNumber && (
                      <div className="invalid-feedback">
                        {formik.errors.invoiceNumber}
                      </div>
                    )}
                </div>
              </div>

              <div className="col-md-6 col-12 mb-3">
                <lable className="form-lable">
                  order Credit Date<span className="text-danger">*</span>
                </lable>
                <div className="">
                  <input
                    type="date"
                    className={`form-control ${
                      formik.touched.issuesDate && formik.errors.issuesDate
                        ? "is-invalid"
                        : ""
                    }`}
                    {...formik.getFieldProps("issuesDate")}
                  />
                  {formik.touched.issuesDate && formik.errors.issuesDate && (
                    <div className="invalid-feedback">
                      {formik.errors.issuesDate}
                    </div>
                  )}
                </div>
              </div>

              <div className="col-md-6 col-12 mb-3">
                <label className="form-label">Subject</label>
                <div className="">
                  <input
                    type="text"
                    className="form-control"
                    onChange={(event) => {
                      formik.setFieldValue("files", event.target.files[0]);
                    }}
                    onBlur={formik.handleBlur}
                  />
                </div>
              </div>
              <div className="col-md-6 col-12 mb-3">
                <label className="form-label">Vendor Credit File</label>
                <div className="">
                  <input
                    type="file"
                    className="form-control"
                    onChange={(event) => {
                      formik.setFieldValue("files", event.target.files[0]);
                    }}
                    onBlur={formik.handleBlur}
                  />
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
                        <th style={{ width: "25%" }}>
                          Item<span className="text-danger">*</span>
                        </th>
                        <th style={{ width: "10%" }}>Quantity</th>
                        <th style={{ width: "15%" }}>Rate</th>
                        <th style={{ width: "15%" }}>Discount(%)</th>
                        <th style={{ width: "15%" }}>Tax (%)</th>
                        <th style={{ width: "15%" }}>Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {formik.values.txnInvoiceOrderItemsModels.map(
                        (item, index) => (
                          <tr key={index}>
                            <th scope="row">{index + 1}</th>
                            <td>
                              <select
                                name={`txnInvoiceOrderItemsModels[${index}].item`}
                                {...formik.getFieldProps(
                                  `txnInvoiceOrderItemsModels[${index}].item`
                                )}
                                className={`form-select ${
                                  formik.touched.txnInvoiceOrderItemsModels?.[
                                    index
                                  ]?.item &&
                                  formik.errors.txnInvoiceOrderItemsModels?.[
                                    index
                                  ]?.item
                                    ? "is-invalid"
                                    : ""
                                }`}
                              >
                                <option selected> </option>
                                {itemData &&
                                  itemData.map((itemId) => (
                                    <option key={itemId.id} value={itemId.id}>
                                      {itemId.itemName}
                                    </option>
                                  ))}
                              </select>
                              {formik.touched.txnInvoiceOrderItemsModels?.[
                                index
                              ]?.item &&
                                formik.errors.txnInvoiceOrderItemsModels?.[
                                  index
                                ]?.item && (
                                  <div className="invalid-feedback">
                                    {
                                      formik.errors.txnInvoiceOrderItemsModels[
                                        index
                                      ].item
                                    }
                                  </div>
                                )}
                            </td>
                            <td>
                              <input
                                onInput={(event) => {
                                  event.target.value =
                                    event.target.value.replace(/[^0-9]/g, "");
                                }}
                                type="text"
                                name={`txnInvoiceOrderItemsModels[${index}].qty`}
                                className={`form-control ${
                                  formik.touched.txnInvoiceOrderItemsModels?.[
                                    index
                                  ]?.qty &&
                                  formik.errors.txnInvoiceOrderItemsModels?.[
                                    index
                                  ]?.qty
                                    ? "is-invalid"
                                    : ""
                                }`}
                                {...formik.getFieldProps(
                                  `txnInvoiceOrderItemsModels[${index}].qty`
                                )}
                              />
                              {formik.touched.txnInvoiceOrderItemsModels?.[
                                index
                              ]?.qty &&
                                formik.errors.txnInvoiceOrderItemsModels?.[
                                  index
                                ]?.qty && (
                                  <div className="invalid-feedback">
                                    {
                                      formik.errors.txnInvoiceOrderItemsModels[
                                        index
                                      ].qty
                                    }
                                  </div>
                                )}
                            </td>
                            <td>
                              <input
                                readOnly
                                type="text"
                                name={`txnInvoiceOrderItemsModels[${index}].price`}
                                className={`form-control ${
                                  formik.touched.txnInvoiceOrderItemsModels?.[
                                    index
                                  ]?.price &&
                                  formik.errors.txnInvoiceOrderItemsModels?.[
                                    index
                                  ]?.price
                                    ? "is-invalid"
                                    : ""
                                }`}
                                {...formik.getFieldProps(
                                  `txnInvoiceOrderItemsModels[${index}].price`
                                )}
                              />
                              {formik.touched.txnInvoiceOrderItemsModels?.[
                                index
                              ]?.price &&
                                formik.errors.txnInvoiceOrderItemsModels?.[
                                  index
                                ]?.price && (
                                  <div className="invalid-feedback">
                                    {
                                      formik.errors.txnInvoiceOrderItemsModels[
                                        index
                                      ].price
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
                                name={`txnInvoiceOrderItemsModels[${index}].disc`}
                                className={`form-control ${
                                  formik.touched.txnInvoiceOrderItemsModels?.[
                                    index
                                  ]?.disc &&
                                  formik.errors.txnInvoiceOrderItemsModels?.[
                                    index
                                  ]?.disc
                                    ? "is-invalid"
                                    : ""
                                }`}
                                {...formik.getFieldProps(
                                  `txnInvoiceOrderItemsModels[${index}].disc`
                                )}
                              />
                              {formik.touched.txnInvoiceOrderItemsModels?.[
                                index
                              ]?.disc &&
                                formik.errors.txnInvoiceOrderItemsModels?.[
                                  index
                                ]?.disc && (
                                  <div className="invalid-feedback">
                                    {
                                      formik.errors.txnInvoiceOrderItemsModels[
                                        index
                                      ].disc
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
                                name={`txnInvoiceOrderItemsModels[${index}].taxRate`}
                                className={`form-control ${
                                  formik.touched.txnInvoiceOrderItemsModels?.[
                                    index
                                  ]?.taxRate &&
                                  formik.errors.txnInvoiceOrderItemsModels?.[
                                    index
                                  ]?.taxRate
                                    ? "is-invalid"
                                    : ""
                                }`}
                                {...formik.getFieldProps(
                                  `txnInvoiceOrderItemsModels[${index}].taxRate`
                                )}
                              />
                              {formik.touched.txnInvoiceOrderItemsModels?.[
                                index
                              ]?.taxRate &&
                                formik.errors.txnInvoiceOrderItemsModels?.[
                                  index
                                ]?.taxRate && (
                                  <div className="invalid-feedback">
                                    {
                                      formik.errors.txnInvoiceOrderItemsModels[
                                        index
                                      ].taxRate
                                    }
                                  </div>
                                )}
                            </td>
                            <td>
                              <input
                                readOnly
                                type="text"
                                name={`txnInvoiceOrderItemsModels[${index}].amount`}
                                className={`form-control ${
                                  formik.touched.txnInvoiceOrderItemsModels?.[
                                    index
                                  ]?.amount &&
                                  formik.errors.txnInvoiceOrderItemsModels?.[
                                    index
                                  ]?.amount
                                    ? "is-invalid"
                                    : ""
                                }`}
                                {...formik.getFieldProps(
                                  `txnInvoiceOrderItemsModels[${index}].amount`
                                )}
                              />
                              {formik.touched.txnInvoiceOrderItemsModels?.[
                                index
                              ]?.amount &&
                                formik.errors.txnInvoiceOrderItemsModels?.[
                                  index
                                ]?.amount && (
                                  <div className="invalid-feedback">
                                    {
                                      formik.errors.txnInvoiceOrderItemsModels[
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
                {formik.values.txnInvoiceOrderItemsModels.length > 1 && (
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
                    <input
                      type="text"
                      placeholder="Will be display on the Invoice"
                      className={`form-control  ${
                        formik.touched.customerNotes &&
                        formik.errors.customerNotes
                          ? "is-invalid"
                          : ""
                      }`}
                      {...formik.getFieldProps("customerNotes")}
                    />
                    {formik.touched.customerNotes &&
                      formik.errors.customerNotes && (
                        <div className="invalid-feedback">
                          {formik.errors.customerNotes}
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
                          formik.touched.discountAmount &&
                          formik.errors.discountAmount
                            ? "is-invalid"
                            : ""
                        }`}
                        {...formik.getFieldProps("discountAmount")}
                      />
                      {formik.touched.discountAmount &&
                        formik.errors.discountAmount && (
                          <div className="invalid-feedback">
                            {formik.errors.discountAmount}
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

                <div className="col-md-6 col-12 mb-3">
                  <lable className="form-lable">Terms & Conditions</lable>
                  <div className="mb-3">
                    <textarea
                      className={`form-control  ${
                        formik.touched.termsAndconditions &&
                        formik.errors.termsAndconditions
                          ? "is-invalid"
                          : ""
                      }`}
                      {...formik.getFieldProps("termsAndconditions")}
                    />
                    {formik.touched.termsAndconditions &&
                      formik.errors.termsAndconditions && (
                        <div className="invalid-feedback">
                          {formik.errors.termsAndconditions}
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
}

export default VendorCreditAdd;
