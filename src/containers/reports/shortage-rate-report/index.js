import React, { Component } from "react";
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Translate } from "react-localize-redux";
import { Table, PageHeader, Row, Col, Button, Form, Select, Card, Tooltip, Switch, Input } from 'antd';
import { globalProps, isAllow, PERMISSION, RenderText } from "../../../data";
import { shortageRateReportActions } from "../../../actions";
import {
  SearchOutlined,
} from '@ant-design/icons';
import { NavLink } from "react-router-dom";
import { LOCAL_PATH } from "../../../constants";


const { Column } = Table;
const { Option } = Select;

class ShortageRateReport extends Component {
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
      pageSize: 10,
    },
    exportReport: { loading: false },
    sort: {}
  }
  form = React.createRef()

  componentDidMount() {
    this.props.init();
    this.onSearch();
  }

  toggleAdvanceSearch() {
    this.setState({
      showAdvance: !this.state.showAdvance,
      timeFromReadonly: false,
      timeToReadonly: false
    });
    this.onReset();
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

  shortageRateFromChange(e) {
    if (!e.target.value || e.target.value < 0) {
      this.form.current.setFieldsValue({
        shortageRateFrom: 0,
      });
    } else if (e.target.value > 100) {
      this.form.current.setFieldsValue({
        shortageRateFrom: 100,
      });
    }
  }

  shortageRateToChange(e) {
    if (!e.target.value || e.target.value < 0) {
      this.form.current.setFieldsValue({
        shortageRateTo: 100,
      });
    } else if (e.target.value > 100) {
      this.form.current.setFieldsValue({
        shortageRateTo: 100,
      });
    }
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
    let { machines, products, addressTypes, locations, locationAreaMachines, machineModels, shortageRateFrom, shortageRateTo, categories,
      statusMaintenance, paging, inventory } = this.props;
    let { searchBody, paginate, exportReport, showAdvance } = this.state;
    return (
      <React.Fragment>
        <PageHeader
          title={<Translate id="MACHINE_SHORTAGE_RATE_REPORT" />}
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
                    name="locationTypes"
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
                    label={<Translate id="CATEGORY" />}
                    name="categoryIds"
                  >
                    <Select {...globalProps.selectSearch} allowClear mode="multiple">
                      {categories.map((k, i) =>
                        <Option value={k.id} key={i}>{`${k.name}`}</Option>
                      )}
                    </Select>
                  </Form.Item>
                </Col>
                <Col {...globalProps.col}>
                  <Form.Item {...globalProps.formItem}
                    label={<Translate id="MANCHINE_PRODUCT" />}
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
                  <Input.Group size="medium">
                    <Row gutter={8}>
                      <Col style={{ width: '50%' }}>
                        <Form.Item {...globalProps.formItem}
                          label={<Translate id="SHORTAGE_RATE_FROM" />}
                          name="shortageRateFrom"
                          initialValue={shortageRateFrom}
                        >
                          <Input defaultValue={0} onBlur={e => this.shortageRateFromChange(e)} />
                        </Form.Item>
                      </Col>
                      <Col style={{ width: '50%' }}>
                        <Form.Item {...globalProps.formItem}
                          label="&nbsp;"
                          name="shortageRateTo"
                          initialValue={shortageRateTo}
                        >
                          <Input defaultValue={100} onBlur={e => this.shortageRateToChange(e)} />
                        </Form.Item>
                      </Col>
                    </Row>
                  </Input.Group>
                </Col>
                <Col {...globalProps.col}>
                  <Form.Item {...globalProps.formItem}
                    label={<Translate id="MANCHINE_STATUS_MAINTENANCE" />}
                    name="statusMaintenance"
                  >
                    <Select {...globalProps.selectSearch} allowClear mode="multiple">
                      {statusMaintenance.map((k, i) =>
                        <Option value={k.code} key={i}>
                          <Translate id={k.code} />
                        </Option>
                      )}
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
              :
              <Row hidden>
                <Col {...globalProps.col}>
                  <Input.Group size="medium">
                    <Row gutter={8}>
                      <Col style={{ width: '50%' }}>
                        <Form.Item {...globalProps.formItem}
                          label={<Translate id="SHORTAGE_RATE_FROM" />}
                          name="shortageRateFrom"
                          initialValue={shortageRateFrom}
                        >
                          <Input defaultValue={0} onBlur={e => this.shortageRateFromChange(e)} />
                        </Form.Item>
                      </Col>
                      <Col style={{ width: '50%' }}>
                        <Form.Item {...globalProps.formItem}
                          label="&nbsp;"
                          name="shortageRateTo"
                          initialValue={shortageRateTo}
                        >
                          <Input defaultValue={100} onBlur={e => this.shortageRateToChange(e)} />
                        </Form.Item>
                      </Col>
                    </Row>
                  </Input.Group>
                </Col>
              </Row>
            }

            {isAllow(PERMISSION.SHORTAGE_RATE_REPORT.LIST) &&
              <Row {...globalProps.row} justify="center">
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
                  {isAllow(PERMISSION.SHORTAGE_RATE_REPORT.EXPORT) &&
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
          {isAllow(PERMISSION.SHORTAGE_RATE_REPORT.LIST) &&
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
              {<Column {...globalProps.tableRow} title={<Translate id="REQUIRE_EXPORT" />} dataIndex="index" render={(val, record) =>
                <NavLink target="_blank" to={LOCAL_PATH.WAREHOUSE.SHORTAGE_RATE.PRINT + "?machineIds=" + record.vendingId}>In</NavLink>
              } />}
              <Column {...globalProps.tableRow} key="vendingName" sorter='true' title={<Translate id="MACHINE_INVENTORY_MACHINENAME" />} dataIndex="vendingName" />
              <Column {...globalProps.tableRow} key="locationArea" sorter='true' title={<Translate id="LOCATION_AREA" />} dataIndex="locationArea" />
              <Column {...globalProps.tableRow} key="shortageRate" sorter='true' title={<Tooltip title={<Translate id="MACHINE_INVENTORY_SHORTAGERATE_TOOLTIP" />}><span><Translate id="MACHINE_INVENTORY_SHORTAGERATE" /></span></Tooltip>} dataIndex="shortageRate" render={val => <RenderText value={val} type="PERCENT" />} showSorterTooltip={false} />
              <Column {...globalProps.tableRow} key="quantity" sorter='true' title={<Tooltip title={"Tổng số lượng tồn còn hạn sử dụng của tất cả các hàng hóa trong máy"}><span><Translate id="MACHINE_INVENTORY_QUANTITY" /></span></Tooltip>} dataIndex="quantity" showSorterTooltip={false} />
              <Column {...globalProps.tableRow} key="quantityExpired" sorter='true' title={<Tooltip title={"Tổng số lượng tồn hết hạn sử dụng của tất cả các hàng hóa trong máy"}><span><Translate id="MACHINE_INVENTORY_QUANTITYEXPIRED" /></span></Tooltip>} dataIndex="quantityExpired" showSorterTooltip={false} />
              <Column {...globalProps.tableRow} key="maxQuantity" sorter='true' title={<Tooltip title={"Tổng thông số “Số lượng fill tối đa” của các line/ống nguyên liệu"}><span><Translate id="MACHINE_INVENTORY_MAXQUANTITY" /></span></Tooltip>} dataIndex="maxQuantity" showSorterTooltip={false} />
              <Column {...globalProps.tableRow} key="fillQuantity" sorter='true' title={<Tooltip title={"Tổng số lượng layout - Tổng số lượng tồn còn hạn sử dụng"}><span><Translate id="MACHINE_INVENTORY_FILLQUANTITY" /></span></Tooltip>} dataIndex="fillQuantity" showSorterTooltip={false} />
              <Column {...globalProps.tableRow} key="vendingCode" sorter='true' title={<Translate id="MACHINE_CODE" />} dataIndex="vendingCode" />
              <Column {...globalProps.tableRow} key="machineModelName" sorter='true' title={<Translate id="MACHINE_MODEL" />} dataIndex="machineModelName" />
              <Column {...globalProps.tableRow} key="locationName" sorter='true' title={<Translate id="LOCATION" />} dataIndex="locationName" />
              <Column {...globalProps.tableRow} dataIndex="index" render={(val, record) => <NavLink to={LOCAL_PATH.WAREHOUSE.INVENTORY.INDEX + "?machineIds=" + record.vendingId}><Translate id="DETAIL" /></NavLink>} />
            </Table>
          }
        </div>
      </React.Fragment >
    )
  }
}

const stateToProps = (state) => {
  return {
    machines: state.shortageRateReport.machines,
    products: state.shortageRateReport.products,
    addressTypes: state.shortageRateReport.addressTypes,
    locations: state.shortageRateReport.locations,
    locationAreaMachines: state.shortageRateReport.locationAreaMachines,
    machineModels: state.shortageRateReport.machineModels,
    suppliers: state.shortageRateReport.suppliers,
    categories: state.shortageRateReport.categories,
    statusBusiness: state.shortageRateReport.statusBusiness,
    statusMaintenance: state.shortageRateReport.statusMaintenance,
    statusUsingGoods: state.shortageRateReport.statusUsingGoods,
    statusBusinessGoods: state.shortageRateReport.statusBusinessGoods,
    shortageRateFrom: state.shortageRateReport.shortageRateFrom,
    shortageRateTo: state.shortageRateReport.shortageRateTo,
    paging: state.shortageRateReport.paging,
    inventory: state.shortageRateReport.inventory
  };
}

const dispatchToProps = (dispatch) => bindActionCreators({
  init: shortageRateReportActions.init,
  search: shortageRateReportActions.search,
  exportExcel: shortageRateReportActions.exportExcel,
}, dispatch);

export default connect(stateToProps, dispatchToProps)(ShortageRateReport);