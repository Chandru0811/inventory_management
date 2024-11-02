import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import toast from "react-hot-toast";
import api from "../../../../config/URL";

const ItemsEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoadIndicator] = useState(false);
  const [data, setData] = useState([]);

  const validationSchema = Yup.object({
    name: Yup.string().required("*Name is required"),
    type: Yup.string().required("*Type is required"),
    itemUnit: Yup.string().required("*Item Unit is required"),
    sellingPrice: Yup.string().required("*Selling Price is required"),
    costPrice: Yup.string().required("*Cost Price is required"),
    salesAccount: Yup.string().required("*Sales Account is required"),
    purchaseAccount: Yup.string().required("*Purchase Account is required"),
    inventoryAccount: Yup.string().required("*Inventory Account is required"),
    weight: Yup.number().typeError("*Weight must be a number").nullable(),
    openingStock: Yup.number()
      .typeError("*Opening Stock must be a number")
      .nullable(),
    openingStockRate: Yup.number()
      .typeError("*Opening Stock Rate must be a number")
      .nullable(),
    sellingPrice: Yup.number()
      .typeError("*Selling Price must be a number")
      .nullable(),
    costPrice: Yup.number()
      .typeError("*Cost Price must be a number")
      .nullable(),
    stockKeepingUnit: Yup.number()
      .typeError("*Stock Keeping Unit must be a number")
      .nullable(),
    manufacturingPartNumber: Yup.number()
      .typeError("*Manufacturing Part Number must be a number")
      .nullable(),
    internationalArticleNumber: Yup.number()
      .typeError("*International Article Number must be a number")
      .nullable(),
    internationalStandardBookNumber: Yup.number()
      .typeError("*International Standard Book Number must be a number")
      .nullable(),
  });

  const formik = useFormik({
    initialValues: {
      name: "",
      type: "",
      stockKeepingUnit: "",
      itemUnit: "",
      dimensions: "",
      weight: "",
      manufacturerName: "",
      brandName: "",
      universalProductCode: "",
      manufacturingPartNumber: "",
      internationalArticleNumber: "",
      internationalStandardBookNumber: "",
      sellingPrice: "",
      costPrice: "",
      salesAccount: "",
      purchaseAccount: "",
      salesAccountDescription: "",
      purchaseAccountDescription: "",
      salesTax: "",
      purchaseTax: "",
      preferredVendor: "",
      inventoryAccount: "",
      openingStock: "",
      openingStockRate: "",
      reorderPoint: "",
      file: null,
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      setLoadIndicator(true);
      console.log(values);

      const formData = new FormData();
      formData.append("type", values.type);
      formData.append("name", values.name);
      formData.append("stockKeepingUnit", values.stockKeepingUnit);
      formData.append("itemUnit", values.itemUnit);
      formData.append("dimensions", values.dimensions);
      formData.append("weight", values.weight);
      formData.append("manufacturerName", values.manufacturerName);
      formData.append("brandName", values.brandName);
      formData.append("universalProductCode", values.universalProductCode);
      formData.append(
        "manufacturingPartNumber",
        values.manufacturingPartNumber
      );
      formData.append(
        "internationalArticleNumber",
        values.internationalArticleNumber
      );
      formData.append(
        "internationalStandardBookNumber",
        values.internationalStandardBookNumber
      );
      formData.append("sellingPrice", values.sellingPrice);
      formData.append("costPrice", values.costPrice);
      formData.append("salesAccount", values.salesAccount);
      formData.append("purchaseAccount  ", values.purchaseAccount || " ");
      formData.append(
        "salesAccountDescription",
        values.salesAccountDescription
      );
      formData.append(
        "purchaseAccountDescription",
        values.purchaseAccountDescription
      );
      formData.append("salesTax", values.salesTax);
      formData.append("purchaseTax", values.purchaseTax);
      formData.append("preferredVendor", values.preferredVendor);
      formData.append("inventoryAccount", values.inventoryAccount || "");
      formData.append("openingStock", values.openingStock);
      formData.append("openingStockRate", values.openingStockRate);
      formData.append("reorderPoint", values.reorderPoint);
      formData.append("file", values.file);

      try {
        const response = await api.put(`updateItem/${id}`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        if (response.status === 201) {
          toast.success(response.data.message);
          navigate("/item");
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
        const response = await api.get(`getItemsById/${id}`);
        formik.setValues(response.data);
        setData(response.data);
      } catch (error) {
        toast.error(error.message);
      }
    };
    getData();
  }, [id]);

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
                  <h1 className="h4 ls-tight headingColor">Edit Items</h1>
                </div>
              </div>
              <div className="col-auto">
                <div className="hstack gap-2 justify-content-end">
                  <Link to="/item">
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
          <div className="row mt-3 me-2">
            <div className="col-12 text-end"></div>
          </div>
          <div className="container mb-5">
            <div className="row py-4">
              <div className="col-md-6 col-12 mb-2">
                <lable className="form-lable">
                  Name<span className="text-danger">*</span>
                </lable>
                <div className="mb-3">
                  <input
                    type="text"
                    name="name"
                    className={`form-control ${
                      formik.touched.name && formik.errors.name
                        ? "is-invalid"
                        : ""
                    }`}
                    {...formik.getFieldProps("name")}
                  />
                  {formik.touched.name && formik.errors.name && (
                    <div className="invalid-feedback">{formik.errors.name}</div>
                  )}
                </div>
              </div>
              <div className="col-md-6 col-12 mb-3">
                <div>
                  <label for="exampleFormControlInput1" className="form-label">
                    Type<span className="text-danger">*</span>
                  </label>
                </div>
                <div className="form-check form-check-inline">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="type"
                    id="Goods"
                    value="Goods"
                    onChange={formik.handleChange}
                    checked={formik.values.type === "Goods"}
                  />
                  <label className="form-check-label">Goods</label>
                </div>
                <div className="form-check form-check-inline">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="type"
                    id="Service"
                    value="Service"
                    onChange={formik.handleChange}
                    checked={formik.values.type === "Service"}
                  />
                  <label className="form-check-label">Service</label>
                </div>
                {formik.errors.type && formik.touched.type && (
                  <div className="text-danger" style={{ fontSize: ".875em" }}>
                    {formik.errors.type}
                  </div>
                )}
              </div>

              <div className="col-md-6 col-12 mb-2">
                <lable className="form-lable">Stock Keeping Unit</lable>
                <div className="mb-3">
                  <input
                    type="text"
                    name="stockKeepingUnit"
                    className={`form-control ${
                      formik.touched.stockKeepingUnit &&
                      formik.errors.stockKeepingUnit
                        ? "is-invalid"
                        : ""
                    }`}
                    {...formik.getFieldProps("stockKeepingUnit")}
                  />
                  {formik.touched.stockKeepingUnit &&
                    formik.errors.stockKeepingUnit && (
                      <div className="invalid-feedback">
                        {formik.errors.stockKeepingUnit}
                      </div>
                    )}
                </div>
              </div>
              <div className="col-md-6 col-12 mb-2">
                <lable className="form-lable">Image</lable>
                <div className="mb-3">
                  <input
                    type="file"
                    accept=".jpg, .jpeg, .png"
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
                <img
                  src={data.itemImage}
                  className="img-fluid ms-2 w-50 rounded mt-2"
                  alt="Profile Image"
                />
              </div>
              <div className="col-md-6 col-12 mb-2">
                <lable className="form-lable">
                  Item Unit<span className="text-danger">*</span>
                </lable>
                <div className="mb-3">
                  <select
                    name="itemUnit"
                    className={`form-select  ${
                      formik.touched.itemUnit && formik.errors.itemUnit
                        ? "is-invalid"
                        : ""
                    }`}
                    {...formik.getFieldProps("itemUnit")}
                  >
                    <option value=""></option>
                    <option value="dz">DOZEN</option>
                    <option value="box">BOX</option>
                    <option value="g">GRAMS</option>
                    <option value="kg">KILOGRAMS</option>
                    <option value="m">METERS</option>
                    <option value="pcs">PIECES</option>
                  </select>
                  {formik.touched.itemUnit && formik.errors.itemUnit && (
                    <div className="invalid-feedback">
                      {formik.errors.itemUnit}
                    </div>
                  )}
                </div>
              </div>

              <div className="col-md-6 col-12 mb-2">
                <label className="form-label">Dimensions</label>
                <div className="input-group mb-3">
                  <input
                    type="text"
                    name="length"
                    placeholder="Length"
                    className={`form-control ${
                      formik.touched.length && formik.errors.length
                        ? "is-invalid"
                        : ""
                    }`}
                    {...formik.getFieldProps("length")}
                  />
                  <span className="input-group-text">x</span>

                  <input
                    type="text"
                    name="width"
                    placeholder="Width"
                    className={`form-control ${
                      formik.touched.width && formik.errors.width
                        ? "is-invalid"
                        : ""
                    }`}
                    {...formik.getFieldProps("width")}
                  />
                  <span className="input-group-text">x</span>

                  <input
                    type="text"
                    name="height"
                    placeholder="Height"
                    className={`form-control ${
                      formik.touched.height && formik.errors.height
                        ? "is-invalid"
                        : ""
                    }`}
                    {...formik.getFieldProps("height")}
                  />
                  <span className="input-group-text">cm</span>

                  {formik.touched.length && formik.errors.length && (
                    <div className="invalid-feedback">
                      {formik.errors.length}
                    </div>
                  )}
                  {formik.touched.width && formik.errors.width && (
                    <div className="invalid-feedback">
                      {formik.errors.width}
                    </div>
                  )}
                  {formik.touched.height && formik.errors.height && (
                    <div className="invalid-feedback">
                      {formik.errors.height}
                    </div>
                  )}
                </div>
              </div>

              <div className="col-md-6 col-12 mb-2">
                <label className="form-label">Weight</label>
                <div className="input-group mb-3">
                  <input
                    type="text"
                    name="weight"
                    className={`form-control ${
                      formik.touched.weight && formik.errors.weight
                        ? "is-invalid"
                        : ""
                    }`}
                    {...formik.getFieldProps("weight")}
                  />
                  <span className="input-group-text">kg</span>{" "}
                  {formik.touched.weight && formik.errors.weight && (
                    <div className="invalid-feedback">
                      {formik.errors.weight}
                    </div>
                  )}
                </div>
              </div>

              <div className="col-md-6 col-12 mb-2">
                <lable className="form-lable">Manufacturer Name</lable>
                <div className="mb-3">
                  <input
                    type="text"
                    name="manufacturerName"
                    className={`form-control  ${
                      formik.touched.manufacturerName &&
                      formik.errors.manufacturerName
                        ? "is-invalid"
                        : ""
                    }`}
                    {...formik.getFieldProps("manufacturerName")}
                  />
                  {formik.touched.manufacturerName &&
                    formik.errors.manufacturerName && (
                      <div className="invalid-feedback">
                        {formik.errors.manufacturerName}
                      </div>
                    )}
                </div>
              </div>

              <div className="col-md-6 col-12 mb-2">
                <lable className="form-lable">Brand Name</lable>
                <div className="mb-3">
                  <input
                    type="text"
                    name="brandName"
                    className={`form-control  ${
                      formik.touched.brandName && formik.errors.brandName
                        ? "is-invalid"
                        : ""
                    }`}
                    {...formik.getFieldProps("brandName")}
                  />
                  {formik.touched.brandName && formik.errors.brandName && (
                    <div className="invalid-feedback">
                      {formik.errors.brandName}
                    </div>
                  )}
                </div>
              </div>
              <div className="col-md-6 col-12 mb-2">
                <lable className="form-lable">Manufacturing Part Number</lable>
                <div className="mb-3">
                  <input
                    type="text"
                    name="manufacturingPartNumber"
                    className={`form-control  ${
                      formik.touched.manufacturingPartNumber &&
                      formik.errors.manufacturingPartNumber
                        ? "is-invalid"
                        : ""
                    }`}
                    {...formik.getFieldProps("manufacturingPartNumber")}
                  />
                  {formik.touched.manufacturingPartNumber &&
                    formik.errors.manufacturingPartNumber && (
                      <div className="invalid-feedback">
                        {formik.errors.manufacturingPartNumber}
                      </div>
                    )}
                </div>
              </div>
              <div className="col-md-6 col-12 mb-2">
                <lable className="form-lable">
                  Universal Product Code<span className="text-danger">*</span>
                </lable>
                <div className="mb-3">
                  <input
                    type="text"
                    name="universalProductCode"
                    className={`form-control  ${
                      formik.touched.universalProductCode &&
                      formik.errors.universalProductCode
                        ? "is-invalid"
                        : ""
                    }`}
                    {...formik.getFieldProps("universalProductCode")}
                  />
                  {formik.touched.universalProductCode &&
                    formik.errors.universalProductCode && (
                      <div className="invalid-feedback">
                        {formik.errors.universalProductCode}
                      </div>
                    )}
                </div>
              </div>
              <div className="col-md-6 col-12 mb-2">
                <lable className="form-lable">
                  International Article Number
                </lable>
                <div className="mb-3">
                  <input
                    type="text"
                    name="internationalArticleNumber"
                    className={`form-control  ${
                      formik.touched.internationalArticleNumber &&
                      formik.errors.internationalArticleNumber
                        ? "is-invalid"
                        : ""
                    }`}
                    {...formik.getFieldProps("internationalArticleNumber")}
                  />
                  {formik.touched.internationalArticleNumber &&
                    formik.errors.internationalArticleNumber && (
                      <div className="invalid-feedback">
                        {formik.errors.internationalArticleNumber}
                      </div>
                    )}
                </div>
              </div>
              <div className="col-md-6 col-12 mb-2">
                <lable className="form-lable">
                  International Standard Book Number
                </lable>
                <div className="mb-3">
                  <input
                    type="text"
                    name="internationalStandardBookNumber"
                    className={`form-control  ${
                      formik.touched.internationalStandardBookNumber &&
                      formik.errors.internationalStandardBookNumber
                        ? "is-invalid"
                        : ""
                    }`}
                    {...formik.getFieldProps("internationalStandardBookNumber")}
                  />
                  {formik.touched.internationalStandardBookNumber &&
                    formik.errors.internationalStandardBookNumber && (
                      <div className="invalid-feedback">
                        {formik.errors.internationalStandardBookNumber}
                      </div>
                    )}
                </div>
              </div>
              <div className="col-md-6 col-12 mb-2">
                <lable className="form-lable">
                  Inventory Account<span className="text-danger">*</span>
                </lable>
                <div className="mb-3">
                  <select
                    name="inventoryAccount"
                    className={`form-select  ${
                      formik.touched.inventoryAccount &&
                      formik.errors.inventoryAccount
                        ? "is-invalid"
                        : ""
                    }`}
                    {...formik.getFieldProps("inventoryAccount")}
                  >
                    <option value=""></option>
                    <option value="FinishedGoods">Finished Goods</option>
                    <option value="InventoryAsset">Inventory Asset</option>
                    <option value="WorkInProgress">Work In Progress</option>
                  </select>
                  {formik.touched.inventoryAccount &&
                    formik.errors.inventoryAccount && (
                      <div className="invalid-feedback">
                        {formik.errors.inventoryAccount}
                      </div>
                    )}
                </div>
              </div>
              <div className="col-md-6 col-12 mb-2">
                <lable className="form-lable">Opening Stock</lable>
                <div className="mb-3">
                  <input
                    type="text"
                    name="openingStock"
                    className={`form-control  ${
                      formik.touched.openingStock && formik.errors.openingStock
                        ? "is-invalid"
                        : ""
                    }`}
                    {...formik.getFieldProps("openingStock")}
                  />
                  {formik.touched.openingStock &&
                    formik.errors.openingStock && (
                      <div className="invalid-feedback">
                        {formik.errors.openingStock}
                      </div>
                    )}
                </div>
              </div>
              <div className="col-md-6 col-12 mb-2">
                <lable className="form-lable">
                  Opening Stock Rate per Unit
                </lable>
                <div className="mb-3">
                  <input
                    type="text"
                    name="openingStockRate"
                    className={`form-control  ${
                      formik.touched.openingStockRate &&
                      formik.errors.openingStockRate
                        ? "is-invalid"
                        : ""
                    }`}
                    {...formik.getFieldProps("openingStockRate")}
                  />
                  {formik.touched.openingStockRate &&
                    formik.errors.openingStockRate && (
                      <div className="invalid-feedback">
                        {formik.errors.openingStockRate}
                      </div>
                    )}
                </div>
              </div>
              <div className="col-md-6 col-12 mb-2">
                <lable className="form-lable">Preferred Vendor</lable>
                <div className="mb-3">
                  <input
                    type="text"
                    name="preferredVendor"
                    className={`form-control  ${
                      formik.touched.preferredVendor &&
                      formik.errors.preferredVendor
                        ? "is-invalid"
                        : ""
                    }`}
                    {...formik.getFieldProps("preferredVendor")}
                  />
                  {formik.touched.preferredVendor &&
                    formik.errors.preferredVendor && (
                      <div className="invalid-feedback">
                        {formik.errors.preferredVendor}
                      </div>
                    )}
                </div>
              </div>
              <div className="col-md-6 col-12 mb-2">
                <lable className="form-lable">Recorder points</lable>
                <div className="mb-3">
                  <input
                    type="text"
                    name="reorderPoint"
                    className={`form-control  ${
                      formik.touched.reorderPoint && formik.errors.reorderPoint
                        ? "is-invalid"
                        : ""
                    }`}
                    {...formik.getFieldProps("reorderPoint")}
                  />
                  {formik.touched.reorderPoint &&
                    formik.errors.reorderPoint && (
                      <div className="invalid-feedback">
                        {formik.errors.reorderPoint}
                      </div>
                    )}
                </div>
              </div>
              <div className="col-md-6 col-12 mb-2">
                <lable className="form-lable">
                  Status<span className="text-danger">*</span>
                </lable>
                <div className="mb-3">
                  <select
                    name="status"
                    className={`form-select  ${
                      formik.touched.status && formik.errors.status
                        ? "is-invalid"
                        : ""
                    }`}
                    {...formik.getFieldProps("status")}
                  >
                    <option value=""></option>
                    <option value="active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                  {formik.touched.status && formik.errors.status && (
                    <div className="invalid-feedback">
                      {formik.errors.status}
                    </div>
                  )}
                </div>
              </div>
              <div className="col-12 mb-2 d-flex justify-content-end align-items-end">
                {/* <div className="form-check">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id="copyAddress"
                    onChange={(e) => {
                      if (e.target.checked) {
                        formik.setFieldValue(
                          "costPrice",
                          formik.values.sellingPrice
                        );
                        formik.setFieldValue(
                          "purchaseAccount",
                          formik.values.salesAccount
                        );
                        formik.setFieldValue(
                          "purchaseTax",
                          formik.values.salesTax
                        );
                        formik.setFieldValue(
                          "purchaseAccountDescription",
                          formik.values.salesAccountDescription
                        );
                      }
                    }}
                  />
                  <label className="form-check-label" htmlFor="copyAddress">
                    Same as Sales
                  </label>
                </div> */}
              </div>

              <div className="col-md-6 col-12 mb-2">
                <h3 className="my-5">Sales</h3>
                <label className="form-label">
                  Selling Price<span className="text-danger">*</span>
                </label>
                <div className="input-group mb-3">
                  <span className="input-group-text">INR</span>{" "}
                  <input
                    type="text"
                    name="sellingPrice"
                    className={`form-control ${
                      formik.touched.sellingPrice && formik.errors.sellingPrice
                        ? "is-invalid"
                        : ""
                    }`}
                    {...formik.getFieldProps("sellingPrice")}
                  />
                  {formik.touched.sellingPrice &&
                    formik.errors.sellingPrice && (
                      <div className="invalid-feedback">
                        {formik.errors.sellingPrice}
                      </div>
                    )}
                </div>
              </div>

              <div className="col-md-6 col-12 mb-2">
                <h3 className="my-5">Purchase</h3>
                <label className="form-label">
                  Cost Price<span className="text-danger">*</span>
                </label>
                <div className="input-group mb-3">
                  <span className="input-group-text">INR</span>{" "}
                  <input
                    type="text"
                    name="costPrice"
                    className={`form-control ${
                      formik.touched.costPrice && formik.errors.costPrice
                        ? "is-invalid"
                        : ""
                    }`}
                    {...formik.getFieldProps("costPrice")}
                  />
                  {formik.touched.costPrice && formik.errors.costPrice && (
                    <div className="invalid-feedback">
                      {formik.errors.costPrice}
                    </div>
                  )}
                </div>
              </div>

              <div className="container mb-5">
                <div className="row py-4">
                  <div className="col-md-6 col-12 mb-2">
                    <label className="form-label">
                      Sales Account<span className="text-danger">*</span>
                    </label>
                    <div className="mb-3">
                      <input
                        type="text"
                        name="salesAccount"
                        className={`form-control ${
                          formik.touched.salesAccount &&
                          formik.errors.salesAccount
                            ? "is-invalid"
                            : ""
                        }`}
                        {...formik.getFieldProps("salesAccount")}
                      />
                      {formik.touched.salesAccount &&
                        formik.errors.salesAccount && (
                          <div className="invalid-feedback">
                            {formik.errors.salesAccount}
                          </div>
                        )}
                    </div>
                  </div>

                  <div className="col-md-6 col-12 mb-2">
                    <label className="form-label">
                      Purchase Account<span className="text-danger">*</span>
                    </label>
                    <div className="mb-3">
                      <input
                        type="text"
                        name="purchaseAccount"
                        className={`form-control ${
                          formik.touched.purchaseAccount &&
                          formik.errors.purchaseAccount
                            ? "is-invalid"
                            : ""
                        }`}
                        {...formik.getFieldProps("purchaseAccount")}
                      />
                      {formik.touched.purchaseAccount &&
                        formik.errors.purchaseAccount && (
                          <div className="invalid-feedback">
                            {formik.errors.purchaseAccount}
                          </div>
                        )}
                    </div>
                  </div>

                  <div className="col-md-6 col-12 mb-2">
                    <label className="form-label">Sales Tax (%)</label>
                    <div className="mb-3">
                      <input
                        type="text"
                        name="salesTax"
                        className={`form-control ${
                          formik.touched.salesTax && formik.errors.salesTax
                            ? "is-invalid"
                            : ""
                        }`}
                        {...formik.getFieldProps("salesTax")}
                      />
                      {formik.touched.salesTax && formik.errors.salesTax && (
                        <div className="invalid-feedback">
                          {formik.errors.salesTax}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="col-md-6 col-12 mb-2">
                    <label className="form-label">Purchase Tax (%)</label>
                    <div className="mb-3">
                      <input
                        type="text"
                        name="purchaseTax"
                        className={`form-control ${
                          formik.touched.purchaseTax &&
                          formik.errors.purchaseTax
                            ? "is-invalid"
                            : ""
                        }`}
                        {...formik.getFieldProps("purchaseTax")}
                      />
                      {formik.touched.purchaseTax &&
                        formik.errors.purchaseTax && (
                          <div className="invalid-feedback">
                            {formik.errors.purchaseTax}
                          </div>
                        )}
                    </div>
                  </div>

                  <div className="col-md-6 col-12 mb-2">
                    <label className="form-label">
                      Sales Account Description
                    </label>
                    <div className="mb-3">
                      <textarea
                        type="text"
                        name="salesAccountDescription"
                        className={`form-control ${
                          formik.touched.salesAccountDescription &&
                          formik.errors.salesAccountDescription
                            ? "is-invalid"
                            : ""
                        }`}
                        rows="4"
                        {...formik.getFieldProps("salesAccountDescription")}
                      />
                      {formik.touched.salesAccountDescription &&
                        formik.errors.salesAccountDescription && (
                          <div className="invalid-feedback">
                            {formik.errors.salesAccountDescription}
                          </div>
                        )}
                    </div>
                  </div>

                  <div className="col-md-6 col-12 mb-2">
                    <label className="form-label">
                      Purchase Account Description
                    </label>
                    <div className="mb-3">
                      <textarea
                        type="text"
                        name="purchaseAccountDescription"
                        className={`form-control ${
                          formik.touched.purchaseAccountDescription &&
                          formik.errors.purchaseAccountDescription
                            ? "is-invalid"
                            : ""
                        }`}
                        rows="4"
                        {...formik.getFieldProps("purchaseAccountDescription")}
                      />
                      {formik.touched.purchaseAccountDescription &&
                        formik.errors.purchaseAccountDescription && (
                          <div className="invalid-feedback">
                            {formik.errors.purchaseAccountDescription}
                          </div>
                        )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ItemsEdit;
