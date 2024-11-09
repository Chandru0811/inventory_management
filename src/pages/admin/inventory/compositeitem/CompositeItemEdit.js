import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import toast from "react-hot-toast";
import api from "../../../../config/URL";
import { IoMdInformationCircleOutline } from "react-icons/io";

const CompositeItemEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoadIndicator] = useState(false);
  const [itemData, setItemData] = useState(null);
  const [data, setData] = useState([]);
  const [manufacture, setManufacture] = useState(null);

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
      inventoryAccount: "",
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

      // const payload = {
      //   ...values,
      //   universalProductCode: Number(values.universalProductCode) || 0,
      //   internationalArticleNumber:
      //     Number(values.internationalArticleNumber) || 0,
      //   internationalStandardBookNumber:
      //     Number(values.internationalStandardBookNumber) || 0,
      //   salesTax: Number(values.salesTax) || 0,
      //   purchaseTax: Number(values.purchaseTax) || 0,
      //   weight: Number(values.weight) || 0,
      //   sellingPrice: Number(values.sellingPrice) || 0,
      //   costPrice: Number(values.costPrice) || 0,
      //   openingStock: Number(values.openingStock) || 0,
      //   openingStockRate: Number(values.openingStockRate) || 0,
      //   reorderPoint: Number(values.reorderPoint) || 0,
      // };

      const formData = new FormData();
      formData.append("type", values.type);
      formData.append("name", values.name);
      formData.append("stockKeepingUnit", values.stockKeepingUnit);
      formData.append("itemUnit", values.itemUnit);
      const dimensions =
        values.length && values.width && values.heightD
          ? `${values.length} ${values.unit} x ${values.width} ${values.unit} x ${values.heightD} ${values.unit}`
          : "";
      formData.append("dimensions", dimensions);
      const weight =
        values.weightValue && values.weightUnit
          ? `${values.weightValue}${values.weightUnit}`
          : "";
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
      // formData.append("inventoryAccount", values.inventoryAccount);
      formData.append("openingStock", values.openingStock);
      formData.append("openingStockRate", values.openingStockRate);
      formData.append("reorderPoint", values.reorderPoint);
      formData.append("images", values.images);

      try {
        const response = await api.put(
          `update-composite-attach/${id}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        if (response.status === 200) {
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
  useEffect(() => {
    const getData = async () => {
      try {
        const response = await api.get(`getAllCompositeItemsById/${id}`);
        const data = response.data;

        if (data.dimensions) {
          const match = data.dimensions.match(
            /(\d+)\s*(cm|inch)\s*x\s*(\d+)\s*\2\s*x\s*(\d+)\s*\2/
          );

          if (match) {
            data.length = match[1] || "";
            data.width = match[3] || "";
            data.heightD = match[4] || "";
            data.unit = match[2] || "";
          }
        }

        formik.setValues(data);
        setData(data);
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
    console.log(
      "Current txnInvoiceOrderItemsModels:",
      formik.values.txnInvoiceOrderItemsModels
    );
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

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await api.get("getAllManufacturers");
        setManufacture(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    getData();
  }, []);

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
                    Edit Composite Items
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
                    className={`form-control form-control-sm ${
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
                    Type
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
                <div className="d-flex align-items-center">
                  <label className="form-label mb-0">SKU</label>
                  <span
                    className="infoField"
                    title="The Stock Keeping Unit of the item"
                  >
                    <IoMdInformationCircleOutline />{" "}
                  </span>
                </div>
                <div className="mb-3">
                  <input
                    type="text"
                    name="stockKeepingUnit"
                    className={`form-control form-control-sm ${
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
              {/* <div className="col-md-6 col-12 mb-2">
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
              </div> */}
              <div className="col-md-6 col-12 mb-2">
                <lable className="form-lable">Composite Item Image</lable>
                <div className="mb-3">
                  <input
                    type="file"
                    className="form-control form-control-sm"
                    onChange={(event) => {
                      formik.setFieldValue("images", event.target.files[0]);
                    }}
                    onBlur={formik.handleBlur}
                  />
                  {formik.touched.images && formik.errors.images && (
                    <div className="invalid-feedback">
                      {formik.errors.images}
                    </div>
                  )}
                </div>
                <img
                  src={data.compositeItemImage}
                  className="img-fluid ms-2 w-50 rounded mt-2"
                  alt="Profile Image"
                />
              </div>
              <div className="col-md-6 col-12 mb-2">
                <lable className="form-lable">
                  Unit<span className="text-danger">*</span>
                </lable>
                <div className="mb-3">
                  <select
                    name="itemUnit"
                    className={`form-select form-select-sm  ${
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
                <span className=" ms-3 fw-lighter" style={{ fontSize: "13px" }}>
                  (Length X Width X Height)
                </span>
                <div className="input-group mb-3">
                  <input
                    type="text"
                    name="length"
                    placeholder="Length"
                    className={`form-control form-control-sm ${
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
                    className={`form-control form-control-sm ${
                      formik.touched.width && formik.errors.width
                        ? "is-invalid"
                        : ""
                    }`}
                    {...formik.getFieldProps("width")}
                  />
                  <span className="input-group-text">x</span>

                  <input
                    type="text"
                    name="heightD"
                    placeholder="Height"
                    className={`form-control form-control-sm ${
                      formik.touched.heightD && formik.errors.heightD
                        ? "is-invalid"
                        : ""
                    }`}
                    {...formik.getFieldProps("heightD")}
                  />
                  <select
                    name="unit"
                    className="form-control form-control-sm"
                    onChange={(e) =>
                      formik.setFieldValue("unit", e.target.value)
                    }
                    value={formik.values.unit || "cm"}
                  >
                    <option value="cm">cm</option>
                    <option value="inch">inch</option>
                  </select>
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
                  {formik.touched.heightD && formik.errors.heightD && (
                    <div className="invalid-feedback">
                      {formik.errors.heightD}
                    </div>
                  )}
                </div>
              </div>

              <div className="col-md-6 col-12 mb-2">
                <label className="form-label">Weight</label>
                <div className="input-group mb-3">
                  <input
                    type="text"
                    name="weightValue"
                    className={`form-control form-control-sm w-75 ${
                      formik.touched.weightValue && formik.errors.weightValue
                        ? "is-invalid"
                        : ""
                    }`}
                    {...formik.getFieldProps("weightValue")}
                  />
                  <select
                    name="weightUnit"
                    className="form-control form-control-sm"
                    {...formik.getFieldProps("weightUnit")}
                  >
                    <option value="kg">kg</option>
                    <option value="g">g</option>
                    <option value="lb">lb</option>
                    <option value="oz">oz</option>
                  </select>
                  {formik.touched.weightValue && formik.errors.weightValue && (
                    <div className="invalid-feedback">
                      {formik.errors.weightValue}
                    </div>
                  )}
                </div>
              </div>

              <div className="col-md-6 col-12 mb-2">
                <label className="form-label">Manufacturer Name</label>
                <div className="mb-3">
                  <select
                    name="manufacturerName"
                    className={`form-select form-select-sm ${
                      formik.touched.manufacturerName &&
                      formik.errors.manufacturerName
                        ? "is-invalid"
                        : ""
                    }`}
                    {...formik.getFieldProps("manufacturerName")}
                  >
                    <option selected></option>
                    {manufacture &&
                      manufacture.map((data) => (
                        <option key={data.id} value={data.id}>
                          {data.manufacturerName}
                        </option>
                      ))}
                  </select>
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
                    className={`form-control form-control-sm  ${
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
                <div className="d-flex align-items-center">
                  <label className="form-label mb-0">MPN</label>
                  <span
                    className="infoField"
                    title="Manufacturing Part Number unambiguously identifies a part design"
                  >
                    <IoMdInformationCircleOutline />
                  </span>
                </div>{" "}
                <div className="mb-3">
                  <input
                    type="text"
                    name="manufacturingPartNumber"
                    className={`form-control form-control-sm ${
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
                <div className="d-flex align-items-center">
                  <label className="form-label mb-0">UPC</label>
                  <span
                    className="infoField"
                    title="Twelve digit unique number associated with the bar code (Universal Product Code)"
                  >
                    <IoMdInformationCircleOutline />{" "}
                  </span>
                </div>
                <div className="mb-3">
                  <input
                    type="text"
                    name="universalProductCode"
                    className={`form-control form-control-sm  ${
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
                <div className="d-flex align-items-center">
                  <label className="form-label mb-0">EAN</label>
                  <span
                    className="infoField"
                    title="Thirteen digit unique number (International Article Number)"
                  >
                    <IoMdInformationCircleOutline />
                  </span>
                </div>
                <div className="mb-3">
                  <input
                    type="text"
                    name="internationalArticleNumber"
                    className={`form-control form-control-sm  ${
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
                <div className="d-flex align-items-center">
                  <label className="form-label mb-0">ISBN</label>
                  <span
                    className="infoField"
                    title="Thirteen digit unique commercial book identifier (International Standard Book Number)"
                  >
                    <IoMdInformationCircleOutline />
                  </span>
                </div>
                <div className="mb-3">
                  <input
                    type="text"
                    name="internationalStandardBookNumber"
                    className={`form-control form-control-sm  ${
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
                <div className="d-flex align-items-center">
                  <lable className="form-lable">
                    Inventory Account<span className="text-danger">*</span>
                  </lable>
                  <span
                    className="infoField"
                    title="The account which tracks the inventory of this item"
                  >
                    <IoMdInformationCircleOutline />
                  </span>
                </div>
                <div className="mb-3">
                  <select
                    name="inventoryAccount"
                    className={`form-select form-select-sm  ${
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
                <div className="d-flex align-items-center">
                  <lable className="form-lable">Opening Stock</lable>
                  <span
                    className="infoField"
                    title="The stock available for sale at the beggining of the accounting period"
                  >
                    <IoMdInformationCircleOutline />
                  </span>
                </div>
                <div className="mb-3">
                  <input
                    type="text"
                    name="openingStock"
                    className={`form-control form-control-sm ${
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
                <div className="d-flex align-items-center">
                  {" "}
                  <lable className="form-lable">
                    Opening Stock Rate Per Unit
                  </lable>
                  <span
                    className="infoField"
                    title="The rate at which you bought each unit of the opening stock"
                  >
                    <IoMdInformationCircleOutline />
                  </span>
                </div>
                <div className="mb-3">
                  <input
                    type="text"
                    name="openingStockRate"
                    className={`form-control form-control-sm  ${
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
                <div className="d-flex align-items-center">
                  <lable className="form-lable">Reorder Points</lable>
                  <span
                    className="infoField"
                    title="When the stock reaches the reorder point, a notification will be send to you"
                  >
                    <IoMdInformationCircleOutline />
                  </span>
                </div>
                <div className="mb-3">
                  <input
                    type="text"
                    name="reorderPoint"
                    className={`form-control form-control-sm ${
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
                          Item<span className="text-danger">*</span>
                        </th>
                        <th style={{ width: "20%" }}>Quantity</th>
                        <th style={{ width: "20%" }}>Selling Price</th>
                        <th style={{ width: "20%" }}>Cost Price</th>
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
                                onInput={(event) => {
                                  event.target.value =
                                    event.target.value.replace(/[^0-9]/g, "");
                                }}
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
                                  event.target.value =
                                    event.target.value.replace(/[^0-9]/g, "");
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
                          </tr>
                        )
                      )}
                    </tbody>
                    <tbody>
                      <tr>
                        <th></th>
                        <td
                          className="text-center"
                          style={{ color: "#9c93a5" }}
                        >
                          Total (Rs.) :
                        </td>
                        <td>
                          <input
                            type="text"
                            class="form-control"
                            id="exampleFormControlInput1"
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            class="form-control"
                            id="exampleFormControlInput1"
                          />
                        </td>
                      </tr>
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
              <div className="col-md-6 col-12 mb-2">
                <h3 className="my-5">Sales</h3>
                <label className="form-label">
                  Selling Price<span className="text-danger">*</span>
                </label>
                <div className="mb-3">
                  <input
                    type="text"
                    name="sellingPrice"
                    className={`form-control form-control-sm ${
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
                    className={`form-control form-control-sm ${
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
                      <select
                        name="salesAccount"
                        className={`form-select form-select-sm  ${
                          formik.touched.salesAccount &&
                          formik.errors.salesAccount
                            ? "is-invalid"
                            : ""
                        }`}
                        {...formik.getFieldProps("salesAccount")}
                      >
                        <option></option>
                        <option value="General Income">General Income</option>
                        <option value="Sales">Sales</option>
                        <option value="Discount">Discount</option>
                      </select>
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
                      <select
                        name="purchaseAccount"
                        className={`form-select form-select-sm  ${
                          formik.touched.purchaseAccount &&
                          formik.errors.purchaseAccount
                            ? "is-invalid"
                            : ""
                        }`}
                        {...formik.getFieldProps("purchaseAccount")}
                      >
                        <option></option>
                        <option value="Cost of Goods Sold">
                          Cost of Goods Sold
                        </option>
                        <option value="Materials">Materials</option>
                        <option value="Labor">Labor</option>
                      </select>
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
                      <select
                        name="salesTax"
                        className={`form-select form-select-sm ${
                          formik.touched.salesTax && formik.errors.salesTax
                            ? "is-invalid"
                            : ""
                        }`}
                        {...formik.getFieldProps("salesTax")}
                      >
                        <option></option>
                        <option value="5">5%</option>
                        <option value="10">10%</option>
                        <option value="15">15%</option>
                        <option value="20">20%</option>
                        {/* Add more options as needed */}
                      </select>
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
                      <select
                        name="purchaseTax"
                        className={`form-select form-select-sm ${
                          formik.touched.purchaseTax &&
                          formik.errors.purchaseTax
                            ? "is-invalid"
                            : ""
                        }`}
                        {...formik.getFieldProps("purchaseTax")}
                      >
                        <option></option>
                        <option value="5">5%</option>
                        <option value="10">10%</option>
                        <option value="15">15%</option>
                        <option value="20">20%</option>
                        {/* Add more options as needed */}
                      </select>
                      {formik.touched.purchaseTax &&
                        formik.errors.purchaseTax && (
                          <div className="invalid-feedback">
                            {formik.errors.purchaseTax}
                          </div>
                        )}
                    </div>
                  </div>

                  <div className="col-md-6 col-12 mb-2">
                    <label className="form-label">Description</label>
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
                    <label className="form-label">Description</label>
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
                  <div className="col-md-6 col-12 mb-2"></div>
                  <div className="col-md-6 col-12 mb-2">
                    <lable className="form-lable">Preferred Vendor</lable>
                    <div className="mb-3">
                      <input
                        type="text"
                        name="preferredVendor"
                        className={`form-control form-control-sm  ${
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
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CompositeItemEdit;
