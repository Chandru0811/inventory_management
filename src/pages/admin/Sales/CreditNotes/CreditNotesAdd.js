import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import api from "../../../../config/URL";
import toast from "react-hot-toast";

function CreditNotesAdd() {
  const navigate = useNavigate();
  const [loading, setLoadIndicator] = useState(false);
  const [customerData, setCustomerData] = useState(null);
  const [itemData, setItemData] = useState(null);
  const [salesPerson, setSalesPerson] = useState(null);
  const [account, setAccount] = useState(null);

  const validationSchema = Yup.object({
    customerID: Yup.string().required("*Customer Name is required"),
    creditNote: Yup.string().required("*Credit Note is required"),
    creditNoteDate: Yup.string().required("*Credit Note Date is required"),
    itemDetailsList: Yup.array().of(
      Yup.object({
        itemId: Yup.string().required("*Item Details is required"),
      })
    ),
  });

  const formik = useFormik({
    initialValues: {
      customerID: "",
      creditNote: "",
      reference: "",
      creditNoteDate: "",
      salesPerson: "",
      subject: "",
      subTotal: "",
      total: "",
      adjustment: "",
      termsCondition: "",
      customerNotes: "",
      //   attachFile: null,
      itemDetailsList: [
        {
          itemId: "",
          accountId: "",
          quantity: "",
          rate: "",
          amount: "",
          discount: "",
        },
      ],
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      setLoadIndicator(true);
      console.log(values);

      const formData = new FormData();
      formData.append("customerID", values.customerID);
      formData.append("creditNote", values.creditNote);
      formData.append("reference", values.reference);
      //   formData.append("creditNoteDate", values.creditNoteDate);
      formData.append("salesPerson", values.salesPerson);
      formData.append("subject", values.subject);
      formData.append("subTotal", values.subTotal);
      formData.append("total", values.total);
      formData.append("adjustment", values.adjustment);
      formData.append("termsCondition", values.termsCondition);
      formData.append("customerNotes", values.customerNotes);
      //   formData.append("attachFile", values.attachFile);
      formData.append(
        "itemDetailsList",
        JSON.stringify(
          values.itemDetailsList.map((item) => ({
            itemId: item.itemId?.id || item.itemId,
            accountId: item.accountId,
            quantity: item.quantity,
            rate: item.rate,
            discount: item.discount,
            amount: item.amount,
          }))
        )
      );

      try {
        const response = await api.post(
          "/creditNotesCreationWithItems",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        if (response.status === 200) {
          toast.success(response.data.message);
          navigate("/creditnotes");
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

  //   useEffect(() => {
  //     const updateAndCalculate = async () => {
  //       try {
  //         let totalRate = 0;
  //         let totalAmount = 0;
  //         let totalTax = 0;
  //         let discAmount = 0;
  //         const updatedItems = await Promise.all(
  //           formik.values.itemDetailsList.map(async (item, index) => {
  //             if (item.item) {
  //               try {
  //                 const response = await api.get(`itemsById/${item.item}`);
  //                 const updatedItem = {
  //                   ...item,
  //                   amount: response.data.salesamount,
  //                   quantity: 1,
  //                 };
  //                 const amount = calculateAmount(
  //                   updatedItem.quantity,
  //                   updatedItem.amount,
  //                   updatedItem.discount,
  //                   updatedItem.accountId
  //                 );
  //                 const itemTotalRate = updatedItem.quantity * updatedItem.amount;
  //                 const itemTotalTax =
  //                   itemTotalRate * (updatedItem.accountId / 100);
  //                 const itemTotalDisc =
  //                   itemTotalRate * (updatedItem.discount / 100);
  //                 discAmount += itemTotalDisc;
  //                 totalRate += updatedItem.amount;
  //                 totalAmount += amount;
  //                 totalTax += itemTotalTax;
  //                 return { ...updatedItem, amount };
  //               } catch (error) {
  //                 toast.error(
  //                   "Error fetching data: ",
  //                   error?.response?.data?.message
  //                 );
  //               }
  //             }
  //             return item;
  //           })
  //         );
  //         formik.setValues({
  //           ...formik.values,
  //           itemDetailsList: updatedItems,
  //         });
  //         formik.setFieldValue("subTotal", totalRate);
  //         formik.setFieldValue("total", totalAmount);
  //         formik.setFieldValue("totalTax", totalTax);
  //         formik.setFieldValue("discountAmount", discAmount);
  //       } catch (error) {
  //         toast.error("Error updating items: ", error.message);
  //       }
  //     };

  //     updateAndCalculate();
  //   }, [formik.values.itemDetailsList.map((item) => item.item).join("")]);

  //   useEffect(() => {
  //     const updateAndCalculate = async () => {
  //       try {
  //         let totalRate = 0;
  //         let totalAmount = 0;
  //         let totalTax = 0;
  //         let discAmount = 0;
  //         const updatedItems = await Promise.all(
  //           formik.values.itemDetailsList.map(async (item, index) => {
  //             if (
  //               item.quantity &&
  //               item.amount &&
  //               item.discount !== undefined &&
  //               item.accountId !== undefined
  //             ) {
  //               const amount = calculateAmount(
  //                 item.quantity,
  //                 item.amount,
  //                 item.discount,
  //                 item.accountId
  //               );
  //               const itemTotalRate = item.quantity * item.amount;
  //               const itemTotalTax = itemTotalRate * (item.accountId / 100);
  //               const itemTotalDisc = itemTotalRate * (item.discount / 100);
  //               discAmount += itemTotalDisc;
  //               totalRate += item.amount;
  //               totalAmount += amount;
  //               totalTax += itemTotalTax;
  //               return { ...item, amount };
  //             }
  //             return item;
  //           })
  //         );
  //         formik.setValues({
  //           ...formik.values,
  //           itemDetailsList: updatedItems,
  //         });
  //         formik.setFieldValue("subTotal", totalRate);
  //         formik.setFieldValue("total", totalAmount);
  //         formik.setFieldValue("totalTax", totalTax);
  //         formik.setFieldValue("discountAmount", discAmount);
  //       } catch (error) {
  //         toast.error("Error updating items: ", error.message);
  //       }
  //     };

  //     updateAndCalculate();
  //   }, [
  //     formik.values.itemDetailsList.map((item) => item.quantity).join(""),
  //     formik.values.itemDetailsList.map((item) => item.amount).join(""),
  //     formik.values.itemDetailsList.map((item) => item.discount).join(""),
  //     formik.values.itemDetailsList.map((item) => item.accountId).join(""),
  //   ]);

  //   const calculateAmount = (quantity, amount, discount, accountId) => {
  //     const totalRate = quantity * amount;
  //     const discountAmount = totalRate * (discount / 100);
  //     const taxableAmount = totalRate * (accountId / 100);
  //     const totalAmount = totalRate + taxableAmount - discountAmount;
  //     return totalAmount;
  //   };

  const AddRowContent = () => {
    formik.setFieldValue("itemDetailsList", [
      ...formik.values.itemDetailsList,
      {
        itemId: "",
        accountId: "",
        quantity: "",
        rate: "",
        amount: "",
        discount: "",
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
        const response = await api.get("getAllSalesPersonIdsWithNames");
        setSalesPerson(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    getData();
  }, []);

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await api.get("getAllAccounts");
        setAccount(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    getData();
  }, []);

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await api.get("itemId-name");
        setItemData(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    getData();
  }, []);

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

    await formik.setFieldValue(`itemDetailsList[${index}].rate`, currentRate);
    await formik.setFieldValue(
      `itemDetailsList[${index}].amount`,
      parseFloat(newAmount.toFixed(2))
    );

    recalculateSubtotalAndTotal();
  };

  const recalculateSubtotalAndTotal = () => {
    const deliveryItems = formik.values.itemDetailsList || [];

    // Calculate the subtotal by summing up all item amounts
    const subTotal = deliveryItems.reduce(
      (sum, item) => sum + (parseFloat(item.amount) || 0),
      0
    );

    formik.setFieldValue("subTotal", subTotal.toFixed(2));

    // Update the total by considering the adjustment
    const adjustment = parseFloat(formik.values.adjustment) || 0;
    const total = subTotal + adjustment;

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
                  <h1 className="h4 ls-tight headingColor">Add Credit Notes</h1>
                </div>
              </div>
              <div className="col-auto">
                <div className="hstack gap-2 justify-content-end">
                  <Link to="/creditnotes">
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
                    {...formik.getFieldProps("customerID")}
                    className={`form-select form-select-sm   ${
                      formik.touched.customerID && formik.errors.customerID
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
                  {formik.touched.customerID && formik.errors.customerID && (
                    <div className="invalid-feedback">
                      {formik.errors.customerID}
                    </div>
                  )}
                </div>
              </div>

              <div className="col-md-6 col-12 mb-3">
                <lable className="form-lable">
                  Credit Note<span className="text-danger">*</span>
                </lable>
                <div className="mb-3">
                  <input
                    type="text"
                    className={`form-control form-control-sm  ${
                      formik.touched.creditNote && formik.errors.creditNote
                        ? "is-invalid"
                        : ""
                    }`}
                    {...formik.getFieldProps("creditNote")}
                  />
                  {formik.touched.creditNote && formik.errors.creditNote && (
                    <div className="invalid-feedback">
                      {formik.errors.creditNote}
                    </div>
                  )}
                </div>
              </div>

              <div className="col-md-6 col-12 mb-3">
                <lable className="form-lable">Reference</lable>
                <div className="">
                  <input
                    type="text"
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

              <div className="col-md-6 col-12 mb-3">
                <lable className="form-lable">
                  Credit Note Date<span className="text-danger">*</span>
                </lable>
                <div className="">
                  <input
                    type="date"
                    className={`form-control form-control-sm ${
                      formik.touched.creditNoteDate &&
                      formik.errors.creditNoteDate
                        ? "is-invalid"
                        : ""
                    }`}
                    {...formik.getFieldProps("creditNoteDate")}
                  />
                  {formik.touched.creditNoteDate &&
                    formik.errors.creditNoteDate && (
                      <div className="invalid-feedback">
                        {formik.errors.creditNoteDate}
                      </div>
                    )}
                </div>
              </div>

              <div className="col-md-6 col-12 mb-3">
                <lable className="form-lable">Sales Person</lable>
                <div className="mb-3">
                  <select
                    {...formik.getFieldProps("salesPerson")}
                    className={`form-select form-select-sm  ${
                      formik.touched.salesPerson && formik.errors.salesPerson
                        ? "is-invalid"
                        : ""
                    }`}
                  >
                    <option selected></option>
                    {salesPerson &&
                      salesPerson.map((data) => (
                        <option
                          key={data.sales_person_id}
                          value={data.sales_person_id}
                        >
                          {data.sales_person_name}
                        </option>
                      ))}
                  </select>
                  {formik.touched.salesPerson && formik.errors.salesPerson && (
                    <div className="invalid-feedback">
                      {formik.errors.salesPerson}
                    </div>
                  )}
                </div>
              </div>
              <div className="col-md-6 col-12 mb-3">
                <lable className="form-lable">Subject</lable>
                <div className="">
                  <input
                    type="text"
                    className={`form-control form-control-sm ${
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
                        <th>S.NO</th>
                        <th style={{ width: "25%" }}>
                          Item Details<span className="text-danger">*</span>
                        </th>
                        <th style={{ width: "15%" }}>Account</th>
                        <th style={{ width: "15%" }}>Quantity</th>
                        <th style={{ width: "15%" }}>Rate</th>
                        <th style={{ width: "15%" }}>Discount(%)</th>
                        <th style={{ width: "15%" }}>Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {formik.values.itemDetailsList.map((item, index) => (
                        <tr key={index}>
                          <th scope="row">{index + 1}</th>
                          <td>
                            <select
                              name={`itemDetailsList[${index}].itemId`}
                              {...formik.getFieldProps(
                                `itemDetailsList[${index}].itemId`
                              )}
                              className={`form-select ${
                                formik.touched.itemDetailsList?.[index]
                                  ?.itemId &&
                                formik.errors.itemDetailsList?.[index]?.itemId
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
                            {formik.touched.itemDetailsList?.[index]?.itemId &&
                              formik.errors.itemDetailsList?.[index]
                                ?.itemId && (
                                <div className="invalid-feedback">
                                  {formik.errors.itemDetailsList[index].itemId}
                                </div>
                              )}
                          </td>
                          <td>
                            <select
                              name={`itemDetailsList[${index}].accountId`}
                              {...formik.getFieldProps(
                                `itemDetailsList[${index}].accountId`
                              )}
                              className={`form-select ${
                                formik.touched.itemDetailsList?.[index]
                                  ?.accountId &&
                                formik.errors.itemDetailsList?.[index]
                                  ?.accountId
                                  ? "is-invalid"
                                  : ""
                              }`}
                            >
                              <option selected> </option>
                              {account &&
                                account.map((data) => (
                                  <option key={data.id} value={data.id}>
                                    {data.accountName}
                                  </option>
                                ))}
                            </select>
                            {formik.touched.itemDetailsList?.[index]
                              ?.accountId &&
                              formik.errors.itemDetailsList?.[index]
                                ?.accountId && (
                                <div className="invalid-feedback">
                                  {
                                    formik.errors.itemDetailsList[index]
                                      .accountId
                                  }
                                </div>
                              )}
                          </td>
                          <td>
                            <input
                              type="number"
                              min="0"
                              name={`itemDetailsList[${index}].quantity`}
                              className={`form-control ${
                                formik.touched.itemDetailsList?.[index]
                                  ?.quantity &&
                                formik.errors.itemDetailsList?.[index]?.quantity
                                  ? "is-invalid"
                                  : ""
                              }`}
                              {...formik.getFieldProps(
                                `itemDetailsList[${index}].quantity`
                              )}
                              onChange={(e) => {
                                const quantity =
                                  parseInt(e.target.value, 10) || 0;
                                handleQuantityChange(
                                  index,
                                  quantity,
                                  formik.values.itemDetailsList[index].discount
                                );
                                // handleQuantityChange(index, quantity);
                                formik.handleChange(e);
                              }}
                            />
                            {formik.touched.itemDetailsList?.[index]
                              ?.quantity &&
                              formik.errors.itemDetailsList?.[index]
                                ?.quantity && (
                                <div className="invalid-feedback">
                                  {
                                    formik.errors.itemDetailsList[index]
                                      ?.quantity
                                  }
                                </div>
                              )}
                          </td>
                          <td>
                            <input
                              type="text"
                              name={`itemDetailsList[${index}].rate`}
                              className={`form-control ${
                                formik.touched.itemDetailsList?.[index]?.rate &&
                                formik.errors.itemDetailsList?.[index]?.rate
                                  ? "is-invalid"
                                  : ""
                              }`}
                              {...formik.getFieldProps(
                                `itemDetailsList[${index}].rate`
                              )}
                              readOnly
                            />
                            {formik.touched.itemDetailsList?.[index]?.rate &&
                              formik.errors.itemDetailsList?.[index]?.rate && (
                                <div className="invalid-feedback">
                                  {formik.errors.itemDetailsList[index].rate}
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
                              className={`form-control ${
                                formik.touched.itemDetailsList?.[index]
                                  ?.discount &&
                                formik.errors.itemDetailsList?.[index]?.discount
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
                                handleQuantityChange(
                                  index,
                                  formik.values.itemDetailsList[index].quantity,
                                  discount
                                );
                                formik.handleChange(e);
                              }}
                            />
                            {formik.touched.itemDetailsList?.[index]
                              ?.discount &&
                              formik.errors.itemDetailsList?.[index]
                                ?.discount && (
                                <div className="invalid-feedback">
                                  {
                                    formik.errors.itemDetailsList[index]
                                      .discount
                                  }
                                </div>
                              )}
                          </td>
                          <td>
                            <input
                              type="text"
                              name={`itemDetailsList[${index}].amount`}
                              className={`form-control ${
                                formik.touched.itemDetailsList?.[index]
                                  ?.amount &&
                                formik.errors.itemDetailsList?.[index]?.amount
                                  ? "is-invalid"
                                  : ""
                              }`}
                              {...formik.getFieldProps(
                                `itemDetailsList[${index}].amount`
                              )}
                              readOnly
                            />
                            {formik.touched.itemDetailsList?.[index]?.amount &&
                              formik.errors.itemDetailsList?.[index]
                                ?.amount && (
                                <div className="invalid-feedback">
                                  {formik.errors.itemDetailsList[index].amount}
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
                <div
                  className="col-md-6 col-12 mb-3 pt-0"
                  // style={{marginTop:"8rem"}}
                >
                  <lable className="form-lable">Customer Notes</lable>
                  <div className="mb-3">
                    <textarea
                      type="text"
                      className={`form-control  ${
                        formik.touched.customerNotes &&
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
                        value={formik.values.subTotal}
                        readOnly
                      />
                      {formik.touched.subTotal && formik.errors.subTotal && (
                        <div className="invalid-feedback">
                          {formik.errors.subTotal}
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
                        type="number"
                        className={`form-control ${
                          formik.touched.adjustment && formik.errors.adjustment
                            ? "is-invalid"
                            : ""
                        }`}
                        {...formik.getFieldProps("adjustment")}
                        onChange={handleAdjustmentChange}
                      />
                      {formik.touched.adjustment &&
                        formik.errors.adjustment && (
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
                        className={`form-control ${
                          formik.touched.total && formik.errors.total
                            ? "is-invalid"
                            : ""
                        }`}
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
                      className={`form-control  ${
                        formik.touched.termsCondition &&
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

export default CreditNotesAdd;
