import React, { Component } from "react";
import { SearchOutlined } from '@ant-design/icons';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Translate, withLocalize } from "react-localize-redux";
import { Button, Card, Col, DatePicker, Form, Input, PageHeader, Row, Table, TimePicker } from 'antd';
import { globalProps, isAllow, PERMISSION, RenderText, rules, getRandomColor } from "../../data";
import { dashboardActions } from "../../actions";
import { HorizontalBar } from 'react-chartjs-2';
import moment from 'moment';
const { Column } = Table;

class Dashboard extends Component {

  state = {
    searchBody: {},
    exportExcel: { loading: false },
  }

  form = React.createRef()
  componentDidMount() {
    this.props.init();
  }

  componentDidUpdate(prevProps) {
    let { dashboard } = this.props;

    if (dashboard.fromDate && prevProps.dashboard.fromDate !== dashboard.fromDate) {
      this.form.current.setFieldsValue({
        fromDate: moment(dashboard.fromDate)
      });
    }

    if (dashboard.fromTime && prevProps.dashboard.fromTime !== dashboard.fromTime) {
      this.form.current.setFieldsValue({
        fromTime: moment(dashboard.fromTime, "HH:mm:ss"),
      });
    }

    if (dashboard.toDate && prevProps.dashboard.toDate !== dashboard.toDate) {
      this.form.current.setFieldsValue({
        toDate: moment(dashboard.toDate),
      });
    }

    if (dashboard.toTime && prevProps.dashboard.toTime !== dashboard.toTime) {
      this.form.current.setFieldsValue({
        toTime: moment(dashboard.toTime, "HH:mm:ss"),
      });
    }
  }

  onGetSearchBody() {
    let body = { ...this.form.current.getFieldsValue() };
    if (body.fromDate) {
      let dateFromFormat = body.fromDate.format('YYYY-MM-DD');
      let timeFromFormat = '';

      if (body.fromTime) {
        timeFromFormat = body.fromTime.format('HH:mm:ss');
      }
      if (timeFromFormat === '') {
        timeFromFormat = '00:00:00';
      }
      let date = moment(`${dateFromFormat} ${timeFromFormat}`);

      body.fromDate = date.format("YYYY-MM-DDTHH:mm:ss");
    }

    if (body.toDate) {
      let toDateFormat = body.toDate.format('YYYY-MM-DD');
      let timeToFormat = '';

      if (body.toTime) {
        timeToFormat = body.toTime.format('HH:mm:ss');
      }

      if (timeToFormat === '') {
        timeToFormat = '23:59:59';
      }

      let date = moment(`${toDateFormat} ${timeToFormat}`);
      body.toDate = date.format("YYYY-MM-DDTHH:mm:ss");
    }

    return body;
  }

  onSearch() {
    this.setState({
      paginate: {
        ...this.state.paginate,
        pageIndex: 1
      },
    }, () => {
      let { init } = this.props;
      let searchBody = this.onGetSearchBody();
      let data = {
        ...searchBody
      }
      init({ data });
    })
  }

  onExport(e) {
    let { exportExcel, dashboard } = this.props;
    let data = {};
    switch (e) {
      case "listVMAmountHight":
        data.listVMAmountHight = dashboard.listVMAmountHight;
        break;
      case "listVMAmountLow":
        data.listVMAmountLow = dashboard.listVMAmountLow;
        break;
      case "listProductHight":
        data.listProductHight = dashboard.listProductHight;
        break;
      case "listProductLow":
        data.listProductLow = dashboard.listProductLow;
        break;
      case "listLocationTypeHight":
        data.listLocationTypeHight = dashboard.listLocationTypeHight;
        break;
      case "listLocationTypeLow":
        data.listLocationTypeLow = dashboard.listLocationTypeLow;
        break;
      default:
        data = {};
    }
    let searchBody = this.onGetSearchBody();
    data = {
      ...data,
      ...searchBody
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
  render() {
    let { dashboard } = this.props;
    let { searchBody, exportExcel } = this.state;
    let lstLabels = [];
    let lstDatas = [];
    let lstbackgroundColors = [];
    let topQuantity = dashboard.topQuantity;

    dashboard.listDataColumnChartWalet.forEach(element => {
      lstLabels.push(element.name);
      lstDatas.push(element.totalQuantity);
      lstbackgroundColors.push(getRandomColor());
    });

    const chart = {
      labels: lstLabels,
      datalist: lstDatas,
      datasets: [
        {
          label: '',
          backgroundColor: lstbackgroundColors,
          borderColor: lstbackgroundColors,
          borderWidth: 2,
          data: lstDatas,
        }
      ]
    }

    return (
      <React.Fragment>
        <PageHeader
          title={<Translate id="DASHBOARD_TITLE" />}
          ghost={false}
        />
        {isAllow(PERMISSION.DASHBOARD.INDEX) &&
          <div>
            <div className="site-card-wrapper cart-dashboard" style={{ marginTop: 10 }}>
              <Row gutter={16}>
                <Col span={12}>
                  <Card title={<strong><Translate id="SUM_VM_ON" /></strong>} className="sum-vm-on" bordered={false}>
                    <strong className="text-vm-on">
                      {(dashboard.totalVMOn || 0).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                    </strong>
                  </Card>
                </Col>
                <Col span={12}>
                  <Card title={<strong><Translate id="SUM_VM_OFF" /></strong>} className="sum-vm-off" bordered={false}>
                    <strong className="text-vm-off">
                      {(dashboard.totalVMOff || 0).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                    </strong>
                  </Card>
                </Col>
                {/* <Col span={8}>
                  <Card title={<strong><Translate id="SUM_VM_TRANSACTION" /></strong>} className="sum-vm-transaction" bordered={false}>
                    <strong className="text-vm-transaction">
                      {(dashboard.totalTransaction || 0).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                    </strong>
                  </Card>
                </Col> */}
              </Row>
            </div>

            <Card
              title={<strong><Translate id="SEARCH" /></strong>}
              size="small"
              style={{ marginTop: 10 }}
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
                  <Col {...globalProps.col}>
                    <Input.Group size="large">
                      <Row gutter={8}>
                        <Col style={{ width: '50%' }}>
                          <Form.Item {...globalProps.formItem}
                            label={<Translate id="DATE_FROM" />}
                            name="fromDate"
                            initialValue={moment(dashboard.fromDate)}
                            rules={[rules.dateFromFilter]}
                          >
                            <DatePicker
                              // format={translate("FORMAT_DATE")}
                              style={{ width: '100%' }}
                            />
                          </Form.Item>
                        </Col>
                        <Col style={{ width: '50%' }}>
                          <Form.Item {...globalProps.formItem}
                            label="&nbsp;"
                            name="fromTime"
                            initialValue={moment(dashboard.fromTime, "HH:mm:ss")}
                          >
                            <TimePicker
                              style={{ width: '100%' }}
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
                            name="toDate"
                            style={{ width: '100%' }}
                            initialValue={moment(dashboard.toDate)}
                            rules={[rules.dateToFilter]}
                          >
                            <DatePicker
                              // format={translate("FORMAT_DATE")}
                              style={{ width: '100%' }}
                            />
                          </Form.Item>
                        </Col>
                        <Col style={{ width: '50%' }}>
                          <Form.Item {...globalProps.formItem}
                            label="&nbsp;"
                            name="toTime"
                            initialValue={moment(dashboard.toTime, "HH:mm:ss")}
                          >
                            <TimePicker
                              style={{ width: '100%' }}
                            />
                          </Form.Item>
                        </Col>
                      </Row>
                    </Input.Group>
                  </Col>
                  <Col {...globalProps.col}>
                    <Form.Item {...globalProps.formItem}
                      label={<Translate id="TOP_QUANTITY" />}
                      name="topQuantity"
                      rules={[rules.required]}
                      initialValue={5}
                    >
                      <Input type="number" min={0} />
                    </Form.Item>
                  </Col>
                </Row>
                <Row {...globalProps.row}>
                  <Col {...globalProps.col3}>
                    <Button.Group>
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
                    </Button.Group>
                  </Col>
                </Row>
              </Form >
            </Card >

            <div className="dashboard">
              {
                dashboard &&
                <Row gutter={8} wrap="true">
                  <Col {...globalProps.colHalf} style={{ marginTop: 10 }}>
                    <Card
                      size="small"
                      style={{ height: "100%" }}
                      className="box-shadow-card"
                    >
                      <h3 className="dashboard-title">{<Translate id="TITLE_VM_TOP_GOOD" data={{ 0: topQuantity }} />}</h3>
                      <Row {...globalProps.row}>
                        <Col>
                          <Button type="primary" size="large"
                            className="custom-btn-primary"
                            loading={exportExcel.loading} onClick={e => this.onExport("listVMAmountHight")}
                          >
                            <Translate id="EXPORT_EXCEL" />
                          </Button>
                        </Col>
                      </Row>
                      <div className="card-container">
                        <Table
                          {...globalProps.table}
                          pagination={false}
                          dataSource={dashboard.listVMAmountHight.map((k, i) => ({ ...k, index: i + 1, key: i }))}
                          scroll={{ x: 200, y: 400 }}
                        >
                          <Column className="column-index" title={<Translate id="INDEX" />} dataIndex="index" />
                          <Column className="column-name" key="vendingName" title={<Translate id="DASHBOARD_VM_CODE" />} dataIndex="vendingName" />
                          <Column className="column-name" key="locationArea" title={<Translate id="LOCATION_AREA" />} dataIndex="locationArea" />
                          {/* <Column className="column-name" key="locationArea" title={<Translate id="DASHBOARD_LOCATION_AREA" />} dataIndex="locationArea" /> */}
                          <Column className="column-name" key="quantityTransaction" title={<Translate id="DASHBOARD_QTY_TRANSACTION" />}
                            align="right"
                            dataIndex="quantityTransaction" />
                          <Column className="column-name" key="totalAmount" title={<Translate id="DASHBOARD_TOTAL_AMOUNT" />}
                            render={val => <RenderText value={val} type="NUMBER" format="0" />}
                            align="right"
                            dataIndex="totalAmount" />
                        </Table>
                      </div>
                    </Card>
                  </Col>
                  <Col {...globalProps.colHalf} style={{ marginTop: 10 }}>
                    <Card
                      size="small"
                      style={{ height: "100%" }}
                      className="box-shadow-card"
                    >
                      <h3 className="dashboard-title">{<Translate id="TITLE_VM_TOP_BAD" data={{ 0: topQuantity }} />}</h3>
                      <Row {...globalProps.row}>
                        <Col>
                          <Button type="primary" size="large"
                            className="custom-btn-primary"
                            loading={exportExcel.loading} onClick={e => this.onExport("listVMAmountLow")}
                          >
                            <Translate id="EXPORT_EXCEL" />
                          </Button>
                        </Col>
                      </Row>
                      <div className="card-container">
                        <Table
                          {...globalProps.table}
                          pagination={false}
                          dataSource={dashboard.listVMAmountLow.map((k, i) => ({ ...k, index: i + 1, key: i }))}
                          scroll={{ x: 200, y: 400 }}
                        >
                          <Column className="column-index" title={<Translate id="INDEX" />} dataIndex="index" />
                          <Column className="column-name" key="vendingName" title={<Translate id="DASHBOARD_VM_CODE" />} dataIndex="vendingName" />
                          <Column className="column-name" key="locationArea" title={<Translate id="LOCATION_AREA" />} dataIndex="locationArea" />
                          {/* <Column className="column-name" key="locationArea" title={<Translate id="DASHBOARD_LOCATION_AREA" />} dataIndex="locationArea" /> */}
                          <Column className="column-name" key="quantityTransaction" title={<Translate id="DASHBOARD_QTY_TRANSACTION" />}
                            align="right"
                            dataIndex="quantityTransaction" />
                          <Column className="column-name" key="totalAmount" title={<Translate id="DASHBOARD_TOTAL_AMOUNT" />}
                            render={val => <RenderText value={val} type="NUMBER" format="0" />}
                            align="right"
                            dataIndex="totalAmount" />
                        </Table>
                      </div>
                    </Card>
                  </Col>
                  <Col {...globalProps.colHalf} style={{ marginTop: 10 }}>
                    <Card
                      size="small"
                      style={{ height: "100%" }}
                      className="box-shadow-card"
                    >
                      <h3 className="dashboard-title">{<Translate id="TITLE_PRODUCT_TOP_GOOD" data={{ 0: topQuantity }} />}</h3>
                      <Row {...globalProps.row}>
                        <Col>
                          <Button type="primary" size="large"
                            className="custom-btn-primary"
                            loading={exportExcel.loading} onClick={e => this.onExport("listProductHight")}
                          >
                            <Translate id="EXPORT_EXCEL" />
                          </Button>
                        </Col>
                      </Row>
                      <div className="card-container">
                        <Table
                          {...globalProps.table}
                          pagination={false}
                          dataSource={dashboard.listProductHight.map((k, i) => ({ ...k, index: i + 1, key: i }))}
                          scroll={{ x: 200, y: 400 }}
                        >
                          <Column className="column-index" title={<Translate id="INDEX" />} dataIndex="index" />
                          <Column className="column-name" key="productCode" title={<Translate id="DASHBOARD_PRODUCT_CODE" />} dataIndex="productCode" />
                          <Column className="column-name" key="productName" title={<Translate id="DASHBOARD_PRODUCT_NAME" />} dataIndex="productName" />
                          <Column className="column-name" key="quantityTransaction" title={<Translate id="DASHBOARD_QTY_PRODUCT" />}
                            render={val => <RenderText value={val} type="NUMBER" format="0" />}
                            align="right"
                            dataIndex="quantityTransaction" />
                        </Table>
                      </div>
                    </Card>
                  </Col>
                  <Col {...globalProps.colHalf} style={{ marginTop: 10 }}>
                    <Card
                      size="small"
                      style={{ height: "100%" }}
                      className="box-shadow-card"
                    >
                      <h3 className="dashboard-title">{<Translate id="TITLE_PRODUCT_TOP_BAD" data={{ 0: topQuantity }} />}</h3>
                      <Row {...globalProps.row}>
                        <Col>
                          <Button type="primary" size="large"
                            className="custom-btn-primary"
                            loading={exportExcel.loading} onClick={e => this.onExport("listProductLow")}
                          >
                            <Translate id="EXPORT_EXCEL" />
                          </Button>
                        </Col>
                      </Row>
                      <div className="card-container">
                        <Table
                          {...globalProps.table}
                          pagination={false}
                          dataSource={dashboard.listProductLow.map((k, i) => ({ ...k, index: i + 1, key: i }))}
                          scroll={{ x: 200, y: 400 }}
                        >
                          <Column className="column-index" title={<Translate id="INDEX" />} dataIndex="index" />
                          <Column className="column-name" key="productCode" title={<Translate id="DASHBOARD_PRODUCT_CODE" />} dataIndex="productCode" />
                          <Column className="column-name" key="productName" title={<Translate id="DASHBOARD_PRODUCT_NAME" />} dataIndex="productName" />
                          <Column className="column-name" key="quantityTransaction" title={<Translate id="DASHBOARD_QTY_PRODUCT" />}
                            render={val => <RenderText value={val} type="NUMBER" format="0" />}
                            align="right"
                            dataIndex="quantityTransaction" />
                        </Table>
                      </div>
                    </Card>
                  </Col>
                  <Col {...globalProps.colHalf} style={{ marginTop: 10 }}>
                    <Card
                      size="small"
                      style={{ height: "100%" }}
                      className="box-shadow-card"
                    >
                      <h3 className="dashboard-title">{<Translate id="TITLE_LOCATION_TYPE_TOP_GOOD" data={{ 0: topQuantity }} />}</h3>
                      <Row {...globalProps.row}>
                        <Col>
                          <Button type="primary" size="large"
                            className="custom-btn-primary"
                            loading={exportExcel.loading} onClick={e => this.onExport("listLocationTypeHigh")}
                          >
                            <Translate id="EXPORT_EXCEL" />
                          </Button>
                        </Col>
                      </Row>
                      <div className="card-container">
                        <Table
                          {...globalProps.table}
                          pagination={false}
                          dataSource={dashboard.listLocationTypeHigh.map((k, i) => ({ ...k, index: i + 1, key: i }))}
                          scroll={{ x: 200, y: 400 }}
                        >
                          <Column className="column-index" title={<Translate id="INDEX" />} dataIndex="index" />
                          <Column className="column-name" key="locationType" title={<Translate id="DASHBOARD_LOCATION_TYPE" />} dataIndex="locationType" />
                          <Column align="right" className="column-name" key="totalVending" title={<Translate id="DASHBOARD_QTY_VENDING" />} dataIndex="totalVending" />
                          <Column align="right" className="column-name" key="quantityTransactionAverage" title={<Translate id="DASHBOARD_QTY_AVG_TRANSACTION" />} dataIndex="quantityTransactionAverage" />
                          <Column align="right" className="column-name" key="revenueAverage" title={<Translate id="DASHBOARD_QTY_AVG_REVENUE" />} dataIndex="revenueAverage"
                            render={val => <RenderText value={val} type="NUMBER" format="0" />} />
                        </Table>
                      </div>
                    </Card>
                  </Col>
                  <Col {...globalProps.colHalf} style={{ marginTop: 10 }}>
                    <Card
                      size="small"
                      style={{ height: "100%" }}
                      className="box-shadow-card"
                    >
                      <h3 className="dashboard-title">{<Translate id="TITLE_LOCATION_TYPE_TOP_BAD" data={{ 0: topQuantity }} />}</h3>
                      <Row {...globalProps.row}>
                        <Col>
                          <Button type="primary" size="large"
                            className="custom-btn-primary"
                            loading={exportExcel.loading} onClick={e => this.onExport("listLocationTypeLow")}
                          >
                            <Translate id="EXPORT_EXCEL" />
                          </Button>
                        </Col>
                      </Row>
                      <div className="card-container">
                        <Table
                          {...globalProps.table}
                          pagination={false}
                          dataSource={dashboard.listLocationTypeLow.map((k, i) => ({ ...k, index: i + 1, key: i }))}
                          scroll={{ x: 200, y: 400 }}
                        >
                          <Column className="column-index" title={<Translate id="INDEX" />} dataIndex="index" />
                          <Column className="column-name" key="locationType" title={<Translate id="DASHBOARD_LOCATION_TYPE" />} dataIndex="locationType" />
                          <Column align="right" className="column-name" key="totalVending" title={<Translate id="DASHBOARD_QTY_VENDING" />} dataIndex="totalVending" />
                          <Column align="right" className="column-name" key="quantityTransactionAverage" title={<Translate id="DASHBOARD_QTY_AVG_TRANSACTION" />} dataIndex="quantityTransactionAverage" />
                          <Column align="right" className="column-name" key="revenueAverage" title={<Translate id="DASHBOARD_QTY_AVG_REVENUE" />} dataIndex="revenueAverage"
                            render={val => <RenderText value={val} type="NUMBER" format="0" />} />
                        </Table>
                      </div>
                    </Card>
                  </Col>
                  <Col {...globalProps.col3} style={{ marginTop: 10 }}>
                    <Card
                      size="small"
                      style={{ marginTop: 10 }}
                      className="box-shadow-card"
                    >
                      <h3 className="dashboard-title">{<Translate id="TITLE_LOCATION_TYPE_TOP_PRODUCT" data={{ 0: topQuantity }} />}</h3>
                      <div className="card-container">
                        <Row gutter={24} wrap="true">
                          {
                            dashboard.listProductLocationType.map(item => {
                              return (
                                <Col {...globalProps.colHalf} style={{ marginTop: 10 }}>
                                  <Card
                                    title={item.locationType} data={{ 0: topQuantity }}
                                    size="small"
                                    style={{ marginTop: 10 }}
                                  >
                                    <HorizontalBar
                                      key={item.productList.length}
                                      data={{
                                        labels: item.productList.map(x => x.productName),
                                        datalist: item.productList.map(x => x.totalProduct),
                                        datasets: [
                                          {
                                            label: '',
                                            backgroundColor: "#1569C7",
                                            borderColor: "#1569C7",
                                            borderWidth: 2,
                                            data: item.productList.map(x => x.totalProduct),
                                          }
                                        ]
                                      }}
                                      height="150px"// {item.productList.length * 10 + 10}
                                      options={{
                                        legend: {
                                          display: false,
                                        },
                                        plugins: {
                                          datalabels: {
                                            align: 'end',
                                            anchor: 'end',
                                            color: function (context) {
                                              return context.dataset.backgroundColor;
                                            },
                                            font: function (context) {
                                              var w = context.chart.width;
                                              return {
                                                size: w < 512 ? 12 : 14,
                                                weight: 'bold',
                                              };
                                            },
                                            formatter: function (value, context) {
                                              return context.chart.data.datalist[context.dataIndex];
                                            }
                                          }
                                        },
                                      }}
                                    />
                                  </Card>
                                </Col>
                              )
                            })
                          }
                        </Row>
                      </div>
                    </Card>
                  </Col>
                </Row>
              }
            </div>

            <Card
              title={<strong><Translate id="ORDER_BY_PAYMENT" /></strong>}
              size="small"
              style={{ marginTop: 10 }}
            >
              <Row gutter={16}>
                {/* Chart */}
                <Col span={20}>
                  <div style={{ width: "100%" }} >
                    <HorizontalBar
                      key={lstDatas.length}
                      data={chart}
                      height={lstDatas.length * 10 + 10}
                      options={{
                        legend: {
                          display: false
                        },
                        plugins: {
                          datalabels: {
                            align: 'end',
                            anchor: 'end',
                            color: function (context) {
                              return context.dataset.backgroundColor;
                            },
                            font: function (context) {
                              var w = context.chart.width;
                              return {
                                size: w < 512 ? 12 : 14,
                                weight: 'bold',
                              };
                            },
                            formatter: function (value, context) {
                              return context.chart.data.datalist[context.dataIndex];
                            }
                          }
                        },
                      }}
                    />
                  </div>
                </Col>

              </Row>
            </Card>
          </div>
        }
      </React.Fragment >
    )
  }
}

const stateToProps = (state) => {
  return {
    dashboard: state.dashboard.dashboard,
  };
}

const dispatchToProps = (dispatch) => bindActionCreators({
  init: dashboardActions.init,
  exportExcel: dashboardActions.exportExcel
}, dispatch);

export default withLocalize(connect(stateToProps, dispatchToProps)(Dashboard));