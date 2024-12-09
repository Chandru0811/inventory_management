import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import api from "../../../../config/URL";
import toast from "react-hot-toast";

const PurchaseReceiveEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoadIndicator] = useState(false);

  const validationSchema = Yup.object({
    vendorName: Yup.string().required("*Vendor Name is required"),
    // purchaseOrder: Yup.string().required("*Purchase Order is required"),
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
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      setLoadIndicator(true);
      try {
        const response = await api.put(`/updatePurchaseReceives/${id}`, values);
        if (response.status === 200) {
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

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await api.get(`/getAllPurchaseReceivesById/${id}`);
        const rest = response.data;
        const formattedData = {
            ...rest,
            receivedDate: rest.receivedDate
              ? new Date(rest.receivedDate).toISOString().split("T")[0]
              : undefined,
          };
          formik.setValues(formattedData);
      } catch (e) {
        toast.error("Error fetching data: ", e?.response?.data?.message);
      }
    };

    getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="container-fluid px-2  minHeight m-0">
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
            <div className="col-md-6 col-12 mb-3">
                <lable className="form-lable">
                  Vendor Name<span className="text-danger">*</span>
                </lable>
                <div className="mb-3">
                  <select
                    {...formik.getFieldProps("vendorName")}
                    className={`form-select    ${
                      formik.touched.vendorName && formik.errors.vendorName
                        ? "is-invalid"
                        : ""
                    }`}
                  >
                    <option selected></option>
                    <option value="John Smith">John Smith</option>
                    <option value="Emily Johnson">Emily Johnson</option>
                    <option value="David Williams">David Williams</option>
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
                  Purchase Order Number<span className="text-danger">*</span>
                </lable>
                <div className="mb-3">
                  <input
                    type="text"
                    name="purchaseOrder"
                    className={`form-control  ${
                      formik.touched.purchaseOrder && formik.errors.purchaseOrder
                        ? "is-invalid"
                        : ""
                    }`}
                    {...formik.getFieldProps("purchaseOrder")}
                  />
                  {formik.touched.purchaseOrder && formik.errors.purchaseOrder && (
                    <div className="invalid-feedback">
                      {formik.errors.purchaseOrder}
                    </div>
                  )}
                </div>
              </div>
              <div className="col-md-6 col-12 mb-2">
                <lable className="form-lable">
                  Purchase Receive Number<span className="text-danger">*</span>
                </lable>
                <div className="mb-3">
                  <input
                    type="text"
                    name="purchaseReceiveNum"
                    className={`form-control ${
                      formik.touched.purchaseReceiveNum &&
                      formik.errors.purchaseReceiveNum
                        ? "is-invalid"
                        : ""
                    }`}
                    {...formik.getFieldProps("purchaseReceiveNum")}
                  />
                  {formik.touched.purchaseReceiveNum &&
                    formik.errors.purchaseReceiveNum && (
                      <div className="invalid-feedback">
                        {formik.errors.purchaseReceiveNum}
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
                    className={`form-control  ${
                      formik.touched.receivedDate && formik.errors.receivedDate
                        ? "is-invalid"
                        : ""
                    }`}
                    {...formik.getFieldProps("receivedDate")}
                  />
                  {formik.touched.receivedDate && formik.errors.receivedDate && (
                    <div className="invalid-feedback">
                      {formik.errors.receivedDate}
                    </div>
                  )}
                </div>
              </div>
              <div className="col-md-6 col-12 mb-2">
                <lable className="form-lable">
                  Notes
                </lable>
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
