import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import toast from "react-hot-toast";
import api from "../../../../config/URL";

function TaxAdd({ onSuccess }) {
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoadIndicator] = useState(false);

  const validationSchema = Yup.object({
    taxName: Yup.string().required("*Tax Name is required"),
    rate: Yup.string().required("*rate is required"),
  });

  const formik = useFormik({
    initialValues: {
      taxName: "",
      rate: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      setLoadIndicator(true);
      try {
        const response = await api.post("create-tax", values);
        if (response.status === 201) {
          setShowModal(false);
          onSuccess();
          toast.success(response.data.message);
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

  return (
    <div>
      <button
        className="btn btn-sm btn-primary"
        onClick={() => setShowModal(true)}
      >
        Add +
      </button>

      {showModal && (
        <div
          className="modal"
          tabIndex="-1"
          style={{
            display: "block",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
          }}
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Add Tax</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body">
                <form onSubmit={formik.handleSubmit}>
                  <div className="mb-3">
                    <label className="form-label">
                      Tax Name<span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      name="taxName"
                      className={`form-control ${
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
                  <div className="mb-3">
                    <label className="form-label">
                      Rate<span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      name="rate"
                      className={`form-control ${
                        formik.touched.rate && formik.errors.rate
                          ? "is-invalid"
                          : ""
                      }`}
                      {...formik.getFieldProps("rate")}
                    />
                    {formik.touched.rate && formik.errors.rate && (
                      <div className="invalid-feedback">
                        {formik.errors.rate}
                      </div>
                    )}
                  </div>
                  <div className="modal-footer">
                    <button
                      type="button"
                      className="btn btn-secondary btn-sm"
                      onClick={() => {
                        setShowModal(false);
                        formik.resetForm();
                      }}
                    >
                      Cancel
                    </button>

                    <button
                      type="submit"
                      className="btn btn-primary btn-sm"
                      disabled={loading}
                    >
                      {loading ? (
                        <span
                          className="spinner-border spinner-border-sm"
                          aria-hidden="true"
                        ></span>
                      ) : (
                        "Save"
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default TaxAdd;
