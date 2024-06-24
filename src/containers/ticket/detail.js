import React, { Component } from "react";
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Translate, withLocalize } from "react-localize-redux";
import { PageHeader, Row, Col, Form, Card, Upload, Select, Input, Tabs } from "antd";
import { PlusOutlined } from '@ant-design/icons';
import { LOCAL_PATH } from "../../constants";
import { history } from '../../store';
import { globalProps, rules } from "../../data";
import { ticketActions } from "../../actions";

const { Option, OptGroup } = Select;

const { TabPane } = Tabs;
const { TextArea } = Input;


const props = {
  showUploadList: {
    showDownloadIcon: true,
    showRemoveIcon: true,
    showPreviewIcon: false,
  },
};
const tabs = {
  INFO_COMMON: "INFO_COMMON",
  STATUS_HISTORY: "STATUS_HISTORY",
};

class TicketDetail extends Component {
  state = {
    addressReaOnly: undefined,
    lstArea: [],
    lstDevice: [],
    lstLocation: [],
    lstMethodPayment: [],
    lstOrganization: [],
    lstPriority: [],
    lstProduct: [],
    lstSource: [],
    lstStatus: [],
    lstTicketType: [],
    lstVending: [],
    lstFile: [],
  }

  componentDidMount() {
    let { ticketId, detail, init } = this.props;
    let data = { idCrypt: ticketId };
    if (ticketId) {
      init();
      detail({ data });
    }
    else {
      history.push(LOCAL_PATH.TICKET.INDEX);
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.feedback !== this.props.feedback) {
      this.setState({
        addressReaOnly: this.props.feedback.address,
      });
    }
  }

  render() {
    let {
      locationList, areaList, vendingList,
      ticket,
      ticketTypeList,
      deviceList,
      methodPaymentList,
      priorityList,
      solutionList,
      productList,
    } = this.props;
    //   let { addressReaOnly, lstVending, lstLocation, lstArea, lstFile } = this.state
    return (
      <React.Fragment>
        <PageHeader
          title={<span><Translate id="TICKET_LIST" /> / <Translate id="DETAIL" /></span>}
          ghost={false}
          onBack={e => history.push(LOCAL_PATH.TICKET.INDEX)}
        />

        <Card size="small" style={{ marginTop: 10 }}>
          <Tabs defaultActiveKey={tabs.INFO_COMMON}
            type="card"
          >
            <TabPane tab={<strong>{<Translate id="TICKET_COMMON_INFO" />}</strong>}
              key={tabs.INFO_COMMON}>
              <Card>
                <Form
                  {...globalProps.form}
                  onFinish={(e) => this.onSave(e)}
                  initialValues={{ ...ticket }}
                  key={ticket.id}
                  ref={this.form}
                >
                  {/* Start thông tin */}
                  <Row {...globalProps.row}>
                    <Col {...globalProps.colHalf} hidden>
                      <Form.Item
                        {...globalProps.formItem}
                        label="Id"
                        name="id"
                      >
                        <Input
                          disabled
                          style={{ width: "100%" }}
                        />
                      </Form.Item>
                    </Col>
                    <Col {...globalProps.colHalf} hidden>
                      <Form.Item
                        {...globalProps.formItem}
                        label="version"
                        name="version"
                      >
                        <Input
                          disabled
                          style={{ width: "100%" }}
                        />
                      </Form.Item>
                    </Col>
                    <Col {...globalProps.colHalf}>
                      <Form.Item
                        {...globalProps.formItem}
                        label={<Translate id="TICKET_CODE" />}
                        name="code"
                      >
                        <Input disabled value={ticket.code} />
                      </Form.Item>
                    </Col>
                    <Col {...globalProps.colHalf} style={{ display: !ticket.id }}>
                      <Form.Item
                        {...globalProps.formItem}
                        label={<Translate id="TICKET_STATUS" />}
                        name="status"
                      >
                        {/* <Input
                          disabled
                          style={{ width: "100%" }}
                        /> */}
                        <span hidden={!ticket.id}>
                          <Translate id={`TICKET_${ticket.status}`} />
                        </span>
                      </Form.Item>
                    </Col>
                    <Col {...globalProps.colHalf}>
                      <Form.Item {...globalProps.formItem}
                        label={<Translate id="LOCATION" />}
                        name="locationId"
                      >
                        <Select disabled={ticket.id} {...globalProps.selectSearch}>
                          {locationList.map((k, i) =>
                            <Option value={k.id} key={i}>{`${k.code} - ${k.name}`}</Option>
                          )}
                        </Select>
                      </Form.Item>
                    </Col>
                    <Col {...globalProps.colHalf}>
                      <Form.Item
                        {...globalProps.formItem}
                        label={<Translate id="TICKET_AREA" />}
                        name="areaId"
                      >
                        <Select disabled={ticket.id} style={{ width: "100%" }}>
                          {areaList.map((k, i) =>
                            <Option key={i} value={k.id}>{k.name}</Option>
                          )}
                        </Select>
                      </Form.Item>
                    </Col>
                    <Col {...globalProps.col3}>
                      <Form.Item
                        {...globalProps.formItem}
                        label={<Translate id="TICKET_ADDRESS" />}
                        name="address"
                      >
                        <span>{ticket.address} </span>
                      </Form.Item>
                    </Col>

                    <Col {...globalProps.colHalf}>
                      <Form.Item
                        {...globalProps.formItem}
                        label={<Translate id="TICKET_VM" />}
                        name="vendingId"
                      >
                        <Select disabled={ticket.id} style={{ width: "100%" }} onChange={(e) => this.onChangeVending(e)}>
                          {vendingList.map((k, i) =>
                            <Option key={i} value={k.id}>{k.name}</Option>
                          )}
                        </Select>
                      </Form.Item>
                    </Col>

                    <Col {...globalProps.colHalf}>
                      <Form.Item
                        {...globalProps.formItem}
                        label={<Translate id="TICKET_TICKET_TYPE" />}
                        name="masterTicketTypeId"
                        rules={[rules.required]}
                      >
                        <Select disabled={ticket.id} allowClear>
                          {ticketTypeList.map((k, i) =>
                            <OptGroup label={k.name} key={`parent_type_${i}`}>
                              {k.children.map((h, j) =>
                                <Option key={`children_type_${i}_${j}`} value={h.id}>{h.name}</Option>
                              )}
                            </OptGroup>
                          )}
                        </Select>
                      </Form.Item>
                    </Col>


                    {/* <Col {...globalProps.colHalf}>
                      <Form.Item
                        {...globalProps.formItem}
                        label={<Translate id="TICKET_SOURCE" />}
                        name="source"
                      >
                        <Select disabled={ticket.id} style={{ width: "100%" }} >
                          {sourceList.map((k, i) =>
                            <Option key={i} value={k.value}>{k.text}</Option>
                          )}
                        </Select>
                      </Form.Item>
                    </Col> */}

                    <Col {...globalProps.colHalf}>
                      <Form.Item
                        {...globalProps.formItem}
                        label={<Translate id="TICKET_PHONECLIENT" />}
                        name="phoneClient"
                        rules={[rules.required]}
                      >
                        <Input
                          disabled={ticket.id}
                          style={{ width: "100%" }}
                        />
                      </Form.Item>
                    </Col>
                    <Col {...globalProps.colHalf}>
                      <Form.Item
                        {...globalProps.formItem}
                        label={<Translate id="TICKET_NAMECLIENT" />}
                        name="nameClient"
                        rules={[rules.required]}
                      >
                        <Input
                          disabled={ticket.id}
                          style={{ width: "100%" }}
                        />
                      </Form.Item>
                    </Col>

                    {/* Hình ảnh đính kèm */}
                    <Col {...globalProps.col3}>
                      <Form.Item
                        {...globalProps.formItem}
                        label={<Translate id="TICKET_IMAGE_ATTACH" />}
                        name="fileAttachList"
                        valuePropName="fileList"
                        getValueFromEvent={e => {
                          if (Array.isArray(e)) {
                            return e;
                          }
                          return !!e ? e.fileList : [];
                        }}
                      >
                        <Upload
                          name="fileAttach"
                          accept="image/*"
                          listType="picture-card"
                          multiple={true}
                          onChange={this.onChange}
                          {...props}
                          disabled={ticket.id}
                        >
                          {ticket.id <= 0 && (<div>
                            <PlusOutlined />
                            <div style={{ marginTop: 8 }}>Upload</div>
                          </div>)}
                        </Upload>
                      </Form.Item>
                    </Col>
                    <Col {...globalProps.col3}>
                      <Form.Item
                        {...globalProps.formItem}
                        label={<Translate id="TICKET_NOTE" />}
                        name="note"
                      >
                        <TextArea rows={4} disabled={ticket.id}
                          style={{ width: "100%" }}
                        />
                      </Form.Item>
                    </Col>

                    <Col {...globalProps.col3}>
                      <Form.Item
                        {...globalProps.formItem}
                        label={<Translate id="TICKET_PRIORITY" />}
                        name="priority"
                      >
                        <Select disabled={ticket.id} style={{ width: "100%" }} >
                          {priorityList.map((k, i) =>
                            <Option key={i} value={k.value}>{k.text}</Option>
                          )}
                        </Select>
                      </Form.Item>
                    </Col>

                    <Col {...globalProps.colHalf}>
                      <Form.Item
                        {...globalProps.formItem}
                        label={<Translate id="TICKET_SOLUTION" />}
                        name="solution"
                      >
                        <Select disabled={ticket.id} style={{ width: "100%" }} >
                          {solutionList.map((k, i) =>
                            <Option key={i} value={k.id}>{k.name}</Option>
                          )}
                        </Select>
                      </Form.Item>
                    </Col>

                    <Col {...globalProps.colHalf}>
                      <Form.Item
                        {...globalProps.formItem}
                        label={<Translate id="TICKET_REASON_SOLUTION" />}
                        name="noteSolution"
                      >
                        <TextArea disabled={ticket.id} rows={4}
                          style={{ width: "100%" }}
                        />
                      </Form.Item>
                    </Col>
                    {/* Hình ảnh xử lý */}
                    <Col {...globalProps.colHalf}>
                      <Form.Item
                        {...globalProps.formItem}
                        label={<Translate id="TICKET_IMAGE_HANDLE" />}
                        name="fileHandleList"
                        valuePropName="fileList"
                        getValueFromEvent={e => {
                          if (Array.isArray(e)) {
                            return e;
                          }
                          return !!e ? e.fileList : [];
                        }}
                      >
                        <Upload
                          name="fileAttach"
                          accept="image/*"
                          listType="picture-card"
                          multiple={true}
                          onChange={this.onChange}
                          {...props}
                          disabled={ticket.id}
                        >
                          {ticket.id <= 0 && (<div>
                            <PlusOutlined />
                            <div style={{ marginTop: 8 }}>Upload</div>
                          </div>)}
                        </Upload>
                      </Form.Item>
                    </Col>
                    <Col {...globalProps.col3}>
                      <Form.Item
                        {...globalProps.formItem}
                        label={<Translate id="TICKET_DEVICE" />}
                        name="device"
                      >
                        <Select disabled={ticket.id} style={{ width: "100%" }} >
                          {deviceList.map((k, i) =>
                            <Option key={i} value={k.id}>{k.name}</Option>
                          )}
                        </Select>
                      </Form.Item>
                    </Col>
                    <Col {...globalProps.col3}>
                      <Form.Item
                        {...globalProps.formItem}
                        label={<Translate id="TICKET_PRODUCT" />}
                        name="productId"
                      >
                        <Select disabled={ticket.id} style={{ width: "100%" }} >
                          {productList.map((k, i) =>
                            <Option key={i} value={k.id}>{k.name}</Option>
                          )}
                        </Select>
                      </Form.Item>
                    </Col>
                    <Col {...globalProps.col3}>
                      <Form.Item
                        {...globalProps.formItem}
                        label={<Translate id="TICKET_PAYMENT_METHOD" />}
                        name="methodPayment"
                      >
                        <Select disabled={ticket.id} style={{ width: "100%" }} >
                          {methodPaymentList.map((k, i) =>
                            <Option key={i} value={k.id}>{k.name}</Option>
                          )}
                        </Select>
                      </Form.Item>
                    </Col>
                    <Col {...globalProps.colHalf} hidden={!ticket.id}>
                      <Form.Item
                        {...globalProps.formItem}
                        label={<Translate id="TICKET_CREATEDON" />}
                        name="createdOn"
                      >
                        <Input
                          disabled={ticket.id}
                          style={{ width: "100%" }}
                        />
                      </Form.Item>
                    </Col>
                    <Col {...globalProps.colHalf} hidden={!ticket.id}>
                      <Input.Group size="medium">
                        <Row gutter={8}>
                          <Col style={{ width: '49%' }}>
                            <Form.Item {...globalProps.formItem}
                              label={<Translate id="TICKET_DATE_REAL" />}
                              name="fromDateReality"
                            >
                              <Input disabled={ticket.id} style={{ width: '100%' }} />
                            </Form.Item>
                          </Col>
                          <Col style={{ width: '2%' }}>
                            <Form.Item {...globalProps.formItem}
                              label="&nbsp;"
                            >
                              -
                            </Form.Item>
                          </Col>
                          <Col style={{ width: '49%' }}>

                            <Form.Item {...globalProps.formItem}
                              label="&nbsp;"
                              name="toDateReality"
                            >
                              <Input disabled={ticket.id} style={{ width: '100%' }} />
                            </Form.Item>
                          </Col>
                        </Row>
                      </Input.Group>
                    </Col>
                  </Row>
                </Form>
              </Card>
            </TabPane>
            <TabPane hidden={!ticket.id} tab={<strong>{<Translate id="TICKET_STATUS_HISTORY" />}</strong>}
              key={tabs.STATUS_HISTORY}>
              <Card>
                {ticket.statusHistoryList && ticket.statusHistoryList.map((k, i) =>
                  <Row className="mr-bottom-10" key={`status_history_${i.id}`}>
                    <Col {...globalProps.col3}><Translate id="TICKET_UPDATED_BY"></Translate>  <strong>{k.createdName}</strong> <strong>{k.createdOn}</strong></Col>
                    <Col {...globalProps.col3}>
                      <Translate id="TICKET_CONVERSION_STATUS"></Translate>
                      {
                        k.fromStatus
                          ?
                          <span>
                            <strong><Translate id={`TICKET_${k.fromStatus}`}></Translate></strong>
                            <span><Translate id="TICKET_ARROW_RIGHT"></Translate></span>
                          </span>
                          : ""
                      }
                      <strong><Translate id={`TICKET_${k.toStatus}`}></Translate></strong>
                    </Col>
                  </Row>
                )}
              </Card>
            </TabPane>
          </Tabs>
        </Card>

      </React.Fragment >
    )
  }
}

const stateToProps = (state) => {
  return {

    areaList: state.ticket.areaList,
    deviceList: state.ticket.deviceList,
    locationList: state.ticket.locationList,
    methodPaymentList: state.ticket.methodPaymentList,
    organizationList: state.ticket.organizationList,
    priorityList: state.ticket.priorityList,
    solutionList: state.ticket.solutionList,
    productList: state.ticket.productList,
    sourceList: state.ticket.sourceList,
    statusList: state.ticket.statusList,
    ticketTypeList: state.ticket.ticketTypeList,
    vendingList: state.ticket.vendingMachineList,

    ticket: state.ticket.ticket,
    ticketId: state.ticket.ticketId,
    statusHistoryList: state.ticket.statusHistoryList,
  };
}

const dispatchToProps = (dispatch) => bindActionCreators({
  init: ticketActions.init,
  detail: ticketActions.detail,
}, dispatch);

export default connect(stateToProps, dispatchToProps)(withLocalize(TicketDetail));