import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import api from "../../../../config/URL";
import toast from "react-hot-toast";
import { SlTrash } from "react-icons/sl";

const ItemGroupAdd = () => {
  const navigate = useNavigate();
  const [loading, setLoadIndicator] = useState(false);
  const [manufacture, setManufacture] = useState(null);
  const [brandId, setBrandId] = useState(null);

  const validationSchema = Yup.object({
    itemGroupName: Yup.string().required("*Item Group Name is required"),
    type: Yup.string().required("*Type is required"),
    itemUnit: Yup.string().required("*Item Unit is required"),
    multipleItemsJson: Yup.array()
      .of(
        Yup.object({
          attribute: Yup.string().required("Item Attribute is required"),
          options: Yup.array()
            .of(Yup.string().required("Item option is required"))
            .min(1, "At least one item option is required"),
        })
      )
      .min(1, "At least one item is required"),
  });

  const formik = useFormik({
    initialValues: {
      itemGroupName: "",
      description: "",
      itemUnit: "",
      tax: "",
      manufacturerName: "",
      brandName: "",
      type: "",
      salesAccount: "",
      purchaseAccount: "",
      inventoryAccount: "",
      multipleItemsJson: [{ attribute: "", options: [] }],
      file: null,
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      setLoadIndicator(true);

      const formData = new FormData();
      formData.append("type", values.type);
      formData.append("itemGroupName", values.itemGroupName);
      formData.append("description", values.description);
      formData.append("itemUnit", values.itemUnit);
      formData.append("tax", values.tax);
      // formData.append("manufacturerName", values.manufacturerName);
      formData.append("brandName", values.brandName);
      formData.append(
        "multipleItemsJson",
        JSON.stringify(values.multipleItemsJson)
      );
      formData.append("salesAccount", values.salesAccount);
      formData.append("purchaseAccount", values.purchaseAccount);
      formData.append("inventoryAccount", values.inventoryAccount);
      formData.append("file", values.file);
      try {
        const response = await api.post("/createItemGroup", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        if (response.status === 201) {
          toast.success(response.data.message);
          navigate("/itemgroup");
        } else {
          toast.error(response.data.message || "Something went wrong");
        }
      } catch (error) {
        toast.error("Error fetching data: ", error?.response?.data?.message);
      } finally {
        setLoadIndicator(false);
      }
    },
  });
  // console.log("formkmultipleItemsJson", formik.values.multipleItemsJson);
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
    const fetchItemGroupData = async () => {
      try {
        const response = await api.get("getItemGroup");
        const itemGroupData = response.data;

        const updatedmultipleItemsJson = itemGroupData.multipleItemsJson.map(
          (item) => ({
            attribute: item.attribute,
            options: item.options,
          })
        );

        formik.setFieldValue("multipleItemsJson", updatedmultipleItemsJson);
      } catch (error) {
        console.error("Error fetching item group data:", error);
      }
    };

    fetchItemGroupData();
  }, []);

  const handleAddItem = () => {
    formik.setFieldValue("multipleItemsJson", [
      ...formik.values.multipleItemsJson,
      { attribute: "", options: [] },
    ]);
  };

  const handleRemoveItem = (index) => {
    const updatedItems = formik.values.multipleItemsJson.filter(
      (_, i) => i !== index
    );
    formik.setFieldValue("multipleItemsJson", updatedItems);
  };

  useEffect(() => {
    const fetchManufacturers = async () => {
      try {
        const response = await api.get("getAllManufacturers");
        setManufacture(response.data);
      } catch (error) {
        console.error("Error fetching manufacturers:", error);
      }
    };
    fetchManufacturers();
  }, []);

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const response = await api.get("getAllBrands");
        setBrandId(response.data);
      } catch (error) {
        console.error("Error fetching brands:", error);
      }
    };
    fetchBrands();
  }, []);

  return (
    <div className="container-fluid px-2 minHeight m-0">
      <form onSubmit={formik.handleSubmit}>
        <div
          className="card shadow border-0 mb-2 top-header sticky-top"
          style={{ borderRadius: "0" }}
        >
          <div className="container-fluid py-4">
            <div className="row align-items-center">
              <div className="col">
                <div className="d-flex align-items-center gap-4">
                  <h1 className="h4 ls-tight headingColor">Add Item Group</h1>
                </div>
              </div>
              <div className="col-auto">
                <div className="hstack gap-2 justify-content-end">
                  <Link to="/itemgroup">
                    <button type="button" className="btn btn-sm btn-light">
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
          className="card shadow border-0 my-2 pb-3"
          style={{ borderRadius: "0" }}
        >
          <div className="row mt-3 me-2">
            <div className="col-12 text-end"></div>
          </div>
          <div className="container mb-5">
            <div className="row py-4">
              <div className="col-md-6 col-12 mb-2">
                <lable className="form-lable">
                  Item Group Name<span className="text-danger">*</span>
                </lable>
                <div className="mb-3">
                  <input
                    type="text"
                    name="itemGroupName"
                    className={`form-control form-control-sm ${
                      formik.touched.itemGroupName &&
                      formik.errors.itemGroupName
                        ? "is-invalid"
                        : ""
                    }`}
                    {...formik.getFieldProps("itemGroupName")}
                  />
                  {formik.touched.itemGroupName &&
                    formik.errors.itemGroupName && (
                      <div className="invalid-feedback">
                        {formik.errors.itemGroupName}
                      </div>
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
                <lable className="form-lable">
                  Unit<span className="text-danger">*</span>
                </lable>
                <div className="mb-3">
                  <select
                    name="itemUnit"
                    className={`form-select form-select-sm ${
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
                <lable className="form-lable">Tax</lable>
                <div className="mb-3">
                  <input
                    type="text"
                    name="tax"
                    className={`form-control form-control-sm ${
                      formik.touched.tax && formik.errors.tax
                        ? "is-invalid"
                        : ""
                    }`}
                    {...formik.getFieldProps("tax")}
                  />
                  {formik.touched.tax && formik.errors.tax && (
                    <div className="invalid-feedback">{formik.errors.tax}</div>
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
                <label className="form-label">Brand Name</label>
                <div className="mb-3">
                  <select
                    name="brandName"
                    className={`form-select form-select-sm ${
                      formik.touched.brandName && formik.errors.brandName
                        ? "is-invalid"
                        : ""
                    }`}
                    {...formik.getFieldProps("brandName")}
                  >
                    <option selected></option>
                    {brandId &&
                      brandId.map((data) => (
                        <option key={data.id} value={data.id}>
                          {data.brandName}
                        </option>
                      ))}
                  </select>
                  {formik.touched.brandName && formik.errors.brandName && (
                    <div className="invalid-feedback">
                      {formik.errors.brandName}
                    </div>
                  )}
                </div>
              </div>
              <div className="col-md-6 col-12 mb-2">
                <lable className="form-lable">Sales Account</lable>
                <div className="mb-3">
                  <input
                    type="text"
                    name="salesAccount"
                    className={`form-control form-control-sm ${
                      formik.touched.salesAccount && formik.errors.salesAccount
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
                <lable className="form-lable">Purchase Account</lable>
                <div className="mb-3">
                  <input
                    type="text"
                    name="purchaseAccount"
                    className={`form-control form-control-sm ${
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
                <lable className="form-lable">Inventory Account</lable>
                <div className="mb-3">
                  <select
                    name="inventoryAccount"
                    className={`form-select form-select-sm ${
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
                <lable className="form-lable">Image</lable>
                <div className="mb-3">
                  <input
                    type="file"
                    className="form-control form-control-sm"
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
          </div>
          <div className="container">
            <h4 className="mb-3">Multiple Items</h4>
            {formik.values.multipleItemsJson.map((item, index) => (
              <div className="row text-center" key={index}>
                <div className="col-md-5 col-12 mb-2">
                  <label className="form-label">
                    Item Attribute<span className="text-danger">*</span>
                  </label>
                  <div className="mb-3">
                    <input
                      type="text"
                      name={`multipleItemsJson[${index}].attribute`}
                      className={`form-control form-control-sm ${
                        formik.touched.multipleItemsJson?.[index]?.attribute &&
                        formik.errors.multipleItemsJson?.[index]?.attribute
                          ? "is-invalid"
                          : ""
                      }`}
                      value={formik.values.multipleItemsJson[index].attribute}
                      onChange={formik.handleChange}
                    />
                    {formik.touched.multipleItemsJson?.[index]?.attribute &&
                      formik.errors.multipleItemsJson?.[index]?.attribute && (
                        <div className="invalid-feedback">
                          {formik.errors.multipleItemsJson[index].attribute}
                        </div>
                      )}
                  </div>
                </div>
                <div className="col-md-5 col-5 mb-3">
                  <label className="form-label">
                    Item Options<span className="text-danger">*</span>
                  </label>
                  <div
                    className={`form-control form-control-sm ${
                      formik.touched.options && formik.errors.options
                        ? "is-invalid"
                        : ""
                    }`}
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: "5px",
                      alignItems: "center",
                      minHeight: "38px",
                    }}
                  >
                    {formik.values.multipleItemsJson[index].options.map(
                      (tag, optionIndex) => (
                        <span
                          key={optionIndex}
                          className="badge bg-primary text-white d-flex align-items-center"
                          style={{ padding: "5px 10px", borderRadius: "10px" }}
                        >
                          {tag}
                          <button
                            type="button"
                            className="btn-close btn-close-white ms-2"
                            style={{ fontSize: "10px", lineHeight: 1 }}
                            onClick={() => {
                              const updatedTags = [
                                ...formik.values.multipleItemsJson[index]
                                  .options,
                              ];
                              updatedTags.splice(optionIndex, 1);
                              formik.setFieldValue(
                                `multipleItemsJson[${index}].options`,
                                updatedTags
                              );
                            }}
                          />
                        </span>
                      )
                    )}
                    <input
                      type="text"
                      className="border-0"
                      style={{ flex: 1, outline: "none", minWidth: "150px" }}
                      value={formik.values.newTag?.[index] || ""}
                      onChange={(e) =>
                        formik.setFieldValue(`newTag[${index}]`, e.target.value)
                      }
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          if (formik.values.newTag) {
                            const updatedTags = [
                              ...formik.values.multipleItemsJson[index].options,
                              formik.values.newTag[index].trim(),
                            ];
                            formik.setFieldValue(
                              `multipleItemsJson[${index}].options`,
                              updatedTags
                            );
                            formik.setFieldValue(`newTag[${index}]`, "");
                          }
                        }
                      }}
                    />
                  </div>
                  {formik.touched.multipleItemsJson?.[index]?.options &&
                    formik.errors.multipleItemsJson?.[index]?.options && (
                      <div className="invalid-feedback">
                        {formik.errors.multipleItemsJson[index].options}
                      </div>
                    )}
                </div>
                <div className="col-md-2 col-12 mt-5 pt-4">
                  <span
                    type="button"
                    onClick={() => handleRemoveItem(index)}
                    className="text-danger"
                    title="Remove Item"
                  >
                    <SlTrash />
                  </span>
                </div>
              </div>
            ))}
            <div>
              <button
                type="button"
                className="btn btn-primary btn-sm"
                onClick={handleAddItem}
              >
                Add More
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ItemGroupAdd;
