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
  const [manufacture, setManufacture] = useState(null);
  const [data, setData] = useState([]);

  const validationSchema = Yup.object({
    name: Yup.string().required("*Name is required"),
    unit: Yup.string().required("*Item Unit is required"),
    sellingPrice: Yup.string().required("*Selling Price is required"),
    costPrice: Yup.string().required("*Cost Price is required"),
    accountSalesId: Yup.string().required("*Sales Account is required"),
    accountPurchaseId: Yup.string().required("*Purchase Account is required"),
    inventoryAccount: Yup.string().required("*Inventory Account is required"),
  });

  const formik = useFormik({
    initialValues: {
      salesId: "",
      purchaseId: "",
      itemId: "",
      name: "",
      type: "",
      sku: "",
      unit: "",
      dimensions: "",
      weight: "",
      manufactureId: "",
      brandId: "",
      upc: "",
      mpn: "",
      ean: "",
      isbn: "",
      sellingPrice: "",
      costPrice: "",
      accountSalesId: "",
      accountPurchaseId: "",
      salesAccountDescription: "",
      purchaseAccountDescription: "",
      salesTax: "",
      purchaseTax: "",
      preferredVendor: "",
      inventoryAccount: "",
      openingStock: "",
      openingStockValue: "",
      reorderPoint: "",  
      imageFile: null,
      compositeAssociateItemsJson: [
        {
          id: "",
          itemId: "",
          quantity: "",
          sellingPrice: "",
          costPrice: "",
        },
      ],
      compositeAssociateServiceJson: [
        {
          id: "",
          itemId: "",
          quantity: "",
          sellingPrice: "",
          costPrice: "",
        },
      ],
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      setLoadIndicator(true);
      console.log(values);

      // const payload = {
      //   ...values,
      //   upc: Number(values.upc) || 0,
      //   ean:
      //     Number(values.ean) || 0,
      //   isbn:
      //     Number(values.isbn) || 0,
      //   salesTax: Number(values.salesTax) || 0,
      //   purchaseTax: Number(values.purchaseTax) || 0,
      //   weight: Number(values.weight) || 0,
      //   sellingPrice: Number(values.sellingPrice) || 0,
      //   costPrice: Number(values.costPrice) || 0,
      //   openingStock: Number(values.openingStock) || 0,
      //   openingStockValue: Number(values.openingStockValue) || 0,
      //   reorderPoint: Number(values.reorderPoint) || 0,
      // };

      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("sku", values.sku);
      formData.append("unit", values.unit);
      const dimensions =
        values.length && values.width && values.heightD
          ? `${values.length} ${values.unit} x ${values.width} ${values.unit} x ${values.heightD} ${values.unit}`
          : "";
      formData.append("dimensions", dimensions);
      const weight =
        values.weightValue && values.weightUnit
          ? `${values.weightValue}${values.weightUnit}`
          : "";
      formData.append("weight", weight);
      formData.append("manufactureId", values.manufactureId || "");
      formData.append("brandId", values.brandId);
      formData.append("upc", values.upc);
      formData.append("mpn", values.mpn);
      formData.append("ean", values.ean);
      formData.append("isbn", values.isbn);
      formData.append("sellingPrice", values.sellingPrice);
      formData.append("costPrice", values.costPrice);
      formData.append("accountSalesId", values.accountSalesId);
      formData.append("accountPurchaseId  ", values.accountPurchaseId || " ");
      formData.append(
        "salesAccountDescription",
        values.salesAccountDescription
      );
      formData.append(
        "purchaseAccountDescription",
        values.purchaseAccountDescription
      );
      // formData.append("salesTax", values.salesTax);
      // formData.append("purchaseTax", values.purchaseTax);
      formData.append("preferredVendor", values.preferredVendor);
      // formData.append("inventoryAccount", values.inventoryAccount);
      formData.append("openingStock", values.openingStock);
      formData.append("openingStockValue", values.openingStockValue);
      formData.append("reorderPoint", values.reorderPoint);
      formData.append(
        "compositeAssociateItemsJson",
        JSON.stringify(
          values.compositeAssociateItemsJson
            .filter(
              (item) =>
                item.itemId &&
                item.quantity &&
                item.sellingPrice &&
                item.costPrice
            ) // Filter out incomplete items
            .map((item) => ({
              id: item.id,
              itemId: item.itemId?.id || item.itemId, // Ensure itemId is the correct ID value
              quantity: parseInt(item.quantity, 10),
              sellingPrice: parseFloat(item.sellingPrice),
              costPrice: parseFloat(item.costPrice),
            }))
        )
      );
      formData.append("aiTotalSellingPrice", values.aiTotalSellingPrice || "");
      formData.append("aiTotalCostPrice", values.aiTotalCostPrice || "");
      formData.append(
        "compositeAssociateServiceJson",
        JSON.stringify(
          values.compositeAssociateServiceJson
            .filter(
              (item) =>
                item.itemId &&
                item.quantity &&
                item.sellingPrice &&
                item.costPrice
            ) // Filter out incomplete items
            .map((item) => ({
              id: item.id,
              itemId: item.itemId?.id || item.itemId, // Ensure itemId is the correct ID value
              quantity: parseInt(item.quantity, 10),
              sellingPrice: parseFloat(item.sellingPrice),
              costPrice: parseFloat(item.costPrice),
            }))
        )
      );
      formData.append("asTotalSellingPrice", values.asTotalSellingPrice || "");
      formData.append("asTotalCostPrice", values.asTotalCostPrice || "");
      formData.append("inventoryAccount", values.inventoryAccount || "");
      formData.append("categoryId", "1");
      formData.append("wareHouseId", "1");
      formData.append("imageFile", values.imageFile);

      try {
        const response = await api.put(
          `compositeUpdationWithItems/${id}`,
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
            /(\d+)\s*(\w+)\s*x\s*(\d+)\s*\2\s*x\s*(\d+)\s*\2/
          );

          if (match) {
            data.length = match[1] || "";
            data.width = match[3] || "";
            data.heightD = match[4] || "";
            data.unit = match[2] || "";
          }
        }

        if (data.weight) {
          const weightMatch = data.weight.match(/(\d+)(\w+)/);
          if (weightMatch) {
            data.weightValue = weightMatch[1];
            data.weightUnit = weightMatch[2];
          }
        }

        if (data.compositeAssociateItems) {
          data.compositeAssociateItemsJson = data.compositeAssociateItems.map(
            (item) => ({
              id: item.id,
              itemId: item.itemId,
              quantity: item.quantity,
              sellingPrice: item.sellingPrice,
              costPrice: item.costPrice,
            })
          );
        }

        if (data.compositeAssociateServicesModels) {
          data.compositeAssociateServiceJson = data.compositeAssociateServicesModels.map(
            (item) => ({
              id: item.id,
              itemId: item.itemId,
              quantity: item.quantity,
              sellingPrice: item.sellingPrice,
              costPrice: item.costPrice,
            })
          );
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
  //         formik.values.compositeAssociateItemsJson.map(async (item, index) => {
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
  //         compositeAssociateItemsJson: updatedItems,
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
  //   formik.values.compositeAssociateItemsJson?.map((item) => item.qty).join(""),
  //   formik.values.compositeAssociateItemsJson
  //     ?.map((item) => item.price)
  //     .join(""),
  //   formik.values.compositeAssociateItemsJson?.map((item) => item.disc).join(""),
  //   formik.values.compositeAssociateItemsJson
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
    formik.setFieldValue("compositeAssociateItemsJson", [
      ...formik.values.compositeAssociateItemsJson,
      {
        itemId: "",
        quantity: "",
        sellingPrice: "",
        costPrice: "",
      },
    ]);
  };

  const deleteRow = (index) => {
    if (formik.values.compositeAssociateItemsJson.length === 1) {
      return;
    }
    const updatedRows = [...formik.values.compositeAssociateItemsJson];
    updatedRows.pop();
    formik.setFieldValue("compositeAssociateItemsJson", updatedRows);
  };

  const AddRowService = () => {
    formik.setFieldValue("compositeAssociateServiceJson", [
      ...formik.values.compositeAssociateServiceJson,
      {
        itemId: "",
        quantity: "",
        sellingPrice: "",
        costPrice: "",
      },
    ]);
  };

  const deleteRowService = (index) => {
    if (formik.values.compositeAssociateServiceJson.length === 1) {
      return;
    }
    const updatedRows = [...formik.values.compositeAssociateServiceJson];
    updatedRows.pop();
    formik.setFieldValue("compositeAssociateServiceJson", updatedRows);
  };

  const scrollToError = (errors) => {
    const errorField = Object.keys(errors)[0];
    const errorElement = document.querySelector(`[name="${errorField}"]`);
    if (errorElement) {
      errorElement.scrollIntoView({ behavior: "smooth", block: "center" });
      errorElement.focus();
    }
  };
  useEffect(() => {
    if (formik.submitCount > 0 && Object.keys(formik.errors).length > 0) {
      scrollToError(formik.errors);
    }
  }, [formik.submitCount]);

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
                    name="sku"
                    className={`form-control form-control-sm ${
                      formik.touched.sku && formik.errors.sku
                        ? "is-invalid"
                        : ""
                    }`}
                    {...formik.getFieldProps("sku")}
                  />
                  {formik.touched.sku && formik.errors.sku && (
                    <div className="invalid-feedback">{formik.errors.sku}</div>
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
                        "imageFile",
                        event.target.files[0]
                      );
                    }}
                    onBlur={formik.handleBlur}
                  />
                  {formik.touched.imageFile &&
                    formik.errors.imageFile && (
                      <div className="invalid-feedback">
                        {formik.errors.imageFile}
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
                      formik.setFieldValue("imageFile", event.target.files[0]);
                    }}
                    onBlur={formik.handleBlur}
                  />
                  {formik.touched.imageFile && formik.errors.imageFile && (
                    <div className="invalid-feedback">
                      {formik.errors.imageFile}
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
                    name="unit"
                    className={`form-select form-select-sm  ${
                      formik.touched.unit && formik.errors.unit
                        ? "is-invalid"
                        : ""
                    }`}
                    {...formik.getFieldProps("unit")}
                  >
                    <option value=""></option>
                    <option value="dz">DOZEN</option>
                    <option value="box">BOX</option>
                    <option value="g">GRAMS</option>
                    <option value="kg">KILOGRAMS</option>
                    <option value="m">METERS</option>
                    <option value="pcs">PIECES</option>
                  </select>
                  {formik.touched.unit && formik.errors.unit && (
                    <div className="invalid-feedback">{formik.errors.unit}</div>
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
                    name="manufactureId"
                    className={`form-select form-select-sm ${
                      formik.touched.manufactureId &&
                      formik.errors.manufactureId
                        ? "is-invalid"
                        : ""
                    }`}
                    {...formik.getFieldProps("manufactureId")}
                  >
                    <option selected></option>
                    {manufacture &&
                      manufacture.map((data) => (
                        <option key={data.id} value={data.id}>
                          {data.manufacturerName}
                        </option>
                      ))}
                  </select>
                  {formik.touched.manufactureId &&
                    formik.errors.manufactureId && (
                      <div className="invalid-feedback">
                        {formik.errors.manufactureId}
                      </div>
                    )}
                </div>
              </div>

              <div className="col-md-6 col-12 mb-2">
                <lable className="form-lable">Brand Name</lable>
                <div className="mb-3">
                  <input
                    type="text"
                    name="brandId"
                    className={`form-control form-control-sm  ${
                      formik.touched.brandId && formik.errors.brandId
                        ? "is-invalid"
                        : ""
                    }`}
                    {...formik.getFieldProps("brandId")}
                  />
                  {formik.touched.brandId && formik.errors.brandId && (
                    <div className="invalid-feedback">
                      {formik.errors.brandId}
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
                    name="mpn"
                    className={`form-control form-control-sm ${
                      formik.touched.mpn && formik.errors.mpn
                        ? "is-invalid"
                        : ""
                    }`}
                    {...formik.getFieldProps("mpn")}
                  />
                  {formik.touched.mpn && formik.errors.mpn && (
                    <div className="invalid-feedback">{formik.errors.mpn}</div>
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
                    name="upc"
                    className={`form-control form-control-sm  ${
                      formik.touched.upc && formik.errors.upc
                        ? "is-invalid"
                        : ""
                    }`}
                    {...formik.getFieldProps("upc")}
                  />
                  {formik.touched.upc && formik.errors.upc && (
                    <div className="invalid-feedback">{formik.errors.upc}</div>
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
                    name="ean"
                    className={`form-control form-control-sm  ${
                      formik.touched.ean && formik.errors.ean
                        ? "is-invalid"
                        : ""
                    }`}
                    {...formik.getFieldProps("ean")}
                  />
                  {formik.touched.ean && formik.errors.ean && (
                    <div className="invalid-feedback">{formik.errors.ean}</div>
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
                    name="isbn"
                    className={`form-control form-control-sm  ${
                      formik.touched.isbn && formik.errors.isbn
                        ? "is-invalid"
                        : ""
                    }`}
                    {...formik.getFieldProps("isbn")}
                  />
                  {formik.touched.isbn && formik.errors.isbn && (
                    <div className="invalid-feedback">{formik.errors.isbn}</div>
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
                <div className="input-group mb-3">
                  <span className="input-group-text">INR</span>{" "}
                  <input
                    type="text"
                    name="openingStockValue"
                    className={`form-control form-control-sm  ${
                      formik.touched.openingStockValue &&
                      formik.errors.openingStockValue
                        ? "is-invalid"
                        : ""
                    }`}
                    {...formik.getFieldProps("openingStockValue")}
                  />
                  {formik.touched.openingStockValue &&
                    formik.errors.openingStockValue && (
                      <div className="invalid-feedback">
                        {formik.errors.openingStockValue}
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
              <div className="row my-5">
                <h3>Associate Item</h3>
                <div className="mt-3">
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
                          Item Details<span className="text-danger">*</span>
                        </th>
                        <th style={{ width: "20%" }}>Quantity</th>
                        <th style={{ width: "20%" }}>Selling Price</th>
                        <th style={{ width: "20%" }}>Cost Price</th>
                      </tr>
                    </thead>
                    <tbody>
                      {formik.values.compositeAssociateItemsJson?.map(
                        (item, index) => (
                          <tr key={index}>
                            <td>
                              <select
                                name={`compositeAssociateItemsJson[${index}].itemId`}
                                {...formik.getFieldProps(
                                  `compositeAssociateItemsJson[${index}].itemId`
                                )}
                                className={`form-select ${
                                  formik.touched.compositeAssociateItemsJson?.[
                                    index
                                  ]?.itemId &&
                                  formik.errors.compositeAssociateItemsJson?.[
                                    index
                                  ]?.itemId
                                    ? "is-invalid"
                                    : ""
                                }`}
                              >
                                <option selected> </option>
                                {/* <option value="110">Items</option> */}
                                {itemData &&
                                  itemData.map((item) => (
                                    <option key={item.id} value={item.id}>
                                      {item.name}
                                    </option>
                                  ))}
                              </select>
                              {formik.touched.compositeAssociateItemsJson?.[
                                index
                              ]?.itemId &&
                                formik.errors.compositeAssociateItemsJson?.[
                                  index
                                ]?.itemId && (
                                  <div className="invalid-feedback">
                                    {
                                      formik.errors.compositeAssociateItemsJson[
                                        index
                                      ].itemId
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
                                name={`compositeAssociateItemsJson[${index}].quantity`}
                                className={`form-control ${
                                  formik.touched.compositeAssociateItemsJson?.[
                                    index
                                  ]?.quantity &&
                                  formik.errors.compositeAssociateItemsJson?.[
                                    index
                                  ]?.quantity
                                    ? "is-invalid"
                                    : ""
                                }`}
                                {...formik.getFieldProps(
                                  `compositeAssociateItemsJson[${index}].quantity`
                                )}
                              />
                              {formik.touched.compositeAssociateItemsJson?.[
                                index
                              ]?.quantity &&
                                formik.errors.compositeAssociateItemsJson?.[
                                  index
                                ]?.quantity && (
                                  <div className="invalid-feedback">
                                    {
                                      formik.errors.compositeAssociateItemsJson[
                                        index
                                      ].quantity
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
                                name={`compositeAssociateItemsJson[${index}].sellingPrice`}
                                className={`form-control ${
                                  formik.touched.compositeAssociateItemsJson?.[
                                    index
                                  ]?.sellingPrice &&
                                  formik.errors.compositeAssociateItemsJson?.[
                                    index
                                  ]?.sellingPrice
                                    ? "is-invalid"
                                    : ""
                                }`}
                                {...formik.getFieldProps(
                                  `compositeAssociateItemsJson[${index}].sellingPrice`
                                )}
                              />
                              {formik.touched.compositeAssociateItemsJson?.[
                                index
                              ]?.sellingPrice &&
                                formik.errors.compositeAssociateItemsJson?.[
                                  index
                                ]?.sellingPrice && (
                                  <div className="invalid-feedback">
                                    {
                                      formik.errors.compositeAssociateItemsJson[
                                        index
                                      ].sellingPrice
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
                                name={`compositeAssociateItemsJson[${index}].costPrice`}
                                className={`form-control ${
                                  formik.touched.compositeAssociateItemsJson?.[
                                    index
                                  ]?.costPrice &&
                                  formik.errors.compositeAssociateItemsJson?.[
                                    index
                                  ]?.costPrice
                                    ? "is-invalid"
                                    : ""
                                }`}
                                {...formik.getFieldProps(
                                  `compositeAssociateItemsJson[${index}].costPrice`
                                )}
                              />
                              {formik.touched.compositeAssociateItemsJson?.[
                                index
                              ]?.costPrice &&
                                formik.errors.compositeAssociateItemsJson?.[
                                  index
                                ]?.costPrice && (
                                  <div className="invalid-feedback">
                                    {
                                      formik.errors.compositeAssociateItemsJson[
                                        index
                                      ].costPrice
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
                            onInput={(event) => {
                              event.target.value = event.target.value.replace(
                                /[^0-9]/g,
                                ""
                              );
                            }}
                            type="text"
                            name={`aiTotalSellingPrice`}
                            className={`form-control ${
                              formik.touched.aiTotalSellingPrice &&
                              formik.errors.aiTotalSellingPrice
                                ? "is-invalid"
                                : ""
                            }`}
                            {...formik.getFieldProps(`aiTotalSellingPrice`)}
                          />
                          {formik.touched.aiTotalSellingPrice &&
                            formik.errors.aiTotalSellingPrice && (
                              <div className="invalid-feedback">
                                {formik.errors.aiTotalSellingPrice}
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
                            name={`aiTotalCostPrice`}
                            className={`form-control ${
                              formik.touched.aiTotalCostPrice &&
                              formik.errors.aiTotalCostPrice
                                ? "is-invalid"
                                : ""
                            }`}
                            {...formik.getFieldProps(`aiTotalCostPrice`)}
                          />
                          {formik.touched.aiTotalCostPrice &&
                            formik.errors.aiTotalCostPrice && (
                              <div className="invalid-feedback">
                                {formik.errors.aiTotalCostPrice}
                              </div>
                            )}
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
                {formik.values.compositeAssociateItemsJson?.length > 1 && (
                  <button
                    className="btn btn-sm my-4 mx-1 delete border-danger bg-white text-danger"
                    onClick={deleteRow}
                  >
                    Delete
                  </button>
                )}
              </div>
              <div className="row my-5">
                <h3>Associate Service</h3>
                <div className="mt-3">
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
                          Service Details<span className="text-danger">*</span>
                        </th>
                        <th style={{ width: "20%" }}>Quantity</th>
                        <th style={{ width: "20%" }}>Selling Price</th>
                        <th style={{ width: "20%" }}>Cost Price</th>
                      </tr>
                    </thead>
                    <tbody>
                      {formik.values.compositeAssociateServiceJson?.map(
                        (item, index) => (
                          <tr key={index}>
                            <td>
                              <select
                                name={`compositeAssociateServiceJson[${index}].itemId`}
                                {...formik.getFieldProps(
                                  `compositeAssociateServiceJson[${index}].itemId`
                                )}
                                className={`form-select ${
                                  formik.touched
                                    .compositeAssociateServiceJson?.[index]
                                    ?.itemId &&
                                  formik.errors.compositeAssociateServiceJson?.[
                                    index
                                  ]?.itemId
                                    ? "is-invalid"
                                    : ""
                                }`}
                              >
                                <option selected> </option>
                                {/* <option value="110">Items</option> */}
                                {itemData &&
                                  itemData.map((item) => (
                                    <option key={item.id} value={item.id}>
                                      {item.name}
                                    </option>
                                  ))}
                              </select>
                              {formik.touched.compositeAssociateServiceJson?.[
                                index
                              ]?.itemId &&
                                formik.errors.compositeAssociateServiceJson?.[
                                  index
                                ]?.itemId && (
                                  <div className="invalid-feedback">
                                    {
                                      formik.errors
                                        .compositeAssociateServiceJson[index]
                                        .itemId
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
                                name={`compositeAssociateServiceJson[${index}].quantity`}
                                className={`form-control ${
                                  formik.touched
                                    .compositeAssociateServiceJson?.[index]
                                    ?.quantity &&
                                  formik.errors.compositeAssociateServiceJson?.[
                                    index
                                  ]?.quantity
                                    ? "is-invalid"
                                    : ""
                                }`}
                                {...formik.getFieldProps(
                                  `compositeAssociateServiceJson[${index}].quantity`
                                )}
                              />
                              {formik.touched.compositeAssociateServiceJson?.[
                                index
                              ]?.quantity &&
                                formik.errors.compositeAssociateServiceJson?.[
                                  index
                                ]?.quantity && (
                                  <div className="invalid-feedback">
                                    {
                                      formik.errors
                                        .compositeAssociateServiceJson[index]
                                        .quantity
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
                                name={`compositeAssociateServiceJson[${index}].sellingPrice`}
                                className={`form-control ${
                                  formik.touched
                                    .compositeAssociateServiceJson?.[index]
                                    ?.sellingPrice &&
                                  formik.errors.compositeAssociateServiceJson?.[
                                    index
                                  ]?.sellingPrice
                                    ? "is-invalid"
                                    : ""
                                }`}
                                {...formik.getFieldProps(
                                  `compositeAssociateServiceJson[${index}].sellingPrice`
                                )}
                              />
                              {formik.touched.compositeAssociateServiceJson?.[
                                index
                              ]?.sellingPrice &&
                                formik.errors.compositeAssociateServiceJson?.[
                                  index
                                ]?.sellingPrice && (
                                  <div className="invalid-feedback">
                                    {
                                      formik.errors
                                        .compositeAssociateServiceJson[index]
                                        .sellingPrice
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
                                name={`compositeAssociateServiceJson[${index}].costPrice`}
                                className={`form-control ${
                                  formik.touched
                                    .compositeAssociateServiceJson?.[index]
                                    ?.costPrice &&
                                  formik.errors.compositeAssociateServiceJson?.[
                                    index
                                  ]?.costPrice
                                    ? "is-invalid"
                                    : ""
                                }`}
                                {...formik.getFieldProps(
                                  `compositeAssociateServiceJson[${index}].costPrice`
                                )}
                              />
                              {formik.touched.compositeAssociateServiceJson?.[
                                index
                              ]?.costPrice &&
                                formik.errors.compositeAssociateServiceJson?.[
                                  index
                                ]?.costPrice && (
                                  <div className="invalid-feedback">
                                    {
                                      formik.errors
                                        .compositeAssociateServiceJson[index]
                                        .costPrice
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
                            onInput={(event) => {
                              event.target.value = event.target.value.replace(
                                /[^0-9]/g,
                                ""
                              );
                            }}
                            type="text"
                            name={`asTotalSellingPrice`}
                            className={`form-control ${
                              formik.touched.asTotalSellingPrice &&
                              formik.errors.asTotalSellingPrice
                                ? "is-invalid"
                                : ""
                            }`}
                            {...formik.getFieldProps(`asTotalSellingPrice`)}
                          />
                          {formik.touched.asTotalSellingPrice &&
                            formik.errors.asTotalSellingPrice && (
                              <div className="invalid-feedback">
                                {formik.errors.asTotalSellingPrice}
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
                            name={`asTotalCostPrice`}
                            className={`form-control ${
                              formik.touched.asTotalCostPrice &&
                              formik.errors.asTotalCostPrice
                                ? "is-invalid"
                                : ""
                            }`}
                            {...formik.getFieldProps(`asTotalCostPrice`)}
                          />
                          {formik.touched.asTotalCostPrice &&
                            formik.errors.asTotalCostPrice && (
                              <div className="invalid-feedback">
                                {formik.errors.asTotalCostPrice}
                              </div>
                            )}
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
                  onClick={AddRowService}
                >
                  Add row
                </button>
                {formik.values.compositeAssociateServiceJson?.length > 1 && (
                  <button
                    className="btn btn-sm my-4 mx-1 delete border-danger bg-white text-danger"
                    onClick={deleteRowService}
                  >
                    Delete
                  </button>
                )}
              </div>
              <div className="col-md-6 col-12 my-2">
                <h3 className="my-5">Sales</h3>
                <label className="form-label">
                  Selling Price<span className="text-danger">*</span>
                </label>
                <div className="input-group mb-3">
                  <span className="input-group-text">INR</span>{" "}
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
                <div className="input-group mb-3">
                  <span className="input-group-text">INR</span>{" "}
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
                        name="accountSalesId"
                        className={`form-select form-select-sm  ${
                          formik.touched.accountSalesId &&
                          formik.errors.accountSalesId
                            ? "is-invalid"
                            : ""
                        }`}
                        {...formik.getFieldProps("accountSalesId")}
                      >
                        <option></option>
                        <option value="1">General Income</option>
                        <option value="2">Sales</option>
                        <option value="3">Discount</option>
                      </select>
                      {formik.touched.accountSalesId &&
                        formik.errors.accountSalesId && (
                          <div className="invalid-feedback">
                            {formik.errors.accountSalesId}
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
                        name="accountPurchaseId"
                        className={`form-select form-select-sm  ${
                          formik.touched.accountPurchaseId &&
                          formik.errors.accountPurchaseId
                            ? "is-invalid"
                            : ""
                        }`}
                        {...formik.getFieldProps("accountPurchaseId")}
                      >
                        <option></option>
                        <option value="1">Cost of Goods Sold</option>
                        <option value="2">Materials</option>
                        <option value="3">Labor</option>
                      </select>
                      {formik.touched.accountPurchaseId &&
                        formik.errors.accountPurchaseId && (
                          <div className="invalid-feedback">
                            {formik.errors.accountPurchaseId}
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
