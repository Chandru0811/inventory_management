<div className="container-fluid">
  <div className="mb-3">
    <h3>Bank Details</h3>
    <div className="container">
      <div className="row mt-2 p-3">
        {data.bankDetailsModels?.map((bankDetail, index) => (
          <div key={index} className="col-md-6 col-12">
            <div className="row mb-3">
              <div className="col-6 d-flex justify-content-start align-items-center">
                <p className="text-sm">
                  <b>Account Holder Name</b>
                </p>
              </div>
              <div className="col-6">
                <p className="text-muted text-sm">
                  : {bankDetail.accountHolderName || ""}
                </p>
              </div>
            </div>
            <div className="row mb-3">
              <div className="col-6 d-flex justify-content-start align-items-center">
                <p className="text-sm">
                  <b>Bank Name</b>
                </p>
              </div>
              <div className="col-6">
                <p className="text-muted text-sm">
                  : {bankDetail.bankName || ""}
                </p>
              </div>
            </div>
            <div className="row mb-3">
              <div className="col-6 d-flex justify-content-start align-items-center">
                <p className="text-sm">
                  <b>Account Number</b>
                </p>
              </div>
              <div className="col-6">
                <p className="text-muted text-sm">
                  : {bankDetail.accountNumber || ""}
                </p>
              </div>
            </div>
            <div className="row mb-3">
              <div className="col-6 d-flex justify-content-start align-items-center">
                <p className="text-sm">
                  <b>Re-enter Account Number</b>
                </p>
              </div>
              <div className="col-6">
                <p className="text-muted text-sm">
                  : {bankDetail.reAccountNumber || ""}
                </p>
              </div>
            </div>
            <div className="row mb-3">
              <div className="col-6 d-flex justify-content-start align-items-center">
                <p className="text-sm">
                  <b>IFSC</b>
                </p>
              </div>
              <div className="col-6">
                <p className="text-muted text-sm">
                  : {bankDetail.ifsc || ""}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
</div>
