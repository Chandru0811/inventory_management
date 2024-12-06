import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import api from "../../../../config/URL";
import toast from "react-hot-toast";

// import fetchAllCustomerWithIds from "../../List/CustomerList";
// import fetchAllItemWithIds from "../../List/ItemList";

function VendorCreditEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoadIndicator] = useState(false);
  const [wareHouseId, setWareHouseData] = useState(null);
  const [vendor, setVendor] = useState(null);
  const [itemData, setItemData] = useState(null);
  const [itemAccData, setItemAccData] = useState(null);
  const [data, setData] = useState([]);

  const validationSchema = Yup.object({
    vendorId: Yup.string().required("*Vendor Name is required"),
    creditNoteNum: Yup.string().required("*Credit Note is required"),
    creditsItems: Yup.array().of(
      Yup.object().shape({
        itemId: Yup.string().required("*Item Details is required"),
      })
    ),
  });

  const formik = useFormik({
    initialValues: {
      wareHouseId: "",
      vendorId: "",
      creditNoteNum: "",
      orderNumber: "",
      orderCreditDdate: "",
      notes: "",
      files: "",
      creditsItems: [
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
      try {
        const formData = new FormData();
        formData.append("wareHouseId", values.wareHouseId);
        formData.append("vendorId", values.vendorId);
        formData.append("creditNoteNum", values.creditNoteNum);
        formData.append("orderNumber", values.orderNumber);
        formData.append("orderCreditDate", values.orderCreditDdate);
        formData.append("notes", values.notes);
        formData.append("subTotal", values.subTotal);
        formData.append("discount", values.discount);
        formData.append("total", values.total);
        formData.append("companyId", "1");
        formData.append("files", values.files);
        formData.append(
          "vendorCreditsItemDetails",
          JSON.stringify(
            values.creditsItems?.map((item) => ({
              itemId: item.itemId?.id || item.itemId,
              accountId: item.accountId,
              quantity: item.quantity,
              rate: item.rate,
              amount: item.amount,
            }))
          )
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

        if (response.status === 200) {
          toast.success(response.data.message);
          navigate("/vendorcredit");
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

  useEffect(() => {
    const getItemData = async () => {
      try {
        const response = await api.get("getAllAccounts");
        setItemAccData(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    getItemData();
  }, []);

  useEffect(() => {
    const fetchVendors = async () => {
      try {
        const response = await api.get("vendorIdsWithDisplayNames");
        setVendor(response.data);
      } catch (error) {
        console.error("Error fetching Vendor:", error);
      }
    };
    fetchVendors();
  }, []);

  useEffect(() => {
    const fetchVendors = async () => {
      try {
        const response = await api.get("getAllWarehouses");
        setWareHouseData(response.data);
      } catch (error) {
        console.error("Error fetching Vendor:", error);
      }
    };
    fetchVendors();
  }, []);

  const AddRowContent = () => {
    formik.setFieldValue("creditsItems", [
      ...formik.values.creditsItems,
      {
        itemId: "",
        quantity: "",
        rate: "",
        discount: "",
        taxRate: "",
        amount: "",
      },
    ]);
  };

  const deleteRow = (index) => {
    if (formik.values.creditsItems?.length === 1) {
      return;
    }
    const updatedRows = [...formik.values.creditsItems];
    updatedRows.pop();
    formik.setFieldValue("creditsItems", updatedRows);
  };

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await api.get(`/vendorCreditRetrivalWithItems/${id}`);
        const rest = response.data;

        const formattedData = {
          ...rest,
          orderCreditDdate: rest.orderCreditDdate
            ? new Date(rest.orderCreditDdate).toISOString().split("T")[0]
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
        await formik.setFieldValue(`creditsItems[${index}]`, {
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
    const item = formik.values.creditsItems[index] || {};
    const newRate = item.unitPrice * quantity || item.rate * quantity || 0;
    const currentRate = item.unitPrice || item.rate || 0;
    const newDiscount = discount ? (newRate * discount) / 100 : 0;
    const newAmount = newRate - newDiscount || 0;

    await formik.setFieldValue(
      `creditsItems[${index}].rate`,
      currentRate
    );
    await formik.setFieldValue(
      `creditsItems[${index}].amount`,
      parseFloat(newAmount.toFixed(2))
    );

    recalculateSubtotalAndTotal();
  };

  const recalculateSubtotalAndTotal = () => {
    const deliveryItems = formik.values.creditsItems || [];

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
                  Vendor Name<span className="text-danger">*</span>
                </lable>
                <div className="mb-3">
                  <select
                    name="vendorId"
                    className={`form-select form-select-sm ${
                      formik.touched.vendorId && formik.errors.vendorId
                        ? "is-invalid"
                        : ""
                    }`}
                    {...formik.getFieldProps("vendorId")}
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
                <lable className="form-lable">
                  Credit Note<span className="text-danger">*</span>
                </lable>
                <div className="mb-3">
                  <input
                    type="text"
                    className={`form-control form-control-sm ${
                      formik.touched.creditNoteNum &&
                      formik.errors.creditNoteNum
                        ? "is-invalid"
                        : ""
                    }`}
                    {...formik.getFieldProps("creditNoteNum")}
                  />
                  {formik.touched.creditNoteNum &&
                    formik.errors.creditNoteNum && (
                      <div className="invalid-feedback">
                        {formik.errors.creditNoteNum}
                      </div>
                    )}
                </div>
              </div>
              <div className="col-md-6 col-12 mb-3">
                <lable className="form-lable">Order Number</lable>
                <div className="mb-3">
                  <input
                    type="text"
                    className={`form-control form-control-sm ${
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
                    className={`form-control form-control-sm ${
                      formik.touched.orderCreditDdate &&
                      formik.errors.orderCreditDdate
                        ? "is-invalid"
                        : ""
                    }`}
                    {...formik.getFieldProps("orderCreditDdate")}
                  />
                  {formik.touched.orderCreditDdate &&
                    formik.errors.orderCreditDdate && (
                      <div className="invalid-feedback">
                        {formik.errors.orderCreditDdate}
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
                      formik.setFieldValue("files", event.target.files[0]);
                    }}
                  />
                  {formik.touched.files && formik.errors.files && (
                    <div className="invalid-feedback">
                      {formik.errors.files}
                    </div>
                  )}
                </div>
              </div>

              <div className="col-md-6 col-12 mb-3">
                <lable className="form-lable">Warehouse</lable>
                <div className="mb-3">
                  <select
                    name="wareHouseId"
                    className={`form-select form-select-sm ${
                      formik.touched.wareHouseId && formik.errors.wareHouseId
                        ? "is-invalid"
                        : ""
                    }`}
                    {...formik.getFieldProps("wareHouseId")}
                  >
                    <option selected></option>
                    <option value="1">Ecs Cloud</option>
                  </select>
                  {formik.touched.wareHouseId && formik.errors.wareHouseId && (
                    <div className="invalid-feedback">
                      {formik.errors.wareHouseId}
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
                        <th style={{ width: "35%" }}>
                          Item Details<span className="text-danger">*</span>
                        </th>
                        <th style={{ width: "20%" }}>Account</th>
                        <th style={{ width: "15%" }}>Quantity</th>
                        <th style={{ width: "15%" }}>Rate</th>
                        <th style={{ width: "15%" }}>Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {formik.values.creditsItems?.map((item, index) => (
                        <tr key={index}>
                          <th scope="row">{index + 1}</th>
                          <td>
                            <select
                              name={`creditsItems[${index}].itemId`}
                              {...formik.getFieldProps(
                                `creditsItems[${index}].itemId`
                              )}
                              className={`form-select ${
                                formik.touched.creditsItems?.[index]?.itemId &&
                                formik.errors.creditsItems?.[index]?.itemId
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
                            {formik.touched.creditsItems?.[index]?.itemId &&
                              formik.errors.creditsItems?.[index]?.itemId && (
                                <div className="invalid-feedback">
                                  {formik.errors.creditsItems[index].itemId}
                                </div>
                              )}
                          </td>
                          <td>
                            <select
                              name={`creditsItems[${index}].accountId`}
                              {...formik.getFieldProps(
                                `creditsItems[${index}].accountId`
                              )}
                              className={`form-select ${
                                formik.touched.creditsItems?.[index]
                                  ?.accountId &&
                                formik.errors.creditsItems?.[index]?.accountId
                                  ? "is-invalid"
                                  : ""
                              }`}
                            >
                              <option selected> </option>
                              {itemAccData &&
                                itemAccData?.map((accData) => (
                                  <option key={accData.id} value={accData.id}>
                                    {accData.accountName}
                                  </option>
                                ))}
                            </select>
                            {formik.touched.creditsItems?.[index]?.accountId &&
                              formik.errors.creditsItems?.[index]
                                ?.accountId && (
                                <div className="invalid-feedback">
                                  {formik.errors.creditsItems[index].accountId}
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
                              name={`creditsItems[${index}].quantity`}
                              className={`form-control ${
                                formik.touched.creditsItems?.[index]
                                  ?.quantity &&
                                formik.errors.creditsItems?.[index]?.quantity
                                  ? "is-invalid"
                                  : ""
                              }`}
                              {...formik.getFieldProps(
                                `creditsItems[${index}].quantity`
                              )}
                              onChange={(e) => {
                                const quantity =
                                  parseInt(e.target.value, 10) || 0;
                                handleQuantityChange(
                                  index,
                                  quantity,
                                  formik.values.creditsItems[
                                    index
                                  ].discount
                                );
                                // handleQuantityChange(index, quantity);
                                formik.handleChange(e);
                              }}
                            />
                            {formik.touched.creditsItems?.[index]?.quantity &&
                              formik.errors.creditsItems?.[index]?.quantity && (
                                <div className="invalid-feedback">
                                  {formik.errors.creditsItems[index].quantity}
                                </div>
                              )}
                          </td>
                          <td>
                            <input
                              type="text"
                              name={`creditsItems[${index}].rate`}
                              className={`form-control ${
                                formik.touched.creditsItems?.[index]?.rate &&
                                formik.errors.creditsItems?.[index]?.rate
                                  ? "is-invalid"
                                  : ""
                              }`}
                              {...formik.getFieldProps(
                                `creditsItems[${index}].rate`
                              )}
                            />
                            {formik.touched.creditsItems?.[index]?.rate &&
                              formik.errors.creditsItems?.[index]?.rate && (
                                <div className="invalid-feedback">
                                  {formik.errors.creditsItems[index].rate}
                                </div>
                              )}
                          </td>
                          <td>
                            <input
                              type="text"
                              name={`creditsItems[${index}].amount`}
                              className={`form-control ${
                                formik.touched.creditsItems?.[index]?.amount &&
                                formik.errors.creditsItems?.[index]?.amount
                                  ? "is-invalid"
                                  : ""
                              }`}
                              {...formik.getFieldProps(
                                `creditsItems[${index}].amount`
                              )}
                            />
                            {formik.touched.creditsItems?.[index]?.amount &&
                              formik.errors.creditsItems?.[index]?.amount && (
                                <div className="invalid-feedback">
                                  {formik.errors.creditsItems[index].amount}
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
                  className="btn btn-button btn-sm my-4 mx-1"
                  type="button"
                  onClick={AddRowContent}
                >
                  Add row
                </button>
                {formik.values.creditsItems?.length > 1 && (
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
                <div className="col-md-6 col-12 mb-3 pt-0">
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
                        className={`form-control   ${
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
                        className={`form-control   ${
                          formik.touched.discount && formik.errors.discount
                            ? "is-invalid"
                            : ""
                        }`}
                        {...formik.getFieldProps("discount")}
                        onChange={(e) => {
                          const discount = parseInt(e.target.value, 10) || 0;
                          // handleQuantityChange(index, `deliveryChallanItemsJson[${index}].quantity`, discount);
                          handleQuantityChange(
                            formik.values.creditsItems.quantity,
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
                        className={`form-control   ${
                          formik.touched.adjustment && formik.errors.adjustment
                            ? "is-invalid"
                            : ""
                        }`}
                        {...formik.getFieldProps("adjustment")}
                        onChange={handleAdjustmentChange}
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
                    <label className="col-sm-4 col-form-label">
                      Total ( Rs. )
                    </label>
                    <div className="col-sm-4"></div>
                    <div className="col-sm-4">
                      <input
                        type="text"
                        className={`form-control   ${
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
