import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import api from "../../../../config/URL";
import toast from "react-hot-toast";

const PriceListEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoadIndicator] = useState(false);
  const [currency, setCurrency] = useState(null);

  const validationSchema = Yup.object().shape({
    name: Yup.string().required("*Name is required"),
    transactionType: Yup.string().required("*Transaction Type is required"),
    // roundOffTo: Yup.string()
    //   .nullable()
    //   .when("priceListType", {
    //     is: "AllItems",
    //     then: Yup.string().required("*Round off To is required"),
    //     otherwise: Yup.string().nullable(),
    //   }),
    // percentage: Yup.string()
    //   .nullable()
    //   .when("priceListType", {
    //     is: "AllItems",
    //     then: Yup.string().required("*Percentage is required"),
    //     otherwise: Yup.string().nullable(),
    //   }),
  });

  const formik = useFormik({
    initialValues: {
      name: "",
      transactionType: "",
      priceListType: "",
      description: "",
      percentage: "",
      roundOffTo: "",
      pricingScheme: "",
      currency: "",
      discount: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      setLoadIndicator(true);
      const payload = {
        name: values.name,
        transactionType: values.transactionType,
        priceListType: values.priceListType,
        description: values.description,
      };

      if (values.priceListType === "AllItems") {
        payload.percentage = values.percentage;
        payload.roundOffTo = values.roundOffTo;
      } else if (values.priceListType === "IndividualItems") {
        payload.pricingScheme = values.pricingScheme;
        payload.currency = values.currency;
        payload.discount = values.discount;
      }

      try {
        const response = await api.put(`/updatePriceList/${id}`, payload);
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

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await api.get("getAllCurrencyNameWithId");
        setCurrency(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    getData();
  }, []);

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await api.get(`/getAllPriceListById/${id}`);
        formik.setValues(response.data);
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
                  <h1 className="h4 ls-tight headingColor">Edit Price List</h1>
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
                    className={`form-control ${
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
                    Transaction Type<span className="text-danger">*</span>
                  </label>
                </div>
                <div className="form-check form-check-inline">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="transactionType"
                    id="Sales"
                    value="Sales"
                    onChange={formik.handleChange}
                    checked={formik.values.transactionType === "Sales"}
                    disabled
                  />
                  <label className="form-check-label">Sales</label>
                </div>
                <div className="form-check form-check-inline">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="transactionType"
                    id="Purchase"
                    value="Purchase"
                    onChange={formik.handleChange}
                    checked={formik.values.transactionType === "Purchase"}
                    disabled
                  />
                  <label className="form-check-label">Purchase</label>
                </div>
                {formik.errors.transactionType &&
                  formik.touched.transactionType && (
                    <div className="text-danger" style={{ fontSize: ".875em" }}>
                      {formik.errors.transactionType}
                    </div>
                  )}
              </div>
              <div className="col-md-6 col-12 mb-3">
                <div>
                  <label for="exampleFormControlInput1" className="form-label">
                    Price List Type
                  </label>
                </div>
                <div className="form-check form-check-inline">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="priceListType"
                    id="AllItems"
                    value="AllItems"
                    onChange={formik.handleChange}
                    checked={formik.values.priceListType === "AllItems"}
                    disabled
                  />
                  <label className="form-check-label">All Items</label>
                </div>
                <div className="form-check form-check-inline">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="priceListType"
                    id="IndividualItems"
                    value="IndividualItems"
                    onChange={formik.handleChange}
                    checked={formik.values.priceListType === "IndividualItems"}
                    disabled
                  />
                  <label className="form-check-label">Individual Items</label>
                </div>
                {formik.errors.priceListType &&
                  formik.touched.priceListType && (
                    <div className="text-danger" style={{ fontSize: ".875em" }}>
                      {formik.errors.priceListType}
                    </div>
                  )}
              </div>
              <div className="col-md-6 col-12 mb-2">
                <lable className="form-lable">Description</lable>
                <div className="mb-3">
                  <textarea
                    type="text"
                    name="description"
                    className={`form-control  ${
                      formik.touched.description && formik.errors.description
                        ? "is-invalid"
                        : ""
                    }`}
                    {...formik.getFieldProps("description")}
                    rows={4}
                  />
                  {formik.touched.description && formik.errors.description && (
                    <div className="invalid-feedback">
                      {formik.errors.description}
                    </div>
                  )}
                </div>
              </div>
              {formik.values.priceListType === "AllItems" && (
                <>
                  <div className="col-md-6 col-12 mb-2">
                    <lable className="form-lable">
                      Percentage<span className="text-danger">*</span>
                    </lable>
                    <div className="mb-3">
                      <input
                        type="text"
                        name="percentage"
                        className={`form-control  ${
                          formik.touched.percentage && formik.errors.percentage
                            ? "is-invalid"
                            : ""
                        }`}
                        {...formik.getFieldProps("percentage")}
                      />
                      {formik.touched.percentage &&
                        formik.errors.percentage && (
                          <div className="invalid-feedback">
                            {formik.errors.percentage}
                          </div>
                        )}
                    </div>
                  </div>
                  <div className="col-md-6 col-12 mb-2">
                    <lable className="form-lable">
                      Round off To<span className="text-danger">*</span>
                    </lable>
                    <div className="mb-3">
                      <select
                        type="text"
                        name="roundOffTo"
                        className={`form-select  ${
                          formik.touched.roundOffTo && formik.errors.roundOffTo
                            ? "is-invalid"
                            : ""
                        }`}
                        {...formik.getFieldProps("roundOffTo")}
                      >
                        <option selected></option>
                        <option value="NeverMind">Never Mind</option>
                        <option value="NearestWholeNumber">
                          Nearest whole number
                        </option>
                        <option value="0.99">0.99</option>
                        <option value="0.50">0.50</option>
                        <option value="0.49">0.49</option>
                        <option value="DecimalPlaces">Decimal Places</option>
                      </select>
                      {formik.touched.roundOffTo &&
                        formik.errors.roundOffTo && (
                          <div className="invalid-feedback">
                            {formik.errors.roundOffTo}
                          </div>
                        )}
                    </div>
                  </div>
                </>
              )}
              {formik.values.priceListType === "IndividualItems" && (
                <>
                  <div className="col-md-6 col-12 mb-3">
                    <div>
                      <label
                        for="exampleFormControlInput1"
                        className="form-label"
                      >
                        Pricing Scheme
                      </label>
                    </div>
                    <div className="form-check form-check-inline">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="pricingScheme"
                        id="UnitPricing"
                        value="UnitPricing"
                        onChange={formik.handleChange}
                        checked={formik.values.pricingScheme === "UnitPricing"}
                      />
                      <label className="form-check-label">Unit Pricing</label>
                    </div>
                    <div className="form-check form-check-inline">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="pricingScheme"
                        id="VolumePricing"
                        value="VolumePricing"
                        onChange={formik.handleChange}
                        checked={
                          formik.values.pricingScheme === "VolumePricing"
                        }
                      />
                      <label className="form-check-label">Volume Price</label>
                    </div>
                    {formik.errors.pricingScheme &&
                      formik.touched.pricingScheme && (
                        <div
                          className="text-danger"
                          style={{ fontSize: ".875em" }}
                        >
                          {formik.errors.pricingScheme}
                        </div>
                      )}
                  </div>
                  <div className="col-md-6 col-12 mb-2">
                    <lable className="form-lable">Currency</lable>
                    <div className="mb-3">
                      <select
                        type="text"
                        name="currency"
                        className={`form-select form-select-sm ${
                          formik.touched.currency && formik.errors.currency
                            ? "is-invalid"
                            : ""
                        }`}
                        {...formik.getFieldProps("currency")}
                      >
                        <option selected></option>
                        {currency &&
                          currency.map((data) => (
                            <option value={data.id} key={data.id}>
                              {data.currencyName}
                            </option>
                          ))}
                      </select>
                      {formik.touched.currency && formik.errors.currency && (
                        <div className="invalid-feedback">
                          {formik.errors.currency}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="col-md-6 col-12 mb-2">
                    <label className="form-label">Discount</label>
                    <div className="form-check mb-3">
                      <input
                        type="checkbox"
                        className="form-check-input"
                        id="discount"
                        name="discount"
                        {...formik.getFieldProps("discount")}
                        checked={formik.values.discount}
                      />
                      <label
                        className="form-check-label pt-1"
                        htmlFor="discount"
                      >
                        I want to include discount percentage for the items
                      </label>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default PriceListEdit;
