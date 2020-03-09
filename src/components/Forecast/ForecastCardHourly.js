import React from "react";
import Moment from "react-moment";
import * as utils from "../../utils/helpers";
import "./ForecastCardHourly.css";

const ForecastCard = ({ day, handleOnClick }) => {
  return (
    <div className="forecast-card forecast-card__hourly">
      <p className="time">
        <Moment format={"h a"}>{day.dt_txt}</Moment>
      </p>
      <div className="weather-icon">
        <i className={utils.buildIcon(day)} />
      </div>
      <div className="temps">
        <div className="temp-high">
          {Math.round(utils.kelvinToFahrenheit(day.main.temp_max))}
          <i className="degree-symbol" />
        </div>
        <div className="temp-low">
          {Math.round(utils.kelvinToFahrenheit(day.main.temp_min))}
          <i className="degree-symbol" />
        </div>
      </div>
    </div>
  );
};

export default ForecastCard;
