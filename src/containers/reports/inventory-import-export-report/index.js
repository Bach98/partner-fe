import React, { Component } from "react";
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Translate, withLocalize } from "react-localize-redux";
import { Table, PageHeader, Row, Col, Button, Form, Select, Card, Input, Switch, DatePicker } from 'antd';
import { globalProps, isAllow, PERMISSION, rules } from "../../../data";
import { inventoryImportExportReportActions } from "../../../actions";
import moment from "moment";
import {
  SearchOutlined,
} from '@ant-design/icons';
const { Column, ColumnGroup } = Table;
const { Option } = Select;

class InventoryImportExportReport extends Component {
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
  }

  componentDidUpdate(prevProps) {
    let { fromDate, toDate } = this.props;
    if (fromDate && prevProps.fromDate !== fromDate) {
      this.form.current.setFieldsValue({
        fromDate: moment(fromDate)
      });
    }

    if (toDate && prevProps.toDate !== toDate) {
      this.form.current.setFieldsValue({
        toDate: moment(toDate),
      });
    }

    if (prevProps.paging.pageSizeDefault !== this.props.paging.pageSizeDefault) {
      this.changePaginate({ pageSize: this.props.paging.pageSizeDefault, pageIndex: this.state.paginate.pageIndex })
    }
  }

  onGetSearchBody() {
    let body = { ...this.form.current.getFieldsValue() };
    if (body.fromDate) {
      let dateFromFormat = body.fromDate.format('YYYY-MM-DD');
      let date = moment(`${dateFromFormat}`);
      body.fromDate = date.format("YYYY-MM-DD");
    }

    if (body.toDate) {
      let toDateFormat = body.toDate.format('YYYY-MM-DD');
      let date = moment(`${toDateFormat}`);
      body.toDate = date.format("YYYY-MM-DD");
    }

    return body;
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
    let { machines, products, machineModels, locations, locationAreaMachines, paging, inventory, fromDate, toDate, translate } = this.props;
    let { searchBody, paginate, exportReport, showAdvance } = this.state;
    return (
      <React.Fragment>
        <PageHeader
          title={<Translate id="INVENTORY_IMPORT_EXPORT_REPORT" />}
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
                <Input.Group size="large">
                  <Row gutter={8}>
                    <Col style={{ width: '49%' }}>
                      <Form.Item {...globalProps.formItem}
                        label={<Translate id="DATE_FROM" />}
                        name="fromDate"
                        initialValue={moment(fromDate)}
                        rules={[rules.dateFromFilter]}
                      >
                        <DatePicker
                          format={translate("FORMAT_DATE")}
                          style={{ width: '100%' }}
                        />
                      </Form.Item>
                    </Col>
                    <Col style={{ width: '2%', paddingLeft: '2px', paddingRight: '2px' }}>
                      <Form.Item {...globalProps.formItem}
                        label="&nbsp;"
                      >
                        -
                      </Form.Item>
                    </Col>
                    <Col style={{ width: '49%' }}>
                      <Form.Item {...globalProps.formItem}
                        label={<Translate id="DATE_TO" />}
                        name="toDate"
                        style={{ width: '100%' }}
                        initialValue={moment(toDate)}
                        rules={[rules.dateToFilter]}
                      >
                        <DatePicker
                          format={translate("FORMAT_DATE")}
                          style={{ width: '100%' }}
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                </Input.Group>
              </Col>
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
            {isAllow(PERMISSION.INVENTORY_IMPORT_REPORT_REPORT.INDEX) &&
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
                  <Button type="primary" size="large"
                    className="custom-btn-primary"
                    loading={exportReport.loading} onClick={() => this.onExport()}>
                    <Translate id="EXPORT_EXCEL" />
                  </Button>
                </Col>
              </Row>
            }
          </Form>
        </Card>
        <div className="card-container">
          {isAllow(PERMISSION.INVENTORY_IMPORT_REPORT_REPORT.INDEX) &&
            <Table
              {...globalProps.table}
              dataSource={inventory.inventoryList.map((k, i) => ({ ...k, index: i + 1, key: i }))}
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
              <Column {...globalProps.tableRow} key="machineCode" title={<Translate id="MACHINE_CODE" />} dataIndex="machineCode" />
              <Column {...globalProps.tableRow} key="machineName" title={<Translate id="MACHINE_INVENTORY_MACHINENAME" />} dataIndex="machineName" />
              <Column {...globalProps.tableRow} key="productCode" title={<Translate id="MACHINE_INVENTORY_PRODUCTCODE" />} dataIndex="productCode" />
              <Column {...globalProps.tableRow} key="productName" title={<Translate id="MACHINE_INVENTORY_PRODUCTNAME" />} dataIndex="productName" />
              <Column {...globalProps.tableRow} key="unitName" title={<Translate id="MACHINE_INVENTORY_UNITNAME" />} dataIndex="unitName" />
              <Column align="right" {...globalProps.tableRow} key="openingMachinesInventory" title={<Translate id="OPENING_MACHINE_INVENTORY" />} dataIndex="openingMachinesInventory" />
              <ColumnGroup title={<Translate id="IMPORT" />}>
                <Column align="right" {...globalProps.tableRow} key="totalImDirect" title={<Translate id="DIRECT" />} dataIndex="totalImDirect" />
                <Column align="right" {...globalProps.tableRow} key="totalImAdjustments" title={<Translate id="INSPECT" />} dataIndex="totalImAdjustments" />
              </ColumnGroup>
              <ColumnGroup title={<Translate id="EXPORT" />}>
                <Column align="right" {...globalProps.tableRow} key="totalExFromMachine" title={<Translate id="FROM_MACHINE" />} dataIndex="totalExFromMachine" />
                <Column align="right" {...globalProps.tableRow} key="totalExAdjustments" title={<Translate id="INSPECT" />} dataIndex="totalExAdjustments" />
                <Column align="right" {...globalProps.tableRow} key="totalExSales" title={<Translate id="SALES" />} dataIndex="totalExSales" />
              </ColumnGroup>
              <Column align="right" {...globalProps.tableRow} key="closingMachinesInventory" title={<Translate id="CLOSING_MACHINE_INVENTORY" />} dataIndex="closingMachinesInventory" />
              <Column {...globalProps.tableRow} key="locationAreaMachine" title={<Translate id="LOCATION_AREA" />} dataIndex="locationAreaMachine" />
            </Table>
          }
        </div>

      </React.Fragment >
    )
  }
}

const stateToProps = (state) => {
  return {
    machines: state.inventoryImportExportReport.machines,
    products: state.inventoryImportExportReport.products,
    machineModels: state.inventoryImportExportReport.machineModels,
    locations: state.inventoryImportExportReport.locations,
    locationAreaMachines: state.inventoryImportExportReport.locationAreaMachines,
    fromDate: state.inventoryImportExportReport.fromDate,
    toDate: state.inventoryImportExportReport.toDate,
    paging: state.inventoryImportExportReport.paging,
    inventory: state.inventoryImportExportReport.inventory
  };
}

const dispatchToProps = (dispatch) => bindActionCreators({
  init: inventoryImportExportReportActions.init,
  search: inventoryImportExportReportActions.search,
  exportExcel: inventoryImportExportReportActions.exportExcel,
}, dispatch);

export default connect(stateToProps, dispatchToProps)(withLocalize(InventoryImportExportReport));