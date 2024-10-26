import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import api from "../../../../config/URL";
import toast from "react-hot-toast";

const InventoryAdjustmentEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoadIndicator] = useState(false);
  const [itemData, setItemData] = useState(null);

  const validationSchema = Yup.object({
    date: Yup.string().required("*Date is required"),
  });

  const formik = useFormik({
    initialValues: {
      modeOfAdjustment: "",
      reference_number: "",
      date: "",
      reason: "",
      descOfAdjustment: "",
      inventoryAdjustmentsFile: null,
      accountId: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      setLoadIndicator(true);
      console.log(values);

      const payload = {
        ...values,
        reference_number: Number(values.reference_number) || 0,
        accountId: Number(values.accountId) || 0,
      };
      // const formData = new FormData();
      // // Append each value to the FormData instance
      // for (const key in values) {
      //   if (values.hasOwnProperty(key)) {
      //     formData.append(key, values[key]);
      //   }
      // }
      try {
        const response = await api.put(
          `updateInventoryAdjustments/${id}`,
          payload,
          {
            // headers: {
            //   'Content-Type': 'multipart/form-data',
            // },
          }
        );

        if (response.status === 201) {
          toast.success(response.data.message);
          navigate("/inventoryAdjustments");
        } else {
          toast.error(response.data.message);
        }
      } catch (e) {
        toast.error("Error fetching data: " + e?.response?.data?.message);
      } finally {
        setLoadIndicator(false);
      }
    },
  });

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await api.get(`getAllInventoryAdjustmentsById/${id}`);
        formik.setValues(response.data);
      } catch (error) {
        toast.error(error.message);
      }
    };
    getData();
  }, [id]);

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
      ...(formik.values.txnInvoiceOrderItemsModels || []),
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
                    Edit Inventory Adjustment
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
              <div className="col-md-6 col-12 mb-2">
                <lable className="form-lable">
                  Mode Of Adjustment <span className="text-danger">*</span>
                </lable>
                <div className="mb-3">
                  <input
                    type="text"
                    name="modeOfAdjustment"
                    className={`form-control ${
                      formik.touched.modeOfAdjustment &&
                      formik.errors.modeOfAdjustment
                        ? "is-invalid"
                        : ""
                    }`}
                    {...formik.getFieldProps("modeOfAdjustment")}
                  />
                  {formik.touched.modeOfAdjustment &&
                    formik.errors.modeOfAdjustment && (
                      <div className="invalid-feedback">
                        {formik.errors.modeOfAdjustment}
                      </div>
                    )}
                </div>
              </div>
              <div className="col-md-6 col-12 mb-2">
                <lable className="form-lable">
                  Reference Number<span className="text-danger">*</span>
                </lable>
                <div className="mb-3">
                  <input
                    type="text"
                    name="reference_number"
                    className={`form-control  ${
                      formik.touched.reference_number &&
                      formik.errors.reference_number
                        ? "is-invalid"
                        : ""
                    }`}
                    {...formik.getFieldProps("reference_number")}
                  />
                  {formik.touched.reference_number &&
                    formik.errors.reference_number && (
                      <div className="invalid-feedback">
                        {formik.errors.reference_number}
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
                  Account Id<span className="text-danger">*</span>
                </lable>
                <div className="mb-3">
                  <input
                    type="text"
                    name="email"
                    className={`form-control  ${
                      formik.touched.email && formik.errors.email
                        ? "is-invalid"
                        : ""
                    }`}
                    {...formik.getFieldProps("email")}
                  />
                  {formik.touched.email && formik.errors.email && (
                    <div className="invalid-feedback">
                      {formik.errors.email}
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
                <lable className="form-lable">
                  Descending Of Adjustment<span className="text-danger">*</span>
                </lable>
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
                <label className="form-label">
                  Inventory Adjustment File
                  <span className="text-danger">*</span>
                </label>
                <div className="mb-3">
                  <input
                    type="file"
                    name="inventoryAdjustmentsFile"
                    className={`form-control ${
                      formik.touched.inventoryAdjustmentsFile &&
                      formik.errors.inventoryAdjustmentsFile
                        ? "is-invalid"
                        : ""
                    }`}
                    onChange={(event) => {
                      // Manually handle the file selection
                      formik.setFieldValue(
                        "inventoryAdjustmentsFile",
                        event.currentTarget.files[0]
                      );
                    }}
                  />
                  {formik.touched.inventoryAdjustmentsFile &&
                    formik.errors.inventoryAdjustmentsFile && (
                      <div className="invalid-feedback">
                        {formik.errors.inventoryAdjustmentsFile}
                      </div>
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

export default InventoryAdjustmentEdit;
