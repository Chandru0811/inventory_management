import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import api from "../../../../config/URL";
import toast from "react-hot-toast";
// import VendorCredit from "./VendorCredit";

const validationSchema = Yup.object({
  creditNoteNum: Yup.string().required("*Credit Note Number is required"),
  orderCreditDdate: Yup.string().required("*Order Creditd Date is required"),
  // txnVendorCreditItemsModels: Yup.array().of(
  //   Yup.object({
  //     item: Yup.string().required("item is required"),
  //   })
  // ),
});

function VendorCreditEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoadIndicator] = useState(false);
  const [customerData, setCustomerData] = useState(null);
  const [itemData, setItemData] = useState(null);

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
      txnVendorCreditItemsModels: [
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
        // onSubmit: async (values) => {
    //     setLoadIndicator(true);
    //     // try {
    //     //   const formData = new FormData();

    //     //   formData.append("creditNoteNum", values.creditNoteNum);
    //     //   formData.append("orderNumber", values.orderNumber);
    //     //   formData.append("orderCreditDdate", values.orderCreditDdate);
    //     //   formData.append("subject", values.subject);
    //     //   formData.append("notes", values.notes);
    //     //   formData.append("vendorCreditsFile", values.vendorCreditsFile);
    //     //   formData.append("subTotal", values.subTotal);
    //     //   formData.append("discount", values.discount);
    //     //   formData.append("adjustment", values.adjustment);
    //     //   formData.append("total", values.total);
    //     //  values.txnInvoiceOrderItemsModels.forEach((item) => {
    //     //     formData.append("item", item.item);
    //     //     formData.append("qty", item.qty);
    //     //     formData.append("price", item.price);
    //     //     formData.append("taxRate", item.taxRate);
    //     //     formData.append("disc", item.disc);
    //     //     formData.append("amount", item.amount);
    //     //     formData.append("mstrItemsId", item.item);
    //     //     formData.append("description", "item.item");
    //     //     formData.append("account", "item.item");
    //     //     formData.append("taxAmount", "000");
    //     //     formData.append("project", "000");
    //     //   });
    //     //   const response = await api.put(
    //     //     `updateVendorCredits/${id}`,
    //     //     formData,
    //     //     {
    //     //       headers: {
    //     //         "Content-Type": "multipart/form-data",
    //     //       },
    //     //     }
    //     //   );

    //     //   if (response.status === 201) {
    //     //     toast.success(response.data.message);
    //     //     navigate("/vendorcredit");
    //     //   } else {
    //     //     toast.error(response.data.message);
    //     //   }
    //     // } catch (error) {
    //     //   toast.error("Error: Unable to save sales order.");
    //     // } finally {
    //     //   setLoadIndicator(false);
    //     // }
    //   },

    onSubmit: async (values) => {
      setLoadIndicator(true);
      try {
        const response = await api.put(`updateVendorCredits/${id}`, values,);
        if (response.status === 200) {
          toast.success(response.data.message);
          navigate("/vendorcredit");
        } else {
          toast.error(response.data.message);
        }
      } catch (error) {
        toast.error("Error: Unable to save.");
      } finally {
        setLoadIndicator(false);
      }
    },
  });
  
  useEffect(() => {
    const getData = async () => {
      try {
        const response = await api.get(`getAllVendorCreditsById/${id}`);
        console.log(response.data);
        formik.setValues(response.data);
        formik.setFieldValue(
          "txnVendorCreditItemsModels",
          response.data.invoiceItemsModels
        );
      } catch (error) {
        toast.error("Error: Unable to Data");
      }
    };
    getData();
  }, [id]);

  useEffect(() => {
    const updateAndCalculate = async () => {
      try {
        let totalRate = 0;
        let totalAmount = 0;
        let totalTax = 0;
        let discAmount = 0;

        const updatedItems = await Promise.all(
          formik.values.txnVendorCreditItemsModels.map(async (item, index) => {
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
          txnVendorCreditItemsModels: updatedItems,
        });
        formik.setFieldValue("subTotal", totalRate);
        formik.setFieldValue("total", totalAmount);
        formik.setFieldValue("totalTax", totalTax);
        formik.setFieldValue("discountAmount", discAmount);
      } catch (error) {
        // toast.error("Error updating items: ", error.message);
      }
    };

    updateAndCalculate();
  }, [
    formik.values.txnVendorCreditItemsModels?.map((item) => item.item).join(""),
  ]);

  useEffect(() => {
    const updateAndCalculate = async () => {
      try {
        let totalRate = 0;
        let totalAmount = 0;
        let totalTax = 0;
        let discAmount = 0;

        const updatedItems = await Promise.all(
          formik.values.txnVendorCreditItemsModels.map(async (item, index) => {
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
          txnVendorCreditItemsModels: updatedItems,
        });
        formik.setFieldValue("subTotal", totalRate);
        formik.setFieldValue("total", totalAmount);
        formik.setFieldValue("totalTax", totalTax);
        formik.setFieldValue("discountAmount", discAmount);
      } catch (error) {
        // toast.error("Error updating items: ", error.message);
      }
    };

    updateAndCalculate();
  }, [
    formik.values.txnVendorCreditItemsModels?.map((item) => item?.qty).join(""),
    formik.values.txnVendorCreditItemsModels?.map((item) => item?.price).join(""),
    formik.values.txnVendorCreditItemsModels?.map((item) => item?.disc).join(""),
    formik.values.txnVendorCreditItemsModels?.map((item) => item?.taxRate).join(""),
  ]);

  const calculateAmount = (qty, price, disc, taxRate) => {
    const totalRate = qty * price;
    const discountAmount = totalRate * (disc / 100);
    const taxableAmount = totalRate * (taxRate / 100);
    const totalAmount = totalRate + taxableAmount - discountAmount;
    return totalAmount;
  };

  const AddRowContent = () => {
    formik.setFieldValue("txnVendorCreditItemsModels", [
      ...formik.values.txnVendorCreditItemsModels,
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
    if (formik.values.txnVendorCreditItemsModels.length === 1) {
      return;
    }

    const updatedRows = [...formik.values.txnVendorCreditItemsModels];
    updatedRows.pop();
    formik.setFieldValue("txnVendorCreditItemsModels", updatedRows);
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
                    Edit Vendor Credit
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
          <div className="container mb-5 mt-5">
            <div className="row py-4">
              <div className="col-md-6 col-12 mb-3">
                <lable className="form-lable">
                  Credit Note Number<span className="text-danger">*</span>
                </lable>
                <div className="mb-3">
                  <input
                    type="text"
                    className={`form-control  ${formik.touched.creditNoteNum &&
                      formik.errors.creditNoteNum
                      ? "is-invalid"
                      : ""
                      }`}
                    {...formik.getFieldProps("creditNoteNum")}
                  />
                  {formik.touched.creditNoteNum &&
                    formik.errors.creditNoteNum && (
                      <div className="invalid-feedback">
                        {formik.errors.creditNoteNum}
                      </div>
                    )}
                </div>
              </div>
              <div className="col-md-6 col-12 mb-3">
                <lable className="form-lable">
                  Order Number<span className="text-danger">*</span>
                </lable>
                <div className="mb-3">
                  <input
                    type="text"
                    className={`form-control  ${formik.touched.orderNumber &&
                      formik.errors.orderNumber
                      ? "is-invalid"
                      : ""
                      }`}
                    {...formik.getFieldProps("orderNumber")}
                  />
                  {formik.touched.orderNumber &&
                    formik.errors.orderNumber && (
                      <div className="invalid-feedback">
                        {formik.errors.orderNumber}
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
                    className={`form-control ${formik.touched.orderCreditDdate && formik.errors.orderCreditDdate
                      ? "is-invalid"
                      : ""
                      }`}
                    {...formik.getFieldProps("orderCreditDdate")}
                  />
                  {formik.touched.orderCreditDdate && formik.errors.orderCreditDdate && (
                    <div className="invalid-feedback">
                      {formik.errors.orderCreditDdate}
                    </div>
                  )}
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
                      {formik.values.txnVendorCreditItemsModels?.map(
                        (item, index) => (
                          <tr key={index}>
                            <th scope="row">{index + 1}</th>
                            <td>
                              <select
                                name={`txnVendorCreditItemsModels[${index}].item`}
                                {...formik.getFieldProps(
                                  `txnVendorCreditItemsModels[${index}].item`
                                )}
                                className={`form-select ${formik.touched.txnVendorCreditItemsModels?.[
                                  index
                                ]?.item &&
                                  formik.errors.txnVendorCreditItemsModels?.[
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
                              {formik.touched.txnVendorCreditItemsModels?.[
                                index
                              ]?.item &&
                                formik.errors.txnVendorCreditItemsModels?.[
                                  index
                                ]?.item && (
                                  <div className="invalid-feedback">
                                    {
                                      formik.errors.txnVendorCreditItemsModels[
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
                                name={`txnVendorCreditItemsModels[${index}].qty`}
                                className={`form-control ${formik.touched.txnVendorCreditItemsModels?.[
                                  index
                                ]?.qty &&
                                  formik.errors.txnVendorCreditItemsModels?.[
                                    index
                                  ]?.qty
                                  ? "is-invalid"
                                  : ""
                                  }`}
                                {...formik.getFieldProps(
                                  `txnVendorCreditItemsModels[${index}].qty`
                                )}
                              />
                              {formik.touched.txnVendorCreditItemsModels?.[
                                index
                              ]?.qty &&
                                formik.errors.txnVendorCreditItemsModels?.[
                                  index
                                ]?.qty && (
                                  <div className="invalid-feedback">
                                    {
                                      formik.errors.txnVendorCreditItemsModels[
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
                                name={`txnVendorCreditItemsModels[${index}].price`}
                                className={`form-control ${formik.touched.txnVendorCreditItemsModels?.[
                                  index
                                ]?.price &&
                                  formik.errors.txnVendorCreditItemsModels?.[
                                    index
                                  ]?.price
                                  ? "is-invalid"
                                  : ""
                                  }`}
                                {...formik.getFieldProps(
                                  `txnVendorCreditItemsModels[${index}].price`
                                )}
                              />
                              {formik.touched.txnVendorCreditItemsModels?.[
                                index
                              ]?.price &&
                                formik.errors.txnVendorCreditItemsModels?.[
                                  index
                                ]?.price && (
                                  <div className="invalid-feedback">
                                    {
                                      formik.errors.txnVendorCreditItemsModels[
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
                                name={`txnVendorCreditItemsModels[${index}].discount`}
                                className={`form-control ${formik.touched.txnVendorCreditItemsModels?.[
                                  index
                                ]?.discount &&
                                  formik.errors.txnVendorCreditItemsModels?.[
                                    index
                                  ]?.discount
                                  ? "is-invalid"
                                  : ""
                                  }`}
                                {...formik.getFieldProps(
                                  `txnVendorCreditItemsModels[${index}].discount`
                                )}
                              />
                              {formik.touched.txnVendorCreditItemsModels?.[
                                index
                              ]?.discount &&
                                formik.errors.txnVendorCreditItemsModels?.[
                                  index
                                ]?.discount && (
                                  <div className="invalid-feedback">
                                    {
                                      formik.errors.txnVendorCreditItemsModels[
                                        index
                                      ].discount
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
                                name={`txnVendorCreditItemsModels[${index}].taxRate`}
                                className={`form-control ${formik.touched.txnVendorCreditItemsModels?.[
                                  index
                                ]?.taxRate &&
                                  formik.errors.txnVendorCreditItemsModels?.[
                                    index
                                  ]?.taxRate
                                  ? "is-invalid"
                                  : ""
                                  }`}
                                {...formik.getFieldProps(
                                  `txnVendorCreditItemsModels[${index}].taxRate`
                                )}
                              />
                              {formik.touched.txnVendorCreditItemsModels?.[
                                index
                              ]?.taxRate &&
                                formik.errors.txnVendorCreditItemsModels?.[
                                  index
                                ]?.taxRate && (
                                  <div className="invalid-feedback">
                                    {
                                      formik.errors.txnVendorCreditItemsModels[
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
                                name={`txnVendorCreditItemsModels[${index}].amount`}
                                className={`form-control ${formik.touched.txnVendorCreditItemsModels?.[
                                  index
                                ]?.amount &&
                                  formik.errors.txnVendorCreditItemsModels?.[
                                    index
                                  ]?.amount
                                  ? "is-invalid"
                                  : ""
                                  }`}
                                {...formik.getFieldProps(
                                  `txnVendorCreditItemsModels[${index}].amount`
                                )}
                              />
                              {formik.touched.txnVendorCreditItemsModels?.[
                                index
                              ]?.amount &&
                                formik.errors.txnVendorCreditItemsModels?.[
                                  index
                                ]?.amount && (
                                  <div className="invalid-feedback">
                                    {
                                      formik.errors.txnVendorCreditItemsModels[
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
                {formik.values.txnVendorCreditItemsModels?.length > 1 && (
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
                      className={`form-control  ${formik.touched.customerNotes &&
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
                        className={`form-control ${formik.touched.subTotal && formik.errors.subTotal
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
                        className={`form-control ${formik.touched.discountAmount &&
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
                        className={`form-control ${formik.touched.totalTax && formik.errors.totalTax
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
                        className={`form-control ${formik.touched.total && formik.errors.total
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
                      className={`form-control  ${formik.touched.termsAndconditions &&
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

export default VendorCreditEdit;
