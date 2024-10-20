import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate, Link } from "react-router-dom";
import { IoMdArrowBack } from "react-icons/io";
import { IoEyeOffOutline, IoEyeOutline } from "react-icons/io5";
import toast from "react-hot-toast";
import api from "../../config/URL";

function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [showactualPassword, setShowactualPassword] = useState(false);
  const [loadIndicator, setLoadIndicator] = useState(false);
  const navigate = useNavigate();

  const validationSchema = Yup.object({
    name: Yup.string().required("Name is required"),
    userName: Yup.string().required("Name is required"),
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    password: Yup.string().required("Password is required"),
    actualPassword: Yup.string()
      .required("Confirm Password is required")
      .oneOf([Yup.ref("password"), null], "Passwords must match"),
    phone: Yup.string().required("Phone number is required"),
    countryCode: Yup.string().required("Country code is required"),
    companyName: Yup.string().required("Company Name is required"),
    address: Yup.string().required("Address is required"),
    city: Yup.string().required("City is required"),
    state: Yup.string().required("State is required"),
    country: Yup.string().required("Country is required"),
    zipCode: Yup.string().required("Zip Code is required"),
  });

  const formik = useFormik({
    initialValues: {
      name: "",
      userName: "",
      email: "",
      password: "",
      actualPassword: "",
      phone: "",
      countryCode: "",
      companyName: "",
      address: "",
      city: "",
      state: "",
      country: "",
      zipCode: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      console.log(values);
      values.role = "INV_ADMIN"
      try {
        const response = await api.post("user-register", values, {
          // headers: {
          //   'Content-Type': 'multipart/form-data', 
          // },
        });
  
        if (response.status === 201) {
          toast.success(response.data.message);
          navigate("/");
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

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  const toggleconfirmPasswordVisibility = () => {
    setShowactualPassword(!showactualPassword);
  };

  return (
    <div
      className="container-fluid d-flex justify-content-center align-items-center"
      style={{ backgroundColor: "#f2f2f2", minHeight: "100vh" }}
    >
      <div
        className="card shadow-lg p-3 my-5 rounded"
        style={{ width: "100%", maxWidth: "80%" }}
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
          <div className="row">
            <Form.Group controlId="name" className="mb-3 pt-4 col-md-6 col-12">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Name"
                {...formik.getFieldProps("name")}
                isInvalid={formik.touched.name && formik.errors.name}
              />
              <Form.Control.Feedback type="invalid">
                {formik.errors.name}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group controlId="companyName" className="mb-3 pt-4 col-md-6 col-12">
              <Form.Label>Company Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Company Name"
                {...formik.getFieldProps("companyName")}
                isInvalid={formik.touched.companyName && formik.errors.companyName}
              />
              <Form.Control.Feedback type="invalid">
                {formik.errors.companyName}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group controlId="formEmail" className="mb-3 pt-4 col-md-6 col-12">
              <Form.Label>Email Address</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                {...formik.getFieldProps("email")}
                isInvalid={formik.touched.email && formik.errors.email}
              />
              <Form.Control.Feedback type="invalid">
                {formik.errors.email}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group controlId="phone" className="mb-3 pt-4 col-md-6 col-12">
              <Form.Label>Phone Number</Form.Label>
              <div className="input-group">
                <Form.Select
                  {...formik.getFieldProps("countryCode")}
                  isInvalid={formik.touched.countryCode && formik.errors.countryCode}
                  className="form-select"
                  style={{ maxWidth: "120px" }}
                >
                  <option value="+91">+91 </option>
                  <option value="+65">+65 </option>
                </Form.Select>
                <Form.Control
                  type="text"
                  placeholder="Phone Number"
                  {...formik.getFieldProps("phone")}
                  isInvalid={formik.touched.phone && formik.errors.phone}
                />
                <Form.Control.Feedback type="invalid">
                  {formik.errors.phone}
                </Form.Control.Feedback>
              </div>
            </Form.Group>

            <Form.Group controlId="password" className="mb-3 col-md-6 col-12">
              <Form.Label>Password</Form.Label>
              <div className="input-group">
                <Form.Control
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter password"
                  {...formik.getFieldProps("password")}
                  isInvalid={formik.touched.password && formik.errors.password}
                />
                <span
                  className="input-group-text"
                  onClick={togglePasswordVisibility}
                  style={{ cursor: "pointer" }}
                >
                  {showPassword ? <IoEyeOutline /> : <IoEyeOffOutline />}
                </span>
                <Form.Control.Feedback type="invalid">
                  {formik.errors.password}
                </Form.Control.Feedback>
              </div>
            </Form.Group>

            <Form.Group controlId="actualPassword" className="mb-3 col-md-6 col-12">
              <Form.Label>Confirm Password</Form.Label>
              <div className="input-group">
                <Form.Control
                  type={showactualPassword ? "text" : "password"}
                  placeholder="Confirm password"
                  {...formik.getFieldProps("actualPassword")}
                  isInvalid={formik.touched.actualPassword && formik.errors.actualPassword}
                />
                <span
                  className="input-group-text"
                  onClick={toggleconfirmPasswordVisibility}
                  style={{ cursor: "pointer" }}
                >
                  {showactualPassword ? <IoEyeOutline /> : <IoEyeOffOutline />}
                </span>
                <Form.Control.Feedback type="invalid">
                  {formik.errors.actualPassword}
                </Form.Control.Feedback>
              </div>
            </Form.Group>

            <Form.Group controlId="userName" className="col-md-6 col-12 mb-2">
              <Form.Label>User Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="userName"
                {...formik.getFieldProps("userName")}
                isInvalid={formik.touched.userName && formik.errors.userName}
              />
              <Form.Control.Feedback type="invalid">
                {formik.errors.userName}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group controlId="address" className="col-md-6 col-12 mb-2">
              <Form.Label>Address</Form.Label>
              <Form.Control
                type="text"
                placeholder="Address"
                {...formik.getFieldProps("address")}
                isInvalid={formik.touched.address && formik.errors.address}
              />
              <Form.Control.Feedback type="invalid">
                {formik.errors.address}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group controlId="city" className="col-md-6 col-12 mb-2">
              <Form.Label>City</Form.Label>
              <Form.Control
                type="text"
                placeholder="City"
                {...formik.getFieldProps("city")}
                isInvalid={formik.touched.city && formik.errors.city}
              />
              <Form.Control.Feedback type="invalid">
                {formik.errors.city}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group controlId="state" className="col-md-6 col-12 mb-2">
              <Form.Label>State</Form.Label>
              <Form.Control
                type="text"
                placeholder="State"
                {...formik.getFieldProps("state")}
                isInvalid={formik.touched.state && formik.errors.state}
              />
              <Form.Control.Feedback type="invalid">
                {formik.errors.state}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group controlId="country" className="col-md-6 col-12 mb-2">
              <Form.Label>Country</Form.Label>
              <Form.Control
                type="text"
                placeholder="Country"
                {...formik.getFieldProps("country")}
                isInvalid={formik.touched.country && formik.errors.country}
              />
              <Form.Control.Feedback type="invalid">
                {formik.errors.country}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group controlId="zipCode" className="col-md-6 col-12 mb-2">
              <Form.Label>Zip Code</Form.Label>
              <Form.Control
                type="text"
                placeholder="Zip Code"
                {...formik.getFieldProps("zipCode")}
                isInvalid={formik.touched.zipCode && formik.errors.zipCode}
              />
              <Form.Control.Feedback type="invalid">
                {formik.errors.zipCode}
              </Form.Control.Feedback>
            </Form.Group>
          </div>

          <Button
            variant="primary"
            type="submit"
            className="w-100 my-3"
            disabled={loadIndicator}
          >
            {loadIndicator ? "Please Wait..." : "Register"}
          </Button>
        </Form>
      </div>
    </div>
  );
}

export default Register;
