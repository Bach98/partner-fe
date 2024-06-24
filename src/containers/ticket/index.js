
import React, { Component } from "react";
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { SearchOutlined, EyeFilled } from '@ant-design/icons';
import { Translate, withLocalize } from "react-localize-redux";
import { Table, PageHeader, Row, Col, Button, Form, Input, Select, Card } from 'antd';
import { globalProps, PERMISSION, isAllow } from "../../data";
import { ticketActions } from "../../actions";
import { LOCAL_PATH } from "../../constants";
import { history } from '../../store';
const { Column } = Table;
const { Option, OptGroup } = Select;

class Ticket extends Component {
  state = {
    showAdvance: false,
    timeToReadonly: false,
    searchBody: {},
    paginate: {
      pageIndex: 1,
      pageSize: 10,
    },
    timeFromReadonly: false,
    imports: [],
    exportImport: { loading: false },
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
      ...this.form.current.getFieldsValue(),
      sort
    };
    this.setState({ exportImport: { loading: true } });
    exportExcel({ data })
      .then(res => {
        this.setState({ exportImport: { loading: false, url: res.fileUrl } });
        this.downloadFile(res.fileUrl);
      }).catch(e => {
        this.setState({ exportImport: { loading: false } });
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

  onGetSearchBody() {
    let body = { ...this.form.current.getFieldsValue() };
    return body;
  }

  gotoDetail(ticketId) {
    this.props.gotoDetail(ticketId);
    history.push(LOCAL_PATH.TICKET.DETAIL);
  }

  render() {
    let { vendingMachineList, ticketTypeList, locationList, statusList, paging, ticketList, total } = this.props;
    let { searchBody, paginate } = this.state;
    return (
      <React.Fragment>
        <PageHeader
          title={<Translate id="TICKET_LIST" />}
          ghost={false}
        />

        {isAllow(PERMISSION.WAREHOUSE_IMPORT.LIST) &&
          <Card
            title={<strong><Translate id="SEARCH" /></strong>}
            size="small"
            style={{ marginTop: 10 }}
          // extra={
          //   <Switch
          //     checked={showAdvance}
          //     checkedChildren={<Translate id="SEARCH_ADVANCE" />}
          //     unCheckedChildren={<Translate id="SEARCH_BASIC" />}
          //     onChange={e => this.toggleAdvanceSearch()}
          //   />
          // }
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
                  <Form.Item {...globalProps.formItem}
                    label={<Translate id="TICKET_CODE" />}
                    name="code"
                  >
                    <Input />
                  </Form.Item>
                </Col>
                {/* Máy */}
                <Col {...globalProps.col}>
                  <Form.Item {...globalProps.formItem}
                    label={<Translate id="MACHINE" />}
                    name="lstVendingId"
                  >
                    <Select {...globalProps.selectSearch} allowClear mode="multiple">
                      {vendingMachineList.map((k, i) =>
                        <Option value={k.id} key={i}>{`${k.code} - ${k.name}`}</Option>
                      )}
                    </Select>
                  </Form.Item>
                </Col>
                <Col {...globalProps.col}>
                  <Form.Item {...globalProps.formItem}
                    label={<Translate id="LOCATION" />}
                    name="lstLocationId"
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
                    label={<Translate id="TICKET_TYPE" />}
                    name="lstMasterTicketTypeId"
                  >
                    <Select {...globalProps.selectSearch} allowClear mode="multiple">
                      {ticketTypeList.map((k, i) =>
                        <OptGroup key={i} label={k.name}>
                          {k.children && k.children.map((l, j) =>
                            <Option key={j} value={l.id}>{`${l.code} - ${l.name}`}</Option>
                          )}
                        </OptGroup>
                      )}
                    </Select>
                  </Form.Item>
                </Col>
                <Col {...globalProps.col}>
                  <Form.Item {...globalProps.formItem}
                    label={<Translate id="STATUS" />}
                    name="lstTicketStatus"
                  >
                    <Select {...globalProps.selectSearch} allowClear mode="multiple">
                      {statusList.map((k, i) =>
                        <Option value={k.code} key={i}>{<Translate id={k.code} />}</Option>
                      )}
                    </Select>
                  </Form.Item>
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
        }
        <div className="card-container">
          {isAllow(PERMISSION.WAREHOUSE_IMPORT.LIST) && ticketList &&
            <Table
              {...globalProps.table}
              dataSource={ticketList.map((k, i) => ({ ...k, key: i, index: (paginate.pageIndex - 1) * paginate.pageSize + i + 1 }))}
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
              <Column {...globalProps.tableRow} title={<Translate id="INDEX" />} dataIndex="index" width={60} />
              <Column {...globalProps.tableRow} dataIndex="id" width={60}
                render={(val, record) =>
                  <Row gutter={8} style={{ flexWrap: "nowrap" }}>
                    <Col flex="32px">
                      <Button
                        type="primary"
                        icon={<EyeFilled />}
                        shape="circle"
                        onClick={e => this.gotoDetail(record.idCrypt)}
                      />
                    </Col>
                  </Row>
                }
              />
              <Column {...globalProps.tableRow} key="code" sorter='true' title={<Translate id="TICKET_CODE" />} dataIndex="code" />
              <Column {...globalProps.tableRow} key="name" sorter='true' title={<Translate id="TICKET_NAME" />} dataIndex="name" />
              <Column {...globalProps.tableRow} key="priority" sorter='true' title={<Translate id="PRIORITY" />} render={val => <Translate id={val} />} dataIndex="priority" />
              <Column {...globalProps.tableRow} key="status" sorter='true' title={<Translate id="STATUS" />} render={val => <Translate id={val} />} dataIndex="status" />
              <Column {...globalProps.tableRow} key="vendingCode" sorter='true' title={<Translate id="MACHINE_CODE" />} dataIndex="vendingCode" />
              <Column {...globalProps.tableRow} key="vendingName" sorter='true' title={<Translate id="MACHINE_NAME" />} dataIndex="vendingName" />
              <Column {...globalProps.tableRow} key="locationAreaMachine" sorter='true' title={<Translate id="LOCATION_AREA" />} dataIndex="locationAreaMachine" />
              <Column {...globalProps.tableRow} key="createdOn" sorter='true' title={<Translate id="CREATED_ON" />} dataIndex="createdOn" />
              <Column {...globalProps.tableRow} key="fromDateReality" sorter='true' title={<Translate id="START_DATE" />} dataIndex="fromDateReality" />
              <Column {...globalProps.tableRow} key="toDateReality" sorter='true' title={<Translate id="END_DATE" />} dataIndex="toDateReality" />
              <Column {...globalProps.tableRow} key="address" sorter='true' title={<Translate id="ADDRESS" />} dataIndex="address" />
            </Table>

          }
        </div>
      </React.Fragment >
    )
  }
}

const stateToProps = (state) => {
  return {
    vendingMachineList: state.ticket.vendingMachineList,
    ticketTypeList: state.ticket.ticketTypeList,
    locationList: state.ticket.locationList,
    statusList: state.ticket.statusList,
    paging: state.ticket.paging,
    ticketList: state.ticket.ticketList,
    total: state.ticket.total,
  };
}

const dispatchToProps = (dispatch) => bindActionCreators({
  init: ticketActions.init,
  search: ticketActions.search,
  gotoDetail: ticketActions.gotoDetail,
}, dispatch);

export default connect(stateToProps, dispatchToProps)(withLocalize(Ticket));