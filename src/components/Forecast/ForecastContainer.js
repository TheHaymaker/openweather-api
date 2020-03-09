import React, { Component } from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import * as utils from '../../utils/helpers';

import { VictoryGroup, VictoryChart, VictoryBar, VictoryAxis, VictoryTheme } from 'victory';

import ForecastRow from './ForecastRow';
import ForecastCard from './ForecastCard';
import ForecastRowHourly from './ForecastRowHourly';
import ForecastCardHourly from './ForecastCardHourly';

import './ForecastContainer.css';

export default class ForecastContainer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      forecast: [],
      hourlyFiveDay: [],
      location: {},
      located: true,
      displayHourly: false,
      hourlyForecastList: []
    };
  }

  geolocationError = err => {
    this.setState({
      forecast: [],
      location: {},
      displayHourly: false,
      located: false
    });

    console.warn(`ERROR(${err.code}): ${err.message}`);
  };

  componentDidMount() {
    const options = {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0
    };

    if ('geolocation' in navigator) {
      /* geolocation is available */
      navigator.geolocation.getCurrentPosition(
        position => {
          this.handleGeoSearch(position);
        },
        this.geolocationError,
        options
      );
    } else {
      /* geolocation IS NOT available */
      this.setState({ located: false });
    }
  }

  handleDailyTempChart = temp => {
    switch (temp) {
      case 'high':
        let count = 0;
        const data = this.state.hourlyForecastList.map(time => {
          const high = Math.round(utils.kelvinToFahrenheit(time.main.temp_max));
          count++;
          return { x: count, y: high };
        });
        return data;

      case 'low':
        let count2 = 0;
        const data2 = this.state.hourlyForecastList.map(time => {
          const low = Math.round(utils.kelvinToFahrenheit(time.main.temp_min));
          count2++;
          return { x: count2, y: low };
        });
        return data2;

      case 'avg':
        let count3 = 0;
        const data3 = this.state.hourlyForecastList.map(time => {
          const high = Math.round(utils.kelvinToFahrenheit(time.main.temp_max));
          const low = Math.round(utils.kelvinToFahrenheit(time.main.temp_min));
          const avg = (high + low) / 2;
          // console.log(high, low, avg);
          count3++;
          return { x: count3, y: avg };
        });
        return data3;

      default:
        let count4 = 0;
        const data4 = this.state.hourlyForecastList.map(time => {
          const high = Math.round(utils.kelvinToFahrenheit(time.main.temp_max));
          const low = Math.round(utils.kelvinToFahrenheit(time.main.temp_min));
          const avg = (high + low) / 2;
          // console.log(high, low, avg);
          count4++;
          return { x: count4, y: avg };
        });
        return data4;
    }
  };

  handleKeyPress = e => {
    if (e.key === 'Enter') {
      this.handleForecastSearch();
    }
  };

  handleGeoSearch = pos => {
    const coords = pos.coords;

    const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${coords.latitude}&lon=${coords.longitude}&APPID=41208a14923fc26bae2f6ae307db826e`;

    fetch(url)
      .then(res => res.json())
      .then(res => {
        console.log(res);
        const data = res.list.filter(x => /12:00:00/.test(x.dt_txt));
        const highsAndLows = this.getHighsAndLows(res.list);
        // console.log(highsAndLows);
        const newData = data.map((d, i) => {
          d.main.high = highsAndLows[i].high;
          d.main.low = highsAndLows[i].low;
          return d;
        });

        const newData2 = newData.map(day => day.dt_txt.split(' ').shift());
        const newData3 = newData2.map(date => {
          const testDate = RegExp(date);
          const hourlyArray = res.list.filter(x => testDate.test(x.dt_txt));
          return hourlyArray;
        });

        const avgData = newData3.map(arr => this.determineForecastAverage(arr));

        const newDataFinal = newData.map((d, i) => {
          d.main.avgCondition = avgData[i];
          return d;
        });

        this.setState({
          forecast: newDataFinal,
          hourlyFiveDay: res.list,
          location: res.city,
          located: false,
          displayHourly: false
        });
      })
      .catch(err => {
        console.log(err);
      });
  };

  // get array of dates

  // use that array of dates to map over the available list of hourly forecasts
  // to generate an array of forecasts only for that day

  // then, use that array for that specific day and evaluate the min/max temps
  // and grab highest and lowest total values to sort of get the highs and lows for each day

  mostFrequent = array => {
    let result = array[0].weather[0].id;
    let tmp = 0;
    for (let i = 0; i < array.length; i++) {
      let count = 0;
      for (let j = 0; j < array.length; j++) {
        if (array[i].weather[0].id === array[j].weather[0].id) {
          count++;
        }
      }
      if (count > tmp) {
        tmp = count;
        result = array[i].weather[0].id;
      }
    }
    return result;
  };

  filterDates = (date, list) => {
    console.log(date);
    const testDate = RegExp(date);
    console.log(testDate);
    const hourlyForecastList = list.filter(x => {
      console.log(x.dt_txt);
      console.log(testDate.test(x.dt_txt));
      return testDate.test(x.dt_txt);
    });
    const highest = hourlyForecastList.reduce((max, num) => {
      return num.main.temp_max > max.main.temp_max ? num : max;
    });
    const lowest = hourlyForecastList.reduce((min, num) =>
      num.main.temp_min < min.main.temp_min ? num : min
    );

    return { high: highest.main.temp_max, low: lowest.main.temp_min };
  };

  getHighsAndLows = data => {
    const wholeList = data ? data : this.state.hourlyFiveDay;
    const allTheDates = wholeList.map(x => {
      const date = x.dt_txt.split(' ').shift();
      return date;
    });

    const unique = allTheDates.filter(utils.onlyUnique);

    const hsnls = unique.map(date => {
      return this.filterDates(date, wholeList);
    });

    return hsnls;
  };

  // pass a unique date
  determineForecastAverage = array => this.mostFrequent(array);

  handleHourlyForecast = day => {
    const id = day.dt;
    const newHourly = this.state.hourlyFiveDay.map(x => {
      if (x.dt === id) {
        x.active = true;
      }
      return x;
    });
    const newForecast = this.state.forecast.map(x => {
      if (x.dt === id) {
        x.active = true;
      } else {
        x.active = false;
      }
      return x;
    });
    const date = day.dt_txt.split(' ').shift();

    const testDate = RegExp(date);
    const hourlyForecast = newHourly.filter(x => testDate.test(x.dt_txt));
    this.setState({
      displayHourly: true,
      hourlyForecastList: hourlyForecast,
      forecast: newForecast
    });
  };

  handleForecastSearch = () => {
    const zip = this.zipCode.value;
    if (zip && zip.length === 5) {
      const url = `https://api.openweathermap.org/data/2.5/forecast?zip=${zip},us&APPID=41208a14923fc26bae2f6ae307db826e`;
      fetch(url)
        .then(res => res.json())
        .then(res => {
          const newState = res.list.map(x => {
            x.active = false;
            return x;
          });

          const data = newState.filter(x => /12:00:00/.test(x.dt_txt));
          const highsAndLows = this.getHighsAndLows(res.list);
          // console.log(highsAndLows);
          const newData = data.map((d, i) => {
            d.main.high = highsAndLows[i].high;
            d.main.low = highsAndLows[i].low;
            return d;
          });

          const newData2 = newData.map(day => day.dt_txt.split(' ').shift());
          const newData3 = newData2.map(date => {
            const testDate = RegExp(date);
            const hourlyArray = newState.filter(x => testDate.test(x.dt_txt));
            return hourlyArray;
          });

          const avgData = newData3.map(arr => this.determineForecastAverage(arr));

          const newDataFinal = newData.map((d, i) => {
            d.main.avgCondition = avgData[i];
            return d;
          });

          this.setState({
            forecast: newDataFinal,
            hourlyFiveDay: newState,
            location: res.city,
            displayHourly: false
          });
        })
        .catch(err => {
          console.log(err);
          this.setState({
            forecast: [],
            location: {},
            displayHourly: false
          });
        });
    } else {
      this.setState({
        forecast: [],
        location: {},
        displayHourly: false
      });
    }
  };

  render() {
    const style = {
      maxWidth: '800px',
      margin: '0 auto'
    };

    return (
      <div>
        {this.state.located ? (
          <p>Generating your forecast...</p>
        ) : (
          <div>
            <label htmlFor="zipcode">zipcode:</label>
            <input
              id="zipcode"
              ref={zipCode => (this.zipCode = zipCode)}
              type="text"
              placeholder="e.g. 60618"
              onKeyPress={this.handleKeyPress}
            />
            <button onClick={this.handleForecastSearch}>Search</button>
          </div>
        )}
        {this.state.location && <h2>{this.state.location.name}</h2>}
        <div>
          {this.state.forecast.length ? (
            <ForecastRow>
              <span>
                {this.state.forecast.map(day => (
                  <ForecastCard
                    key={Math.round(Math.random() * day.dt)}
                    day={day}
                    active={day.active}
                    handleOnClick={d => {
                      this.handleHourlyForecast(d);
                    }}
                  />
                ))}
              </span>
            </ForecastRow>
          ) : (
            <div>{this.state.located ? null : <p>Get your 5-day forecast!</p>}</div>
          )}
        </div>
        {this.state.hourlyForecastList.length && this.state.displayHourly ? (
          <div>
            <ForecastRowHourly>
              <ReactCSSTransitionGroup
                transitionName="forecast-card"
                transitionAppear={true}
                transitionAppearTimeout={500}
                transitionEnterTimeout={500}
                transitionLeaveTimeout={300}
              >
                {this.state.hourlyForecastList.map(day => {
                  return <ForecastCardHourly key={day.dt} day={day} />;
                })}
              </ReactCSSTransitionGroup>
            </ForecastRowHourly>
            <div style={style}>
              <VictoryChart
                theme={VictoryTheme.material}
                domainPadding={{ x: 20 }}
                height={200}
                style={{
                  data: { opacity: 0.7 },
                  text: {
                    fontFamily: "'Open Sans', Arial, sans-serif !important",
                    fontSize: '8px !important'
                  }
                }}
              >
                <VictoryAxis
                  crossAxis
                  theme={VictoryTheme.material}
                  standalone={false}
                  label="Time"
                  style={{
                    axis: { stroke: '#f5f5f5' },
                    axisLabel: { fontSize: 8, padding: 30 },
                    tickLabels: { fontSize: 6, padding: 5 }
                  }}
                />
                <VictoryAxis
                  dependentAxis
                  crossAxis
                  theme={VictoryTheme.material}
                  standalone={false}
                  label="Temp (Fahrenheit)"
                  style={{
                    axis: { stroke: '#f5f5f5' },
                    axisLabel: { fontSize: 8, padding: 30 },
                    tickLabels: { fontSize: 6, padding: 5 }
                  }}
                />
                <VictoryGroup
                  animate={{
                    duration: 250,
                    onLoad: { duration: 250 }
                  }}
                  offset={7}
                  colorScale={['rgb(24, 100, 156)', 'rgb(68, 176, 227)', 'rgb(144, 209, 240)']}
                >
                  <VictoryBar
                    alignment="start"
                    barRatio={0.2}
                    data={this.handleDailyTempChart('high')}
                  />
                  <VictoryBar
                    alignment="start"
                    barRatio={0.2}
                    data={this.handleDailyTempChart('avg')}
                  />
                  <VictoryBar
                    alignment="start"
                    barRatio={0.2}
                    data={this.handleDailyTempChart('low')}
                  />
                </VictoryGroup>
              </VictoryChart>
              <p>Daily Temperatures</p>
            </div>
          </div>
        ) : (
          <div>
            {this.state.hourlyForecastList.length === 0 ? (
              <p>Click on a day to see the hourly forecast.</p>
            ) : null}
          </div>
        )}
      </div>
    );
  }

  // build component for search / input

  // Validation for input to dynamically search the API depending on the query
  // e.g. zipcode vs. city name vs lat/long

  // For added practice, here are a few ways you could expand on the app:

  // Add the ability to click on a day, and see its hourly forecast.
  // You can just maintain the current view in the top-level App state.

  // Add React Router to the project (npm install react-router) and
  // follow the quick start guide here to add routes, such
  // that / shows the 5-day forecast, and /[name-of-day] shows the hourly
  // forecast for a particular day.

  // Want to get really fancy? Add a graphics library like vx
  // and follow the examples here to add a graph of the temperature
  // over the course of a week or day.
}
