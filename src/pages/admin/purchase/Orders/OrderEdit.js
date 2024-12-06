import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import toast from "react-hot-toast";
import api from "../../../../config/URL";

function OrderAdd() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoadIndicator] = useState(false);
  const [itemData, setItemData] = useState(null);
  const [account, setAccount] = useState(null);
  const [vendor, setVendor] = useState(null);
  const [data, setData] = useState([]);

  const validationSchema = Yup.object({
    vendorId: Yup.string().required("*Vendor name is required"),
    deliveryAddressCategory: Yup.string().required(
      "*Delivery address category is required"
    ),
    deliveryAddress: Yup.string().required("*Delivery address is required"),
    purchaseOrderNumber: Yup.string().required("*Purchase order is required"),
  });

  const formik = useFormik({
    initialValues: {
      vendorId: "",
      deliveryAddressCategory: "",
      deliveryAddress: "",
      purchaseOrderNumber: "",
      purchaseOrderRef: "",
      date: "",
      deliveryDate: "",
      paymentTerm: "",
      shipmentPreference: "",
      notes: "",
      subTotal: "",
      discount: "",
      adjustment: "",
      total: "",
      termsCondition: "",
      file: null,
      purchaseItemDetailsModels: [
        {
          itemId: "",
          accountId: "",
          quantity: "",
          rate: "",
          amount: "",
        },
      ],
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      setLoadIndicator(true);

      const formData = new FormData();
      formData.append("vendorId", values.vendorId);
      formData.append(
        "deliveryAddressCategory",
        values.deliveryAddressCategory
      );
      formData.append("deliveryAddress", values.deliveryAddress);
      formData.append("purchaseOrderNumber", values.purchaseOrderNumber);
      formData.append("purchaseOrderRef", values.purchaseOrderRef);
      formData.append("date", values.date);
      formData.append("deliveryDate", values.deliveryDate);
      formData.append("paymentTerm", values.paymentTerm);
      formData.append("shipmentPreference", values.shipmentPreference);
      formData.append("subTotal", values.subTotal);
      formData.append("discount", values.discount);
      formData.append("adjustment", values.adjustment);
      formData.append("total", values.total);
      formData.append("notes", values.notes);
      formData.append("termsCondition", values.termsCondition);
      formData.append("attachFile", values.attachFile);
      formData.append(
        "purchaseOrderItemsJson",
        JSON.stringify(
          values.purchaseItemDetailsModels.map((item) => ({
            id: item.id,
            itemId: item.itemId?.id || item.itemId,
            accountId: item.accountId,
            quantity: item.quantity,
            rate: item.rate,
            amount: item.amount,
          }))
        )
      );

      try {
        const response = await api.put(
          `/updatePurchasesOrdersItems/${id}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        if (response.status === 200) {
          toast.success(response.data.message);
          navigate("/order");
        } else {
          toast.error(response.data.message);
        }
      } catch (error) {
        toast.error("Error: Unable to save sales order.");
      } finally {
        setLoadIndicator(false);
      }
    },
  });

  const AddRowContent = () => {
    formik.setFieldValue("purchaseItemDetailsModels", [
      ...formik.values.purchaseItemDetailsModels,
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
    if (formik.values.purchaseItemDetailsModels.length === 1) {
      return;
    }
    const updatedRows = [...formik.values.purchaseItemDetailsModels];
    updatedRows.pop();
    formik.setFieldValue("purchaseItemDetailsModels", updatedRows);
  };

  useEffect(() => {
    recalculateSubtotalAndTotal();
  }, [formik.values]);

  const handleItemSelection = async (index, event) => {
    const selectedItemId = event.target.value;
    try {
      const response = await api.get(`getItemsById/${selectedItemId}`);
      const itemDetails = response.data;

      if (itemDetails) {
        await formik.setFieldValue(`purchaseItemDetailsModels[${index}]`, {
          itemId: selectedItemId,
          name: itemDetails.name || 0,
          rate: itemDetails.sellingPrice || 0,
          unitPrice: itemDetails.sellingPrice || 0,
          quantity: 1,
          discount: 0,
          amount: itemDetails.sellingPrice || 0,
        });

        recalculateSubtotalAndTotal();
      }
    } catch (error) {
      toast.error("Error fetching item details: " + error.message);
    }
  };

  const handleQuantityChange = async (index, quantity, discount) => {
    const item = formik.values.purchaseItemDetailsModels[index] || {};
    const newRate = item.unitPrice * quantity || item.rate * quantity || 0;
    const currentRate = item.unitPrice || item.rate || 0;
    const newDiscount = discount ? (newRate * discount) / 100 : 0;
    const newAmount = newRate - newDiscount || 0;

    await formik.setFieldValue(
      `purchaseItemDetailsModels[${index}].rate`,
      currentRate
    );
    await formik.setFieldValue(
      `purchaseItemDetailsModels[${index}].amount`,
      parseFloat(newAmount.toFixed(2))
    );

    recalculateSubtotalAndTotal();
  };

  const recalculateSubtotalAndTotal = () => {
    const deliveryItems = formik.values.purchaseItemDetailsModels || [];

    // Calculate the subtotal by summing up all item amounts
    const subTotal = deliveryItems.reduce(
      (sum, item) => sum + (parseFloat(item.amount) || 0),
      0
    );

    formik.setFieldValue("subTotal", subTotal.toFixed(2));

    const discount = parseFloat(formik.values.discount) || 0;

    const adjustment = parseFloat(formik.values.adjustment) || 0;
    const discountTotal = subTotal - (subTotal * discount) / 100;
    const total = discountTotal + adjustment;

    formik.setFieldValue("total", total.toFixed(2));
  };

  const handleAdjustmentChange = (event) => {
    const adjustment = event.target.value;
    formik.setFieldValue("adjustment", adjustment);
    recalculateSubtotalAndTotal();
  };

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await api.get(`/getAllPurchaseOrderById/${id}`);
        const rest = response.data;

        const formattedData = {
          ...rest,
          date: rest.date
            ? new Date(rest.date).toISOString().split("T")[0]
            : undefined,
          deliveryDate: rest.deliveryDate
            ? new Date(rest.deliveryDate).toISOString().split("T")[0]
            : undefined,
        };
        formik.setValues(formattedData);
        setData(response.data);
      } catch (e) {
        toast.error("Error fetching data: ", e?.response?.data?.message);
      }
    };

    getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await api.get("getAllAccounts");
        setAccount(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    getData();
  }, []);

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await api.get("vendorIdsWithDisplayNames");
        setVendor(response.data);
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
    <div className="container-fluid p-2 minHeight m-0">
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
                    Edit Purchase Order
                  </h1>
                </div>
              </div>
              <div className="col-auto">
                <div className="hstack gap-2 justify-content-end">
                  <Link to="/order">
                    <button type="submit" className="btn btn-sm btn-light">
                      <span>Back</span>
                    </button>
                  </Link>
                  <button
                    type="submit"
                    className="btn btn-sm btn-primary"
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
        <div className="card shadow border-0 my-2">
          <div className="container mb-5 mt-5">
            <div className="row py-4">
              <div className="col-md-6 col-12 mb-3">
                <lable className="form-lable">
                  Vendor Name<span className="text-danger">*</span>
                </lable>
                <div className="mb-3">
                  <select
                    {...formik.getFieldProps("vendorId")}
                    className={`form-select form-select-sm  ${
                      formik.touched.vendorId && formik.errors.vendorId
                        ? "is-invalid"
                        : ""
                    }`}
                  >
                    <option selected></option>
                    {vendor &&
                      vendor.map((data) => (
                        <option key={data.id} value={data.id}>
                          {data.vendorDisplayName}
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
                <div>
                  <label for="exampleFormControlInput1" className="form-label">
                    Delivery Address Category{" "}
                    <span className="text-danger">*</span>
                  </label>
                </div>
                <div className="form-check form-check-inline">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="deliveryAddressCategory"
                    id="ORGANIZATION"
                    value="ORGANIZATION"
                    onChange={formik.handleChange}
                    checked={
                      formik.values.deliveryAddressCategory === "ORGANIZATION"
                    }
                  />
                  <label className="form-check-label">Organization</label>
                </div>
                <div className="form-check form-check-inline">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="deliveryAddressCategory"
                    id="CUSTOMER"
                    value="CUSTOMER"
                    onChange={formik.handleChange}
                    checked={
                      formik.values.deliveryAddressCategory === "CUSTOMER"
                    }
                  />
                  <label className="form-check-label">Customer</label>
                </div>
                {formik.errors.deliveryAddressCategory &&
                  formik.touched.deliveryAddressCategory && (
                    <div
                      className="text-danger  "
                      style={{ fontSize: ".875em" }}
                    >
                      {formik.errors.deliveryAddressCategory}
                    </div>
                  )}
              </div>

              <div className="col-md-6 col-12 mb-3">
                <lable className="form-lable">
                  Delivery Address<span className="text-danger">*</span>
                </lable>
                <div className="">
                  <textarea
                    type="text"
                    className={`form-control form-control-sm ${
                      formik.touched.deliveryAddress &&
                      formik.errors.deliveryAddress
                        ? "is-invalid"
                        : ""
                    }`}
                    rows="4"
                    {...formik.getFieldProps("deliveryAddress")}
                  />
                  {formik.touched.deliveryAddress &&
                    formik.errors.deliveryAddress && (
                      <div className="invalid-feedback">
                        {formik.errors.deliveryAddress}
                      </div>
                    )}
                </div>
              </div>

              <div className="col-md-6 col-12 mb-3">
                <lable className="form-lable">
                  Purchase Order<span className="text-danger">*</span>
                </lable>
                <div className="">
                  <input
                    type="text"
                    className={`form-control form-control-sm ${
                      formik.touched.purchaseOrderNumber &&
                      formik.errors.purchaseOrderNumber
                        ? "is-invalid"
                        : ""
                    }`}
                    {...formik.getFieldProps("purchaseOrderNumber")}
                  />
                  {formik.touched.purchaseOrderNumber &&
                    formik.errors.purchaseOrderNumber && (
                      <div className="invalid-feedback">
                        {formik.errors.purchaseOrderNumber}
                      </div>
                    )}
                </div>
              </div>

              <div className="col-md-6 col-12 mb-3">
                <label className="form-label">Reference</label>
                <div className="">
                  <input
                    type="text"
                    className={`form-control form-control-sm  ${
                      formik.touched.purchaseOrderRef &&
                      formik.errors.purchaseOrderRef
                        ? "is-invalid"
                        : ""
                    }`}
                    {...formik.getFieldProps("purchaseOrderRef")}
                  />
                </div>
              </div>

              <div className="col-md-6 col-12 mb-3">
                <lable className="form-lable">Date</lable>
                <div className="mb-3">
                  <input
                    type="date"
                    className={`form-control form-control-sm  ${
                      formik.touched.date && formik.errors.date
                        ? "is-invalid"
                        : ""
                    }`}
                    {...formik.getFieldProps("date")}
                  />
                  {formik.touched.date && formik.errors.date && (
                    <div className="invalid-feedback">{formik.errors.date}</div>
                  )}
                </div>
              </div>
              <div className="col-md-6 col-12 mb-3">
                <lable className="form-lable">Delivery Date</lable>
                <div className="mb-3">
                  <input
                    type="date"
                    className={`form-control form-control-sm  ${
                      formik.touched.deliveryDate && formik.errors.deliveryDate
                        ? "is-invalid"
                        : ""
                    }`}
                    {...formik.getFieldProps("deliveryDate")}
                  />
                  {formik.touched.deliveryDate &&
                    formik.errors.deliveryDate && (
                      <div className="invalid-feedback">
                        {formik.errors.deliveryDate}
                      </div>
                    )}
                </div>
              </div>
              <div className="col-md-6 col-12 mb-3">
                <lable className="form-lable">Payment Terms</lable>
                <div className="mb-3">
                  <input
                    type="text"
                    className={`form-control form-control-sm  ${
                      formik.touched.paymentTerm && formik.errors.paymentTerm
                        ? "is-invalid"
                        : ""
                    }`}
                    {...formik.getFieldProps("paymentTerm")}
                  />
                  {formik.touched.paymentTerm && formik.errors.paymentTerm && (
                    <div className="invalid-feedback">
                      {formik.errors.paymentTerm}
                    </div>
                  )}
                </div>
              </div>
              <div className="col-md-6 col-12 mb-3">
                <lable className="form-lable">Shipment Preference</lable>
                <div className="mb-3">
                  <input
                    type="text"
                    className={`form-control form-control-sm  ${
                      formik.touched.shipmentPreference &&
                      formik.errors.shipmentPreference
                        ? "is-invalid"
                        : ""
                    }`}
                    {...formik.getFieldProps("shipmentPreference")}
                  />
                  {formik.touched.shipmentPreference &&
                    formik.errors.shipmentPreference && (
                      <div className="invalid-feedback">
                        {formik.errors.shipmentPreference}
                      </div>
                    )}
                </div>
              </div>
              <div className="col-md-6 col-12 mb-3">
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
                        <th style={{ width: "20%" }}>
                          Item Details<span className="text-danger">*</span>
                        </th>
                        <th style={{ width: "20%" }}>Account</th>
                        <th style={{ width: "20%" }}>Quantity</th>
                        <th style={{ width: "20%" }}>Rate</th>
                        <th style={{ width: "20%" }}>Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {formik.values.purchaseItemDetailsModels?.map(
                        (item, index) => (
                          <tr key={index}>
                            <th scope="row">{index + 1}</th>
                            <td>
                              <select
                                name={`purchaseItemDetailsModels[${index}].itemId`}
                                {...formik.getFieldProps(
                                  `purchaseItemDetailsModels[${index}].itemId`
                                )}
                                className={`form-select ${
                                  formik.touched.purchaseItemDetailsModels?.[
                                    index
                                  ]?.itemId &&
                                  formik.errors.purchaseItemDetailsModels?.[
                                    index
                                  ]?.itemId
                                    ? "is-invalid"
                                    : ""
                                }`}
                                onChange={(event) =>
                                  handleItemSelection(index, event)
                                }
                              >
                                <option selected> </option>
                                {itemData &&
                                  itemData.map((data) => (
                                    <option key={data.id} value={data.id}>
                                      {data.name}
                                    </option>
                                  ))}
                              </select>
                              {formik.touched.purchaseItemDetailsModels?.[index]
                                ?.itemId &&
                                formik.errors.purchaseItemDetailsModels?.[index]
                                  ?.itemId && (
                                  <div className="invalid-feedback">
                                    {
                                      formik.errors.purchaseItemDetailsModels[
                                        index
                                      ].itemId
                                    }
                                  </div>
                                )}
                            </td>
                            <td>
                              <select
                                name={`purchaseItemDetailsModels[${index}].accountId`}
                                {...formik.getFieldProps(
                                  `purchaseItemDetailsModels[${index}].accountId`
                                )}
                                className={`form-select ${
                                  formik.touched.purchaseItemDetailsModels?.[
                                    index
                                  ]?.accountId &&
                                  formik.errors.purchaseItemDetailsModels?.[
                                    index
                                  ]?.accountId
                                    ? "is-invalid"
                                    : ""
                                }`}
                              >
                                <option selected> </option>
                                {account &&
                                  account.map((data) => (
                                    <option key={data.id} value={data.id}>
                                      {data.accountName}
                                    </option>
                                  ))}
                              </select>
                              {formik.touched.purchaseItemDetailsModels?.[index]
                                ?.accountId &&
                                formik.errors.purchaseItemDetailsModels?.[index]
                                  ?.accountId && (
                                  <div className="invalid-feedback">
                                    {
                                      formik.errors.purchaseItemDetailsModels[
                                        index
                                      ].accountId
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
                                name={`purchaseItemDetailsModels[${index}].quantity`}
                                className={`form-control ${
                                  formik.touched.purchaseItemDetailsModels?.[
                                    index
                                  ]?.quantity &&
                                  formik.errors.purchaseItemDetailsModels?.[
                                    index
                                  ]?.quantity
                                    ? "is-invalid"
                                    : ""
                                }`}
                                {...formik.getFieldProps(
                                  `purchaseItemDetailsModels[${index}].quantity`
                                )}
                                onChange={(e) => {
                                  const quantity =
                                    parseInt(e.target.value, 10) || 0;
                                  handleQuantityChange(
                                    index,
                                    quantity,
                                    formik.values.purchaseItemDetailsModels[
                                      index
                                    ].discount
                                  );
                                  // handleQuantityChange(index, quantity);
                                  formik.handleChange(e);
                                }}
                              />
                              {formik.touched.purchaseItemDetailsModels?.[index]
                                ?.quantity &&
                                formik.errors.purchaseItemDetailsModels?.[index]
                                  ?.quantity && (
                                  <div className="invalid-feedback">
                                    {
                                      formik.errors.purchaseItemDetailsModels[
                                        index
                                      ].quantity
                                    }
                                  </div>
                                )}
                            </td>
                            <td>
                              <input
                                type="text"
                                name={`purchaseItemDetailsModels[${index}].rate`}
                                className={`form-control ${
                                  formik.touched.purchaseItemDetailsModels?.[
                                    index
                                  ]?.rate &&
                                  formik.errors.purchaseItemDetailsModels?.[
                                    index
                                  ]?.rate
                                    ? "is-invalid"
                                    : ""
                                }`}
                                {...formik.getFieldProps(
                                  `purchaseItemDetailsModels[${index}].rate`
                                )}
                              />
                              {formik.touched.purchaseItemDetailsModels?.[index]
                                ?.rate &&
                                formik.errors.purchaseItemDetailsModels?.[index]
                                  ?.rate && (
                                  <div className="invalid-feedback">
                                    {
                                      formik.errors.purchaseItemDetailsModels[
                                        index
                                      ].rate
                                    }
                                  </div>
                                )}
                            </td>
                            <td>
                              <input
                                type="text"
                                name={`purchaseItemDetailsModels[${index}].amount`}
                                className={`form-control ${
                                  formik.touched.purchaseItemDetailsModels?.[
                                    index
                                  ]?.amount &&
                                  formik.errors.purchaseItemDetailsModels?.[
                                    index
                                  ]?.amount
                                    ? "is-invalid"
                                    : ""
                                }`}
                                {...formik.getFieldProps(
                                  `purchaseItemDetailsModels[${index}].amount`
                                )}
                              />
                              {formik.touched.purchaseItemDetailsModels?.[index]
                                ?.amount &&
                                formik.errors.purchaseItemDetailsModels?.[index]
                                  ?.amount && (
                                  <div className="invalid-feedback">
                                    {
                                      formik.errors.purchaseItemDetailsModels[
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
                  className="btn btn-button btn-primary btn-sm my-4 mx-1"
                  type="button"
                  onClick={AddRowContent}
                >
                  Add row
                </button>
                {formik.values.purchaseItemDetailsModels?.length > 1 && (
                  <button
                    className="btn btn-sm my-4 mx-1 delete border-danger bg-white text-danger"
                    type="button"
                    onClick={deleteRow}
                  >
                    Delete
                  </button>
                )}
              </div>
              <div className="row mt-5 pt-0">
                <div
                  className="col-md-6 col-12 mb-3 pt-0"
                  // style={{marginTop:"8rem"}}
                >
                  <lable className="form-lable">Customer Notes</lable>
                  <div className="mb-3">
                    <textarea
                      type="text"
                      className={`form-control  ${
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
                    <label className="col-sm-4 col-form-label">Discount</label>
                    <div className="col-sm-4"></div>
                    <div className="col-sm-4">
                      <input
                        type="text"
                        className={`form-control ${
                          formik.touched.discount && formik.errors.discount
                            ? "is-invalid"
                            : ""
                        }`}
                        {...formik.getFieldProps("discount")}
                        onChange={(e) => {
                          const discount = parseInt(e.target.value, 10) || 0;
                          // handleQuantityChange(index, `deliveryChallanItemsJson[${index}].quantity`, discount);
                          handleQuantityChange(
                            formik.values.purchaseItemDetailsModels.quantity,
                            discount
                          );
                          formik.handleChange(e);
                        }}
                      />
                      {formik.touched.discount && formik.errors.discount && (
                        <div className="invalid-feedback">
                          {formik.errors.discount}
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
                        className={`form-control ${
                          formik.touched.adjustment && formik.errors.adjustment
                            ? "is-invalid"
                            : ""
                        }`}
                        {...formik.getFieldProps("adjustment")}
                        onChange={handleAdjustmentChange}
                      />
                      {formik.touched.adjustment &&
                        formik.errors.adjustment && (
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
                        formik.touched.termsCondition &&
                        formik.errors.termsCondition
                          ? "is-invalid"
                          : ""
                      }`}
                      rows="4"
                      {...formik.getFieldProps("termsCondition")}
                    />
                    {formik.touched.termsCondition &&
                      formik.errors.termsCondition && (
                        <div className="invalid-feedback">
                          {formik.errors.termsCondition}
                        </div>
                      )}
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

export default OrderAdd;
