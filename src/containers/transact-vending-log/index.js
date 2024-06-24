import React, { Component } from "react";
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Translate, withLocalize } from "react-localize-redux";
import { Table, PageHeader, Row, Col, Modal, Button, Form, InputNumber, Select, DatePicker, Card } from 'antd';
import { globalProps, RenderText, rules } from "../../data";
import { transactVendingLogActions } from "../../actions";
import moment from 'moment';
import { LOCAL_PATH } from "../../constants";
import { NavLink } from "react-router-dom";

import {
  SearchOutlined,
} from '@ant-design/icons';
const { Column, ColumnGroup } = Table;
const { Option } = Select;

const listVND = [500000, 200000, 100000, 50000, 20000, 10000, 5000, 2000, 1000];

class TransactVendingLog extends Component {
  state = {
    searchBody: {},
    sort: {},
    paginate: {
      pageIndex: 1,
      pageSize: 10,
    },
    transactVendingLogList: [],
    visibleModal: false,
    itemVMLog: {},
    exportReport: { loading: false },
    exportDetailReport: { loading: false },
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

    if (body.fromDate) {
      let dateFromFormat = body.fromDate.format('YYYY-MM-DD');
      let timeFromFormat = '00:00:00';
      let date = moment(`${dateFromFormat} ${timeFromFormat}`);
      body.fromDate = date.format("YYYY-MM-DDTHH:mm:ss");
    }

    if (body.toDate) {
      let toDateFormat = body.toDate.format('YYYY-MM-DD');
      let timeToFormat = '23:59:59';
      let date = moment(`${toDateFormat} ${timeToFormat}`);
      body.toDate = date.format("YYYY-MM-DDTHH:mm:ss");
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

  showModal(item) {
    let data = {
      transactVendingLogId: item.transactVendingLogId
    }
    this.props.getTransactVendingLogDetail({ data }).then(res => {
      this.setState({
        visibleModal: true
      });

      if (res && res.resultCode === "SUCCESS") {
        this.setState({
          itemVMLog: {
            ...res.data,
            startTime: item.startTime,
            endTime: item.endTime,
            vendingId: item.vendingId,
          }
        });
      }
    })
  };

  handleCancel = () => {
    this.setState({
      visibleModal: false,
      itemVMLog: null
    });
  };

  onExport() {
    let { sort } = this.state;
    let { exportExcel } = this.props;
    let data = {
      ...this.onGetSearchBody(),
      sort
    };
    this.setState({ exportReport: { loading: true } });
    exportExcel({ data })
      .then(res => {
        this.setState({ exportReport: { loading: false, url: res.fileUrl } });
        this.downloadFile(res.fileUrl);
      }).catch(e => {
        this.setState({ exportReport: { loading: false } });
      });
  }

  onExportDetail() {
    let { sort } = this.state;
    let { exportExcelDetail } = this.props;
    let data = {
      ...this.onGetSearchBody(),
      sort
    };
    this.setState({ exportDetailReport: { loading: true } });
    exportExcelDetail({ data })
      .then(res => {
        this.setState({ exportDetailReport: { loading: false, url: res.fileUrl } });
        this.downloadFile(res.fileUrl);
      }).catch(e => {
        this.setState({ exportDetailReport: { loading: false } });
      });
  }

  downloadFile(url) {
    window.open(url);
  }

  onReset() {
    this.setState({
      searchBody: {}
    }, () => {
      this.form.current.resetFields();
    });
  }

  render() {
    let { transactVendingLog, paging, translate, machines } = this.props;
    let { itemVMLog, searchBody, paginate, exportReport } = this.state;
    return (
      <React.Fragment>
        <PageHeader
          title={<Translate id="TRANSACT_VENDING_LOG" />}
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
                  name="MachineCodeList"
                >
                  <Select {...globalProps.selectSearch} allowClear mode="multiple">
                    {machines.map((k, i) =>
                      <Option value={k.code} key={i}>{`${k.code} - ${k.name}`}</Option>
                    )}
                  </Select>
                </Form.Item>
              </Col>
              <Col {...globalProps.col}>
                <Form.Item {...globalProps.formItem}
                  label={<Translate id="DATE_FROM" />}
                  name="fromDate"
                  initialValue={moment()}
                  rules={[rules.dateFromFilter]}
                >
                  <DatePicker
                    format={translate("FORMAT_DATE")}
                    style={{ width: '100%' }}
                  />
                </Form.Item>
              </Col>

              <Col {...globalProps.col}>
                <Form.Item {...globalProps.formItem}
                  label={<Translate id="DATE_TO" />}
                  name="toDate"
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
                <Button type="primary"
                  className="custom-btn-primary"
                  size="large"
                  loading={exportReport.loading} onClick={e => this.onExport()}>
                  <Translate id="EXPORT_EXCEL" />
                </Button>
                <Button type="primary"
                  className="custom-btn-primary"
                  size="large"
                  loading={exportReport.loading} onClick={e => this.onExportDetail()}>
                  <Translate id="EXPORT_EXCEL_DETAIL" />
                </Button>
              </Col>
            </Row>
          </Form>
        </Card>
        <Card
          size="small"
          style={{ marginTop: 10 }}
        >
          <Table
            {...globalProps.table}
            dataSource={transactVendingLog.listCashSheet.map((k, i) => ({ ...k, index: i + 1, key: i }))}
            onChange={this.changePaginate}
            pagination={
              {
                pageSize: paginate.pageSize,
                total: transactVendingLog.total,
                current: paginate.pageIndex,
                showSizeChanger: true,
                pageSizeOptions: paging.pageSizes,
                locale: { items_per_page: "" },
                showTotal: sum => <div>{sum} <Translate id="RESULT" /></div>
              }
            }
          >
            <Column title={<Translate id="INDEX" />} dataIndex="index" width={50} />
            <Column dataIndex="id" width={60}
              render={(val, record) =>
                <Button size="large" className="custom-btn-primary" type="primary" onClick={() => this.showModal(record)}>
                  <span>
                    <Translate id="TRANSACT_VENDING_LOG_DETAIL" />
                  </span>
                </Button>
              }
            />
            <Column key="confirmTime"
              title={<Translate id="TRANSACT_VENDING_LOG_CONFIRMTIME" />}
              dataIndex="confirmTime" width={70}
              render={val => <RenderText value={val} type="DATETIME" />}
            />
            <ColumnGroup title={<Translate id="TRANSACT_VENDING_LOG_CHECK_PERIOD" />}>
              <Column key="startTime"
                title={<Translate id="TRANSACT_VENDING_LOG_CHECK_PERIOD_FROM" />}
                dataIndex="startTime" width={70}
                render={val => <RenderText value={val} type="DATETIME" />}
              />
              <Column key="endTime"
                title={<Translate id="TRANSACT_VENDING_LOG_CHECK_PERIOD_TO" />}
                dataIndex="endTime" width={70}
                render={val => <RenderText value={val} type="DATETIME" />}
              />
            </ColumnGroup>
            <Column key="vendingCode" className="c-vending-name" title={<Translate id="MACHINE_CODE" />} dataIndex="vendingCode" />
            <Column key="systemTotalSheet"
              title={<Translate id="TRANSACT_VENDING_LOG_SYSTEMTOTALSHEET" />}
              dataIndex="systemTotalSheet"
              render={val => <RenderText value={val} type="NUMBER" />}
            />
            <Column align="right" key="systemTotalAmount"
              title={<Translate id="TRANSACT_VENDING_LOG_SYSTEMTOTALAMOUNT" />}
              dataIndex="systemTotalAmount"
              render={val => <RenderText value={val} type="NUMBER" />}
            />
            <Column key="actualTotalSheet"
              title={<Translate id="TRANSACT_VENDING_LOG_ACTUALTOTALSHEET" />}
              dataIndex="actualTotalSheet"
              render={val => <RenderText value={val} type="NUMBER" />}
            />
            <Column align="right" key="actualTotalAmount"
              title={<Translate id="TRANSACT_VENDING_LOG_ACTUALTOTALAMOUNT" />}
              dataIndex="actualTotalAmount"
              render={val => <RenderText value={val} type="NUMBER" />}
            />
            <Column key="confirmBy" title={<Translate id="TRANSACT_VENDING_LOG_CONFIRMBY" />} dataIndex="confirmBy" />
          </Table>
        </Card>

        <Modal
          title={<Translate id="TRANSACT_VENDING_LOG_DETAIL_CASH" />}
          centered={true}
          visible={this.state.visibleModal}
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
          <div>
            <Row gutter={[8, 8]}>
              <Col span={6} >
                <strong> <Translate id="TRANSACT_VENDING_LOG_DETAIL_DENOMINATION" /> </strong>
              </Col>
              <Col span={8} >
                <strong>
                  <Translate id="TRANSACT_VENDING_LOG_DETAIL_SYSTEM_SHEET" />
                </strong>
              </Col>
              <Col span={8} >
                <strong>
                  <Translate id="TRANSACT_VENDING_LOG_DETAIL_ACTUAL_SHEET" />
                </strong>
              </Col>
            </Row>
            {
              listVND.map((vnd, i) => {
                let cashSheet = null;
                if (itemVMLog && itemVMLog.listCashSheetDetail && itemVMLog.listCashSheetDetail.length > 0) {
                  cashSheet = itemVMLog.listCashSheetDetail.find(x => x.code === vnd);
                }
                return (
                  <Row className="item-log-cash-sheet" gutter={[8, 8]} key={`vnd+${i}`}>
                    <Col span={6}>
                      <span> {<RenderText value={vnd} type="NUMBER_NO_DOT" />} </span>
                    </Col>
                    <Col span={8}>
                      <InputNumber {...globalProps.inputNumber} disabled value={cashSheet != null ? cashSheet.systemSheet : 0} />
                    </Col>
                    <Col span={8}>
                      <InputNumber {...globalProps.inputNumber} disabled value={cashSheet != null ? cashSheet.actualSheet : 0} />
                    </Col>
                  </Row>
                )
              })
            }
            <Row className="item-log-cash-sheet" gutter={[8, 8]}>
              <Col span={6}>
                <strong> <Translate id="TRANSACT_VENDING_LOG_DETAIL_TOTAL_SHEET" /> </strong>
              </Col>
              <Col span={8}>
                <InputNumber className="red" {...globalProps.inputNumber} disabled value={itemVMLog != null ? itemVMLog.systemTotalSheet : 0} />
              </Col>
              <Col span={8}>
                <InputNumber className="red" {...globalProps.inputNumber} disabled value={itemVMLog != null ? itemVMLog.actualTotalSheet : 0} />
              </Col>
            </Row>
            <Row className="item-log-cash-sheet" gutter={[8, 8]}>
              <Col span={6}>
                <strong> <Translate id="TRANSACT_VENDING_LOG_DETAIL_TOTAL_AMOUNT" /> </strong>
              </Col>
              <Col span={8}>
                <InputNumber className="red" {...globalProps.inputNumber} disabled value={itemVMLog != null ? itemVMLog.systemTotalAmount : 0} />
              </Col>
              <Col span={8}>
                <InputNumber className="red" {...globalProps.inputNumber} disabled value={itemVMLog != null ? itemVMLog.actualTotalAmount : 0} />
              </Col>
            </Row>
            <hr />
            <Row gutter={[8, 8]} className="item-log-cash-sheet">
              <Col span={6}>
                <strong>
                  <Translate id="TRANSACT_VENDING_LOG_DETAIL_TOTAL_AMOUNT_PAYMENT" />
                  ({itemVMLog &&

                    <NavLink target="_blank" to={LOCAL_PATH.TRANSACTION.BILL.INDEX + "?fromDate=" + itemVMLog.startTime + "&toDate=" + itemVMLog.endTime + "&machineIds=" + itemVMLog.vendingId + "&paymentMethodId=3"}>
                      <Translate id="DETAIL" />
                    </NavLink>
                  })
                </strong>
              </Col>
              <Col span={8}>
                <InputNumber className="red" {...globalProps.inputNumber} disabled value={itemVMLog != null ? itemVMLog.paymentAmount : 0} />
              </Col>
              <Col span={8}></Col>
            </Row>
            <Row gutter={[8, 8]} className="item-log-cash-sheet">
              <Col span={6}>
                <strong> <Translate id="TRANSACT_VENDING_LOG_DETAIL_TOTAL_AMOUNT_OTHER" /> </strong>
              </Col>
              <Col span={8}>
                <InputNumber className="red" {...globalProps.inputNumber} disabled value={itemVMLog && Math.abs(itemVMLog.systemTotalAmount - itemVMLog.paymentAmount)} />
              </Col>
              <Col span={8}></Col>
            </Row>
          </div>
        </Modal>
      </React.Fragment >
    )
  }
}

const stateToProps = (state) => {
  return {
    paging: state.transactVendingLog.paging,
    machines: state.transactVendingLog.machines,
    transactVendingLog: state.transactVendingLog.transactVendingLog,
    transactVendingLogDetail: state.transactVendingLog.transactVendingLogDetail,
  };
}

const dispatchToProps = (dispatch) => bindActionCreators({
  init: transactVendingLogActions.init,
  search: transactVendingLogActions.search,
  exportExcel: transactVendingLogActions.exportExcel,
  exportExcelDetail: transactVendingLogActions.exportExcelDetail,
  getTransactVendingLogDetail: transactVendingLogActions.getTransactVendingLogDetail,
}, dispatch);

export default connect(stateToProps, dispatchToProps)(withLocalize(TransactVendingLog));