import React from 'react';
import Moment from 'react-moment';
import * as utils from '../../utils/helpers';
import './ForecastCard.css';

const ForecastCard = ({ day, handleOnClick, active }) => {
  return (
    <button
      onClick={() => handleOnClick(day)}
      className={`forecast-card ${active ? 'forecast-card__active' : ''}`}
    >
      <p className="day">
        <Moment format={'ddd'}>{day.dt_txt}</Moment>
      </p>
      <div className="weather-icon">
        <i className={utils.buildIconFromID(day.main.avgCondition)} />
      </div>
      <div className="temps">
        <div className="temp-high">
          {Math.round(utils.kelvinToFahrenheit(day.main.high))}
          <i className="degree-symbol" />
        </div>
        <div className="temp-low">
          {Math.round(utils.kelvinToFahrenheit(day.main.low))}
          <i className="degree-symbol" />
        </div>
      </div>
    </button>
  );
};

export default ForecastCard;
