import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import toast from "react-hot-toast";
import api from "../../../../config/URL";

const CompositeItemAdd = () => {
  const navigate = useNavigate();
  const [loading, setLoadIndicator] = useState(false);
  const [itemData, setItemData] = useState(null);

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
      salesId: "",
      purchaseId: "",
      itemId: "",
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
      compositeItemImage: null,
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
        const response = await api.post("createCompositeItems", payload, {
          // headers: {
          //   'Content-Type': 'multipart/form-data',
          // },
        });

        if (response.status === 201) {
          toast.success(response.data.message);
          navigate("/compositeitem");
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
                    Add CompositeItem
                  </h1>
                </div>
              </div>
              <div className="col-auto">
                <div className="hstack gap-2 justify-content-end">
                  <Link to="/compositeitem">
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
              <div className="col-md-6 col-12 mb-2">
                <lable className="form-lable">Type</lable>
                <div className="mb-3">
                  <input
                    type="text"
                    name="type"
                    className={`form-control  ${
                      formik.touched.type && formik.errors.type
                        ? "is-invalid"
                        : ""
                    }`}
                    {...formik.getFieldProps("type")}
                  />
                  {formik.touched.type && formik.errors.type && (
                    <div className="invalid-feedback">{formik.errors.type}</div>
                  )}
                </div>
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
                <lable className="form-lable">Composite Item Image</lable>
                <div className="mb-3">
                  <input
                    type="file"
                    className="form-control"
                    onChange={(event) => {
                      formik.setFieldValue(
                        "compositeItemImage",
                        event.target.files[0]
                      );
                    }}
                    onBlur={formik.handleBlur}
                  />
                  {formik.touched.compositeItemImage &&
                    formik.errors.compositeItemImage && (
                      <div className="invalid-feedback">
                        {formik.errors.compositeItemImage}
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
                  International Standard BookNumber
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
              <div className="col-md-6 col-12 mb-2"> </div>
              <div className="col-md-6 col-12 mb-2">
                <h3 className="my-5">Sales</h3>
                <label className="form-label">Selling Price</label>
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
                <label className="form-label">Cost Price</label>
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
                    <label className="form-label">Sales Account</label>
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
                    <label className="form-label">Purchase Account</label>
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
                          {formik.values.txnInvoiceOrderItemsModels?.map(
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
                                      formik.touched
                                        .txnInvoiceOrderItemsModels?.[index]
                                        ?.item &&
                                      formik.errors
                                        .txnInvoiceOrderItemsModels?.[index]
                                        ?.item
                                        ? "is-invalid"
                                        : ""
                                    }`}
                                  >
                                    <option selected> </option>
                                    {itemData &&
                                      itemData.map((itemId) => (
                                        <option
                                          key={itemId.id}
                                          value={itemId.id}
                                        >
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
                                          formik.errors
                                            .txnInvoiceOrderItemsModels[index]
                                            .item
                                        }
                                      </div>
                                    )}
                                </td>
                                <td>
                                  <input
                                    onInput={(event) => {
                                      event.target.value =
                                        event.target.value.replace(
                                          /[^0-9]/g,
                                          ""
                                        );
                                    }}
                                    type="text"
                                    name={`txnInvoiceOrderItemsModels[${index}].qty`}
                                    className={`form-control ${
                                      formik.touched
                                        .txnInvoiceOrderItemsModels?.[index]
                                        ?.qty &&
                                      formik.errors
                                        .txnInvoiceOrderItemsModels?.[index]
                                        ?.qty
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
                                          formik.errors
                                            .txnInvoiceOrderItemsModels[index]
                                            .qty
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
                                      formik.touched
                                        .txnInvoiceOrderItemsModels?.[index]
                                        ?.price &&
                                      formik.errors
                                        .txnInvoiceOrderItemsModels?.[index]
                                        ?.price
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
                                          formik.errors
                                            .txnInvoiceOrderItemsModels[index]
                                            .price
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
                                      formik.touched
                                        .txnInvoiceOrderItemsModels?.[index]
                                        ?.disc &&
                                      formik.errors
                                        .txnInvoiceOrderItemsModels?.[index]
                                        ?.disc
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
                                          formik.errors
                                            .txnInvoiceOrderItemsModels[index]
                                            .disc
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
                                      formik.touched
                                        .txnInvoiceOrderItemsModels?.[index]
                                        ?.taxRate &&
                                      formik.errors
                                        .txnInvoiceOrderItemsModels?.[index]
                                        ?.taxRate
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
                                          formik.errors
                                            .txnInvoiceOrderItemsModels[index]
                                            .taxRate
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
                                      formik.touched
                                        .txnInvoiceOrderItemsModels?.[index]
                                        ?.amount &&
                                      formik.errors
                                        .txnInvoiceOrderItemsModels?.[index]
                                        ?.amount
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
                                          formik.errors
                                            .txnInvoiceOrderItemsModels[index]
                                            .amount
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
                          {formik.touched.subTotal &&
                            formik.errors.subTotal && (
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
                        <label className="col-sm-4 col-form-label">
                          Total Tax
                        </label>
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
                          {formik.touched.totalTax &&
                            formik.errors.totalTax && (
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
          </div>
        </div>
      </form>
    </div>
  );
};

export default CompositeItemAdd;
