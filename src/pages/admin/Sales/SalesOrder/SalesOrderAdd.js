import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import api from "../../../../config/URL";
import toast from "react-hot-toast";

const SalesOrderAdd = () => {
  const navigate = useNavigate();
  const [loading, setLoadIndicator] = useState(false);
  const [itemData, setItemData] = useState(null);
  const [customerData, setCustomerData] = useState(null);
  const [salesPerson, setSalesPerson] = useState(null);

  const validationSchema = Yup.object({
    customerId: Yup.string().required("*Customer Name is required"),
    salesOrder: Yup.string().required("*Sales Order is required"),
    salesOrderDate: Yup.string().required("*Sales Order Date is required"),
    salesOrderItemsJson: Yup.array().of(
      Yup.object({
        itemId: Yup.string().required("*Item is required"),
      })
    ),
  });

  const formik = useFormik({
    initialValues: {
      customerId: "",
      salesOrder: "",
      referenceNumber: "",
      salesOrderDate: "",
      expectedShipmentDate: "",
      paymentTerms: "",
      deliveryMethod: "",
      salesPerson: "",
      customerNotes: "",
      termsAndConditions: "",
      subTotal: "",
      total: "",
      attachFile: null,
      salesOrderItemsJson: [
        {
          itemId: "",
          quantity: "",
          rate: "",
          discount: "",
          amount: "",
        },
      ],
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      setLoadIndicator(true);
      try {
        const formData = new FormData();

        formData.append("customerId", values.customerId);
        // formData.append("customerName", values.customerName | "");
        formData.append("salesOrder", values.salesOrder);
        formData.append("referenceNumber", values.referenceNumber);
        formData.append("salesOrderDate", values.salesOrderDate);
        formData.append("expectedShipmentDate", values.expectedShipmentDate);
        formData.append("paymentTerms", values.paymentTerms);
        formData.append("deliveryMethod", values.deliveryMethod);
        formData.append("salesPerson", values.salesPerson);
        formData.append("customerNotes", values.customerNotes);
        formData.append("termsAndConditions", values.termsAndConditions);
        formData.append("subTotal", values.subTotal);
        formData.append("total", values.total);
        formData.append("attachFile", values.attachFile);
        formData.append(
          "salesOrderItemsJson",
          JSON.stringify(
            values.salesOrderItemsJson?.map((item) => ({
              itemId: item.itemId?.id || item.itemId,
              quantity: item.quantity,
              rate: item.rate,
              discount: item.discount,
              amount: item.amount,
            }))
          )
        );

        const response = await api.post("createSalesOrderWithItems", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        if (response.status === 200) {
          toast.success(response.data.message);
          navigate("/salesorder");
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

  // useEffect(() => {
  //   const updateAndCalculate = async () => {
  //     try {
  //       let totalRate = 0;
  //       let totalAmount = 0;
  //       let totalTax = 0;
  //       let discAmount = 0;
  //       const updatedItems = await Promise.all(
  //         formik.values.salesOrderItemsJson.map(async (item, index) => {
  //           if (
  //             item.quantity &&
  //             item.rate &&
  //             item.disc !== undefined &&
  //             item.taxRate !== undefined
  //           ) {
  //             const amount = calculateAmount(
  //               item.quantity,
  //               item.rate,
  //               item.disc,
  //               item.taxRate
  //             );
  //             const itemTotalRate = item.quantity * item.rate;
  //             const itemTotalTax = itemTotalRate * (item.taxRate / 100);
  //             const itemTotalDisc = itemTotalRate * (item.disc / 100);
  //             discAmount += itemTotalDisc;
  //             totalRate += item.rate;
  //             totalAmount += amount;
  //             totalTax += itemTotalTax;
  //             return { ...item, amount };
  //           }
  //           return item;
  //         })
  //       );
  //       formik.setValues({
  //         ...formik.values,
  //         salesOrderItemsJson: updatedItems,
  //       });
  //       formik.setFieldValue("subTotal", totalRate);
  //       formik.setFieldValue("total", totalAmount);
  //       formik.setFieldValue("totalTax", totalTax);
  //       formik.setFieldValue("discountAmount", discAmount);
  //     } catch (error) {
  //       toast.error("Error updating items: ", error.message);
  //     }
  //   };

  //   updateAndCalculate();
  // }, [
  //   formik.values.salesOrderItemsJson?.map((item) => item.quantity).join(""),
  //   formik.values.salesOrderItemsJson
  //     ?.map((item) => item.rate)
  //     .join(""),
  //   formik.values.salesOrderItemsJson?.map((item) => item.disc).join(""),
  //   formik.values.salesOrderItemsJson
  //     ?.map((item) => item.taxRate)
  //     .join(""),
  // ]);

  const calculateAmount = (quantity, rate, disc, taxRate) => {
    const totalRate = quantity * rate;
    const discountAmount = totalRate * (disc / 100);
    const taxableAmount = totalRate * (taxRate / 100);
    const totalAmount = totalRate + taxableAmount - discountAmount;
    return totalAmount;
  };

  const AddRowContent = () => {
    formik.setFieldValue("salesOrderItemsJson", [
      ...formik.values.salesOrderItemsJson,
      {
        itemId: "",
        quantity: "",
        rate: "",
        disc: "",
        taxRate: "",
        amount: "",
      },
    ]);
  };

  const deleteRow = (index) => {
    if (formik.values.salesOrderItemsJson.length === 1) {
      return;
    }
    const updatedRows = [...formik.values.salesOrderItemsJson];
    updatedRows.pop();
    formik.setFieldValue("salesOrderItemsJson", updatedRows);
  };

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await api.get("getAllCustomerIdsWithNames");
        setCustomerData(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    getData();
  }, []);

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await api.get("getAllSalesPersonIdsWithNames");
        setSalesPerson(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    getData();
  }, []);

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await api.get("itemId-name");
        setItemData(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    getData();
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
                  <h1 className="h4 ls-tight headingColor">Add Sales Order</h1>
                </div>
              </div>
              <div className="col-auto">
                <div className="hstack gap-2 justify-content-end">
                  <Link to="/salesorder">
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
                  Sales Order Date<span className="text-danger">*</span>
                </lable>
                <div className="mb-3">
                  <input
                    type="date"
                    name="salesOrderDate"
                    className={`form-control form-control-sm  ${
                      formik.touched.salesOrderDate &&
                      formik.errors.salesOrderDate
                        ? "is-invalid"
                        : ""
                    }`}
                    {...formik.getFieldProps("salesOrderDate")}
                  />
                  {formik.touched.salesOrderDate &&
                    formik.errors.salesOrderDate && (
                      <div className="invalid-feedback">
                        {formik.errors.salesOrderDate}
                      </div>
                    )}
                </div>
              </div>

              <div className="col-md-6 col-12 mb-2">
                <lable className="form-lable">Expected Shipment Date</lable>
                <div className="mb-3">
                  <input
                    type="date"
                    name="expectedShipmentDate"
                    className={`form-control form-control-sm ${
                      formik.touched.expectedShipmentDate &&
                      formik.errors.expectedShipmentDate
                        ? "is-invalid"
                        : ""
                    }`}
                    {...formik.getFieldProps("expectedShipmentDate")}
                  />
                  {formik.touched.expectedShipmentDate &&
                    formik.errors.expectedShipmentDate && (
                      <div className="invalid-feedback">
                        {formik.errors.expectedShipmentDate}
                      </div>
                    )}
                </div>
              </div>

              <div className="col-md-6 col-12 mb-2">
                <lable className="form-lable">Reference</lable>
                <div className="mb-3">
                  <input
                    type="text"
                    name="referenceNumber"
                    className={`form-control form-control-sm ${
                      formik.touched.referenceNumber &&
                      formik.errors.referenceNumber
                        ? "is-invalid"
                        : ""
                    }`}
                    {...formik.getFieldProps("referenceNumber")}
                  />
                  {formik.touched.referenceNumber &&
                    formik.errors.referenceNumber && (
                      <div className="invalid-feedback">
                        {formik.errors.referenceNumber}
                      </div>
                    )}
                </div>
              </div>

              <div className="col-md-6 col-12 mb-2">
                <lable className="form-lable">Payment Terms</lable>
                <div className="mb-3">
                  <select
                    type="text"
                    name="paymentTerms"
                    className={`form-select form-select-sm ${
                      formik.touched.paymentTerms && formik.errors.paymentTerms
                        ? "is-invalid"
                        : ""
                    }`}
                    {...formik.getFieldProps("paymentTerms")}
                  >
                    <option></option>
                    <option value="1">Due end of the month</option>
                    <option value="2">Due end of next month</option>
                    <option value="3">Due on Receipt</option>
                  </select>
                  {formik.touched.paymentTerms &&
                    formik.errors.paymentTerms && (
                      <div className="invalid-feedback">
                        {formik.errors.paymentTerms}
                      </div>
                    )}
                </div>
              </div>
              <div className="col-md-6 col-12 mb-2">
                <lable className="form-lable">Delivery Method</lable>
                <div className="mb-3">
                  <input
                    type="text"
                    name="deliveryMethod"
                    className={`form-control form-control-sm ${
                      formik.touched.deliveryMethod &&
                      formik.errors.deliveryMethod
                        ? "is-invalid"
                        : ""
                    }`}
                    {...formik.getFieldProps("deliveryMethod")}
                  />
                  {formik.touched.deliveryMethod &&
                    formik.errors.deliveryMethod && (
                      <div className="invalid-feedback">
                        {formik.errors.deliveryMethod}
                      </div>
                    )}
                </div>
              </div>
              {/* <div className="col-md-6 col-12 mb-2">
                <lable className="form-lable">Sales Person</lable>
                <div className="mb-3">
                  <input
                    type="text"
                    name="salesPerson"
                    className={`form-control  ${
                      formik.touched.salesPerson && formik.errors.salesPerson
                        ? "is-invalid"
                        : ""
                    }`}
                    {...formik.getFieldProps("salesPerson")}
                  />
                  {formik.touched.salesPerson && formik.errors.salesPerson && (
                    <div className="invalid-feedback">
                      {formik.errors.salesPerson}
                    </div>
                  )}
                </div>
              </div> */}
              <div className="col-md-6 col-12 mb-3">
                <lable className="form-lable">Sales Person</lable>
                <div className="mb-3">
                  <select
                    {...formik.getFieldProps("salesPerson")}
                    className={`form-select form-select-sm  ${
                      formik.touched.salesPerson && formik.errors.salesPerson
                        ? "is-invalid"
                        : ""
                    }`}
                  >
                    <option selected></option>
                    {salesPerson &&
                      salesPerson.map((data) => (
                        <option
                          key={data.sales_person_id}
                          value={data.sales_person_id}
                        >
                          {data.sales_person_name}
                        </option>
                      ))}
                  </select>
                  {formik.touched.salesPerson && formik.errors.salesPerson && (
                    <div className="invalid-feedback">
                      {formik.errors.salesPerson}
                    </div>
                  )}
                </div>
              </div>
              <div className="col-md-6 col-12 mb-2">
                <lable className="form-lable">Attach File</lable>
                <div className="mb-3">
                  <input
                    type="file"
                    className="form-control form-control-sm"
                    onChange={(event) => {
                      formik.setFieldValue("attachFile", event.target.files[0]);
                    }}
                    onBlur={formik.handleBlur}
                  />
                  {formik.touched.attachFile && formik.errors.attachFile && (
                    <div className="invalid-feedback">
                      {formik.errors.attachFile}
                    </div>
                  )}
                </div>
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
                      <th style={{ width: "15%" }}>
                        Item Details
                        <span className="text-danger text-center">*</span>
                      </th>
                      <th style={{ width: "10%" }}>Quantity</th>
                      <th style={{ width: "15%" }}>Rate</th>
                      <th style={{ width: "15%" }}>Discount(%)</th>
                      <th style={{ width: "15%" }}>Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {formik.values.salesOrderItemsJson?.map((item, index) => (
                      <tr key={index}>
                        <td>
                          <select
                            name={`salesOrderItemsJson[${index}].itemId`}
                            {...formik.getFieldProps(
                              `salesOrderItemsJson[${index}].itemId`
                            )}
                            className={`form-select ${
                              formik.touched.salesOrderItemsJson?.[index]
                                ?.itemId &&
                              formik.errors.salesOrderItemsJson?.[index]?.itemId
                                ? "is-invalid"
                                : ""
                            }`}
                          >
                            <option selected> </option>
                            {itemData &&
                              itemData.map((data) => (
                                <option key={data.id} value={data.id}>
                                  {data.name}
                                </option>
                              ))}
                          </select>
                          {formik.touched.salesOrderItemsJson?.[index]
                            ?.itemId &&
                            formik.errors.salesOrderItemsJson?.[index]
                              ?.itemId && (
                              <div className="invalid-feedback">
                                {
                                  formik.errors.salesOrderItemsJson[index]
                                    .itemId
                                }
                              </div>
                            )}
                        </td>
                        <td>
                          <input
                            onInput={(event) => {
                              event.target.value = event.target.value.replace(
                                /[^0-9]/g,
                                ""
                              );
                            }}
                            type="text"
                            name={`salesOrderItemsJson[${index}].quantity`}
                            className={`form-control ${
                              formik.touched.salesOrderItemsJson?.[index]
                                ?.quantity &&
                              formik.errors.salesOrderItemsJson?.[index]
                                ?.quantity
                                ? "is-invalid"
                                : ""
                            }`}
                            {...formik.getFieldProps(
                              `salesOrderItemsJson[${index}].quantity`
                            )}
                          />
                          {formik.touched.salesOrderItemsJson?.[index]
                            ?.quantity &&
                            formik.errors.salesOrderItemsJson?.[index]
                              ?.quantity && (
                              <div className="invalid-feedback">
                                {
                                  formik.errors.salesOrderItemsJson[index]
                                    .quantity
                                }
                              </div>
                            )}
                        </td>
                        <td>
                          <input
                            type="text"
                            name={`salesOrderItemsJson[${index}].rate`}
                            className={`form-control ${
                              formik.touched.salesOrderItemsJson?.[index]
                                ?.rate &&
                              formik.errors.salesOrderItemsJson?.[index]?.rate
                                ? "is-invalid"
                                : ""
                            }`}
                            {...formik.getFieldProps(
                              `salesOrderItemsJson[${index}].rate`
                            )}
                          />
                          {formik.touched.salesOrderItemsJson?.[index]?.rate &&
                            formik.errors.salesOrderItemsJson?.[index]
                              ?.rate && (
                              <div className="invalid-feedback">
                                {formik.errors.salesOrderItemsJson[index].rate}
                              </div>
                            )}
                        </td>
                        <td>
                          <input
                            onInput={(event) => {
                              event.target.value = event.target.value
                                .replace(/[^0-9]/g, "")
                                .slice(0, 2);
                            }}
                            type="text"
                            name={`salesOrderItemsJson[${index}].discount`}
                            className={`form-control ${
                              formik.touched.salesOrderItemsJson?.[index]
                                ?.discount &&
                              formik.errors.salesOrderItemsJson?.[index]?.discount
                                ? "is-invalid"
                                : ""
                            }`}
                            {...formik.getFieldProps(
                              `salesOrderItemsJson[${index}].discount`
                            )}
                          />
                          {formik.touched.salesOrderItemsJson?.[index]?.discount &&
                            formik.errors.salesOrderItemsJson?.[index]
                              ?.discount && (
                              <div className="invalid-feedback">
                                {formik.errors.salesOrderItemsJson[index].discount}
                              </div>
                            )}
                        </td>

                        <td>
                          <input
                            type="text"
                            name={`salesOrderItemsJson[${index}].amount`}
                            className={`form-control ${
                              formik.touched.salesOrderItemsJson?.[index]
                                ?.amount &&
                              formik.errors.salesOrderItemsJson?.[index]?.amount
                                ? "is-invalid"
                                : ""
                            }`}
                            {...formik.getFieldProps(
                              `salesOrderItemsJson[${index}].amount`
                            )}
                          />
                          {formik.touched.salesOrderItemsJson?.[index]
                            ?.amount &&
                            formik.errors.salesOrderItemsJson?.[index]
                              ?.amount && (
                              <div className="invalid-feedback">
                                {
                                  formik.errors.salesOrderItemsJson[index]
                                    .amount
                                }
                              </div>
                            )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div>
              <button
                className="btn btn-button btn-primary btn-sm my-4 mx-1"
                type="button"
                onClick={AddRowContent}
              >
                Add row
              </button>
              {formik.values.salesOrderItemsJson?.length > 1 && (
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
                    className={`form-control  ${
                      formik.touched.customerNotes &&
                      formik.errors.customerNotes
                        ? "is-invalid"
                        : ""
                    }`}
                    rows="4"
                    {...formik.getFieldProps("customerNotes")}
                  />
                  {formik.touched.customerNotes &&
                    formik.errors.customerNotes && (
                      <div className="invalid-feedback">
                        {formik.errors.customerNotes}
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
                      className={`form-control ${
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
                <div className="row mb-3">
                  <label className="col-sm-4 col-form-label">Adjustment</label>
                  <div className="col-sm-4"></div>
                  <div className="col-sm-4">
                    <input
                      type="text"
                      className={`form-control ${
                        formik.touched.adjustment && formik.errors.adjustment
                          ? "is-invalid"
                          : ""
                      }`}
                      {...formik.getFieldProps("adjustment")}
                    />
                    {formik.touched.adjustment && formik.errors.adjustment && (
                      <div className="invalid-feedback">
                        {formik.errors.adjustment}
                      </div>
                    )}
                  </div>
                </div>

                <hr />
                <div className="row mb-3 mt-2">
                  <label className="col-sm-4 col-form-label">Total</label>
                  <div className="col-sm-4"></div>
                  <div className="col-sm-4">
                    <input
                      type="text"
                      className={`form-control ${
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

              <div className="col-md-6 col-12 mb-3">
                <lable className="form-lable">Terms & Conditions</lable>
                <div className="mb-3">
                  <textarea
                    className={`form-control  ${
                      formik.touched.termsAndConditions &&
                      formik.errors.termsAndConditions
                        ? "is-invalid"
                        : ""
                    }`}
                    rows="4"
                    {...formik.getFieldProps("termsAndConditions")}
                  />
                  {formik.touched.termsAndConditions &&
                    formik.errors.termsAndConditions && (
                      <div className="invalid-feedback">
                        {formik.errors.termsAndConditions}
                      </div>
                    )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default SalesOrderAdd;
