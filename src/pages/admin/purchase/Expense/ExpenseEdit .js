import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import toast from "react-hot-toast";
import api from "../../../../config/URL";

const ExpenseEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoadIndicator] = useState(false);
  const [data, setData] = useState([]);

  const validationSchema = Yup.object({
    date: Yup.string().required("*Date is required"),
    categoryName: Yup.string().required("*Category Name is required"),
    amount: Yup.string().required("*Amount is required"),
  });

  const formik = useFormik({
    initialValues: {
      categoryName: "",
      currency: "",
      date: "",
      amount: "",
      taxName: "",
      taxAmount: "",
      vendorName: "",
      vendorRef: "",
      notes: "",
      customerName: "",
      receiptPic: null,
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      setLoadIndicator(true);
      console.log(values);

      const formData = new FormData();
      // Append each value to the FormData instance
      for (const key in values) {
        if (values.hasOwnProperty(key)) {
          formData.append(key, values[key]);
        }
      }

      try {
        const response = await api.put(
          `update-expense-attach/${id}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        if (response.status === 200) {
          toast.success(response.data.message);
          navigate("/expense");
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
        const response = await api.get(`getAllExpensesById/${id}`);
        formik.setValues(response.data);
        setData(response.data);
      } catch (error) {
        toast.error(error.message);
      }
    };
    getData();
  }, [id]);

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
                  <h1 className="h4 ls-tight headingColor">Edit Expense</h1>
                </div>
              </div>
              <div className="col-auto">
                <div className="hstack gap-2 justify-content-end">
                  <Link to="/expense">
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
                <lable className="form-lable">Customer Name</lable>
                <div className="mb-3">
                  <input
                    type="text"
                    name="customerName"
                    className={`form-control  ${
                      formik.touched.customerName && formik.errors.customerName
                        ? "is-invalid"
                        : ""
                    }`}
                    {...formik.getFieldProps("customerName")}
                  />
                  {formik.touched.customerName &&
                    formik.errors.customerName && (
                      <div className="invalid-feedback">
                        {formik.errors.customerName}
                      </div>
                    )}
                </div>
              </div>
              <div className="col-md-6 col-12 mb-2">
                <lable className="form-lable">
                  Category Name<span className="text-danger">*</span>
                </lable>
                <div className="mb-3">
                  <input
                    type="text"
                    name="categoryName"
                    className={`form-control ${
                      formik.touched.categoryName && formik.errors.categoryName
                        ? "is-invalid"
                        : ""
                    }`}
                    {...formik.getFieldProps("categoryName")}
                  />
                  {formik.touched.categoryName &&
                    formik.errors.categoryName && (
                      <div className="invalid-feedback">
                        {formik.errors.categoryName}
                      </div>
                    )}
                </div>
              </div>
              <div className="col-md-6 col-12 mb-2">
                <lable className="form-lable">Currency</lable>
                <div className="mb-3">
                  <select
                    type="text"
                    name="currency"
                    className={`form-select  ${
                      formik.touched.currency && formik.errors.currency
                        ? "is-invalid"
                        : ""
                    }`}
                    {...formik.getFieldProps("currency")}
                  >
                    <option></option>
                    <option value="INR">Indian Rupee</option>
                    <option value="SGD">Singapore Dollar</option>
                  </select>
                  {formik.touched.currency && formik.errors.currency && (
                    <div className="invalid-feedback">
                      {formik.errors.currency}
                    </div>
                  )}
                </div>
              </div>

              <div className="col-md-6 col-12 mb-2">
                <lable className="form-lable">
                  Date<span className="text-danger">*</span>
                </lable>
                <div className="mb-3">
                  <input
                    type="date"
                    name="date"
                    className={`form-control ${
                      formik.touched.date && formik.errors.date
                        ? "is-invalid"
                        : ""
                    }`}
                    {...formik.getFieldProps("date")}
                  />
                  {formik.touched.date && formik.errors.date && (
                    <div className="invalid-feedback">{formik.errors.date}</div>
                  )}
                </div>
              </div>
              <div className="col-md-6 col-12 mb-2">
                <lable className="form-lable">
                  Amount<span className="text-danger">*</span>
                </lable>
                <div className="mb-3">
                  <input
                    type="text"
                    name="amount"
                    className={`form-control  ${
                      formik.touched.amount && formik.errors.amount
                        ? "is-invalid"
                        : ""
                    }`}
                    {...formik.getFieldProps("amount")}
                  />
                  {formik.touched.amount && formik.errors.amount && (
                    <div className="invalid-feedback">
                      {formik.errors.amount}
                    </div>
                  )}
                </div>
              </div>

              <div className="col-md-6 col-12 mb-2">
                <lable className="form-lable">Tax Name</lable>
                <div className="mb-3">
                  <input
                    type="text"
                    name="taxName"
                    className={`form-control  ${
                      formik.touched.taxName && formik.errors.taxName
                        ? "is-invalid"
                        : ""
                    }`}
                    {...formik.getFieldProps("taxName")}
                  />
                  {formik.touched.taxName && formik.errors.taxName && (
                    <div className="invalid-feedback">
                      {formik.errors.taxName}
                    </div>
                  )}
                </div>
              </div>

              <div className="col-md-6 col-12 mb-2">
                <lable className="form-lable">Tax Amount</lable>
                <div className="mb-3">
                  <input
                    type="text"
                    name="taxAmount"
                    className={`form-control  ${
                      formik.touched.taxAmount && formik.errors.taxAmount
                        ? "is-invalid"
                        : ""
                    }`}
                    {...formik.getFieldProps("taxAmount")}
                  />
                  {formik.touched.taxAmount && formik.errors.taxAmount && (
                    <div className="invalid-feedback">
                      {formik.errors.taxAmount}
                    </div>
                  )}
                </div>
              </div>

              <div className="col-md-6 col-12 mb-2">
                <lable className="form-lable">Vendor Name</lable>
                <div className="mb-3">
                  <input
                    type="text"
                    name="vendorName"
                    className={`form-control  ${
                      formik.touched.vendorName && formik.errors.vendorName
                        ? "is-invalid"
                        : ""
                    }`}
                    {...formik.getFieldProps("vendorName")}
                  />
                  {formik.touched.vendorName && formik.errors.vendorName && (
                    <div className="invalid-feedback">
                      {formik.errors.vendorName}
                    </div>
                  )}
                </div>
              </div>

              <div className="col-md-6 col-12 mb-2">
                <lable className="form-lable">Vendor Reference</lable>
                <div className="mb-3">
                  <input
                    type="text"
                    name="vendorRef"
                    className={`form-control  ${
                      formik.touched.vendorRef && formik.errors.vendorRef
                        ? "is-invalid"
                        : ""
                    }`}
                    {...formik.getFieldProps("vendorRef")}
                  />
                  {formik.touched.vendorRef && formik.errors.vendorRef && (
                    <div className="invalid-feedback">
                      {formik.errors.vendorRef}
                    </div>
                  )}
                </div>
              </div>

              {/* <div className="col-md-6 col-12 mb-2">
                <lable className="form-lable">Receipt</lable>
                <div className="mb-3">
                  <input
                    type="file"
                    // onChange={(event) => {
                    //   formik.setFieldValue("receiptPic", event.target.files[0]);
                    // }}
                    // onBlur={formik.handleBlur}
                    className={`form-control ${
                      formik.touched.receiptPic && formik.errors.receiptPic
                        ? "is-invalid"
                        : ""
                    }`}
                    {...formik.getFieldProps("receiptPic")}
                  />
                  {formik.touched.receiptPic && formik.errors.receiptPic && (
                    <div className="invalid-feedback">
                      {formik.errors.receiptPic}
                    </div>
                  )}
                </div>
              </div> */}

              <div className="col-md-6 col-12 mb-2">
                <lable className="form-lable">Receipt</lable>
                <div className="mb-3">
                  <input
                    type="file"
                    className="form-control"
                    onChange={(event) => {
                      formik.setFieldValue("receiptPic", event.target.files[0]);
                    }}
                    onBlur={formik.handleBlur}
                  />
                  {formik.touched.receiptPic && formik.errors.receiptPic && (
                    <div className="invalid-feedback">{formik.errors.receiptPic}</div>
                  )}
                </div>
                <img
                  src={data.receiptPic}
                  className="img-fluid ms-2 w-50 rounded mt-2"
                  alt="Profile Image"
                />
              </div>

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

export default ExpenseEdit;
