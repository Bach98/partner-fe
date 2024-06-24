import React, { Component } from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { Translate, withLocalize } from "react-localize-redux";
import { Card, Button, Row, Col, Table, PageHeader, Form, Input, Select, Space, DatePicker, Switch } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { globalProps, rules } from "../../data";
import { promotionActions } from "../../actions";
import moment from "moment";

const { Column, ColumnGroup } = Table;
const { Option } = Select;

class PrmotionUserList extends Component {
  state = {
    showAdvance: false,
    timeFromReadonly: false,
    timeToReadonly: false,
    searchBody: {},
    paginate: {
      pageIndex: 1,
      pageSize: 10,
    },
    imports: [],
    exportImport: { loading: false },
    sort: {},
    exportLoading: { loading: false },
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

  onSearch() {
    this.setState({
      paginate: {
        ...this.state.paginate,
        pageIndex: 1
      },
      sort: {}
    }, () => {
      let { paginate, sort } = this.state;
      let { searchUserList } = this.props;
      let searchBody = { ...this.form.current.getFieldsValue() };
      let data = {
        ...searchBody,
        fromDate: searchBody.fromDate ? searchBody.fromDate.format("YYYY-MM-DDTHH:mm:ss") : "",
        toDate: searchBody.toDate ? searchBody.toDate.format("YYYY-MM-DDTHH:mm:ss") : "",
        paging: {
          ...paginate,
          pageIndex: 1
        },
        sort: sort
      };
      console.log(data);
      searchUserList({ data });
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
      let { searchUserList } = this.props;
      let searchBody = this.onGetSearchBody();
      let data = {
        ...searchBody,
        fromDate: searchBody.fromDate ? searchBody.fromDate.format("YYYY-MM-DDTHH:mm:ss") : "",
        toDate: searchBody.toDate ? searchBody.toDate.format("YYYY-MM-DDTHH:mm:ss") : "",
        paging: {
          ...paginate,
          pageIndex: paginate.pageIndex
        },
        sort: sort
      };

      searchUserList({ data });
    })
  }

  onGetSearchBody() {
    let body = { ...this.form.current.getFieldsValue() };
    return body;
  }

  onReset() {
    this.setState({
      searchBody: {}
    }, () => {

    });
  }

  onExport() {
    let { exportExcelUserList } = this.props;
    let searchBody = { ...this.form.current.getFieldsValue() };
    let data = {
      ...searchBody,
      fromDate: searchBody.fromDate ? searchBody.fromDate.format("YYYY-MM-DDTHH:mm:ss") : "",
      toDate: searchBody.toDate ? searchBody.toDate.format("YYYY-MM-DDTHH:mm:ss") : "",
    }

    this.setState({ exportLoading: { loading: true } });
    exportExcelUserList({ data })
      .then(res => {
        this.setState({ exportLoading: { loading: false, url: res.fileUrl } });
        this.downloadFile(res.fileUrl);
      }).catch(e => {
        this.setState({ exportLoading: { loading: false } });
      });
  }

  downloadFile(url) {
    window.open(url);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.paging.pageSizeDefault !== this.props.paging.pageSizeDefault) {
      this.changePaginate({ pageSize: this.props.paging.pageSizeDefault, pageIndex: this.state.paginate.pageIndex })
    }
  }



  render() {
    let { vendingList, locationList, promotionUserList, total, paging, translate } = this.props;
    let { paginate, exportLoading, showAdvance } = this.state;
    return (
      <React.Fragment>
        <PageHeader
          title={<Translate id="PROMOTION.USER_LIST_HEADER" />}
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
            onFinish={e => this.onSearch(e)}
            {...globalProps.form}
            ref={this.form}
            initialValues={{
              fromDate: moment().startOf('month'),
              toDate: moment()
            }}
          >
            <Row {...globalProps.row}>
              <Col {...globalProps.col}>
                <Form.Item {...globalProps.formItem}
                  label={<Translate id="PROMOTION.NAME_CODE" />}
                  name="name"
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col {...globalProps.col}>
                <Form.Item {...globalProps.formItem}
                  label={<Translate id="VENDING" />}
                  name="vendingIdList"
                >
                  <Select {...globalProps.selectSearch} mode="multiple">
                    {vendingList.map((k, i) =>
                      <Option value={k.id} key={i}>{k.name}</Option>
                    )}
                  </Select>
                </Form.Item>
              </Col>
              <Col {...globalProps.col}>
                <Row gutter={8}>
                  <Col span={12}>
                    <Form.Item {...globalProps.formItem}
                      label={<Translate id="PROMOTION.FROM_PAYMENT_TIME" />}
                      name="fromDate"
                      rules={[rules.dateFromFilter]}
                    >
                      <DatePicker
                        format={translate("FORMAT_DATETIME")}
                        showTime={{ defaultValue: moment('00:00:00', 'HH:mm:ss') }}
                        style={{ width: "100%" }}
                      />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item {...globalProps.formItem}
                      label={<Translate id="PROMOTION.TO_PAYMENT_TIME" />}
                      name="toDate"
                      rules={[rules.dateToFilter]}
                    >
                      <DatePicker
                        format={translate("FORMAT_DATETIME")}
                        showTime={{ format: "HH:mm:ss" }}
                        style={{ width: "100%" }}
                      />
                    </Form.Item>
                  </Col>
                </Row>
              </Col>
              {showAdvance ?
                <React.Fragment>
                  <Col {...globalProps.col}>
                    <Form.Item {...globalProps.formItem}
                      label={<Translate id="LOCATION" />}
                      name="locationIdList"
                    >
                      <Select {...globalProps.selectSearch} mode="multiple">
                        {locationList.map((k, i) =>
                          <Option value={k.id} key={i}>{k.name}</Option>
                        )}
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col {...globalProps.col}>
                    <Form.Item {...globalProps.formItem}
                      label={<Translate id="BILL_NUMBER" />}
                      name="billNumber"
                    >
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col {...globalProps.col}>
                    <Form.Item {...globalProps.formItem}
                      label={<Translate id="PROMOTION.VOUCHER_CODE" />}
                      name="voucherCode"
                    >
                      <Input />
                    </Form.Item>
                  </Col>
                </React.Fragment>
                : ""}
            </Row>
            <Row {...globalProps.row}>
              <Col {...globalProps.col3}>
                <Space>
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
                  {//isAllow(PERMISSION.PROMOTION.USER_LIST.EXPORT) &&
                    <Button type="primary"
                      className="custom-btn-primary"
                      size="large"
                      loading={exportLoading.loading} onClick={e => this.onExport()}>
                      <Translate id="EXPORT_EXCEL" />
                    </Button>
                  }
                </Space>
              </Col>
            </Row>
          </Form>
        </Card>

        <div className="card-container">
          {promotionUserList &&
            <Table
              {...globalProps.table}
              dataSource={promotionUserList.map((k, i) => ({ ...k, key: i, index: (paginate.pageIndex - 1) * paginate.pageSize + i + 1 }))}
              onChange={this.changePaginate}
              pagination={
                {
                  pageSize: paginate.pageSize,
                  total: total,
                  current: paginate.pageIndex,
                  showSizeChanger: true,
                  pageSizeOptions: paging.pageSizes,
                  locale: { items_per_page: "" },
                  showTotal: sum => <div>{sum} <Translate id="RESULT" /></div>
                }
              }
            >
              <Column title={<Translate id="INDEX" />} dataIndex="index" width={60} />
              <Column className="column-default" key="fullName" title={<Translate id="FULL_NAME" />} dataIndex="fullName" />
              <Column className="column-default" key="phoneNumber" title={<Translate id="PHONE_NUMBER" />} dataIndex="phoneNumber" />
              <Column className="column-code" key="vendingCode" title={<Translate id="VENDING_CODE" />} dataIndex="vendingCode" />
              <Column className="column-default" key="billNumber" title={<Translate id="BILL_NUMBER" />} dataIndex="billNumber" />
              <Column className="column-code" key="voucherCode" title={<Translate id="PROMOTION.VOUCHER_CODE" />} dataIndex="voucherCode" />
              <Column className="column-default" key="paymentTime" title={<Translate id="PROMOTION.PAYMENT_TIME" />} dataIndex="paymentTime" />
              <Column className="column-amount" key="promotionCode" title={<Translate id="PROMOTION.CODE" />} dataIndex="promotionCode" />
              <Column className="column-default" key="promotionName" title={<Translate id="PROMOTION.NAME" />} dataIndex="promotionName" />
              <ColumnGroup title={<Translate id={"PROMOTION.TIME"} />} {...globalProps.tableRow}>
                <Column className="column-code" key="startDate" title={<Translate id="PROMOTION.PROMOTION_START_DATE" />} dataIndex="startDate" />
                <Column className="column-code" key="endDate" title={<Translate id="PROMOTION.PROMOTION_END_DATE" />} dataIndex="endDate" />
              </ColumnGroup>
              <Column className="column-default" key="status" title={<Translate id="STATUS" />} dataIndex="status" render={val => <Translate id={`PROMOTION_STATUS.` + val} />} />
              <Column className="column-name" key="vendingName" title={<Translate id="VENDING_NAME" />} dataIndex="vendingName" />
              <Column className="column-code" key="locationCode" title={<Translate id="LOCATION_CODE" />} dataIndex="locationCode" />
              <Column className="column-name" key="locationName" title={<Translate id="LOCATION_NAME" />} dataIndex="locationName" />
              <Column className="column-note" key="address" title={<Translate id="ADDRESS" />} dataIndex="address" />
            </Table>
          }
        </div>
      </React.Fragment >
    )
  }
}

const stateToProps = (state) => {
  return {
    promotionCategoryList: state.promotion.promotionCategoryList,
    promotionStatusList: state.promotion.promotionStatusList,
    vendingList: state.promotion.vendingList,
    locationList: state.promotion.locationList,
    paging: state.promotion.paging,

    promotionUserList: state.promotion.promotionUserList,
    total: state.promotion.total,
  };
}

const dispatchToProps = (dispatch) => bindActionCreators({
  init: promotionActions.init,
  searchUserList: promotionActions.searchUserList,
  exportExcelUserList: promotionActions.exportExcelUserList,
}, dispatch);

export default connect(stateToProps, dispatchToProps)(withLocalize(PrmotionUserList));