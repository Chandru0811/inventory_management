import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import api from "../../../../config/URL";
import toast from "react-hot-toast";
import { SlTrash } from "react-icons/sl";

const ItemGroupEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoadIndicator] = useState(false);
  const [data, setData] = useState([]);
  const [multipleItemsJson, setMultipleItemsJson] = useState([{ itemAttribute: "", itemOptions: "" }]);

  const validationSchema = Yup.object({
    itemGroupName: Yup.string().required("*Item Group Name is required"),
    type: Yup.string().required("*Type is required"),
    itemUnit: Yup.string().required("*Item Unit is required"),
    multipleItems: Yup.string().required("*Multiple Items is required"),
    itemAttribute: Yup.string().required("*Item Attribute is required"),
    itemOptions: Yup.string().required("*Item Options is required"),
  });

  const formik = useFormik({
    initialValues: {
      itemGroupName: "",
      description: "",   
      itemUnit: "",
      tax: "",
      manufacturerName: "",
      brandName: "",       
      itemType: "",     
      salesAccount: "",
      purchaseAccount: "",
      inventoryAccount: "",
      itemImage: "",     
      salesId: "",
      purchaseId: "",
      multipleItemsJson,
      itemId: "",
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
        const response = await api.put(`/updateItemGroup/${id}`, values, {
            headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        if (response.status === 201) {
          toast.success(response.data.message);
          navigate("/itemgroup");
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

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await api.get(`/getAllItemGroupsById/${id}`);
        formik.setValues(response.data);
        setData(response.data);
      } catch (e) {
        toast.error("Error fetching data: ", e?.response?.data?.message);
      }
    };

    getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAddItem = () => {
    setMultipleItemsJson([...multipleItemsJson, { itemAttribute: "", itemOptions: "" }]);
    formik.setFieldValue("multipleItemsJson", [
      ...multipleItemsJson,
      { itemAttribute: "", itemOptions: "" },
    ]);
  };

  const handleRemoveItem = (index) => {
    const updatedItems = multipleItemsJson.filter((_, i) => i !== index);
    setMultipleItemsJson(updatedItems);
    formik.setFieldValue("multipleItemsJson", updatedItems);
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
                  <h1 className="h4 ls-tight headingColor">Edit Item Group</h1>
                </div>
              </div>
              <div className="col-auto">
                <div className="hstack gap-2 justify-content-end">
                  <Link to="/itemgroup">
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
                <lable className="form-lable">Manaufacture Name</lable>
                <div className="mb-3">
                  <input
                    type="text"
                    name="manufacturerName"
                    className={`form-control form-control-sm ${
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
                    className={`form-control form-control-sm ${
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
                <lable className="form-lable">
                  Multiple Items
                  <span className="text-danger">*</span>
                </lable>
                <div className="mb-3">
                  <input
                    type="text"
                    name="multipleItems"
                    className={`form-control form-control-sm ${
                      formik.touched.multipleItems &&
                      formik.errors.multipleItems
                        ? "is-invalid"
                        : ""
                    }`}
                    {...formik.getFieldProps("multipleItems")}
                  />
                  {formik.touched.multipleItems &&
                    formik.errors.multipleItems && (
                      <div className="invalid-feedback">
                        {formik.errors.multipleItems}
                      </div>
                    )}
                </div>
              </div>
              <div className="col-md-6 col-12 mb-2">
                <lable className="form-lable">
                  Item Attribute<span className="text-danger">*</span>
                </lable>
                <div className="mb-3">
                  <input
                    type="text"
                    name="itemAttribute"
                    className={`form-control form-control-sm ${
                      formik.touched.itemAttribute &&
                      formik.errors.itemAttribute
                        ? "is-invalid"
                        : ""
                    }`}
                    {...formik.getFieldProps("itemAttribute")}
                  />
                  {formik.touched.itemAttribute &&
                    formik.errors.itemAttribute && (
                      <div className="invalid-feedback">
                        {formik.errors.itemAttribute}
                      </div>
                    )}
                </div>
              </div>
              <div className="col-md-6 col-12 mb-2">
                <lable className="form-lable">
                  Item Options
                  <span className="text-danger">*</span>
                </lable>
                <div className="mb-3">
                  <input
                    type="text"
                    name="itemOptions"
                    className={`form-control form-control-sm ${
                      formik.touched.itemOptions && formik.errors.itemOptions
                        ? "is-invalid"
                        : ""
                    }`}
                    {...formik.getFieldProps("itemOptions")}
                  />
                  {formik.touched.itemOptions && formik.errors.itemOptions && (
                    <div className="invalid-feedback">
                      {formik.errors.itemOptions}
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
                <lable className="form-lable">
                  Inventory Account
                </lable>
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
                <img
                  src={data.itemImage}
                  className="img-fluid ms-2 w-50 rounded mt-2"
                  alt="Profile Image"
                />
              </div>
            </div>
          </div>
          <div className="container">
            <h4 className="mb-3">Multiple Items</h4>
            {multipleItemsJson.map((item, index) => (
              <div className="row" key={index}>
                <div className="col-md-4 col-12 mb-2">
                  <label className="form-label">
                    Item Attribute<span className="text-danger">*</span>
                  </label>
                  <div className="mb-3">
                    <input
                      type="text"
                      name={`multipleItemsJson[${index}].itemAttribute`}
                      className={`form-control form-control-sm ${
                        formik.touched.multipleItemsJson?.[index]?.itemAttribute &&
                        formik.errors.multipleItemsJson?.[index]?.itemAttribute
                          ? "is-invalid"
                          : ""
                      }`}
                      value={formik.values.multipleItemsJson[index].itemAttribute}
                      onChange={formik.handleChange}
                    />
                    {formik.touched.multipleItemsJson?.[index]?.itemAttribute &&
                      formik.errors.multipleItemsJson?.[index]?.itemAttribute && (
                        <div className="invalid-feedback">
                          {formik.errors.multipleItemsJson[index].itemAttribute}
                        </div>
                      )}
                  </div>
                </div>
                <div className="col-md-4 col-12 mb-2">
                  <label className="form-label">
                    Item Options<span className="text-danger">*</span>
                  </label>
                  <div className="mb-3">
                    <input
                      type="text"
                      name={`multipleItemsJson[${index}].itemOptions`}
                      className={`form-control form-control-sm ${
                        formik.touched.multipleItemsJson?.[index]?.itemOptions &&
                        formik.errors.multipleItemsJson?.[index]?.itemOptions
                          ? "is-invalid"
                          : ""
                      }`}
                      value={formik.values.multipleItemsJson[index].itemOptions}
                      onChange={formik.handleChange}
                    />
                    {formik.touched.multipleItemsJson?.[index]?.itemOptions &&
                      formik.errors.multipleItemsJson?.[index]?.itemOptions && (
                        <div className="invalid-feedback">
                          {formik.errors.multipleItemsJson[index].itemOptions}
                        </div>
                      )}
                  </div>
                </div>
                <div className="col-md-4 col-12 mt-5 pt-4">
                  <span
                    onClick={() => handleRemoveItem(index)}
                    style={{ cursor: "pointer" }}
                  >
                    <SlTrash style={{ color: "red" }} />
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

export default ItemGroupEdit;
