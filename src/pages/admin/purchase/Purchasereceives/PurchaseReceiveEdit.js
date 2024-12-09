import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import api from "../../../../config/URL";
import toast from "react-hot-toast";
import VendorList from "../../../list/VendorList";

const PurchaseReceiveEdit = () => {
  const navigate = useNavigate();
  const [loading, setLoadIndicator] = useState(false);
  const [vendor, setVendor] = useState(null);

  const validationSchema = Yup.object({
    vendorName: Yup.string().required("*Vendor Name is required"),
    purchaseOrder: Yup.string().required("*Purchase Order is required"),
    purchaseReceiveNum: Yup.string().required("*Purchase Receive is required"),
    receivedDate: Yup.string().required("*Received Date is required"),
  });
  const formik = useFormik({
    initialValues: {
      vendorName: "",
      purchaseOrder: "",
      notes: "",
      purchaseReceiveNum: "",
      receivedDate: "",
      purchaseOrderItemsJson: [
        {
          itemId: "",
          accountId: "",
          quantity: "",
          rate: "",
          amount: "",
        },
      ],
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      setLoadIndicator(true);
      try {
        const response = await api.put("/updatePurchaseReceives", values);
        if (response.status === 201) {
          toast.success(response.data.message);
          navigate("/purchasereceive");
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

  const getVendorName = async () => {
    try {
      const currencyData = await VendorList();
      setVendor(currencyData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    getVendorName();
  }, []);

  return (
    <div className="container-fluid px-2  minHeight m-0">
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
                    Edit Purchase Receives
                  </h1>
                </div>
              </div>
              <div className="col-auto">
                <div className="hstack gap-2 justify-content-end">
                  <Link to="/purchasereceive">
                    <button type="submit" className="btn btn-sm btn-light">
                      <span>Back</span>
                    </button>
                  </Link>
                  <button
                    type="submit"
                    className="btn btn-sm btn-buttonm btn-primary"
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
              <div className="col-md-6 col-12 mb-3">
                <lable className="form-lable">
                  Vendor Name<span className="text-danger">*</span>
                </lable>
                <div className="mb-3">
                  <select
                    {...formik.getFieldProps("vendorName")}
                    className={`form-select form-select-sm ${
                      formik.touched.vendorName && formik.errors.vendorName
                        ? "is-invalid"
                        : ""
                    }`}
                  >
                    <option selected></option>
                    {vendor &&
                      vendor.map((data) => (
                        <option key={data.id} value={data.id}>
                          {data.vendorDisplayName}
                        </option>
                      ))}
                  </select>
                  {formik.touched.vendorName && formik.errors.vendorName && (
                    <div className="invalid-feedback">
                      {formik.errors.vendorName}
                    </div>
                  )}
                </div>
              </div>
              <div className="col-md-6 col-12 mb-2">
                <lable className="form-lable">
                  Purchase Order<span className="text-danger">*</span>
                </lable>
                <div className="mb-3">
                  <input
                    type="text"
                    name="purchaseOrder"
                    className={`form-control form-control-sm ${
                      formik.touched.purchaseOrder &&
                      formik.errors.purchaseOrder
                        ? "is-invalid"
                        : ""
                    }`}
                    {...formik.getFieldProps("purchaseOrder")}
                  />
                  {formik.touched.purchaseOrder &&
                    formik.errors.purchaseOrder && (
                      <div className="invalid-feedback">
                        {formik.errors.purchaseOrder}
                      </div>
                    )}
                </div>
              </div>
              <div className="col-md-6 col-12 mb-2">
                <lable className="form-lable">
                  Received Date<span className="text-danger">*</span>
                </lable>
                <div className="mb-3">
                  <input
                    type="date"
                    name="receivedDate"
                    className={`form-control form-control-sm ${
                      formik.touched.receivedDate && formik.errors.receivedDate
                        ? "is-invalid"
                        : ""
                    }`}
                    {...formik.getFieldProps("receivedDate")}
                  />
                  {formik.touched.receivedDate &&
                    formik.errors.receivedDate && (
                      <div className="invalid-feedback">
                        {formik.errors.receivedDate}
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
                        <th style={{ width: "35%" }}>
                          Item Details
                        </th>
                        <th style={{ width: "15%" }}>Ordered</th>
                        <th style={{ width: "15%" }}>Received</th>
                        <th style={{ width: "15%" }}>In Transit</th>
                        <th style={{ width: "20%" }}>Quantity to Receive</th>
                      </tr>
                    </thead>
                    <tbody>
                      {formik.values.purchaseOrderItemsJson?.map(
                        (item, index) => (
                          <tr key={index}>
                            <td>
                              <input
                                type="text"
                                name={`purchaseOrderItemsJson[${index}].itemId`}
                                className={`form-control ${
                                  formik.touched.purchaseOrderItemsJson?.[index]
                                    ?.itemId &&
                                  formik.errors.purchaseOrderItemsJson?.[index]
                                    ?.itemId
                                    ? "is-invalid"
                                    : ""
                                }`}
                                {...formik.getFieldProps(
                                  `purchaseOrderItemsJson[${index}].itemId`
                                )}
                                readOnly
                              />
                              {formik.touched.purchaseOrderItemsJson?.[index]
                                ?.itemId &&
                                formik.errors.purchaseOrderItemsJson?.[index]
                                  ?.itemId && (
                                  <div className="invalid-feedback">
                                    {
                                      formik.errors.purchaseOrderItemsJson[
                                        index
                                      ].itemId
                                    }
                                  </div>
                                )}
                            </td>
                            <td>
                              <input
                                type="text"
                                name={`purchaseOrderItemsJson[${index}].ordered`}
                                className={`form-control ${
                                  formik.touched.purchaseOrderItemsJson?.[index]
                                    ?.ordered &&
                                  formik.errors.purchaseOrderItemsJson?.[index]
                                    ?.ordered
                                    ? "is-invalid"
                                    : ""
                                }`}
                                {...formik.getFieldProps(
                                  `purchaseOrderItemsJson[${index}].ordered`
                                )}
                                readOnly
                              />
                              {formik.touched.purchaseOrderItemsJson?.[index]
                                ?.ordered &&
                                formik.errors.purchaseOrderItemsJson?.[index]
                                  ?.ordered && (
                                  <div className="invalid-feedback">
                                    {
                                      formik.errors.purchaseOrderItemsJson[
                                        index
                                      ].ordered
                                    }
                                  </div>
                                )}
                            </td>
                            <td>
                              <input
                                type="text"
                                name={`purchaseOrderItemsJson[${index}].received`}
                                className={`form-control ${
                                  formik.touched.purchaseOrderItemsJson?.[index]
                                    ?.received &&
                                  formik.errors.purchaseOrderItemsJson?.[index]
                                    ?.received
                                    ? "is-invalid"
                                    : ""
                                }`}
                                {...formik.getFieldProps(
                                  `purchaseOrderItemsJson[${index}].received`
                                )}
                                readOnly
                              />
                              {formik.touched.purchaseOrderItemsJson?.[index]
                                ?.received &&
                                formik.errors.purchaseOrderItemsJson?.[index]
                                  ?.received && (
                                  <div className="invalid-feedback">
                                    {
                                      formik.errors.purchaseOrderItemsJson[
                                        index
                                      ].received
                                    }
                                  </div>
                                )}
                            </td>
                            <td>
                              <input
                                type="text"
                                name={`purchaseOrderItemsJson[${index}].transit`}
                                className={`form-control ${
                                  formik.touched.purchaseOrderItemsJson?.[index]
                                    ?.transit &&
                                  formik.errors.purchaseOrderItemsJson?.[index]
                                    ?.transit
                                    ? "is-invalid"
                                    : ""
                                }`}
                                {...formik.getFieldProps(
                                  `purchaseOrderItemsJson[${index}].transit`
                                )}
                                readOnly
                              />
                              {formik.touched.purchaseOrderItemsJson?.[index]
                                ?.transit &&
                                formik.errors.purchaseOrderItemsJson?.[index]
                                  ?.transit && (
                                  <div className="invalid-feedback">
                                    {
                                      formik.errors.purchaseOrderItemsJson[
                                        index
                                      ].transit
                                    }
                                  </div>
                                )}
                            </td>
                            <td>
                              <input
                                type="text"
                                name={`purchaseOrderItemsJson[${index}].quantity`}
                                className={`form-control ${
                                  formik.touched.purchaseOrderItemsJson?.[index]
                                    ?.quantity &&
                                  formik.errors.purchaseOrderItemsJson?.[index]
                                    ?.quantity
                                    ? "is-invalid"
                                    : ""
                                }`}
                                {...formik.getFieldProps(
                                  `purchaseOrderItemsJson[${index}].quantity`
                                )}
                              />
                              {formik.touched.purchaseOrderItemsJson?.[index]
                                ?.quantity &&
                                formik.errors.purchaseOrderItemsJson?.[index]
                                  ?.quantity && (
                                  <div className="invalid-feedback">
                                    {
                                      formik.errors.purchaseOrderItemsJson[
                                        index
                                      ].quantity
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
            </div>
            <div className="row">
              <div className="col-md-6 col-12 mb-2">
                <lable className="form-lable">Notes</lable>
                <div className="mb-3">
                  <textarea
                    type="text"
                    name="notes"
                    className={`form-control  ${
                      formik.touched.notes && formik.errors.notes
                        ? "is-invalid"
                        : ""
                    }`}
                    rows="4"
                    {...formik.getFieldProps("notes")}
                  />
                  {formik.touched.notes && formik.errors.notes && (
                    <div className="invalid-feedback">
                      {formik.errors.notes}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default PurchaseReceiveEdit;
