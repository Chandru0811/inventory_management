import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import toast from "react-hot-toast";
import api from "../../../../config/URL";
import { FaRegEdit } from "react-icons/fa";

function ManufactureEdit({ onSuccess,id }) {
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoadIndicator] = useState(false);

  const validationSchema = Yup.object({
    manufacturerName: Yup.string().required("*Manufacture Name is required"),
  });

  const formik = useFormik({
    initialValues: {
      manufacturerName: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      setLoadIndicator(true);
      try {
        const response = await api.put(`updateManufacturers/${id}`, values);
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
  const handleShowModal = async () => {
    setShowModal(true);
    try {
      const response = await api.get(`/getManufacturers/${id}`);
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
                <h5 className="modal-title">Edit Manufacture</h5>
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
                      Manaufacture Name<span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      name="manufacturerName"
                      className={`form-control ${
                        formik.touched.manufacturerName && formik.errors.manufacturerName
                          ? "is-invalid"
                          : ""
                      }`}
                      {...formik.getFieldProps("manufacturerName")}
                    />
                    {formik.touched.manufacturerName && formik.errors.manufacturerName && (
                      <div className="invalid-feedback">
                        {formik.errors.manufacturerName}
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

export default ManufactureEdit;
