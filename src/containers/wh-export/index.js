
import React, { Component } from "react";
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import moment from 'moment';
import { NavLink } from 'react-router-dom';
import { SearchOutlined, EyeFilled, PlusCircleOutlined } from '@ant-design/icons';
import { Translate, withLocalize } from "react-localize-redux";
import { Table, PageHeader, Row, Col, Button, Form, Input, Select, Card, DatePicker, TimePicker, Switch } from 'antd';
import { globalProps, PERMISSION, isAllow, rules } from "../../data";
import { whExportActions } from "../../actions";
import { LOCAL_PATH } from "../../constants";
const { Column } = Table;
const { Option } = Select;

class WhExport extends Component {
  state = {
    showAdvance: false,
    timeFromReadonly: false,
    timeToReadonly: false,
    searchBody: {},
    paginate: {
      pageIndex: 1,
      pageSize: 10,
    },
    exports: [],
    exportExcel: { loading: false },
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
    this.onSearch();
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
        },
      }
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
    let { exportExcel, exports } = this.props;
    let data = {
      warehouseReceiptList: exports,
      sort
    };
    this.setState({ exportExcel: { loading: true } });
    exportExcel(data)
      .then(res => {
        this.setState({ exportExcel: { loading: false, url: res.fileUrl } });
        this.downloadFile(res.fileUrl);
      }).catch(e => {
        this.setState({ exportExcel: { loading: false } });
      });
  }

  downloadFile(url) {
    window.open(url);
  }

  onGetSearchBody() {
    let body = { ...this.form.current.getFieldsValue() };
    if (body.dateFrom) {
      let dateFromFormat = body.dateFrom.format('YYYY-MM-DD');
      let timeFromFormat = '';
      if (body.timeFrom) {
        timeFromFormat = body.timeFrom.format('HH:mm:ss');
      }
      if (timeFromFormat === '') {
        timeFromFormat = '00:00:00';
      }
      let date = moment(`${dateFromFormat} ${timeFromFormat}`);
      body.dateFrom = date.format("YYYY-MM-DDTHH:mm:ss");
    }
    if (body.dateTo) {
      let toDateFormat = body.dateTo.format('YYYY-MM-DD');
      let timeToFormat = '';
      if (body.timeTo) {
        timeToFormat = body.timeTo.format('HH:mm:ss');
      }
      if (timeToFormat === '') {
        timeToFormat = '23:59:59';
      }
      let date = moment(`${toDateFormat} ${timeToFormat}`);
      body.dateTo = date.format("YYYY-MM-DDTHH:mm:ss");
    }
    return body;
  }

  componentDidUpdate(prevProps) {
    if (prevProps.paging.pageSizeDefault !== this.props.paging.pageSizeDefault) {
      this.changePaginate({ pageSize: this.props.paging.pageSizeDefault, pageIndex: this.state.paginate.pageIndex })
    }
  }

  changePaginate = (paging, filters, sorter) => {
    this.setState({
      paginate: {
        pageSize: paging.pageSize,
        pageIndex: paging.current
      },
      sort: {
        sortField: sorter.columnKey,
        sortType: !!sorter.order ? sorter.order === 'descend' ? 'DESC' : 'ASC' : undefined
      }
    }, () => {
      let { paginate, sort } = this.state;
      let { search } = this.props;
      let searchBody = this.onGetSearchBody();
      search({
        data: {
          ...searchBody,
          sort: sort,
          paging: paginate
        },
      });
    })
  }

  render() {
    let { exports, exportTypes, machines, locations, total, translate, products } = this.props;
    let { searchBody, exportExcel, paginate, showAdvance, timeFromReadonly, timeToReadonly } = this.state;

    return (
      <React.Fragment>
        <PageHeader
          title={<Translate id="WAREHOUSE_EXPORT_HEADER" />}
          ghost={false}
          extra={
            isAllow(PERMISSION.WAREHOUSE_EXPORT.EDIT) &&
            <Row {...globalProps.row}>
              <Col>
                <NavLink to={LOCAL_PATH.WAREHOUSE.EXPORT.DETAIL.replace(":id", "new")}>
                  <Button className="custom-btn-primary" type="primary">
                    <span>
                      <Translate id="CREATE" />
                    </span>
                    <PlusCircleOutlined />
                  </Button>
                </NavLink>
              </Col>
            </Row>
          }
        />

        {isAllow(PERMISSION.WAREHOUSE_EXPORT.LIST) &&
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
                {/* Máy */}
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
                  <Input.Group size="large">
                    <Row gutter={8}>
                      <Col style={{ width: '50%' }}>
                        <Form.Item {...globalProps.formItem}
                          label={<Translate id="DATE_FROM" />}
                          name="dateFrom"
                          initialValue={moment()}
                          rules={[rules.dateFromFilter]}
                        >
                          <DatePicker
                            format={translate("FORMAT_DATE")}
                            style={{ width: '100%' }}
                          />
                        </Form.Item>
                      </Col>
                      <Col style={{ width: '50%' }}>
                        <Form.Item {...globalProps.formItem}
                          label="&nbsp;"
                          name="timeFrom"
                        >
                          <TimePicker
                            style={{ width: '100%' }}
                            disabled={timeFromReadonly}
                          />
                        </Form.Item>
                      </Col>
                    </Row>
                  </Input.Group>
                </Col>
                <Col {...globalProps.col}>
                  <Input.Group size="large">
                    <Row gutter={8}>
                      <Col style={{ width: '50%' }}>
                        <Form.Item {...globalProps.formItem}
                          label={<Translate id="DATE_TO" />}
                          name="dateTo"
                          style={{ width: '100%' }}
                          initialValue={moment()}
                          rules={[rules.dateToFilter]}
                        >
                          <DatePicker
                            format={translate("FORMAT_DATE")}
                            style={{ width: '100%' }}
                          />
                        </Form.Item>
                      </Col>
                      <Col style={{ width: '50%' }}>
                        <Form.Item {...globalProps.formItem}
                          label="&nbsp;"
                          name="timeTo"
                        >
                          <TimePicker
                            disabled={timeToReadonly}
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
                  {/* Loại xuất */}
                  <Col {...globalProps.col}>
                    <Form.Item {...globalProps.formItem}
                      label={<Translate id="EXPORT_TYPE" />}
                      name="exportType"
                    >
                      <Select {...globalProps.selectSearch} allowClear>
                        {exportTypes.map((k, i) =>
                          <Option value={k.code} key={i}>
                            {k.name}
                          </Option>
                        )}
                      </Select>
                    </Form.Item>
                  </Col>
                  {/* Hàng hóa */}
                  <Col {...globalProps.col}>
                    <Form.Item {...globalProps.formItem}
                      label={<Translate id="PRODUCT" />}
                      name="productIds"
                    >
                      <Select {...globalProps.selectSearch} allowClear mode="multiple">
                        {products.map((k, i) =>
                          <Option value={k.id} key={i}>{k.name}</Option>
                        )}
                      </Select>
                    </Form.Item>
                  </Col>
                  {/* Mã phiếu */}
                  <Col {...globalProps.col}>
                    <Form.Item {...globalProps.formItem}
                      label={<Translate id="EXPORT_CODE" />}
                      name="code"
                    >
                      <Input />
                    </Form.Item>
                  </Col>
                </Row>
                : ""}

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
                  {isAllow(PERMISSION.WAREHOUSE_EXPORT.EXPORT) &&
                    <Button type="primary" size="large"
                      className="custom-btn-primary"
                      loading={exportExcel.loading} onClick={e => this.onExport()}>
                      <Translate id="EXPORT_EXCEL" />
                    </Button>
                  }
                </Col>
              </Row>
            </Form>
          </Card>
        }

        <div className="card-container">
          {isAllow(PERMISSION.WAREHOUSE_EXPORT.LIST) &&
            <Table
              {...globalProps.table}
              dataSource={exports.map((k, i) => ({ ...k, key: i, index: (paginate.pageIndex - 1) * paginate.pageSize + i + 1 }))}
              onChange={this.changePaginate}
              pagination={
                {
                  pageSize: paginate.pageSize,
                  total: total,
                  current: paginate.pageIndex,
                  showSizeChanger: true,
                  showTotal: sum => <div>{sum} <Translate id="RESULT" /></div>
                }
              }
            >
              {isAllow(PERMISSION.WAREHOUSE_IMPORT.DETAIL) &&
                <Column {...globalProps.tableRow} dataIndex="id" width={60}
                  render={(val, record) =>
                    <Row gutter={8} style={{ flexWrap: "nowrap" }}>
                      <Col flex="32px">
                        <NavLink
                          to={LOCAL_PATH.WAREHOUSE.EXPORT.DETAIL.replace(
                            ":id",
                            record.id
                          )}
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
              }
              <Column {...globalProps.tableRow} title={<Translate id="INDEX" />} dataIndex="index" width={60} />
              <Column {...globalProps.tableRow} key="code" sorter='true' title={<Translate id="WH_EXPORT_CODE" />} dataIndex="code" />
              <Column {...globalProps.tableRow} key="status" sorter='true'
                title={<Translate id="WH_EXPORT_STATUS" />}
                dataIndex="status"
                render={val => <Translate id={`WH_EXPORT_STATUS_${(val).toUpperCase()}`} />}
              />
              <Column {...globalProps.tableRow} key="exportType"
                title={<Translate id="WH_EXPORT_EXPORT_TYPE" />}
                dataIndex="exportType"
                render={val => <Translate id={`WH_EXPORT_EXPORT_TYPE_${(val).toUpperCase()}`} />}
              />
              <Column {...globalProps.tableRow} key="exportCode" sorter='true' title={<Translate id="WH_EXPORT_EXPORT_CODE" />} dataIndex="exportCode" />
              <Column {...globalProps.tableRow} key="qtySku" sorter='true' title={<Translate id="WH_EXPORT_QTY_SKU" />}
                render={val => val ? globalProps.inputNumber.formatter(val) : 0}
                align="right"
                dataIndex="qtySku" />
              <Column {...globalProps.tableRow} key="qtyExport" sorter='true' title={<Translate id="WH_EXPORT_QTY_EXPORT" />}
                render={val => val ? globalProps.inputNumber.formatter(val) : 0}
                align="right"
                dataIndex="qtyExport" />
              <Column {...globalProps.tableRow} key="totalValue" sorter='true' title={<Translate id="WH_EXPORT_TOTAL_VALUE" />}
                render={val => val ? <span style={{ color: "red" }}>{globalProps.inputNumberVND.formatter(val)}</span> : 0}
                align="right"
                dataIndex="totalValue" />
              <Column {...globalProps.tableRow} key="dateExport" sorter='true' title={<Translate id="WH_EXPORT_DATE_EXPORT" />} dataIndex="dateExport" />
              <Column {...globalProps.tableRow} key="userExport" sorter='true' title={<Translate id="WH_EXPORT_USER_EXPORT" />} dataIndex="userExport" />
            </Table>
          }
        </div>
      </React.Fragment >
    )
  }
}

const stateToProps = (state) => {
  return {
    exportTypes: state.whExport.exportTypes,
    machines: state.whExport.machines,
    products: state.whExport.products,
    locations: state.whImport.locations,
    code: state.whExport.code,
    paging: state.whExport.paging,
    exports: state.whExport.exports,
    total: state.whExport.total,
  };
}

const dispatchToProps = (dispatch) => bindActionCreators({
  init: whExportActions.init,
  search: whExportActions.search,
  exportExcel: whExportActions.exportExcel

}, dispatch);

export default connect(stateToProps, dispatchToProps)(withLocalize(WhExport));