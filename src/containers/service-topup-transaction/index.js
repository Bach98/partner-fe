import React, { Component } from "react";
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Translate, withLocalize } from "react-localize-redux";
import { Table, PageHeader, Row, Col, Button, Form, Switch, Select, Card, Space, DatePicker, Input, Collapse, Tag, Tooltip, Statistic } from 'antd';
import { globalProps, RenderText, rules } from "../../data";
import { serviceTopupTransactionActions } from "../../actions";
import moment from 'moment';

import {
  SearchOutlined,
} from '@ant-design/icons';
const { Column } = Table;
const { Option } = Select;

class ServiceTopupTransaction extends Component {
  state = {
    showAdvance: false,
    exportReport: { loading: false },
    searchBody: {},
    sort: {},
    paginate: {
      pageIndex: 1,
      pageSize: 10,
    },
    exportPromotion: { loading: false },
  }
  form = React.createRef()

  componentDidMount() {
    this.props.init();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.paging.pageSizeDefault !== this.props.paging.pageSizeDefault) {
      this.changePaginate({ pageSize: this.props.paging.pageSizeDefault, pageIndex: this.state.paginate.pageIndex })
    }
  }

  toggleAdvanceSearch() {
    this.setState({
      showAdvance: !this.state.showAdvance,
    });
  }

  onGetSearchBody() {
    let body = { ...this.form.current.getFieldsValue() };
    let data = {
      ...body,
      fromDate: body.fromDate.format('YYYY-MM-DDTHH:mm:ss'),
      toDate: body.toDate.format('YYYY-MM-DDTHH:mm:ss'),
    }
    return data;
  }

  onSearch() {
    this.setState({
      paginate: {
        ...this.state.paginate,
        pageIndex: 1
      },
      sort: {}
    }, () => {
      let { paginate } = this.state;
      let { search } = this.props;
      let searchBody = this.onGetSearchBody();

      let data = {
        ...searchBody,
        paging: {
          ...paginate,
          pageIndex: 1
        }
      };

      search({ data });
    });
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

    this.setState({ exportReport: { loading: true } });

    exportExcel({ data })
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

  render() {
    let { paging, vendingList, machineModelList, locationList, topupTypeList, statusList, serviceTopupTransList, total, totalAmount, translate } = this.props;
    let { paginate, searchBody, showAdvance, exportReport } = this.state;
    return (
      <React.Fragment>
        <PageHeader
          title={<Translate id="SERVICE_TOPUP_TRANSACION" />}
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
            initialValues={
              {
                ...searchBody,
                fromDate: moment().startOf('month'),
                toDate: moment().endOf('day')
              }

            }
            onFinish={e => this.onSearch(e)}
            {...globalProps.form}
            ref={this.form}
          >
            <Row {...globalProps.row}>
              {/* Máy */}
              <Col {...globalProps.col}>
                <Form.Item {...globalProps.formItem}
                  label={<Translate id="MACHINE" />}
                  name="vendingIdList"
                >
                  <Select {...globalProps.selectSearch} allowClear mode="multiple">
                    {vendingList.map((k, i) =>
                      <Option value={k.id} key={i}>{`${k.code} - ${k.name}`}</Option>
                    )}
                  </Select>
                </Form.Item>
              </Col>
              <Col {...globalProps.col}>
                <Form.Item {...globalProps.formItem}
                  label={<Translate id="DATE_FROM" />}
                  name="fromDate"
                  rules={[rules.dateFromFilter]}
                >
                  <DatePicker
                    format="DD/MM/YYYY HH:mm:ss"
                    showTime={{ defaultValue: moment('00:00:00', 'HH:mm:ss') }}
                    style={{ width: '100%' }}
                  />
                </Form.Item>
              </Col>
              <Col {...globalProps.col}>
                <Form.Item {...globalProps.formItem}
                  label={<Translate id="DATE_TO" />}
                  name="toDate"
                  rules={[rules.dateToFilter]}
                >
                  <DatePicker
                    format="DD/MM/YYYY HH:mm:ss"
                    showTime={{ defaultValue: moment('00:00:00', 'HH:mm:ss') }}
                    style={{ width: '100%' }}
                  />
                </Form.Item>
              </Col>
            </Row>

            {showAdvance ?
              <Row {...globalProps.row}>
                <Col {...globalProps.col}>
                  <Form.Item {...globalProps.formItem}
                    label={<Translate id="MACHINE_MODEL" />}
                    name="machineModelIdList"
                  >
                    <Select {...globalProps.selectSearch} allowClear mode="multiple">
                      {machineModelList.map((k, i) =>
                        <Option value={k.id} key={i}>{`${k.name}`}</Option>
                      )}
                    </Select>
                  </Form.Item>
                </Col>
                <Col {...globalProps.col}>
                  <Form.Item {...globalProps.formItem}
                    label={<Translate id="LOCATION" />}
                    name="locationIdList"
                  >
                    <Select {...globalProps.selectSearch} allowClear mode="multiple">
                      {locationList.map((k, i) =>
                        <Option value={k.id} key={i}>{`${k.code} - ${k.name}`}</Option>
                      )}
                    </Select>
                  </Form.Item>
                </Col>
                <Col {...globalProps.col}>
                  <Form.Item {...globalProps.formItem}
                    label={<Translate id="TOPUP_TRANSACTION" />}
                    name="topupTypeList"
                  >
                    <Select {...globalProps.selectSearch} allowClear mode="multiple">
                      {topupTypeList.map((k, i) =>
                        <Option value={k.code} key={i}>{translate(`${k.code}`)}</Option>
                      )}
                    </Select>
                  </Form.Item>
                </Col>
                <Col {...globalProps.col}>
                  <Form.Item {...globalProps.formItem}
                    label={<Translate id="STATUS" />}
                    name="status"
                  >
                    <Select {...globalProps.selectSearch} allowClear>
                      {statusList.map((k, i) =>
                        <Option value={k.code} key={i}>{translate(`SUCCESS_STATUS.${k.code}`)}</Option>
                      )}
                    </Select>
                  </Form.Item>
                </Col>
                <Col {...globalProps.col}>
                  <Form.Item {...globalProps.formItem}
                    label={<Translate id="TRANSACTION_CODE" />}
                    name="transactionCode"
                  >
                    <Input />
                  </Form.Item>
                </Col>
              </Row>
              : ""
            }

            {/*  */}
            <Row {...globalProps.row}>
              <Col {...globalProps.col3}>
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
                    onClick={e => this.onReset()}
                  >
                    <span>
                      <Translate id="RESET" />
                    </span>
                  </Button>
                  <Button type="primary"
                    className="custom-btn-primary"
                    size="large"
                    loading={exportReport.loading} onClick={() => this.onExport()}>
                    <Translate id="EXPORT_EXCEL" />
                  </Button>
                </Space>
              </Col>
            </Row>
          </Form>
        </Card>

        <Collapse
          style={globalProps.panel}
          expandIconPosition="right"
          defaultActiveKey={[0]}
        >
          <Collapse.Panel header={<strong><Translate id="SUMMARY" /></strong>} >
            <Tag style={{ padding: 10, margin: 8, background: "#FFF" }}>
              <Statistic
                title={
                  <Tooltip title={<Translate id={"TOTAL_TRANSACTION"} />}>
                    <strong><Translate id={"TOTAL_TRANSACTION"} /></strong>
                  </Tooltip>
                }
                value={total}
                valueRender={e => <strong style={{ color: "#878BB6" }}>{e}</strong>}
              />
            </Tag>
            <Tag style={{ padding: 10, margin: 8, background: "#FFF" }}>
              <Statistic
                title={
                  <Tooltip title={<Translate id={"TOTAL_AMOUNT"} />}>
                    <strong><Translate id={"TOTAL_AMOUNT"} /></strong>
                  </Tooltip>
                }
                value={totalAmount}
                valueRender={e => <strong style={{ color: "#4ACAB4" }}>{e}</strong>}
              />
            </Tag>
          </Collapse.Panel>
        </Collapse>

        <div className="card-container">
          {serviceTopupTransList &&
            <Table
              {...globalProps.table}
              dataSource={serviceTopupTransList.map((k, i) => ({ ...k, key: i, index: (paginate.pageIndex - 1) * paginate.pageSize + i + 1 }))}
              onChange={this.changePaginate}
              pagination={
                {
                  pageSize: paginate.pageSize,
                  total: total,
                  current: paginate.pageIndex,
                  showSizeChanger: true,
                  pageSizeOptions: paging.pageSizes,
                  locale: { items_per_page: "" },
                  showTotal: sum => <div>{sum} <Translate id="RESULT" /></div>
                }
              }
            >
              <Column {...globalProps.tableRow} title={<Translate id="INDEX" />} dataIndex="index" width={60} />
              <Column {...globalProps.tableRow} key="machineCode" title={<Translate id="MACHINE_CODE" />} dataIndex="machineCode" />
              <Column {...globalProps.tableRow} key="machineName" title={<Translate id="MACHINE_NAME" />} dataIndex="machineName" />
              <Column {...globalProps.tableRow} key="topupTime" title={<Translate id="TIME" />} dataIndex="topupTime" />
              <Column {...globalProps.tableRow} key="topupType" title={<Translate id="TOPUP_TRANSACTION" />} dataIndex="topupType" render={val => val ? <Translate id={val} /> : ""} />
              <Column align="right" {...globalProps.tableRow} key="amount" title={<Translate id="AMOUNT" />} dataIndex="amount" render={val => <RenderText value={val} type="NUMBER" />} />
              <Column {...globalProps.tableRow} key="phoneNumber" title={<Translate id="PHONE" />} dataIndex="phoneNumber" />
              <Column {...globalProps.tableRow} key="status" title={<Translate id="STATUS" />} dataIndex="status" render={val => val ? <Translate id={`SUCCESS_STATUS.${val}`} /> : ""} />
              <Column {...globalProps.tableRow} key="transactionCode" title={<Translate id="TRANSACTION_CODE" />} dataIndex="transactionCode" />
              <Column {...globalProps.tableRow} key="locationName" title={<Translate id="LOCATION" />} dataIndex="locationName" />
            </Table>
          }
        </div>
      </React.Fragment >
    )
  }
}

const stateToProps = (state) => {
  return {
    paging: state.serviceTopupTransaction.paging,
    vendingList: state.serviceTopupTransaction.vendingList,
    machineModelList: state.serviceTopupTransaction.machineModelList,
    locationList: state.serviceTopupTransaction.locationList,
    topupTypeList: state.serviceTopupTransaction.topupTypeList,
    statusList: state.serviceTopupTransaction.statusList,

    total: state.serviceTopupTransaction.total,
    totalAmount: state.serviceTopupTransaction.totalAmount,
    serviceTopupTransList: state.serviceTopupTransaction.serviceTopupTransList,
  };
}

const dispatchToProps = (dispatch) => bindActionCreators({
  init: serviceTopupTransactionActions.init,
  search: serviceTopupTransactionActions.search,
  exportExcel: serviceTopupTransactionActions.exportExcel,
}, dispatch);

export default connect(stateToProps, dispatchToProps)(withLocalize(ServiceTopupTransaction));