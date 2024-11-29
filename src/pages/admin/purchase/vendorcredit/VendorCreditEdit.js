import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import api from "../../../../config/URL";
import toast from "react-hot-toast";
// import VendorCredit from "./VendorCredit";

function VendorCreditEdit() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoadIndicator] = useState(false);
  const [wareHouseData, setWareHouseData] = useState(null);
  const [vendor, setVendor] = useState(null);
  const [itemData, setItemData] = useState(null);

  const validationSchema = Yup.object({
    vendorName: Yup.string().required("*Vendor Name is required"),
    creditNote: Yup.string().required("*Credit Note is required"),
    txnVendorCreditItemsModels: Yup.array().of(
      Yup.object().shape({
        itemId: Yup.string().required("*Item Details is required"),
      })
    ),
  });

  const formik = useFormik({
    initialValues: {
      wareHouseData: "",
      vendorName: "",
      creditNote: "",
      orderNumber: "",
      vendorCreditDdate: "",
      subject: "",
      notes: "",
      file: "",
      txnVendorCreditItemsModels: [
        {
          itemId: "",
          account: "",
          qty: "",
          rate: "",
          amount: "",
        },
      ],
    },
    validationSchema,
    onSubmit: async (values) => {
      setLoadIndicator(true);
      try {
        const formData = new FormData();
        formData.append("wareHouseId", values.wareHouseData);
        formData.append("vendorId", values.vendorName);
        formData.append("creditNote", values.creditNote);
        formData.append("orderNumber", values.orderNumber);
        formData.append("vendorCreditDdate", values.vendorCreditDdate);
        formData.append("subject", values.subject);
        formData.append("notes", values.notes);
        formData.append("file", values.file);
        formData.append(
          "txnVendorCreditItemsModels",
          JSON.stringify(values.txnVendorCreditItemsModels)
        );

        const response = await api.put(
          `vendorCreditUpdationWithItems/${id}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        if (response.status === 200 || response.status === 201) {
          toast.success(response.data.message);
          navigate("/vendorcredit");
        } else {
          toast.error(response.data.message);
        }
      } catch (error) {
        toast.error("Error: Unable to save vendor credit.");
      } finally {
        setLoadIndicator(false);
      }
    },
  });

  useEffect(() => {
    const fetchVendorCreditData = async () => {
      try {
        const response = await api.get(`vendorCreditRetrivalWithItems/${id}`);
        const vendorCreditDAta = response.data;

        formik.setValues({
          wareHouseData: vendorCreditDAta.wareHouseData,
          vendorName: vendorCreditDAta.vendorName,
          creditNote: vendorCreditDAta.creditNote,
          orderNumber: vendorCreditDAta.orderNumber,
          vendorCreditDdate: vendorCreditDAta.vendorCreditDdate,
          subject: vendorCreditDAta.subject,
          notes: vendorCreditDAta.notes,
          file: vendorCreditDAta.file,
          txnVendorCreditItemsModels:
            vendorCreditDAta.txnVendorCreditItemsModels,
        });
      } catch (error) {
        console.error("Error fetching item group data:", error);
        toast.error("Error fetching item group data");
      }
    };

    if (id) {
      fetchVendorCreditData();
    }
  }, [id]);

  useEffect(() => {
    const fetchWarehouses = async () => {
      try {
        const response = await api.get("getAllWarehouses");
        setWareHouseData(response.data);
      } catch (error) {
        console.error("Error fetching Warehouses:", error);
      }
    };

    const fetchVendors = async () => {
      try {
        const response = await api.get("vendorIdsWithDisplayNames");
        setVendor(response.data);
      } catch (error) {
        console.error("Error fetching Vendors:", error);
      }
    };

    fetchWarehouses();
    fetchVendors();
  }, []);

  const AddRowContent = () => {
    formik.setFieldValue("txnVendorCreditItemsModels", [
      ...formik.values.txnVendorCreditItemsModels,
      {
        itemId: "",
        qty: "",
        rate: "",
        discount: "",
        taxRate: "",
        amount: "",
      },
    ]);
  };

  const deleteRow = (index) => {
    if (formik.values.txnVendorCreditItemsModels.length === 1) {
      return;
    }
    const updatedRows = [...formik.values.txnVendorCreditItemsModels];
    updatedRows.splice(index, 1);
    formik.setFieldValue("txnVendorCreditItemsModels", updatedRows);
  };
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
                  <h1 className="h4 ls-tight headingColor">
                    Edit Vendor Credit
                  </h1>
                </div>
              </div>
              <div className="col-auto">
                <div className="hstack gap-2 justify-content-end">
                  <Link to="/vendorcredit">
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
                    &nbsp;<span>Save</span>
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
          <div className="container mb-5 mt-5">
            <div className="row py-4">
              <div className="col-md-6 col-12 mb-3">
                <lable className="form-lable">
                  Vendor Name<span className="text-danger">*</span>
                </lable>
                <div className="mb-3">
                  <select
                    name="vendorName"
                    className={`form-select form-select-sm ${
                      formik.touched.vendorName && formik.errors.vendorName
                        ? "is-invalid"
                        : ""
                    }`}
                    {...formik.getFieldProps("vendorName")}
                  >
                    <option selected></option>
                    {vendor &&
                      vendor.map((data) => (
                        <option key={data.id} value={data.id}>
                          {data.vendorDisplayName}
                        </option>
                      ))}
                  </select>
                  {formik.touched.vendorName && formik.errors.vendorName && (
                    <div className="invalid-feedback">
                      {formik.errors.vendorName}
                    </div>
                  )}
                </div>
              </div>
              <div className="col-md-6 col-12 mb-3">
                <lable className="form-lable">
                  Credit Note<span className="text-danger">*</span>
                </lable>
                <div className="mb-3">
                  <input
                    type="text"
                    className={`form-control  form-select-sm ${
                      formik.touched.creditNote && formik.errors.creditNote
                        ? "is-invalid"
                        : ""
                    }`}
                    {...formik.getFieldProps("creditNote")}
                  />
                  {formik.touched.creditNote && formik.errors.creditNote && (
                    <div className="invalid-feedback">
                      {formik.errors.creditNote}
                    </div>
                  )}
                </div>
              </div>
              <div className="col-md-6 col-12 mb-3">
                <lable className="form-lable">Order Number</lable>
                <div className="mb-3">
                  <input
                    type="text"
                    className={`form-control  form-select-sm  ${
                      formik.touched.orderNumber && formik.errors.orderNumber
                        ? "is-invalid"
                        : ""
                    }`}
                    {...formik.getFieldProps("orderNumber")}
                  />
                  {formik.touched.orderNumber && formik.errors.orderNumber && (
                    <div className="invalid-feedback">
                      {formik.errors.orderNumber}
                    </div>
                  )}
                </div>
              </div>

              <div className="col-md-6 col-12 mb-3">
                <lable className="form-lable">Vendor Credit Date</lable>
                <div className="">
                  <input
                    type="date"
                    className={`form-control  form-select-sm ${
                      formik.touched.vendorCreditDdate &&
                      formik.errors.vendorCreditDdate
                        ? "is-invalid"
                        : ""
                    }`}
                    {...formik.getFieldProps("vendorCreditDdate")}
                  />
                  {formik.touched.vendorCreditDdate &&
                    formik.errors.vendorCreditDdate && (
                      <div className="invalid-feedback">
                        {formik.errors.vendorCreditDdate}
                      </div>
                    )}
                </div>
              </div>

              <div className="col-md-6 col-12 mb-3">
                <lable className="form-lable">Subject</lable>
                <div className="mb-3">
                  <input
                    type="text"
                    className={`form-control  form-select-sm  ${
                      formik.touched.subject && formik.errors.subject
                        ? "is-invalid"
                        : ""
                    }`}
                    {...formik.getFieldProps("subject")}
                  />
                  {formik.touched.subject && formik.errors.subject && (
                    <div className="invalid-feedback">
                      {formik.errors.subject}
                    </div>
                  )}
                </div>
              </div>

              <div className="col-md-6 col-12 mb-3">
                <label className="form-label">Attach File</label>
                <div className="">
                  <input
                    type="file"
                    className="form-control  form-select-sm"
                    onChange={(event) => {
                      formik.setFieldValue("file", event.target.files[0]);
                    }}
                    onBlur={formik.handleBlur}
                  />
                </div>
              </div>

              <div className="col-md-6 col-12 mb-3">
                <lable className="form-lable">Warehouse</lable>
                <div className="mb-3">
                  <select
                    name="wareHouseData"
                    className={`form-select form-select-sm ${
                      formik.touched.wareHouseData &&
                      formik.errors.wareHouseData
                        ? "is-invalid"
                        : ""
                    }`}
                    {...formik.getFieldProps("wareHouseData")}
                  >
                    <option selected></option>
                    <option value="1">Ecs Cloud</option>
                  </select>
                  {formik.touched.wareHouseData &&
                    formik.errors.wareHouseData && (
                      <div className="invalid-feedback">
                        {formik.errors.wareHouseData}
                      </div>
                    )}
                </div>
              </div>

              <div className="row mt-5">
                <div className="">
                  <h3
                    style={{ background: "#4066D5" }}
                    className="text-light p-2"
                  >
                    Item Table
                  </h3>
                </div>
                <div className="table-responsive">
                  <table className="table table-sm table-nowrap">
                    <thead>
                      <tr>
                        <th>S.NO</th>
                        <th style={{ width: "40%" }}>
                          Item Details<span className="text-danger">*</span>
                        </th>
                        <th style={{ width: "20%" }}>Account</th>
                        <th style={{ width: "10%" }}>Quantity</th>
                        <th style={{ width: "10%" }}>Rate</th>
                        <th style={{ width: "15%" }}>Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {formik.values.txnVendorCreditItemsModels?.map(
                        (item, index) => (
                          <tr key={index}>
                            <th scope="row">{index + 1}</th>
                            <td>
                              <select
                                name={`txnVendorCreditItemsModels[${index}].itemId`}
                                {...formik.getFieldProps(
                                  `txnVendorCreditItemsModels[${index}].itemId`
                                )}
                                className={`form-control  form-select-sm ${
                                  formik.touched.txnVendorCreditItemsModels?.[
                                    index
                                  ]?.itemId &&
                                  formik.errors.txnVendorCreditItemsModels?.[
                                    index
                                  ]?.itemId
                                    ? "is-invalid"
                                    : ""
                                }`}
                              >
                                <option selected> </option>
                                {itemData &&
                                  itemData.map((itemId) => (
                                    <option key={itemId.id} value={itemId.id}>
                                      {itemId.itemName}
                                    </option>
                                  ))}
                              </select>
                              {formik.touched.txnVendorCreditItemsModels?.[
                                index
                              ]?.itemId &&
                                formik.errors.txnVendorCreditItemsModels?.[
                                  index
                                ]?.itemId && (
                                  <div className="invalid-feedback">
                                    {
                                      formik.errors.txnVendorCreditItemsModels[
                                        index
                                      ].itemId
                                    }
                                  </div>
                                )}
                            </td>
                            <td>
                              <input
                                onInput={(event) => {
                                  event.target.value =
                                    event.target.value.replace(/[^0-9]/g, "");
                                }}
                                type="text"
                                name={`txnVendorCreditItemsModels[${index}].account`}
                                className={`form-control  form-select-sm ${
                                  formik.touched.txnVendorCreditItemsModels?.[
                                    index
                                  ]?.account &&
                                  formik.errors.txnVendorCreditItemsModels?.[
                                    index
                                  ]?.account
                                    ? "is-invalid"
                                    : ""
                                }`}
                                {...formik.getFieldProps(
                                  `txnVendorCreditItemsModels[${index}].account`
                                )}
                              />
                              {formik.touched.txnVendorCreditItemsModels?.[
                                index
                              ]?.account &&
                                formik.errors.txnVendorCreditItemsModels?.[
                                  index
                                ]?.account && (
                                  <div className="invalid-feedback">
                                    {
                                      formik.errors.txnVendorCreditItemsModels[
                                        index
                                      ].account
                                    }
                                  </div>
                                )}
                            </td>
                            <td>
                              <input
                                onInput={(event) => {
                                  event.target.value =
                                    event.target.value.replace(/[^0-9]/g, "");
                                }}
                                type="text"
                                name={`txnVendorCreditItemsModels[${index}].qty`}
                                className={`form-control  form-select-sm ${
                                  formik.touched.txnVendorCreditItemsModels?.[
                                    index
                                  ]?.qty &&
                                  formik.errors.txnVendorCreditItemsModels?.[
                                    index
                                  ]?.qty
                                    ? "is-invalid"
                                    : ""
                                }`}
                                {...formik.getFieldProps(
                                  `txnVendorCreditItemsModels[${index}].qty`
                                )}
                              />
                              {formik.touched.txnVendorCreditItemsModels?.[
                                index
                              ]?.qty &&
                                formik.errors.txnVendorCreditItemsModels?.[
                                  index
                                ]?.qty && (
                                  <div className="invalid-feedback">
                                    {
                                      formik.errors.txnVendorCreditItemsModels[
                                        index
                                      ].qty
                                    }
                                  </div>
                                )}
                            </td>
                            <td>
                              <input
                                type="text"
                                name={`txnVendorCreditItemsModels[${index}].rate`}
                                className={`form-control  form-select-sm ${
                                  formik.touched.txnVendorCreditItemsModels?.[
                                    index
                                  ]?.rate &&
                                  formik.errors.txnVendorCreditItemsModels?.[
                                    index
                                  ]?.rate
                                    ? "is-invalid"
                                    : ""
                                }`}
                                {...formik.getFieldProps(
                                  `txnVendorCreditItemsModels[${index}].rate`
                                )}
                              />
                              {formik.touched.txnVendorCreditItemsModels?.[
                                index
                              ]?.rate &&
                                formik.errors.txnVendorCreditItemsModels?.[
                                  index
                                ]?.rate && (
                                  <div className="invalid-feedback">
                                    {
                                      formik.errors.txnVendorCreditItemsModels[
                                        index
                                      ].rate
                                    }
                                  </div>
                                )}
                            </td>
                            <td>
                              <input
                                readOnly
                                type="text"
                                name={`txnVendorCreditItemsModels[${index}].amount`}
                                className={`form-control  form-select-sm ${
                                  formik.touched.txnVendorCreditItemsModels?.[
                                    index
                                  ]?.amount &&
                                  formik.errors.txnVendorCreditItemsModels?.[
                                    index
                                  ]?.amount
                                    ? "is-invalid"
                                    : ""
                                }`}
                                {...formik.getFieldProps(
                                  `txnVendorCreditItemsModels[${index}].amount`
                                )}
                              />
                              {formik.touched.txnVendorCreditItemsModels?.[
                                index
                              ]?.amount &&
                                formik.errors.txnVendorCreditItemsModels?.[
                                  index
                                ]?.amount && (
                                  <div className="invalid-feedback">
                                    {
                                      formik.errors.txnVendorCreditItemsModels[
                                        index
                                      ].amount
                                    }
                                  </div>
                                )}
                            </td>
                          </tr>
                        )
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              <div>
                <button
                  className="btn btn-button btn-sm my-4 mx-1"
                  type="button"
                  onClick={AddRowContent}
                >
                  Add row
                </button>
                {formik.values.txnVendorCreditItemsModels?.length > 1 && (
                  <button
                    className="btn btn-sm my-4 mx-1 delete border-danger bg-white text-danger"
                    onClick={deleteRow}
                  >
                    Delete
                  </button>
                )}
              </div>
              <div className="row mt-5 pt-0">
                <div className="col-md-6 col-12 mb-3 pt-0">
                  <lable className="form-lable">Customer Notes</lable>
                  <div className="mb-3">
                    <textarea
                      type="text"
                      className={`form-control  form-select-sm  ${
                        formik.touched.notes && formik.errors.notes
                          ? "is-invalid"
                          : ""
                      }`}
                      rows="4"
                      {...formik.getFieldProps("notes")}
                    />
                    {formik.touched.notes && formik.errors.notes && (
                      <div className="invalid-feedback">
                        {formik.errors.notes}
                      </div>
                    )}
                  </div>
                </div>
                <div
                  className="col-md-6 col-12 mt-5 rounded"
                  style={{ border: "1px solid lightgrey" }}
                >
                  <div className="row mb-3 mt-2">
                    <label className="col-sm-4 col-form-label">Sub Total</label>
                    <div className="col-sm-4"></div>
                    <div className="col-sm-4">
                      <input
                        type="text"
                        className={`form-control  form-select-sm ${
                          formik.touched.subTotal && formik.errors.subTotal
                            ? "is-invalid"
                            : ""
                        }`}
                        {...formik.getFieldProps("subTotal")}
                      />
                      {formik.touched.subTotal && formik.errors.subTotal && (
                        <div className="invalid-feedback">
                          {formik.errors.subTotal}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="row mb-3 mt-2">
                    <label className="col-sm-4 col-form-label">Discount</label>
                    <div className="col-sm-4"></div>
                    <div className="col-sm-4">
                      <input
                        type="text"
                        className={`form-control  form-select-sm ${
                          formik.touched.discountAmount &&
                          formik.errors.discountAmount
                            ? "is-invalid"
                            : ""
                        }`}
                        {...formik.getFieldProps("discountAmount")}
                      />
                      {formik.touched.discountAmount &&
                        formik.errors.discountAmount && (
                          <div className="invalid-feedback">
                            {formik.errors.discountAmount}
                          </div>
                        )}
                    </div>
                  </div>
                  <div className="row mb-3">
                    <label className="col-sm-4 col-form-label">
                      Adjustment
                    </label>
                    <div className="col-sm-4"></div>
                    <div className="col-sm-4">
                      <input
                        type="text"
                        className={`form-control  form-select-sm ${
                          formik.touched.totalTax && formik.errors.totalTax
                            ? "is-invalid"
                            : ""
                        }`}
                        {...formik.getFieldProps("totalTax")}
                      />
                      {formik.touched.totalTax && formik.errors.totalTax && (
                        <div className="invalid-feedback">
                          {formik.errors.totalTax}
                        </div>
                      )}
                    </div>
                  </div>

                  <hr />
                  <div className="row mb-3 mt-2">
                    <label className="col-sm-4 col-form-label">
                      Total ( Rs. )
                    </label>
                    <div className="col-sm-4"></div>
                    <div className="col-sm-4">
                      <input
                        type="text"
                        className={`form-control  form-select-sm ${
                          formik.touched.total && formik.errors.total
                            ? "is-invalid"
                            : ""
                        }`}
                        {...formik.getFieldProps("total")}
                      />
                      {formik.touched.total && formik.errors.total && (
                        <div className="invalid-feedback">
                          {formik.errors.total}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

export default VendorCreditEdit;
