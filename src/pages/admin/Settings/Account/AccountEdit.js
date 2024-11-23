import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import toast from "react-hot-toast";
import { FaRegEdit } from "react-icons/fa";
import api from "../../../../config/URL";

function AccountEdit({ onSuccess, id }) {
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoadIndicator] = useState(false);

  const validationSchema = Yup.object({
    account: Yup.string().required("*Account is required"),
  });

  const formik = useFormik({
    initialValues: {
      account: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      setLoadIndicator(true);
      try {
        const response = await api.put(`updateAccounts/${id}`, values);
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
      const response = await api.get(`/getAllAccountsById/${id}`);
      formik.setValues(response.data);
    } catch (e) {
      toast.error("Error fetching data: " + e?.response?.data?.message);
    }
  };

  return (
    <div>
      <button className="btn btn-sm" onClick={handleShowModal}>
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
                <h5 className="modal-title">Edit Account</h5>
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
                        Account<span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        name="account"
                        className={`form-control form-control-sm ${
                          formik.touched.account && formik.errors.account
                            ? "is-invalid"
                            : ""
                        }`}
                        {...formik.getFieldProps("account")}
                      />
                      {formik.touched.account && formik.errors.account && (
                        <div className="invalid-feedback">
                          {formik.errors.account}
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

export default AccountEdit;
