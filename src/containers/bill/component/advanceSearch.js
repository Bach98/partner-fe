import React, { Component } from "react";
import { Translate, withLocalize } from "react-localize-redux";
import { Select, Card, Form, Button, Row, Col, Switch, DatePicker, Input } from 'antd';
import {
  SearchOutlined,
} from '@ant-design/icons';
import { globalProps } from "../../../data";
// var moment = require("moment");
const { RangePicker } = DatePicker;
const { Option } = Select;
// const defaultDate = [
//   moment().add(-30, 'days').hour(0).minute(0).second(0).millisecond(0),
//   moment().add(1, 'days').hour(0).minute(0).second(0).millisecond(0),
// ]
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

  onSearch(e) {
    this.setState({ searchBody: e }, () => {
      let body = { ...this.state.searchBody }
      if (body.date) {
        body.dateFrom = body.date[0];
        body.dateTo = body.date[1];
        delete body.date;
      }
      this.props.onSearch(body);
    })
  }

  onExport() {
    this.props.onExport(this.state.searchBody);
  }

  render() {
    let { showAdvance, searchBody } = this.state;
    let {
      products, machines, paymentMethods, statuses
    } = this.props;
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
                  label={<Translate id="PRODUCT" />}
                  name="productList"
                >
                  <Select {...globalProps.selectSearch} allowClear mode="multiple">
                    {products.map((k, i) =>
                      <Option value={k.id} key={i}>{k.name}</Option>
                    )}
                  </Select>
                </Form.Item>
              </Col>
              <Col {...globalProps.col}>
                <Form.Item {...globalProps.formItem}
                  label={<Translate id="DATE_RANGE" />}
                  name="date"
                >
                  <RangePicker
                    showTime={{ format: 'HH:mm' }}
                    format="YYYY-MM-DD HH:mm"
                    style={{ width: "100%" }}
                  />
                </Form.Item>
              </Col>
              <Col {...globalProps.col}>
                <Form.Item {...globalProps.formItem}
                  label={<Translate id="MACHINE" />}
                  name="machineList"
                >
                  <Select {...globalProps.selectSearch} allowClear mode="multiple">
                    {machines.map((k, i) =>
                      <Option value={k.id} key={i}>{k.name}</Option>
                    )}
                  </Select>
                </Form.Item>
              </Col>
              <Col {...globalProps.col}>
                <Form.Item {...globalProps.formItem}
                  label={<Translate id="PAYMENT_METHOD" />}
                  name="paymentMethodList"
                >
                  <Select {...globalProps.selectSearch} allowClear mode="multiple">
                    {paymentMethods.map((k, i) =>
                      <Option value={k.id} key={i}>{k.name}</Option>
                    )}
                  </Select>
                </Form.Item>
              </Col>
              <Col {...globalProps.col}>
                <Form.Item {...globalProps.formItem}
                  label={<Translate id="BILL_NUMBER" />}
                  name="billNumber"
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col {...globalProps.col}>
                <Form.Item {...globalProps.formItem}
                  label={<Translate id="STATUS" />}
                  name="statusList"
                >
                  <Select {...globalProps.selectSearch} allowClear mode="multiple">
                    {statuses.map((k, i) =>
                      <Option value={k.id} key={i}>{k.name}</Option>
                    )}
                  </Select>
                </Form.Item>
              </Col>
            </Row>
            :
            <Row {...globalProps.row}>
              <Col {...globalProps.colHalf}>
                <Form.Item {...globalProps.formItem}
                  label={<Translate id="PRODUCT" />}
                  name="productList"
                >
                  <Select {...globalProps.selectSearch} allowClear mode="multiple">
                    {products.map((k, i) =>
                      <Option value={k.id} key={i}>{k.name}</Option>
                    )}
                  </Select>
                </Form.Item>
              </Col>
              <Col {...globalProps.colHalf}>
                <Form.Item {...globalProps.formItem}
                  label={<Translate id="DATE_RANGE" />}
                  name="date"
                >
                  <RangePicker
                    showTime={{ format: 'HH:mm' }}
                    format="YYYY-MM-DD HH:mm"
                    style={{ width: "100%" }}
                  />
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