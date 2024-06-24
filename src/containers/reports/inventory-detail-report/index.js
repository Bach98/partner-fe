import React, { Component } from "react";
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Translate, withLocalize } from "react-localize-redux";
import { Table, PageHeader, Row, Col, Button, Form, Select, Card, Switch, Input, DatePicker } from 'antd';
import { globalProps, isAllow, PERMISSION } from "../../../data";
import { inventoryDetailReportActions } from "../../../actions";
import moment from "moment";
import {
  SearchOutlined,
} from '@ant-design/icons';
const { Column } = Table;
const { Option } = Select;

class InventoryDetailReport extends Component {
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

  changePaginate = (paginate, sorter) => {
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

  downloadFile(url) {
    window.open(url);
  }

  render() {
    let { vendingList, productList, locationList, addressTypeList, machineModelList, productTypeList,
      inventoryDetail, paging, translate } = this.props;
    let { searchBody, paginate, exportReport, showAdvance } = this.state;
    return (
      <React.Fragment>
        <PageHeader
          title={<Translate id="MACHINE_INVENTORY_DETAIL_REPORT" />}
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
              <Col {...globalProps.col3}>
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
            </Row>
            <Row {...globalProps.row}>
              <Col {...globalProps.col3}>
                <Form.Item {...globalProps.formItem}
                  label={<Translate id="PRODUCT" />}
                  name="productIdList"
                >
                  <Select {...globalProps.selectSearch} allowClear mode="multiple">
                    {productList.map((k, i) =>
                      <Option value={k.id} key={i}>{`${k.name}`}</Option>
                    )}
                  </Select>
                </Form.Item>
              </Col>
            </Row>
            <Row {...globalProps.row}>
              <Col {...globalProps.col}>
                <Input.Group size="large">
                  <Row gutter={8}>
                    <Col style={{ width: '49%' }}>
                      <Form.Item {...globalProps.formItem}
                        label={<Translate id="EXPIRE_DATE_FROM" />}
                        name="fromDate"
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
            </Row>
            {showAdvance ?
              <Row {...globalProps.row}>
                <Col {...globalProps.col}>
                  <Form.Item {...globalProps.formItem}
                    label={<Translate id="CATEGORY" />}
                    name="productTypeIdList"
                  >
                    <Select {...globalProps.selectSearch} allowClear mode="multiple">
                      {productTypeList.map((k, i) =>
                        <Option value={k.id} key={i}>{`${k.code} - ${k.name}`}</Option>
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
                    label={<Translate id="ADDRESS_TYPE" />}
                    name="addressTypeList"
                  >
                    <Select {...globalProps.selectSearch} allowClear mode="multiple">
                      {addressTypeList.map((k, i) =>
                        <Option value={k.code} key={i}>{`${k.name}`}</Option>
                      )}
                    </Select>
                  </Form.Item>
                </Col>
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
              </Row>
              : ""}
            {isAllow(PERMISSION.INVENTORY_DETAIL_REPORT.LIST) &&
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
                  {isAllow(PERMISSION.INVENTORY_DETAIL_REPORT.EXPORT) &&
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
          {isAllow(PERMISSION.INVENTORY_DETAIL_REPORT.LIST) &&
            <Table
              {...globalProps.table}
              dataSource={inventoryDetail.inventoryDetailList.map((k, i) => ({ ...k, index: i + 1, key: i }))}
              onChange={this.changePaginate}
              pagination={
                {
                  pageSize: paginate.pageSize,
                  total: inventoryDetail.totalItem,
                  current: paginate.pageIndex,
                  showSizeChanger: true,
                  pageSizeOptions: paging.pageSizes,
                  locale: { items_per_page: "" },
                  showTotal: sum => <div>{sum} <Translate id="RESULT" /></div>
                }
              }
            >
              <Column {...globalProps.tableRow} title={<Translate id="INDEX" />} dataIndex="index" width={60} />
              <Column {...globalProps.tableRow} key="machineCode" sorter='true' title={<Translate id="MACHINE_CODE" />} dataIndex="machineCode" />
              <Column {...globalProps.tableRow} key="machineName" sorter='true' title={<Translate id="MACHINE_NAME" />} dataIndex="machineName" />
              <Column {...globalProps.tableRow} key="locationType" sorter='true' title={<Translate id="LOCATION_TYPE" />} dataIndex="locationType" />
              <Column {...globalProps.tableRow} key="productCode" sorter='true' title={<Translate id="PRODUCT_CODE" />} dataIndex="productCode" />
              <Column {...globalProps.tableRow} key="productName" sorter='true' align="right" title={<Translate id="PRODUCT_NAME" />} dataIndex="productName" />
              <Column {...globalProps.tableRow} key="category" sorter='true' align="right" title={<Translate id="NATURE" />} dataIndex="category" />
              <Column {...globalProps.tableRow} key="productType" sorter='true' align="right" title={<Translate id="CATEGORY" />} dataIndex="productType" />
              <Column {...globalProps.tableRow} key="unitName" sorter='true' align="right" title={<Translate id="UNIT" />} dataIndex="unitName" />
              <Column {...globalProps.tableRow} key="quantitySum" sorter='true' title={<Translate id="STOCK_QUANTITY" />} dataIndex="quantitySum" type="NUMBER" />
              <Column {...globalProps.tableRow} key="expireDate" sorter='true' title={<Translate id="EXPIRE_DATE" />} dataIndex="expireDate" />
            </Table>
          }
        </div>

      </React.Fragment >
    )
  }
}

const stateToProps = (state) => {
  return {
    fromDate: state.inventoryDetailReport.fromDate,
    toDate: state.inventoryDetailReport.toDate,
    vendingList: state.inventoryDetailReport.vendingList,
    productList: state.inventoryDetailReport.productList,
    locationList: state.inventoryDetailReport.locationList,
    addressTypeList: state.inventoryDetailReport.addressTypeList,
    machineModelList: state.inventoryDetailReport.machineModelList,
    productTypeList: state.inventoryDetailReport.productTypeList,
    paging: state.inventoryDetailReport.paging,
    inventoryDetail: state.inventoryDetailReport.inventoryDetail
  };
}

const dispatchToProps = (dispatch) => bindActionCreators({
  init: inventoryDetailReportActions.init,
  search: inventoryDetailReportActions.search,
  exportExcel: inventoryDetailReportActions.exportExcel,
}, dispatch);

export default connect(stateToProps, dispatchToProps)(withLocalize(InventoryDetailReport));