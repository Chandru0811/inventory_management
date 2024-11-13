import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import api from "../../../../config/URL";
import toast from "react-hot-toast";
import Modal from "react-bootstrap/Modal";

const ItemsView = () => {
  const { id } = useParams();
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(false);
  const [loadIndicator, setLoadIndicator] = useState(false);
  const navigate = useNavigate();
  // const [shopStatus, setShopStatus] = useState("");
  const [showModal, setShowModal] = useState(false);

  const handleOpenModal = () => setShowModal(true);
  const handleClose = () => setShowModal(false);

  const handleActivate = async () => {
    setLoadIndicator(true);
    try {
      const response = await api.post(`updateStatus/${id}`);
      if (response.status === 200) {
        getData();
        toast.success("Product Activated Successfully!");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error("An error occurred while activating the product.");
      console.error("Activation Error:", error);
    } finally {
      setLoadIndicator(false);
    }
  };

  const handleDeActivate = async () => {
    setLoading(true);
    try {
      const response = await api.post(`updateStatus/${id}`);
      if (response.status === 200) {
        getData();
        toast.success("Product Deactivated Successfully!");
        handleClose();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error("An error occurred while deactivating the product.");
      console.error("Deactivation Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const getData = async () => {
    setLoading(true);
    try {
      const response = await api.get(`getItemsById/${id}`);
      setData(response.data.data);
      setShopStatus(response.data.data.active);
    } catch (error) {
      toast.error("Error Fetching Data");
      console.error("Fetch Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getData();
  }, [id]);

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
        <div className="container-fluid px-2 minHeight" style={{ borderRadius: "0" }}>
          <div className="card shadow border-0 mb-2 top-header">
            <div className="container-fluid py-4">
              <div className="row align-items-center">
                <div className="col">
                  <div className="d-flex align-items-center gap-4">
                    <h1 className="h4 ls-tight headingColor">View Items</h1>
                  </div>
                </div>
                <div className="col-auto">
                  <Link to="/item">
                    <button type="button" className="btn btn-sm btn-light">
                      <span>Back</span>
                    </button>
                  </Link>
                </div>
                <div className="col-auto">
                  {data.status === "Inactive" ? (
                    <button
                      type="button"
                      onClick={handleActivate}
                      className="btn btn-success btn-sm me-2"
                      disabled={loadIndicator}
                    >
                      {loadIndicator && (
                        <span className="spinner-border spinner-border-sm me-2" aria-hidden="true"></span>
                      )}
                      Activate
                    </button>
                  ) : (
                    <button onClick={handleOpenModal} className="btn btn-danger btn-sm me-2">
                      Deactivate
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="card shadow border-0 mb-2 minHeight" style={{ borderRadius: "0" }}>
            <div className="container">
              <div className="row mt-2 p-3">
                <div className="col-md-6 col-12">
                  <div className="row mb-3">
                    <div className="col-6 d-flex justify-content-start align-items-center">
                      <p className="text-sm">
                        <b>Name</b>
                      </p>
                    </div>
                    <div className="col-6">
                      <p className="text-muted text-sm">: {data.name || ""}</p>
                    </div>
                  </div>
                </div>
                {/* Add more fields similarly */}
              </div>
            </div>
          </div>
        </div>
      )}
      <Modal show={showModal} backdrop="static" keyboard={false} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Deactivate Deal</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to deactivate this deal?</Modal.Body>
        <Modal.Footer>
          <button className="btn btn-sm btn-light" onClick={handleClose}>
            Close
          </button>
          <button
            className="btn btn-sm btn-danger"
            type="button"
            onClick={handleDeActivate}
            disabled={loading}
          >
            {loading && (
              <span className="spinner-border spinner-border-sm me-2" aria-hidden="true"></span>
            )}
            Deactivate
          </button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ItemsView;
