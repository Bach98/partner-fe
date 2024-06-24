import React, { Component } from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { Translate } from "react-localize-redux";
import { Card, Row, Col, PageHeader, Form, Input, Table, DatePicker, Select, Upload, InputNumber } from "antd";
import { LOCAL_PATH, DATE_FORMAT } from "../../constants";
import { globalProps, format, rules, isAllow, PERMISSION } from "../../data";
import { payoutTransactionActions } from "../../actions";
import { history } from "../../store";
const { Option } = Select;
const { Column } = Table;
class PayoutTransactionDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      paginate: { ...globalProps.defaultPaginate },
      startDate: undefined,
      endDate: undefined,
    };
  }

  form = React.createRef();

  componentDidMount() {
    let { match: { params: { id } } } = this.props;
    this.init(id);
  }

  init(id) {
    this.props.init();
    if (id !== "new") {
      let body = { id: id - 0 };
      this.props.detail(body);
    } else {
      let body = { id: 0 };
      this.props.detail(body);
    }
  }

  render() {
    let { match: { params: { id } } } = this.props;
    let { detailList, dataList, statusList } = this.props;

    return (
      <React.Fragment>
        <PageHeader
          title={
            <Translate id="PAYOUT_TRANSACTION.DETAIL" />
          }
          ghost={false}
          onBack={(e) => history.push(LOCAL_PATH.PAYOUT_TRANSACTION.INDEX)}
        />
        <Form
          {...globalProps.form}
          initialValues={dataList}
          ref={this.form}
          key={dataList.id}
        >
          <Card
            title={<strong>Thông tin chung</strong>}
            size="small"
            style={{ marginTop: 10 }}
          >
            <Row {...globalProps.row}>
              <Col {...globalProps.colHalf}>
                <Form.Item {...globalProps.formItem}
                  label={"Mã giao dịch thối tiền"}
                  name="transactionCashPayoutCode"
                >
                  <Input disabled />
                </Form.Item>
              </Col>
              <Col {...globalProps.colHalf}>
                <Form.Item {...globalProps.formItem}
                  label={"Mã đơn hàng"}
                  name="billNumber"
                >
                  <Input disabled />
                </Form.Item>
              </Col>
              <Col {...globalProps.colHalf}>
                <Form.Item
                  {...globalProps.formItem}
                  label={"Trạng thái"}
                  name="status"
                >
                  <Select {...globalProps.selectSearch} disabled>
                    {statusList.map((k, i) =>
                      <Option key={i} value={k.code}>
                        <Translate id={`PAYOUT_STATUS.${k.code}`} />
                      </Option>
                    )}
                  </Select>
                </Form.Item>
              </Col>

              <Col {...globalProps.colHalf}>
                <Form.Item {...globalProps.formItem}
                  label={"Mã máy"}
                  name="machineCode"
                >
                  <Input disabled />
                </Form.Item>
              </Col>
              <Col {...globalProps.colHalf}>
                <Form.Item {...globalProps.formItem}
                  label={"Địa điểm"}
                  name="locationName"
                >
                  <Input disabled />
                </Form.Item>
              </Col>
              <Col {...globalProps.colHalf}>
                <Form.Item {...globalProps.formItem}
                  label={"Số điện thoại"}
                  name="phoneNumber"
                >
                  <Input disabled />
                </Form.Item>
              </Col>
              <Col {...globalProps.col5}>
                <Form.Item {...globalProps.formItem}
                  label={"Số tiền đơn hàng"}
                  name="orderAmount"
                >
                  <InputNumber disabled style={{ width: "100%" }}  {...globalProps.inputNumberVND} />
                </Form.Item>
              </Col>
              <Col {...globalProps.col5}>
                <Form.Item {...globalProps.formItem}
                  label={"Số tiền nhận"}
                  name="inputAmount"
                >
                  <InputNumber disabled style={{ width: "100%" }}  {...globalProps.inputNumberVND} />
                </Form.Item>
              </Col>
              <Col {...globalProps.col5}>
                <Form.Item {...globalProps.formItem}
                  label={"Số tiền thối"}
                  name="amount"
                >
                  <InputNumber disabled style={{ width: "100%" }}  {...globalProps.inputNumberVND} />
                </Form.Item>
              </Col>
              <Col {...globalProps.col5}>
                <Form.Item {...globalProps.formItem}
                  label={"Mệnh giá thối"}
                  name="valueCash"
                >
                  <InputNumber disabled style={{ width: "100%" }}  {...globalProps.inputNumberVND} />
                </Form.Item>
              </Col>
              <Col {...globalProps.col5}>
                <Form.Item {...globalProps.formItem}
                  label={"Số tờ thối"}
                  name="totalSheet"
                >
                  <Input disabled />
                </Form.Item>
              </Col>
              <Col {...globalProps.col5}>
                <Form.Item {...globalProps.formItem}
                  label={"Số tờ thối thành công"}
                  name="totalSheetSuccess"
                >
                  <Input disabled />
                </Form.Item>
              </Col>
              <Col {...globalProps.colHalf}>
                <Form.Item {...globalProps.formItem}
                  label={"Thời gian tạo"}
                  name="createTime"
                >
                  <DatePicker
                    disabled
                    allowClear
                    style={{ width: "100%" }}
                    format={DATE_FORMAT.DDMMYYYHHMMSS}
                  />
                </Form.Item>
              </Col>
              <Col {...globalProps.colHalf}>
                <Form.Item {...globalProps.formItem}
                  label={"Thời gian cập nhật"}
                  name="updateTime"
                >
                  <DatePicker
                    disabled
                    allowClear
                    style={{ width: "100%" }}
                    format={DATE_FORMAT.DDMMYYYHHMMSS}
                  />
                </Form.Item>
              </Col>
            </Row>
          </Card>
          <Card
            title={<strong>Thông tin thối tiền chi tiết</strong>}
            size="small"
            style={{ marginTop: 10 }}
          >
            <Table
              {...globalProps.table}
              style={{ marginTop: 20 }}
              dataSource={detailList.map((k, i) => {
                k.key = i;
                return k;
              })}
            >
              <Column
                title={<Translate id="INDEX" />}
                dataIndex="seq"
                align="center"
              />
              <Column
                title={"Số tờ"}
                dataIndex="sheet"
                align="center"
              />
              <Column
                title={"Số tờ thành công"}
                dataIndex="totalSheetSuccess"
                align="center"
              />
              <Column
                title={"Số tiền thối"}
                dataIndex="value"
                align="center"
                render={val => val ? globalProps.inputNumberVND.formatter(val) : 0}
              />
              <Column
                title={"Trạng thái"}
                dataIndex="status"
                render={(val) =>
                  (val === "SUCCESS") ? (val = "Hoàn thành") : (val = "Chưa hoàn thành")
                }
              />
              <Column
                title={"Loại"}
                dataIndex="type"
                render={(val) =>
                  (val === "REDEEM") ? (val = "Tiền thối") : (val = "Tiền hoàn lại")
                }
              />
            </Table>
          </Card>
        </Form>
      </React.Fragment >
    );
  }
}

const stateToProps = (state) => {
  return {
    dataList: state.payoutTransaction.dataList,
    detailList: state.payoutTransaction.detailList,
    statusList: state.payoutTransaction.statusList,
  };
};

const dispatchToProps = (dispatch) =>
  bindActionCreators({
    init: payoutTransactionActions.init,
    detail: payoutTransactionActions.detail,
  }, dispatch
  );

export default connect(stateToProps, dispatchToProps)(PayoutTransactionDetail);
