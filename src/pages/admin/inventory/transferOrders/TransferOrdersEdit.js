import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import ItemList from "../../../list/ItemList";

const TransferOrdersEdit = () => {
  // const {id} = useParams;
  const navigate = useNavigate();
  const [loading, setLoadIndicator] = useState(false);
  const [itemData, setItemData] = useState(null);

  const validationSchema = Yup.object({
    transferOrder: Yup.string().required("*Transfer Order is required"),
    sourceWarehouse: Yup.string().required("*Source Warehouse is required"),
    destinationWarehouse: Yup.string().required(
      "*Destination Warehouse is required"
    ),
    attachFile: Yup.mixed().nullable().required("*File is required"),
    quantityAdjustmentItems: Yup.array().of(
      Yup.object().shape({
        itemId: Yup.string().required("*Item Details is required"),
        quantityAvailable: Yup.string(),
        quantityOnHand: Yup.string(),
        quantityAdjusted: Yup.string(),
      })
    ),
  });

  const formik = useFormik({
    initialValues: {
      transferOrder: "",
      date: "",
      reason: "",
      sourceWarehouse: "",
      destinationWarehouse: "",
      attachFile: null,
      quantityAdjustmentItems: [
        {
          itemId: "",
          quantityAvailable: "",
          quantityOnHand: "",
          quantityAdjusted: "",
        },
      ],
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      setLoadIndicator(true);
      console.log(values);
      setLoadIndicator(false);
      navigate("/transferOrder");
    },
  });

  const AddRowContent = () => {
    formik.setFieldValue("quantityAdjustmentItems", [
      ...formik.values.quantityAdjustmentItems,
      {
        itemId: "",
        quantityAvailable: "",
        quantityOnHand: "",
        quantityAdjusted: "",
      },
    ]);
  };

  const deleteRow = (index) => {
    if (formik.values.quantityAdjustmentItems.length === 1) {
      return;
    }
    const updatedRows = [...formik.values.quantityAdjustmentItems];
    updatedRows.pop();
    formik.setFieldValue("quantityAdjustmentItems", updatedRows);
  };

  const getItemName = async () => {
    try {
      const fetchData = await ItemList();
      setItemData(fetchData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    getItemName();
  }, []);

  return (
    <div className="container-fluid px-2 minHeight m-0">
      <form onSubmit={formik.handleSubmit}>
        <div
          className="card shadow border-0 mb-2 sticky-top"
          style={{ borderRadius: "0", top: "66px" }}
        >
          <div className="container-fluid py-4">
            <div className="row align-items-center">
              <div className="col">
                <div className="d-flex align-items-center gap-4">
                  <h1 className="h4 ls-tight headingColor">
                    Edit Transfer Order
                  </h1>
                </div>
              </div>
              <div className="col-auto">
                <div className="hstack gap-2">
                  <Link to="/transferOrder">
                    <button type="button" className="btn btn-sm btn-light">
                      Back
                    </button>
                  </Link>
                  <button
                    type="submit"
                    className="btn btn-sm btn-primary"
                    disabled={loading}
                  >
                    {loading ? (
                      <span className="spinner-border spinner-border-sm" />
                    ) : (
                      "Update"
                    )}
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
              <div className="col-md-6 mb-3">
                <label className="form-label">Transfer Order</label>
                <span className="text-danger">*</span>
                <input
                  type="text"
                  className={`form-control form-control-sm ${
                    formik.touched.transferOrder && formik.errors.transferOrder
                      ? "is-invalid"
                      : ""
                  }`}
                  {...formik.getFieldProps("transferOrder")}
                />
                {formik.touched.transferOrder &&
                  formik.errors.transferOrder && (
                    <div className="invalid-feedback">
                      {formik.errors.transferOrder}
                    </div>
                  )}
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label">Date</label>
                <input
                  type="date"
                  className={`form-control form-control-sm ${
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
              <div className="col-md-6 mb-3">
                <label className="form-label">Source Warehouse</label>
                <span className="text-danger">*</span>
                <select
                  type="text"
                  className={`form-select form-select-sm ${
                    formik.touched.sourceWarehouse &&
                    formik.errors.sourceWarehouse
                      ? "is-invalid"
                      : ""
                  }`}
                  {...formik.getFieldProps("sourceWarehouse")}
                >
                  <option selected></option>
                  <option value="1">ECS Cloud</option>
                  <option value="2">Cloud ECS</option>
                </select>
                {formik.touched.sourceWarehouse &&
                  formik.errors.sourceWarehouse && (
                    <div className="invalid-feedback">
                      {formik.errors.sourceWarehouse}
                    </div>
                  )}
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label">Destination Warehouse</label>
                <span className="text-danger">*</span>
                <select
                  type="text"
                  className={`form-select form-select-sm ${
                    formik.touched.destinationWarehouse &&
                    formik.errors.destinationWarehouse
                      ? "is-invalid"
                      : ""
                  }`}
                  {...formik.getFieldProps("destinationWarehouse")}
                >
                  <option selected></option>
                  <option value="1">ECS Cloud</option>
                  <option value="2">Cloud ECS</option>
                </select>
                {formik.touched.destinationWarehouse &&
                  formik.errors.destinationWarehouse && (
                    <div className="invalid-feedback">
                      {formik.errors.destinationWarehouse}
                    </div>
                  )}
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
                    onBlur={formik.handleBlur}
                  />
                  {formik.touched.attachFile && formik.errors.attachFile && (
                    <div className="invalid-feedback">
                      {formik.errors.attachFile}
                    </div>
                  )}
                </div>
              </div>
              <div className="col-md-6 col-12 mb-2">
                <lable className="form-lable">Reason</lable>
                <div className="mb-3">
                  <textarea
                    type="text"
                    name="reason"
                    className={`form-control  ${
                      formik.touched.reason && formik.errors.reason
                        ? "is-invalid"
                        : ""
                    }`}
                    rows="4"
                    {...formik.getFieldProps("reason")}
                  />
                  {formik.touched.reason && formik.errors.reason && (
                    <div className="invalid-feedback">
                      {formik.errors.reason}
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
                      <th style={{ width: "40%" }}>
                        Item Details
                        <span className="text-danger text-center">*</span>
                      </th>
                      <th style={{ width: "20%" }}>Source Stock</th>
                      <th style={{ width: "20%" }}>Destination Stock</th>
                      <th style={{ width: "20%" }}>Transfer Quantity</th>
                    </tr>
                  </thead>
                  <tbody>
                    {formik.values.quantityAdjustmentItems?.map(
                      (item, index) => (
                        <tr key={index}>
                          <td>
                            <select
                              name={`quantityAdjustmentItems[${index}].itemId`}
                              {...formik.getFieldProps(
                                `quantityAdjustmentItems[${index}].itemId`
                              )}
                              className={`form-select ${
                                formik.touched.quantityAdjustmentItems?.[index]
                                  ?.itemId &&
                                formik.errors.quantityAdjustmentItems?.[index]
                                  ?.itemId
                                  ? "is-invalid"
                                  : ""
                              }`}
                            >
                              <option selected> </option>
                              {itemData &&
                                itemData.map((item) => (
                                  <option key={item.id} value={item.id}>
                                    {item.name}
                                  </option>
                                ))}
                            </select>
                            {formik.touched.quantityAdjustmentItems?.[index]
                              ?.itemId &&
                              formik.errors.quantityAdjustmentItems?.[index]
                                ?.itemId && (
                                <div className="invalid-feedback">
                                  {
                                    formik.errors.quantityAdjustmentItems[index]
                                      .itemId
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
                              name={`quantityAdjustmentItems[${index}].quantityAvailable`}
                              className={`form-control ${
                                formik.touched.quantityAdjustmentItems?.[index]
                                  ?.quantityAvailable &&
                                formik.errors.quantityAdjustmentItems?.[index]
                                  ?.quantityAvailable
                                  ? "is-invalid"
                                  : ""
                              }`}
                              {...formik.getFieldProps(
                                `quantityAdjustmentItems[${index}].quantityAvailable`
                              )}
                              readOnly
                            />
                            {formik.touched.quantityAdjustmentItems?.[index]
                              ?.quantityAvailable &&
                              formik.errors.quantityAdjustmentItems?.[index]
                                ?.quantityAvailable && (
                                <div className="invalid-feedback">
                                  {
                                    formik.errors.quantityAdjustmentItems[index]
                                      .quantityAvailable
                                  }
                                </div>
                              )}
                          </td>
                          <td>
                            <input
                              type="text"
                              name={`quantityAdjustmentItems[${index}].quantityOnHand`}
                              className={`form-control ${
                                formik.touched.quantityAdjustmentItems?.[index]
                                  ?.quantityOnHand &&
                                formik.errors.quantityAdjustmentItems?.[index]
                                  ?.quantityOnHand
                                  ? "is-invalid"
                                  : ""
                              }`}
                              {...formik.getFieldProps(
                                `quantityAdjustmentItems[${index}].quantityOnHand`
                              )}
                              readOnly
                            />
                            {formik.touched.quantityAdjustmentItems?.[index]
                              ?.quantityOnHand &&
                              formik.errors.quantityAdjustmentItems?.[index]
                                ?.quantityOnHand && (
                                <div className="invalid-feedback">
                                  {
                                    formik.errors.quantityAdjustmentItems[index]
                                      .quantityOnHand
                                  }
                                </div>
                              )}
                          </td>
                          <td>
                            <input
                              onInput={(event) => {
                                const inputValue = event.target.value
                                  .replace(/[^-0-9]/g, "")
                                  .replace(/(?!^)-/g, "");

                                event.target.value = inputValue;
                              }}
                              type="text"
                              name={`quantityAdjustmentItems[${index}].quantityAdjusted`}
                              className={`form-control ${
                                formik.touched.quantityAdjustmentItems?.[index]
                                  ?.quantityAdjusted &&
                                formik.errors.quantityAdjustmentItems?.[index]
                                  ?.quantityAdjusted
                                  ? "is-invalid"
                                  : ""
                              }`}
                              {...formik.getFieldProps(
                                `quantityAdjustmentItems[${index}].quantityAdjusted`
                              )}
                            />
                            {formik.touched.quantityAdjustmentItems?.[index]
                              ?.quantityAdjusted &&
                              formik.errors.quantityAdjustmentItems?.[index]
                                ?.quantityAdjusted && (
                                <div className="invalid-feedback">
                                  {
                                    formik.errors.quantityAdjustmentItems[index]
                                      .quantityAdjusted
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
              {formik.values.quantityAdjustmentItems?.length > 1 && (
                <button
                  className="btn btn-sm my-4 mx-1 delete border-danger bg-white text-danger"
                  type="button"
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

export default TransferOrdersEdit;
