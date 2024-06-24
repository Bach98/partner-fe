import { Card, Button, Row, Col, Form, Input } from 'antd';
import React, { Component } from "react";
import { Translate } from "react-localize-redux";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { globalProps, rules } from "../../data";
import { authActions } from '../../actions';
const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 8 },
};
const tailLayout = {
  style: {
    textAlign: "center"
  }
};

class ChangePassword extends Component {

  state = {
  }

  form = React.createRef()

  onChangePassword(e) {
    let data = {
      username: e.username,
      oldPassword: e.oldPassword,
      newPassword: e.password
    }
    this.props.changePassword({ data });
  }

  onChangePasswordFail(e) {
  }

  render() {
    let { info } = this.props;
    return (
      <React.Fragment>
        <Card
          title={<strong><Translate id="CHANGE_PASSWORD" /></strong>}
        >
          <Form
            {...layout}
            name="changePass"
            onFinish={e => this.onChangePassword(e)}
            onFinishFailed={e => this.onChangePasswordFail(e)}
          >
            <Form.Item {...globalProps.formItem}
              label={<Translate id="USERNAME" />}
              name="username"
              initialValue={info.userName}
            >
              <Input disabled />
            </Form.Item>

            <Form.Item {...globalProps.formItem}
              label={<Translate id="OLD_PASSWORD" />}
              name="oldPassword"
              rules={[rules.required]}
            >
              <Input.Password />
            </Form.Item>

            <Form.Item {...globalProps.formItem}
              label={<Translate id="NEW_PASSWORD" />}
              name="password"
              rules={[rules.required]}
            >
              <Input.Password />
            </Form.Item>

            <Form.Item {...globalProps.formItem}
              label={<Translate id="REPASSWORD" />}
              name="repassword"
              rules={[rules.repassword, rules.required]}
            >
              <Input.Password />
            </Form.Item>
            <Row>
              <Col {...globalProps.col3} {...tailLayout}>
                <Button className="custom-btn-primary" type="primary" htmlType="submit">
                  <Translate id="CHANGE_PASSWORD" />
                </Button>
              </Col>
            </Row>
          </Form>
        </Card>
      </React.Fragment>
    )
  }
}

const stateToProps = (state) => {
  return {
    info: state.auth.userInfo,
  };
}

const dispatchToProps = (dispatch) => bindActionCreators({
  changePassword: authActions.changePassword
}, dispatch);

export default connect(stateToProps, dispatchToProps)(ChangePassword);