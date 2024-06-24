import React, { Component } from "react";
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Translate } from "react-localize-redux";
import { Table, PageHeader, Row, Col, Button, Form, Select, Card, Tooltip, Switch } from 'antd';
import { globalProps, isAllow, PERMISSION, RenderText } from "../../../data";
import { inventoryReportActions } from "../../../actions";
import {
  SearchOutlined,
} from '@ant-design/icons';
const { Column } = Table;
const { Option } = Select;

class InventoryReport extends Component {
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
    sort: {}
  }
  form = React.createRef()

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
    let search = this.props.location.search;
    if (search) {
      let query = new URLSearchParams(search);
      let id = query.get("machineIds");
      if (id) {
        this.form.current.setFieldsValue({ machineIds: [Number(id)] });
      }
    }

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

  render() {
    let { machines, products, machineModels, addressTypes, locations, locationAreaMachines, paging, inventory } = this.props;
    let { searchBody, paginate, exportReport, showAdvance } = this.state;
    return (
      <React.Fragment>
        <PageHeader
          title={<Translate id="MACHINE_INVENTORY_REPORT" />}
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
                  label={<Translate id="PRODUCT" />}
                  name="productIds"
                >
                  <Select {...globalProps.selectSearch} allowClear mode="multiple">
                    {products.map((k, i) =>
                      <Option value={k.id} key={i}>{`${k.name}`}</Option>
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
            </Row>
            {showAdvance ?
              <Row {...globalProps.row}>
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
              </Row>
              : ""}
            {isAllow(PERMISSION.INVENTORY_REPORT.LIST) &&
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
                  {isAllow(PERMISSION.INVENTORY_REPORT.EXPORT) &&
                    <Button type="primary"
                      size="large"
                      className="custom-btn-primary"
                      loading={exportReport.loading} onClick={() => this.onExport()}>
                      <Translate id="EXPORT_EXCEL" />
                    </Button>
                  }
                </Col>
              </Row>
            }
          </Form>
        </Card>
        <div className="card-container">
          {isAllow(PERMISSION.INVENTORY_REPORT.LIST) &&
            <Table
              {...globalProps.table}
              dataSource={inventory.inventories.map((k, i) => ({ ...k, index: i + 1, key: i }))}
              onChange={this.changePaginate}
              pagination={
                {
                  pageSize: paginate.pageSize,
                  total: inventory.totalItem,
                  current: paginate.pageIndex,
                  showSizeChanger: true,
                  pageSizeOptions: paging.pageSizes,
                  locale: { items_per_page: "" },
                  showTotal: sum => <div>{sum} <Translate id="RESULT" /></div>
                }
              }
            >
              <Column {...globalProps.tableRow} title={<Translate id="INDEX" />} dataIndex="index" width={60} />
              <Column {...globalProps.tableRow} key="machineName" sorter='true' title={<Translate id="MACHINE_INVENTORY_MACHINENAME" />} dataIndex="machineName" />
              <Column {...globalProps.tableRow} key="productCode" sorter='true' title={<Translate id="MACHINE_INVENTORY_PRODUCTCODE" />} dataIndex="productCode" />
              <Column {...globalProps.tableRow} key="productName" sorter='true' title={<Translate id="MACHINE_INVENTORY_PRODUCTNAME" />} dataIndex="productName" />
              <Column {...globalProps.tableRow} key="unitName" sorter='true' title={<Translate id="MACHINE_INVENTORY_UNITNAME" />} dataIndex="unitName" />
              <Column {...globalProps.tableRow} key="quantity" sorter='true' align="right" title={<Tooltip title={"Tổng số lượng tồn còn hạn sử dụng của tất cả các hàng hóa trong máy"}><span><Translate id="MACHINE_INVENTORY_QUANTITY" /></span></Tooltip>} dataIndex="quantity" showSorterTooltip={false} render={val => val ? globalProps.inputNumber.formatter(val) : 0} />
              <Column {...globalProps.tableRow} key="quantityExpired" sorter='true' align="right" title={<Tooltip title={"Tổng số lượng tồn hết hạn sử dụng của tất cả các hàng hóa trong máy"}><span><Translate id="MACHINE_INVENTORY_QUANTITYEXPIRED" /></span></Tooltip>} dataIndex="quantityExpired" showSorterTooltip={false} render={val => val ? globalProps.inputNumber.formatter(val) : 0} />
              <Column {...globalProps.tableRow} key="maxQuantity" sorter='true' align="right" title={<Tooltip title={"Tổng thông số “Số lượng fill tối đa” của các line/ống nguyên liệu"}><span><Translate id="MACHINE_INVENTORY_MAXQUANTITY" /></span></Tooltip>} dataIndex="maxQuantity" showSorterTooltip={false} render={val => val ? globalProps.inputNumber.formatter(val) : 0} />
              <Column {...globalProps.tableRow} key="fillQuantity" sorter='true' align="right" title={<Tooltip title={"Tổng số lượng layout - Tổng số lượng tồn còn hạn sử dụng"}><span><Translate id="MACHINE_INVENTORY_FILLQUANTITY" /></span></Tooltip>} dataIndex="fillQuantity" showSorterTooltip={false} render={val => val ? globalProps.inputNumber.formatter(val) : 0} />
              <Column {...globalProps.tableRow} key="shortageRate" sorter='true' title={<Tooltip title={<Translate id="MACHINE_INVENTORY_SHORTAGERATE_TOOLTIP" />}><span><Translate id="MACHINE_INVENTORY_SHORTAGERATE" /></span></Tooltip>} dataIndex="shortageRate" render={val => <RenderText value={val} type="PERCENT" />} showSorterTooltip={false} />
              <Column {...globalProps.tableRow} key="machineCode" sorter='true' title={<Translate id="MACHINE_CODE" />} dataIndex="machineCode" />
              <Column {...globalProps.tableRow} key="machineModelName" sorter='true' title={<Translate id="MACHINE_MODEL" />} dataIndex="machineModelName" />
              <Column {...globalProps.tableRow} key="locationArea" sorter='true' title={<Translate id="LOCATION_AREA" />} dataIndex="locationArea" />
              <Column {...globalProps.tableRow} key="locationName" sorter='true' title={<Translate id="LOCATION" />} dataIndex="locationName" />
            </Table>
          }
        </div>

      </React.Fragment >
    )
  }
}

const stateToProps = (state) => {
  return {
    machines: state.inventoryReport.machines,
    products: state.inventoryReport.products,
    machineModels: state.inventoryReport.machineModels,
    addressTypes: state.inventoryReport.addressTypes,
    locations: state.inventoryReport.locations,
    locationAreaMachines: state.inventoryReport.locationAreaMachines,
    paging: state.inventoryReport.paging,
    inventory: state.inventoryReport.inventory
  };
}

const dispatchToProps = (dispatch) => bindActionCreators({
  init: inventoryReportActions.init,
  search: inventoryReportActions.search,
  exportExcel: inventoryReportActions.exportExcel,
}, dispatch);

export default connect(stateToProps, dispatchToProps)(InventoryReport);