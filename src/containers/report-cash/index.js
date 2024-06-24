import React, { Component } from "react";
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Translate, withLocalize } from "react-localize-redux";
import { Table, PageHeader, Row, Col, Modal, Button, Form, InputNumber, Select, Card } from 'antd';
import { globalProps, RenderText } from "../../data";
import { reportCashActions } from "../../actions";
import { LOCAL_PATH } from "../../constants";
import { NavLink } from "react-router-dom";
import {
  SearchOutlined,
} from '@ant-design/icons';
const { Column } = Table;
const { Option } = Select;

const listVND = [500000, 200000, 100000, 50000, 20000, 10000, 5000, 2000, 1000];

class ReportCash extends Component {
  state = {
    searchBody: {},
    sort: {},
    paginate: {
      pageIndex: 1,
      pageSize: 10,
    },
    visibleModal: false,
    itemReportCash: {
      vendingId: 0,
      paymentMethodId: 0
    },
    exportReportCash: { loading: false },
    exportDetailReportCash: { loading: false },

  }
  form = React.createRef()

  componentDidMount() {
    this.props.init();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.machines !== this.props.machines) {
      this.onSearch({});
    }

    if (prevProps.paging.pageSizeDefault !== this.props.paging.pageSizeDefault) {
      this.changePaginate({ pageSize: this.props.paging.pageSizeDefault, pageIndex: this.state.paginate.pageIndex })
    }
  }

  onGetSearchBody() {
    let body = { ...this.form.current.getFieldsValue() };
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
      let { search } = this.props;
      let searchBody = this.onGetSearchBody();
      let data = {
        ...searchBody,
        paging: {
          ...paginate,
          pageIndex: 1
        },
        sort
      }
      search({ data });
    })
  }

  changePaginate = (paginate, filters, sorter) => {
    this.setState({
      paginate: {
        pageSize: paginate.pageSize,
        pageIndex: paginate.current
      },
      sort: {
        sortField: sorter.columnKey,
        sortType: sorter.order === 'descend' ? 'DESC' : 'ASC'
      }
    }, () => {
      let { paginate, sort } = this.state;

      let { search } = this.props;
      let searchBody = this.onGetSearchBody();

      let data = {
        ...searchBody,
        paging: {
          ...paginate
        },
        sort: sort
      };

      search({ data });
    })
  }


  showModal(vendingId) {
    let data = {
      vendingId: vendingId,
      paymentMethodId: 3
    }

    this.setState({
      itemReportCash: data
    })

    let { getCashSheetDetail } = this.props;
    getCashSheetDetail({ data });
    this.setState({
      visibleModal: true
    });
  };

  handleCancel = () => {
    this.setState({
      visibleModal: false
    });
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
      sort
    };
    this.setState({ exportReportCash: { loading: true } });
    exportExcel({ data })
      .then(res => {
        this.setState({ exportReportCash: { loading: false, url: res.fileUrl } });
        this.downloadFile(res.fileUrl);
      }).catch(e => {
        this.setState({ exportReportCash: { loading: false } });
      });
  }

  onExportDetail() {
    let { sort } = this.state;
    let { exportExcelDetail } = this.props;
    let data = {
      ...this.onGetSearchBody(),
      sort
    };
    this.setState({ exportDetailReportCash: { loading: true } });
    exportExcelDetail({ data })
      .then(res => {
        this.setState({ exportDetailReportCash: { loading: false, url: res.fileUrl } });
        this.downloadFile(res.fileUrl);
      }).catch(e => {
        this.setState({ exportDetailReportCash: { loading: false } });
      });
  }

  downloadFile(url) {
    window.open(url);
  }

  render() {
    let { reportCash, paging, vendingList, locationList, locationAreaMachineList, cashSheetDetailList, paymentAmount, fromDate } = this.props;
    let { paginate, searchBody,
      // exportReportCash, exportDetailReportCash,
      visibleModal, itemReportCash } = this.state;

    return (
      <React.Fragment>
        <PageHeader
          title={<Translate id="REPORT_CASH" />}
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
              {/* Máy */}
              <Col {...globalProps.col}>
                <Form.Item {...globalProps.formItem}
                  label={<Translate id="MACHINE" />}
                  name="VendingIdList"
                >
                  <Select {...globalProps.selectSearch} allowClear mode="multiple">
                    {vendingList.map((k, i) =>
                      <Option value={k.id} key={i}>{`${k.code} - ${k.name}`}</Option>
                    )}
                  </Select>
                </Form.Item>
              </Col>
              {/* Địa điểm  */}
              <Col {...globalProps.col}>
                <Form.Item {...globalProps.formItem}
                  label={<Translate id="LOCATION" />}
                  name="LocationIdList"
                >
                  <Select {...globalProps.selectSearch} allowClear mode="multiple">
                    {locationList.map((k, i) =>
                      <Option value={k.id} key={i}>{`${k.code} - ${k.name}`}</Option>
                    )}
                  </Select>
                </Form.Item>
              </Col>
              {/* Vị trí  */}
              <Col {...globalProps.col}>
                <Form.Item {...globalProps.formItem}
                  label={<Translate id="LOCATION_AREA" />}
                  name="LocationAreaMachineIdList"
                >
                  <Select {...globalProps.selectSearch} allowClear mode="multiple">
                    {locationAreaMachineList.map((k, i) =>
                      <Option value={k.id} key={i}>{`${k.code} - ${k.name}`}</Option>
                    )}
                  </Select>
                </Form.Item>
              </Col>
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
                {/* <Button type="primary"
                  className="custom-btn-primary"
                  size="large"
                  loading={exportReportCash.loading} onClick={e => this.onExport()}>
                  <Translate id="EXPORT_EXCEL" />
                </Button>
                <Button type="primary"
                  className="custom-btn-primary"
                  size="large"
                  loading={exportDetailReportCash.loading} onClick={e => this.onExportDetail()}>
                  <Translate id="EXPORT_EXCEL_DETAIL" />
                </Button> */}
              </Col>
            </Row>
          </Form>
        </Card>

        <div className="card-container">
          <Table
            {...globalProps.table}
            dataSource={reportCash.reportCashList.map((k, i) => ({ ...k, index: i + 1, key: i }))}
            onChange={this.changePaginate}
            pagination={
              {
                pageSize: paginate.pageSize,
                total: reportCash.total,
                current: paginate.pageIndex,
                showSizeChanger: true,
                pageSizeOptions: paging.pageSizes,
                locale: { items_per_page: "" },
                showTotal: sum => <div>{sum} <Translate id="RESULT" /></div>
              }
            }
          >
            <Column {...globalProps.tableRow} title={<Translate id="INDEX" />} dataIndex="index" width={50} />
            {/* <Column {...globalProps.tableRow} dataIndex="id" width={60}
              render={(val, record) =>
                <Button size="large" className="custom-btn-primary" type="primary" onClick={() => this.showModal(record.vendingId)}>
                  <span>
                    <Translate id="TRANSACT_VENDING_LOG_DETAIL" />
                  </span>
                </Button>
              }
            /> */}
            <Column key="vendingCode" {...globalProps.tableRow} title={<Translate id="MACHINE_CODE" />} dataIndex="vendingCode" />
            <Column key="vendingName" {...globalProps.tableRow} title={<Translate id="MACHINE_NAME" />} dataIndex="vendingName" />
            {/* <Column align="right" key=" maximumSheet" {...globalProps.tableRow} title={<Translate id="MAXIMUM_SHEET" />} dataIndex="maximumSheet" /> */}
            {/* <Column align="right" key=" actualTotalSheet" {...globalProps.tableRow} title={<Translate id="ACTUAL_TOTAL_SHEET" />} dataIndex="actualTotalSheet" /> */}
            {/* <Column align="right" key=" rate" {...globalProps.tableRow} title={<Translate id="REPORT_CASH_RATE" />} render={val => <RenderText value={val} type="PERCENT" />} dataIndex="rate" /> */}
            <Column align="right" key="actualTotalCash" {...globalProps.tableRow} title={<Translate id="ACTUAL_TOTAL_CASH" />} dataIndex="actualTotalCash" render={val => val ? <span style={{ color: "red" }}>{globalProps.inputNumberVND.formatter(val)}</span> : 0} />
            <Column key="locationAreaMachine" {...globalProps.tableRow} title={<Translate id="LOCATION_AREA" />} dataIndex="locationAreaMachine" />
            <Column key="address" {...globalProps.tableRow} title={<Translate id="ADDRESS" />} dataIndex="address" />
          </Table>
        </div>
        <Modal
          title={<Translate id="TRANSACT_VENDING_LOG_DETAIL_CASH" />}
          centered={true}
          visible={visibleModal}
          onCancel={this.handleCancel}
          closable
          destroyOnClose
          className="transact-vending-log-detail"
          footer={[
            <Button key="back" onClick={this.handleCancel}>
              <span>
                <Translate id="CLOSE" />
              </span>
            </Button>
          ]}
        >
          {
            cashSheetDetailList && (
              <div>
                <Row gutter={[8, 8]}>
                  <Col span={10} >
                    <strong> <Translate id="TRANSACT_VENDING_LOG_DETAIL_DENOMINATION" /> </strong>
                  </Col>
                  <Col span={12} >
                    <strong>
                      <Translate id="TRANSACT_VENDING_LOG_DETAIL_SYSTEM_SHEET" />
                    </strong>
                  </Col>
                </Row>
                {
                  listVND.map((vnd, i) => {
                    let cashSheet = null;
                    if (cashSheetDetailList && cashSheetDetailList.length > 0) {
                      cashSheet = cashSheetDetailList.find(x => x.code === vnd);
                    }
                    return (
                      <Row className="item-log-cash-sheet" gutter={[8, 8]} key={`vnd+${i}`}>
                        <Col span={10} >
                          <span> {<RenderText value={vnd} type="NUMBER_NO_DOT" />} </span>
                        </Col>
                        <Col span={12}>
                          <InputNumber {...globalProps.inputNumber} disabled value={cashSheet != null ? cashSheet.systemSheet : 0} />
                        </Col>
                      </Row>
                    )
                  })
                }
                <Row gutter={[8, 8]} className="item-log-cash-sheet">
                  <Col span={10} >
                    <strong> <Translate id="TRANSACT_VENDING_LOG_DETAIL_TOTAL_SHEET" /> </strong>
                  </Col>
                  <Col span={12} >
                    <InputNumber className="red" {...globalProps.inputNumber} disabled value={cashSheetDetailList && cashSheetDetailList.reduce((a, b) => a + b.systemSheet, 0)} />
                  </Col>
                </Row>
                <Row gutter={[8, 8]} className="item-log-cash-sheet">
                  <Col span={10} >
                    <strong> <Translate id="TRANSACT_VENDING_LOG_DETAIL_TOTAL_AMOUNT" /> </strong>
                  </Col>
                  <Col span={12} >
                    <InputNumber className="red" {...globalProps.inputNumber} disabled value={cashSheetDetailList && cashSheetDetailList.reduce((a, b) => a + b.systemAmount, 0)} />
                  </Col>
                </Row>
                <hr />
                <Row gutter={[8, 8]} className="item-log-cash-sheet">
                  <Col span={10} >
                    <strong>
                      <Translate id="TRANSACT_VENDING_LOG_DETAIL_TOTAL_AMOUNT_PAYMENT" />
                      (
                      <NavLink target="_blank" to={LOCAL_PATH.TRANSACTION.BILL.INDEX + "?fromDate=" + fromDate + "&machineIds=" + itemReportCash.vendingId + "&paymentMethodId=" + itemReportCash.paymentMethodId}><Translate id="DETAIL" /></NavLink>
                      )
                    </strong>
                  </Col>
                  <Col span={12} >
                    <InputNumber className="red" {...globalProps.inputNumber} disabled value={paymentAmount} />
                  </Col>
                </Row>
                <Row gutter={[8, 8]} className="item-log-cash-sheet">
                  <Col span={10} >
                    <strong> <Translate id="TRANSACT_VENDING_LOG_DETAIL_TOTAL_AMOUNT_OTHER" /> </strong>
                  </Col>
                  <Col span={12} >
                    <InputNumber className="red" {...globalProps.inputNumber} disabled value={cashSheetDetailList && (cashSheetDetailList.reduce((a, b) => a + b.systemAmount, 0) - paymentAmount)} />
                  </Col>
                </Row>
              </div>
            )
          }
        </Modal>
      </React.Fragment >
    )
  }
}

const stateToProps = (state) => {
  return {
    paging: state.reportCash.paging,
    vendingList: state.reportCash.vendingList,
    locationList: state.reportCash.locationList,
    locationAreaMachineList: state.reportCash.locationAreaMachineList,
    reportCash: state.reportCash.reportCash,
    cashSheetDetailList: state.reportCash.cashSheetDetailList,
    paymentAmount: state.reportCash.paymentAmount,
    fromDate: state.reportCash.fromDate,
  };
}

const dispatchToProps = (dispatch) => bindActionCreators({
  init: reportCashActions.init,
  search: reportCashActions.search,
  getCashSheetDetail: reportCashActions.getCashSheetDetail,
  exportExcel: reportCashActions.exportExcel,
  exportExcelDetail: reportCashActions.exportExcelDetail,
}, dispatch);

export default connect(stateToProps, dispatchToProps)(withLocalize(ReportCash));