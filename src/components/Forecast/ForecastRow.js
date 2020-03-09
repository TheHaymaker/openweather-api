import React from "react";
import "./ForecastRow.css";

const ForecastRow = ({ children }) => {
  return <div className="forecast-wrapper">{children}</div>;
};

export default ForecastRow;
