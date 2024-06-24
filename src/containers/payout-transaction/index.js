import React, { Component } from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { Translate, withLocalize } from "react-localize-redux";
import {
  Table,
  PageHeader,
  Row,
  Col,
  Button,
  Form,
  Select,
  Card,
  Input,
  Modal,
  InputNumber,
  DatePicker,
  TimePicker,
  Space,
  Collapse,
  Tag,
  Tooltip,
  Statistic,
} from "antd";
import {
  globalProps,
  isAllow,
  PERMISSION,
  rules,
  RenderText,
} from "../../data";
import { payoutTransactionActions } from "../../actions";
import { LOCAL_PATH, } from "../../constants";
import moment from "moment";
import { SearchOutlined, EyeFilled } from "@ant-design/icons";
import validatorHelper from "../../helper/validator.helper";
import { NavLink } from 'react-router-dom';
const { Column } = Table;
const { Option } = Select;
const { TextArea } = Input;

const ManualRefundTypeList = [
  {
    "name": "Nạp điện thoại",
    "code": "TOPUP_PHONE",
  },
  {
    "name": "Nạp MoMo",
    "code": "MOMO",
  },
  {
    "name": "Chuyển khoản ngân hàng",
    "code": "TOPUP_BANK",
  },
  {
    "name": "Liên hệ khách hàng",
    "code": "SUPPORT",
  },
  {
    "name": "Khác",
    "code": "OTHER",
  },
  {
    "name": "Hủy",
    "code": "CANCEL",
  },
]
const TypeList = [
  {
    "name": "Nạp điện thoại",
    "code": "TOPUP_PHONE",
  },
  {
    "name": "Nạp MoMo",
    "code": "MOMO",
  },
  {
    "name": "Liên hệ khách hàng",
    "code": "SUPPORT",
  },
  {
    "name": "Tiền mặt",
    "code": "CASH",
  },

]
const ManualRefundMethodList = [
  {
    "name": "Tự động",
    "value": 0,
  },
  {
    "name": "Hoàn tay",
    "value": 1,
  },
]
class PayoutTransaction extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showAdvance: false,
      searchBody: {},

      isShowCharityModal: false,
      charityFundId: null,

      isShowTopupModal: false,
      itemCash: {},
      itemProvider: {},
      lstProcess: [],
      paginate: {
        pageIndex: 1,
        pageSize: 10,
      },
      exportReport: { loading: false },
      sort: {},
      isSearch: false,

      isShowTopupBankModal: false,
      isPolicyTopupBankModal: false,
      itemTopupBank: {},
    };
  }

  form = React.createRef();
  formCash = React.createRef();
  formTopupBank = React.createRef();

  toggleAdvanceSearch() {
    this.setState({
      showAdvance: !this.state.showAdvance,
    });
    this.onReset();
  }

  componentDidMount() {
    let {
      location: { search },
      init,
    } = this.props;
    if (search) {
      let query = new URLSearchParams(search);
      let transactioncode = query.get("transactionCode");
      if (transactioncode) {
        this.form.current.setFieldsValue({
          cashLeftOverCode: transactioncode,
        });
        this.setState({
          isSearch: true,
        });
      }
    }
    init().then((res) => {
      this.onSearch();
    });
  }

  componentDidUpdate(prevProps) {
    let { fromDate, toDate, fromTime, toTime } = this.props;
    if (fromDate && prevProps.fromDate !== fromDate) {
      this.form.current.setFieldsValue({
        fromDate: moment(fromDate),
      });
    }

    if (fromTime && prevProps.fromTime !== fromTime) {
      this.form.current.setFieldsValue({
        fromTime: moment(fromTime, "HH:mm:ss"),
      });
    }

    if (toDate && prevProps.toDate !== toDate) {
      this.form.current.setFieldsValue({
        toDate: moment(toDate),
      });
    }

    if (toTime && prevProps.toTime !== toTime) {
      this.form.current.setFieldsValue({
        toTime: moment(toTime, "HH:mm:ss"),
      });
    }

    if (
      prevProps.paging.pageSizeDefault !== this.props.paging.pageSizeDefault
    ) {
      this.changePaginate({
        pageSize: this.props.paging.pageSizeDefault,
        pageIndex: this.state.paginate.pageIndex,
      });
    }
  }

  onGetSearchBody() {
    let body = { ...this.form.current.getFieldsValue() };
    if (body.fromDate) {
      let dateFromFormat = body.fromDate.format("YYYY-MM-DD");
      let timeFromFormat = "";

      if (body.fromTime) {
        timeFromFormat = body.fromTime.format("HH:mm:ss");
      }
      if (timeFromFormat === "") {
        timeFromFormat = "00:00:00";
      }
      let date = moment(`${dateFromFormat} ${timeFromFormat}`);

      body.fromDate = date.format("YYYY-MM-DDTHH:mm:ss");
    }

    if (body.toDate) {
      let toDateFormat = body.toDate.format("YYYY-MM-DD");
      let timeToFormat = "";

      if (body.toTime) {
        timeToFormat = body.toTime.format("HH:mm:ss");
      }

      if (timeToFormat === "") {
        timeToFormat = "23:59:59";
      }

      let date = moment(`${toDateFormat} ${timeToFormat}`);
      body.toDate = date.format("YYYY-MM-DDTHH:mm:ss");
    }

    return body;
  }

  onSearch() {
    this.setState(
      {
        paginate: {
          ...this.state.paginate,
          pageIndex: 1,
        },
        sort: {},
      },
      () => {
        let { paginate } = this.state;
        let { search } = this.props;
        let searchBody = this.onGetSearchBody();
        let data = {
          ...searchBody,
          paging: {
            ...paginate,
            pageIndex: 1,
          },
        };
        search(data)
      }
    );
  }

  changePaginate = (paginate, filters, sorter) => {
    this.setState(
      {
        paginate: {
          pageSize: paginate.pageSize,
          pageIndex: paginate.current,
        },
        sort: {
          sortField: sorter.columnKey,
          sortType: sorter.order === "descend" ? "DESC" : "ASC",
        },
      },
      () => {
        let { paginate, sort } = this.state;
        let { search } = this.props;
        let searchBody = this.onGetSearchBody();
        let data = {
          ...searchBody,
          paging: {
            ...paginate,
          },
          sort: sort,
        };

        search(data);
      }
    );
  };

  onReset() {
    this.setState({
      searchBody: {}
    }, () => {
      this.form.current.resetFields();
    });
  }

  onExport() {
    let { sort } = this.state;
    let { exportExcel } = this.props;
    let data = {
      ...this.onGetSearchBody(),
      sort,
    };
    this.setState({ exportReport: { loading: true } });

    exportExcel(data)
      .then((res) => {
        this.setState({ exportReport: { loading: false, url: res.fileUrl } });

        this.downloadFile(res.fileUrl);
      })
      .catch(() => {
        this.setState({ exportReport: { loading: false } });
      });
  }

  downloadFile(url) {
    window.open(url);
  }

  showTopupModal(record) {
    this.setState({
      itemCash: record,
      isShowTopupModal: true,
    });
  }

  handleCancel = () => {
    // TH có tiền dư từ giao dịch trước
    let { itemCash } = this.state;
    let { translate } = this.props;
    if (itemCash && itemCash.isShowUnknow) {
      let modal = Modal.confirm({
        title: translate("TITLE_NOTIFICATION"),
        centered: true,
        content: translate("HAS_BALANCE_CASH_NOT_YET_HANLDE"),
        okText: translate("HANLDE_LATER"),
        cancelText: translate("CONTINUE_HANLDE"),
        onOk: () => {
          modal.destroy();
          this.confirmUnknow();
        },
        onCancel: () => {
          modal.destroy();
        },
      });
    } else {
      this.setState({
        isShowTopupModal: false,
      });
    }
  };

  onProcess() {
    let { translate } = this.props;
    let formCashCurrent = { ...this.formCash.current };
    formCashCurrent
      .validateFields()
      .then((cash) => {
        let modal = Modal.confirm({
          title: translate("TITLE_NOTIFICATION"),
          centered: true,
          content: (
            <div>
              <label>
                {translate("ARE_YOU_SURE_YOU_WANT_HANDLE")}
              </label>
            </div>
          ),
          okText: translate("CONFIRM"),
          cancelText: translate("CLOSE"),
          onOk: () => {
            modal.destroy();
            this.confirmProcess(cash);
          },
          onCancel: () => {
            modal.destroy();
          },
        });
      })
      .catch((errorInfo) => {
        console.log(errorInfo);
      });
  }

  confirmProcess(cash) {
    let { process } = this.props;
    let data = {
      id: cash.id,
      status: "SUCCESS",
      payoutTransactionCode: cash.payoutTransactionCode,
      billNumber: cash.billNumber,
      note: cash.transactionNote,
      manualRefundType: cash.type,
    };
    this.setState({
      isShowTopupModal: false,
    });
    process(data).finally(() => {
      this.onSearch();
    });
  }

  render() {
    let {
      machines,
      locations,
      payoutTransactionData,
      fromDate,
      toDate,
      fromTime,
      toTime,
      paging,
      translate,
      statusList
    } = this.props;
    let {
      searchBody,
      paginate,
      showAdvance,
      itemCash,
      isShowTopupModal,
      exportReport
    } = this.state;
    return (
      <React.Fragment>
        <PageHeader
          title={
            <Translate id="PAYOUT_TRANSACTION.INDEX" />
          }
          ghost={false}
        />
        <Card
          title={
            <strong>
              <Translate id="SEARCH" />
            </strong>
          }
          size="small"
          style={{ marginTop: 10 }}
        >
          <Form
            labelAlign="right"
            layout="horizontal"
            initialValues={searchBody}
            onFinish={(e) => this.onSearch()}
            {...globalProps.form}
            ref={this.form}
          >
            <Row {...globalProps.row}>
              {/* Máy */}
              <Col {...globalProps.col}>
                <Form.Item
                  {...globalProps.formItem}
                  label={<Translate id="MACHINE" />}
                  name="vendingIds"
                >
                  <Select
                    {...globalProps.selectSearch}
                    allowClear
                    mode="multiple"
                  >
                    {machines.map((k, i) => (
                      <Option
                        value={k.id}
                        key={i}
                      >{`${k.code} - ${k.name}`}</Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col {...globalProps.col}>
                <Input.Group size="large">
                  <Row gutter={8}>
                    <Col style={{ width: "50%" }}>
                      <Form.Item
                        {...globalProps.formItem}
                        label={<Translate id="DATE_FROM" />}
                        name="fromDate"
                        initialValue={moment(fromDate)}
                        rules={[rules.dateFromFilter]}
                      >
                        <DatePicker
                          format={translate("FORMAT_DATE")}
                          style={{ width: "100%" }}
                        />
                      </Form.Item>
                    </Col>
                    <Col style={{ width: "50%" }}>
                      <Form.Item
                        {...globalProps.formItem}
                        label="&nbsp;"
                        name="fromTime"
                        initialValue={moment(fromTime, "HH:mm:ss")}
                      >
                        <TimePicker style={{ width: "100%" }} />
                      </Form.Item>
                    </Col>
                  </Row>
                </Input.Group>
              </Col>

              <Col {...globalProps.col}>
                <Input.Group size="large">
                  <Row gutter={8}>
                    <Col style={{ width: "50%" }}>
                      <Form.Item
                        {...globalProps.formItem}
                        label={<Translate id="DATE_TO" />}
                        name="toDate"
                        style={{ width: "100%" }}
                        initialValue={moment(toDate)}
                        rules={[rules.dateToFilter]}
                      >
                        <DatePicker
                          format={translate("FORMAT_DATE")}
                          style={{ width: "100%" }}
                        />
                      </Form.Item>
                    </Col>
                    <Col style={{ width: "50%" }}>
                      <Form.Item
                        {...globalProps.formItem}
                        label="&nbsp;"
                        name="toTime"
                        initialValue={moment(toTime, "HH:mm:ss")}
                      >
                        <TimePicker style={{ width: "100%" }} />
                      </Form.Item>
                    </Col>
                  </Row>
                </Input.Group>
              </Col>
              <Col {...globalProps.col}>
                <Form.Item
                  {...globalProps.formItem}
                  label={<Translate id="CASH_LEFT_OVER_CODE" />}
                  name="cashPayoutCode"
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col {...globalProps.col}>
                <Form.Item
                  {...globalProps.formItem}
                  label={<Translate id="BILL_BILLNUMBER" />}
                  name="billNumber"
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col {...globalProps.col}>
                <Form.Item
                  {...globalProps.formItem}
                  label={<Translate id="MANUAL_REFUND_METHOD" />}
                  name="isManualRefund"
                >
                  <Select {...globalProps.selectSearch} allowClear>
                    {ManualRefundMethodList.map((k, i) =>
                      <Option key={i} value={k.value}>
                        {k.name}
                      </Option>
                    )}
                  </Select>
                </Form.Item>
              </Col>
              <Col {...globalProps.col}>
                <Form.Item
                  {...globalProps.formItem}
                  label={<Translate id="TRANSACTION_PAYOUT_TYPE" />}
                  name="type"
                >
                  <Select {...globalProps.selectSearch} allowClear>
                    {TypeList.map((k, i) =>
                      <Option key={i} value={k.code}>
                        {k.name}
                      </Option>
                    )}
                  </Select>
                </Form.Item>
              </Col>
              <Col {...globalProps.col}>
                <Form.Item
                  {...globalProps.formItem}
                  label={<Translate id="MANUAL_REFUND_TYPE" />}
                  name="manualRefundType"
                >
                  <Select {...globalProps.selectSearch} allowClear>
                    {ManualRefundTypeList.map((k, i) =>
                      <Option key={i} value={k.code}>
                        {k.name}
                      </Option>
                    )}
                  </Select>
                </Form.Item>
              </Col>
              <Col {...globalProps.col}>
                <Form.Item
                  {...globalProps.formItem}
                  label={<Translate id="PHONE_NUMBER" />}
                  name="phoneNumber"
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col {...globalProps.col}>
                <Form.Item {...globalProps.formItem} label={<Translate id="STATUS" />}
                  name="status"
                >
                  <Select {...globalProps.selectSearch} allowClear>
                    {statusList.map((k, i) =>
                      <Option key={i} value={k.code}>
                        <Translate id={`PAYOUT_STATUS.${k.code}`} />
                      </Option>
                    )}
                  </Select>
                </Form.Item>
              </Col>
              <Col {...globalProps.col}>
                <Form.Item
                  {...globalProps.formItem}
                  label={<Translate id="LOCATION" />}
                  name="locationIds"
                >
                  <Select
                    {...globalProps.selectSearch}
                    allowClear
                    mode="multiple"
                  >
                    {locations.map((k, i) => (
                      <Option
                        value={k.id}
                        key={i}
                      >{`${k.code} - ${k.name}`}</Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
            </Row>
            {showAdvance ? (
              <Row {...globalProps.row}>
                <Col {...globalProps.col}>
                  <Form.Item
                    {...globalProps.formItem}
                    label={<Translate id="LOCATION" />}
                    name="locationIds"
                  >
                    <Select
                      {...globalProps.selectSearch}
                      allowClear
                      mode="multiple"
                    >
                      {locations.map((k, i) => (
                        <Option
                          value={k.id}
                          key={i}
                        >{`${k.code} - ${k.name}`}</Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
            ) : (
              ""
            )}
            {isAllow(PERMISSION.PAYOUT_TRANSACTION.INDEX) && (
              <Space size="small">
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
                  onClick={() => this.onReset()}
                >
                  <span>
                    <Translate id="RESET" />
                  </span>
                </Button>
                <Button type="primary" size="large"
                  className="custom-btn-primary"
                  loading={exportReport.loading} onClick={() => this.onExport()}>
                  <Translate id="EXPORT_EXCEL" />
                </Button>
              </Space>
            )}
          </Form>
        </Card>

        <Collapse
          style={globalProps.panel}
          expandIconPosition="right"
          defaultActiveKey={[0]}
        >
          <Collapse.Panel
            header={
              <strong>
                <Translate id="SUMMARY" />
              </strong>
            }
          >
            <Tag style={{ padding: 10, margin: 8, background: "#FFF" }}>
              <Statistic
                title={
                  <Tooltip title={<Translate id={"TOTAL_TRANSACTION"} />}>
                    <strong>
                      <Translate id={"TOTAL_TRANSACTION"} />
                    </strong>
                  </Tooltip>
                }
                value={payoutTransactionData.totalItem}
                valueRender={(e) => (
                  <strong style={{ color: "#878BB6" }}>{e}</strong>
                )}
              />
            </Tag>
            <Tag style={{ padding: 10, margin: 8, background: "#FFF" }}>
              <Statistic
                title={
                  <Tooltip title={<Translate id={"TOTAL_AMOUNT"} />}>
                    <strong>
                      <Translate id={"TOTAL_AMOUNT"} />
                    </strong>
                  </Tooltip>
                }
                value={payoutTransactionData.totalAmount}
                valueRender={(e) => (
                  <strong style={{ color: "#4ACAB4" }}>{e}</strong>
                )}
              />
            </Tag>
            <Tag style={{ padding: 10, margin: 8, background: "#FFF" }}>
              <Statistic
                title={
                  <Tooltip title={"Tổng tiền chưa thối"}>
                    <strong>
                      Tổng tiền chưa thối
                    </strong>
                  </Tooltip>
                }
                value={payoutTransactionData.totalSumNotYetReceived}
                valueRender={(e) => (
                  <strong style={{ color: "#FF6666" }}>{e}</strong>
                )}
              />
            </Tag>
          </Collapse.Panel>
        </Collapse>

        <div className="card-container">
          {isAllow(PERMISSION.PAYOUT_TRANSACTION.INDEX) && (
            <Table
              {...globalProps.table}
              dataSource={
                payoutTransactionData.payoutTransactionList.map((k, i) => {
                  k.key = i;
                  k.index = (paginate.pageIndex - 1) * paginate.pageSize + i + 1;
                  return k;
                })
              }
              onChange={this.changePaginate}
              pagination={{
                pageSize: paginate.pageSize,
                total: payoutTransactionData.totalItem,
                current: paginate.pageIndex,
                showSizeChanger: true,
                pageSizeOptions: paging.pageSizes,
                locale: { items_per_page: "" },
                showTotal: (sum) => (
                  <div>
                    {sum} <Translate id="RESULT" />
                  </div>
                ),
              }}
            >
              <Column
                title={<Translate id="ACTION" />}
                key="action"
                fixed="center"
                render={(text, record) => (
                  <Row gutter={8} style={{ flexWrap: "nowrap" }}>
                    <Space>
                      <Col flex="32px">
                        <NavLink
                          to={LOCAL_PATH.TRANSACTION.PAYOUT_TRANSACTION.DETAIL.replace(
                            ":id",
                            record.id
                          )}
                        >
                          <Button
                            type="primary"
                            icon={<EyeFilled />}
                            shape="circle"
                          />
                        </NavLink>
                      </Col>
                      {isAllow(PERMISSION.PAYOUT_TRANSACTION.INDEX) && (
                        <Col flex="32px">
                          <Button
                            type="primary"
                            className="custom-btn-primary"
                            onClick={() => this.showTopupModal(record)}
                          >
                            <Translate id="PROCESS" />
                          </Button>
                        </Col>)}
                    </Space>
                  </Row>
                )}
              />
              <Column
                width={60}
                title={<Translate id="INDEX" />}
                dataIndex="index"
              />
              <Column
                {...globalProps.tableRow}
                key="payoutTransactionCode"
                title={<Translate id="PAYOUT_TRANSACTION_CODE" />}
                dataIndex="payoutTransactionCode"
              />
              <Column
                {...globalProps.tableRow}
                key="billNumber"
                title={<Translate id="BILL_BILLNUMBER" />}
                dataIndex="billNumber"
              //render={(val, record) => <NavLink to={LOCAL_PATH.PRODUCT.PRODUCT_MANAGEMENT.DETAIL.replace(":id", record.id)}>{val}</NavLink>}
              />

              <Column
                className="column-default"
                key="status"
                title={<Translate id="STATUS" />}
                dataIndex="status"
                render={(val) =>
                  val ? <Translate id={`PAYOUT_TRANSACTION_STATUS.${val}`} /> : ""
                }
              />
              <Column
                className="column-default"
                key="type"
                title={<Translate id="PAYOUT_METHOD" />}
                dataIndex="type"
                render={(val) =>
                  val ? <Translate id={`PAYOUT_METHOD_TRANSACTION.${val}`} /> : ""
                }
              />
              <Column
                className="column-default"
                key="type"
                title={"Hình thức hoàn tay"}
                dataIndex="manualRefundType"
                render={(val) =>
                  val ? <Translate id={`PAYOUT_METHOD_TRANSACTION.${val}`} /> : ""
                }
              />
              <Column
                align="right"
                className="column-default"
                key="amount"
                title={"Số tiền cần thối"}
                dataIndex="amountNotYet"
                render={(val) => (
                  <RenderText value={val} type="NUMBER_NO_DOT" />
                )}
              />
              <Column
                align="right"
                className="column-default"
                key="amount"
                title={<Translate id="AMOUNT" />}
                dataIndex="amount"
                render={(val) => (
                  <RenderText value={val} type="NUMBER_NO_DOT" />
                )}
              />
              <Column
                align="right"
                className="column-default"
                key="valueCash"
                title={<Translate id="VALUE_CASH" />}
                dataIndex="valueCash"
                render={(val) => (
                  <RenderText value={val} type="NUMBER_NO_DOT" />
                )}
              />
              <Column
                align="right"
                className="column-default"
                key="totalSheet"
                title={<Translate id="TOTAL_SHEET_PAYOUT" />}
                dataIndex="totalSheet"
              />
              <Column
                {...globalProps.tableRow}
                key="phoneNumber"
                title={<Translate id="PHONE_NUMBER" />}
                dataIndex="phoneNumber"
              />
              <Column
                className="column-default"
                key="machineCode"
                title={<Translate id="MACHINE_CODE" />}
                dataIndex="machineCode"
              />
              <Column {...globalProps.tableRow} key="transactionNote" title={<Translate id="PROCESS_NOTE" />} dataIndex="transactionNote" />
              <Column {...globalProps.tableRow} key="note" title={<Translate id="PAYOUT_NOTE" />} dataIndex="note" />
              <Column
                {...globalProps.tableRow}
                key="locationName"
                title={<Translate id="LOCATION" />}
                dataIndex="locationName"
              />
              <Column
                {...globalProps.tableRow}
                key="updateTime"
                title={<Translate id="TIME_REFUND_HANDLE" />}
                dataIndex="updateTime"
              />
              <Column
                {...globalProps.tableRow}
                key="createdTime"
                title={<Translate id="DATE_CREATED" />}
                dataIndex="createdTime"
              />
            </Table>
          )}
        </div>

        {/* Topup  */}
        <Modal
          title={
            <strong>
              <Translate id="HANDLE_PAYOUT" />
            </strong>
          }
          textAlign="center"
          centered={true}
          visible={isShowTopupModal}
          onCancel={this.handleCancel}
          footer={null}
          maskClosable={false}
          closable
          destroyOnClose
          width={800}
        >
          <Form
            id="topup"
            name="topup"
            labelAlign="left"
            layout="horizontal"
            scrollToFirstError={true}
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 18 }}
            initialValues={itemCash}
            ref={this.formCash}
            onF
            onFinish={(e) => this.onProcess(e)}
          >
            <Form.Item
              name="id"
              hidden
            >
              <Input disabled hidden />
            </Form.Item>
            <Form.Item
              label={<Translate id="BILL_BILLNUMBER" />}
              name="billNumber"
            >
              <Input disabled />
            </Form.Item>
            <Form.Item
              label={<Translate id="PAYOUT_TRANSACTION_CODE" />}
              name="payoutTransactionCode"
            >
              <Input disabled />
            </Form.Item>
            {/* <Form.Item label={<Translate id="NAME" />} name="name">
              <Input />
            </Form.Item> */}
            <Form.Item
              label={<Translate id="PHONE_NUMBER" />}
              name="phoneNumber"
              rules={[
                {
                  required: true,
                  message: <Translate id="REQUIRED_INFORMATION" />,
                },
                {
                  validator: (rules, value) => {
                    if (validatorHelper.isPhoneNumber(value)) {
                      return Promise.resolve();
                    } else {
                      if (this.formCash.current.getFieldsValue().type === "CANCEL") {
                        return Promise.resolve();
                      }
                      return Promise.reject(<Translate id="INVALID_PHONE" />);
                    }
                  },
                },
              ]}
            >
              <Input type="tel" disabled={itemCash.status === "SUCCESS"} />
            </Form.Item>
            {(itemCash.status === "SUCCESS" && itemCash.isManualRefund) ?
              <Form.Item
                label={<Translate id="MANUAL_REFUND_TYPE" />}
                name="manualRefundType"
              >
                <Select size="large" disabled >
                  {ManualRefundTypeList.map((k, i) => (
                    <Option value={k.code} key={i}>
                      {k.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
              :
              <Form.Item
                label={<Translate id="MANUAL_REFUND_TYPE" />}
                name="type"
                rules={[
                  {
                    required: true,
                    message: <Translate id="REQUIRED_INFORMATION" />,
                  },
                  {
                    validator: (rules, value) => {
                      if (value !== "SUPPORT") {
                        return Promise.resolve();
                      }
                      return Promise.reject(<Translate id="INVALID_VALUE" />);
                    },
                  },
                ]}
              >
                <Select size="large" disabled={itemCash.status === "SUCCESS"}>
                  {ManualRefundTypeList.map((k, i) => (
                    <Option value={k.code} key={i}>
                      {k.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            }

            <Form.Item label={<Translate id="REFUND_AMOUNT" />} name="amountNotYet">
              <InputNumber
                {...globalProps.inputNumber}
                disabled={true}
                style={{ width: "100%" }}
              />
            </Form.Item>
            <Form.Item
              label={<Translate id="NOTE" />}
              name="transactionNote"
              rules={[
                {
                  required: true,
                  message: <Translate id="REQUIRED_INFORMATION" />,
                },
              ]}
            >
              <TextArea
                disabled={itemCash.status === "SUCCESS"}
                autoSize={{ minRows: 3, maxRows: 5 }}
                style={{ width: "100%" }}
              />
            </Form.Item>
            <div style={{ textAlign: "center" }}>
              <Space size="small" className="main-btn-topup">
                <Button
                  type="primary"
                  htmlType="submit"
                  className="custom-btn-primary"
                  disabled={itemCash.status === "SUCCESS"}
                >
                  <Translate id="PROCESS" />
                </Button>
                <Button onClick={this.handleCancel}>
                  <Translate id="CLOSE" />
                </Button>
              </Space>
            </div>
          </Form>
        </Modal>


      </React.Fragment>
    );
  }
}

const stateToProps = (state) => {
  return {
    machines: state.payoutTransaction.machines,
    statusList: state.payoutTransaction.statusList,
    locations: state.payoutTransaction.locations,
    fromDate: state.payoutTransaction.fromDate,
    toDate: state.payoutTransaction.toDate,
    fromTime: state.payoutTransaction.fromTime,
    toTime: state.payoutTransaction.toTime,
    paging: state.payoutTransaction.paging,
    payoutTransactionData: state.payoutTransaction.payoutTransactionData,
  };
};

const dispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      init: payoutTransactionActions.init,
      search: payoutTransactionActions.search,
      process: payoutTransactionActions.process,
      exportExcel: payoutTransactionActions.exportExcel,
    },
    dispatch
  );

export default connect(
  stateToProps,
  dispatchToProps
)(withLocalize(PayoutTransaction));
