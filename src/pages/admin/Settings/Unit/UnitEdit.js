import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import toast from "react-hot-toast";
import api from "../../../../config/URL";
import { FaRegEdit } from "react-icons/fa";

function UnitEdit({ onSuccess,id }) {
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoadIndicator] = useState(false);

  const validationSchema = Yup.object({
    unitName: Yup.string().required("*Unit Name is required"),
    symbol: Yup.string().required("*Symbol is required"),
    uqc: Yup.string().required("*UQC is required"),
  });

  const formik = useFormik({
    initialValues: {
      unitName: "",
      symbol: "",
      uqc:""
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      setLoadIndicator(true);
      try {
        const response = await api.put(`updateUnit/${id}`, values);
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
      const response = await api.get(`/getAllUnitById/${id}`);
      formik.setValues(response.data);
    } catch (e) {
      toast.error("Error fetching data: " + e?.response?.data?.message);
    }
  };


  return (
    <div>
      <button
        className="btn btn-sm"
        onClick={handleShowModal}
      >
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
                <h5 className="modal-title">Edit Unit</h5>
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
                      Unit Name<span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      name="unitName"
                      className={`form-control ${
                        formik.touched.unitName && formik.errors.unitName
                          ? "is-invalid"
                          : ""
                      }`}
                      {...formik.getFieldProps("unitName")}
                    />
                    {formik.touched.unitName && formik.errors.unitName && (
                      <div className="invalid-feedback">
                        {formik.errors.unitName}
                      </div>
                    )}
                  </div>
                  <div className="mb-3">
                    <label className="form-label">
                      Symbol<span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      name="symbol"
                      className={`form-control ${
                        formik.touched.symbol && formik.errors.symbol
                          ? "is-invalid"
                          : ""
                      }`}
                      {...formik.getFieldProps("symbol")}
                    />
                    {formik.touched.symbol && formik.errors.symbol && (
                      <div className="invalid-feedback">
                        {formik.errors.symbol}
                      </div>
                    )}
                  </div>
                  <div className="mb-3">
                    <label className="form-label">
                      UQC<span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      name="uqc"
                      className={`form-control ${
                        formik.touched.uqc && formik.errors.uqc
                          ? "is-invalid"
                          : ""
                      }`}
                      {...formik.getFieldProps("uqc")}
                    />
                    {formik.touched.uqc && formik.errors.uqc && (
                      <div className="invalid-feedback">
                        {formik.errors.uqc}
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

export default UnitEdit;
