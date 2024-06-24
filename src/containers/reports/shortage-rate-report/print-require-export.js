import React, { Component } from "react";
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Translate } from "react-localize-redux";
import { Table, Row, Col, Form } from 'antd';
import { globalProps } from "../../../data";
import { inventoryReportActions } from "../../../actions";
import moment from 'moment';

const { Column } = Table;

class RequireExportChild extends Component {
  state = {
    currentDate: moment().format("DD/MM/YYYY HH:mm:ss")
  }

  componentDidMount() {
    window.print();
  };

  render() {
    let { lstInventoryDetail } = this.props;
    let { currentDate } = this.state;
    let firstData = (lstInventoryDetail && lstInventoryDetail.length > 0) ? lstInventoryDetail[0] : [];

    return (
      <div id="print">
        <Form>
          <h2 className="bold-center-text">PHIẾU YÊU CẦU XUẤT HÀNG</h2>
          <Row {...globalProps.row}>
            <Col span={4}>
              <span>Ngày yêu cầu</span>
            </Col>
            <Col span={16}>
              <span>{currentDate}</span>
            </Col>
          </Row>
          <Row {...globalProps.row}>
            <Col span={4}>
              <span>Mã máy</span>
            </Col>
            <Col span={16}>
              <span>{firstData.machineCode}</span>
            </Col>
          </Row>
          <Row {...globalProps.row}>
            <Col span={4}>
              <span>Địa điểm máy</span>
            </Col>
            <Col span={16}>
              <span>{firstData.locationName}</span>
            </Col>
          </Row>
          <Row {...globalProps.row}>
            <Col span={4}>
              <span>Địa chỉ</span>
            </Col>
            <Col span={16}>
              <span>{firstData.address}</span>
            </Col>
          </Row>
          <Row {...globalProps.row}>
            <Col span={4}>
              <span>Vị trí máy</span>
            </Col>
            <Col span={16}>
              <span>{firstData.locationArea}</span>
            </Col>
          </Row>
        </Form>
        <Table
          {...globalProps.table}
          pagination={false}
          dataSource={lstInventoryDetail.map((k, i) => ({ ...k, index: i + 1, key: i }))}
        >
          <Column {...globalProps.tableRow} title={<Translate id="INDEX" />} dataIndex="index" width={60} />
          <Column {...globalProps.tableRow} key="productCode" sorter='true' title={<Translate id="MACHINE_INVENTORY_PRODUCTCODE" />} dataIndex="productCode" />
          <Column {...globalProps.tableRow} key="productName" sorter='true' title={<Translate id="MACHINE_INVENTORY_PRODUCTNAME" />} dataIndex="productName" />
          <Column {...globalProps.tableRow} key="unitName" sorter='true' title={<Translate id="MACHINE_INVENTORY_UNITNAME" />} dataIndex="unitName" />
          <Column {...globalProps.tableRow} key="unitName" sorter='true' title={<Translate id="NUMBER_OF_REQUEST" />} dataIndex="fillQuantity" />
        </Table>
      </div >
    )
  }
}

class RequireExport extends Component {
  form = React.createRef();
  state = {
    showAdvance: false,
    timeFromReadonly: false,
    timeToReadonly: false,
    searchBody: {
      shortageRateFrom: 0,
      shortageRateTo: 100
    },
    paginate: {
      pageIndex: 1,
      pageSize: 1000,
    },
    exportReport: { loading: false },
    sort: {},
    currentDate: moment().format("DD/MM/YYYY HH:mm:ss")
  }

  componentDidMount() {
    let search = this.props.location.search;
    let machineIds = [];
    if (search) {
      let query = new URLSearchParams(search);
      let id = query.get("machineIds");
      if (id) {
        machineIds = [Number(id)];
      }
    }

    this.setState({
      paginate: {
        ...this.state.paginate,
        pageIndex: 1
      },
      sort: {}
    }, () => {
      let { paginate } = this.state;
      let body = {
        machineIds: machineIds
      }
      let data = {
        ...body,
        paging: {
          ...paginate,
          pageIndex: 1
        }
      };
      this.props.getInventoryDetail({ data });
      document.getElementsByClassName("main-sider")[0].style.display = "none";
      document.getElementsByClassName("main-header")[0].style.display = "none";
    });
  }

  render() {
    let { lstInventoryDetail } = this.props;
    if (lstInventoryDetail && lstInventoryDetail.length) {
      return <RequireExportChild lstInventoryDetail={lstInventoryDetail} />
    } else {
      return <div />
    }
  }
}

const stateToProps = (state) => {
  return {
    lstInventoryDetail: state.shortageRateReport.lstInventoryDetail,
  };
}

const dispatchToProps = (dispatch) => bindActionCreators({
  getInventoryDetail: inventoryReportActions.getInventoryDetail,
}, dispatch);

export default connect(stateToProps, dispatchToProps)(RequireExport);