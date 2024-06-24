import React, { Component } from "react";
import pos from "../../../assets/images/LandingPage/POSDI.svg"

class Intro extends Component {
  render() {
    return (
      <div
        className="introduce"
      >
        <div className="center">
          <img src={pos} alt="pos" className="pos" />
          <div className="circle c-1" />
          <div className="circle c-2" />
          <div className="circle c-3" />
          <div className="circle c-4" />
          <div className="circle c-5" />
        </div>
        <div className="text">
          <div className="title">Nền tảng liên kết đa dịch vụ<br />nối kết khách hàng dễ dàng hơn</div>
        </div>
        <div className="toro" />
      </div>
    )
  }
}

export default Intro;