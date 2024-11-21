import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import api from "../../../../config/URL";
import toast from "react-hot-toast";

const InventoryAdjustmentAdd = () => {
  const navigate = useNavigate();
  const [loading, setLoadIndicator] = useState(false);
  const [itemData, setItemData] = useState(null);

  const validationSchema = Yup.object({
    modeOfAdjustment: Yup.string().required("*Mode of Adjustment is required"),
    date: Yup.string().required("*Date is required"),
    accountId: Yup.string().required("*Account is required"),
    reasonId: Yup.string().required("*Reason is required"),
    quantityAdjustmentItems: Yup.array().of(
      Yup.object().shape({
        item: Yup.string().required("*Item is required"),
      })
    ),
  });

  const formik = useFormik({
    initialValues: {
      modeOfAdjustment: "Quantity Adjustment",
      referenceNumber: "",
      date: "",
      reasonId: "",
      descOfAdjustment: "",
      inventoryAdjustmentsFile: null,
      accountId: "",
      quantityAdjustmentItems: [
        {
          item: "",
          qty: "",
          price: "",
          disc: "",
          taxRate: "",
          amount: "",
        },
      ],
      valueAdjustmentItems: [
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

  const AddRowContent = () => {
    formik.setFieldValue("quantityAdjustmentItems", [
      ...formik.values.quantityAdjustmentItems,
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
    if (formik.values.quantityAdjustmentItems.length === 1) {
      return;
    }
    const updatedRows = [...formik.values.quantityAdjustmentItems];
    updatedRows.pop();
    formik.setFieldValue("quantityAdjustmentItems", updatedRows);
  };

  const AddValueRow = () => {
    formik.setFieldValue("valueAdjustmentItems", [
      ...formik.values.valueAdjustmentItems,
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

  const deleteValueRow = (index) => {
    if (formik.values.valueAdjustmentItems.length === 1) {
      return;
    }
    const updatedRows = [...formik.values.valueAdjustmentItems];
    updatedRows.pop();
    formik.setFieldValue("valueAdjustmentItems", updatedRows);
  };

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
                  <select
                    name="accountId"
                    className={`form-select form-select-sm  ${
                      formik.touched.accountId && formik.errors.accountId
                        ? "is-invalid"
                        : ""
                    }`}
                    {...formik.getFieldProps("accountId")}
                  >
                    <option selected></option>
                    <option value="1">Cost of Goods Sold</option>
                    <option value="2">Materials</option>
                    <option value="3">Petty Cash</option>
                  </select>
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
                  <select
                    name="reasonId"
                    className={`form-select form-select-sm  ${
                      formik.touched.reasonId && formik.errors.reasonId
                        ? "is-invalid"
                        : ""
                    }`}
                    {...formik.getFieldProps("reasonId")}
                  >
                    <option selected></option>
                    <option value="1">Invaild proof</option>
                    <option value="2">Stock on fire</option>
                    <option value="3">Stolen goods</option>
                  </select>
                  {formik.touched.reasonId && formik.errors.reasonId && (
                    <div className="invalid-feedback">
                      {formik.errors.reasonId}
                    </div>
                  )}
                </div>
              </div>
              <div className="col-md-6 col-12 mb-2">
                <lable className="form-lable">
                  Warehouse Name<span className="text-danger">*</span>
                </lable>
                <div className="mb-3">
                  <select
                    name="wareHouseId"
                    className={`form-select form-select-sm  ${
                      formik.touched.wareHouseId && formik.errors.wareHouseId
                        ? "is-invalid"
                        : ""
                    }`}
                    {...formik.getFieldProps("wareHouseId")}
                  >
                    <option value="ECS Cloud Infotech" selected>
                      ECS Cloud Infotech
                    </option>
                    <option value="Cloud ECS">Cloud ECS</option>
                    <option value="ECS Cloud">ECS Cloud</option>
                  </select>
                  {formik.touched.wareHouseId && formik.errors.wareHouseId && (
                    <div className="invalid-feedback">
                      {formik.errors.wareHouseId}
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
            {formik.values.modeOfAdjustment === "Quantity Adjustment" && (
              <>
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
                          <th style={{ width: "20%" }}>Quantity Available</th>
                          <th style={{ width: "20%" }}>New Quantity on hand</th>
                          <th style={{ width: "20%" }}>Quantity Adjusted</th>
                        </tr>
                      </thead>
                      <tbody>
                        {formik.values.quantityAdjustmentItems?.map(
                          (item, index) => (
                            <tr key={index}>
                              <td>
                                <select
                                  name={`quantityAdjustmentItems[${index}].item`}
                                  {...formik.getFieldProps(
                                    `quantityAdjustmentItems[${index}].item`
                                  )}
                                  className={`form-select ${
                                    formik.touched.quantityAdjustmentItems?.[
                                      index
                                    ]?.item &&
                                    formik.errors.quantityAdjustmentItems?.[
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
                                        {itemId.name}
                                      </option>
                                    ))}
                                </select>
                                {formik.touched.quantityAdjustmentItems?.[index]
                                  ?.item &&
                                  formik.errors.quantityAdjustmentItems?.[index]
                                    ?.item && (
                                    <div className="invalid-feedback">
                                      {
                                        formik.errors.quantityAdjustmentItems[
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
                                  name={`quantityAdjustmentItems[${index}].qty`}
                                  className={`form-control ${
                                    formik.touched.quantityAdjustmentItems?.[
                                      index
                                    ]?.qty &&
                                    formik.errors.quantityAdjustmentItems?.[
                                      index
                                    ]?.qty
                                      ? "is-invalid"
                                      : ""
                                  }`}
                                  {...formik.getFieldProps(
                                    `quantityAdjustmentItems[${index}].qty`
                                  )}
                                />
                                {formik.touched.quantityAdjustmentItems?.[index]
                                  ?.qty &&
                                  formik.errors.quantityAdjustmentItems?.[index]
                                    ?.qty && (
                                    <div className="invalid-feedback">
                                      {
                                        formik.errors.quantityAdjustmentItems[
                                          index
                                        ].qty
                                      }
                                    </div>
                                  )}
                              </td>
                              <td>
                                <input
                                  type="text"
                                  name={`quantityAdjustmentItems[${index}].price`}
                                  className={`form-control ${
                                    formik.touched.quantityAdjustmentItems?.[
                                      index
                                    ]?.price &&
                                    formik.errors.quantityAdjustmentItems?.[
                                      index
                                    ]?.price
                                      ? "is-invalid"
                                      : ""
                                  }`}
                                  {...formik.getFieldProps(
                                    `quantityAdjustmentItems[${index}].price`
                                  )}
                                />
                                {formik.touched.quantityAdjustmentItems?.[index]
                                  ?.price &&
                                  formik.errors.quantityAdjustmentItems?.[index]
                                    ?.price && (
                                    <div className="invalid-feedback">
                                      {
                                        formik.errors.quantityAdjustmentItems[
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
                                  name={`quantityAdjustmentItems[${index}].disc`}
                                  className={`form-control ${
                                    formik.touched.quantityAdjustmentItems?.[
                                      index
                                    ]?.disc &&
                                    formik.errors.quantityAdjustmentItems?.[
                                      index
                                    ]?.disc
                                      ? "is-invalid"
                                      : ""
                                  }`}
                                  {...formik.getFieldProps(
                                    `quantityAdjustmentItems[${index}].disc`
                                  )}
                                />
                                {formik.touched.quantityAdjustmentItems?.[index]
                                  ?.disc &&
                                  formik.errors.quantityAdjustmentItems?.[index]
                                    ?.disc && (
                                    <div className="invalid-feedback">
                                      {
                                        formik.errors.quantityAdjustmentItems[
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
              </>
            )}

            {formik.values.modeOfAdjustment === "Value Adjustment" && (
              <>
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
                          <th style={{ width: "20%" }}>Current Value</th>
                          <th style={{ width: "20%" }}>Changed Value</th>
                          <th style={{ width: "20%" }}>Adjusted Vaule</th>
                        </tr>
                      </thead>
                      <tbody>
                        {formik.values.valueAdjustmentItems?.map(
                          (item, index) => (
                            <tr key={index}>
                              <td>
                                <select
                                  name={`valueAdjustmentItems[${index}].item`}
                                  {...formik.getFieldProps(
                                    `valueAdjustmentItems[${index}].item`
                                  )}
                                  className={`form-select ${
                                    formik.touched.valueAdjustmentItems?.[index]
                                      ?.item &&
                                    formik.errors.valueAdjustmentItems?.[index]
                                      ?.item
                                      ? "is-invalid"
                                      : ""
                                  }`}
                                >
                                  <option selected> </option>
                                  {itemData &&
                                    itemData.map((itemId) => (
                                      <option key={itemId.id} value={itemId.id}>
                                        {itemId.name}
                                      </option>
                                    ))}
                                </select>
                                {formik.touched.valueAdjustmentItems?.[index]
                                  ?.item &&
                                  formik.errors.valueAdjustmentItems?.[index]
                                    ?.item && (
                                    <div className="invalid-feedback">
                                      {
                                        formik.errors.valueAdjustmentItems[
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
                                  name={`valueAdjustmentItems[${index}].qty`}
                                  className={`form-control ${
                                    formik.touched.valueAdjustmentItems?.[index]
                                      ?.qty &&
                                    formik.errors.valueAdjustmentItems?.[index]
                                      ?.qty
                                      ? "is-invalid"
                                      : ""
                                  }`}
                                  {...formik.getFieldProps(
                                    `valueAdjustmentItems[${index}].qty`
                                  )}
                                />
                                {formik.touched.valueAdjustmentItems?.[index]
                                  ?.qty &&
                                  formik.errors.valueAdjustmentItems?.[index]
                                    ?.qty && (
                                    <div className="invalid-feedback">
                                      {
                                        formik.errors.valueAdjustmentItems[
                                          index
                                        ].qty
                                      }
                                    </div>
                                  )}
                              </td>
                              <td>
                                <input
                                  type="text"
                                  name={`valueAdjustmentItems[${index}].price`}
                                  className={`form-control ${
                                    formik.touched.valueAdjustmentItems?.[index]
                                      ?.price &&
                                    formik.errors.valueAdjustmentItems?.[index]
                                      ?.price
                                      ? "is-invalid"
                                      : ""
                                  }`}
                                  {...formik.getFieldProps(
                                    `valueAdjustmentItems[${index}].price`
                                  )}
                                />
                                {formik.touched.valueAdjustmentItems?.[index]
                                  ?.price &&
                                  formik.errors.valueAdjustmentItems?.[index]
                                    ?.price && (
                                    <div className="invalid-feedback">
                                      {
                                        formik.errors.valueAdjustmentItems[
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
                                  name={`valueAdjustmentItems[${index}].disc`}
                                  className={`form-control ${
                                    formik.touched.valueAdjustmentItems?.[index]
                                      ?.disc &&
                                    formik.errors.valueAdjustmentItems?.[index]
                                      ?.disc
                                      ? "is-invalid"
                                      : ""
                                  }`}
                                  {...formik.getFieldProps(
                                    `valueAdjustmentItems[${index}].disc`
                                  )}
                                />
                                {formik.touched.valueAdjustmentItems?.[index]
                                  ?.disc &&
                                  formik.errors.valueAdjustmentItems?.[index]
                                    ?.disc && (
                                    <div className="invalid-feedback">
                                      {
                                        formik.errors.valueAdjustmentItems[
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
                    onClick={AddValueRow}
                  >
                    Add row
                  </button>
                  {formik.values.valueAdjustmentItems?.length > 1 && (
                    <button
                    type="button"
                      className="btn btn-sm my-4 mx-1 delete border-danger bg-white text-danger"
                      onClick={deleteValueRow}
                    >
                      Delete
                    </button>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </form>
    </div>
  );
};

export default InventoryAdjustmentAdd;
