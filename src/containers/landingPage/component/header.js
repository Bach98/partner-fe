import React, { Component } from "react";
import { Layout, Row, Col, Button } from 'antd';
// import { NavLink } from 'react-router-dom';
import {

} from '@ant-design/icons';
import { LOCAL_PATH } from "../../../constants";
// import { globalProps } from "../../../data"
import logo from "../../../assets/images/logo-evend.png";
const { Header } = Layout;

class Landing extends Component {

  render() {
    return (
      <Header style={{ backgroundColor: "#ffffff" }}>
        <div className="header wrapper" >
          <Row gutter={0}>
            <Col>
              <img alt="logo" src={logo} />
              <span className="title">Merchant Centric</span>
            </Col>
            <Col style={{ textAlign: "right", fontWeight: 600 }}>
              <Button onClick={e => this.props.toRegister()} style={{ border: "none", marginRight: 5 }}>Đăng ký</Button>
              <Button href={LOCAL_PATH.LOGIN} className="custom-btn-primary" type="primary">Đăng nhập</Button>
            </Col>
          </Row>
        </div>
      </Header>
    )
  }
}

export default Landing;