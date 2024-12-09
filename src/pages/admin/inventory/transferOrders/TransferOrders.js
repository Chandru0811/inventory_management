import React, { useEffect, useRef, useState } from "react";
import "datatables.net-dt";
import "datatables.net-responsive-dt";
import $ from "jquery";
import { Link } from "react-router-dom";
import { FaPlus, FaRegEdit } from "react-icons/fa";
import { GoEye } from "react-icons/go";
import DeleteModel from "../../../../components/admin/DeleteModel";

const TransferOrders = () => {
  const tableRef = useRef(null);
  const [datas, setDatas] = useState([]); // State for table data
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      const fetchedData = [
        { transferOrder: "TO-001", reason: "Restock", receivedDate: "2024-07-01" },
        { transferOrder: "TO-002", reason: "Return", receivedDate: "2024-07-02" },
      ];
      setDatas(fetchedData);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    if (!loading) {
      initializeDataTable();
    }
    return () => {
      destroyDataTable();
    };
  }, [loading]);

  const initializeDataTable = () => {
    if (!$.fn.DataTable.isDataTable(tableRef.current)) {
      $(tableRef.current).DataTable({
        responsive: true,
      });
    }
  };

  const destroyDataTable = () => {
    if ($.fn.DataTable.isDataTable(tableRef.current)) {
      $(tableRef.current).DataTable().destroy();
    }
  };

  return (
    <div>
      {loading ? (
        <div className="loader-container">
          <div className="Loader-Div">
            <svg id="triangle" width="50px" height="50px" viewBox="-3 -4 39 39">
              <polygon
                fill="transparent"
                stroke="blue"
                strokeWidth="1.3"
                points="16,0 32,32 0,32"
              ></polygon>
            </svg>
          </div>
        </div>
      ) : (
        <div className="container-fluid px-2 minHeight">
          <div
            className="card shadow border-0 mb-2 top-header sticky-top"
            style={{ borderRadius: "0", top: "66px" }}
          >
            <div className="container-fluid py-4">
              <div className="row align-items-center justify-content-between">
                <div className="col">
                  <h1 className="h4 ls-tight headingColor">Transfer Order</h1>
                </div>
                <div className="col-auto">
                  <Link to="/transferOrder/add">
                    <button className="btn btn-sm btn-primary">
                      Add <FaPlus className="pb-1" />
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="card shadow border-0 my-2" style={{ borderRadius: "0" }}>
            <div className="table-responsive p-2 minHeight">
              <table ref={tableRef} className="display table">
                <thead className="thead-light">
                  <tr>
                    <th scope="col" className="text-start">S.NO</th>
                    <th scope="col" className="text-start">TRANSFER ORDER</th>
                    <th scope="col" className="text-start">REASON</th>
                    <th scope="col" className="text-start">DATE</th>
                    <th scope="col" className="text-center">ACTION</th>
                  </tr>
                </thead>
                <tbody>
                  {datas.map((data, index) => (
                    <tr key={index}>
                      <td className="text-start">{index + 1}</td>
                      <td className="text-start">{data.transferOrder}</td>
                      <td className="text-start">{data.reason}</td>
                      <td className="text-start">
                        {data.receivedDate
                          ? new Date(data.receivedDate).toLocaleDateString()
                          : ""}
                      </td>
                      <td className="text-center">
                        <div className="d-flex justify-content-center gap-1">
                          <Link to={`/transferOrder/view`}>
                            <button className="btn btn-sm" style={{ padding: "7px" }}>
                              <GoEye />
                            </button>
                          </Link>
                          <Link to={`/transferOrder/edit`}>
                            <button className="btn btn-sm" style={{ padding: "7px" }}>
                              <FaRegEdit />
                            </button>
                          </Link>
                          <DeleteModel />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="card-footer border-0 py-5"></div>
        </div>
      )}
    </div>
  );
};

export default TransferOrders;
