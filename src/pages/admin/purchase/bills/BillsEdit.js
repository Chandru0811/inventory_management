import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import api from "../../../../config/URL";
import toast from "react-hot-toast";

function BillsEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [vendorData, setVendorData] = useState([]);
  const [itemData, setItemData] = useState([]);
  const [itemAccData, setItemAccData] = useState([]);
  const [itemCustomerData, setItemCustomerData] = useState([]);

  const validationSchema = Yup.object({
    vendorId: Yup.string().required("*Vendor name is required"),
    billNumber: Yup.string().required("*Bill Number is required"),
    billDate: Yup.string().required("*Bill Date is required"),
  });

  const formik = useFormik({
    initialValues: {
      vendorId: "",
      billNumber: "",
      orderNumber: "",
      billDate: "",
      dueDate: "",
      subject: "",
      subTotal: "",
      discount: "",
      total: "",
      notes: "",
      adjustments: "",
      billsItemDetailsDTOList: [
        {
          itemId: "",
          quantity: "",
          rate: "",
          customerDetail: "",
          accountId: "",
          amount: "",
        },
      ],
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      setLoading(true);
      try {
        const formData = new FormData();
        formData.append("vendorId", values.vendorId);
        formData.append("billNumber", values.billNumber);
        formData.append("orderNumber", values.orderNumber);
        formData.append("billDate", values.billDate);
        formData.append("dueDate", values.dueDate);
        formData.append("subject", values.subject);
        formData.append("subTotal", values.subTotal);
        formData.append("discount", values.discount);
        formData.append("total", values.total);
        formData.append("notes", values.notes);
        formData.append("adjustments", values.adjustments);
        formData.append("companyId", "1");
        formData.append(
          "itemDetails",
          JSON.stringify(
            values.billsItemDetailsDTOList?.map((item) => ({
              id: item.id,
              itemId: item.itemId,
              quantity: item.quantity,
              rate: item.rate,
              customerDetail: item.customerDetail,
              accountId: item.accountId,
              amount: item.amount,
            }))
          )
        );

        const response = await api.put(
          `billsUpdationWithItems/${id}`,
          formData
        );

        if (response.status === 200) {
          toast.success("Bill updated successfully");
          navigate("/bills");
        } else {
          toast.error(response.data.message);
        }
      } catch (error) {
        console.error("Error updating bill:", error);
        toast.error("Error: Unable to update bill");
      } finally {
        setLoading(false);
      }
    },
  });

  const AddRowContent = () => {
    formik.setFieldValue("itemDetails", [
      ...formik.values.itemDetails,
      {
        itemId: "",
        quantity: "",
        rate: "",
        customerDetail: "",
        accountId: "",
        amount: "",
      },
    ]);
  };

  const deleteRow = () => {
    if (formik.values.itemDetails?.length === 1) {
      return;
    }
    const updatedRows = [...formik.values.itemDetails];
    updatedRows.pop();
    formik.setFieldValue("itemDetails", updatedRows);
  };

  useEffect(() => {
    const fetchEditData = async () => {
      try {
        const response = await api.get(`/billsRetrivalWithItems/${id}`);
        const rest = response.data;

        const formattedData = {
          ...rest,
          billDate: rest.billDate
            ? new Date(rest.billDate).toISOString().split("T")[0]
            : undefined,
          dueDate: rest.dueDate
            ? new Date(rest.dueDate).toISOString().split("T")[0]
            : undefined,
        };
        formik.setValues(formattedData);
      } catch (e) {
        toast.error("Error fetching data: ", e?.response?.data?.message);
      }
    };

    fetchEditData();
  }, []);

  const fetchData = async () => {
    try {
      const [
        vendorResponse,
        itemsResponse,
        accountsResponse,
        customersResponse,
      ] = await Promise.all([
        api.get("vendorIdsWithDisplayNames"),
        api.get("itemId-name"),
        api.get("getAllAccounts"),
        api.get("getAllCustomerContact"),
        api.get(`billsRetrivalWithItems/${id}`),
      ]);

      setVendorData(vendorResponse.data || []);
      setItemData(itemsResponse.data || []);
      setItemAccData(accountsResponse.data || []);
      setItemCustomerData(customersResponse.data || []);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Error loading bill data");
    } finally {
      setInitialLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

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
                  <h1 className="h4 ls-tight headingColor">Edit Bill</h1>
                </div>
              </div>
              <div className="col-auto">
                <div className="hstack gap-2 justify-content-end">
                  <Link to="/bills">
                    <button type="button" className="btn btn-sm btn-light">
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
                    ) : null}
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
          <div className="container mb-5 mt-5">
            <div className="row py-4">
              <div className="col-md-6 col-12 mb-3">
                <label className="form-label">
                  Vendor Name<span className="text-danger">*</span>
                </label>
                <div className="mb-3">
                  <select
                    {...formik.getFieldProps("vendorId")}
                    className={`form-select form-select-sm ${
                      formik.touched.vendorId && formik.errors.vendorId
                        ? "is-invalid"
                        : ""
                    }`}
                  >
                    <option value=""></option>
                    {vendorData?.map((vendor) => (
                      <option key={vendor.id} value={vendor.id}>
                        {vendor.vendorDisplayName}
                      </option>
                    ))}
                  </select>
                  {formik.touched.vendorId && formik.errors.vendorId && (
                    <div className="invalid-feedback">
                      {formik.errors.vendorId}
                    </div>
                  )}
                </div>
              </div>

              <div className="col-md-6 col-12 mb-3">
                <label className="form-label">
                  Bill Number<span className="text-danger">*</span>
                </label>
                <div className="mb-3">
                  <input
                    type="text"
                    {...formik.getFieldProps("billNumber")}
                    className={`form-control form-control-sm ${
                      formik.touched.billNumber && formik.errors.billNumber
                        ? "is-invalid"
                        : ""
                    }`}
                  />
                  {formik.touched.billNumber && formik.errors.billNumber && (
                    <div className="invalid-feedback">
                      {formik.errors.billNumber}
                    </div>
                  )}
                </div>
              </div>

              <div className="col-md-6 col-12 mb-3">
                <label className="form-label">Order Number</label>
                <div className="mb-3">
                  <input
                    type="text"
                    {...formik.getFieldProps("orderNumber")}
                    className="form-control form-control-sm"
                  />
                </div>
              </div>

              <div className="col-md-6 col-12 mb-3">
                <label className="form-label">Subject</label>
                <div className="mb-3">
                  <input
                    type="text"
                    {...formik.getFieldProps("subject")}
                    className="form-control form-control-sm"
                  />
                </div>
              </div>

              <div className="col-md-6 col-12 mb-3">
                <label className="form-label">
                  Bill Date<span className="text-danger">*</span>
                </label>
                <div className="mb-3">
                  <input
                    type="date"
                    {...formik.getFieldProps("billDate")}
                    className={`form-control form-control-sm ${
                      formik.touched.billDate && formik.errors.billDate
                        ? "is-invalid"
                        : ""
                    }`}
                  />
                  {formik.touched.billDate && formik.errors.billDate && (
                    <div className="invalid-feedback">
                      {formik.errors.billDate}
                    </div>
                  )}
                </div>
              </div>

              <div className="col-md-6 col-12 mb-3">
                <label className="form-label">Due Date</label>
                <div className="mb-3">
                  <input
                    type="date"
                    {...formik.getFieldProps("dueDate")}
                    className="form-control form-control-sm"
                  />
                </div>
              </div>

              <div className="row">
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
                        <th style={{ width: "20%" }}>Item</th>
                        <th style={{ width: "25%" }}>Account</th>
                        <th style={{ width: "15%" }}>Quantity</th>
                        <th style={{ width: "15%" }}>Rate</th>
                        <th style={{ width: "15%" }}>Customer Details</th>
                        <th style={{ width: "15%" }}>Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {formik.values.billsItemDetailsDTOList?.map(
                        (item, index) => (
                          <tr key={index}>
                            <td>{index + 1}</td>
                            <td>
                              <select
                                name={`billsItemDetailsDTOList.${index}.itemId`}
                                {...formik.getFieldProps(
                                  `billsItemDetailsDTOList.${index}.itemId`
                                )}
                                className="form-select"
                              >
                                <option value="">Select Item</option>
                                {itemData?.map((item) => (
                                  <option key={item.id} value={item.id}>
                                    {item.name}
                                  </option>
                                ))}
                              </select>
                            </td>
                            <td>
                              <select
                                name={`billsItemDetailsDTOList.${index}.accountId`}
                                {...formik.getFieldProps(
                                  `billsItemDetailsDTOList.${index}.accountId`
                                )}
                                className="form-select"
                              >
                                <option value=""></option>
                                {itemAccData?.map((account) => (
                                  <option key={account.id} value={account.id}>
                                    {account.accountName}
                                  </option>
                                ))}
                              </select>
                            </td>
                            <td>
                              <input
                                type="text"
                                name={`billsItemDetailsDTOList.${index}.quantity`}
                                {...formik.getFieldProps(
                                  `billsItemDetailsDTOList.${index}.quantity`
                                )}
                                className="form-control"
                                onInput={(e) => {
                                  e.target.value = e.target.value
                                    .replace(/[^0-9]/g, "")
                                    .slice(0, 2);
                                }}
                              />
                            </td>
                            <td>
                              <input
                                type="text"
                                name={`billsItemDetailsDTOList.${index}.rate`}
                                {...formik.getFieldProps(
                                  `billsItemDetailsDTOList.${index}.rate`
                                )}
                                className="form-control"
                              />
                            </td>
                            <td>
                              <select
                                name={`billsItemDetailsDTOList.${index}.customerDetail`}
                                {...formik.getFieldProps(
                                  `billsItemDetailsDTOList.${index}.customerDetail`
                                )}
                                className="form-select"
                              >
                                <option value=""></option>
                                {itemCustomerData?.map((customer) => (
                                  <option key={customer.id} value={customer.id}>
                                    {customer.customerFirstName}
                                  </option>
                                ))}
                              </select>
                            </td>
                            <td>
                              <input
                                type="text"
                                name={`billsItemDetailsDTOList.${index}.amount`}
                                {...formik.getFieldProps(
                                  `billsItemDetailsDTOList.${index}.amount`
                                )}
                                className="form-control"
                              />
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
                  type="button"
                  className="btn btn-button btn-sm my-4 mx-1"
                  onClick={AddRowContent}
                >
                  Add row
                </button>
                {formik.values.itemDetails?.length > 1 && (
                  <button
                    type="button"
                    className="btn btn-sm my-4 mx-1 delete border-danger bg-white text-danger"
                    onClick={deleteRow}
                  >
                    Delete
                  </button>
                )}
              </div>

              <div className="row mt-5 pt-0">
                <div className="col-md-6 col-12 mb-3 pt-0">
                  <label className="form-label">Customer Notes</label>
                  <div className="mb-3">
                    <textarea
                      {...formik.getFieldProps("notes")}
                      className="form-control"
                      rows="4"
                    />
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
                        {...formik.getFieldProps("subTotal")}
                        className="form-control"
                      />
                    </div>
                  </div>
                  <div className="row mb-3">
                    <label className="col-sm-4 col-form-label">Discount</label>
                    <div className="col-sm-4"></div>
                    <div className="col-sm-4">
                      <input
                        type="text"
                        {...formik.getFieldProps("discount")}
                        className="form-control"
                      />
                    </div>
                  </div>
                  <div className="row mb-3">
                    <label className="col-sm-4 col-form-label">
                      Adjustments
                    </label>
                    <div className="col-sm-4"></div>
                    <div className="col-sm-4">
                      <input
                        type="text"
                        {...formik.getFieldProps("adjustments")}
                        className="form-control"
                      />
                    </div>
                  </div>
                  <hr />
                  <div className="row mb-3">
                    <label className="col-sm-4 col-form-label">
                      Total ( ₹ )
                    </label>
                    <div className="col-sm-4"></div>
                    <div className="col-sm-4">
                      <input
                        type="text"
                        {...formik.getFieldProps("total")}
                        className="form-control"
                      />
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

export default BillsEdit;
