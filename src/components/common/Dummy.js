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
    modeOfAdjustment: Yup.string().required("*Mode of Adjustment is required"),
    date: Yup.string().required("*Date is required"),
    accountId: Yup.string().required("*Account is required"),
    reason: Yup.string().required("*Reason is required"), 
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
          navigate("/inventoryAdjustment");
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
        const rest = response.data;

        const formattedData = {
          ...rest,
          date: rest.date
            ? new Date(rest.date).toISOString().split("T")[0]
            : undefined,
        };
        formik.setValues(formattedData);
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
                    checked={formik.values.modeOfAdjustment === "Quantity Adjustment"}
                  />
                  <label className="form-check-label">Quantity Adjustment</label>
                </div>
                <div className="form-check form-check-inline">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="modeOfAdjustment"
                    id="Value Adjustment"
                    value="Value Adjustment"
                    onChange={formik.handleChange}
                    checked={formik.values.modeOfAdjustment === "Value Adjustment"}
                  />
                  <label className="form-check-label">Value Adjustment</label>
                </div>
                {formik.errors.modeOfAdjustment && formik.touched.modeOfAdjustment && (
                  <div className="text-danger" style={{ fontSize: ".875em" }}>
                    {formik.errors.modeOfAdjustment}
                  </div>
                )}
              </div>
              <div className="col-md-6 col-12 mb-2">
                <lable className="form-lable">
                  Reference Number
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
                <lable className="form-lable">
                  Descending of Adjustment
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

          </div>
        </div>
      </form>
    </div>
  );
};

export default InventoryAdjustmentEdit;


// In edit page, I am getting "getAllInventoryAdjustmentsById" data as "referenceNumber" and "updateInventoryAdjustments" data as "reference_number" . How to write the payload for it.