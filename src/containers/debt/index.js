import React, { Component } from "react";
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Translate, withLocalize } from "react-localize-redux";
import { Table, Row, Col, Button, Form, Card, Input, DatePicker, Space, } from 'antd';
import { globalProps, isAllow, PERMISSION, rules, RenderText } from "../../data";
import { debtActions } from "../../actions";
import moment from "moment";
import { EyeOutlined, FileExcelOutlined } from '@ant-design/icons';

const { Column } = Table;
const { ColumnGroup } = Column;

class Debt extends Component {
  state = {
    searchBody: {},
    isShow: false,
    paginate: {
      pageIndex: 1,
      pageSize: 10,
    },
    exportReport: { loading: false },
  }
  form = React.createRef();

  componentDidMount() {
    this.props.init();
  }

  componentDidUpdate(prevProps) {

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
      sort: {},
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
      this.setState({
        isShow: true
      })
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

  downloadFile(url) {
    window.open(url);
  }


  render() {
    let { debtAmount, debtStatistic, debt, paging, translate } = this.props;
    let { searchBody, paginate, isShow, exportReport } = this.state;
    return (
      <React.Fragment>
        <Card
          title={<strong><Translate id="DEBT_RECEIVED" /></strong>}
          size="small"
          style={{ marginTop: 10 }}
        >
          <div><label style={{ fontSize: "3rem", color: "#0000ff" }}><RenderText value={debtAmount} type="NUMBER_NO_DOT" /></label></div>
          <div><label><Translate id="DEBT_CURRENT" /> (đ) </label></div>
        </Card>

        <Card
          title={<strong><Translate id="DEBT_HISTORY" /></strong>}
          size="small"
          style={{ marginTop: 10 }}
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
                    <Col style={{ width: '100%' }}>
                      <Form.Item {...globalProps.formItem}
                        label={<Translate id="DATE_FROM" />}
                        name="fromDate"
                        initialValue={moment().add(-30, 'days').hour(0).minute(0).second(0).millisecond(0)}
                        rules={[rules.dateFromFilter]}
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
                <Input.Group size="large">
                  <Row gutter={8}>
                    <Col style={{ width: '100%' }}>
                      <Form.Item {...globalProps.formItem}
                        label={<Translate id="DATE_TO" />}
                        name="toDate"
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
                  </Row>
                </Input.Group>
              </Col>
            </Row>
            <Row {...globalProps.row}>
              <Col {...globalProps.col}>
                <Space size="small">
                  {isAllow(PERMISSION.DEBT.SEARCH) &&
                    <Button
                      className="custom-btn-primary"
                      type="primary"
                      htmlType="submit"
                      size="large"
                    >
                      <span>
                        <Translate id="SEARCH" />
                      </span>
                      <EyeOutlined />
                    </Button>
                  }
                  {isAllow(PERMISSION.DEBT.EXPORT) &&
                    <Button type="primary" size="large"
                      className="custom-btn-primary"
                      loading={exportReport.loading} onClick={() => this.onExport()}>
                      <span>
                        <Translate id="EXPORT_EXCEL" />
                      </span>
                      <FileExcelOutlined />
                    </Button>
                  }
                </Space>
              </Col>
            </Row>
          </Form>
        </Card>

        <div className="card-container">
          {
            isShow && (
              <Card
                title={<strong><Translate id="RESULT" /></strong>}
                style={{ marginTop: 10 }}
                size="small"
              >
                {isAllow(PERMISSION.DEBT.INDEX) &&
                  <React.Fragment>
                    {
                      debtStatistic && (
                        <React.Fragment>
                          <Row {...globalProps.row} style={{ width: 600, marginLeft: 'auto', marginRight: 0 }}>
                            <Col span={12} align="right" style={{ padding: 8 }}><strong><Translate id="BEGIN_AMOUNT" /></strong></Col>
                            <Col span={6} align="right" className="debt-amount"><strong> {debtStatistic.beginAmount > 0 ? <RenderText value={debtStatistic.beginAmount} type="NUMBER_NO_DOT" /> : "0"} </strong></Col>
                            <Col span={6} align="right" className="debt-amount"><strong> {debtStatistic.beginAmount < 0 ? <RenderText value={debtStatistic.beginAmount} type="NUMBER_NO_DOT" /> : "0"} </strong></Col>
                          </Row>
                          <Row {...globalProps.row} style={{ width: 600, marginLeft: 'auto', marginRight: 0 }}>
                            <Col span={12} align="right" style={{ padding: 8 }}><strong><Translate id="DEBT_AMOUNT" /></strong></Col>
                            <Col span={6} align="right" className="debt-amount"><strong><RenderText value={debtStatistic.amountUp || 0} type="NUMBER_NO_DOT" /></strong></Col>
                            <Col span={6} align="right" className="debt-amount"><strong><RenderText value={debtStatistic.amountDown || 0} type="NUMBER_NO_DOT" /></strong></Col>
                          </Row>
                          <Row {...globalProps.row} style={{ width: 600, marginLeft: 'auto', marginRight: 0 }}>
                            <Col span={12} align="right" style={{ padding: 8 }}><strong><Translate id="END_AMOUNT" /></strong></Col>
                            <Col span={6} align="right" className="debt-amount"><strong> {debtStatistic.endAmount > 0 ? <RenderText value={debtStatistic.endAmount} type="NUMBER_NO_DOT" /> : "0"} </strong></Col>
                            <Col span={6} align="right" className="debt-amount"><strong> {debtStatistic.endAmount < 0 ? <RenderText value={debtStatistic.endAmount} type="NUMBER_NO_DOT" /> : "0"} </strong></Col>
                          </Row>
                        </React.Fragment>
                      )
                    }
                    <Table
                      {...globalProps.table}
                      dataSource={debt.debtList.map((k, i) => ({ ...k, index: i + 1, key: i }))}
                      onChange={this.changePaginate}
                      pagination={
                        {
                          pageSize: paginate.pageSize,
                          total: debt.totalItem,
                          current: paginate.pageIndex,
                          showSizeChanger: true,
                          pageSizeOptions: paging.pageSizes,
                          locale: { items_per_page: "" },
                          showTotal: sum => <div>{sum} <Translate id="RESULT" /></div>
                        }
                      }
                    >
                      <Column width={60} title={<Translate id="INDEX" />} dataIndex="index" />
                      <ColumnGroup title={<Translate id="RECEIPT" />}>
                        <Column className='column-name-short' title={<Translate id="DAY" />} dataIndex="dateChange" key="dateChange" />
                        <Column className='column-code' title={<Translate id="NUMBER" />} dataIndex="refCode" key="refCode" />
                      </ColumnGroup>
                      <Column className='column-address' key="note" title={<Translate id="EXPLAIN" />} dataIndex="note" />
                      <ColumnGroup title={<Translate id="NUMBER_GENERATED" />}>
                        <Column align='right' width={150} title={<Translate id="DEBT_INC" />} dataIndex="amount" key="amount"
                          render={(val, record) => record.type === "INC" ? <RenderText value={val} type="NUMBER_NO_DOT" /> : ""} />
                        <Column align='right' width={150} title={<Translate id="DEBT_DEC" />} dataIndex="amount" key="amount"
                          render={(val, record) => record.type === "DEC" ? <RenderText value={val} type="NUMBER_NO_DOT" /> : ""} />
                      </ColumnGroup>
                    </Table>
                  </React.Fragment>
                }
              </Card>
            )
          }

        </div>
      </React.Fragment >
    )
  }
}

const stateToProps = (state) => {
  return {
    debtAmount: state.debt.debtAmount,
    debtStatistic: state.debt.debtStatistic,
    debt: state.debt.debt,
    paging: state.debt.paging,
  };
}

const dispatchToProps = (dispatch) => bindActionCreators({
  init: debtActions.init,
  search: debtActions.search,
  exportExcel: debtActions.exportExcel,
}, dispatch);

export default connect(stateToProps, dispatchToProps)(withLocalize(Debt));