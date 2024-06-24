import React, { Component } from "react";
import { Translate, withLocalize } from "react-localize-redux";
import { Select, Card, Form, Button, Row, Col, Switch, Input } from 'antd';
import {
  SearchOutlined,
} from '@ant-design/icons';
import { globalProps } from "../../../data";
// var moment = require("moment");
const { Option } = Select;

class AdvanceSearch extends Component {
  state = {
    showAdvance: false,
    searchBody: {
    }
  }

  form = React.createRef()

  toggleAdvanceSearch() {
    this.setState({
      showAdvance: !this.state.showAdvance,
    });
    this.onReset();
  }

  onReset() {
    this.setState({
      searchBody: {}
    });
    this.form.current.resetFields();
  }

  onSearch() {
    this.props.onSearch({ searchBody: this.state.searchBody });
  }

  onExport() {
    this.props.onExport(this.state.searchBody);
  }

  render() {
    let { showAdvance, searchBody } = this.state;
    return (
      <Card
        title={<strong><Translate id="SEARCH" /></strong>}
        size="small"
        style={{ marginTop: 10 }}
        extra={
          <Switch
            checked={showAdvance}
            checkedChildren={<Translate id="SEARCH_ADVANCE" />}
            unCheckedChildren={<Translate id="SEARCH_BASIC" />}
            onChange={e => this.toggleAdvanceSearch()}
          />
        }
      >
        <Form
          labelAlign="right"
          layout="horizontal"
          initialValues={searchBody}
          onFinish={e => this.onSearch(e)}
          {...globalProps.form}
          ref={this.form}
        >
          {showAdvance ?
            <Row {...globalProps.row}>
              <Col {...globalProps.col}>
                <Form.Item {...globalProps.formItem}
                  label={<Translate id="MACHINE" />}
                  name="machine"
                >
                  <Select {...globalProps.selectSearch} allowClear mode="multiple">
                    {[].map((k, i) =>
                      <Option value={k.id} key={i}>{k.name}</Option>
                    )}
                  </Select>
                </Form.Item>
              </Col>
              <Col {...globalProps.col}>
                <Form.Item {...globalProps.formItem}
                  label={<Translate id="ADDRESS" />}
                  name="address"
                >
                  <Input />
                </Form.Item>
              </Col>
            </Row>
            :
            <Row {...globalProps.row}>
              <Col {...globalProps.col}>
                <Form.Item {...globalProps.formItem}
                  label={<Translate id="MACHINE" />}
                  name="machine"
                >
                  <Select {...globalProps.selectSearch} allowClear mode="multiple">
                    {[].map((k, i) =>
                      <Option value={k.id} key={i}>{k.name}</Option>
                    )}
                  </Select>
                </Form.Item>
              </Col>
            </Row>
          }
          <Row {...globalProps.row}>
            <Col {...globalProps.col3}>
              <Button.Group>
                <Button
                  className="custom-btn-primary"
                  type="primary"
                  htmlType="submit"
                  size="large"
                >
                  <span>
                    <Translate id="SEARCH" />
                  </span>
                  <SearchOutlined />
                </Button>
                <Button
                  htmlType="reset"
                  size="large"
                  onClick={e => this.onReset()}
                >
                  <span>
                    <Translate id="RESET" />
                  </span>
                </Button>
              </Button.Group>
            </Col>
          </Row>
        </Form>

      </Card>
    )
  }
}

export default withLocalize(AdvanceSearch);