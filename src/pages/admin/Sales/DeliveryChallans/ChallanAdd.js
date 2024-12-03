import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import api from "../../../../config/URL";
import toast from "react-hot-toast";

function ChellanAdd() {
  const navigate = useNavigate();
  const [loading, setLoadIndicator] = useState(false);
  const [customerData, setCustomerData] = useState(null);
  const [itemData, setItemData] = useState(null);

  const validationSchema = Yup.object({
    customerId: Yup.string().required("*Customer Name is required"),
    deliveryChallan: Yup.string().required("*Delivery Challan is required"),
    deliveryChallanDate: Yup.string().required(
      "*Delivery Challan Date is required"
    ),
    challanType: Yup.string().required("*Challan Type is required"),
    deliveryChallanItemsJson: Yup.array().of(
      Yup.object({
        itemId: Yup.string().required("*Item is required"),
      })
    ),
  });

  const formik = useFormik({
    initialValues: {
      customerId: "",
      deliveryChallan: "",
      deliveryChallanDate: "",
      challanType: "",
      attachFile: null,
      deliveryChallanItemsJson: [
        {
          itemId: "",
          unitPrice: "",
          qty: "",
          price: "",
          discount: "",
          amount: "",
        },
      ],
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      setLoadIndicator(true);
      console.log(values);
      try {
        const formData = new FormData();

        formData.append("customerId", values.customerId);
        formData.append("deliveryChallan", values.deliveryChallan);
        formData.append("reference", values.reference);
        formData.append("deliveryChallanDate", values.deliveryChallanDate);
        formData.append("subTotal", values.subTotal);
        formData.append("adjustment", values.adjustment);
        formData.append("total", values.total);
        formData.append("customerNotes", values.customerNotes);
        formData.append("termsConditions", values.termsConditions);
        formData.append("attachFile", values.attachFile);
        formData.append(
          "deliveryChallanItemsJson",
          JSON.stringify(
            values.deliveryChallanItemsJson?.map((item) => ({
              itemId: item.itemId?.id || item.itemId,
              quantity: item.quantity,
              rate: item.rate,
              discount: item.discount,
              amount: item.amount,
            }))
          )
        );
        const response = await api.post("createDeliveryChallansWithItems", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        if (response.status === 201) {
          toast.success(response.data.message);
          navigate("/challan");
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

  // useEffect(() => {
  //   const updateAndCalculate = async () => {
  //     try {
  //       let totalRate = 0;
  //       let totalAmount = 0;
  //       let totalTax = 0;
  //       let discAmount = 0;
  //       const updatedItems = await Promise.all(
  //         formik.values.deliveryChallanItemsJson.map(async (item, index) => {
  //           if (item.item) {
  //             try {
  //               const response = await api.get(`itemsById/${item.item}`);
  //               const updatedItem = {
  //                 ...item,
  //                 price: response.data.salesPrice,
  //                 qty: 1,
  //               };
  //               const amount = calculateAmount(
  //                 updatedItem.qty,
  //                 updatedItem.price,
  //                 updatedItem.disc,
  //                 updatedItem.taxRate
  //               );
  //               const itemTotalRate = updatedItem.qty * updatedItem.price;
  //               const itemTotalTax =
  //                 itemTotalRate * (updatedItem.taxRate / 100);
  //               const itemTotalDisc = itemTotalRate * (updatedItem.disc / 100);
  //               discAmount += itemTotalDisc;
  //               totalRate += updatedItem.price;
  //               totalAmount += amount;
  //               totalTax += itemTotalTax;
  //               return { ...updatedItem, amount };
  //             } catch (error) {
  //               toast.error(
  //                 "Error fetching data: ",
  //                 error?.response?.data?.message
  //               );
  //             }
  //           }
  //           return item;
  //         })
  //       );
  //       formik.setValues({
  //         ...formik.values,
  //         deliveryChallanItemsJson: updatedItems,
  //       });
  //       formik.setFieldValue("subTotal", totalRate);
  //       formik.setFieldValue("total", totalAmount);
  //       formik.setFieldValue("totalTax", totalTax);
  //       formik.setFieldValue("discountAmount", discAmount);
  //     } catch (error) {
  //       toast.error("Error updating items: ", error.message);
  //     }
  //   };

  //   updateAndCalculate();
  // }, [
  //   formik.values.deliveryChallanItemsJson.map((item) => item.item).join(""),
  // ]);

  // useEffect(() => {
  //   const updateAndCalculate = async () => {
  //     try {
  //       let totalRate = 0;
  //       let totalAmount = 0;
  //       let totalTax = 0;
  //       let discAmount = 0;
  //       const updatedItems = await Promise.all(
  //         formik.values.deliveryChallanItemsJson.map(async (item, index) => {
  //           if (
  //             item.qty &&
  //             item.price &&
  //             item.disc !== undefined &&
  //             item.taxRate !== undefined
  //           ) {
  //             const amount = calculateAmount(
  //               item.qty,
  //               item.price,
  //               item.disc,
  //               item.taxRate
  //             );
  //             const itemTotalRate = item.qty * item.price;
  //             const itemTotalTax = itemTotalRate * (item.taxRate / 100);
  //             const itemTotalDisc = itemTotalRate * (item.disc / 100);
  //             discAmount += itemTotalDisc;
  //             totalRate += item.price;
  //             totalAmount += amount;
  //             totalTax += itemTotalTax;
  //             return { ...item, amount };
  //           }
  //           return item;
  //         })
  //       );
  //       formik.setValues({
  //         ...formik.values,
  //         deliveryChallanItemsJson: updatedItems,
  //       });
  //       formik.setFieldValue("subTotal", totalRate);
  //       formik.setFieldValue("total", totalAmount);
  //       formik.setFieldValue("totalTax", totalTax);
  //       formik.setFieldValue("discountAmount", discAmount);
  //     } catch (error) {
  //       toast.error("Error updating items: ", error.message);
  //     }
  //   };

  //   updateAndCalculate();
  // }, [
  //   formik.values.deliveryChallanItemsJson.map((item) => item.qty).join(""),
  //   formik.values.deliveryChallanItemsJson.map((item) => item.price).join(""),
  //   formik.values.deliveryChallanItemsJson.map((item) => item.disc).join(""),
  //   formik.values.deliveryChallanItemsJson
  //     .map((item) => item.taxRate)
  //     .join(""),
  // ]);

  // const calculateAmount = (qty, price, disc, taxRate) => {
  //   const totalRate = qty * price;
  //   const discountAmount = totalRate * (disc / 100);
  //   const taxableAmount = totalRate * (taxRate / 100);
  //   const totalAmount = totalRate + taxableAmount - discountAmount;
  //   return totalAmount;
  // };

  const AddRowContent = () => {
    formik.setFieldValue("deliveryChallanItemsJson", [
      ...formik.values.deliveryChallanItemsJson,
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
    if (formik.values.deliveryChallanItemsJson.length === 1) {
      return;
    }
    const updatedRows = [...formik.values.deliveryChallanItemsJson];
    updatedRows.pop();
    formik.setFieldValue("deliveryChallanItemsJson", updatedRows);
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
        await formik.setFieldValue(`deliveryChallanItemsJson[${index}]`, {
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
    const item = formik.values.deliveryChallanItemsJson[index] || {};
    const newRate = item.unitPrice * quantity || 0;
    const currentRate = item.unitPrice || 0;
    const newDiscount = discount ? (newRate * discount) / 100 : 0;
    const newAmount = newRate - newDiscount || 0;

    await formik.setFieldValue(
      `deliveryChallanItemsJson[${index}].rate`,
      currentRate
    );
    await formik.setFieldValue(
      `deliveryChallanItemsJson[${index}].amount`,
      parseFloat(newAmount.toFixed(2))
    );

    recalculateSubtotalAndTotal();
  };

  const recalculateSubtotalAndTotal = () => {
    const deliveryItems = formik.values.deliveryChallanItemsJson || [];

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
                  <h1 className="h4 ls-tight headingColor">
                    Add Delivery Challans
                  </h1>
                </div>
              </div>
              <div className="col-auto">
                <div className="hstack gap-2 justify-content-end">
                  <Link to="/challan">
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
                    className={`form-select form-select-sm   ${formik.touched.customerId && formik.errors.customerId
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
                  {formik.touched.customerId &&
                    formik.errors.customerId && (
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
                  Delivery Challan<span className="text-danger">*</span>
                </lable>
                <div className="mb-3">
                  <input
                    type="text"
                    className={`form-control form-control-sm  ${formik.touched.deliveryChallan &&
                      formik.errors.deliveryChallan
                      ? "is-invalid"
                      : ""
                      }`}
                    {...formik.getFieldProps("deliveryChallan")}
                  />
                  {formik.touched.deliveryChallan &&
                    formik.errors.deliveryChallan && (
                      <div className="invalid-feedback">
                        {formik.errors.deliveryChallan}
                      </div>
                    )}
                </div>
              </div>

              <div className="col-md-6 col-12 mb-3">
                <lable className="form-lable">Reference</lable>
                <div className="">
                  <input
                    type="text"
                    className={`form-control form-control-sm ${formik.touched.reference && formik.errors.reference
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
                  Delivery Challan Date<span className="text-danger">*</span>
                </lable>
                <div className="">
                  <input
                    type="date"
                    className={`form-control form-control-sm ${formik.touched.deliveryChallanDate &&
                      formik.errors.deliveryChallanDate
                      ? "is-invalid"
                      : ""
                      }`}
                    {...formik.getFieldProps("deliveryChallanDate")}
                  />
                  {formik.touched.deliveryChallanDate &&
                    formik.errors.deliveryChallanDate && (
                      <div className="invalid-feedback">
                        {formik.errors.deliveryChallanDate}
                      </div>
                    )}
                </div>
              </div>
              <div className="col-md-6 col-12 mb-3">
                <lable className="form-lable">
                  Challan Type<span className="text-danger">*</span>
                </lable>
                <div className="">
                  <select
                    type="text"
                    className={`form-select form-select-sm ${formik.touched.challanType && formik.errors.challanType
                      ? "is-invalid"
                      : ""
                      }`}
                    {...formik.getFieldProps("challanType")}
                  >
                    <option selected></option>
                    <option value="Supply of Liquid Gas">
                      Supply of Liquid Gas
                    </option>
                    <option value="Job Work">Job Work</option>
                    <option value="Supply on Approval">
                      Supply on Approval
                    </option>
                    <option value="Others">Others</option>
                  </select>
                  {formik.touched.challanType && formik.errors.challanType && (
                    <div className="invalid-feedback">
                      {formik.errors.challanType}
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
                      formik.setFieldValue("attachFile", event.target.files[0]);
                    }}
                  />
                  {formik.touched.attachFile && formik.errors.attachFile && (
                    <div className="invalid-feedback">
                      {formik.errors.attachFile}
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
                      {formik.values.deliveryChallanItemsJson.map(
                        (item, index) => (
                          <tr key={index}>
                            <th scope="row">{index + 1}</th>
                            <td>
                              <select
                                name={`deliveryChallanItemsJson[${index}].itemId`}
                                {...formik.getFieldProps(
                                  `deliveryChallanItemsJson[${index}].itemId`
                                )}
                                className={`form-select ${formik.touched.deliveryChallanItemsJson?.[
                                  index
                                ]?.itemId &&
                                  formik.errors.deliveryChallanItemsJson?.[
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
                              {formik.touched.deliveryChallanItemsJson?.[
                                index
                              ]?.itemId &&
                                formik.errors.deliveryChallanItemsJson?.[
                                  index
                                ]?.itemId && (
                                  <div className="invalid-feedback">
                                    {
                                      formik.errors.deliveryChallanItemsJson[
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
                                name={`deliveryChallanItemsJson[${index}].quantity`}
                                className={`form-control ${formik.touched.deliveryChallanItemsJson?.[
                                  index
                                ]?.quantity &&
                                  formik.errors.deliveryChallanItemsJson?.[
                                    index
                                  ]?.quantity
                                  ? "is-invalid"
                                  : ""
                                  }`}
                                {...formik.getFieldProps(
                                  `deliveryChallanItemsJson[${index}].quantity`
                                )}
                                onChange={(e) => {
                                  const quantity =
                                    parseInt(e.target.value, 10) || 0;
                                  handleQuantityChange(index, quantity, formik.values.deliveryChallanItemsJson[index].discount);
                                  // handleQuantityChange(index, quantity);
                                  formik.handleChange(e);
                                }}
                              />
                              {formik.touched.deliveryChallanItemsJson?.[
                                index
                              ]?.quantity &&
                                formik.errors.deliveryChallanItemsJson?.[
                                  index
                                ]?.quantity && (
                                  <div className="invalid-feedback">
                                    {
                                      formik.errors.deliveryChallanItemsJson[
                                        index
                                      ]?.quantity
                                    }
                                  </div>
                                )}
                            </td>
                            <td>
                              <input
                                type="text"
                                name={`deliveryChallanItemsJson[${index}].rate`}
                                className={`form-control ${formik.touched.deliveryChallanItemsJson?.[
                                  index
                                ]?.rate &&
                                  formik.errors.deliveryChallanItemsJson?.[
                                    index
                                  ]?.rate
                                  ? "is-invalid"
                                  : ""
                                  }`}
                                {...formik.getFieldProps(
                                  `deliveryChallanItemsJson[${index}].rate`
                                )}
                                readOnly
                              />
                              {formik.touched.deliveryChallanItemsJson?.[
                                index
                              ]?.rate &&
                                formik.errors.deliveryChallanItemsJson?.[
                                  index
                                ]?.rate && (
                                  <div className="invalid-feedback">
                                    {
                                      formik.errors.deliveryChallanItemsJson[
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
                                name={`deliveryChallanItemsJson[${index}].discount`}
                                className={`form-control ${formik.touched.deliveryChallanItemsJson?.[
                                  index
                                ]?.discount &&
                                  formik.errors.deliveryChallanItemsJson?.[
                                    index
                                  ]?.discount
                                  ? "is-invalid"
                                  : ""
                                  }`}
                                {...formik.getFieldProps(
                                  `deliveryChallanItemsJson[${index}].discount`
                                )}
                                onChange={(e) => {
                                  const discount =
                                    parseInt(e.target.value, 10) || 0;
                                  // handleQuantityChange(index, `deliveryChallanItemsJson[${index}].quantity`, discount);
                                  handleQuantityChange(index, formik.values.deliveryChallanItemsJson[index].quantity, discount);
                                  formik.handleChange(e);
                                }}
                              />
                              {formik.touched.deliveryChallanItemsJson?.[
                                index
                              ]?.discount &&
                                formik.errors.deliveryChallanItemsJson?.[
                                  index
                                ]?.discount && (
                                  <div className="invalid-feedback">
                                    {
                                      formik.errors.deliveryChallanItemsJson[
                                        index
                                      ].discount
                                    }
                                  </div>
                                )}
                            </td>
                            <td>
                              <input
                                type="text"
                                name={`deliveryChallanItemsJson[${index}].amount`}
                                className={`form-control ${formik.touched.deliveryChallanItemsJson?.[
                                  index
                                ]?.amount &&
                                  formik.errors.deliveryChallanItemsJson?.[
                                    index
                                  ]?.amount
                                  ? "is-invalid"
                                  : ""
                                  }`}
                                {...formik.getFieldProps(
                                  `deliveryChallanItemsJson[${index}].amount`
                                )}
                                readOnly
                              />
                              {formik.touched.deliveryChallanItemsJson?.[
                                index
                              ]?.amount &&
                                formik.errors.deliveryChallanItemsJson?.[
                                  index
                                ]?.amount && (
                                  <div className="invalid-feedback">
                                    {
                                      formik.errors.deliveryChallanItemsJson[
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
                {formik.values.deliveryChallanItemsJson.length > 1 && (
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
                  style={{ border: "1px solid lightgrey" }}
                >
                  <div className="row mb-3 mt-2">
                    <label className="col-sm-4 col-form-label">Sub Total</label>
                    <div className="col-sm-4"></div>
                    <div className="col-sm-4">
                      <input
                        type="text"
                        className={`form-control ${formik.touched.subTotal && formik.errors.subTotal ? "is-invalid" : ""}`}
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
                      className={`form-control  ${formik.touched.termsConditions &&
                        formik.errors.termsConditions
                        ? "is-invalid"
                        : ""
                        }`}
                      rows="4"
                      {...formik.getFieldProps("termsConditions")}
                    />
                    {formik.touched.termsConditions &&
                      formik.errors.termsConditions && (
                        <div className="invalid-feedback">
                          {formik.errors.termsConditions}
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

export default ChellanAdd;
