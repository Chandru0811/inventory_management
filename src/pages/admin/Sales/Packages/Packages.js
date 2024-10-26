import React, { useEffect, useRef, useState } from "react";
import "datatables.net-dt";
import "datatables.net-responsive-dt";
import $ from "jquery";
import { Link } from "react-router-dom";
import { FaPlus } from "react-icons/fa";
import api from "../../../../config/URL";
import DeleteModel from "../../../../components/admin/DeleteModel";

const Packages = () => {
  const tableRef = useRef(null);
  const [datas, setDatas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await api.get("/getPackages");
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
      const response = await api.get("/getPackages");
      setDatas(response.data);
      initializeDataTable();
    } catch (error) {
      console.error("Error refreshing data:", error);
    }
    setLoading(false);
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
          <div className="card shadow border-0 my-2" style={{ borderRadius: "0" }}>
            <div className="container-fluid py-4">
              <div className="row align-items-center justify-content-between">
                <div className="col">
                  <div className="d-flex align-items-center gap-4">
                    <h1 className="h4 ls-tight headingColor">Packages</h1>
                  </div>
                </div>
                <div className="col-auto">
                  <div className="hstack gap-2 justify-content-end">
                    <Link to="/packages/add">
                      <button type="submit" className="btn btn-sm btn-button btn-primary">
                        <span>
                          Add <FaPlus className="pb-1" />
                        </span>
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="card shadow border-0 my-2" style={{ borderRadius: "0" }}>
            <div className="table-responsive p-2 minHeight">
              <table ref={tableRef} className="display table">
                <thead className="thead-light">
                  <tr>
                    <th scope="col" style={{ whiteSpace: "nowrap" }}>S.NO</th>
                    <th scope="col" className="text-center">CUSTOMER NAME</th>
                    <th scope="col" className="text-center">SALES ORDER</th>
                    <th scope="col" className="text-center">PACKAGE DATE</th>
                    <th scope="col" className="text-center">Status</th>
                    <th scope="col" className="text-center">ACTION</th>
                  </tr>
                </thead>
                <tbody>
                  {datas.map((data, index) => (
                    <tr key={index}>
                      <td className="text-center">{index + 1}</td>
                      <td className="text-center">{data.customerName}</td>
                      <td className="text-center">{data.salesOrder}</td>
                      <td className="text-center">
                        {data.packageDate
                          ? new Date(data.packageDate).toLocaleDateString()
                          : ""}
                      </td>
                      <td className="text-center">
                        {data.status === "Shipped" &&(
                          <span className="badge bg-success text-white">Shipped</span>
                        )}
                        {data.status === "Not Shipped" && (
                          <span className="badge text-dark" style={{background:"#e9e943"}}>Not Shipped</span>
                        )}
                        {data.status === "Delivered" || (
                          <span className="badge text-white" style={{background:"green"}}>Delivered</span>
                        )}
                      </td>
                      <td className="text-center">
                        <div className="gap-2">
                          <Link to={`/packages/view/${data.id}`}>
                            <button className="btn btn-light btn-sm shadow-none border-none">
                              View
                            </button>
                          </Link>
                          <Link to={`/packages/edit/${data.id}`} className="px-2">
                            <button className="btn btn-light btn-sm shadow-none border-none">
                              Edit
                            </button>
                          </Link>
                          <DeleteModel
                            onSuccess={refreshData}
                            path={`/deletePackages/${data.id}`}
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="card-footer border-0 py-5"></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Packages;
