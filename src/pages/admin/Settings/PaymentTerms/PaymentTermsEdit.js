import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import toast from "react-hot-toast";
import { FaRegEdit } from "react-icons/fa";
import api from "../../../../config/URL";

function PaymentTermsEdit({ onSuccess, id }) {
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoadIndicator] = useState(false);

  const validationSchema = Yup.object({
    termName: Yup.string().required("*Term Name is required"),
    numberOfDays: Yup.string().required("*Number of days is required"),
  });

  const formik = useFormik({
    initialValues: {
      termName: "",
      numberOfDays: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      setLoadIndicator(true);
      try {
        const response = await api.put(`updatePaymentTerm/${id}`, values);
        if (response.status === 200) {
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
  const handleShowModal = async () => {
    setShowModal(true);
    try {
      const response = await api.get(`/getAllPaymentTermById/${id}`);
      formik.setValues(response.data);
    } catch (e) {
      toast.error("Error fetching data: " + e?.response?.data?.message);
    }
  };

  return (
    <div>
      <button className="btn btn-sm" style={{padding: "7px"}} onClick={handleShowModal}>
        <FaRegEdit />
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
                <h5 className="modal-title">Edit Payment Terms</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body">
                <form onSubmit={formik.handleSubmit}>
                  <div className="row">
                    <div className="col-12 mb-3">
                      <label className="form-label">
                        Term Name<span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        name="termName"
                        className={`form-control form-control-sm ${
                          formik.touched.termName && formik.errors.termName
                            ? "is-invalid"
                            : ""
                        }`}
                        {...formik.getFieldProps("termName")}
                      />
                      {formik.touched.termName && formik.errors.termName && (
                        <div className="invalid-feedback">
                          {formik.errors.termName}
                        </div>
                      )}
                    </div>
                    <div className="col-12 mb-3">
                      <label className="form-label">
                        Number of Days<span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        name="numberOfDays"
                        className={`form-control form-control-sm ${
                          formik.touched.numberOfDays &&
                          formik.errors.numberOfDays
                            ? "is-invalid"
                            : ""
                        }`}
                        {...formik.getFieldProps("numberOfDays")}
                      />
                      {formik.touched.numberOfDays &&
                        formik.errors.numberOfDays && (
                          <div className="invalid-feedback">
                            {formik.errors.numberOfDays}
                          </div>
                        )}
                    </div>
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
                        "Update"
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

export default PaymentTermsEdit;
