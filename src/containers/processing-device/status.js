import React, { Component, } from "react";
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Translate, withLocalize } from "react-localize-redux";
import { Table, PageHeader, Row, Col, Button, Form, Select, Card, Switch, Modal } from 'antd';
import { globalProps } from "../../data";
import { processingDeviceActions } from "../../actions";
import moment from 'moment';
import AliveHistory from "./alive-history";

import {
  EyeFilled,
  SearchOutlined,
} from '@ant-design/icons';
const { Column } = Table;
const { Option } = Select;


class ProcessingDeviceStatus extends Component {
  state = {
    showAdvance: false,
    searchBody: {},
    sort: {},
    paginate: {
      pageIndex: 1,
      pageSize: 10,
    },
    exportSpinner: { loading: false },
    visibleModal: false,
    itemDevice: {},
  }
  form = React.createRef()
  formModal = React.createRef()

  componentDidMount() {
    this.props.init();
    this.onSearch({});
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
      let { searchStatus } = this.props;
      let searchBody = { ...this.form.current.getFieldsValue() };

      let data = {
        ...searchBody,
        paging: {
          ...paginate,
          pageIndex: 1
        }
      };

      searchStatus({ data });
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

      let { searchStatus } = this.props;
      let searchBody = this.form.current.getFieldsValue();

      let data = {
        ...searchBody,
        paging: {
          ...paginate
        },
        sort: sort
      };

      searchStatus({ data });
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
    let searchBody = { ...this.form.current.getFieldsValue() };
    let data = {
      ...searchBody,
      sort: sort
    }

    this.setState({ exportSpinner: { loading: true } });
    exportExcel({ data })
      .then(res => {
        this.setState({ exportSpinner: { loading: false, url: res.fileUrl } });
        this.downloadFile(res.fileUrl);
      }).catch(e => {
        this.setState({ exportSpinner: { loading: false } });
      });
  }

  downloadFile(url) {
    window.open(url);
  }

  toggleAdvanceSearch() {
    this.setState({
      showAdvance: !this.state.showAdvance,
    });
    this.onReset();
  }

  showModal(item) {
    this.setState({
      visibleModal: true,
      itemDevice: {
        ...item,
        fromDate: moment().subtract(1, "days"),
        toDate: moment()
      }
    });
  };

  hideModal = () => {
    this.setState({
      visibleModal: false
    });
  };

  onSearchAliveHistory() {
    this.setState({
      paginate: {
        ...this.state.paginate,
        pageIndex: 1
      },
      sort: {}
    }, () => {
      let { paginate } = this.state;
      let { searchAliveHistory } = this.props;
      let searchBody = { ...this.formModal.current.getFieldsValue() };

      let data = {
        ...searchBody,
        paging: {
          ...paginate,
          pageIndex: 1
        }
      };

      searchAliveHistory({ data });
    });
  }

  render() {
    let { paging, processingDeviceStatusList, deviceTypeList, operatingSystemList, connectStatusList, totalItem } = this.props;
    let { paginate, searchBody, exportSpinner, showAdvance, itemDevice } = this.state;
    return (
      <React.Fragment>
        <PageHeader
          title={<Translate id="PROCESSING_DEVICE.LIST_STATUS_MENU" />}
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
              {/* <Col {...globalProps.colHalf}>
                <Form.Item {...globalProps.formItem} label={<Translate id="PROCESSING_DEVICE.CODE" />}
                  name="code"
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col {...globalProps.colHalf}>
                <Form.Item {...globalProps.formItem} label={<Translate id="PROCESSING_DEVICE.NAME" />}
                  name="name"
                >
                  <Input />
                </Form.Item>
              </Col> */}
              {/* <Col {...globalProps.col}>
                <Form.Item
                  {...globalProps.formItem} label={<Translate id="PROCESSING_DEVICE.SERIAL_NUMBER" />}
                  name="serialNumber"
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col {...globalProps.col}>
                <Form.Item
                  {...globalProps.formItem} label={<Translate id="PROCESSING_DEVICE.MAC_ADDRESS" />}
                  name="macAddress"
                >
                  <Input />
                </Form.Item>
              </Col> */}
              <Col {...globalProps.col}>
                <Form.Item {...globalProps.formItem}
                  label={<Translate id="PROCESSING_DEVICE.CONNECTION_STATUS" />}
                  name="connectionStatus"
                >
                  <Select {...globalProps.selectSearch}>
                    {connectStatusList.map((k, i) =>
                      <Option value={k.code} key={i}>{k.name}</Option>
                    )}
                  </Select>
                </Form.Item>
              </Col>
              <Col {...globalProps.col}>
                <Form.Item {...globalProps.formItem}
                  label={<Translate id="PROCESSING_DEVICE.TYPE" />}
                  name="deviceType"
                >
                  <Select {...globalProps.selectSearch}>
                    {deviceTypeList.map((k, i) =>
                      <Option value={k.code} key={i}>{k.name}</Option>
                    )}
                  </Select>
                </Form.Item>
              </Col>
              <Col {...globalProps.col}>
                <Form.Item {...globalProps.formItem}
                  label={<Translate id="PROCESSING_DEVICE.OPERATING_SYSTEM" />}
                  name="operatingSystem"
                >
                  <Select {...globalProps.selectSearch}>
                    {operatingSystemList.map((k, i) =>
                      <Option value={k.code} key={i}>{k.name}</Option>
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
                <Button type="primary"
                  className="custom-btn-primary"
                  size="large"
                  loading={exportSpinner.loading} onClick={e => this.onExport()}>
                  <Translate id="EXPORT_EXCEL" />
                </Button>
              </Col>
            </Row>
          </Form>
        </Card>

        <div className="card-container">
          {processingDeviceStatusList &&
            <Table
              {...globalProps.table}
              dataSource={processingDeviceStatusList.map((k, i) => ({ ...k, key: i, index: (paginate.pageIndex - 1) * paginate.pageSize + i + 1 }))}
              onChange={this.changePaginate}
              pagination={
                {
                  pageSize: paginate.pageSize,
                  total: totalItem,
                  current: paginate.pageIndex,
                  showSizeChanger: true,
                  pageSizeOptions: paging.pageSizes,
                  locale: { items_per_page: "" },
                  showTotal: sum => <div>{sum} <Translate id="RESULT" /></div>
                }
              }
            >
              <Column {...globalProps.tableRow} title={<Translate id="INDEX" />} dataIndex="index" width={60} />
              <Column {...globalProps.tableRow} dataIndex="id" width={60}
                render={(val, record) =>
                  <Row gutter={8} style={{ flexWrap: "nowrap" }}>
                    <Col flex="32px">
                      <Button type="primary" icon={<EyeFilled />} shape="circle" onClick={() => this.showModal(record)} />
                    </Col>
                  </Row>
                }
              />
              <Column {...globalProps.tableRow} key="vendingCode" title={<Translate id="MACHINE_CODE" />} dataIndex="vendingCode" />
              <Column {...globalProps.tableRow} key="vendingName" title={<Translate id="MACHINE_NAME" />} dataIndex="vendingName" />
              <Column {...globalProps.tableRow} key="deviceType" title={<Translate id="PROCESSING_DEVICE.TYPE" />} dataIndex="deviceType" render={val => val ? <Translate id={`PROCESSING_DEVICE_TYPE.${val}`} /> : ""} />
              <Column {...globalProps.tableRow} key="operatingSystem" title={<Translate id="PROCESSING_DEVICE.OPERATING_SYSTEM" />} dataIndex="operatingSystem" render={val => val ? <Translate id={`PROCESSING_DEVICE_OPERATING_SYSTEM.${val}`} /> : ""} />
              <Column {...globalProps.tableRow} key="connectionStatus" title={<Translate id="PROCESSING_DEVICE.CONNECTION_STATUS" />} dataIndex="connectionStatus" render={val => val ? <Translate id={`CONNECTION_STATUS.${val}`} /> : ""} />
              {/* <Column {...globalProps.tableRow} key="code" title={<Translate id="PROCESSING_DEVICE.CODE" />} dataIndex="code" />
              <Column {...globalProps.tableRow} key="name" title={<Translate id="PROCESSING_DEVICE.NAME" />} dataIndex="name" /> */}
              {/* <Column {...globalProps.tableRow} key="serialNumber" title={<Translate id="PROCESSING_DEVICE.SERIAL_NUMBER" />} dataIndex="serialNumber" />
              <Column {...globalProps.tableRow} key="macAddress" title={<Translate id="PROCESSING_DEVICE.MAC_ADDRESS" />} dataIndex="macAddress" /> */}
            </Table>
          }
        </div>

        <Modal
          title={<Translate id="PROCESSING_DEVICE.LOST_CONNECT_HISTORY" />}
          visible={this.state.visibleModal}
          onCancel={this.hideModal}
          closable
          destroyOnClose
          width={700}
          footer={[
            <Button key="back" onClick={this.hideModal}>
              <span>
                <Translate id="CLOSE" />
              </span>
            </Button>
          ]}
        >
          <AliveHistory itemDevice={itemDevice} />
        </Modal>
      </React.Fragment >
    )
  }
}

const stateToProps = (state) => {
  return {
    paging: state.processingDevice.paging,
    processingDeviceStatusList: state.processingDevice.processingDeviceStatusList,
    deviceTypeList: state.processingDevice.deviceTypeList,
    operatingSystemList: state.processingDevice.operatingSystemList,
    connectStatusList: state.processingDevice.connectStatusList,
    totalItem: state.processingDevice.totalItem,
    totalItemHistory: state.processingDevice.totalItemHistory,
    aliveHistoryList: state.processingDevice.aliveHistoryList,
  };
}

const dispatchToProps = (dispatch) => bindActionCreators({
  init: processingDeviceActions.init,
  searchStatus: processingDeviceActions.searchStatus,
  exportExcel: processingDeviceActions.exportExcel,
  searchAliveHistory: processingDeviceActions.searchAliveHistory,
}, dispatch);

export default connect(stateToProps, dispatchToProps)(withLocalize(ProcessingDeviceStatus));