import React, { Component } from 'react';
import ForecastContainer from './components/Forecast/ForecastContainer';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Five Day Forecast</h1>
        </header>
        <p className="App-intro">Search your area below:</p>
        <ForecastContainer />
      </div>
    );
  }
}

export default App;
