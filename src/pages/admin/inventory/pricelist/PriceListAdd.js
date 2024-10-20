import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import api from "../../../../config/URL";
import toast from "react-hot-toast";

const PriceListAdd = () => {
  const navigate = useNavigate();
  const [loading, setLoadIndicator] = useState(false);

  const validationSchema = Yup.object({
    name: Yup.string().required("*Name is required"),
    roundOffTo: Yup.string().required("*Round Off To is required"),
    percentage: Yup.string().required("*Percentage is required"),
  });
  const formik = useFormik({
    initialValues: {
      // companyName: "",
      itemId: "",
      salesId: "",
      purchaseId: "",
      name: "",
      transactionType: "",
      priceListType: "",
      description: "",
      percentage: "",
      roundOffTo: "",
      pricingScheme: "",
      currency: "",
      // discount: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      setLoadIndicator(true);
      console.log(values);
      try {
        const response = await api.post("/createPriceList", values, {});
        if (response.status === 201) {
          toast.success(response.data.message);
          navigate("/pricelist");
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
                  <h1 className="h4 ls-tight headingColor">Add Price List</h1>
                </div>
              </div>
              <div className="col-auto">
                <div className="hstack gap-2 justify-content-end">
                  <Link to="/pricelist">
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
              <div className="col-md-6 col-12 mb-2">
                <lable className="form-lable">
                  Name <span className="text-danger">*</span>
                </lable>
                <div className="mb-3">
                  <input
                    type="text"
                    name="name"
                    className={`form-control ${formik.touched.name && formik.errors.name
                      ? "is-invalid"
                      : ""
                      }`}
                    {...formik.getFieldProps("name")}
                  />
                  {formik.touched.name && formik.errors.name && (
                    <div className="invalid-feedback">
                      {formik.errors.name}
                    </div>
                  )}
                </div>
              </div>
              <div className="col-md-6 col-12 mb-2">
                <lable className="form-lable">
                  Transaction Type<span className="text-danger">*</span>
                </lable>
                <div className="mb-3">
                  <input
                    type="text"
                    name="transactionType"
                    className={`form-control  ${formik.touched.transactionType && formik.errors.transactionType
                      ? "is-invalid"
                      : ""
                      }`}
                    {...formik.getFieldProps("transactionType")}
                  />
                  {formik.touched.transactionType && formik.errors.transactionType && (
                    <div className="invalid-feedback">
                      {formik.errors.transactionType}
                    </div>
                  )}
                </div>
              </div>

              <div className="col-md-6 col-12 mb-2">
                <lable className="form-lable">
                  Price List Type<span className="text-danger">*</span>
                </lable>
                <div className="mb-3">
                  <input
                    type="text"
                    name="priceListType"
                    className={`form-control ${formik.touched.priceListType &&
                      formik.errors.priceListType
                      ? "is-invalid"
                      : ""
                      }`}
                    {...formik.getFieldProps("priceListType")}
                  />
                  {formik.touched.priceListType &&
                    formik.errors.priceListType && (
                      <div className="invalid-feedback">
                        {formik.errors.priceListType}
                      </div>
                    )}
                </div>
              </div>
              <div className="col-md-6 col-12 mb-2">
                <lable className="form-lable">
                  Percentage<span className="text-danger">*</span>
                </lable>
                <div className="mb-3">
                  <input
                    type="text"
                    name="percentage"
                    className={`form-control  ${formik.touched.percentage && formik.errors.percentage
                      ? "is-invalid"
                      : ""
                      }`}
                    {...formik.getFieldProps("percentage")}
                  />
                  {formik.touched.percentage && formik.errors.percentage && (
                    <div className="invalid-feedback">
                      {formik.errors.percentage}
                    </div>
                  )}
                </div>
              </div>

              <div className="col-md-6 col-12 mb-2">
                <lable className="form-lable">
                  Round Off To<span className="text-danger">*</span>
                </lable>
                <div className="mb-3">
                  <input
                    type="text"
                    name="roundOffTo"
                    className={`form-control  ${formik.touched.roundOffTo && formik.errors.roundOffTo
                      ? "is-invalid"
                      : ""
                      }`}
                    {...formik.getFieldProps("roundOffTo")}
                  />
                  {formik.touched.roundOffTo && formik.errors.roundOffTo && (
                    <div className="invalid-feedback">
                      {formik.errors.roundOffTo}
                    </div>
                  )}
                </div>
              </div>

              <div className="col-md-6 col-12 mb-2">
                <lable className="form-lable">
                  Pricing Scheme<span className="text-danger">*</span>
                </lable>
                <div className="mb-3">
                  <input
                    type="text"
                    name="pricingScheme"
                    className={`form-control  ${formik.touched.pricingScheme &&
                      formik.errors.pricingScheme
                      ? "is-invalid"
                      : ""
                      }`}
                    {...formik.getFieldProps("pricingScheme")}
                  />
                  {formik.touched.pricingScheme &&
                    formik.errors.pricingScheme && (
                      <div className="invalid-feedback">
                        {formik.errors.pricingScheme}
                      </div>
                    )}
                </div>
              </div>
              <div className="col-md-6 col-12 mb-2">
                <lable className="form-lable">
                  Currency
                  <span className="text-danger">*</span>
                </lable>
                <div className="mb-3">
                  <input
                    type="text"
                    name="currency"
                    className={`form-control  ${formik.touched.currency && formik.errors.currency
                      ? "is-invalid"
                      : ""
                      }`}
                    {...formik.getFieldProps("currency")}
                  />
                  {formik.touched.currency && formik.errors.currency && (
                    <div className="invalid-feedback">
                      {formik.errors.currency}
                    </div>
                  )}
                </div>
              </div>
              {/* <div className="col-md-6 col-12 mb-2">
                <lable className="form-lable">
                  Discount
                  <span className="text-danger">*</span>
                </lable>
                <div className="mb-3">
                  <input
                    type="text"
                    name="discount"
                    className={`form-control  ${formik.touched.discount && formik.errors.discount
                      ? "is-invalid"
                      : ""
                      }`}
                    {...formik.getFieldProps("discount")}
                  />
                  {formik.touched.discount && formik.errors.discount && (
                    <div className="invalid-feedback">
                      {formik.errors.discount}
                    </div>
                  )}
                </div>
              </div> */}
              <div className="col-md-6 col-12 mb-2">
                <lable className="form-lable">
                  Description
                  <span className="text-danger">*</span>
                </lable>
                <div className="mb-3">
                  <textarea
                    type="text"
                    name="description"
                    className={`form-control  ${formik.touched.description && formik.errors.description
                      ? "is-invalid"
                      : ""
                      }`}
                    {...formik.getFieldProps("description")}
                  />
                  {formik.touched.description && formik.errors.description && (
                    <div className="invalid-feedback">
                      {formik.errors.description}
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

export default PriceListAdd;
