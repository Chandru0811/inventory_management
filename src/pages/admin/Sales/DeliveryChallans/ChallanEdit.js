import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import api from "../../../../config/URL";
import toast from "react-hot-toast";

function ChellanEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoadIndicator] = useState(false);
  const [customerData, setCustomerData] = useState(null);
  const [itemData, setItemData] = useState(null);
  const [data, setData] = useState([]);

  const validationSchema = Yup.object({
    customerId: Yup.string().required("*Customer Name is required"),
    deliveryChallan: Yup.string().required("*Delivery Challan is required"),
    deliveryChallanDate: Yup.string().required(
      "*Delivery Challan Date is required"
    ),
    challanType: Yup.string().required("*Challan Type is required"),
    challanitems: Yup.array().of(
      Yup.object({
        itemId: Yup.string().required("*Item is required"),
      })
    ),
  });

  const formik = useFormik({
    initialValues: {
      customerId: "",
      deliveryChallan: "",
      deliveryChallanDate: "",
      challanType: "",
      attachFile: null,
      challanitems: [
        {
          itemId: "",
          qty: "",
          price: "",
          amount: "",
        },
      ],
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      setLoadIndicator(true);
      console.log(values);
      try {
        const formData = new FormData();

        formData.append("customerId", values.customerId);
        formData.append("deliveryChallan", values.deliveryChallan);
        formData.append("reference", values.reference);
        formData.append("deliveryChallanDate", values.deliveryChallanDate);
        formData.append("subTotal", values.subTotal);
        formData.append("adjustment", values.adjustment);
        formData.append("total", values.total);
        formData.append("customerNotes", values.customerNotes);
        formData.append("termsConditions", values.termsAndCondition);
        formData.append("attachFile", values.attachFile);
        formData.append(
          "deliveryChallanItemsJson",
          JSON.stringify(
            values.challanitems?.map((item) => ({
              id: item.id,
              itemId: item.itemId?.id || item.itemId,
              quantity: item.quantity,
              rate: item.rate,
              discount: item.discount,
              amount: item.amount,
            }))
          )
        );
        const response = await api.put(
          `/updateDeliveryChallansWithItems/${id}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        if (response.status === 200) {
          toast.success(response.data.message);
          navigate("/challan");
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
    formik.setFieldValue("challanitems", [
      ...formik.values.challanitems,
      {
        itemId: "",
        quantity: "",
        rate: "",
        discount: "",
        amount: "",
      },
    ]);
  };

  const deleteRow = (index) => {
    if (formik.values.challanitems?.length === 1) {
      return;
    }
    const updatedRows = [...formik.values.challanitems];
    updatedRows.pop();
    formik.setFieldValue("challanitems", updatedRows);
  };

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await api.get(
          `/deliveryChallansRetrivalWithItems/${id}`
        );
        const rest = response.data;

        const formattedData = {
          ...rest,
          deliveryChallanDate: rest.deliveryChallanDate
            ? new Date(rest.deliveryChallanDate).toISOString().split("T")[0]
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
    recalculateSubtotalAndTotal();
  }, [formik.values]);

  const handleItemSelection = async (index, event) => {
    const selectedItemId = event.target.value;
    try {
      const response = await api.get(`getItemsById/${selectedItemId}`);
      const itemDetails = response.data;

      if (itemDetails) {
        await formik.setFieldValue(`challanitems[${index}]`, {
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
    const item = formik.values.challanitems[index] || {};
    const newRate = item.unitPrice * quantity || item.rate * quantity || 0;
    const currentRate = item.unitPrice || item.rate || 0;
    const newDiscount = discount ? (newRate * discount) / 100 : 0;
    const newAmount = newRate - newDiscount || 0;

    await formik.setFieldValue(
      `challanitems[${index}].rate`,
      currentRate
    );
    await formik.setFieldValue(
      `challanitems[${index}].amount`,
      parseFloat(newAmount.toFixed(2))
    );

    recalculateSubtotalAndTotal();
  };

  const recalculateSubtotalAndTotal = () => {
    const deliveryItems = formik.values.challanitems || [];

    // Calculate the subtotal by summing up all item amounts
    const subTotal = deliveryItems.reduce(
      (sum, item) => sum + (parseFloat(item.amount) || 0),
      0
    );

    formik.setFieldValue("subTotal", subTotal.toFixed(2));

    // Update the total by considering the adjustment
    const adjustment = parseFloat(formik.values.adjustment) || 0;
    const total = subTotal + adjustment;

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
        const response = await api.get("getAllCustomerIdsWithNames");
        setCustomerData(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    getData();
  }, []);

  useEffect(() => {
    const getItemData = async () => {
      try {
        const response = await api.get("itemId-name");
        setItemData(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    getItemData();
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
                  <h1 className="h4 ls-tight headingColor">
                    Edit Delivery Challans
                  </h1>
                </div>
              </div>
              <div className="col-auto">
                <div className="hstack gap-2 justify-content-end">
                  <Link to="/challan">
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
          <div className="container mb-5 mt-5">
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

              {/* <div className="col-md-6 col-12 mb-3">
                <lable className="form-lable">
                  Invoice<span className="text-danger">*</span>
                </lable>
                <div className="mb-3">
                  <input
                    type="text"
                    className={`form-control  ${
                      formik.touched.invoice && formik.errors.invoice
                        ? "is-invalid"
                        : ""
                    }`}
                    {...formik.getFieldProps("invoice")}
                  />
                  {formik.touched.invoice && formik.errors.invoice && (
                    <div className="invalid-feedback">
                      {formik.errors.invoice}
                    </div>
                  )}
                </div>
              </div> */}

              <div className="col-md-6 col-12 mb-3">
                <lable className="form-lable">
                  Delivery Challan<span className="text-danger">*</span>
                </lable>
                <div className="mb-3">
                  <input
                    type="text"
                    className={`form-control form-control-sm ${
                      formik.touched.deliveryChallan &&
                      formik.errors.deliveryChallan
                        ? "is-invalid"
                        : ""
                    }`}
                    {...formik.getFieldProps("deliveryChallan")}
                  />
                  {formik.touched.deliveryChallan &&
                    formik.errors.deliveryChallan && (
                      <div className="invalid-feedback">
                        {formik.errors.deliveryChallan}
                      </div>
                    )}
                </div>
              </div>

              <div className="col-md-6 col-12 mb-3">
                <lable className="form-lable">Reference</lable>
                <div className="">
                  <input
                    type="text"
                    className={`form-control form-control-sm ${
                      formik.touched.reference && formik.errors.reference
                        ? "is-invalid"
                        : ""
                    }`}
                    {...formik.getFieldProps("reference")}
                  />
                  {formik.touched.reference && formik.errors.reference && (
                    <div className="invalid-feedback">
                      {formik.errors.reference}
                    </div>
                  )}
                </div>
              </div>

              <div className="col-md-6 col-12 mb-3">
                <lable className="form-lable">
                  Delivery Challan Date<span className="text-danger">*</span>
                </lable>
                <div className="">
                  <input
                    type="date"
                    className={`form-control form-control-sm ${
                      formik.touched.deliveryChallanDate &&
                      formik.errors.deliveryChallanDate
                        ? "is-invalid"
                        : ""
                    }`}
                    {...formik.getFieldProps("deliveryChallanDate")}
                  />
                  {formik.touched.deliveryChallanDate &&
                    formik.errors.deliveryChallanDate && (
                      <div className="invalid-feedback">
                        {formik.errors.deliveryChallanDate}
                      </div>
                    )}
                </div>
              </div>
              <div className="col-md-6 col-12 mb-3">
                <lable className="form-lable">
                  Challan Type<span className="text-danger">*</span>
                </lable>
                <div className="">
                  <select
                    type="text"
                    className={`form-select form-selct-sm ${
                      formik.touched.challanType && formik.errors.challanType
                        ? "is-invalid"
                        : ""
                    }`}
                    {...formik.getFieldProps("challanType")}
                  >
                    <option selected></option>
                    <option value="Supply of Liquid Gas">
                      Supply of Liquid Gas
                    </option>
                    <option value="Job Work">Job Work</option>
                    <option value="Supply on Approval">
                      Supply on Approval
                    </option>
                    <option value="Others">Others</option>
                  </select>
                  {formik.touched.challanType && formik.errors.challanType && (
                    <div className="invalid-feedback">
                      {formik.errors.challanType}
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
                  />
                  {formik.touched.attachFile && formik.errors.attachFile && (
                    <div className="invalid-feedback">
                      {formik.errors.attachFile}
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
                        <th style={{ width: "15%" }}>Quantity</th>
                        <th style={{ width: "15%" }}>Rate</th>
                        <th style={{ width: "15%" }}>Discount(%)</th>
                        <th style={{ width: "15%" }}>Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {formik.values.challanitems?.map((item, index) => (
                        <tr key={index}>
                          <th scope="row">{index + 1}</th>
                          <td>
                            <select
                              name={`challanitems[${index}].itemId`}
                              {...formik.getFieldProps(
                                `challanitems[${index}].itemId`
                              )}
                              className={`form-select ${
                                formik.touched.challanitems?.[index]?.itemId &&
                                formik.errors.challanitems?.[index]?.itemId
                                  ? "is-invalid"
                                  : ""
                              }`}
                              onChange={(event) =>
                                handleItemSelection(index, event)
                              }
                            >
                              <option selected> </option>
                              {itemData &&
                                itemData.map((itemId) => (
                                  <option key={itemId.id} value={itemId.id}>
                                    {itemId.name}
                                  </option>
                                ))}
                            </select>
                            {formik.touched.challanitems?.[index]?.itemId &&
                              formik.errors.challanitems?.[index]?.itemId && (
                                <div className="invalid-feedback">
                                  {formik.errors.challanitems[index].itemId}
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
                              name={`challanitems[${index}].quantity`}
                              className={`form-control ${
                                formik.touched.challanitems?.[index]
                                  ?.quantity &&
                                formik.errors.challanitems?.[index]?.quantity
                                  ? "is-invalid"
                                  : ""
                              }`}
                              {...formik.getFieldProps(
                                `challanitems[${index}].quantity`
                              )}
                              onChange={(e) => {
                                const quantity =
                                  parseInt(e.target.value, 10) || 0;
                                handleQuantityChange(index, quantity, formik.values.challanitems[index].discount);
                                // handleQuantityChange(index, quantity);
                                formik.handleChange(e);
                              }}
                            />
                            {formik.touched.challanitems?.[index]?.quantity &&
                              formik.errors.challanitems?.[index]?.quantity && (
                                <div className="invalid-feedback">
                                  {formik.errors.challanitems[index].quantity}
                                </div>
                              )}
                          </td>
                          <td>
                            <input
                              type="text"
                              name={`challanitems[${index}].rate`}
                              className={`form-control ${
                                formik.touched.challanitems?.[index]?.rate &&
                                formik.errors.challanitems?.[index]?.rate
                                  ? "is-invalid"
                                  : ""
                              }`}
                              {...formik.getFieldProps(
                                `challanitems[${index}].rate`
                              )}
                            />
                            {formik.touched.challanitems?.[index]?.rate &&
                              formik.errors.challanitems?.[index]?.rate && (
                                <div className="invalid-feedback">
                                  {formik.errors.challanitems[index].rate}
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
                              name={`challanitems[${index}].discount`}
                              className={`form-control ${
                                formik.touched.challanitems?.[index]
                                  ?.discount &&
                                formik.errors.challanitems?.[index]?.discount
                                  ? "is-invalid"
                                  : ""
                              }`}
                              {...formik.getFieldProps(
                                `challanitems[${index}].discount`
                              )}
                              onChange={(e) => {
                                const discount =
                                  parseInt(e.target.value, 10) || 0;
                                // handleQuantityChange(index, `deliveryChallanItemsJson[${index}].quantity`, discount);
                                handleQuantityChange(index, formik.values.challanitems[index].quantity, discount);
                                formik.handleChange(e);
                              }}
                            />
                            {formik.touched.challanitems?.[index]?.discount &&
                              formik.errors.challanitems?.[index]?.discount && (
                                <div className="invalid-feedback">
                                  {formik.errors.challanitems[index].discount}
                                </div>
                              )}
                          </td>
                          <td>
                            <input
                              type="text"
                              name={`challanitems[${index}].amount`}
                              className={`form-control ${
                                formik.touched.challanitems?.[index]?.amount &&
                                formik.errors.challanitems?.[index]?.amount
                                  ? "is-invalid"
                                  : ""
                              }`}
                              {...formik.getFieldProps(
                                `challanitems[${index}].amount`
                              )}
                            />
                            {formik.touched.challanitems?.[index]?.amount &&
                              formik.errors.challanitems?.[index]?.amount && (
                                <div className="invalid-feedback">
                                  {formik.errors.challanitems[index].amount}
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
                {formik.values.challanitems?.length > 1 && (
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
                        formik.touched.termsAndCondition &&
                        formik.errors.termsAndCondition
                          ? "is-invalid"
                          : ""
                      }`}
                      rows="4"
                      {...formik.getFieldProps("termsAndCondition")}
                    />
                    {formik.touched.termsAndCondition &&
                      formik.errors.termsAndCondition && (
                        <div className="invalid-feedback">
                          {formik.errors.termsAndCondition}
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

export default ChellanEdit;
