import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";
import { FaEye, FaEyeSlash } from "react-icons/fa"; // Import eye icons
import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate, Link } from "react-router-dom";
import { IoMdArrowBack } from "react-icons/io";
import { IoEyeOffOutline, IoEyeOutline } from "react-icons/io5";

function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [showcPassword, setShowCPassword] = useState(false);
  const [loadIndicator, setLoadIndicator] = useState(false);
  const navigate = useNavigate();

  const validationSchema = Yup.object({
    name: Yup.string().required("Name is required"),
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),

    password: Yup.string().required("Password is required"),

    cpassword: Yup.string()
      .required("Confirm Password is required")
      .oneOf([Yup.ref("password"), null], "Passwords must match"),
    // role: Yup.string().required("Please select a role"),
  });

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
      cpassword: "",
      //   role: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
        console.log(values);
        navigate("/")
    },
  });

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  const toggleconfirmPasswordVisibility = () => {
    setShowCPassword(!showcPassword);
  };

  return (
    <div
      className="container-fluid d-flex justify-content-center align-items-center"
      style={{ backgroundColor: "#f2f2f2", minHeight: "100vh" }}
    >
      <div
        className="card shadow-lg p-3 my-5 rounded"
        style={{ width: "100%", maxWidth: "400px" }}
      >
        <Link to="/">
          <button className="btn btn-link text-start shadow-none h-0">
            <IoMdArrowBack style={{ color: "#181c2e" }} />
          </button>
        </Link>
        <div className="d-flex justify-content-around ">
          <h3
            className={`py-2`}
            style={{
              borderBottom: "2px solid #181c2e",
              paddingBottom: "5px",
              width: "100%",
              textAlign: "center",
              color: "#181c2e",
            }}
          >
            Register
          </h3>
        </div>
        <Form onSubmit={formik.handleSubmit}>
          <Form.Group controlId="name" className="mb-3 pt-4">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Name"
              {...formik.getFieldProps("name")}
              isInvalid={formik.touched.name && formik.errors.name}
            />
            {formik.touched.name && formik.errors.name ? (
              <Form.Control.Feedback type="invalid">
                {formik.errors.name}
              </Form.Control.Feedback>
            ) : null}
          </Form.Group>
          <Form.Group controlId="formEmail" className="mb-3 pt-4">
            <Form.Label>Email Address</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter email"
              {...formik.getFieldProps("email")}
              isInvalid={formik.touched.email && formik.errors.email}
            />
            {formik.touched.email && formik.errors.email ? (
              <Form.Control.Feedback type="invalid">
                {formik.errors.email}
              </Form.Control.Feedback>
            ) : null}
          </Form.Group>
          <div className="mb-3">
            <label className="form-label fw-medium">Password</label>
            <div className={`input-group mb-3`} style={{outline: "none", boxShadow: "none" }}>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter password"
                className={`form-control ${
                  formik.touched.password && formik.errors.password
                    ? "is-invalid"
                    : ""
                }`}
                style={{
                  borderRadius: "3px",
                  borderRight: "none",
                  borderTopRightRadius: "0px",
                  borderBottomRightRadius: "0px",
                }}
                name="password"
                {...formik.getFieldProps("password")}
              />
              <span
                className={`input-group-text iconInputBackground`}
                id="basic-addon1"
                onClick={togglePasswordVisibility}
                style={{ cursor: "pointer", borderRadius: "3px" }}
              >
                {showPassword ? <IoEyeOffOutline /> : <IoEyeOutline />}
              </span>
              {formik.touched.password && formik.errors.password && (
                <div className="invalid-feedback" typeof="in">{formik.errors.password}</div>
              )}
            </div>
          </div>
          <div className="mb-3">
            <label className="form-label fw-medium">Confirm Password</label>
            <div className={`input-group mb-3`} style={{outline: "none", boxShadow: "none" }}>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter password"
                className={`form-control ${
                  formik.touched.cpassword && formik.errors.cpassword
                    ? "is-invalid"
                    : ""
                }`}
                style={{
                  borderRadius: "3px",
                  borderRight: "none",
                  borderTopRightRadius: "0px",
                  borderBottomRightRadius: "0px",
                }}
                name="cpassword"
                {...formik.getFieldProps("cpassword")}
              />
              <span
                className={`input-group-text iconInputBackground`}
                id="basic-addon1"
                onClick={toggleconfirmPasswordVisibility}
                style={{ cursor: "pointer", borderRadius: "3px" }}
              >
                {showPassword ? <IoEyeOffOutline /> : <IoEyeOutline />}
              </span>
              {formik.touched.cpassword && formik.errors.cpassword && (
                <div className="invalid-feedback">{formik.errors.cpassword}</div>
              )}
            </div>
          </div>
          <Button
            type="submit"
            className="w-100 mt-4 "
            disabled={loadIndicator}
          >
            {loadIndicator && (
              <span
                className="spinner-border spinner-border-sm me-2"
                aria-hidden="true"
              ></span>
            )}
            Register
          </Button>
        </Form>
      </div>
    </div>
  );
}

export default Register;
