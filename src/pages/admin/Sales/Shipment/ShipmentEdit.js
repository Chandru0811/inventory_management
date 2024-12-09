import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import api from "../../../../config/URL";
import toast from "react-hot-toast";
import CustomerList from "../../../list/CustomerList";

const ShipmentEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoadIndicator] = useState(false);
  const [customerData, setCustomerData] = useState(null);
  const [data, setData] = useState([]);

  const validationSchema = Yup.object({
    customerId: Yup.string().required("*Customer Name is required"),
    salesOrder: Yup.string().required("*Sales Order is required"),
    packageNumber: Yup.string().required("*Package Number is required"),
    shipmentOrder: Yup.string().required("*Shipment Order is required"),
    shipDate: Yup.string().required("*Ship Date is required"),
    carrier: Yup.string().required("*Carrier is required"),
  });

  const formik = useFormik({
    initialValues: {
      customerId: "",
      salesOrder: "",
      packageNumber: "",
      shipmentOrder: "",
      shipDate: "",
      carrier: "",
      trackingNumber: "",
      trackingUrl: "",
      shippingCharge: "",
      notes: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      setLoadIndicator(true);
      console.log(values);
      try {
        const response = await api.put(`/updateShipment/${id}`, values);
        if (response.status === 200) {
          toast.success(response.data.message);
          navigate("/shipment");
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

  const getCustomerData = async () => {
    try {
      const currencyData = await CustomerList();
      setCustomerData(currencyData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    getCustomerData();
  }, []);

//   useEffect(() => {
//     const getData = async () => {
//       try {
//         const response = await api.get(`/getShipmentsById/${id}`);
//         formik.setValues(response.data);
//         formik.setValues({
//             shipDate: data.shipDate ? data.shipDate.split("T")[0] : "",
//         });
//       } catch (e) {
//         toast.error("Error fetching data: ", e?.response?.data?.message);
//       }
//     };

//     getData();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

useEffect(() => {
    const getData = async () => {
      try {
        const response = await api.get(`/getShipmentsById/${id}`);
        const rest = response.data;

        const formattedData = {
          ...rest,
          shipDate: rest.shipDate
            ? new Date(rest.shipDate).toISOString().split("T")[0]
            : undefined,
        };
        formik.setValues(formattedData);
      } catch (e) {
        toast.error("Error fetching data: ", e?.response?.data?.message);
      }
    };

    getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="container-fluid px-2 minHeight m-0">
      <form onSubmit={formik.handleSubmit}>
      <div
          className="card shadow border-0 mb-2 top-header sticky-top"
          style={{ borderRadius: "0", top: "66px" }}
        >
          <div className="container-fluid py-4">
            <div className="row align-items-center">
              <div className="col">
                <div className="d-flex align-items-center gap-4">
                  <h1 className="h4 ls-tight headingColor">Edit Shipment</h1>
                </div>
              </div>
              <div className="col-auto">
                <div className="hstack gap-2 justify-content-end">
                  <Link to="/shipment">
                    <button type="submit" className="btn btn-sm btn-light">
                      <span>Back</span>
                    </button>
                  </Link>
                  <button
                    type="submit"
                    className="btn btn-sm btn-button btn-primary"
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
              <div className="col-md-6 col-12 mb-3">
                <lable className="form-lable">
                  Customer Name<span className="text-danger">*</span>
                </lable>
                <div className="mb-3">
                  <select
                    {...formik.getFieldProps("customerId")}
                    className={`form-select form-select-sm   ${
                      formik.touched.customerId && formik.errors.customerId
                        ? "is-invalid"
                        : ""
                    }`}
                  >
                    <option selected></option>
                    {customerData &&
                      customerData.map((data) => (
                        <option key={data.customer_id} value={data.customer_id}>
                          {data.customer_name}
                        </option>
                      ))}
                  </select>
                  {formik.touched.customerId && formik.errors.customerId && (
                    <div className="invalid-feedback">
                      {formik.errors.customerId}
                    </div>
                  )}
                </div>
              </div>

              <div className="col-md-6 col-12 mb-2">
                <lable className="form-lable">
                  Sales Order<span className="text-danger">*</span>
                </lable>
                <div className="mb-3">
                  <input
                    type="text"
                    name="salesOrder"
                    className={`form-control form-control-sm ${
                      formik.touched.salesOrder && formik.errors.salesOrder
                        ? "is-invalid"
                        : ""
                    }`}
                    {...formik.getFieldProps("salesOrder")}
                  />
                  {formik.touched.salesOrder && formik.errors.salesOrder && (
                    <div className="invalid-feedback">
                      {formik.errors.salesOrder}
                    </div>
                  )}
                </div>
              </div>

              <div className="col-md-6 col-12 mb-2">
                <lable className="form-lable">
                  Package<span className="text-danger">*</span>
                </lable>
                <div className="mb-3">
                  <input
                    type="text"
                    name="packageNumber"
                    className={`form-control form-control-sm ${
                      formik.touched.packageNumber &&
                      formik.errors.packageNumber
                        ? "is-invalid"
                        : ""
                    }`}
                    {...formik.getFieldProps("packageNumber")}
                  />
                  {formik.touched.packageNumber &&
                    formik.errors.packageNumber && (
                      <div className="invalid-feedback">
                        {formik.errors.packageNumber}
                      </div>
                    )}
                </div>
              </div>

              <div className="col-md-6 col-12 mb-2">
                <lable className="form-lable">
                  Shipment Order<span className="text-danger">*</span>
                </lable>
                <div className="mb-3">
                  <input
                    type="text"
                    name="shipmentOrder"
                    className={`form-control form-control-sm ${
                      formik.touched.shipmentOrder &&
                      formik.errors.shipmentOrder
                        ? "is-invalid"
                        : ""
                    }`}
                    {...formik.getFieldProps("shipmentOrder")}
                  />
                  {formik.touched.shipmentOrder &&
                    formik.errors.shipmentOrder && (
                      <div className="invalid-feedback">
                        {formik.errors.shipmentOrder}
                      </div>
                    )}
                </div>
              </div>

              <div className="col-md-6 col-12 mb-2">
                <lable className="form-lable">
                  Ship Date<span className="text-danger">*</span>
                </lable>
                <div className="mb-3">
                  <input
                    type="date"
                    name="shipDate"
                    className={`form-control form-control-sm ${
                      formik.touched.shipDate && formik.errors.shipDate
                        ? "is-invalid"
                        : ""
                    }`}
                    {...formik.getFieldProps("shipDate")}
                  />
                  {formik.touched.shipDate && formik.errors.shipDate && (
                    <div className="invalid-feedback">
                      {formik.errors.shipDate}
                    </div>
                  )}
                </div>
              </div>

              <div className="col-md-6 col-12 mb-2">
                <lable className="form-lable">
                  Carrier<span className="text-danger">*</span>
                </lable>
                <div className="mb-3">
                  <input
                    type="text"
                    name="carrier"
                    className={`form-control form-control-sm ${
                      formik.touched.carrier && formik.errors.carrier
                        ? "is-invalid"
                        : ""
                    }`}
                    {...formik.getFieldProps("carrier")}
                  />
                  {formik.touched.carrier && formik.errors.carrier && (
                    <div className="invalid-feedback">
                      {formik.errors.carrier}
                    </div>
                  )}
                </div>
              </div>
              <div className="col-md-6 col-12 mb-2">
                <lable className="form-lable">Tracking Number</lable>
                <div className="mb-3">
                  <input
                    type="text"
                    name="trackingNumber"
                    className={`form-control form-control-sm ${
                      formik.touched.trackingNumber &&
                      formik.errors.trackingNumber
                        ? "is-invalid"
                        : ""
                    }`}
                    {...formik.getFieldProps("trackingNumber")}
                  />
                  {formik.touched.trackingNumber &&
                    formik.errors.trackingNumber && (
                      <div className="invalid-feedback">
                        {formik.errors.trackingNumber}
                      </div>
                    )}
                </div>
              </div>
              <div className="col-md-6 col-12 mb-2">
                <lable className="form-lable">Tracking Url</lable>
                <div className="mb-3">
                  <input
                    type="text"
                    name="trackingUrl"
                    className={`form-control form-control-sm ${
                      formik.touched.trackingUrl && formik.errors.trackingUrl
                        ? "is-invalid"
                        : ""
                    }`}
                    {...formik.getFieldProps("trackingUrl")}
                  />
                  {formik.touched.trackingUrl && formik.errors.trackingUrl && (
                    <div className="invalid-feedback">
                      {formik.errors.trackingUrl}
                    </div>
                  )}
                </div>
              </div>
              <div className="col-md-6 col-12 mb-2">
                <label className="form-label">Shipping Charge</label>
                <div className="input-group mb-3">
                  <span className="input-group-text">INR</span>{" "}
                  <input
                    type="text"
                    name="shippingCharge"
                    className={`form-control form-control-sm ${
                      formik.touched.shippingCharge &&
                      formik.errors.shippingCharge
                        ? "is-invalid"
                        : ""
                    }`}
                    {...formik.getFieldProps("shippingCharge")}
                  />
                  {formik.touched.shippingCharge &&
                    formik.errors.shippingCharge && (
                      <div className="invalid-feedback">
                        {formik.errors.shippingCharge}
                      </div>
                    )}
                </div>
              </div>
              <div className="col-md-6 col-12 mb-2">
                <lable className="form-lable">Notes</lable>
                <div className="mb-3">
                  <textarea
                    type="text"
                    name="notes"
                    className={`form-control  ${
                      formik.touched.notes && formik.errors.notes
                        ? "is-invalid"
                        : ""
                    }`}
                    {...formik.getFieldProps("notes")}
                    rows="4"
                  />
                  {formik.touched.notes && formik.errors.notes && (
                    <div className="invalid-feedback">
                      {formik.errors.notes}
                    </div>
                  )}
                </div>
              </div>
              {/* <div className="col-md-6 col-12 mb-2">
                <lable className="form-lable" for="shipmentDeliver">
                  Shipment Deliver
                </lable>
                <div className="mb-3">
                  <input
                    type="checkbox"
                    name="shipmentDeliver"
                    className={`form-check-input  ${
                      formik.touched.shipmentDeliver &&
                      formik.errors.shipmentDeliver
                        ? "is-invalid"
                        : ""
                    }`}
                    {...formik.getFieldProps("shipmentDeliver")}
                    id="shipmentDeliver"
                    value="true"
                  />
                  {formik.touched.shipmentDeliver &&
                    formik.errors.shipmentDeliver && (
                      <div className="invalid-feedback">
                        {formik.errors.shipmentDeliver}
                      </div>
                    )}
                </div>
              </div>
              <div className="col-md-6 col-12 mb-2">
                <lable className="form-check-lable" for="statusNotification">
                  Status Notification
                </lable>
                <div className="mb-3">
                  <input
                    type="checkbox"
                    name="statusNotification"
                    className={`form-check-input  ${
                      formik.touched.statusNotification &&
                      formik.errors.statusNotification
                        ? "is-invalid"
                        : ""
                    }`}
                    {...formik.getFieldProps("statusNotification")}
                    id="statusNotification"
                    value="true"
                  />
                  {formik.touched.statusNotification &&
                    formik.errors.statusNotification && (
                      <div className="invalid-feedback">
                        {formik.errors.statusNotification}
                      </div>
                    )}
                </div>
              </div> */}
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ShipmentEdit;
