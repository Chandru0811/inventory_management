import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import api from "../../../../config/URL";
import toast from "react-hot-toast";

// import fetchAllCustomerWithIds from "../../List/CustomerList";
// import fetchAllItemWithIds from "../../List/ItemList";

function InvoicesAdd() {
  const navigate = useNavigate();
  const [loading, setLoadIndicator] = useState(false);
  const [customerData, setCustomerData] = useState(null);
  const [salespersonData, setSalespersonData] = useState(null);
  const [itemData, setItemData] = useState(null);

  const validationSchema = Yup.object({
    customerId: Yup.string().required("*Customer Name is required"),
    invoiceNumber: Yup.string().required("*Invoice is required"),
    invoiceDate: Yup.string().required("*Invoice Date is required"),
    itemDetailsList: Yup.array().of(
      Yup.object({
        itemId: Yup.string().required("*Item Detail is required"),
      })
    ),
  });

  const formik = useFormik({
    initialValues: {
      customerId: "",
      invoiceNumber: "",
      orderNumber: "",
      invoiceDate: "",
      dueDate: "",
      salesperson: "",
      subject: "",
      customerNotes: "",
      termsCondition: "",
      files: null,
      itemDetailsList: [
        {
          itemId: "",
          quantity: "",
          rate: "",
          discount: "",
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
        formData.append("invoiceNumber", values.invoiceNumber);
        formData.append("orderNumber", values.orderNumber);
        formData.append("invoiceDate", values.invoiceDate);
        formData.append("dueDate", values.dueDate);
        formData.append("salesperson", values.salesperson);
        formData.append("subject", values.subject);
        formData.append("subtotal", values.subtotal);
        formData.append("adjustment", values.adjustment);
        formData.append("total", values.total);
        formData.append("customerNotes", values.customerNotes);
        formData.append("termsCondition", values.termsCondition);
        formData.append("files", values.files);
        formData.append(
          "itemDetailsList",
          JSON.stringify(
            values.itemDetailsList?.map((item) => ({
              itemId: item.itemId?.id || item.itemId,
              quantity: item.quantity,
              rate: item.rate,
              discount: item.discount,
              amount: item.amount,
            }))
          )
        );
        const response = await api.post("invoiceCreationWithItems", formData, {
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

  const AddRowContent = () => {
    formik.setFieldValue("itemDetailsList", [
      ...formik.values.itemDetailsList,
      {
        itemId: "",
        quantity: "",
        rate: "",
        discount: "",
        amount: "",
      },
    ]);
  };

  const deleteRow = (index) => {
    if (formik.values.itemDetailsList.length === 1) {
      return;
    }
    const updatedRows = [...formik.values.itemDetailsList];
    updatedRows.pop();
    formik.setFieldValue("itemDetailsList", updatedRows);
  };

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await api.get("getAllCustomerIdsWithNames");
        setCustomerData(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    getData();
  }, []);

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await api.get("getAllSalesPersonIdsWithNames");
        setSalespersonData(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    getData();
  }, []);

  useEffect(() => {
    const getItemData = async () => {
      try {
        const response = await api.get("itemId-name");
        setItemData(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    getItemData();
  }, []);

  useEffect(() => {
    recalculateSubtotalAndTotal();
  }, [formik.values]);

  const handleItemSelection = async (index, event) => {
    const selectedItemId = event.target.value;
    try {
      const response = await api.get(`getItemsById/${selectedItemId}`);
      const itemDetails = response.data;

      if (itemDetails) {
        await formik.setFieldValue(`itemDetailsList[${index}]`, {
          itemId: selectedItemId,
          name: itemDetails.name || 0,
          rate: itemDetails.sellingPrice || 0,
          unitPrice: itemDetails.sellingPrice || 0,
          quantity: 1,
          discount: 0,
          amount: itemDetails.sellingPrice || 0,
        });

        recalculateSubtotalAndTotal();
      }
    } catch (error) {
      toast.error("Error fetching item details: " + error.message);
    }
  };

  const handleQuantityChange = async (index, quantity, discount) => {
    const item = formik.values.itemDetailsList[index] || {};
    const newRate = item.unitPrice * quantity || 0;
    const currentRate = item.unitPrice || 0;
    const newDiscount = discount ? (newRate * discount) / 100 : 0;
    const newAmount = newRate - newDiscount || 0;

    await formik.setFieldValue(
      `itemDetailsList[${index}].rate`,
      currentRate
    );
    await formik.setFieldValue(
      `itemDetailsList[${index}].amount`,
      parseFloat(newAmount.toFixed(2))
    );

    recalculateSubtotalAndTotal();
  };

  const recalculateSubtotalAndTotal = () => {
    const deliveryItems = formik.values.itemDetailsList || [];

    // Calculate the subtotal by summing up all item amounts
    const subtotal = deliveryItems.reduce(
      (sum, item) => sum + (parseFloat(item.amount) || 0),
      0
    );

    formik.setFieldValue("subtotal", subtotal.toFixed(2));

    // Update the total by considering the adjustment
    const adjustment = parseFloat(formik.values.adjustment) || 0;
    const total = subtotal + adjustment;

    formik.setFieldValue("total", total.toFixed(2));
  };

  const handleAdjustmentChange = (event) => {
    const adjustment = event.target.value;
    formik.setFieldValue("adjustment", adjustment);
    recalculateSubtotalAndTotal();
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
                  <h1 className="h4 ls-tight headingColor">Add Invoice</h1>
                </div>
              </div>
              <div className="col-auto">
                <div className="hstack gap-2 justify-content-end">
                  <Link to="/invoice">
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
                  Customer Name<span className="text-danger">*</span>
                </lable>
                <div className="mb-3">
                  <select
                    {...formik.getFieldProps("customerId")}
                    className={`form-select  form-select-sm  ${formik.touched.customerId && formik.errors.customerId
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
                  Invoice<span className="text-danger">*</span>
                </lable>
                <div className="mb-3">
                  <input
                    type="text"
                    className={`form-control form-control-sm ${formik.touched.invoiceNumber &&
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
                <lable className="form-lable">Order Number</lable>
                <div className="">
                  <input
                    type="text"
                    className={`form-control form-control-sm ${formik.touched.orderNumber && formik.errors.orderNumber
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
                <lable className="form-lable">
                  Invoice Date<span className="text-danger">*</span>
                </lable>
                <div className="">
                  <input
                    type="date"
                    className={`form-control form-control-sm ${formik.touched.invoiceDate && formik.errors.invoiceDate
                      ? "is-invalid"
                      : ""
                      }`}
                    {...formik.getFieldProps("invoiceDate")}
                  />
                  {formik.touched.invoiceDate && formik.errors.invoiceDate && (
                    <div className="invalid-feedback">
                      {formik.errors.invoiceDate}
                    </div>
                  )}
                </div>
              </div>
              <div className="col-md-6 col-12 mb-3">
                <lable className="form-lable">Due Date</lable>
                <div className="">
                  <input
                    type="date"
                    className={`form-control form-control-sm ${formik.touched.dueDate && formik.errors.dueDate
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

              <div className="col-md-6 col-12 mb-3">
                <lable className="form-lable">Salesperson</lable>
                <div className="mb-3">
                  <select
                    {...formik.getFieldProps("salesperson")}
                    className={`form-select form-select-sm   ${formik.touched.salesperson && formik.errors.salesperson
                      ? "is-invalid"
                      : ""
                      }`}
                  >
                    <option selected></option>
                    {salespersonData &&
                      salespersonData.map((data) => (
                        <option
                          key={data.sales_person_id}
                          value={data.sales_person_id}
                        >
                          {data.sales_person_name}
                        </option>
                      ))}
                  </select>
                  {formik.touched.salesperson && formik.errors.salesperson && (
                    <div className="invalid-feedback">
                      {formik.errors.salesperson}
                    </div>
                  )}
                </div>
              </div>

              <div className="col-md-6 col-12 mb-3">
                <lable className="form-lable">Subject</lable>
                <div className="">
                  <input
                    type="text"
                    className={`form-control form-control-sm ${formik.touched.subject && formik.errors.subject
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

              <div className="col-md-6 col-12 mb-2">
                <lable className="form-lable">Attach File</lable>
                <div className="mb-3">
                  <input
                    type="file"
                    className="form-control form-control-sm"
                    onChange={(event) => {
                      formik.setFieldValue("files", event.target.files[0]);
                    }}
                    onBlur={formik.handleBlur}
                  />
                  {formik.touched.files && formik.errors.files && (
                    <div className="invalid-feedback">
                      {formik.errors.files}
                    </div>
                  )}
                </div>
              </div>

              <div className="row mt-5">
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
                        <th style={{ width: "40%" }}>
                          Item Details<span className="text-danger">*</span>
                        </th>
                        <th style={{ width: "15%" }}>Quantity</th>
                        <th style={{ width: "15%" }}>Rate</th>
                        <th style={{ width: "15%" }}>Discount(%)</th>
                        <th style={{ width: "15%" }}>Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {formik.values.itemDetailsList.map(
                        (item, index) => (
                          <tr key={index}>
                            <td>
                              <select
                                name={`itemDetailsList[${index}].itemId`}
                                {...formik.getFieldProps(
                                  `itemDetailsList[${index}].itemId`
                                )}
                                className={`form-select ${formik.touched.itemDetailsList?.[
                                  index
                                ]?.itemId &&
                                  formik.errors.itemDetailsList?.[
                                    index
                                  ]?.itemId
                                  ? "is-invalid"
                                  : ""
                                  }`}
                                onChange={(event) =>
                                  handleItemSelection(index, event)
                                }
                              >
                                <option selected> </option>
                                {itemData &&
                                  itemData.map((item) => (
                                    <option key={item.id} value={item.id}>
                                      {item.name}
                                    </option>
                                  ))}
                              </select>
                              {formik.touched.itemDetailsList?.[
                                index
                              ]?.itemId &&
                                formik.errors.itemDetailsList?.[
                                  index
                                ]?.itemId && (
                                  <div className="invalid-feedback">
                                    {
                                      formik.errors.itemDetailsList[
                                        index
                                      ].itemId
                                    }
                                  </div>
                                )}
                            </td>

                            <td>
                              <input
                                type="number"
                                min="0"
                                name={`itemDetailsList[${index}].quantity`}
                                className={`form-control ${formik.touched.itemDetailsList?.[
                                  index
                                ]?.quantity &&
                                  formik.errors.itemDetailsList?.[
                                    index
                                  ]?.quantity
                                  ? "is-invalid"
                                  : ""
                                  }`}
                                {...formik.getFieldProps(
                                  `itemDetailsList[${index}].quantity`
                                )}
                                onChange={(e) => {
                                  const quantity =
                                    parseInt(e.target.value, 10) || 0;
                                  handleQuantityChange(index, quantity, formik.values.itemDetailsList[index].discount);
                                  // handleQuantityChange(index, quantity);
                                  formik.handleChange(e);
                                }}
                              />
                              {formik.touched.itemDetailsList?.[
                                index
                              ]?.quantity &&
                                formik.errors.itemDetailsList?.[
                                  index
                                ]?.quantity && (
                                  <div className="invalid-feedback">
                                    {
                                      formik.errors.itemDetailsList[
                                        index
                                      ]?.quantity
                                    }
                                  </div>
                                )}
                            </td>
                            <td>
                              <input
                                type="text"
                                name={`itemDetailsList[${index}].rate`}
                                className={`form-control ${formik.touched.itemDetailsList?.[
                                  index
                                ]?.rate &&
                                  formik.errors.itemDetailsList?.[
                                    index
                                  ]?.rate
                                  ? "is-invalid"
                                  : ""
                                  }`}
                                {...formik.getFieldProps(
                                  `itemDetailsList[${index}].rate`
                                )}
                                readOnly
                              />
                              {formik.touched.itemDetailsList?.[
                                index
                              ]?.rate &&
                                formik.errors.itemDetailsList?.[
                                  index
                                ]?.rate && (
                                  <div className="invalid-feedback">
                                    {
                                      formik.errors.itemDetailsList[
                                        index
                                      ].rate
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
                                name={`itemDetailsList[${index}].discount`}
                                className={`form-control ${formik.touched.itemDetailsList?.[
                                  index
                                ]?.discount &&
                                  formik.errors.itemDetailsList?.[
                                    index
                                  ]?.discount
                                  ? "is-invalid"
                                  : ""
                                  }`}
                                {...formik.getFieldProps(
                                  `itemDetailsList[${index}].discount`
                                )}
                                onChange={(e) => {
                                  const discount =
                                    parseInt(e.target.value, 10) || 0;
                                  // handleQuantityChange(index, `itemDetailsList[${index}].quantity`, discount);
                                  handleQuantityChange(index, formik.values.itemDetailsList[index].quantity, discount);
                                  formik.handleChange(e);
                                }}
                              />
                              {formik.touched.itemDetailsList?.[
                                index
                              ]?.discount &&
                                formik.errors.itemDetailsList?.[
                                  index
                                ]?.discount && (
                                  <div className="invalid-feedback">
                                    {
                                      formik.errors.itemDetailsList[
                                        index
                                      ].discount
                                    }
                                  </div>
                                )}
                            </td>
                            <td>
                              <input
                                type="text"
                                name={`itemDetailsList[${index}].amount`}
                                className={`form-control ${formik.touched.itemDetailsList?.[
                                  index
                                ]?.amount &&
                                  formik.errors.itemDetailsList?.[
                                    index
                                  ]?.amount
                                  ? "is-invalid"
                                  : ""
                                  }`}
                                {...formik.getFieldProps(
                                  `itemDetailsList[${index}].amount`
                                )}
                                readOnly
                              />
                              {formik.touched.itemDetailsList?.[
                                index
                              ]?.amount &&
                                formik.errors.itemDetailsList?.[
                                  index
                                ]?.amount && (
                                  <div className="invalid-feedback">
                                    {
                                      formik.errors.itemDetailsList[
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
                  className="btn btn-button btn-primary btn-sm my-4 mx-1"
                  type="button"
                  onClick={AddRowContent}
                >
                  Add row
                </button>
                {formik.values.itemDetailsList.length > 1 && (
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
                      className={`form-control  ${formik.touched.customerNotes &&
                        formik.errors.customerNotes
                        ? "is-invalid"
                        : ""
                        }`}
                      rows="4"
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
                  style={{ border: "1px solid lightgrey" }}>
                  <div className="row mb-3 mt-2">
                    <label className="col-sm-4 col-form-label">Sub Total</label>
                    <div className="col-sm-4"></div>
                    <div className="col-sm-4">
                      <input
                        type="text"
                        className={`form-control ${formik.touched.subtotal && formik.errors.subtotal ? "is-invalid" : ""}`}
                        value={formik.values.subtotal}
                        readOnly
                      />
                      {formik.touched.subtotal && formik.errors.subtotal && (
                        <div className="invalid-feedback">
                          {formik.errors.subtotal}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="row mb-3">
                    <label className="col-sm-4 col-form-label">Adjustment</label>
                    <div className="col-sm-4"></div>
                    <div className="col-sm-4">
                      <input
                        type="number"
                        className={`form-control ${formik.touched.adjustment && formik.errors.adjustment ? "is-invalid" : ""}`}
                        {...formik.getFieldProps("adjustment")}
                        onChange={handleAdjustmentChange}
                      />
                      {formik.touched.adjustment && formik.errors.adjustment && (
                        <div className="invalid-feedback">
                          {formik.errors.adjustment}
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
                        className={`form-control ${formik.touched.total && formik.errors.total ? "is-invalid" : ""}`}
                        value={formik.values.total}
                        readOnly
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
                      className={`form-control  ${formik.touched.termsCondition &&
                        formik.errors.termsCondition
                        ? "is-invalid"
                        : ""
                        }`}
                      rows="4"
                      {...formik.getFieldProps("termsCondition")}
                    />
                    {formik.touched.termsCondition &&
                      formik.errors.termsCondition && (
                        <div className="invalid-feedback">
                          {formik.errors.termsCondition}
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

export default InvoicesAdd;
