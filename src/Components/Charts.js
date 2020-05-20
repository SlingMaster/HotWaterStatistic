// =====================================
//  Component Charts
// =====================================

import React, { Component } from "react";
import "./css/charts.css";
import ChartGrid from "./ChartGrid";
import Chart from "./Chart";
import ChartBarHotWater from "./ChartBarHotWater";
import ChartBarHumidity from "./ChartBarHumidity";
import Spiner from "./Spiner";
import TextItemWithIcon from "./TextItemWithIcon";

import "../iScroll/css/iscroll.css";
import ReactIScroll from "react-iscroll";
var iScroll = require("../iScroll/iscroll-probe");

const CHART_WATER_HEIGHT = "65%";
const CHART_HUMIDITY_HEIGHT = "35%";
const W_MIN = 10;
const W_MAX = 60;
const H_MIN = 0;
const H_MAX = 80;
const W_PIC = 40;
const H_PIC = 40;
class Charts extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isScrolling: false,
      iScrollOptions: {
        mouseWheel: true,
        scrollbars: false,
        scrollX: true,
        scrollY: false
      }
    };
  }

  // onRefresh(iScrollInstance) {
  //   var yScroll = iScrollInstance.y;

  //   console.log("vertical position:" + yScroll);

  //   if (this.state.y !== yScroll) {
  //     this.setState({ y: yScroll });
  //   }
  // }
  // _handleScrollStart = () => {
  //   console.log("iScroll starts scrolling");
  //   this.setState({ isScrolling: true });
  // };

  // _handleScrollEnd = iScrollInstance => {
  //   console.log("iScroll end scrolling");
  //   this.setState({ isScrolling: false, y: iScrollInstance.y });
  // };

  // _handleScrollRefresh = iScrollInstance => {
  //   console.log("iScroll Refresh");
  //   const hasVerticalScroll = iScrollInstance.hasVerticalScroll;

  //   if (this.state.canVerticallyScroll !== hasVerticalScroll) {
  //     this.setState({ canVerticallyScroll: hasVerticalScroll });
  //   }
  // };

  // componentWillReceiveProps() {
  //   console.info("componentWillReceiveProps");
  // }

  componentDidUpdate() {
    // console.info("componentDidUpdate");
    setTimeout(() => {
      this.refs.iScroll.withIScroll(function(iScroll) {
        // iScroll.scrollTo(-1600, 0, 3000);
        // console.info("scrollToElement");
        // iScroll.scrollToElement("#last", 2000, 0, 0, iScroll.utils.ease.elastic);
        iScroll.scrollToElement("#last", 2000);
      });
    }, 3000);
  }

  render() {
    // console.info("Charts render", this.props.lastData);
    let period =
      this.props.data.length > 0 ? this.props.data[0].period : "Today";
    let temperatureHotWater = this.props.lastData.tHot;
    let humidity = this.props.lastData.humidity;
    let isFanRotation = this.props.lastData.fan ? "  rotate" : " ";
    let isPhone = window.innerHeight < 768;

    return (
      <div className="charts-container">
        <div className="charts-title">
          <TextItemWithIcon
            className={`text-with-icon chart_title`}
            delimiter=" "
            label={period}
          />
          <Spiner loading={this.props.loading} />
        </div>
        <div className="charts">
          <div className="chart-grid-container">
            <ChartGrid
              className="chart-grid"
              height={CHART_WATER_HEIGHT}
              options={{
                min: W_MIN,
                max: W_MAX,
                pickup: W_PIC,
                step: isPhone ? 10 : 5,
                unit: "°C"
              }}
            />
            <div className="chart-margin" />
            <ChartGrid
              className="chart-grid"
              height={CHART_HUMIDITY_HEIGHT}
              options={{ min: H_MIN, max: H_MAX, pickup: H_PIC, step: isPhone ? 40 : 20, unit: "%" }}
            />
          </div>

          <div className="iscroll_container">
            <ReactIScroll
              ref="iScroll"
              className="wraper x_mask"
              iScroll={iScroll}
              // onScrollStart={this._handleScrollStart}
              // onScrollEnd={this._handleScrollEnd}
              // onRefresh={this._handleScrollRefresh}
              // onClick={this._handleClick}
              options={{
                mouseWheel: true,
                scrollbars: false,
                disableMouse: false,
                disablePointer: false,
                scrollX: true,
                fade: true
              }}
            >
              <div
                className="scroller"
                ref="scroller"
                onClick={this.onSomethingClick}
              >
                <Chart height={CHART_WATER_HEIGHT}>
                  {this.props.data.map((data, index) => (
                    <ChartBarHotWater
                      options={{ min: W_MIN, max: W_MAX }}
                      item={data}
                      key={"bar_hw" + index}
                    />
                  ))}
                  <ChartBarHotWater
                    hide={this.props.loading}
                    options={{ min: W_MIN, max: W_MAX }}
                    item={{ time: "", tHotMax: Number(temperatureHotWater) }}
                    id={"hw_last"}
                    key={"bar_hw_last"}
                  />
                </Chart>
                <div className="chart-margin" />
                <Chart height={CHART_HUMIDITY_HEIGHT}>
                  {this.props.data.map((data, index) => (
                    <ChartBarHumidity
                      options={{ min: H_MIN, max: H_MAX }}
                      item={data}
                      key={"bar_h" + index}
                    />
                  ))}
                  <ChartBarHumidity
                    hide={this.props.loading}
                    options={{ min: H_MIN, max: H_MAX }}
                    item={{ humidityMax: Number(humidity) }}
                    id={"last"}
                    key={"last"}
                  />
                </Chart>
              </div>
            </ReactIScroll>
          </div>

          <div className="chart-display">
            <TextItemWithIcon
              className={`text-with-icon value-param temperature`}
              val={temperatureHotWater}
              unit={"°C"}
            />
          </div>
          <div className="cs_graph_title">{"• Hot Water"}</div>
          <div className="cs_graph_title bottom">{"• Humidity"}</div>
          <div className="chart-display-bottom">
            <div className={`fan_container humidity`}>
              <TextItemWithIcon
                className={
                  `text-with-icon value-param fan_icon` + isFanRotation
                }
                delimiter=" "
              />
            </div>
            <TextItemWithIcon
              className={`text-with-icon value-param humidity`}
              val={humidity}
              unit={"%"}
            />
          </div>
        </div>
        <TextItemWithIcon
          className={`text-with-icon no_transform`}
          label={"set interval statistic value"}
          unit={this.props.interval + " min"}
        />
      </div>
    );
  }
}

export default Charts;
