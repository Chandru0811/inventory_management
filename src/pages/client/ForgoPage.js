import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Link, useNavigate } from "react-router-dom";
const ForgotPage = () => {
  const navigate = useNavigate();

  const validationSchema = Yup.object({
    email: Yup.string()
      .email("*Invalid email address")
      .required("*Email is required"),
  });

  const formik = useFormik({
    initialValues: {
      email: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      console.log("values", values);
        navigate("/forgotsuccess")
    },
  });

  return (
    <section>
      <div
        className="container-fluid d-flex justify-content-center align-items-center vh-100"
        style={{ backgroundColor: "rgb(242, 242, 242)" }}
      >
        <div className="row">
          <div
            className="card shadow-lg p-3 mb-5 rounded"
            style={{ width: "100%", maxWidth: "400px" }}
          >
            <h3
              className="cursor-pointer py-2 mb-3"
              style={{
                borderBottom: "2px solid #181c2e",
                paddingBottom: "5px",
                width: "100%",
                textAlign: "center",
                color: "#181c2e",
              }}
            >
              Forgot Password
            </h3>
            <p
              className="text-center text-muted mb-4"
              style={{ fontSize: "0.9rem" }}
            >
              Enter the email address or mobile phone number associated with
              your account.
            </p>

            <form onSubmit={formik.handleSubmit}>
              <div className="form-group mb-4 mt-2">
                <label className="form-label" htmlFor="email">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className={`form-control rounded-0 ${
                    formik.touched.email && formik.errors.email
                      ? "is-invalid"
                      : formik.touched.email && !formik.errors.email
                      ? "is-valid"
                      : ""
                  }`}
                  placeholder="Email Address"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.email && formik.errors.email ? (
                  <div className="invalid-feedback mt-0">
                    {formik.errors.email}
                  </div>
                ) : null}
              </div>

              {/* <Link to="/"> */}
              <button
                type="submit"
                className="btn btn-primary btn-block mt-3 rounded-0 w-100"
                style={{ backgroundColor: "#d6483", borderColor: "#d6483" }}
              >
                RESET PASSWORD
              </button>
              {/* </Link> */}
            </form>

            <div className="text-center mt-3 mb-4">
              <Link to="/">
              <p className="text-muted" style={{ fontSize: "0.9rem" }}>
                Go Back to &nbsp;
                <span style={{ color: "#181c2e" }}>Login In</span>
              </p>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ForgotPage;
