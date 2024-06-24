import React, { Component } from "react";
import { Translate, withLocalize } from "react-localize-redux";
import { Button, Row, Col, Drawer, Form, Descriptions, Typography, Select } from "antd";
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  CaretDownFilled,
  LogoutOutlined,
  SyncOutlined
  // BulbOutlined
} from '@ant-design/icons';
import { globalProps } from "../../data";
import { NavLink } from 'react-router-dom';
import { LOCAL_PATH } from "../../constants";
const { Item } = Descriptions;
const { Text } = Typography;
const { Option } = Select;
class HeaderBar extends Component {
  state = {
    showProfile: false
  }

  showProfile(val) {
    this.setState({
      showProfile: val
    });
  }

  render() {
    let { showProfile } = this.state;
    let {
      activeLanguage, languages, toggleLang,
      userInfo
    } = this.props;
    return (
      <React.Fragment>
        <Row
          justify="space-between"
          style={{ color: "white" }}
        >
          <Col flex="unset">
            <Button className="custom-btn-primary" type="primary" onClick={this.props.toggleCollapsed} >
              {React.createElement(this.props.collapsed ? MenuUnfoldOutlined : MenuFoldOutlined)}
            </Button>
          </Col>
          <Col flex="unset">
            <Row justify="end" gutter={12}>
              <Col>
                <Select
                  style={{ color: "white" }}
                  bordered={false}
                  defaultValue="vi"
                  value={activeLanguage.code}
                  onSelect={e => toggleLang(e)}
                  suffixIcon={<CaretDownFilled style={{ color: "white" }} />}
                >
                  {languages.map(k =>
                    <Option value={k.code} key={k.code}>{k.name}</Option>
                  )}
                </Select>
              </Col>
              <Col>
                <Text
                  style={{ cursor: "pointer", color: "white" }}
                  onClick={e => this.showProfile(true)}
                  strong
                >
                  {userInfo.userName}
                  <CaretDownFilled />
                </Text>
              </Col>
            </Row>
          </Col>
        </Row>
        <Drawer
          title={<Translate id="PROFILE" />}
          placement="right"
          closable={true}
          width={500}
          onClose={e => this.showProfile(false)}
          visible={showProfile}
        >
          <Form
            labelAlign="right"
            layout="vertical"
          >
            <Row {...globalProps.row}>
              <Col span={24}>
                <Descriptions column={3}>
                  <Item
                    label={<Translate id="NAME" />}
                    span={3}
                  >
                    {userInfo.fullName}
                  </Item>
                </Descriptions>
              </Col>
            </Row>
            <Row {...globalProps.row}>
              <Col style={{ textAlign: "right" }}>
                <Button onClick={e => this.props.logout()} className="custom-btn-primary" type="primary">
                  <span>
                    <Translate id="LOGOUT" />
                  </span>
                  <LogoutOutlined />
                </Button>
              </Col>
              <Col style={{ textAlign: "left" }}>
                <NavLink to={LOCAL_PATH.USER.CHANGE_PASSWORD}>
                  <Button className="custom-btn-primary" type="primary" onClick={e => this.showProfile(false)}>
                    <span>
                      <Translate id="CHANGE_PASSWORD" />
                    </span>
                    <SyncOutlined />
                  </Button>
                </NavLink>
              </Col>
            </Row>
          </Form>
        </Drawer>
      </React.Fragment>
    )
  }
}

export default withLocalize(HeaderBar);