import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import api from "../../../../config/URL";
import toast from "react-hot-toast";

const ItemGroupEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoadIndicator] = useState(false);
  const [data, setData] = useState([]);

  const validationSchema = Yup.object({
    itemGroupName: Yup.string().required("*Contact Name is required"),
  });

  const formik = useFormik({
    initialValues: {
      itemGroupName: "",
      description: "",   
      itemUnit: "",
      tax: "",
      manufacturerName: "",
      brandName: "",       
      multipleItems: "",
      itemAttribute: "",
      itemOptions: "", 
      itemType: "",     
      salesAccount: "",
      purchaseAccount: "",
      inventoryAccount: "",
      itemImage: "",     
      salesId: "",
      purchaseId: "",
      itemId: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      setLoadIndicator(true);
      console.log(values);
         // const formData = new FormData();
      // // Append each value to the FormData instance
      // for (const key in values) {
      //   if (values.hasOwnProperty(key)) {
      //     formData.append(key, values[key]);
      //   }
      // }

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
                  <h1 className="h4 ls-tight headingColor">Edit ItemGroup</h1>
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
                    className={`form-control ${formik.touched.itemGroupName && formik.errors.itemGroupName
                      ? "is-invalid"
                      : ""
                      }`}
                    {...formik.getFieldProps("itemGroupName")}
                  />
                  {formik.touched.itemGroupName && formik.errors.itemGroupName && (
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
                  Item Unit<span className="text-danger">*</span>
                </lable>
                <div className="mb-3">
                  <input
                    type="text"
                    name="itemUnit"
                    className={`form-control ${formik.touched.itemUnit &&
                      formik.errors.itemUnit
                      ? "is-invalid"
                      : ""
                      }`}
                    {...formik.getFieldProps("itemUnit")}
                  />
                  {formik.touched.itemUnit &&
                    formik.errors.itemUnit && (
                      <div className="invalid-feedback">
                        {formik.errors.itemUnit}
                      </div>
                    )}
                </div>
              </div>
              <div className="col-md-6 col-12 mb-2">
                <lable className="form-lable">
                  Tax<span className="text-danger">*</span>
                </lable>
                <div className="mb-3">
                  <input
                    type="text"
                    name="tax"
                    className={`form-control  ${formik.touched.tax && formik.errors.tax
                      ? "is-invalid"
                      : ""
                      }`}
                    {...formik.getFieldProps("tax")}
                  />
                  {formik.touched.tax && formik.errors.tax && (
                    <div className="invalid-feedback">
                      {formik.errors.tax}
                    </div>
                  )}
                </div>
              </div>

              <div className="col-md-6 col-12 mb-2">
                <lable className="form-lable">
                  Manaufacture Name<span className="text-danger">*</span>
                </lable>
                <div className="mb-3">
                  <input
                    type="text"
                    name="manufacturerName"
                    className={`form-control  ${formik.touched.manufacturerName && formik.errors.manufacturerName
                      ? "is-invalid"
                      : ""
                      }`}
                    {...formik.getFieldProps("manufacturerName")}
                  />
                  {formik.touched.manufacturerName && formik.errors.manufacturerName && (
                    <div className="invalid-feedback">
                      {formik.errors.manufacturerName}
                    </div>
                  )}
                </div>
              </div>

              <div className="col-md-6 col-12 mb-2">
                <lable className="form-lable">
                  Brand Name<span className="text-danger">*</span>
                </lable>
                <div className="mb-3">
                  <input
                    type="text"
                    name="brandName"
                    className={`form-control  ${formik.touched.brandName &&
                      formik.errors.brandName
                      ? "is-invalid"
                      : ""
                      }`}
                    {...formik.getFieldProps("brandName")}
                  />
                  {formik.touched.brandName &&
                    formik.errors.brandName && (
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
                    className={`form-control  ${formik.touched.multipleItems && formik.errors.multipleItems
                      ? "is-invalid"
                      : ""
                      }`}
                    {...formik.getFieldProps("multipleItems")}
                  />
                  {formik.touched.multipleItems && formik.errors.multipleItems && (
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
                    className={`form-control  ${formik.touched.itemAttribute &&
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
                    className={`form-control  ${formik.touched.itemOptions &&
                      formik.errors.itemOptions
                      ? "is-invalid"
                      : ""
                      }`}
                    {...formik.getFieldProps("itemOptions")}
                  />
                  {formik.touched.itemOptions &&
                    formik.errors.itemOptions && (
                      <div className="invalid-feedback">
                        {formik.errors.itemOptions}
                      </div>
                    )}
                </div>
              </div>
              {/* <div className="col-md-6 col-12 mb-2">
                <lable className="form-lable">
                  Item Type
                  <span className="text-danger">*</span>
                </lable>
                <div className="mb-3">
                  <input
                    type="text"
                    name="itemType"
                    className={`form-control  ${formik.touched.itemType && formik.errors.itemType
                      ? "is-invalid"
                      : ""
                      }`}
                    {...formik.getFieldProps("itemType")}
                  />
                  {formik.touched.itemType && formik.errors.itemType && (
                    <div className="invalid-feedback">
                      {formik.errors.itemType}
                    </div>
                  )}
                </div>
              </div> */}
              <div className="col-md-6 col-12 mb-2">
                <lable className="form-lable">
                  Sales Account
                  <span className="text-danger">*</span>
                </lable>
                <div className="mb-3">
                  <input
                    type="text"
                    name="salesAccount"
                    className={`form-control  ${formik.touched.salesAccount &&
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
                <lable className="form-lable">
                  Purchase Account
                  <span className="text-danger">*</span>
                </lable>
                <div className="mb-3">
                  <input
                    type="text"
                    name="purchaseAccount"
                    className={`form-control  ${formik.touched.purchaseAccount && formik.errors.purchaseAccount
                      ? "is-invalid"
                      : ""
                      }`}
                    {...formik.getFieldProps("purchaseAccount")}
                  />
                  {formik.touched.purchaseAccount && formik.errors.purchaseAccount && (
                    <div className="invalid-feedback">
                      {formik.errors.purchaseAccount}
                    </div>
                  )}
                </div>
              </div>
              <div className="col-md-6 col-12 mb-2">
                <lable className="form-lable">
                  Inventory Account
                  <span className="text-danger">*</span>
                </lable>
                <div className="mb-3">
                  <input
                    type="text"
                    name="inventoryAccount"
                    className={`form-control  ${formik.touched.inventoryAccount &&
                      formik.errors.inventoryAccount
                      ? "is-invalid"
                      : ""
                      }`}
                    {...formik.getFieldProps("inventoryAccount")}
                  />
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
                    className="form-control"
                    onChange={(event) => {
                      formik.setFieldValue("file", event.target.files[0]);
                    }}
                    onBlur={formik.handleBlur}
                  />
                  {formik.touched.file && formik.errors.file && (
                    <div className="invalid-feedback">
                      {formik.errors.file}
                    </div>
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
        </div>
      </form>
    </div>
  );
};

export default ItemGroupEdit;
