import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
// import api from "../../config/URL";
import toast from "react-hot-toast";
import api from "../../../../config/URL";

function OrderAdd() {
  const navigate = useNavigate();
  const [loading, setLoadIndicator] = useState(false);
  const [customerData, setCustomerData] = useState(null);
  const [itemData, setItemData] = useState(null);

  const validationSchema = Yup.object({
    vendorName: Yup.string().required("*Vendor name is required"),
    deliveryAddressCategory: Yup.string().required(
      "*Delivery address category is required"
    ),
    deliveryAddress: Yup.string().required("*Delivery address is required"),
    purchaseOrderNumber: Yup.string().required("*Purchase order is required"),
  });

  const formik = useFormik({
    initialValues: {
      vendorName: "",
      deliveryAddress: "",
      purchaseOrderNumber: "",
      deliveryAddressCategory: "",
      date: "",
      subTotal: "",
      totalTax: "",
      discountAmount: "",
      total: "",
      purchaseOrderRef: null,
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
    // onSubmit: async (values) => {
    //     setLoadIndicator(true);
    //     // try {
    //     //   const formData = new FormData();

    //     //   formData.append("vendorName", values.vendorName);
    //     //   formData.append("deliveryAddress", values.deliveryAddress);
    //     //   formData.append("date", values.date);
    //     //   formData.append("purchaseOrderNumber", values.purchaseOrderNumber);
    //     //   formData.append("deliveryAddressCategory", values.deliveryAddressCategory);
    //     //   formData.append("subTotal", values.subTotal);
    //     //   formData.append("totalTax", values.totalTax);
    //     //   formData.append("discountAmount", values.discountAmount);
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
    //     //   if (values.purchaseOrderRef) {
    //     //   formData.append("purchaseOrderRef", values.purchaseOrderRef);
    //     //   }
    //     //   const response = await api.post(
    //     //     "invoice-invoice-item",
    //     //     formData,
    //     //     {
    //     //       headers: {
    //     //         "Content-Type": "multipart/form-data",
    //     //       },
    //     //     }
    //     //   );

    //     //   if (response.status === 201) {
    //     //     toast.success(response.data.message);
    //     //     navigate("/invoice");
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
      console.log(values);
      try {
        const response = await api.post("/createPurchaseOrder", values, {});
        if (response.status === 201) {
          toast.success(response.data.message);
          navigate("/order");
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

  //   const fetchData = async () => {
  //     try {
  //       const customerData = await fetchAllCustomerWithIds();
  //       const itemData = await fetchAllItemWithIds();
  //       setCustomerData(customerData);
  //       setItemData(itemData);
  //     } catch (error) {
  //       toast.error(error.message);
  //     }
  //   };
  //   useEffect(() => {
  //     fetchData();
  //   }, []);

  //   useEffect(() => {
  //     const updateAndCalculate = async () => {
  //       try {
  //         let totalRate = 0;
  //         let totalAmount = 0;
  //         let totalTax = 0;
  //         let discAmount=0;
  //         const updatedItems = await Promise.all(
  //           formik.values.txnInvoiceOrderItemsModels.map(async (item, index) => {
  //             if (item.item) {
  //               try {
  //                 const response = await api.get(`itemsById/${item.item}`);
  //                 const updatedItem = { ...item, price: response.data.salesPrice, qty:1 };
  //                 const amount = calculateAmount(updatedItem.qty, updatedItem.price, updatedItem.disc, updatedItem.taxRate);
  //                 const itemTotalRate = updatedItem.qty * updatedItem.price;
  //                 const itemTotalTax = itemTotalRate * (updatedItem.taxRate / 100);
  //                 const itemTotalDisc =
  //                   itemTotalRate * (updatedItem.disc / 100);
  //                   discAmount +=itemTotalDisc
  //                 totalRate += updatedItem.price;
  //                 totalAmount += amount;
  //                 totalTax += itemTotalTax;
  //                 return { ...updatedItem, amount };
  //               } catch (error) {
  //                 toast.error("Error fetching data: ", error?.response?.data?.message);
  //               }
  //             }
  //             return item;
  //           })
  //         );
  //         formik.setValues({ ...formik.values, txnInvoiceOrderItemsModels: updatedItems });
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
  //     formik.values.txnInvoiceOrderItemsModels.map((item) => item.item).join(""),
  //   ]);

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
    <div className="container-fluid p-2 minHeight m-0">
      <form onSubmit={formik.handleSubmit}>
        <div className="card shadow border-0 mb-2 top-header">
          <div className="container-fluid py-4">
            <div className="row align-items-center">
              <div className="col">
                <div className="d-flex align-items-center gap-4">
                  <h1 className="h4 ls-tight headingColor">
                    Add Purchase Order
                  </h1>
                </div>
              </div>
              <div className="col-auto">
                <div className="hstack gap-2 justify-content-end">
                  <Link to="/order">
                    <button type="submit" className="btn btn-sm btn-light">
                      <span>Back</span>
                    </button>
                  </Link>
                  <button
                    type="submit"
                    className="btn btn-sm btn-primary"
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
        <div className="card shadow border-0 my-2">
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
                    <option value="John Smith">John Smith</option>
                    <option value="Emily Johnson">Emily Johnson</option>
                    <option value="David Williams">David Williams</option>
                  </select>
                  {formik.touched.vendorName && formik.errors.vendorName && (
                    <div className="invalid-feedback">
                      {formik.errors.vendorName}
                    </div>
                  )}
                </div>
              </div>

              <div className="col-md-6 col-12 mb-3">
                <div>
                  <label for="exampleFormControlInput1" className="form-label">
                  Delivery Address Category <span className="text-danger">*</span>
                  </label>
                </div>
                <div className="form-check form-check-inline">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="deliveryAddressCategory"
                    id="ORGANIZATION"
                    value="ORGANIZATION"
                    onChange={formik.handleChange}
                    checked={formik.values.deliveryAddressCategory === "ORGANIZATION"}
                  />
                  <label className="form-check-label">Organization</label>
                </div>
                <div className="form-check form-check-inline">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="deliveryAddressCategory"
                    id="CUSTOMER"
                    value="CUSTOMER"
                    onChange={formik.handleChange}
                    checked={formik.values.deliveryAddressCategory === "CUSTOMER"}
                  />
                  <label className="form-check-label">Customer</label>
                </div>
                {formik.errors.deliveryAddressCategory && formik.touched.deliveryAddressCategory && (
                  <div className="text-danger  " style={{ fontSize: ".875em" }}>
                    {formik.errors.deliveryAddressCategory}
                  </div>
                )}
              </div>

              <div className="col-md-6 col-12 mb-3">
                <lable className="form-lable">
                  Delivery Address<span className="text-danger">*</span>
                </lable>
                <div className="">
                  <textarea
                    type="text"
                    className={`form-control ${
                      formik.touched.deliveryAddress &&
                      formik.errors.deliveryAddress
                        ? "is-invalid"
                        : ""
                    }`}
                    rows="4"
                    {...formik.getFieldProps("deliveryAddress")}
                  />
                  {formik.touched.deliveryAddress &&
                    formik.errors.deliveryAddress && (
                      <div className="invalid-feedback">
                        {formik.errors.deliveryAddress}
                      </div>
                    )}
                </div>
              </div>

              <div className="col-md-6 col-12 mb-3">
                <lable className="form-lable">
                  Purchase Order<span className="text-danger">*</span>
                </lable>
                <div className="">
                  <input
                    type="text"
                    className={`form-control ${
                      formik.touched.purchaseOrderNumber &&
                      formik.errors.purchaseOrderNumber
                        ? "is-invalid"
                        : ""
                    }`}
                    {...formik.getFieldProps("purchaseOrderNumber")}
                  />
                  {formik.touched.purchaseOrderNumber &&
                    formik.errors.purchaseOrderNumber && (
                      <div className="invalid-feedback">
                        {formik.errors.purchaseOrderNumber}
                      </div>
                    )}
                </div>
              </div>

              <div className="col-md-6 col-12 mb-3">
                <label className="form-label">Reference</label>
                <div className="">
                  <input
                    type="text"
                    className={`form-control  ${
                      formik.touched.purchaseOrderRef &&
                      formik.errors.purchaseOrderRef
                        ? "is-invalid"
                        : ""
                    }`}
                    {...formik.getFieldProps("purchaseOrderRef")}
                  />
                </div>
              </div>

              <div className="col-md-6 col-12 mb-3">
                <lable className="form-lable">Date</lable>
                <div className="mb-3">
                  <input
                    type="date"
                    className={`form-control  ${
                      formik.touched.date && formik.errors.date
                        ? "is-invalid"
                        : ""
                    }`}
                    {...formik.getFieldProps("date")}
                  />
                  {formik.touched.date && formik.errors.date && (
                    <div className="invalid-feedback">{formik.errors.date}</div>
                  )}
                </div>
              </div>
              <div className="col-md-6 col-12 mb-3">
                <lable className="form-lable">Delivery Date</lable>
                <div className="mb-3">
                  <input
                    type="date"
                    className={`form-control  ${
                      formik.touched.deliveryDate && formik.errors.deliveryDate
                        ? "is-invalid"
                        : ""
                    }`}
                    {...formik.getFieldProps("deliveryDate")}
                  />
                  {formik.touched.deliveryDate &&
                    formik.errors.deliveryDate && (
                      <div className="invalid-feedback">
                        {formik.errors.deliveryDate}
                      </div>
                    )}
                </div>
              </div>
              <div className="col-md-6 col-12 mb-3">
                <lable className="form-lable">Payment Term</lable>
                <div className="mb-3">
                  <input
                    type="text"
                    className={`form-control  ${
                      formik.touched.paymentTerm && formik.errors.paymentTerm
                        ? "is-invalid"
                        : ""
                    }`}
                    {...formik.getFieldProps("paymentTerm")}
                  />
                  {formik.touched.paymentTerm && formik.errors.paymentTerm && (
                    <div className="invalid-feedback">
                      {formik.errors.paymentTerm}
                    </div>
                  )}
                </div>
              </div>
              <div className="col-md-6 col-12 mb-3">
                <lable className="form-lable">Shipment Preference</lable>
                <div className="mb-3">
                  <input
                    type="text"
                    className={`form-control  ${
                      formik.touched.shipmentPreference &&
                      formik.errors.shipmentPreference
                        ? "is-invalid"
                        : ""
                    }`}
                    {...formik.getFieldProps("shipmentPreference")}
                  />
                  {formik.touched.shipmentPreference &&
                    formik.errors.shipmentPreference && (
                      <div className="invalid-feedback">
                        {formik.errors.shipmentPreference}
                      </div>
                    )}
                </div>
              </div>
              <div className="col-md-6 col-12 mb-3">
                <lable className="form-lable">Purchase Order File</lable>
                <div className="mb-3">
                  <input
                    type="file"
                    className="form-control"
                    onChange={(event) => {
                      formik.setFieldValue(
                        "purchaseOrderFile",
                        event.target.files[0]
                      );
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
                        <th style={{ width: "25%" }}>Item</th>
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
                      rows="4"
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

export default OrderAdd;
