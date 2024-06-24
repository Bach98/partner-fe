import React, { Component } from "react";
import usage from "../../../assets/images/LandingPage/device-usage.svg"
import toro from "../../../assets/images/LandingPage/TOROWhite.svg"

class DeviceUsage extends Component {

  render() {
    return (
      <div
        className="device-usage"
      >
        <div className="corner">
          <img src={toro} alt="toro" />
          <div>All In One</div>
        </div>
        <img src={usage} alt="usage" />
      </div>
    )
  }
}

export default DeviceUsage;