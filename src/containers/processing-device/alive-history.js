import React, { Component } from "react";
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Translate, withLocalize } from "react-localize-redux";
import { Table, Row, Col, Button, Form, Input, DatePicker } from 'antd';
import { globalProps, RenderText, rules } from "../../data";
import { processingDeviceActions } from "../../actions";

import {
  SearchOutlined,
} from '@ant-design/icons';
const { Column } = Table;

class AliveHistory extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showAdvance: false,
      searchBody: {},
      sort: {},
      paginate: {
        pageIndex: 1,
        pageSize: 10,
      },
      exportSpinner: { loading: false },
      visibleModal: false,
      itemDevice: props.itemDevice,
    }
  }
  form = React.createRef()

  componentDidMount() {
    this.onSearchAliveHistory(this.state.itemDevice);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.paging.pageSizeDefault !== this.props.paging.pageSizeDefault) {
      this.changePaginate({ pageSize: this.props.paging.pageSizeDefault, pageIndex: this.state.paginate.pageIndex })
    }
  }

  changePaginate = (paginate, filters, sorter) => {
    this.setState({
      paginate: {
        pageSize: paginate.pageSize,
        pageIndex: paginate.current
      },
      itemDevice: this.state.itemDevice,
      sort: {
        sortField: sorter.columnKey,
        sortType: sorter.order === 'descend' ? 'DESC' : 'ASC'
      }
    }, () => {
      let { paginate, sort, itemDevice } = this.state;
      let { searchAliveHistory } = this.props;
      let data = {
        ...itemDevice,
        fromDate: itemDevice.fromDate.format("YYYY-MM-DDTHH:mm:ss"),
        toDate: itemDevice.toDate.format("YYYY-MM-DDTHH:mm:ss"),
        paging: {
          ...paginate
        },
        sort: sort
      };

      searchAliveHistory({ data });
    })
  }

  onSearchAliveHistory(body) {
    this.setState({
      paginate: {
        ...this.state.paginate,
        pageIndex: 1
      },
      itemDevice: body,
      sort: {}
    }, () => {
      let { paginate } = this.state;
      let { searchAliveHistory } = this.props;
      let data = {
        ...body,
        fromDate: body.fromDate.format("YYYY-MM-DDTHH:mm:ss"),
        toDate: body.toDate.format("YYYY-MM-DDTHH:mm:ss"),
        paging: {
          ...paginate,
          pageIndex: 1
        }
      };

      searchAliveHistory({ data });
    });
  }

  render() {
    let { paging, disconnetHistoryList, totalItemHistory } = this.props;
    let { paginate, itemDevice } = this.state;
    return (
      <React.Fragment>
        <Form
          labelAlign="left"
          layout="vertical"
          initialValues={itemDevice}
          onFinish={e => this.onSearchAliveHistory(e)}
          {...globalProps.form}
          ref={this.form}
          key={itemDevice.code}
        >
          <Row {...globalProps.row}>
            <Col {...globalProps.colHalf}>
              <Form.Item {...globalProps.formItem}
                name="appType"
                hidden
              >
                <Input disabled={true} />
              </Form.Item>
              <Form.Item {...globalProps.formItem}
                name="deviceType"
                hidden
              >
                <Input disabled={true} />
              </Form.Item>
              <Form.Item {...globalProps.formItem}
                name="masterProcessingDeviceId"
                hidden
              >
                <Input disabled={true} />
              </Form.Item>
              <Form.Item {...globalProps.formItem}
                label={<Translate id="PROCESSING_DEVICE.NAME" />}
                name="name"
              >
                <Input disabled={true} />
              </Form.Item>
            </Col>
            <Col {...globalProps.colHalf}>
              <Form.Item {...globalProps.formItem}
                label={<Translate id="PROCESSING_DEVICE.OPERATING_SYSTEM" />}
                name="operatingSystem"
              >
                <Input disabled={true} />
              </Form.Item>
            </Col>
            <Col {...globalProps.col3}>
              <Form.Item {...globalProps.formItem}
                label={<Translate id="MACHINE_NAME" />}
                name="vendingName"
              >
                <Input disabled={true} />
              </Form.Item>
            </Col>
            <Col {...globalProps.colHalf}>
              <Form.Item {...globalProps.formItem}
                label={<Translate id="DATE_FROM" />}
                name="fromDate"
                rules={[rules.dateFromFilter7days]}
              >
                <DatePicker
                  format="DD/MM/YYYY HH:mm:ss"
                  showTime={true}
                  style={{ width: '100%' }}
                />
              </Form.Item>
            </Col>
            <Col {...globalProps.colHalf}>
              <Form.Item {...globalProps.formItem}
                label={<Translate id="DATE_TO" />}
                name="toDate"
                rules={[rules.dateToFilter7days]}
              >
                <DatePicker
                  format="DD/MM/YYYY HH:mm:ss"
                  showTime={true}
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
                size="middle"
              >
                <span>
                  <Translate id="SEARCH" />
                </span>
                <SearchOutlined />
              </Button>
            </Col>
          </Row>
        </Form>

        <div className="card-container">
          {disconnetHistoryList &&
            <Table
              {...globalProps.table}
              dataSource={disconnetHistoryList.map((k, i) => ({ ...k, key: i, index: (paginate.pageIndex - 1) * paginate.pageSize + i + 1 }))}
              onChange={this.changePaginate}
              pagination={
                {
                  pageSize: paginate.pageSize,
                  total: totalItemHistory,
                  current: paginate.pageIndex,
                  showSizeChanger: true,
                  pageSizeOptions: paging.pageSizes,
                  locale: { items_per_page: "" },
                  showTotal: sum => <div>{sum} <Translate id="RESULT" /></div>
                }
              }
            >
              <Column {...globalProps.tableRow} title={<Translate id="INDEX" />} dataIndex="index" width={60} />
              <Column {...globalProps.tableRow} key="fromDate" title={<Translate id="DATE_FROM" />} dataIndex="fromDate" render={(val) => <RenderText value={val} type="DATETIME" />} />
              <Column {...globalProps.tableRow} key="toDate" title={<Translate id="DATE_TO" />} dataIndex="toDate" render={(val) => <RenderText value={val} type="DATETIME" />} />
              <Column {...globalProps.tableRow} key="totalTime" title={<Translate id="OFF_TIME" />} dataIndex="totalTime" />
            </Table>
          }
        </div>
      </React.Fragment >
    )
  }
}

const stateToProps = (state) => {
  return {
    paging: state.processingDevice.paging,
    totalItemHistory: state.processingDevice.totalItemHistory,
    disconnetHistoryList: state.processingDevice.disconnetHistoryList,
  };
}

const dispatchToProps = (dispatch) => bindActionCreators({
  searchAliveHistory: processingDeviceActions.searchAliveHistory,
}, dispatch);

export default connect(stateToProps, dispatchToProps)(withLocalize(AliveHistory));