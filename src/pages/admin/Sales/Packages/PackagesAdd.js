import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import api from "../../../../config/URL";
import toast from "react-hot-toast";

const PackagesAdd = () => {
  const navigate = useNavigate();
  const [loading, setLoadIndicator] = useState(false);
  const [customerData, setCustomerData] = useState(null);

  const validationSchema = Yup.object({
    customerId: Yup.string().required("*Customer Name is required"),
    salesOrder: Yup.string().required("*Sales Order is required"),
    packageSlip: Yup.string().required("*Package Slip is required"),
    packageDate: Yup.string().required("*Package Date is required"),
  });

  const formik = useFormik({
    initialValues: {
      customerId: "",
      salesOrder: "",
      salesOrderItemsJson: [
        {
          itemId: "",
          ordered: "",
          received: "",
          quantity: "",
        },
      ],
      packageSlip: "",
      packageDate: "",
      internalNotes: "",
      salesId: "",
      itemId: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      setLoadIndicator(true);
      console.log(values);
      try {
        const response = await api.post("/createPackages", values, {});
        if (response.status === 201) {
          toast.success(response.data.message);
          navigate("/packages");
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
        const response = await api.get("getAllCustomerIdsWithNames");
        setCustomerData(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    getData();
  }, []);

  return (
    <div className="container-fluid p-2 minHeight m-0">
      <form onSubmit={formik.handleSubmit}>
        <div
          className="card shadow border-0 mb-2 top-header sticky-top"
          style={{ borderRadius: "0", top: "66px"  }}
        >
          <div className="container-fluid py-4">
            <div className="row align-items-center">
              <div className="col">
                <div className="d-flex align-items-center gap-4">
                  <h1 className="h4 ls-tight headingColor">Add Packages</h1>
                </div>
              </div>
              <div className="col-auto">
                <div className="hstack gap-2 justify-content-end">
                  <Link to="/packages">
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
                  Customer Name<span className="text-danger">*</span>
                </lable>
                <div className="mb-3">
                  <select
                    {...formik.getFieldProps("customerId")}
                    className={`form-select form-select-sm   ${
                      formik.touched.customerId && formik.errors.customerId
                        ? "is-invalid"
                        : ""
                    }`}
                  >
                    <option selected></option>
                    {customerData &&
                      customerData.map((data) => (
                        <option key={data.customer_id} value={data.customer_id}>
                          {data.customer_name}
                        </option>
                      ))}
                  </select>
                  {formik.touched.customerId && formik.errors.customerId && (
                    <div className="invalid-feedback">
                      {formik.errors.customerId}
                    </div>
                  )}
                </div>
              </div>

              <div className="col-md-6 col-12 mb-2">
                <lable className="form-lable">
                  Sales Order<span className="text-danger">*</span>
                </lable>
                <div className="mb-3">
                  <input
                    type="text"
                    name="salesOrder"
                    className={`form-control form-control-sm  ${
                      formik.touched.salesOrder && formik.errors.salesOrder
                        ? "is-invalid"
                        : ""
                    }`}
                    {...formik.getFieldProps("salesOrder")}
                  />
                  {formik.touched.salesOrder && formik.errors.salesOrder && (
                    <div className="invalid-feedback">
                      {formik.errors.salesOrder}
                    </div>
                  )}
                </div>
              </div>

              <div className="col-md-6 col-12 mb-2">
                <lable className="form-lable">
                  Package Slip<span className="text-danger">*</span>
                </lable>
                <div className="mb-3">
                  <input
                    type="text"
                    name="packageSlip"
                    className={`form-control form-control-sm  ${
                      formik.touched.packageSlip && formik.errors.packageSlip
                        ? "is-invalid"
                        : ""
                    }`}
                    {...formik.getFieldProps("packageSlip")}
                  />
                  {formik.touched.packageSlip && formik.errors.packageSlip && (
                    <div className="invalid-feedback">
                      {formik.errors.packageSlip}
                    </div>
                  )}
                </div>
              </div>

              <div className="col-md-6 col-12 mb-2">
                <lable className="form-lable">
                  Package Date<span className="text-danger">*</span>
                </lable>
                <div className="mb-3">
                  <input
                    type="date"
                    name="packageDate"
                    className={`form-control form-control-sm  ${
                      formik.touched.packageDate && formik.errors.packageDate
                        ? "is-invalid"
                        : ""
                    }`}
                    {...formik.getFieldProps("packageDate")}
                  />
                  {formik.touched.packageDate && formik.errors.packageDate && (
                    <div className="invalid-feedback">
                      {formik.errors.packageDate}
                    </div>
                  )}
                </div>
              </div>

              <div className="row mt-5 mb-4">
                <div>
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
                        <th style={{ width: "35%" }}>Item</th>
                        <th style={{ width: "15%" }}>Ordered</th>
                        <th style={{ width: "15%" }}>Received</th>
                        <th style={{ width: "20%" }}>Quantity to Pack</th>
                      </tr>
                    </thead>
                    <tbody>
                      {formik.values.salesOrderItemsJson?.map(
                        (item, index) => (
                          <tr key={index}>
                            <td>
                              <input
                                type="text"
                                name={`salesOrderItemsJson[${index}].itemId`}
                                className={`form-control form-control-sm ${
                                  formik.touched.salesOrderItemsJson?.[index]
                                    ?.itemId &&
                                  formik.errors.salesOrderItemsJson?.[index]
                                    ?.itemId
                                    ? "is-invalid"
                                    : ""
                                }`}
                                {...formik.getFieldProps(
                                  `salesOrderItemsJson[${index}].itemId`
                                )}
                                readOnly
                              />
                              {formik.touched.salesOrderItemsJson?.[index]
                                ?.itemId &&
                                formik.errors.salesOrderItemsJson?.[index]
                                  ?.itemId && (
                                  <div className="invalid-feedback">
                                    {
                                      formik.errors.salesOrderItemsJson[
                                        index
                                      ].itemId
                                    }
                                  </div>
                                )}
                            </td>
                            <td>
                              <input
                                type="text"
                                name={`salesOrderItemsJson[${index}].ordered`}
                                className={`form-control form-control-sm ${
                                  formik.touched.salesOrderItemsJson?.[index]
                                    ?.ordered &&
                                  formik.errors.salesOrderItemsJson?.[index]
                                    ?.ordered
                                    ? "is-invalid"
                                    : ""
                                }`}
                                {...formik.getFieldProps(
                                  `salesOrderItemsJson[${index}].ordered`
                                )}
                                readOnly
                              />
                              {formik.touched.salesOrderItemsJson?.[index]
                                ?.ordered &&
                                formik.errors.salesOrderItemsJson?.[index]
                                  ?.ordered && (
                                  <div className="invalid-feedback">
                                    {
                                      formik.errors.salesOrderItemsJson[
                                        index
                                      ].ordered
                                    }
                                  </div>
                                )}
                            </td>
                            <td>
                              <input
                                type="text"
                                name={`salesOrderItemsJson[${index}].received`}
                                className={`form-control form-control-sm ${
                                  formik.touched.salesOrderItemsJson?.[index]
                                    ?.received &&
                                  formik.errors.salesOrderItemsJson?.[index]
                                    ?.received
                                    ? "is-invalid"
                                    : ""
                                }`}
                                {...formik.getFieldProps(
                                  `salesOrderItemsJson[${index}].received`
                                )}
                                readOnly
                              />
                              {formik.touched.salesOrderItemsJson?.[index]
                                ?.received &&
                                formik.errors.salesOrderItemsJson?.[index]
                                  ?.received && (
                                  <div className="invalid-feedback">
                                    {
                                      formik.errors.salesOrderItemsJson[
                                        index
                                      ].received
                                    }
                                  </div>
                                )}
                            </td>
                            <td>
                              <input
                                type="text"
                                name={`salesOrderItemsJson[${index}].quantity`}
                                className={`form-control form-control-sm ${
                                  formik.touched.salesOrderItemsJson?.[index]
                                    ?.quantity &&
                                  formik.errors.salesOrderItemsJson?.[index]
                                    ?.quantity
                                    ? "is-invalid"
                                    : ""
                                }`}
                                {...formik.getFieldProps(
                                  `salesOrderItemsJson[${index}].quantity`
                                )}
                              />
                              {formik.touched.salesOrderItemsJson?.[index]
                                ?.quantity &&
                                formik.errors.salesOrderItemsJson?.[index]
                                  ?.quantity && (
                                  <div className="invalid-feedback">
                                    {
                                      formik.errors.salesOrderItemsJson[
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

              <div className="col-md-6 col-12 mb-2">
                <lable className="form-lable">Notes</lable>
                <div className="mb-3">
                  <textarea
                    type="text"
                    name="internalNotes"
                    className={`form-control form-control-sm  ${
                      formik.touched.internalNotes &&
                      formik.errors.internalNotes
                        ? "is-invalid"
                        : ""
                    }`}
                    rows="4"
                    {...formik.getFieldProps("internalNotes")}
                  />
                  {formik.touched.internalNotes &&
                    formik.errors.internalNotes && (
                      <div className="invalid-feedback">
                        {formik.errors.internalNotes}
                      </div>
                    )}
                </div>
              </div>

              {/* <div className="col-md-6 col-12 mb-2">
                <lable className="form-lable">
                  Customer Id<span className="text-danger">*</span>
                </lable>
                <div className="mb-3">
                  <input
                    type="text"
                    name="customerId"
                    className={`form-control  ${
                      formik.touched.customerId && formik.errors.customerId
                        ? "is-invalid"
                        : ""
                    }`}
                    {...formik.getFieldProps("customerId")}
                  />
                  {formik.touched.customerId && formik.errors.customerId && (
                    <div className="invalid-feedback">
                      {formik.errors.customerId}
                    </div>
                  )}
                </div>
              </div>
              <div className="col-md-6 col-12 mb-2">
                <lable className="form-lable">
                  Sales Id<span className="text-danger">*</span>
                </lable>
                <div className="mb-3">
                  <input
                    type="text"
                    name="salesId"
                    className={`form-control  ${
                      formik.touched.salesId && formik.errors.salesId
                        ? "is-invalid"
                        : ""
                    }`}
                    {...formik.getFieldProps("salesId")}
                  />
                  {formik.touched.salesId && formik.errors.salesId && (
                    <div className="invalid-feedback">
                      {formik.errors.salesId}
                    </div>
                  )}
                </div>
              </div>
              <div className="col-md-6 col-12 mb-2">
                <lable className="form-lable">
                  Item Id<span className="text-danger">*</span>
                </lable>
                <div className="mb-3">
                  <input
                    type="text"
                    name="itemId"
                    className={`form-control  ${
                      formik.touched.itemId && formik.errors.itemId
                        ? "is-invalid"
                        : ""
                    }`}
                    {...formik.getFieldProps("itemId")}
                  />
                  {formik.touched.itemId && formik.errors.itemId && (
                    <div className="invalid-feedback">
                      {formik.errors.itemId}
                    </div>
                  )}
                </div>
              </div> */}
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default PackagesAdd;
