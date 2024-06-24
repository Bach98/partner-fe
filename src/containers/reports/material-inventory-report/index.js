import React, { Component } from "react";
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Translate } from "react-localize-redux";
import { Table, PageHeader, Row, Col, Button, Form, Select, Card, Switch } from 'antd';
import { globalProps, isAllow, PERMISSION } from "../../../data";
import { materialInventoryReportActions } from "../../../actions";
import {
  SearchOutlined,
} from '@ant-design/icons';
const { Column } = Table;
const { Option } = Select;

class MaterialInventoryReport extends Component {
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
          title={<Translate id="MACHINE_MATERIAL_INVENTORY_REPORT" />}
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
              </Row>
              : ""}
            {isAllow(PERMISSION.MATERIAL_INVENTORY_REPORT.LIST) &&
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
                  {isAllow(PERMISSION.MATERIAL_INVENTORY_REPORT.EXPORT) &&
                    <Button type="primary" size="large"
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
          {isAllow(PERMISSION.MATERIAL_INVENTORY_REPORT.LIST) &&
            <Table
              {...globalProps.table}
              dataSource={inventory.inventories.map((k, i) => {
                k.index = (paginate.pageIndex - 1) * paginate.pageSize + i + 1;
                k.key = k.index;
                return k;
              })}
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
              <Column {...globalProps.tableRow} key="locationArea" sorter='true' title={<Translate id="LOCATION_AREA" />} dataIndex="locationArea" />
              <Column {...globalProps.tableRow} key="productName" sorter='true' title={<Translate id="MACHINE_INVENTORY_PRODUCTNAME" />} dataIndex="productName" />
              <Column {...globalProps.tableRow} key="unitName" sorter='true' title={<Translate id="MACHINE_INVENTORY_UNITNAME" />} dataIndex="unitName" />
              <Column {...globalProps.tableRow} key="quantity" sorter='true' title={<Translate id="MACHINE_MATERIAL_INVENTORY_QUANTITY" />} dataIndex="quantity" showSorterTooltip={false} />
              <Column {...globalProps.tableRow} key="machineCode" sorter='true' title={<Translate id="MACHINE_CODE" />} dataIndex="machineCode" />
              <Column {...globalProps.tableRow} key="machineModelName" sorter='true' title={<Translate id="MACHINE_MODEL" />} dataIndex="machineModelName" />
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
    machines: state.materialInventoryReport.machines,
    products: state.materialInventoryReport.products,
    machineModels: state.materialInventoryReport.machineModels,
    addressTypes: state.materialInventoryReport.addressTypes,
    locations: state.materialInventoryReport.locations,
    locationAreaMachines: state.materialInventoryReport.locationAreaMachines,
    paging: state.materialInventoryReport.paging,
    inventory: state.materialInventoryReport.inventory
  };
}

const dispatchToProps = (dispatch) => bindActionCreators({
  init: materialInventoryReportActions.init,
  search: materialInventoryReportActions.search,
  exportExcel: materialInventoryReportActions.exportExcel,
}, dispatch);

export default connect(stateToProps, dispatchToProps)(MaterialInventoryReport);