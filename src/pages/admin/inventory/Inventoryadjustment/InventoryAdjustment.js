import React, { useEffect, useRef, useState } from "react";
import "datatables.net-dt";
import "datatables.net-responsive-dt";
import $ from "jquery";
import { Link } from "react-router-dom";
import { FaPlus } from "react-icons/fa";
import api from "../../../../config/URL";
import DeleteModel from "../../../../components/admin/DeleteModel";
import { FaEye, FaRegEdit } from "react-icons/fa";
import { GoEye } from "react-icons/go";

const InventoryAdjustment = () => {
  const tableRef = useRef(null);
  const [datas, setDatas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await api.get("/getAllInventoryAdjustments");
        setDatas(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    getData();
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
    if ($.fn.DataTable.isDataTable(tableRef.current)) {
      // DataTable already initialized, no need to initialize again
      return;
    }
    $(tableRef.current).DataTable({
      responsive: true,
    });
  };

  const destroyDataTable = () => {
    const table = $(tableRef.current).DataTable();
    if (table && $.fn.DataTable.isDataTable(tableRef.current)) {
      table.destroy();
    }
  };

  const refreshData = async () => {
    destroyDataTable();
    setLoading(true);
    try {
      const response = await api.get("/getAllInventoryAdjustments");
      setDatas(response.data);
      initializeDataTable(); 
    } catch (error) {
      console.error("Error refreshing data:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    const table = $(tableRef.current).DataTable();

    return () => {
      table.destroy();
    };
  }, []);
  return (
    <div>
      {loading ? (
        <div className="loader-container">
          <div class="Loader-Div">
            <svg id="triangle" width="50px" height="50px" viewBox="-3 -4 39 39">
              <polygon
                fill="transparent"
                stroke="blue"
                stroke-width="1.3"
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
              <div className="row align-items-center justify-content-between ">
                <div className="col">
                  <div className="d-flex align-items-center gap-4">
                    <h1 className="h4 ls-tight headingColor ">
                      Inventory Adjustment
                    </h1>
                  </div>
                </div>
                <div className="col-auto">
                  <div className="hstack gap-2 justify-content-end">
                    <Link to="/inventoryadjustment/add">
                      <button
                        type="submit"
                        className="btn btn-sm btn-button btn-primary"
                      >
                        <span cla>
                          Add <FaPlus className="pb-1" />
                        </span>
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div
            className="card shadow border-0 my-2"
            style={{ borderRadius: "0" }}
          >
            <div className="table-responsive p-2 minHeight">
              <table ref={tableRef} className="display table ">
                <thead className="thead-light">
                  <tr>
                    <th scope="col" className="text-start" style={{ whiteSpace: "nowrap" }}>
                      S.NO
                    </th>
                    <th scope="col" className="text-start">
                      MODE OF ADJUSTMENT
                    </th>
                    <th scope="col" className="text-start">
                      REFERENCE NUMBER
                    </th>
                    <th scope="col" className="text-start">
                      DATE
                    </th>
                    <th scope="col" className="text-start">
                      Reason
                    </th>
                    <th scope="col" className="text-center ps-5">
                      ACTION
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {datas.map((data, index) => (
                    <tr key={index}>
                      <td className="text-start">{index + 1}</td>
                      <td className="text-start">{data.modeOfAdjustment}</td>
                      <td className="text-start">{data.referenceNumber}</td>
                      <td className="text-start">{data.date?.slice(0,10)}</td>
                      <td className="text-start">{data.referenceNumber}</td>
                       <td className="text-center">
                        <div className="d-flex justify-content-center gap-1">
                          <Link to={`/inventoryadjustment/view/${data.id}`}>
                            <button
                              className="btn btn-sm"
                              style={{padding: "7px"}}
                            >
                              <GoEye />
                            </button>
                          </Link>
                          <Link to={`/inventoryadjustment/edit/${data.id}`}>
                            <button
                              className="btn btn-sm"
                              style={{padding: "7px"}}
                            >
                              <FaRegEdit />
                            </button>
                          </Link>
                          <DeleteModel
                            onSuccess={refreshData}
                            path={`/deleteInventoryAdjustments/${data.id}`}
                          />
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

export default InventoryAdjustment;
