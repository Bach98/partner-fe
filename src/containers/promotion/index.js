import React, { Component } from "react";
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Translate, withLocalize } from "react-localize-redux";
import { Table, PageHeader, Row, Col, Button, Form, Input, Select, Card, } from 'antd';
import { globalProps } from "../../data";
import { promotionActions } from "../../actions";
import { LOCAL_PATH } from "../../constants";
import { history } from '../../store';
import { NavLink } from 'react-router-dom';
import {
  EyeFilled,
  SearchOutlined,
  PlusCircleOutlined
} from '@ant-design/icons';
const { Column } = Table;
const { Option } = Select;


class Promotion extends Component {
  state = {
    searchBody: {},
    sort: {},
    paginate: {
      pageIndex: 1,
      pageSize: 10,
    },
    exportPromotion: { loading: false },
  }
  form = React.createRef()

  componentDidMount() {
    this.props.init();
    this.onSearch({});
  }

  componentDidUpdate(prevProps) {
    if (prevProps.paging.pageSizeDefault !== this.props.paging.pageSizeDefault) {
      this.changePaginate({ pageSize: this.props.paging.pageSizeDefault, pageIndex: this.state.paginate.pageIndex })
    }
  }

  onGetSearchBody() {
    let body = { ...this.form.current.getFieldsValue() };
    return body;
  }

  onSearch() {
    this.setState({
      paginate: {
        ...this.state.paginate,
        pageIndex: 1
      },
    }, () => {
      let { paginate, sort } = this.state;
      let { search } = this.props;
      let searchBody = this.onGetSearchBody();
      let data = {
        ...searchBody,
        paging: {
          ...paginate,
          pageIndex: 1
        },
        sort
      }
      search({ data });
    })
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

  gotoDetail(id) {
    this.props.gotoDetail(id);
    history.push(LOCAL_PATH.PROMOTION.DETAIL);
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
    this.setState({ exportPromotion: { loading: true } });
    exportExcel({ data })
      .then(res => {
        this.setState({ exportPromotion: { loading: false, url: res.fileUrl } });
        this.downloadFile(res.fileUrl);
      }).catch(e => {
        this.setState({ exportPromotion: { loading: false } });
      });
  }

  downloadFile(url) {
    window.open(url);
  }

  render() {
    let { promotion, paging, promotionCategoryList, promotionStatusList, vendingList } = this.props;
    let { paginate, searchBody, exportPromotion } = this.state;
    return (
      <React.Fragment>
        <PageHeader
          title={<Translate id="PROMOTION.PROMOTION_LIST" />}
          ghost={false}
          extra={
           
            <Row {...globalProps.row}>
              <Col>
                <NavLink to={LOCAL_PATH.PROMOTION.DETAIL.replace(":id", "new")}>
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
                <Form.Item {...globalProps.formItem}
                  label={<Translate id="PROMOTION.PROMOTION_TYPE" />}
                  name="promotionCategoryList"
                >
                  <Select {...globalProps.selectSearch} allowClear mode="multiple">
                    {promotionCategoryList.map((k, i) =>
                      <Option value={k.id} key={i}>{<Translate id={`PROMOTION.${k.code}`} />}</Option>
                    )}
                  </Select>
                </Form.Item>
              </Col>
              {/* Mã */}
              <Col {...globalProps.col}>
                <Form.Item {...globalProps.formItem}
                  label={<Translate id="PROMOTION.PROMOTION_CODE" />}
                  name="code"
                >
                  <Input />
                </Form.Item>
              </Col>
              {/* Name */}
              <Col {...globalProps.col}>
                <Form.Item {...globalProps.formItem}
                  label={<Translate id="PROMOTION.PROMOTION_NAME" />}
                  name="name"
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col {...globalProps.col}>
                <Form.Item {...globalProps.formItem}
                  label={<Translate id="PROMOTION.PROMOTION_STATUS" />}
                  name="promotionStatus"
                >
                  <Select {...globalProps.selectSearch} allowClear>
                    {promotionStatusList.map((k, i) =>
                      <Option value={k.id} key={i}>{<Translate id={`PROMOTION.PROMOTION_STATUS_${k.code}`} />}</Option>
                    )}
                  </Select>
                </Form.Item>
              </Col>
              {/* Máy */}
              <Col {...globalProps.col}>
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
              {/* Dòng thời gian */}
              {/* <Col {...globalProps.col}>
                <Input.Group size="large">
                  <Row gutter={8}>
                    <Col style={{ width: '50%' }}>
                      <Form.Item {...globalProps.formItem}
                        label={<Translate id="DATE_FROM" />}
                        name="startDate"
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
                        name="startTime"
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
                        name="endDate"
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
                        name="endTime"
                      >
                        <TimePicker
                          style={{ width: '100%' }}
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                </Input.Group>
              </Col> */}

            </Row>
            {/*  */}
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
                <Button type="primary"
                  className="custom-btn-primary"
                  size="large"
                  loading={exportPromotion.loading} onClick={e => this.onExport()}>
                  <Translate id="EXPORT_EXCEL" />
                </Button>
              </Col>
            </Row>
          </Form>
        </Card>

        <div className="card-container">
          <Table
            {...globalProps.table}
            dataSource={promotion.promotionList.map((k, i) => ({ ...k, key: i, index: (paginate.pageIndex - 1) * paginate.pageSize + i + 1 }))}
            onChange={this.changePaginate}
            pagination={
              {
                pageSize: paginate.pageSize,
                total: promotion.total,
                current: paginate.pageIndex,
                showSizeChanger: true,
                pageSizeOptions: paging.pageSizes,
                locale: { items_per_page: "" },
                showTotal: sum => <div>{sum} <Translate id="RESULT" /></div>
              }
            }
          >
            <Column {...globalProps.tableRow} title={<Translate id="INDEX" />} dataIndex="index" width={50} />
            <Column {...globalProps.tableRow} dataIndex="id" width={50}
              render={(val, record) =>
                // <Row gutter={8} style={{ flexWrap: "nowrap" }}>
                //   <Col flex="32px">
                //     <Button
                //       type="primary"
                //       icon={<EyeFilled />}
                //       shape="circle"
                //       onClick={e => this.gotoDetail(record.id)}
                //     />
                //   </Col>
                // </Row>
                <Row gutter={8} style={{ flexWrap: "nowrap" }}>
                      <Col flex="32px">
                        <NavLink
                          to={LOCAL_PATH.PROMOTION.DETAIL.replace(
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
            <Column key="code" {...globalProps.tableRow} title={<Translate id="PROMOTION.PROMOTION_CODE" />} dataIndex="code" />
            <Column key="name" {...globalProps.tableRow} title={<Translate id="PROMOTION.PROMOTION_NAME" />} dataIndex="name" />
            <Column key="promotionCategory"  {...globalProps.tableRow} title={<Translate id="PROMOTION.PROMOTION_CATEGORY" />} render={val => <Translate id={`PROMOTION.${val}`} />} dataIndex="promotionCategory" />
            <Column key="status" {...globalProps.tableRow} title={<Translate id="STATUS" />} render={val => <Translate id={`PROMOTION.PROMOTION_STATUS_${val}`} />} dataIndex="status" />
            <Column key="startDate" {...globalProps.tableRow} title={<Translate id="PROMOTION.PROMOTION_START_DATE" />} dataIndex="startDate" />
            <Column key="endDate" {...globalProps.tableRow} title={<Translate id="PROMOTION.PROMOTION_END_DATE" />} dataIndex="endDate" />
            <Column key="createdOn" {...globalProps.tableRow} title={<Translate id="PROMOTION.PROMOTION_CREATED_ON" />} dataIndex="createdOn" />
          </Table>
        </div>
      </React.Fragment >
    )
  }
}

const stateToProps = (state) => {
  return {
    paging: state.promotion.paging,
    promotionCategoryList: state.promotion.promotionCategoryList,
    promotionStatusList: state.promotion.promotionStatusList,
    vendingList: state.promotion.vendingList,
    promotion: state.promotion.promotion,
  };
}

const dispatchToProps = (dispatch) => bindActionCreators({
  init: promotionActions.init,
  search: promotionActions.search,
  exportExcel: promotionActions.exportExcel,
  gotoDetail: promotionActions.gotoDetail,
}, dispatch);

export default connect(stateToProps, dispatchToProps)(withLocalize(Promotion));