import React, { Component } from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { Translate, withLocalize } from "react-localize-redux";
import { Card, Button, Row, Col, Table, PageHeader, Form, Input, DatePicker, TimePicker, Modal } from "antd";
import {
  SearchOutlined,
} from "@ant-design/icons";
import { LOCAL_PATH } from "../../constants";
import { globalProps, rules, RenderText } from "../../data";
import { reconciliationRevenueActions } from "../../actions";
import moment from "moment";
import { history } from "../../store";

const { Column, ColumnGroup } = Table;


class ReconciliationRevenueCreate extends Component {
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
    toTimeInit: moment().format('YYYY-MM-DD') + 'T23:59:59',
    isOverAlive: false,
    lstCreate: [],
  }

  form = React.createRef()
  formTable = React.createRef()

  toggleAdvanceSearch() {
    this.setState({
      showAdvance: !this.state.showAdvance,
      timeFromReadonly: false,
      timeToReadonly: false
    });
    this.onReset();
  }

  componentDidMount() {
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
      let { paginate, sort } = this.state;
      let { searchMachine } = this.props;
      let searchBody = { ...this.form.current.getFieldsValue() };
      let dateToFormat = searchBody.toDate.format("YYYY-MM-DD");
      let timeToFormat = '00:00:00';
      if (searchBody.toTime) {
        timeToFormat = searchBody.toTime.format('HH:mm:ss');
      }
      let date = moment(`${dateToFormat} ${timeToFormat}`);
      let maxDate = date.format("YYYY-MM-DDTHH:mm:ss");

      let data = {
        reconciliationRevenueMaxDate: maxDate,
        paging: {
          ...paginate,
          pageIndex: 1
        },
        sort: sort
      };

      searchMachine({ data });
    });
  }

  onReset() {
    this.setState({
      searchBody: {}
    }, () => {
      this.form.current.resetFields();
    });
  }

  onCreate(e) {
    let { lstCreate } = this.state;
    let { create, translate } = this.props;
    let data = {
      reconciliationRevenueList: lstCreate.map(k => ({ ...k, reconRevenueToDate: k.reconRevenueToDate.format("YYYY-MM-DDTHH:mm:ss") })),
    };

    if (lstCreate && lstCreate.length > 0) {
      create({ data });
      //console.log(data);
    } else {

      const modal = Modal.info();
      modal.update({
        icon: undefined,
        centered: true,
        content: translate("SELECT_AT_LEAST_MACHINE"),
        okText: "OK",
        okButtonProps: { ...globalProps.okButton },
        onOk: () => {
          modal.destroy();
        },
      });

    }
  }

  downloadFile(url) {
    window.open(url);
  }

  componentDidUpdate(prevProps) {
    let { reconciliationMachineList } = this.props;
    if (reconciliationMachineList !== prevProps.reconciliationMachineList) {
      this.formTable.current.setFieldsValue({
        reconciliationMachineList: reconciliationMachineList.map(k => ({ ...k, reconRevenueToDate: moment(k.reconRevenueToDate) }))
      })
    }

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
      sort: {}
    }, () => {
      let { paginate, sort } = this.state;
      let { searchMachine } = this.props;
      let searchBody = { ...this.form.current.getFieldsValue() };
      let dateToFormat = searchBody.toDate.format("YYYY-MM-DD");
      let timeToFormat = '00:00:00';
      if (searchBody.toTime) {
        timeToFormat = searchBody.toTime.format('HH:mm:ss');
      }
      let date = moment(`${dateToFormat} ${timeToFormat}`);
      let maxDate = date.format("YYYY-MM-DDTHH:mm:ss");

      let data = {
        reconciliationRevenueMaxDate: maxDate,
        paging: {
          ...paginate,
          pageIndex: 1
        },
        sort: sort
      };

      searchMachine({ data });
    });
  }

  render() {
    let { reconciliationMachineList, totalItem, translate } = this.props;
    let { searchBody, paginate, toTimeInit, lstCreate } = this.state;
    return (
      <React.Fragment>
        <PageHeader
          title={<span><Translate id="RECONCILIATION_REVENUE_LIST" /> / <Translate id="CREATE" /></span>}
          ghost={false}
          onBack={e => history.push(LOCAL_PATH.FINANCE.RECONCILIATION_REVENUE.INDEX)}
        />
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
              <Col {...globalProps.colHalf}>
                <Input.Group size="large">
                  <Row gutter={8}>
                    <Col style={{ width: '50%' }}>
                      <Form.Item {...globalProps.formItem}
                        label={<Translate id="RECONCILIATION_REVENUE.RECONCILIATION_TO_DATE" />}
                        name="toDate"
                        style={{ width: '100%' }}
                        initialValue={moment().add(-1, 'days')}
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
                        name="toTime"
                        initialValue={moment(toTimeInit)}
                      >
                        <TimePicker
                          style={{ width: '100%' }}
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                </Input.Group>
              </Col>
            </Row>
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
              </Col>
            </Row>
          </Form>
        </Card>
        <Form
          initialValues={{
            reconciliationMachineList: reconciliationMachineList.map(k => ({ ...k, reconRevenueToDate: moment(k.reconRevenueToDate) }))
          }}
          ref={this.formTable}
        >
          <Form.List name="reconciliationMachineList"
            {...globalProps.formItem}
          >
            {reconciliationMachineList => {
              return <div className="card-container">
                <Button
                  className="custom-btn-primary"
                  type="primary"
                  size="large"
                  onClick={e => this.onCreate(e)}
                >
                  <span>
                    <Translate id="CREATE_REVENUE" />
                  </span>
                </Button>
                <Form.Item
                  shouldUpdate={(prevValues, curValues) => {
                    let prevRecord = prevValues.reconciliationMachineList;
                    let curRecord = curValues.reconciliationMachineList;
                    return (prevRecord !== curRecord)
                  }}
                >
                  {({ getFieldValue }) =>
                    <Table
                      {...globalProps.table}
                      dataSource={reconciliationMachineList.map((field, i) => {
                        let form = this.formTable.current;
                        return form && {
                          key: i,
                          index: (paginate.pageIndex - 1) * paginate.pageSize + i + 1,
                          ...form.getFieldValue(["reconciliationMachineList", field.name]),
                          ...field,
                        }
                      })}
                      onChange={this.changePaginate}
                      pagination={
                        {
                          pageSize: paginate.pageSize,
                          total: totalItem,
                          current: paginate.pageIndex,
                          showSizeChanger: true,
                          pageSizeOptions: [10, 20, 30, 40],
                          locale: { items_per_page: "" },
                          showTotal: sum => <div>{sum} <Translate id="RESULT" /></div>
                        }
                      }
                      rowSelection={{
                        type: 'checkbox',
                        getCheckboxProps: (record) => (record && {
                          disabled: record.isCantCreateReconRevenue,
                          name: record.name,
                        }),
                        selectedRowKeys: lstCreate.map(k => k.key),
                        onChange: (selectedRowKeys, selectedRows) => {
                          this.setState({
                            lstCreate: selectedRows
                          });
                        }
                      }}
                    >
                      <Column width={60} title={<Translate id="INDEX" />} dataIndex="index" />
                      <Column width={80} key="vendingCode" title={<Translate id="MACHINE_CODE" />} dataIndex="vendingCode" />
                      <Column width={80} key="vendingName" title={<Translate id="MACHINE_NAME" />} dataIndex="vendingName" />
                      <ColumnGroup title={<Translate id="RECONCILIATION_PERIOD" />}>
                        <Column key="reconRevenueFromDate"
                          title={<Translate id="DATE_FROM" />}
                          dataIndex="reconRevenueFromDate"
                          render={val => <RenderText value={val} type="DATETIME" />}
                        />
                        <Column width={200} key="reconRevenueToDate"
                          title={<Translate id="DATE_TO" />}
                          dataIndex="reconRevenueToDate"
                          render={(val, record) => record && <div>
                            <Form.Item noStyle
                              shouldUpdate={(prevValues, curValues) => {
                                let prevRecord = prevValues.reconciliationMachineList[record.name];
                                let curRecord = curValues.reconciliationMachineList[record.name];
                                if (prevRecord.isCantCreateReconRevenue !== curRecord.isCantCreateReconRevenue && curRecord.isCantCreateReconRevenue) {
                                  this.setState({
                                    lstCreate: lstCreate.filter(k => k.key !== record.key)
                                  })
                                }
                                return (prevRecord.isCantCreateReconRevenue !== curRecord.isCantCreateReconRevenue) || (prevRecord.reconRevenueToDate !== curRecord.reconRevenueToDate)
                              }}
                            >
                              {({ getFieldValue }) => (
                                <Form.Item
                                  name={[record.name, "reconRevenueToDate"]}
                                  style={{ marginBottom: 0, maxWidth: 200, wordBreak: 'break-word', whiteSpace: 'normal' }}
                                  rules={
                                    [
                                      ({ getFieldValue, setFields }) => ({
                                        validator(_, value) {
                                          setFields([{
                                            name: ["reconciliationMachineList", record.name, "isCantCreateReconRevenue"],
                                            value: true
                                          }]);

                                          let fromDate = getFieldValue(["reconciliationMachineList", record.name, "reconRevenueFromDate"]);
                                          let lastAlive = getFieldValue(["reconciliationMachineList", record.name, "alive"]);
                                          let firstTransVendingLogTime = getFieldValue(["reconciliationMachineList", record.name, "firstTransVendingLogTime"]);
                                          let revenueFromDate = getFieldValue(["reconciliationMachineList", record.name, "revenueFromDate"]);
                                          let revenueToDate = getFieldValue(["reconciliationMachineList", record.name, "revenueToDate"]);
                                          let now = moment().format("YYYY-MM-DDTHH:mm:ss");
                                          if (value < moment(fromDate)) {
                                            //Ngày bắt đầu kỳ đối soát
                                            return Promise.reject(new Error(translate(`NOT_LESS_THAN_FROM_RECONCILIATION`)));
                                          }
                                          else if (moment(now).isSameOrBefore(value.format("YYYY-MM-DDTHH:mm:ss"))) {
                                            //Ngày hiện tại

                                            return Promise.reject(new Error(translate(`NOT_GREATER_THAN_NOW`)));
                                          }
                                          else if (value > moment(lastAlive)) {
                                            //Thời gian alive gần nhất
                                            return Promise.reject(new Error(translate(`NOT_GREATER_THAN_LAST_ALIVE`)));
                                          }
                                          else if (firstTransVendingLogTime && moment(firstTransVendingLogTime).isSameOrAfter(value)) {
                                            //Ngày kết thúc của kỳ đối soát phải lớn hơn lần thu tiền đầu tiên chưa đối soát trong kỳ
                                            return Promise.reject(new Error(translate(`NOT_GREATER_THAN_TRANSACT_VENDING_LOG`) + ` (${moment(firstTransVendingLogTime).format("DD/MM/YYYY HH:mm:ss")})`));
                                          }
                                          else if (value < moment(revenueFromDate)) {
                                            //Ngày bắt đầu của kỳ doanh thu
                                            return Promise.reject(new Error(translate(`NOT_GREATER_THAN_FROM_REVENUE`)));
                                          }
                                          else if (revenueToDate && value > moment(revenueToDate)) {
                                            //Ngày kết thúc của kỳ doanh thu
                                            return Promise.reject(new Error(translate(`NOT_GREATER_THAN_TO_REVENUE`)));
                                          }
                                          else {
                                            setFields([{
                                              name: ["reconciliationMachineList", record.name, "isCantCreateReconRevenue"],
                                              value: false
                                            }])
                                            return Promise.resolve();
                                          }
                                        },
                                      }),
                                    ]}
                                >
                                  <DatePicker className={getFieldValue(["reconciliationMachineList", record.name, "isCantCreateReconRevenue"]) ? "overAliveColor" : ""}
                                    disabled={getFieldValue(["reconciliationMachineList", record.name, "isDisableReconRevenueTo"])}
                                    showTime
                                    format={translate("FORMAT_DATETIME")}
                                  />
                                </Form.Item>
                              )}
                            </Form.Item>
                          </div>}
                        />
                      </ColumnGroup>
                      <ColumnGroup title={<Translate id="REVENUE_PERIOD" />}>
                        <Column key="revenueFromDate"
                          title={<Translate id="DATE_FROM" />}
                          dataIndex="revenueFromDate"
                          render={val => <RenderText value={val} type="DATETIME" />}
                        />
                        <Column key="revenueToDate"
                          title={<Translate id="DATE_TO" />}
                          dataIndex="revenueToDate"
                          render={val => <RenderText value={val} type="DATETIME" />}
                        />
                      </ColumnGroup>
                      <Column key="alive" sorter='true' title={<Translate id="PROCESSING_DEVICE.LAST_CONNECT" />} dataIndex="alive" render={val => <RenderText value={val} type="DATETIME" />} />
                      <Column key="locationName" sorter='true' title={<Translate id="LOCATION" />} dataIndex="locationName" />
                      <Column key="locationAreaMachineName" sorter='true' title={<Translate id="LOCATION_AREA" />} dataIndex="locationAreaMachineName" />
                      <Column key="address" sorter='true' title={<Translate id="ADDRESS" />} dataIndex="address" />
                    </Table>
                  }
                </Form.Item>
              </div>
            }
            }
          </Form.List>
        </Form>
      </React.Fragment >
    )
  }
}

const stateToProps = (state) => {
  return {
    reconciliationMachineList: state.reconciliationRevenue.reconciliationMachineList,
    totalItem: state.reconciliationRevenue.totalItem,
    paging: state.reconciliationRevenue.paging,
  };
}

const dispatchToProps = (dispatch) => bindActionCreators({
  searchMachine: reconciliationRevenueActions.searchMachine,
  create: reconciliationRevenueActions.create
}, dispatch);

export default connect(stateToProps, dispatchToProps)(withLocalize(ReconciliationRevenueCreate));