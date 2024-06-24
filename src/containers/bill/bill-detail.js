import { SearchOutlined } from '@ant-design/icons';
import { Button, Card, Col, Collapse, DatePicker, Form, Input, PageHeader, Row, Select, Statistic, Switch, Table, Tag, TimePicker, Tooltip } from 'antd';
import moment from 'moment';
import React, { Component } from "react";
import { Translate, withLocalize } from "react-localize-redux";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { billActions } from "../../actions";
import { globalProps, RenderText, rules } from "../../data";
const { Column } = Table;
const { Option } = Select;

const defaultTab = "1";

class BillDetail extends Component {
  state = {
    showAdvance: false,
    searchBody: {},
    tab: defaultTab,
    paginate: {
      pageIndex: 1,
      pageSize: 10,
    },
    exportBill: { loading: false },
    exportBillDetail: { loading: false },
    sort: {},
    timeFromReadonly: false,
    timeToReadonly: false,
    exportReport: false
  }
  form = React.createRef()

  componentDidMount() {
    this.props.init();
    //this.onSearch({});
  }

  componentDidUpdate(prevProps) {
    if (prevProps.paging.pageSizeDefault !== this.props.paging.pageSizeDefault) {
      this.changePaginate({ pageSize: this.props.paging.pageSizeDefault, pageIndex: this.state.paginate.pageIndex })
    }
  }

  toggleAdvanceSearch() {
    this.setState({
      showAdvance: !this.state.showAdvance,
      timeFromReadonly: false,
      timeToReadonly: false
    });
  }

  onReset() {
    this.setState({
      searchBody: {}
    });
    this.form.current.resetFields();
  }

  onGetSearchBody() {
    let body = { ...this.form.current.getFieldsValue() };
    if (body.dateFrom) {
      let dateFromFormat = body.dateFrom.format('YYYY-MM-DD');

      let timeFromFormat = '';

      if (body.timeFrom) {
        timeFromFormat = body.timeFrom.format('HH:mm:ss');
      }
      if (timeFromFormat === '') {
        timeFromFormat = '00:00:00';
      }
      let date = moment(`${dateFromFormat} ${timeFromFormat}`);

      body.dateFrom = date.format("YYYY-MM-DDTHH:mm:ss");
    }

    if (body.dateTo) {
      let toDateFormat = body.dateTo.format('YYYY-MM-DD');

      let timeToFormat = '';

      if (body.timeTo) {
        timeToFormat = body.timeTo.format('HH:mm:ss');
      }

      if (timeToFormat === '') {
        timeToFormat = '23:59:59';
      }

      let date = moment(`${toDateFormat} ${timeToFormat}`);

      body.dateTo = date.format("YYYY-MM-DDTHH:mm:ss");
    }

    return body;
  }

  onSearch() {
    this.setState({
      paginate: {
        ...this.state.paginate,
        pageIndex: 1
      },
    }, () => {
      let { paginate, sort } = this.state;
      let { searchBillDetail } = this.props;
      let searchBody = this.onGetSearchBody();
      let data = {
        ...searchBody,
        paging: {
          ...paginate,
          pageIndex: 1
        },
        sort
      }
      searchBillDetail({ data });
    })
  }

  changePaginate = (paging, filters, sorter) => {
    this.setState({
      paginate: {
        pageSize: paging.pageSize,
        pageIndex: paging.current
      },
      sort: {
        sortField: sorter.columnKey,
        sortType: !!sorter.order ? sorter.order === 'descend' ? 'DESC' : 'ASC' : undefined
      }
    }, () => {
      let { paginate, sort } = this.state;
      let { searchBillDetail } = this.props;
      let searchBody = this.onGetSearchBody();
      searchBillDetail({
        data: {
          ...searchBody,
          paging: paginate,
          sort: sort
        },
      });
    })
  }

  onExport() {
    let { sort } = this.state;
    let { exportExcelBillDetail } = this.props;
    let data = {
      ...this.onGetSearchBody(),
      sort
    };
    this.setState({ exportReport: { loading: true } });

    exportExcelBillDetail({ data })
      .then(res => {
        this.setState({ exportReport: { loading: false, url: res.fileUrl } });

        this.downloadFile(res.fileUrl);
      }).catch(() => {
        this.setState({ exportReport: { loading: false } });
      });
  }

  downloadFile(url) {
    window.open(url);
  }


  showTopupMo

  render() {
    let {
      billDetailList, products, machines, paymentMethods, paging, translate, addressTypes, machineModels, locations, dropStatusList, refundStatusList
    } = this.props;
    let { paginate, showAdvance, searchBody, timeFromReadonly, timeToReadonly, exportReport } = this.state;

    return (
      <React.Fragment>
        <PageHeader
          title={<Translate id="BILL_DETAIL" />}
          ghost={false}
        />

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
            <Row {...globalProps.row}>
              <Col {...globalProps.col}>

                <Form.Item {...globalProps.formItem}
                  label={<Translate id="MACHINE" />}
                  name="machineIds"
                >
                  <Select {...globalProps.selectSearch} allowClear mode="multiple">
                    {machines.map((k, i) =>
                      <Option value={k.id} key={i}>{`${k.code} - ${k.name}`}</Option>
                    )}
                  </Select>
                </Form.Item>
              </Col>

              <Col {...globalProps.col}>
                <Input.Group size="large">
                  <Row gutter={8}>
                    <Col style={{ width: '50%' }}>
                      <Form.Item {...globalProps.formItem}
                        label={<Translate id="DATE_FROM" />}
                        name="dateFrom"
                        initialValue={moment()}
                        rules={[rules.dateFromFilter]}
                      >
                        <DatePicker
                          format={translate("FORMAT_DATE")}
                          style={{ width: '100%' }}
                        />
                      </Form.Item>
                    </Col>
                    <Col style={{ width: '50%' }}>
                      <Form.Item {...globalProps.formItem}
                        label="&nbsp;"
                        name="timeFrom"
                      >
                        <TimePicker
                          style={{ width: '100%' }}
                          disabled={timeFromReadonly}
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                </Input.Group>
              </Col>
              <Col {...globalProps.col}>
                <Input.Group size="large">
                  <Row gutter={8}>
                    <Col style={{ width: '50%' }}>
                      <Form.Item {...globalProps.formItem}
                        label={<Translate id="DATE_TO" />}
                        name="dateTo"
                        style={{ width: '100%' }}
                        initialValue={moment()}
                        rules={[rules.dateToFilter]}
                      >
                        <DatePicker
                          format={translate("FORMAT_DATE")}
                          style={{ width: '100%' }}
                        />
                      </Form.Item>
                    </Col>
                    <Col style={{ width: '50%' }}>
                      <Form.Item {...globalProps.formItem}
                        label="&nbsp;"
                        name="timeTo"
                      >
                        <TimePicker
                          disabled={timeToReadonly}
                          style={{ width: '100%' }}
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                </Input.Group>
              </Col>
            </Row>
            {showAdvance ?
              <Row {...globalProps.row}>
                <Col {...globalProps.col}>
                  <Form.Item {...globalProps.formItem}
                    label={<Translate id="LOCATION_TYPE" />}
                    name="addressTypes"
                  >
                    <Select {...globalProps.selectSearch} allowClear mode="multiple">
                      {addressTypes.map((k, i) =>
                        <Option value={k.code} key={i}>{k.name}
                          {/* {(`ADDRESS_TYPE_${(k.code || "").toUpperCase()}`)} */}
                        </Option>
                      )}
                    </Select>
                  </Form.Item>
                </Col>
                <Col {...globalProps.col}>
                  <Form.Item {...globalProps.formItem}
                    label={<Translate id="MACHINE_MODEL" />}
                    name="machineModelIds"
                  >
                    <Select {...globalProps.selectSearch} allowClear mode="multiple">
                      {machineModels.map((k, i) =>
                        <Option value={k.id} key={i}>{k.name}
                          {/* {translate(`MACHINE_MODEL_${(k.code || "").toUpperCase()}`)} */}
                        </Option>
                      )}
                    </Select>
                  </Form.Item>
                </Col>
                <Col {...globalProps.col}>
                  <Form.Item {...globalProps.formItem}
                    label={<Translate id="PRODUCT" />}
                    name="productIds"
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
                    label={<Translate id="LOCATION" />}
                    name="locationIds"
                  >
                    <Select {...globalProps.selectSearch} allowClear mode="multiple">
                      {locations.map((k, i) =>
                        <Option value={k.id} key={i}>{`${k.code} - ${k.name}`}</Option>
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
                    label={<Translate id="TRADING_ADDRESS" />}
                    name="address"
                  >
                    <Input />
                  </Form.Item>
                </Col>
                <Col {...globalProps.col}>
                  <Form.Item {...globalProps.formItem}
                    label={<Translate id="PAYMENT_METHOD" />}
                    name="paymentMethodIds"
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
                    label={<Translate id="BILL_DETAIL_DROPSTATUS" />}
                    name="dropStatus"
                  >
                    <Select {...globalProps.selectSearch} allowClear>
                      {dropStatusList.map((k, i) =>
                        <Option value={k.id} key={i}>
                          {translate(`${k.code}`)}
                        </Option>
                      )}
                    </Select>
                  </Form.Item>
                </Col>
                <Col {...globalProps.col}>
                  <Form.Item {...globalProps.formItem}
                    label={<Translate id="BILL_DETAIL_REFUNDSTATUS" />}
                    name="refundStatus"
                  >
                    <Select {...globalProps.selectSearch} allowClear>
                      {refundStatusList.map((k, i) =>
                        <Option value={k.id} key={i}>
                          {translate(`${k.code}`)}
                        </Option>
                      )}
                    </Select>
                  </Form.Item>
                </Col>
                <Col {...globalProps.col}>
                  <Form.Item {...globalProps.formItem}
                    label={<Translate id="BILL_DETAIL_POSITION" />}
                    name="position"
                  >
                    <Input />
                  </Form.Item>
                </Col>
              </Row>
              :
              ""
            }
            <Row {...globalProps.row}>
              <Col {...globalProps.col3}>
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
                <Button type="primary" size="large"
                  className="custom-btn-primary"
                  loading={exportReport.loading} onClick={() => this.onExport()}>
                  <Translate id="EXPORT_EXCEL" />
                </Button>
              </Col>
            </Row>
          </Form >
        </Card >

        {/* summary */}
        <Collapse
          style={globalProps.panel}
          expandIconPosition="right"
          defaultActiveKey={[0]}
        >
          <Collapse.Panel header={<strong><Translate id="SUMMARY" /></strong>} >
            <Tag style={{ padding: 10, margin: 8, background: "#FFF" }}>
              <Statistic
                title={
                  <Tooltip title={<Translate id={"SUMMARY_AMOUNT"} />}>
                    <strong><Translate id={"SUMMARY_AMOUNT"} /></strong>
                  </Tooltip>
                }
                value={billDetailList.summary.amount}
                valueRender={e => <strong style={{ color: "#878BB6" }}>{e}</strong>}
              />
            </Tag>
            <Tag style={{ padding: 10, margin: 8, background: "#FFF" }}>
              <Statistic
                title={
                  <Tooltip title={<Translate id={"SUMMARY_PROMOAMOUNT"} />}>
                    <strong><Translate id={"SUMMARY_PROMOAMOUNT"} /></strong>
                  </Tooltip>
                }
                value={billDetailList.summary.promoAmount}
                valueRender={e => <strong style={{ color: "#FFEA88" }}>{e}</strong>}
              />
            </Tag>
            <Tag style={{ padding: 10, margin: 8, background: "#FFF" }}>
              <Statistic
                title={
                  <Tooltip title={<Translate id={"SUMMARY_VOUCHERAMOUNT"} />}>
                    <strong><Translate id={"SUMMARY_VOUCHERAMOUNT"} /></strong>
                  </Tooltip>
                }
                value={billDetailList.summary.voucherAmount}
                valueRender={e => <strong style={{ color: "#FF8153" }}>{e}</strong>}
              />
            </Tag>
            <Tag style={{ padding: 10, margin: 8, background: "#FFF" }}>
              <Statistic
                title={
                  <Tooltip title={<Translate id={"SUMMARY_TEMPORARYREVENUE"} />}>
                    <strong><Translate id={"SUMMARY_TEMPORARYREVENUE"} /></strong>
                  </Tooltip>
                }
                value={billDetailList.summary.temporaryRevenue}
                valueRender={e => <strong style={{ color: "#4ACAB4" }}>{e}</strong>}
              />
            </Tag>
            <Tag style={{ padding: 10, margin: 8, background: "#FFF" }}>
              <Statistic
                title={
                  <Tooltip title={<Translate id={"SUMMARY_REFUNDAMOUNT"} />}>
                    <strong><Translate id={"SUMMARY_REFUNDAMOUNT"} /></strong>
                  </Tooltip>
                }
                value={billDetailList.summary.refundAmount}
                valueRender={e => <strong style={{ color: "#c0504d" }}>{e}</strong>}
              />
            </Tag>
            <Tag style={{ padding: 10, margin: 8, background: "#FFF" }}>
              <Statistic
                title={
                  <Tooltip title={<Translate id={"SUMMARY_ACTUALAMOUNT"} />}>
                    <strong><Translate id={"SUMMARY_ACTUALAMOUNT"} /></strong>
                  </Tooltip>
                }
                value={billDetailList.summary.actualAmount}
                valueRender={e => <strong style={{ color: "#8064a2" }}>{e}</strong>}
              />
            </Tag>
            <Tag style={{ padding: 10, margin: 8, background: "#FFF" }}>
              <Statistic
                title={
                  <Tooltip title={<Translate id={"SUMMARY_QUANTITY"} />}>
                    <strong><Translate id={"SUMMARY_QUANTITY"} /></strong>
                  </Tooltip>
                }
                value={billDetailList.summary.quantity}
                valueRender={e => <strong style={{ color: "#2ab881" }}>{e}</strong>}
              />
            </Tag>
            <Tag style={{ padding: 10, margin: 8, background: "#FFF" }}>
              <Statistic
                title={
                  <Tooltip title={<Translate id={"SUMMARY_PROMOQUANTITY"} />}>
                    <strong><Translate id={"SUMMARY_PROMOQUANTITY"} /></strong>
                  </Tooltip>
                }
                value={billDetailList.summary.promoQuantity}
                valueRender={e => <strong style={{ color: "#4f81bd" }}>{e}</strong>}
              />
            </Tag>
            <Tag style={{ padding: 10, margin: 8, background: "#FFF" }}>
              <Statistic
                title={
                  <Tooltip title={<Translate id={"SUMMARY_REFUNDQUANTITY"} />}>
                    <strong><Translate id={"SUMMARY_REFUNDQUANTITY"} /></strong>
                  </Tooltip>
                }
                value={billDetailList.summary.refundQuantity}
                valueRender={e => <strong style={{ color: "#2c4d75" }}>{e}</strong>}
              />
            </Tag>
          </Collapse.Panel>
        </Collapse>

        <div className="card-container">
          <Table
            {...globalProps.table}
            dataSource={billDetailList.body.map((k, i) => ({ ...k, key: i, index: (paginate.pageIndex - 1) * paginate.pageSize + i + 1 }))}
            onChange={this.changePaginate}
            pagination={
              {
                pageSize: paginate.pageSize,
                total: billDetailList.totalItem,
                current: paginate.pageIndex,
                showSizeChanger: true,
                pageSizeOptions: paging.pageSizes,
                locale: { items_per_page: "" },
                showTotal: sum => <div>{sum} <Translate id="RESULT" /></div>
              }
            }
          >
            <Column {...globalProps.tableRow} title={<Translate id="INDEX" />} dataIndex="index" width={60} />
            <Column {...globalProps.tableRow} key="vendingName" title={<Translate id="MACHINE_NAME" />} dataIndex="vendingName" />
            <Column {...globalProps.tableRow} key="locationArea" title={<Translate id="BILL_LOCATIONAREA" />} dataIndex="locationArea" />
            <Column {...globalProps.tableRow} key="paymentTime" title={<Translate id="BILL_DETAIL_PAYMENTTIME" />} dataIndex="paymentTime" render={val => <RenderText value={val} type="DATETIME" />} />
            <Column {...globalProps.tableRow} key="productCode" title={<Translate id="BILL_DETAIL_PRODUCTCODE" />} dataIndex="productCode" />
            <Column {...globalProps.tableRow} key="productName" title={<Translate id="BILL_DETAIL_PRODUCTNAME" />} dataIndex="productName" />
            <Column {...globalProps.tableRow} key="unitName" title={<Translate id="BILL_DETAIL_UNITNAME" />} dataIndex="unitName" />
            <Column align='right' {...globalProps.tableRow} key="quantity" title={<Translate id="BILL_DETAIL_QUANTITY" />} dataIndex="quantity" />
            <Column align='right' {...globalProps.tableRow} key="amount" title={<Translate id="BILL_DETAIL_AMOUNT" />} dataIndex="amount" render={val => <RenderText value={val} type="NUMBER_NO_DOT" />} />
            <Column align='right' {...globalProps.tableRow} key="promoAmount" title={<Translate id="BILL_DETAIL_PROMOAMOUNT" />} dataIndex="promoAmount" render={val => <RenderText value={val} type="NUMBER_NO_DOT" />} />
            <Column align='right' {...globalProps.tableRow} key="voucherAmount" title={<Translate id="BILL_DETAIL_VOUCHERAMOUNT" />} dataIndex="voucherAmount" render={val => <RenderText value={val} type="NUMBER_NO_DOT" />} />
            <Column {...globalProps.tableRow} key="voucherCode" title={<Translate id="BILL_DETAIL_VOUCHERCODE" />} dataIndex="voucherCode" />
            <Column align='right' {...globalProps.tableRow} key="temporaryRevenue" title={<Translate id="BILL_DETAIL_TEMPORARYREVENUE" />} dataIndex="temporaryRevenue" render={val => <RenderText value={val} type="NUMBER_NO_DOT" />} />
            <Column align='right' {...globalProps.tableRow} key="refundAmount" title={<Translate id="BILL_DETAIL_REFUNDAMOUNT" />} dataIndex="refundAmount" render={val => <RenderText value={val} type="NUMBER_NO_DOT" />} />
            <Column align='right' {...globalProps.tableRow} key="finalRevenue" title={<Translate id="BILL_DETAIL_FINALREVENUE" />} dataIndex="finalRevenue" render={val => <RenderText value={val} type="NUMBER_NO_DOT" />} />
            <Column {...globalProps.tableRow} key="dropStatus" title={<Translate id="BILL_DETAIL_DROPSTATUS" />} dataIndex="dropStatus" render={val => <Translate id={val} />} />
            <Column {...globalProps.tableRow} key="refundStatus" title={<Translate id="BILL_DETAIL_REFUNDSTATUS" />} dataIndex="refundStatus" render={val => <Translate id={val} />} />
            <Column {...globalProps.tableRow} key="expiredDate" title={<Translate id="BILL_DETAIL_EXPIREDDATE" />} dataIndex="expiredDate" render={val => <RenderText value={val} type="DATETIME" />} />
            <Column {...globalProps.tableRow} key="buyType" title={<Translate id="BILL_DETAIL_BUYTYPE" />} dataIndex="buyType" render={val => <Translate id={val} />} />
            <Column {...globalProps.tableRow} key="paymentType" title={<Translate id="BILL_DETAIL_PAYMENTTYPE" />} dataIndex="paymentType" />
            <Column {...globalProps.tableRow} key="billNumber" title={<Translate id="BILL_DETAIL_BILLNUMBER" />} dataIndex="billNumber" />
            <Column {...globalProps.tableRow} key="status" title={<Translate id="BILL_DETAIL_STATUS" />} dataIndex="status" render={val => <Translate id={`${val}`} />} />
            <Column {...globalProps.tableRow} key="position" title={<Translate id="BILL_DETAIL_POSITION" />} dataIndex="position" />
            <Column {...globalProps.tableRow} key="locationName" title={<Translate id="BILL_LOCATIONNAME" />} dataIndex="locationName" />
            <Column {...globalProps.tableRow} key="locationAddress" title={<Translate id="BILL_LOCATIONADDRESS" />} dataIndex="locationAddress" />
          </Table>
        </div>
      </React.Fragment >
    )
  }
}

const stateToProps = (state) => {
  return {
    billDetailList: state.bill.billDetailList,
    products: state.bill.products,
    machines: state.bill.machines,
    paymentMethods: state.bill.paymentMethods,
    paging: state.bill.paging,
    addressTypes: state.bill.addressTypes,
    machineModels: state.bill.machineModels,
    locations: state.bill.locations,
    dropStatusList: state.bill.dropStatusList,
    refundStatusList: state.bill.refundStatusList
  };
}

const dispatchToProps = (dispatch) => bindActionCreators({
  init: billActions.init,
  searchBillDetail: billActions.searchBillDetail,
  exportExcelBillDetail: billActions.exportExcelBillDetail
}, dispatch);

export default connect(stateToProps, dispatchToProps)(withLocalize(BillDetail));