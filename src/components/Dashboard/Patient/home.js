import React, { Component } from 'react';
import {Chart} from 'react-google-charts';
import SolidGuage from '../../charts/solidGuage'

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      steps: '[]',
      glucose: '[]',
      caloriesBurned: '[]',
      caloriesIntake: '[]',
      predictedGlucose: '[]'
    };

    this.WeightChart = this.WeightChart.bind(this);
  }

  componentWillMount = function(){
    this.getLatestSteps();
    this.getLatestGlucose();
    this.getLatestCaloriesBurned();
    this.getLatestCaloriesIntakeWidget();
    //this.getPredictedGlucose();
  }

  makeGetRequest(url, callback) {
    var request = new Request(url, {
    	method: 'GET',
    	mode: 'cors',
    	redirect: 'follow',
    	headers: new Headers({
    		'Content-Type': 'application/json'
    	})
    });

    fetch(request).then(function(response) {
      return response.json();
    }).then(function(j) {
      callback(j);
    });
  }

  makePostRequest(url, params, callback) {
     var request = new Request(url, {
       method: 'POST',
       body: JSON.stringify({
         bmi: params
       }),
       mode: 'cors',
       redirect: 'follow'
     });

     fetch(request).then(function(response) {
       return response.json();
     }).then(function(j) {
       callback(j);
     });
 }

  getLatestSteps = function() {
    this.makeGetRequest('http://localhost:9000/patient/latestActivity', function(json){
      this.setState({'steps':json})
    }.bind(this));
  }

  getLatestGlucose = function() {
    this.makeGetRequest('http://localhost:9000/patient/latestGlucose', function(json){
      this.setState({'glucose':json})
    }.bind(this));
  }

  getLatestCaloriesBurned = function() {
    this.makeGetRequest('http://localhost:9000/patient/latestCaloriesBurned', function(json){
      this.setState({'caloriesBurned':json})
    }.bind(this));
  }

  getLatestCaloriesIntakeWidget = function() {
    this.makeGetRequest('http://localhost:9000/patient/latestCaloriesIntake', function(json){
      this.setState({'caloriesIntake':json})
    }.bind(this));
  }

  getPredictedGlucose = function() {
    this.makePostRequest('http://10.250.4.104:8000', 19.6 ,function(data){
      this.setState({'predictedGlucose':data.value[0]})
    }.bind(this));
  }

  widget = function (props) {
    return (
      <div className="widget panel panel-info">
        <div className="panel-heading">{props.heading}</div>
          <div className="panel-body center">
            <h2 className="h1">{props.value}<span className="txt-small"> {props.units}</span></h2>
            {props.graph}
          </div>
      </div>
    );
  }

  barChart = function(props) {
    return (
        <div className={'my-pretty-chart-container'}>
          <Chart
            chartType="PieChart"
            data = {props.data}
            options = {props.options}
            graph_id={props.id}
            width="100%"
            legend_toggle
          />
        </div>
      );
  }

  WeightChart = function() {
    return (
        <div className={'my-pretty-chart-container'}>
          <Chart
            chartType="Gauge"
            data = {[['Label', 'Value'], ['Weight', 80]]}
            options = {{
              legend: 'none',
              redFrom: 80,
              redTo: 100,
              yellowFrom: 60,
              yellowTo: 80,
              minorTicks: 5,
              is3D: true,
            }}
            graph_id="Gauge"
            width="100%"
            legend_toggle
          />
        </div>
      );
    }

  render() {
    return (
      <div className="row widget-items">
          <div className="col-md-4">
            <this.widget
              heading = "ACTIVITY"
              value = {this.state.steps.StepCount}
              units = "Steps"
              graph = {
                <SolidGuage
                  text = 'Steps'
                  data= {[6000/8000*100]}
                  units = 'steps'
                  goal = '8000'
                />
              }
            />
          </div>
          <div className="col-md-4">
            <this.widget
              heading="CALORIES BURNED"
              value={this.state.caloriesBurned.calories}
              units={this.state.caloriesBurned.units}
              graph = {
                <SolidGuage
                  text = 'Calories'
                  data = {[300/1000*100]}
                  units = 'kcal'
                  goal = '1000'
                />
              }
            />
          </div>
          <div className="col-md-4" >
            <this.widget
              heading="CALORIES INTAKE"
              value={this.state.caloriesIntake.calories}
              units={this.state.caloriesIntake.units}
              graph = {
                <SolidGuage
                  text = 'Calories'
                  data = {[100/3000*100]}
                  units = 'kcal'
                  goal = '3000'
                />
              }
            />
          </div>
          <div className="col-md-4" >
            <this.widget
              heading="Predicted Glucose Value"
              value={this.state.predictedGlucose}
            />
          </div>
      </div>
    );
  }
}

export default Home;
