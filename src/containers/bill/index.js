import { DownloadOutlined, SearchOutlined } from '@ant-design/icons';
import {
  Button, Card, Col, Collapse, DatePicker, Form, Input, PageHeader,
  Row, Select, Statistic, Table, Tabs, Tag, TimePicker, Tooltip, Modal, Space
} from 'antd';
import moment from 'moment';
import React, { Component, Fragment } from "react";
import { Translate, withLocalize } from "react-localize-redux";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { billActions, showErrorMessage } from "../../actions";
import { globalProps, isAllow, PERMISSION, RenderText, rules, format } from "../../data";
import { history } from "../../store";
const { Column } = Table;
const { Option } = Select;

const colors = [
  "#878BB6", "#FFEA88", "#FF8153", "#4ACAB4", "#c0504d", "#8064a2", "#f2ab71", "#2ab881", "#4f81bd", "#2c4d75"
]

const defaultTab = "1";

class PaymentOrder extends Component {
  state = {
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
    orderDetailInvoice: {},
    isShowVATModal: false,
    isShowInvoiceModal: false
  }
  form = React.createRef()
  formModal = React.createRef()
  componentDidMount() {
    this.props.init();

    let search = this.props.location.search;
    if (search) {
      let query = new URLSearchParams(search);
      let machineIdQuery = query.get("machineIds");
      let fromDateQuery = query.get("fromDate");
      let toDateQuery = query.get("toDate");
      let paymentMethodId = query.get("paymentMethodId");
      if (machineIdQuery) {
        this.form.current.setFieldsValue({
          machineIds: [Number(machineIdQuery)],
        });
      }

      if (fromDateQuery) {
        this.form.current.setFieldsValue({
          dateFrom: moment(fromDateQuery),
          timeFrom: moment(fromDateQuery)
        });
      }

      if (toDateQuery) {
        this.form.current.setFieldsValue({
          dateTo: moment(toDateQuery),
          timeTo: moment(toDateQuery)
        });
      }

      if (paymentMethodId) {
        this.form.current.setFieldsValue({
          paymentMethodIds: [Number(paymentMethodId)]
        });
      }

      query.delete('machineIds');
      query.delete('fromDate');
      query.delete('toDate');
      query.delete('paymentMethodId');
      history.replace({
        search: query.toString(),
      })
    }

    // let { tab } = this.state;
    // (isAllow(PERMISSION.BILL.LIST.INDEX) && tab === "1") || (isAllow(PERMISSION.BILL.DETAIL_LIST.INDEX) && tab === "2")
  }

  componentDidUpdate(prevProps) {
    if (prevProps.paging.pageSizeDefault !== this.props.paging.pageSizeDefault) {
      this.changePaginate({ pageSize: this.props.paging.pageSizeDefault, pageIndex: this.state.paginate.pageIndex })
    }
  }

  onReset() {
    this.setState({
      searchBody: {}
    });
    this.form.current.resetFields();
  }

  onGetSearchBody() {
    let body = { ...this.form.current.getFieldsValue() };

    // if (body.date) {
    //   body.dateFrom = body.date[0].startOf("minute").format("YYYY-MM-DDTHH:mm:ss");
    //   body.dateTo = body.date[1].startOf("minute").format("YYYY-MM-DDTHH:mm:ss");
    //   delete body.date;
    // }

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
      let { paginate, tab, sort } = this.state;
      let { search, searchDetail } = this.props;
      let searchBody = this.onGetSearchBody();
      let data = {
        ...searchBody,
        paging: {
          ...paginate,
          pageIndex: 1
        },
        sort
      }
      switch (tab) {
        case "1":
          search({ data });
          break;
        case "2":
          searchDetail({ data });
          break;
        default: return;
      }
    })
  }

  onExport() {
    let { tab, sort } = this.state;
    let { exportExcel, exportExcelDetail } = this.props;
    let data = {
      ...this.onGetSearchBody(),
      sort
    };
    switch (tab) {
      case "1":
        this.setState({ exportBill: { loading: true } });
        exportExcel({ data })
          .then(res => {
            this.setState({ exportBill: { loading: false, url: res.fileUrl } });

            this.downloadFile(res.fileUrl);
          }).catch(e => {
            this.setState({ exportBill: { loading: false } });
          });
        break;
      case "2":
        this.setState({ exportBillDetail: { loading: true } });
        exportExcelDetail({ data })
          .then(res => {
            this.setState({ exportBillDetail: { loading: false, url: res.fileUrl } });

            this.downloadFile(res.fileUrl);
          }).catch(e => {
            this.setState({ exportBill: { loading: false } });
          });
        break;
      default: return;
    }
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
      let { paginate, tab, sort } = this.state;
      let { search, searchDetail } = this.props;
      let searchBody = this.onGetSearchBody();
      switch (tab) {
        case "1":
          search({
            data: {
              ...searchBody,
              paging: paginate,
              sort: sort
            },
          });
          break;
        case "2":
          searchDetail({
            data: {
              ...searchBody,
              paging: paginate,
              sort: sort
            },
          });
          break;
        default: return;
      }
    })
  }

  onChangeTab(val) {
    this.setState((state) => ({ tab: val || state.tab, sort: {} }), () => {
      this.onSearch({});
    })
  }

  downloadFile(url) {
    window.open(url);
  }

  showTopupModal() {
    this.setState({
      isShowVATModal: true,
    });
  }

  onCreateInvoice(e) {
    let body = { ...this.form.current.getFieldsValue() };

    if (body.machineIds === undefined || (body.machineIds && body.machineIds.length === 0)) {
      this.props.showErrorMessage("please.input.data.machine");
    } else {
      let data = {
        ...body,
        ...e
      }
      this.props.createInvoice({ data }).then((res) => {
        this.setState({
          orderDetailInvoice: {
            ...res.data, ...body
          },

          isShowVATModal: false,
          isShowInvoiceModal: true
        });
      })
    }
  }

  handleCancel = () => {
    this.setState({
      isShowVATModal: false,
    });
  };

  handleCancelInvoice = () => {
    this.setState({
      isShowInvoiceModal: false,
    });
  };

  handleInvoice = () => {
    let { orderDetailInvoice } = this.state;
    let data = {
      ...orderDetailInvoice,
    }
    this.props.sendInvoice({ data });
    this.handleCancelInvoice();

  };

  render() {
    let {
      bill, billDetail, machines, paymentMethods, paging, translate,
      addressTypes, machineModels, locations, dropStatusList, refundStatusList,
    } = this.props;
    let { tab, paginate, searchBody, exportBill, exportBillDetail, timeFromReadonly,
      timeToReadonly, orderDetailInvoice, isShowVATModal, isShowInvoiceModal } = this.state;
    return (
      <React.Fragment>
        <PageHeader
          title={<Translate id="BILL_HEADER" />}
          ghost={false}
        />

        <Card
          title={<strong><Translate id="SEARCH" /></strong>}
          size="small"
          style={{ marginTop: 10 }}
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
                <Form.Item {...globalProps.formItem}
                  label={<Translate id="BILL_NUMBER" />}
                  name="billNumber"
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
              {/* <Col {...globalProps.col}>
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
                </Col> */}
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
                  label={<Translate id="TRADING_ADDRESS" />}
                  name="address"
                >
                  <Input />
                </Form.Item>
              </Col>

              {/* <Col {...globalProps.col}>
                  <Form.Item {...globalProps.formItem}
                    label={"Đơn hoàn tiền"}
                    name="isRefund"
                  >
                    <Select {...globalProps.selectSearch} defaultValue={false} >
                      {listDataSample.map((k, i) =>
                        <Option value={k.value} key={i}>{k.name}</Option>
                      )}
                    </Select>
                  </Form.Item>
                </Col> */}
            </Row>


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
                {isAllow(PERMISSION.BILL.LIST.INVOICE) &&
                  <Button
                    className="custom-btn-primary"
                    type="primary"
                    size="large"
                    onClick={e => this.showTopupModal()}>
                    Xem hóa đơn
                  </Button>}
              </Col>
            </Row>

          </Form >
        </Card >

        <Collapse
          style={globalProps.panel}
          expandIconPosition="right"
          defaultActiveKey={[0]}
        >
          <Collapse.Panel header={<strong><Translate id="SUMMARY" /></strong>} >

            {tab === '1' ?
              bill.summary.map((k, i) =>
                <Tag style={{ padding: 10, margin: 8, background: "#FFF" }} key={i}>
                  <Statistic
                    title={
                      <Tooltip title={<Translate id={`SUMMARY_${(k.targetName || "").toUpperCase()}`} />}>
                        <strong><Translate id={`SUMMARY_${(k.targetName || "").toUpperCase()}`} /></strong>
                      </Tooltip>
                    }
                    value={k.targetValue}
                    key={i}
                    valueRender={e => <strong style={{ color: colors[i % colors.length] }}>{e}</strong>}
                  />
                </Tag>
              )
              :
              billDetail.summary.map((k, i) =>
                <Tag style={{ padding: 10, margin: 8, background: "#FFF" }} key={i}>
                  <Statistic
                    title={
                      <Tooltip title={<Translate id={`SUMMARY_${(k.targetName || "").toUpperCase()}`} />}>
                        <strong><Translate id={`SUMMARY_${(k.targetName || "").toUpperCase()}`} /></strong>
                      </Tooltip>
                    }
                    value={k.targetValue}
                    key={i}
                    valueRender={e => <strong style={{ color: colors[i % colors.length] }}>{e}</strong>}
                  />
                </Tag>
              )
            }
          </Collapse.Panel>
        </Collapse>
        <div className="card-container">
          <Tabs activeKey={tab}
            style={globalProps.panel}
            type="card"
            onChange={e => this.onChangeTab(e)}
          >
            {isAllow(PERMISSION.BILL.LIST.INDEX) &&
              <Tabs.TabPane
                key="1"
                tab={<strong><Translate id="BILL_LIST" /></strong>}
              >
                {isAllow(PERMISSION.BILL.LIST.EXPORT) &&
                  <div className="btn-wrapper" style={{ textAlign: "right", marginBottom: 10 }}>
                    {exportBill.url &&
                      <a href={exportBill.url} target="_blank">
                        <Button type="primary" ><DownloadOutlined />{exportBill.url.split("/").pop()}</Button>
                      </a>
                    }
                    <Button type="primary"
                      className="custom-btn-primary"
                      loading={exportBill.loading} onClick={e => this.onExport()}>
                      <Translate id="EXPORT_EXCEL" />
                    </Button>
                  </div>
                }
                <Table
                  {...globalProps.table}
                  dataSource={bill.bills.map((k, i) => ({ ...k, key: i, index: (paginate.pageIndex - 1) * paginate.pageSize + i + 1 }))}
                  onChange={this.changePaginate}
                  pagination={{
                    pageSize: paginate.pageSize,
                    total: bill.totalItem || 0,
                    current: paginate.pageIndex,
                    showSizeChanger: true,
                    pageSizeOptions: paging.pageSizes,
                    locale: { items_per_page: "" },
                    showTotal: sum => <div>{sum} <Translate id="RESULT" /></div>
                  }}
                >
                  <Column title={<Translate id="INDEX" />} width={60} dataIndex="index" />
                  <Column {...globalProps.tableRow} title={<Translate id="BILL_NUMBER" />}
                    dataIndex={"billNumber"}
                    key={"billNumber"}
                  />
                  <Column {...globalProps.tableRow} title={<Translate id="VENDING_CODE" />}
                    dataIndex={"vendingCode"}
                    key={"vendingCode"}
                  />
                  <Column {...globalProps.tableRow} title={<Translate id="VENDING_NAME" />}
                    dataIndex={"vendingName"}
                    key={"vendingName"}
                  />
                  <Column {...globalProps.tableRow} title={<Translate id="BILL_PAYMENTDATE" />}
                    dataIndex={"paymentTime"}
                    key={"paymentTime"}
                    render={(val) => val ? moment(val).format(format.date) : ""}
                  />
                  <Column {...globalProps.tableRow} title={<Translate id="BILL_PAYMENTTIME" />}
                    dataIndex={"paymentTime"}
                    key={"paymentTime"}
                    render={(val) => val ? moment(val).format(format.times) : ""}
                  />
                  <Column {...globalProps.tableRow} title={<Translate id="BILL_AMOUNT" />}
                    dataIndex={"amount"}
                    key={"amount"}
                    align="right"
                    render={(val) => (
                      <RenderText value={val} type="NUMBER_NO_DOT" />
                    )}
                  />
                  <Column {...globalProps.tableRow} title={<Translate id="BILL_ACTUALAMOUNT" />}
                    dataIndex={"actualAmount"}
                    key={"actualAmount"}
                    align="right"
                    render={(val) => (
                      <RenderText value={val} type="NUMBER_NO_DOT" />
                    )}
                  />
                  <Column {...globalProps.tableRow} title={"Giá trị refund"}
                    dataIndex={"refundAmount"}
                    key={"refundAmount"}
                    align="right"
                    render={(val) => (
                      <RenderText value={val} type="NUMBER_NO_DOT" />
                    )}
                  />
                  <Column {...globalProps.tableRow} title={<Translate id="BILL_PROMOAMOUNT" />}
                    dataIndex={"promoAmount"}
                    key={"promoAmount"}
                    align="right"
                    render={(val) => (
                      <RenderText value={val} type="NUMBER_NO_DOT" />
                    )}
                  />
                  <Column {...globalProps.tableRow} title={<Translate id="PAYMENT_METHOD" />}
                    dataIndex={"paymentType"}
                    key={"paymentType"}
                  />
                  <Column {...globalProps.tableRow} title={"Số lượng bán"}
                    dataIndex={"quantity"}
                    key={"quantity"}
                    align="right"
                  />
                  <Column {...globalProps.tableRow} title={<Translate id="BILL_TOTALQUANTITYREFUND" />}
                    dataIndex={"saleQuantityRefund"}
                    key={"saleQuantityRefund"}
                    align="right"
                  />
                  <Column {...globalProps.tableRow} title={<Translate id="BILL_VOUCHERAMOUNT" />}
                    dataIndex={"voucherAmount"}
                    key={"voucherAmount"}
                    align="right"
                  />
                  <Column {...globalProps.tableRow} title={<Translate id="BILL_VOUCHERCODE" />}
                    dataIndex={"voucherCode"}
                    key={"voucherCode"}
                    align="right"
                  />
                  <Column {...globalProps.tableRow} title={<Translate id="LOCATION_NAME" />}
                    dataIndex={"locationName"}
                    key={"locationName"}
                    render={(val, record) => (
                      <RenderText value={val + " - " + record.locationArea} />
                    )}
                  />
                  <Column {...globalProps.tableRow} title={<Translate id="ADDRESS" />}
                    dataIndex={"locationAddress"}
                    key={"locationAddress"}
                  />
                  <Column {...globalProps.tableRow} title={"Tên đối tác"}
                    dataIndex={"ownerName"}
                    key={"ownerName"}
                  />
                </Table>
              </Tabs.TabPane>
            }
            {isAllow(PERMISSION.BILL.DETAIL_LIST.INDEX) &&
              <Tabs.TabPane
                key="2"
                tab={<strong><Translate id="BILL_DETAIL_LIST" /></strong>}
              >
                {isAllow(PERMISSION.BILL.DETAIL_LIST.EXPORT) &&
                  <div className="btn-wrapper" style={{ textAlign: "right", marginBottom: 10 }}>
                    {exportBillDetail.url &&
                      <a href={exportBillDetail.url} target="_blank">
                        <Button type="primary" ><DownloadOutlined />{exportBillDetail.url.split("/").pop()}</Button>
                      </a>
                    }
                    <Button type="primary"
                      className="custom-btn-primary"
                      loading={exportBillDetail.loading} onClick={e => this.onExport()}>
                      <Translate id="EXPORT_EXCEL" />
                    </Button>
                  </div>
                }
                <Table
                  {...globalProps.table}
                  dataSource={billDetail.billDetails.map((k, i) => ({ ...k, key: i, index: (paginate.pageIndex - 1) * paginate.pageSize + i + 1 }))}
                  onChange={this.changePaginate}
                  pagination={{
                    pageSize: paginate.pageSize,
                    total: billDetail.totalItem || 0,
                    current: paginate.pageIndex,
                    showSizeChanger: true,
                    pageSizeOptions: paging.pageSizes,
                    locale: { items_per_page: "" },
                    showTotal: sum => <div>{sum} <Translate id="RESULT" /></div>
                  }}
                >
                  <Column title={<Translate id="INDEX" />} width={60} dataIndex="index" />
                  <Column {...globalProps.tableRow} title={<Translate id="BILL_NUMBER" />}
                    dataIndex={"billNumber"}
                    key={"billNumber"}
                  />
                  <Column {...globalProps.tableRow} title={<Translate id="BILL_PAYMENTDATE" />}
                    dataIndex={"paymentTime"}
                    key={"paymentTime"}
                    render={(val) => val ? moment(val).format(format.date) : ""}
                  />
                  <Column {...globalProps.tableRow} title={<Translate id="BILL_PAYMENTTIME" />}
                    dataIndex={"paymentTime"}
                    key={"paymentTime"}
                    render={(val) => val ? moment(val).format(format.times) : ""}
                  />
                  <Column {...globalProps.tableRow} title={<Translate id="VENDING_CODE" />}
                    dataIndex={"vendingCode"}
                    key={"vendingCode"}
                  />
                  <Column {...globalProps.tableRow} title={<Translate id="VENDING_NAME" />}
                    dataIndex={"vendingName"}
                    key={"vendingName"}
                  />
                  <Column {...globalProps.tableRow} title={<Translate id="PRODUCT_CODE" />}
                    dataIndex={"productCode"}
                    key={"productCode"}
                  />
                  <Column {...globalProps.tableRow} title={<Translate id="PRODUCT_NAME" />}
                    dataIndex={"productName"}
                    key={"productName"}
                  />
                  <Column {...globalProps.tableRow} title={<Translate id="PRODUCT_UNIT" />}
                    dataIndex={"unitName"}
                    key={"unitName"}
                  />
                  <Column {...globalProps.tableRow} title={<Translate id="QUANTITY" />}
                    dataIndex={"quantity"}
                    key={"quantity"}
                    align="right"
                    render={(val) => (
                      <RenderText value={val} type="NUMBER_NO_DOT" />
                    )}
                  />
                  <Column {...globalProps.tableRow} title={<Translate id="PAYMENT_METHOD" />}
                    dataIndex={"paymentType"}
                    key={"paymentType"}
                  />
                  <Column {...globalProps.tableRow} title={"Loại "}
                    dataIndex={"buyType"}
                    key={"buyType"}
                    render={(val, record) => (
                      <Translate id={val} />
                    )}
                  />
                  <Column {...globalProps.tableRow} title={<Translate id="BILL_DETAIL_AMOUNT" />}
                    dataIndex={"amount"}
                    key={"amount"}
                    align="right"
                    render={(val) => (
                      <RenderText value={val} type="NUMBER_NO_DOT" />
                    )}
                  />
                  <Column {...globalProps.tableRow} title={<Translate id="BILL_ACTUALAMOUNT" />}
                    dataIndex={"finalRevenue"}
                    key={"finalRevenue"}
                    align="right"
                    render={(val) => (
                      <RenderText value={val} type="NUMBER_NO_DOT" />
                    )}
                  />
                  {isAllow(PERMISSION.BILL.DETAIL_LIST.SUPPLIER_PRICE) &&
                    <Column {...globalProps.tableRow} title={<Translate id="PRODUCT_PURCHASE_PRICE" />}
                      dataIndex={"mainSupplierPrice"}
                      key={"mainSupplierPrice"}
                      align="right"
                      render={(val) => (
                        <RenderText value={val} type="NUMBER_NO_DOT" />
                      )}
                    />}
                  <Column {...globalProps.tableRow} title={<Translate id="BILL_REFUNDAMOUNT" />}
                    dataIndex={"refundAmount"}
                    key={"refundAmount"}
                    align="right"
                    render={(val) => (
                      <RenderText value={val} type="NUMBER_NO_DOT" />
                    )}
                  />
                  <Column {...globalProps.tableRow} title={<Translate id="BILL_DETAIL_QUANTITYREFUND" />}
                    dataIndex={"quantityRefund"}
                    key={"quantityRefund"}
                    align="right"
                    render={(val) => (
                      <RenderText value={val} type="NUMBER_NO_DOT" />
                    )}
                  />

                  <Column {...globalProps.tableRow} title={<Translate id="BILL_DETAIL_DROPSTATUS" />}
                    dataIndex={"dropStatus"}
                    key={"dropStatus"}
                    render={(val) => {
                      return val ? (dropStatusList.find(item => item.code === val) ? dropStatusList.find(item => item.code === val).name : "") : ""
                    }}
                  />
                  <Column {...globalProps.tableRow} title={<Translate id="BILL_DETAIL_REFUNDSTATUS" />}
                    dataIndex={"refundStatus"}
                    key={"refundStatus"}
                    render={(val) => {
                      return val ? (refundStatusList.find(item => item.code === val) ? refundStatusList.find(item => item.code === val).name : "") : ""
                    }}
                  />
                  <Column {...globalProps.tableRow} title={<Translate id="BILL_DETAIL_DROP" />}
                    dataIndex={"note"}
                    key={"note"}
                  />
                  <Column {...globalProps.tableRow} title={<Translate id="REFUND_TYPE" />}
                    dataIndex={"refundType"}
                    key={"refundType"}
                  />
                  <Column {...globalProps.tableRow} title={<Translate id="BILL_DETAIL_POSITION" />}
                    dataIndex={"position"}
                    key={"position"}
                  />
                  <Column {...globalProps.tableRow} title={<Translate id="LOCATION_NAME" />}
                    dataIndex={"locationName"}
                    key={"locationName"}
                    render={(val, record) => (
                      <RenderText value={val + " - " + record.locationArea} />
                    )}
                  />
                  <Column {...globalProps.tableRow} title={<Translate id="ADDRESS" />}
                    dataIndex={"locationAddress"}
                    key={"locationAddress"}
                  />
                  <Column {...globalProps.tableRow} title={"Tên đối tác"}
                    dataIndex={"ownerName"}
                    key={"ownerName"}
                  />
                </Table>
              </Tabs.TabPane>
            }
          </Tabs>
        </div>
        <Modal
          visible={isShowVATModal}
          textAlign="center"
          centered={true}
          onCancel={this.handleCancel}
          footer={null}
          maskClosable={false}
          closable
          destroyOnClose
          width={300}
        > <Fragment>
            <Form
              labelAlign="right"
              layout="horizontal"
              onFinish={e => this.onCreateInvoice(e)}
              {...globalProps.form}
              ref={this.formModal}
            >
              <Row {...globalProps.row}>
                <Col {...globalProps.col3}>
                  <Form.Item {...globalProps.formItem}
                    label={"Phần trăm VAT"}
                    name="VATRate"
                  >
                    <Input />
                  </Form.Item>
                </Col>
              </Row>
              <div style={{ textAlign: "center" }}>
                <Space size="small" className="main-btn-topup">
                  <Button
                    type="primary"
                    className="custom-btn-primary"
                    htmlType="submit"
                  >
                    <Translate id="PROCESS" />
                  </Button>
                  <Button onClick={this.handleCancel}>
                    <Translate id="CLOSE" />
                  </Button>
                </Space>
              </div>
            </Form>
          </Fragment>
        </Modal>
        {/* Topup  */}
        <Modal
          title={
            <strong>
              Báo cáo hóa đơn
            </strong>
          }
          textAlign="center"
          centered={true}
          visible={isShowInvoiceModal}
          onCancel={this.handleCancel}
          footer={null}
          maskClosable={false}
          closable
          destroyOnClose
          width={1000}
        >
          <Fragment>
            <Card style={{ marginBottom: 10 }}>
              <Form
                labelAlign="right"
                layout="horizontal"
                initialValues={orderDetailInvoice}
                onFinish={e => this.onSearch(e)}
                {...globalProps.form}
              >
                <Row {...globalProps.row}>
                  <Col {...globalProps.colHalf}>
                    <Form.Item {...globalProps.formItem}
                      label={<Translate id="MACHINE" />}
                      name="machineIds"
                    >
                      <Select {...globalProps.selectSearch} disabled mode="multiple">
                        {machines.map((k, i) =>
                          <Option value={k.id} key={i}>{k.name}

                          </Option>
                        )}
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col {...globalProps.colQuarter}>

                    <Form.Item {...globalProps.formItem}
                      label={<Translate id="DATE_FROM" />}
                      name="dateFrom"
                      initialValue={moment()}
                    >
                      <DatePicker
                        disabled
                        format={translate("FORMAT_DATE")}
                        style={{ width: '100%' }}
                      />
                    </Form.Item>

                  </Col>
                  <Col {...globalProps.colQuarter}>


                    <Form.Item {...globalProps.formItem}
                      label={<Translate id="DATE_TO" />}
                      name="dateTo"
                      style={{ width: '100%' }}
                      initialValue={moment()}
                    >
                      <DatePicker
                        disabled
                        format={translate("FORMAT_DATE")}
                        style={{ width: '100%' }}
                      />
                    </Form.Item>

                  </Col>
                </Row>
              </Form>
            </Card>

            <Table
              {...globalProps.table}
              dataSource={
                orderDetailInvoice.invoiceDetails && orderDetailInvoice.invoiceDetails.map((k, i) => {
                  k.key = i;
                  k.index = (paginate.pageIndex - 1) * paginate.pageSize + i + 1;
                  return k;
                })
              }
              pagination={false}
            >
              <Column
                width={60}
                title={<Translate id="INDEX" />}
                dataIndex="index"
              />
              <Column
                {...globalProps.tableRow}
                key="inventoryItemCode"
                title={"Mã sản phẩm"}
                dataIndex="inventoryItemCode"
              />
              <Column
                {...globalProps.tableRow}
                key="description"
                title={"Tên sản phẩm"}
                dataIndex="description"
              />
              <Column
                {...globalProps.tableRow}
                key="unitName"
                title={"Đơn vị"}
                dataIndex="unitName"
              />
              <Column
                {...globalProps.tableRow}
                key="quantity"
                title={"Số lượng"}
                dataIndex="quantity"
              />
              <Column
                {...globalProps.tableRow}
                key="unitPrice"
                align="right"
                title={"Giá bán đã VAT"}
                dataIndex="unitPrice"
                render={(val, record) => (
                  <RenderText value={val} type="NUMBER_NO_DOT" />
                )}
              />
              <Column
                align="right"
                className="column-default"
                title={"Tổng tiền đã VAT"}
                dataIndex="amount"
                render={(val, record) => (
                  <RenderText value={val} type="NUMBER_NO_DOT" />
                )}
              />
            </Table>
            <div style={{ display: "flex", marginBottom: 20 }}>
              <div className="card-container" style={{ width: "100%", marginRight: 10 }}>

                <table className="table table-hover table-bordered table-striped" id="tableValue2" >
                  <thead style={{ backgroundColor: "#d9d9d9" }}>
                    <tr>
                      <th style={{ width: "30%", textAlign: "center" }}>Tổng tiền chưa VAT</th>
                      <th style={{ width: "25%", textAlign: "center" }}>VAT ({orderDetailInvoice.vatRate}%)</th>
                      <th style={{ width: "45%", textAlign: "center" }}>Thành tiền đã VAT</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td style={{ textAlign: "right", color: "red" }}>{globalProps.inputNumberVND.formatter(orderDetailInvoice.totalSaleAmount)}</td>
                      <td style={{ textAlign: "right", color: "red" }}>{globalProps.inputNumberVND.formatter(orderDetailInvoice.totalVATAmount)}</td>
                      <td style={{ textAlign: "right", color: "red" }}>{globalProps.inputNumberVND.formatter(orderDetailInvoice.totalAmount)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <div style={{ textAlign: "center" }}>
              <Space size="small" className="main-btn-topup">
                {orderDetailInvoice.invoiceDetails && orderDetailInvoice.invoiceDetails.length !== 0 &&
                  <Button
                    type="primary"
                    className="custom-btn-primary"
                    onClick={this.handleInvoice}
                  >
                    <Translate id="PROCESS" />
                  </Button>}
                <Button onClick={this.handleCancelInvoice}>
                  <Translate id="CLOSE" />
                </Button>
              </Space>
            </div>
          </Fragment>
        </Modal>
      </React.Fragment >
    )
  }
}

const stateToProps = (state) => {
  return {
    bill: state.bill.bill,
    billDetail: state.bill.billDetail,
    products: state.bill.products,
    machines: state.bill.machines,
    paymentMethods: state.bill.paymentMethods,
    paging: state.bill.paging,
    addressTypes: state.bill.addressTypes,
    machineModels: state.bill.machineModels,
    locations: state.bill.locations,
    dropStatusList: state.bill.dropStatusList,
    refundStatusList: state.bill.refundStatusList,
    listOrderDetailInvoice: state.bill.listOrderDetailInvoice,
  };
}

const dispatchToProps = (dispatch) => bindActionCreators({
  init: billActions.init,
  search: billActions.search,
  searchDetail: billActions.searchDetail,
  exportExcel: billActions.exportExcel,
  exportExcelDetail: billActions.exportExcelDetail,
  createInvoice: billActions.createInvoice,
  sendInvoice: billActions.sendInvoice,
  showErrorMessage: showErrorMessage,
}, dispatch);

export default connect(stateToProps, dispatchToProps)(withLocalize(PaymentOrder));