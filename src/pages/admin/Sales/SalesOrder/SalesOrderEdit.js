import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import api from "../../../../config/URL";
import toast from "react-hot-toast";

const SalesOrderEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoadIndicator] = useState(false);
  const [itemData, setItemData] = useState(null);

  const validationSchema = Yup.object({
    customerName: Yup.string().required("*Customer Name is required"),
    salesOrder: Yup.string().required("*Sales Order is required"),
    salesOrderDate: Yup.string().required("*Sales Order Date is required"),
  });

  const formik = useFormik({
    initialValues: {
      customerName: "",
      salesOrder: "",
      referenceNumber: "",
      salesOrderDate: "",
      expectedShipmentDate: "",
      paymentTermsId: "",
      deliveryMethod: "",
      salesPerson: "",
      txnInvoiceOrderItemsModels: [
        {
          item: "",
          qty: "",
          price: "",
          disc: "",
          taxRate: "",
          amount: "",
        },
      ],
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      setLoadIndicator(true);
      try {
        const response = await api.put(`/updateSalesOrders/${id}`, values);
        if (response.status === 201) {
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

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await api.get(`/getAllSalesOrdersById/${id}`);
        const rest = response.data;

        const formattedData = {
          ...rest,
          salesOrderDate: rest.salesOrderDate
            ? new Date(rest.salesOrderDate).toISOString().split("T")[0]
            : undefined,
          expectedShipmentDate: rest.expectedShipmentDate
            ? new Date(rest.expectedShipmentDate).toISOString().split("T")[0]
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
    // useEffect(() => {
  //   const updateAndCalculate = async () => {
  //     try {
  //       let totalRate = 0;
  //       let totalAmount = 0;
  //       let totalTax = 0;
  //       let discAmount = 0;
  //       const updatedItems = await Promise.all(
  //         formik.values.txnInvoiceOrderItemsModels.map(async (item, index) => {
  //           if (
  //             item.qty &&
  //             item.price &&
  //             item.disc !== undefined &&
  //             item.taxRate !== undefined
  //           ) {
  //             const amount = calculateAmount(
  //               item.qty,
  //               item.price,
  //               item.disc,
  //               item.taxRate
  //             );
  //             const itemTotalRate = item.qty * item.price;
  //             const itemTotalTax = itemTotalRate * (item.taxRate / 100);
  //             const itemTotalDisc = itemTotalRate * (item.disc / 100);
  //             discAmount += itemTotalDisc;
  //             totalRate += item.price;
  //             totalAmount += amount;
  //             totalTax += itemTotalTax;
  //             return { ...item, amount };
  //           }
  //           return item;
  //         })
  //       );
  //       formik.setValues({
  //         ...formik.values,
  //         txnInvoiceOrderItemsModels: updatedItems,
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
  //   formik.values.txnInvoiceOrderItemsModels?.map((item) => item.qty).join(""),
  //   formik.values.txnInvoiceOrderItemsModels
  //     ?.map((item) => item.price)
  //     .join(""),
  //   formik.values.txnInvoiceOrderItemsModels?.map((item) => item.disc).join(""),
  //   formik.values.txnInvoiceOrderItemsModels
  //     ?.map((item) => item.taxRate)
  //     .join(""),
  // ]);

  const calculateAmount = (qty, price, disc, taxRate) => {
    const totalRate = qty * price;
    const discountAmount = totalRate * (disc / 100);
    const taxableAmount = totalRate * (taxRate / 100);
    const totalAmount = totalRate + taxableAmount - discountAmount;
    return totalAmount;
  };

  const AddRowContent = () => {
    formik.setFieldValue("txnInvoiceOrderItemsModels", [
      ...(formik.values.txnInvoiceOrderItemsModels || []),
      {
        item: "",
        qty: "",
        price: "",
        disc: "",
        taxRate: "",
        amount: "",
      },
    ]);
  };

  const deleteRow = (index) => {
    if (formik.values.txnInvoiceOrderItemsModels.length === 1) {
      return;
    }
    const updatedRows = [...formik.values.txnInvoiceOrderItemsModels];
    updatedRows.pop();
    formik.setFieldValue("txnInvoiceOrderItemsModels", updatedRows);
  };
  return (
    <div className="container-fluid p-2 minHeight m-0">
      <form onSubmit={formik.handleSubmit}>
        <div
          className="card shadow border-0 mb-2 top-header"
          style={{ borderRadius: "0" }}
        >
          <div className="container-fluid py-4">
            <div className="row align-items-center">
              <div className="col">
                <div className="d-flex align-items-center gap-4">
                  <h1 className="h4 ls-tight headingColor">Edit Sales Order</h1>
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
          <div className="container mb-5">
            <div className="row py-4">
              <div className="col-md-6 col-12 mb-2">
                <lable className="form-lable">
                  Customer Name<span className="text-danger">*</span>
                </lable>
                <div className="mb-3">
                  <input
                    type="text"
                    name="customerName"
                    className={`form-control ${
                      formik.touched.customerName && formik.errors.customerName
                        ? "is-invalid"
                        : ""
                    }`}
                    {...formik.getFieldProps("customerName")}
                  />
                  {formik.touched.customerName &&
                    formik.errors.customerName && (
                      <div className="invalid-feedback">
                        {formik.errors.customerName}
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
                    className={`form-control  ${
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
                    className={`form-control  ${
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
                    className={`form-control  ${
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
                    className={`form-control  ${
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
                  <input
                    type="text"
                    name="paymentTermsId"
                    className={`form-control  ${
                      formik.touched.paymentTermsId &&
                      formik.errors.paymentTermsId
                        ? "is-invalid"
                        : ""
                    }`}
                    {...formik.getFieldProps("paymentTermsId")}
                  />
                  {formik.touched.paymentTermsId &&
                    formik.errors.paymentTermsId && (
                      <div className="invalid-feedback">
                        {formik.errors.paymentTermsId}
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
                    className={`form-control  ${
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
              <div className="col-md-6 col-12 mb-2">
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
                              Item Details<span className="text-danger">*</span>
                            </th>
                            <th style={{ width: "10%" }}>Quantity</th>
                            <th style={{ width: "15%" }}>Rate</th>
                            <th style={{ width: "15%" }}>Discount(%)</th>
                            <th style={{ width: "15%" }}>Amount</th>
                          </tr>
                        </thead>
                        <tbody>
                          {formik.values.txnInvoiceOrderItemsModels?.map(
                            (item, index) => (
                              <tr key={index}>
                                <td>
                                  <select
                                    name={`txnInvoiceOrderItemsModels[${index}].item`}
                                    {...formik.getFieldProps(
                                      `txnInvoiceOrderItemsModels[${index}].item`
                                    )}
                                    className={`form-select ${
                                      formik.touched
                                        .txnInvoiceOrderItemsModels?.[index]
                                        ?.item &&
                                      formik.errors
                                        .txnInvoiceOrderItemsModels?.[index]
                                        ?.item
                                        ? "is-invalid"
                                        : ""
                                    }`}
                                  >
                                    <option selected> </option>
                                    {itemData &&
                                      itemData.map((itemId) => (
                                        <option
                                          key={itemId.id}
                                          value={itemId.id}
                                        >
                                          {itemId.itemName}
                                        </option>
                                      ))}
                                  </select>
                                  {formik.touched.txnInvoiceOrderItemsModels?.[
                                    index
                                  ]?.item &&
                                    formik.errors.txnInvoiceOrderItemsModels?.[
                                      index
                                    ]?.item && (
                                      <div className="invalid-feedback">
                                        {
                                          formik.errors
                                            .txnInvoiceOrderItemsModels[index]
                                            .item
                                        }
                                      </div>
                                    )}
                                </td>
                                <td>
                                  <input
                                    onInput={(event) => {
                                      event.target.value =
                                        event.target.value.replace(
                                          /[^0-9]/g,
                                          ""
                                        );
                                    }}
                                    type="text"
                                    name={`txnInvoiceOrderItemsModels[${index}].qty`}
                                    className={`form-control ${
                                      formik.touched
                                        .txnInvoiceOrderItemsModels?.[index]
                                        ?.qty &&
                                      formik.errors
                                        .txnInvoiceOrderItemsModels?.[index]
                                        ?.qty
                                        ? "is-invalid"
                                        : ""
                                    }`}
                                    {...formik.getFieldProps(
                                      `txnInvoiceOrderItemsModels[${index}].qty`
                                    )}
                                  />
                                  {formik.touched.txnInvoiceOrderItemsModels?.[
                                    index
                                  ]?.qty &&
                                    formik.errors.txnInvoiceOrderItemsModels?.[
                                      index
                                    ]?.qty && (
                                      <div className="invalid-feedback">
                                        {
                                          formik.errors
                                            .txnInvoiceOrderItemsModels[index]
                                            .qty
                                        }
                                      </div>
                                    )}
                                </td>
                                <td>
                                  <input
                                    type="text"
                                    name={`txnInvoiceOrderItemsModels[${index}].price`}
                                    className={`form-control ${
                                      formik.touched
                                        .txnInvoiceOrderItemsModels?.[index]
                                        ?.price &&
                                      formik.errors
                                        .txnInvoiceOrderItemsModels?.[index]
                                        ?.price
                                        ? "is-invalid"
                                        : ""
                                    }`}
                                    {...formik.getFieldProps(
                                      `txnInvoiceOrderItemsModels[${index}].price`
                                    )}
                                  />
                                  {formik.touched.txnInvoiceOrderItemsModels?.[
                                    index
                                  ]?.price &&
                                    formik.errors.txnInvoiceOrderItemsModels?.[
                                      index
                                    ]?.price && (
                                      <div className="invalid-feedback">
                                        {
                                          formik.errors
                                            .txnInvoiceOrderItemsModels[index]
                                            .price
                                        }
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
                                    name={`txnInvoiceOrderItemsModels[${index}].disc`}
                                    className={`form-control ${
                                      formik.touched
                                        .txnInvoiceOrderItemsModels?.[index]
                                        ?.disc &&
                                      formik.errors
                                        .txnInvoiceOrderItemsModels?.[index]
                                        ?.disc
                                        ? "is-invalid"
                                        : ""
                                    }`}
                                    {...formik.getFieldProps(
                                      `txnInvoiceOrderItemsModels[${index}].disc`
                                    )}
                                  />
                                  {formik.touched.txnInvoiceOrderItemsModels?.[
                                    index
                                  ]?.disc &&
                                    formik.errors.txnInvoiceOrderItemsModels?.[
                                      index
                                    ]?.disc && (
                                      <div className="invalid-feedback">
                                        {
                                          formik.errors
                                            .txnInvoiceOrderItemsModels[index]
                                            .disc
                                        }
                                      </div>
                                    )}
                                </td>
                                <td>
                                  <input
                                    type="text"
                                    name={`txnInvoiceOrderItemsModels[${index}].amount`}
                                    className={`form-control ${
                                      formik.touched
                                        .txnInvoiceOrderItemsModels?.[index]
                                        ?.amount &&
                                      formik.errors
                                        .txnInvoiceOrderItemsModels?.[index]
                                        ?.amount
                                        ? "is-invalid"
                                        : ""
                                    }`}
                                    {...formik.getFieldProps(
                                      `txnInvoiceOrderItemsModels[${index}].amount`
                                    )}
                                  />
                                  {formik.touched.txnInvoiceOrderItemsModels?.[
                                    index
                                  ]?.amount &&
                                    formik.errors.txnInvoiceOrderItemsModels?.[
                                      index
                                    ]?.amount && (
                                      <div className="invalid-feedback">
                                        {
                                          formik.errors
                                            .txnInvoiceOrderItemsModels[index]
                                            .amount
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
                      className="btn btn-button btn-primary btn-sm my-4 mx-1"
                      type="button"
                      onClick={AddRowContent}
                    >
                      Add row
                    </button>
                    {formik.values.txnInvoiceOrderItemsModels?.length > 1 && (
                      <button
                        className="btn btn-sm my-4 mx-1 delete border-danger bg-white text-danger"
                        onClick={deleteRow}
                      >
                        Delete
                      </button>
                    )}
                  </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default SalesOrderEdit;
