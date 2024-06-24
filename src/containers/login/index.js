import React, { Component } from "react";
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Translate } from "react-localize-redux";
import { globalProps, rules } from "../../data";
import { authActions } from "../../actions";
import { Row, Col, Form, Input, Card, Button, Layout } from 'antd';
import logo from "../../../src/assets/images/logo-evend.png";
const { Content } = Layout;

const card = {
  headStyle: {
    textAlign: "center",
    backgroundColor: "#3076bb",
    color: "#FFF",
  },
  size: "small",
  style: {
    width: 400,
    maxWidth: "100vw",
  }
}

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};
const tailLayout = {
  style: {
    textAlign: "center",
    width: "100%"
  }
};

class Login extends Component {

  onLogin(e) {
    e.grant_Type = "password"
    this.props.login(e);
  }

  render() {
    return (
      <Layout >
        <Content style={{ minHeight: "100vh" }}>
          <Row justify="center" {...globalProps.row} gutter={0}>
            <Col flex="unset">
              <Row
                align="middle"
                justify="center"
                gutter={6}
                style={{
                  margin: 0,
                  marginTop: 20,
                  marginBottom: 20,
                }}
              >
                <Col flex="unset">
                  <img height={150} alt="logo" src={logo} />
                </Col>
              </Row>

              <Card
                {...card}
                title={<Translate id="LOGIN" />}
              >
                <Form
                  {...layout}
                  name="basic"
                  onFinish={e => this.onLogin(e)}
                >
                  <Form.Item {...globalProps.formItem}
                    label={<Translate id="USERNAME" />}
                    name="username"
                    rules={[rules.required]}
                  >
                    <Input />
                  </Form.Item>

                  <Form.Item {...globalProps.formItem}
                    label={<Translate id="PASSWORD" />}
                    name="password"
                    rules={[rules.required]}
                  >
                    <Input.Password />
                  </Form.Item>

                  <Row>
                    <Col {...tailLayout}>
                      <Button className="custom-btn-primary" type="primary" htmlType="submit">
                        <Translate id="LOGIN" />
                      </Button>
                    </Col>
                  </Row>
                </Form>
              </Card>
            </Col>
          </Row>
        </Content>
      </Layout>
    )
  }
}

const stateToProps = (state) => {
  return {};
}

const dispatchToProps = (dispatch) => bindActionCreators({
  login: authActions.login,
}, dispatch);

export default connect(stateToProps, dispatchToProps)(Login);