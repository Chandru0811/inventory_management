import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import api from "../../../../config/URL";
import toast from "react-hot-toast";

const CustomerEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoadIndicator] = useState(false);

  const validationSchema = Yup.object({
    customerType: Yup.string().required("*Customer Type is required"),
    companyName: Yup.string().required("*Company Name is required"),
    primaryContact: Yup.string().required("*Primary Contact is required"),
    customerEmail: Yup.string().required("*Email is required"),
    customerPhoneNumber: Yup.number().required("*Phone is required"),
    customerDisplayName: Yup.number().required("*Display Name is required"),
  });

  const formik = useFormik({
    initialValues: {
      // companyName: "",
      customerType: "",
      companyName: "",
      primaryContact: "",
      customerEmail: "",
      customerPhoneNumber: "",
      customerDisplayName: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      setLoadIndicator(true);
      console.log(values);
      try {
        const response = await api.put(`/updateCustomers/${id}`, values, {});
        if (response.status === 200) {
          toast.success(response.data.message);
          navigate("/customers");
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
        const response = await api.get(`/getAllCustomersById/${id}`);
        formik.setValues(response.data);
      } catch (e) {
        toast.error("Error fetching data: ", e?.response?.data?.message);
      }
    };

    getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="container-fluid p-2 minHeight m-0">
      <form onSubmit={formik.handleSubmit}>
        <div className="card shadow border-0 mb-2 top-header">
          <div className="container-fluid py-4">
            <div className="row align-items-center">
              <div className="col">
                <div className="d-flex align-items-center gap-4">
                  <h1 className="h4 ls-tight headingColor">Edit Customer</h1>
                </div>
              </div>
              <div className="col-auto">
                <div className="hstack gap-2 justify-content-end">
                  <Link to="/customers">
                    <button type="submit" className="btn btn-sm btn-light">
                      <span>Back</span>
                    </button>
                  </Link>
                  <button
                    type="submit"
                    className="btn btn-sm btn-button"
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

        <div className="card shadow border-0 my-2">
          <div className="row mt-3 me-2">
            <div className="col-12 text-end"></div>
          </div>
          <div className="container mb-5">
            <div className="row py-4">
              <div className="col-md-6 col-12 mb-2">
                <lable className="form-lable">
                  Customer Type<span className="text-danger">*</span>
                </lable>
                <div className="mb-3">
                  <select
                    name="customerType"
                    className={`form-select  ${formik.touched.customerType && formik.errors.customerType
                      ? "is-invalid"
                      : ""
                      }`}
                    {...formik.getFieldProps("customerType")}
                  >
                    <option value=""></option>
                    <option value="BUSINESS">Business</option>
                    {/* <option value="INDIVITUALS">Individual</option> */}
                  </select>
                  {formik.touched.customerType &&
                    formik.errors.customerType && (
                      <div className="invalid-feedback">
                        {formik.errors.customerType}
                      </div>
                    )}
                </div>
              </div>
              <div className="col-md-6 col-12 mb-2">
                <lable className="form-lable">
                  Company Name<span className="text-danger">*</span>
                </lable>
                <div className="mb-3">
                  <input
                    type="text"
                    name="companyName"
                    className={`form-control ${formik.touched.companyName &&
                      formik.errors.companyName
                      ? "is-invalid"
                      : ""
                      }`}
                    {...formik.getFieldProps("companyName")}
                  />
                  {formik.touched.companyName &&
                    formik.errors.companyName && (
                      <div className="invalid-feedback">
                        {formik.errors.companyName}
                      </div>
                    )}
                </div>
              </div>

              <div className="col-md-6 col-12 mb-2">
                <lable className="form-lable">
                  Primary Contact<span className="text-danger">*</span>
                </lable>
                <div className="mb-3">
                  <input
                    type="text"
                    name="primaryContact"
                    className={`form-control  ${formik.touched.primaryContact &&
                      formik.errors.primaryContact
                      ? "is-invalid"
                      : ""
                      }`}
                    {...formik.getFieldProps("primaryContact")}
                  />
                  {formik.touched.primaryContact &&
                    formik.errors.primaryContact && (
                      <div className="invalid-feedback">
                        {formik.errors.primaryContact}
                      </div>
                    )}
                </div>
              </div>

              <div className="col-md-6 col-12 mb-2">
                <lable className="form-lable">
                  Customer Email<span className="text-danger">*</span>
                </lable>
                <div className="mb-3">
                  <input
                    type="text"
                    name="customerEmail"
                    className={`form-control  ${formik.touched.customerEmail && formik.errors.customerEmail
                      ? "is-invalid"
                      : ""
                      }`}
                    {...formik.getFieldProps("customerEmail")}
                  />
                  {formik.touched.customerEmail && formik.errors.customerEmail && (
                    <div className="invalid-feedback">
                      {formik.errors.customerEmail}
                    </div>
                  )}
                </div>
              </div>

              <div className="col-md-6 col-12 mb-2">
                <lable className="form-lable">
                  Customer Phone<span className="text-danger">*</span>
                </lable>
                <div className="mb-3">
                  <input
                    type="text"
                    name="customerPhoneNumber"
                    className={`form-control  ${formik.touched.customerPhoneNumber && formik.errors.customerPhoneNumber
                      ? "is-invalid"
                      : ""
                      }`}
                    {...formik.getFieldProps("customerPhoneNumber")}
                  />
                  {formik.touched.customerPhoneNumber && formik.errors.customerPhoneNumber && (
                    <div className="invalid-feedback">
                      {formik.errors.customerPhoneNumber}
                    </div>
                  )}
                </div>
              </div>

              <div className="col-md-6 col-12 mb-2">
                <lable className="form-lable">
                  Customer Display Name<span className="text-danger">*</span>
                </lable>
                <div className="mb-3">
                  <input
                    type="text"
                    name="customerDisplayName"
                    className={`form-control  ${formik.touched.customerDisplayName && formik.errors.customerDisplayName
                      ? "is-invalid"
                      : ""
                      }`}
                    {...formik.getFieldProps("customerDisplayName")}
                  />
                  {formik.touched.customerDisplayName && formik.errors.customerDisplayName && (
                    <div className="invalid-feedback">
                      {formik.errors.customerDisplayName}
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

export default CustomerEdit;
