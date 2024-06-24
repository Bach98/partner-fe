import React, { Component } from "react";
// import SupportPOSFree from "../../../assets/images/LandingPage/SupportPOSFree.svg";
import Evoucher from "../../../assets/images/LandingPage/Evoucher.svg";
import Ewallet from "../../../assets/images/LandingPage/Ewallet.svg";
import Booking from "../../../assets/images/LandingPage/Booking.svg";
import BankCard from "../../../assets/images/LandingPage/BankCard.svg";
import Loyalty from "../../../assets/images/LandingPage/Loyalty.svg";
import Report from "../../../assets/images/LandingPage/Report.svg";
import { Row, Col } from "antd";

const ListItem = [
  {
    alt: "Evoucher",
    src: Evoucher,
    text: <span>Tự động phát hành e-voucher<br />đến hàng triệu khách hàng</span>
  },
  {
    alt: "BankCard",
    src: BankCard,
    text: <span>Chấp nhận thanh toán thẻ ngân hàng<br />tại cửa hàng</span>
  },
  {
    alt: "Ewallet",
    src: Ewallet,
    text: <span>Liên kết các ví điện tử</span>
  },
  {
    alt: "Booking",
    src: Booking,
    text: <span>Tích hợp ứng dụng đặt món<br />và giao hàng</span>
  },
  {
    alt: "Loyalty",
    src: Loyalty,
    text: <span>Chăm sóc khách hàng tự động</span>
  },
  {
    alt: "Report",
    src: Report,
    text: <span>Báo cáo các chương trình<br />bán hàng</span>
  },
]

class EcoSystem extends Component {
  constructor(props) {
    super(props);
    this.handleScroll = this.handleScroll.bind(this);
    this.state = {
      offsetTop: 0,
      active: false
    }
  }

  componentDidMount() {
    this.setState({ offsetTop: document.getElementById("ecoSystem").offsetTop })
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
      this.setState({ active: true });
      document.removeEventListener('scroll', this.handleScroll);
    }
  }

  render() {
    let { active } = this.state;
    return (
      <div
        id="ecoSystem"
        className={`ecoSystem ${active ? "active" : "inactive"}`}
        style={{ textAlign: "center", display: "block" }}
      >
        <div className="title">Tại hệ thống ToroG khách hàng sẽ liên kết các kênh dịch vụ</div>
        <Row gutter={[24, 64]}>
          {ListItem.map((k, i) =>
            <Col className="eco-item" key={i} xxl={8} xl={8} lg={8} md={12} xs={12}>
              <img width="80%" className="eco-icon" alt={k.alt} src={k.src} />
              <div className="eco-text">
                {k.text}
              </div>
            </Col>
          )}
        </Row>
      </div>
    )
  }
}

export default EcoSystem;