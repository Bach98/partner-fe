import React, { Component } from "react";
import voucher from "../../../assets/images/LandingPage/voucher-bg.png"
import zero from "../../../assets/images/LandingPage/zero-bg.png"
import { Row, Col, Statistic } from "antd";

class BG extends Component {
  constructor(props) {
    super(props);
    this.handleScroll = this.handleScroll.bind(this);
    this.state = {
      eWallet: 0,
      eCommerce: 0,
      partner: 0,
      store: 0,
      offsetTop: 0,
    }
  }

  animateValue(key, start, end, step = 10, duration = 2000) {
    var current = start;
    var increment = end > start ? Math.floor((end - start) / step) : -1;
    var stepTime = Math.abs(Math.floor(duration / step));
    var timer = setInterval(() => {
      current += !!increment ? increment : 1;
      if (current > end) {
        current = end
      }
      this.setState({
        [key]: current
      })
      if (current >= end) {
        clearInterval(timer);
      }
    }, stepTime);
  }

  componentDidMount() {
    this.setState({ offsetTop: document.getElementById("bg").offsetTop })
    document.addEventListener('scroll', this.handleScroll);
  }

  componentWillUnmount() {
    document.removeEventListener('scroll', this.handleScroll);
  }

  handleScroll(event) {
    let scrollTop = window.scrollY;
    let { offsetTop } = this.state;
    let screenHeight = window.screen.availHeight;
    if (scrollTop >= (offsetTop - screenHeight / 2)) {
      this.animateValue("eWallet", 0, 50, 50, 2000);
      this.animateValue("eCommerce", 0, 8, 50, 2000);
      this.animateValue("partner", 0, 30, 50, 2000);
      this.animateValue("store", 0, 42000, 50, 2000);
      document.removeEventListener('scroll', this.handleScroll);
    }
  }

  render() {
    let { eWallet, eCommerce, partner, store } = this.state;
    return (
      <div
        id="bg"
        className="bg"
        style={{ marginBottom: 50 }}
      >
        <Row gutter={[16, 32]} style={{ marginTop: 30 }}>
          <Col xxl={12} xl={12} lg={12} md={24} xs={24}>
            <img width="100%" src={voucher} alt="voucher" />
            <div className="bg-text">Phát hành e-voucher giúp Merchant tiếp cận đến hàng triệu khách hàng cực kỳ đơn giản</div>
          </Col>
          <Col xxl={12} xl={12} lg={12} md={24} xs={24}>
            <img width="100%" src={zero} alt="zero" />
            <div className="bg-text">Sở hữu hệ thống và thiết bị vận hành với giá 0 đồng</div>
          </Col>
        </Row>
        <Row gutter={[16, 32]} style={{ marginTop: 30 }}>
          <Col xxl={6} xl={6} lg={6} md={24} xs={24}>
            <Statistic value={eWallet} prefix="+" />
            <div className="title">Liên kết các ngân hàng và ví điện tử</div>
          </Col>
          <Col xxl={6} xl={6} lg={6} md={24} xs={24}>
            <Statistic value={eCommerce} prefix="+" />
            <div className="title">Liên kết hơn 8 sàn thương mại điện tử lớn</div>
          </Col>
          <Col xxl={6} xl={6} lg={6} md={24} xs={24}>
            <Statistic value={partner} prefix="+" />
            <div className="title">Liên kết hơn 30 đối tác cung cấp dịch vụ vận hàng kinh doanh và chăm  khách hàng</div>
          </Col>
          <Col xxl={6} xl={6} lg={6} md={24} xs={24}>
            <Statistic value={store} prefix="+" />
            <div className="title">Liên kết hơn 42.000 cửa hàng</div>
          </Col>
        </Row>
      </div>
    )
  }
}

export default BG;