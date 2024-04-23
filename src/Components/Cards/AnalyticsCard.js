import React from "react";

const AnalyticsCard = ({ text = "", val = "", icon = "fa-message" }) => {
  return (
    <div className="col-xl-4 col-md-4 pt-4 px-4">
      <div className="card border-left-primary shadow h-100 py-2">
        <div className="card-body">
          <div className="row no-gutters align-items-center">
            <div className="col mr-2">
              <div className="text-xs font-weight-bold text-primary mb-1">
                {text}
              </div>
              <div className="h5 mb-0 font-weight-bold text-gray-800">
                <h2>{val}</h2>
              </div>
            </div>
            <div className="col-auto">
              <i className={`fa-solid ${icon} fa-2x text-gray-300`}></i>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsCard;
