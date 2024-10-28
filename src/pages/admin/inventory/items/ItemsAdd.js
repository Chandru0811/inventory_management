import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import toast from "react-hot-toast";
import api from "../../../../config/URL";

const ItemsAdd = () => {
  const navigate = useNavigate();
  const [loading, setLoadIndicator] = useState(false);

  const validationSchema = Yup.object({
    name: Yup.string().required("*Name is required"),
    itemUnit: Yup.string().required("*Item Unit is required"),
    sellingPrice: Yup.string().required("*Selling Price is required"),
    costPrice: Yup.string().required("*Cost Price is required"),
    salesAccount: Yup.string().required("*Sales Account is required"),
    purchaseAccount: Yup.string().required("*Purchase Account is required"),
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
      inventoryAccount: "FinishedGoods",
      openingStock: "",
      openingStockRate: "",
      reorderPoint: "",
      image: null,
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      setLoadIndicator(true);
      console.log(values);

      const payload = {
        ...values,
        universalProductCode: Number(values.universalProductCode) || 0,
        internationalArticleNumber:
          Number(values.internationalArticleNumber) || 0,
        internationalStandardBookNumber:
          Number(values.internationalStandardBookNumber) || 0,
        salesTax: Number(values.salesTax) || 0,
        purchaseTax: Number(values.purchaseTax) || 0,
        weight: Number(values.weight) || 0,
        sellingPrice: Number(values.sellingPrice) || 0,
        costPrice: Number(values.costPrice) || 0,
        openingStock: Number(values.openingStock) || 0,
        openingStockRate: Number(values.openingStockRate) || 0,
        reorderPoint: Number(values.reorderPoint) || 0,
      };
      // const formData = new FormData();
      // // Append each value to the FormData instance
      // for (const key in values) {
      //   if (values.hasOwnProperty(key)) {
      //     formData.append(key, values[key]);
      //   }
      // }

      try {
        const response = await api.post("createItems", payload, {
          // headers: {
          //   'Content-Type': 'multipart/form-data',
          // },
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
                  <h1 className="h4 ls-tight headingColor">Add Items</h1>
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
                    className="form-control"
                    onChange={(event) => {
                      formik.setFieldValue("image", event.target.files[0]);
                    }}
                    onBlur={formik.handleBlur}
                  />
                  {formik.touched.image && formik.errors.image && (
                    <div className="invalid-feedback">
                      {formik.errors.image}
                    </div>
                  )}
                </div>
              </div>
              <div className="col-md-6 col-12 mb-2">
                <lable className="form-lable">
                  Item Unit<span className="text-danger">*</span>
                </lable>
                <div className="mb-3">
                  <input
                    type="text"
                    name="itemUnit"
                    className={`form-control  ${
                      formik.touched.itemUnit && formik.errors.itemUnit
                        ? "is-invalid"
                        : ""
                    }`}
                    {...formik.getFieldProps("itemUnit")}
                  />
                  {formik.touched.itemUnit && formik.errors.itemUnit && (
                    <div className="invalid-feedback">
                      {formik.errors.itemUnit}
                    </div>
                  )}
                </div>
              </div>

              <div className="col-md-6 col-12 mb-2">
                <lable className="form-lable">Dimensions</lable>
                <div className="mb-3">
                  <input
                    type="text"
                    name="dimensions"
                    className={`form-control  ${
                      formik.touched.dimensions && formik.errors.dimensions
                        ? "is-invalid"
                        : ""
                    }`}
                    {...formik.getFieldProps("dimensions")}
                  />
                  {formik.touched.dimensions && formik.errors.dimensions && (
                    <div className="invalid-feedback">
                      {formik.errors.dimensions}
                    </div>
                  )}
                </div>
              </div>

              <div className="col-md-6 col-12 mb-2">
                <lable className="form-lable">Weight</lable>
                <div className="mb-3">
                  <input
                    type="text"
                    name="weight"
                    className={`form-control  ${
                      formik.touched.weight && formik.errors.weight
                        ? "is-invalid"
                        : ""
                    }`}
                    {...formik.getFieldProps("weight")}
                  />
                  {formik.touched.weight && formik.errors.weight && (
                    <div className="invalid-feedback">
                      {formik.errors.weight}
                    </div>
                  )}
                </div>
              </div>

              <div className="col-md-6 col-12 mb-2">
                <lable className="form-lable">Manaufacture Name</lable>
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
                <lable className="form-lable">Manaufacturing Part Number</lable>
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
                <lable className="form-lable">Opening Stock Rate</lable>
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
                <div className="mb-3">
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
                <div className="mb-3">
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
                    <label className="form-label">Sales Tax</label>
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
                    <label className="form-label">Purchase Tax</label>
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
                      <input
                        type="text"
                        name="salesAccountDescription"
                        className={`form-control ${
                          formik.touched.salesAccountDescription &&
                          formik.errors.salesAccountDescription
                            ? "is-invalid"
                            : ""
                        }`}
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
                      <input
                        type="text"
                        name="purchaseAccountDescription"
                        className={`form-control ${
                          formik.touched.purchaseAccountDescription &&
                          formik.errors.purchaseAccountDescription
                            ? "is-invalid"
                            : ""
                        }`}
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

export default ItemsAdd;
