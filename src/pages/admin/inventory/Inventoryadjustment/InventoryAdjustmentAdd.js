import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import api from "../../../../config/URL";
import toast from "react-hot-toast";
import InventoryAdjustment from "./InventoryAdjustment";

const InventoryAdjustmentAdd = () => {
  const navigate = useNavigate();
  const [loading, setLoadIndicator] = useState(false);
  const [itemData, setItemData] = useState(null);

  const validationSchema = Yup.object({
    modeOfAdjustment: Yup.string().required("*Mode of Adjustment is required"),
    date: Yup.string().required("*Date is required"),
    accountId: Yup.string().required("*Account is required"),
    reason: Yup.string().required("*Reason is required"),
  });

  const formik = useFormik({
    initialValues: {
      modeOfAdjustment: "",
      referenceNumber: "",
      date: "",
      reason: "",
      descOfAdjustment: "",
      inventoryAdjustmentsFile: null,
      accountId: "",
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
      console.log(values);
      // const payload = {
      //   ...values,
      //   reference_number: Number(values.reference_number) || 0,
      //   accountId: Number(values.accountId) || 0,
      // };

      // const formData = new FormData();
      // // Append each value to the FormData instance
      // for (const key in values) {
      //   if (values.hasOwnProperty(key)) {
      //     formData.append(key, values[key]);
      //   }
      // }

      const formData = new FormData();
      formData.append("modeOfAdjustment", values.modeOfAdjustment);
      formData.append("referenceNumber", values.referenceNumber);
      formData.append("date", values.date);
      formData.append("accountId", values.accountId);
      formData.append("reason", values.reason);
      formData.append("descOfAdjustment", values.descOfAdjustment);
      formData.append("file", values.file);
      try {
        const response = await api.post("createInventoryAdjustment", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        if (response.status === 201) {
          toast.success(response.data.message);
          navigate("/inventoryadjustment");
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

  // useEffect(() => {
  //   const updateAndCalculate = async () => {
  //     try {
  //       let totalRate = 0;
  //       let totalAmount = 0;
  //       let totalTax = 0;
  //       let discAmount = 0;
  //       const updatedItems = await Promise.all(
  //         formik.values.txnInvoiceOrderItemsModels.map(async (item, index) => {
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
  //         txnInvoiceOrderItemsModels: updatedItems,
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
  //   formik.values.txnInvoiceOrderItemsModels?.map((item) => item.qty).join(""),
  //   formik.values.txnInvoiceOrderItemsModels
  //     ?.map((item) => item.price)
  //     .join(""),
  //   formik.values.txnInvoiceOrderItemsModels?.map((item) => item.disc).join(""),
  //   formik.values.txnInvoiceOrderItemsModels
  //     ?.map((item) => item.taxRate)
  //     .join(""),
  // ]);

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
                    Add Inventory Adjustment
                  </h1>
                </div>
              </div>
              <div className="col-auto">
                <div className="hstack gap-2 justify-content-end">
                  <Link to="/inventoryadjustment">
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
          <div className="container mb-5">
            <div className="row py-4">
              <div className="col-md-6 col-12 mb-3">
                <div>
                  <label for="exampleFormControlInput1" className="form-label">
                    Mode of Adjustment<span className="text-danger">*</span>
                  </label>
                </div>
                <div className="form-check form-check-inline">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="modeOfAdjustment"
                    id="Quantity Adjustment"
                    value="Quantity Adjustment"
                    onChange={formik.handleChange}
                    checked={
                      formik.values.modeOfAdjustment === "Quantity Adjustment"
                    }
                  />
                  <label className="form-check-label">
                    Quantity Adjustment
                  </label>
                </div>
                <div className="form-check form-check-inline">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="modeOfAdjustment"
                    id="Value Adjustment"
                    value="Value Adjustment"
                    onChange={formik.handleChange}
                    checked={
                      formik.values.modeOfAdjustment === "Value Adjustment"
                    }
                  />
                  <label className="form-check-label">Value Adjustment</label>
                </div>
                {formik.errors.modeOfAdjustment &&
                  formik.touched.modeOfAdjustment && (
                    <div className="text-danger" style={{ fontSize: ".875em" }}>
                      {formik.errors.modeOfAdjustment}
                    </div>
                  )}
              </div>
              <div className="col-md-6 col-12 mb-2">
                <lable className="form-lable">Reference Number</lable>
                <div className="mb-3">
                  <input
                    type="text"
                    name="referenceNumber"
                    className={`form-control  ${
                      formik.touched.referenceNumber &&
                      formik.errors.referenceNumber
                        ? "is-invalid"
                        : ""
                    }`}
                    {...formik.getFieldProps("referenceNumber")}
                  />
                  {formik.touched.referenceNumber &&
                    formik.errors.referenceNumber && (
                      <div className="invalid-feedback">
                        {formik.errors.referenceNumber}
                      </div>
                    )}
                </div>
              </div>

              <div className="col-md-6 col-12 mb-2">
                <lable className="form-lable">
                  Date<span className="text-danger">*</span>
                </lable>
                <div className="mb-3">
                  <input
                    type="date"
                    name="date"
                    className={`form-control ${
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
              <div className="col-md-6 col-12 mb-2">
                <lable className="form-lable">
                  Account<span className="text-danger">*</span>
                </lable>
                <div className="mb-3">
                  <input
                    type="text"
                    name="accountId"
                    className={`form-control  ${
                      formik.touched.accountId && formik.errors.accountId
                        ? "is-invalid"
                        : ""
                    }`}
                    {...formik.getFieldProps("accountId")}
                  />
                  {formik.touched.accountId && formik.errors.accountId && (
                    <div className="invalid-feedback">
                      {formik.errors.accountId}
                    </div>
                  )}
                </div>
              </div>

              <div className="col-md-6 col-12 mb-2">
                <lable className="form-lable">
                  Reason<span className="text-danger">*</span>
                </lable>
                <div className="mb-3">
                  <input
                    type="text"
                    name="reason"
                    className={`form-control  ${
                      formik.touched.reason && formik.errors.reason
                        ? "is-invalid"
                        : ""
                    }`}
                    {...formik.getFieldProps("reason")}
                  />
                  {formik.touched.reason && formik.errors.reason && (
                    <div className="invalid-feedback">
                      {formik.errors.reason}
                    </div>
                  )}
                </div>
              </div>

              <div className="col-md-6 col-12 mb-2">
                <lable className="form-lable">Descending of Adjustment</lable>
                <div className="mb-3">
                  <input
                    type="text"
                    name="descOfAdjustment"
                    className={`form-control  ${
                      formik.touched.descOfAdjustment &&
                      formik.errors.descOfAdjustment
                        ? "is-invalid"
                        : ""
                    }`}
                    {...formik.getFieldProps("descOfAdjustment")}
                  />
                  {formik.touched.descOfAdjustment &&
                    formik.errors.descOfAdjustment && (
                      <div className="invalid-feedback">
                        {formik.errors.descOfAdjustment}
                      </div>
                    )}
                </div>
              </div>
              <div className="col-md-6 col-12 mb-2">
                <lable className="form-lable">Attach File</lable>
                <div className="mb-3">
                  <input
                    type="file"
                    className="form-control"
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
                      <th style={{ width: "15%" }}>
                        Item Details
                        <span className="text-danger text-center">*</span>
                      </th>
                      <th style={{ width: "10%" }}>Quantity Available</th>
                      <th style={{ width: "15%" }}>New Quantity on hand</th>
                      <th style={{ width: "15%" }}>Quantity Adjusted</th>
                    </tr>
                  </thead>
                  <tbody>
                    {formik.values.txnInvoiceOrderItemsModels?.map(
                      (item, index) => (
                        <tr key={index}>
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
                            {formik.touched.txnInvoiceOrderItemsModels?.[index]
                              ?.item &&
                              formik.errors.txnInvoiceOrderItemsModels?.[index]
                                ?.item && (
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
                                event.target.value = event.target.value.replace(
                                  /[^0-9]/g,
                                  ""
                                );
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
                            {formik.touched.txnInvoiceOrderItemsModels?.[index]
                              ?.qty &&
                              formik.errors.txnInvoiceOrderItemsModels?.[index]
                                ?.qty && (
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
                            {formik.touched.txnInvoiceOrderItemsModels?.[index]
                              ?.price &&
                              formik.errors.txnInvoiceOrderItemsModels?.[index]
                                ?.price && (
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
                            {formik.touched.txnInvoiceOrderItemsModels?.[index]
                              ?.disc &&
                              formik.errors.txnInvoiceOrderItemsModels?.[index]
                                ?.disc && (
                                <div className="invalid-feedback">
                                  {
                                    formik.errors.txnInvoiceOrderItemsModels[
                                      index
                                    ].disc
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
              {formik.values.txnInvoiceOrderItemsModels?.length > 1 && (
                <button
                  className="btn btn-sm my-4 mx-1 delete border-danger bg-white text-danger"
                  onClick={deleteRow}
                >
                  Delete
                </button>
              )}
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default InventoryAdjustmentAdd;
