import React, { Component } from "react";
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Translate, withLocalize } from "react-localize-redux";
import { Modal, Table, PageHeader, Row, Col, Button, Form, Select, Card, Input, Switch, Space, InputNumber } from 'antd';
import { EyeFilled } from '@ant-design/icons';
import { globalProps, isAllow, PERMISSION, rules } from "../../data";
import { reconciliationRevenueActions } from "../../actions";
import { LOCAL_PATH } from "../../constants";
import { history } from '../../store';
import { NavLink } from "react-router-dom";

import {
  SearchOutlined,
} from '@ant-design/icons';
const { Column, ColumnGroup } = Table;
const { Option } = Select;
const { TextArea } = Input;

class ReconciliationRevenue extends Component {
  state = {
    showAdvance: false,
    timeFromReadonly: false,
    timeToReadonly: false,
    searchBody: {},
    paginate: {
      pageIndex: 1,
      pageSize: 10,
    },
    exportReport: { loading: false },
    sort: {},
    visibleModal: false,
    visibleModalCancel: false,
    reconciliationRevenueItem: {},
  }

  form = React.createRef()
  formItem = React.createRef()

  toggleAdvanceSearch() {
    this.setState({
      showAdvance: !this.state.showAdvance,
      timeFromReadonly: false,
      timeToReadonly: false
    });
    this.onReset();
  }

  componentDidMount() {
    this.props.init();
    this.onSearch();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.paging.pageSizeDefault !== this.props.paging.pageSizeDefault) {
      this.changePaginate({ pageSize: this.props.paging.pageSizeDefault, pageIndex: this.state.paginate.pageIndex })
    }
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
      let searchBody = { ...this.form.current.getFieldsValue() };
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

  onGetSearchBody() {
    let body = { ...this.form.current.getFieldsValue() };
    return body;
  }

  downloadFile(url) {
    window.open(url);
  }

  showModalConfirm(item) {
    this.setState({
      visibleModal: true,
      reconciliationRevenueItem: item
    });
  };


  hideModal = () => {
    this.setState({
      visibleModal: false,
    });
  };

  showModalCancel(item) {
    this.setState({
      visibleModalCancel: true,
      reconciliationRevenueItem: item
    });
  };

  hideModalCancel = () => {
    this.setState({
      visibleModalCancel: false,
    });
  };

  confirm(e) {
    let { userInfo } = this.props;
    let { reconciliationRevenueItem } = this.state;
    let data = {
      reconciliationRevenueId: reconciliationRevenueItem.id,
      oldStatus: "APPROVED",
      newStatus: "DONE",
      partnerUserId: userInfo.id,
      partnerUserName: userInfo.userName,
      amountReceived: e.amountReceived,
      revenueNote: e.revenueNote
    }

    this.changeReconciliationStatus(data);
  };

  cancel = () => {
    let { userInfo } = this.props;
    let { reconciliationRevenueItem } = this.state;
    let data = {
      ReconciliationRevenueId: reconciliationRevenueItem.id,
      OldStatus: reconciliationRevenueItem.status,
      NewStatus: "CANCELED",
      PartnerUserId: userInfo.id,
      PartnerUserName: userInfo.userName,
    }

    this.changeReconciliationStatus(data);
  };

  changeReconciliationStatus(data) {
    let { changeReconciliationStatus } = this.props;
    changeReconciliationStatus({ data })
      .finally(() => {
        this.onSearch();
      });

    this.setState({
      visibleModal: false,
      visibleModalCancel: false
    });
    return Promise.resolve();
  }

  // gotoDetail(reconciliationId) {
  //   this.props.gotoDetail(reconciliationId);
  //   history.push(LOCAL_PATH.FINANCE.RECONCILIATION_REVENUE.DETAIL);
  // }

  gotoCreate() {
    history.push(LOCAL_PATH.FINANCE.RECONCILIATION_REVENUE.CREATE);
  }

  render() {
    let { machines, reconciliationStatus, paymentStatus, machineModels, addressTypes, locations, locationAreaMachines, paging, reconciliationRevenues } = this.props;
    let { searchBody, paginate, showAdvance, reconciliationRevenueItem } = this.state;
    return (
      <React.Fragment>
        <PageHeader
          title={<Translate id="RECONCILIATION_REVENUE_LIST" />}
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
            onFinish={e => this.onSearch()}
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
                  label={<Translate id="RECONCILIATION_CODE" />}
                  name="code"
                >
                  <Input />
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
            </Row>
            {showAdvance ?
              <Row {...globalProps.row}>
                <Col {...globalProps.col}>
                  <Form.Item {...globalProps.formItem}
                    label={<Translate id="MACHINE_MODEL" />}
                    name="machineModelIds"
                  >
                    <Select {...globalProps.selectSearch} allowClear mode="multiple">
                      {machineModels.map((k, i) =>
                        <Option value={k.id} key={i}>{`${k.name}`}</Option>
                      )}
                    </Select>
                  </Form.Item>
                </Col>
                <Col {...globalProps.col}>
                  <Form.Item {...globalProps.formItem}
                    label={<Translate id="ADDRESS_TYPE" />}
                    name="addressTypes"
                  >
                    <Select {...globalProps.selectSearch} allowClear mode="multiple">
                      {addressTypes.map((k, i) =>
                        <Option value={k.code} key={i}>{`${k.name}`}</Option>
                      )}
                    </Select>
                  </Form.Item>
                </Col>
                <Col {...globalProps.col}>
                  <Form.Item {...globalProps.formItem}
                    label={<Translate id="LOCATION_AREA" />}
                    name="locationAreaMachineIds"
                  >
                    <Select {...globalProps.selectSearch} allowClear mode="multiple">
                      {locationAreaMachines.map((k, i) =>
                        <Option value={k.id} key={i}>{`${k.code} - ${k.name}`}</Option>
                      )}
                    </Select>
                  </Form.Item>
                </Col>
                <Col {...globalProps.col}>
                  <Form.Item {...globalProps.formItem}
                    label={<Translate id="RECONCILIATION_STATUS.INDEX" />}
                    name="reconciliationStatus"
                  >
                    <Select {...globalProps.selectSearch} allowClear mode="multiple">
                      {reconciliationStatus.map((k, i) =>
                        <Option value={k.code} key={i}>
                          <Translate id={"RECONCILIATION_STATUS." + k.code} />
                        </Option>
                      )}
                    </Select>
                  </Form.Item>
                </Col>
                <Col {...globalProps.col}>
                  <Form.Item {...globalProps.formItem}
                    label={<Translate id="PAYMENT_STATUS" />}
                    name="paymentStatus"
                  >
                    <Select {...globalProps.selectSearch} allowClear mode="multiple">
                      {paymentStatus.map((k, i) =>
                        <Option value={k.code} key={i}>
                          <Translate id={"PAYMENT_STATUS_" + k.code} />
                        </Option>
                      )}
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
              : ""}
            {isAllow(PERMISSION.RECONCILIATION_REVENUE.LIST) &&
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
                    onClick={() => this.onReset()}
                  >
                    <span>
                      <Translate id="RESET" />
                    </span>
                  </Button>
                  {/* {isAllow(PERMISSION.RECONCILIATION_REVENUE.EXPORT) &&
                    <Button type="primary"
                      className="custom-btn-primary"
                      size="large"
                      loading={exportReport.loading} onClick={() => this.onExport()}>
                      <Translate id="EXPORT_EXCEL" />
                    </Button>
                  } */}
                </Col>
              </Row>
            }
          </Form>
        </Card>
        <div className="card-container">
          {isAllow(PERMISSION.RECONCILIATION_REVENUE.LIST) &&
            <Table
              {...globalProps.table}
              dataSource={reconciliationRevenues.map((k, i) => ({ ...k, index: i + 1, key: i }))}
              onChange={this.changePaginate}
              pagination={
                {
                  pageSize: paginate.pageSize,
                  total: reconciliationRevenues.length,
                  current: paginate.pageIndex,
                  showSizeChanger: true,
                  pageSizeOptions: paging.pageSizes,
                  locale: { items_per_page: "" },
                  showTotal: sum => <div>{sum} <Translate id="RESULT" /></div>
                }
              }
            >
              <Column key="index" title={<Translate id="INDEX" />} dataIndex="index" width={60} />
              <Column dataIndex="id" width={60}
                render={(val, record) =>
                  <Row gutter={8} style={{ flexWrap: "nowrap" }}>
                    <Col flex="32px">
                      <NavLink
                        to={LOCAL_PATH.FINANCE.RECONCILIATION_REVENUE.DETAIL.replace(":id", record.idCrypt)}
                      >
                        <Button
                          type="primary"
                          icon={<EyeFilled />}
                          shape="circle"
                        />
                      </NavLink>
                    </Col>
                  </Row>
                }
              />
              <Column title={<Translate id="ACTION" />} render={(index, record) => (
                <React.Fragment>
                  {isAllow(PERMISSION.RECONCILIATION_REVENUE.CONFIRM) && record.status === "APPROVED" && (
                    <Button size="large" className="custom-btn-primary" type="primary" onClick={() => this.showModalConfirm(record)}>
                      <span>
                        <Translate id="CONFIRM" />
                      </span>
                    </Button>
                  )}
                  {/* {isAllow(PERMISSION.RECONCILIATION_REVENUE.CANCEL) && record.status !== "DONE" && (
                    <Button size="large" className="custom-btn-primary" type="primary" onClick={() => this.showModalCancel(record)}>
                      <span>
                        <Translate id="CANCEL" />
                      </span>
                    </Button>
                  )} */}
                </React.Fragment>
              )}
              />
              <Column key="code" title={<Translate id="RECONCILIATION_CODE" />} dataIndex="code" />
              <Column key="vendingCode" title={<Translate id="MACHINE_CODE" />} dataIndex="vendingCode" />
              <ColumnGroup title={<Translate id="RECONCILIATION_REVENUE.RECONCILIATION_PERIOD" />}>
                <Column {...globalProps.tableRow}
                  title={<Translate id="RECONCILIATION_REVENUE.FROM" />}
                  dataIndex="fromDate" width={70}
                />
                <Column {...globalProps.tableRow}
                  title={<Translate id="RECONCILIATION_REVENUE.TO" />}
                  dataIndex="toDate" width={70}
                />
              </ColumnGroup>
              <Column key="status" className="column-name-short" title={<Translate id="RECONCILIATION_STATUS.INDEX" />} dataIndex="status" render={val => <Translate id={`RECONCILIATION_STATUS.${val}`} />} />
              <Column key="createdByName" title={"Người thu tiền"} dataIndex="createdByName" />
              <Column key="updatedByName" title={"Người xác nhận"} dataIndex="updatedByName" />
            </Table>
          }
        </div>
        {/* <Modal
          visible={this.state.visibleModal}
          onOk={this.confirm}
          onCancel={this.hideModal}
          okText="OK"
          okButtonProps={globalProps.okButton}
          cancelButtonProps={globalProps.cancelButton}
          cancelText="Cancel"
        >
          <p><Translate id="CONFIRM_RECONCILIATION" /></p>
        </Modal> */}

        <Modal
          title={
            <strong>
              <Translate id="HANDLE_RECONCILIATION" />
            </strong>
          }
          textAlign="center"
          centered={true}
          visible={this.state.visibleModal}
          onCancel={this.hideModal}
          footer={null}
          maskClosable={false}
          closable
          destroyOnClose
          width={800}
        >
          <Form
            id="process"
            name="process"
            labelAlign="left"
            layout="horizontal"
            scrollToFirstError={true}
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 18 }}
            initialValues={reconciliationRevenueItem}
            ref={this.formItem}
            onFinish={(e) => this.confirm(e)}
          >
            <Form.Item
              name="id"
              hidden
            >
              <Input disabled hidden />
            </Form.Item>
            <Form.Item
              label={<Translate id="MACHINE_CODE" />}
              name="vendingCode"
            >
              <Input disabled />
            </Form.Item>
            <Form.Item
              label={<Translate id="RECONCILIATION_REVENUE.FROM" />}
              name="fromDate"
            >
              <Input disabled />
            </Form.Item>
            <Form.Item
              label={<Translate id="RECONCILIATION_REVENUE.TO" />}
              name="toDate"
            >
              <Input disabled />
            </Form.Item>
            <Form.Item
              label={"Số tiền thực nhận"}
              name="amountReceived"
              rules={[rules.required, rules.number.minNum(1)]}
            >
              <InputNumber {...globalProps.inputNumber}
                style={{ width: "100%" }} />
            </Form.Item>
            <Form.Item
              label={<Translate id="NOTE" />}
              name="revenueNote"
              rules={[rules.required]}
            >
              <TextArea
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

                >
                  <Translate id="PROCESS" />
                </Button>
                <Button onClick={this.hideModalCancel}>
                  <Translate id="CLOSE" />
                </Button>
              </Space>
            </div>
          </Form>
        </Modal>

        <Modal
          visible={this.state.visibleModalCancel}
          onOk={this.cancel}
          onCancel={this.hideModalCancel}
          okText="OK"
          okButtonProps={globalProps.okButton}
          cancelButtonProps={globalProps.cancelButton}
          cancelText="Cancel"
        >
          <p><Translate id="CANCEL_RECONCILIATION" /></p>
        </Modal>
      </React.Fragment >
    )
  }
}

const stateToProps = (state) => {
  return {
    machines: state.reconciliationRevenue.machines,
    paymentStatus: state.reconciliationRevenue.paymentStatus,
    reconciliationStatus: state.reconciliationRevenue.reconciliationStatus,
    machineModels: state.reconciliationRevenue.machineModels,
    addressTypes: state.reconciliationRevenue.addressTypes,
    locations: state.reconciliationRevenue.locations,
    locationAreaMachines: state.reconciliationRevenue.locationAreaMachines,
    reconciliationRevenues: state.reconciliationRevenue.reconciliationRevenues,
    responeModel: state.reconciliationRevenue.responeModel,
    paging: {
      pageSizes: [10, 20, 50, 100],
      pageSizeDefault: 10
    },
    userInfo: state.auth.userInfo,
  };
}

const dispatchToProps = (dispatch) => bindActionCreators({
  init: reconciliationRevenueActions.init,
  search: reconciliationRevenueActions.search,
  exportExcel: reconciliationRevenueActions.exportExcel,
  changeReconciliationStatus: reconciliationRevenueActions.changeReconciliationStatus,
  gotoDetail: reconciliationRevenueActions.gotoDetail,
}, dispatch);

export default connect(stateToProps, dispatchToProps)(withLocalize(ReconciliationRevenue));