import React, { Component } from "react";
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Translate, withLocalize } from "react-localize-redux";
import { PageHeader, Row, Col, Form, Card, Input, Tabs, Modal, InputNumber, Table, Typography } from "antd";
import { LOCAL_PATH } from "../../constants";
import { history } from '../../store';
import { globalProps, RenderText } from "../../data";
import { reconciliationRevenueActions } from "../../actions";
const { Column } = Table;
const { Text } = Typography;

const { TabPane } = Tabs;
const { TextArea } = Input;
// const colors = [
//   "#878BB6", "#FFEA88", "#FF8153", "#4ACAB4", "#c0504d", "#8064a2", "#f2ab71", "#2ab881", "#4f81bd", "#2c4d75"
// ]
//const listVND = [500000, 200000, 100000, 50000, 20000, 10000, 5000, 2000, 1000];

// const props = {
//   showUploadList: {
//     showDownloadIcon: true,
//     showRemoveIcon: true,
//     showPreviewIcon: false,
//   },
// };
const tabs = {
  INFO_COMMON: "INFO_COMMON",
  COLLECT_CASH_RELATED: "COLLECT_CASH_RELATED",
  WALLET_FEE: "WALLET_FEE"
};

class ReconciliationRevenueDetail extends Component {
  state = {
    visibleModal: false,
    visibleModalConfirm: false,
    visibleModalCancel: false,
    exportReport: { loading: false },
  }

  componentDidMount() {
    let {
      match: {
        params: { id },
      },
    } = this.props;

    let { detail } = this.props;
    let data = { idCrypt: id };
    detail({ data });
  }

  componentDidUpdate(prevProps) { }

  showModal(transactVendingLogId) {
    let data = {
      transactVendingLogId: transactVendingLogId
    }
    let { getCashSheetDetail } = this.props;
    getCashSheetDetail({ data });
    this.setState({
      visibleModal: true
    });
  };

  handleCancel = () => {
    this.setState({
      visibleModal: false
    });
  };

  showModalConfirm(item) {
    this.setState({
      visibleModalConfirm: true
    });
  };

  hideModalConfirm = () => {
    this.setState({
      visibleModalConfirm: false
    });
  };

  confirm = () => {
    let { changeReconciliationStatus, userInfo, reconciliationDetail } = this.props;
    let data = {
      ReconciliationRevenueId: reconciliationDetail.id,
      OldStatus: "APPROVED",
      NewStatus: "DONE",
      PartnerUserId: userInfo.id,
      PartnerUserName: userInfo.userName,
    }

    changeReconciliationStatus({ data })
      .finally(() => {
        history.push(LOCAL_PATH.FINANCE.RECONCILIATION_REVENUE.INDEX);
      });

    this.setState({
      visibleModalConfirm: false,
    });
    return Promise.resolve();
  };

  showModalCancel() {
    this.setState({
      visibleModalCancel: true,
    });
  };

  hideModalCancel = () => {
    this.setState({
      visibleModalCancel: false,
    });
  };

  cancel = () => {
    let { changeReconciliationStatus, userInfo, reconciliationDetail } = this.props;
    let data = {
      ReconciliationRevenueId: reconciliationDetail.id,
      OldStatus: reconciliationDetail.reconciliationStatus,
      NewStatus: "CANCELED",
      PartnerUserId: userInfo.id,
      PartnerUserName: userInfo.userName,
    }
    changeReconciliationStatus({ data })
      .finally(() => {
        history.push(LOCAL_PATH.FINANCE.RECONCILIATION_REVENUE.INDEX);
      });

    this.setState({
      visibleModalCancel: false,
    });
    return Promise.resolve();
  }

  onGetSearchBody() {
    let body = { ...this.form.current.getFieldsValue() };
    return body;
  }

  onExport() {
    let {
      exportForm,
      match: {
        params: { id },
      }
    } = this.props;

    let data = { idCrypt: id };
    this.setState({ exportReport: { loading: true } });
    exportForm({ data })
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
    let { reconciliationDetail, translate, listCashSheetDetail, listSheetDetail } = this.props;
    // let { visibleModal, exportReport } = this.state;

    return (
      <React.Fragment>
        <PageHeader
          title={<span><Translate id="RECONCILIATION_REVENUE_LIST" /> / <Translate id="DETAIL" /></span>}
          ghost={false}
          onBack={e => history.push(LOCAL_PATH.FINANCE.RECONCILIATION_REVENUE.INDEX)}
        // extra={[
        //   <React.Fragment>
        //     {
        //       isAllow(PERMISSION.RECONCILIATION_REVENUE.CONFIRM) && reconciliationDetail.reconciliationStatus == "APPROVED" && (
        //         <Button size="large" className="custom-btn-primary" type="primary" onClick={() => this.showModalConfirm()}>
        //           <span>
        //             <Translate id="CONFIRM" />
        //           </span>
        //         </Button>
        //       )
        //     }
        //     {
        //       isAllow(PERMISSION.RECONCILIATION_REVENUE.CANCEL) && reconciliationDetail.reconciliationStatus != "DONE" && (
        //         <Button size="large" className="custom-btn-primary" type="primary" onClick={() => this.showModalCancel()}>
        //           <span>
        //             <Translate id="CANCEL" />
        //           </span>
        //         </Button>
        //       )
        //     }
        //     <Button type="primary"
        //       className="custom-btn-primary"
        //       size="large"
        //       loading={exportReport.loading} onClick={() => this.onExport()}>
        //       <Translate id="EXPORT_FORM" />
        //     </Button>
        //   </React.Fragment>
        // ]}
        />

        <Card size="small" style={{ marginTop: 10 }}>
          <Tabs defaultActiveKey={tabs.INFO_COMMON}
            type="card"
          >
            <TabPane tab={<strong>{<Translate id="TICKET_COMMON_INFO" />}</strong>}
              key={tabs.INFO_COMMON}>
              <Form
                {...globalProps.form}
                onFinish={(e) => this.onSave(e)}
                initialValues={{ ...reconciliationDetail }}
                key={reconciliationDetail.id}
                ref={this.form}
              >
                <Card>
                  <Row {...globalProps.row}>
                    <Col {...globalProps.colHalf}>
                      <Form.Item
                        {...globalProps.formItem}
                        label={<Translate id="RECONCILIATION_REVENUE.CODE" />}
                        name="code"
                      >
                        <Input disabled />
                      </Form.Item>
                    </Col>
                    <Col {...globalProps.colHalf}>
                      <Form.Item
                        {...globalProps.formItem}
                        label={<Translate id="RECONCILIATION_REVENUE.STATUS" />}
                      >
                        <Input disabled value={reconciliationDetail.reconciliationStatus ? translate(`RECONCILIATION_STATUS.${(reconciliationDetail.reconciliationStatus)}`) : ""} />
                      </Form.Item>
                    </Col>
                    <Col {...globalProps.colHalf}>
                      <Form.Item
                        {...globalProps.formItem}
                        label={<Translate id="MACHINE_CODE" />}
                      >
                        <Input disabled value={reconciliationDetail.reconciliationRevenueVending ? reconciliationDetail.reconciliationRevenueVending.vendingCode : ""} />
                      </Form.Item>
                    </Col>
                    <Col {...globalProps.colHalf}>
                      <Form.Item
                        {...globalProps.formItem}
                        label={<Translate id="MACHINE_NAME" />}
                      >
                        <Input disabled value={reconciliationDetail.reconciliationRevenueVending ? reconciliationDetail.reconciliationRevenueVending.vendingName : ""} />
                      </Form.Item>
                    </Col>
                    {/* <Col {...globalProps.colHalf}>
                      <Form.Item {...globalProps.formItem}
                        label={<Translate id="RECONCILIATION_REVENUE.PAYMENT_STATUS" />}
                      >
                        <Input disabled value={reconciliationDetail.paymentStatus ? translate(`PAYMENT_STATUS_${(reconciliationDetail.paymentStatus)}`) : ""}
                        />
                      </Form.Item>
                    </Col>
                    <Col {...globalProps.colHalf}>
                      <Form.Item
                        {...globalProps.formItem}
                        label={<Translate id="RECONCILIATION_REVENUE.LAST_PAYMENT_DATE" />}
                        name="lastPayment"
                      >
                        <Input disabled />
                      </Form.Item>
                    </Col> */}
                    <Col {...globalProps.colHalf}>
                      <Form.Item
                        {...globalProps.formItem}
                        label={<Translate id="RECONCILIATION_REVENUE.FROM_DATE" />}
                        name="fromDate"
                      >
                        <Input disabled />
                      </Form.Item>
                    </Col>
                    <Col {...globalProps.colHalf}>
                      <Form.Item
                        {...globalProps.formItem}
                        label={<Translate id="RECONCILIATION_REVENUE.TO_DATE" />}
                        name="toDate"
                      >
                        <Input disabled />
                      </Form.Item>
                    </Col>
                    <Col {...globalProps.col3}>
                      <Form.Item
                        {...globalProps.formItem}
                        label={<Translate id="RECONCILIATION_REVENUE.NOTE" />}
                        name="note"
                      >
                        <TextArea rows={2} disabled
                          style={{ width: "100%" }}
                        />
                      </Form.Item>
                    </Col>
                    <Col {...globalProps.colHalf}>
                      <Form.Item
                        {...globalProps.formItem}
                        label={<Translate id="RECONCILIATION_REVENUE.CREATED_BY" />}
                        name="createdBy"
                      >
                        <Input disabled />
                      </Form.Item>
                    </Col>
                    <Col {...globalProps.colHalf}>
                      <Form.Item
                        {...globalProps.formItem}
                        label={<Translate id="RECONCILIATION_REVENUE.CREATED_DATE" />}
                        name="createdOn"
                      >
                        <Input disabled />
                      </Form.Item>
                    </Col>
                  </Row>

                </Card>
                <Card title={<Translate id="RECONCILIATION_REVENUE.INFORMATION_A" />} style={{ marginTop: 10 }}>
                  <Row {...globalProps.row}>
                    <Col {...globalProps.colHalf}>
                      <Form.Item
                        {...globalProps.formItem}
                        label={<Translate id="RECONCILIATION_REVENUE.NAME_A" />}
                        name="company"
                      >
                        <span>{reconciliationDetail.company}</span>
                      </Form.Item>
                    </Col>
                    <Col {...globalProps.colHalf}></Col>
                    <Col {...globalProps.colHalf}>
                      <Form.Item
                        {...globalProps.formItem}
                        label={<Translate id="RECONCILIATION_REVENUE.APPROVER" />}
                        name="companyApprove"
                      >
                        <Input disabled />
                      </Form.Item>
                    </Col>
                    <Col {...globalProps.colHalf}>
                      <Form.Item {...globalProps.formItem}
                        label={<Translate id="RECONCILIATION_REVENUE.POSITION" />}
                        name="companyTitle"
                      >
                        <Input disabled />
                      </Form.Item>
                    </Col>
                    <Col {...globalProps.colHalf}>
                      <Form.Item {...globalProps.formItem}
                        label={"Số tiền thực nhận"}
                        name="amountReceived"
                      >
                        <InputNumber style={{ width: "100%" }} disabled {...globalProps.inputNumberVND} />
                      </Form.Item>
                    </Col>
                    <Col {...globalProps.colHalf}>
                      <Form.Item {...globalProps.formItem}
                        label={"Tiền chênh lệch"}
                        name="receivedDifference"
                      >
                        <InputNumber style={{ width: "100%" }} disabled {...globalProps.inputNumberVND} />
                      </Form.Item>
                    </Col>
                    <Col {...globalProps.col3}>
                      <Form.Item
                        {...globalProps.formItem}
                        label={"Ghi chú nhận tiền"}
                        name="revenueNote"
                      >
                        <TextArea rows={2} disabled
                          style={{ width: "100%" }}
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                </Card>
                <Card title={<Translate id="RECONCILIATION_REVENUE.INFORMATION_B" />} style={{ marginTop: 10 }}>
                  <Row {...globalProps.row}>
                    <Col {...globalProps.colHalf}>
                      <Form.Item
                        {...globalProps.formItem}
                        label={<Translate id="RECONCILIATION_REVENUE.NAME_B" />}
                        name="partner"
                      >
                        <span>{reconciliationDetail.partner}</span>
                      </Form.Item>
                    </Col>
                    <Col {...globalProps.colHalf}></Col>
                    <Col {...globalProps.colHalf}>
                      <Form.Item
                        {...globalProps.formItem}
                        label={<Translate id="RECONCILIATION_REVENUE.REPRESENTATIVE" />}
                        name="partnerRepresentative"
                      >
                        <Input disabled />
                      </Form.Item>
                    </Col>
                    <Col {...globalProps.colHalf}>
                      <Form.Item {...globalProps.formItem}
                        label={<Translate id="RECONCILIATION_REVENUE.POSITION" />}
                        name="partnerTitle"
                      >
                        <Input disabled />
                      </Form.Item>
                    </Col>
                  </Row>
                </Card>

                <div style={{ display: "flex", marginBottom: 20 }}>
                  <div className="card-container" style={{ width: "50%", marginRight: 10 }}>
                    <h4 style={{ marginTop: 20 }}><b>Số Tờ Thu Thực Tế</b></h4>
                    <Table
                      {...globalProps.table}
                      dataSource={
                        listCashSheetDetail.map((k, i) => {
                          k.key = i;
                          return k;
                        })
                      }
                      pagination={false}
                      summary={(pageData) => {
                        let totalAmount = 0;
                        let totalActualSheet = 0;
                        pageData.forEach(({ actualSheet, code }) => {
                          totalActualSheet += actualSheet
                          totalAmount += (actualSheet * code);
                        });

                        return (
                          <Table.Summary.Row>
                            <Table.Summary.Cell ><strong>Tổng</strong></Table.Summary.Cell>
                            <Table.Summary.Cell >
                              <Text type="danger">{totalActualSheet + " tờ"}</Text>
                            </Table.Summary.Cell>
                            <Table.Summary.Cell >
                              <Text type="danger" >{globalProps.inputNumberVND.formatter(totalAmount)}</Text>
                            </Table.Summary.Cell>
                          </Table.Summary.Row>
                        );
                      }}
                    >
                      <Column
                        align="center"
                        key="code"
                        title={"Mệnh giá"}
                        dataIndex="code"
                        render={(val) => val ? globalProps.inputNumberVND.formatter(val) : 0}
                      />
                      <Column
                        align="right"

                        key="actualSheet"
                        title={"Thu thực tế"}
                        dataIndex="actualSheet"
                      />
                      <Column
                        align="right"
                        title={"Thành tiền"}

                        render={(val, record) => globalProps.inputNumberVND.formatter(record.code * record.actualSheet)}
                      />
                    </Table>
                  </div>
                  <div className="card-container" style={{ width: "50%", marginLeft: 10 }} >
                    <h4 style={{ marginTop: 20 }}><b>Số Tờ Hệ Thống Nhận</b></h4>
                    <Table
                      {...globalProps.table}
                      dataSource={
                        listCashSheetDetail.map((k, i) => {
                          k.key = i;
                          return k;
                        })
                      }
                      pagination={false}
                      summary={(pageData) => {
                        let totalAmount = 0;
                        let totalSystemAmount = 0;
                        pageData.forEach(({ systemSheet, code }) => {
                          totalSystemAmount += systemSheet
                          totalAmount += (systemSheet * code);
                        });

                        return (

                          <Table.Summary.Row>
                            <Table.Summary.Cell ><strong>Tổng</strong></Table.Summary.Cell>
                            <Table.Summary.Cell >
                              <Text type="danger">{totalSystemAmount}</Text>
                            </Table.Summary.Cell>
                            <Table.Summary.Cell >
                              <Text type="danger">{globalProps.inputNumberVND.formatter(totalAmount)}</Text>
                            </Table.Summary.Cell>

                          </Table.Summary.Row>
                        );
                      }}
                    >
                      <Column
                        align="center"
                        key="code"
                        title={"Mệnh giá"}
                        dataIndex="code"
                        render={(val) => val ? globalProps.inputNumberVND.formatter(val) : 0}
                      />
                      <Column
                        align="right"
                        key="systemSheet"
                        title={"Thu thực tế"}
                        dataIndex="systemSheet"
                      />
                      <Column
                        align="right"
                        title={"Thành tiền"}
                        render={(val, record) => globalProps.inputNumberVND.formatter(record.code * record.systemSheet)}
                      />
                    </Table>
                  </div>
                </div>

                <div style={{ display: "flex", marginBottom: 20 }}>
                  <div className="card-container" style={{ width: "50%", marginRight: 10 }}>
                    <h4 style={{ marginTop: 20 }}><b>Số Tờ Fill</b></h4>
                    <table className="table table-hover table-bordered table-striped" id="tableValue2" >
                      <thead style={{ backgroundColor: "#d9d9d9" }}>
                        <tr>
                          <th style={{ width: "30%", textAlign: "center" }}>Mệnh Giá Fill</th>
                          <th style={{ width: "25%", textAlign: "center" }}>Số Tờ Fill</th>
                          <th style={{ width: "45%", textAlign: "center" }}>Thành Tiền</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td style={{ textAlign: "center" }}>{globalProps.inputNumberVND.formatter(listSheetDetail.codeFill)}</td>
                          <td style={{ color: "red" }}>{listSheetDetail.fillSheet + " tờ"}</td>
                          <td style={{ textAlign: "right", color: "red" }}>{globalProps.inputNumberVND.formatter(listSheetDetail.codeFill * listSheetDetail.fillSheet)}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <div className="card-container" style={{ width: "50%", marginLeft: 10 }} >
                    <h4 style={{ marginTop: 20 }}><b>Số Tờ Đã Thối</b></h4>
                    <table className="table table-hover table-bordered table-striped" id="tableValue2" >
                      <thead style={{ backgroundColor: "#d9d9d9" }}>
                        <tr>
                          <th style={{ width: "30%", textAlign: "center" }}>Mệnh Giá Thối</th>
                          <th style={{ width: "25%", textAlign: "center" }}>Số Tờ Thối</th>
                          <th style={{ width: "45%", textAlign: "center" }}>Thành Tiền</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td style={{ textAlign: "center" }}>{globalProps.inputNumberVND.formatter(listSheetDetail.codeFill)}</td>
                          <td style={{ color: "red" }}>{((reconciliationDetail.totalPayout - reconciliationDetail.unProcessCashPayout) / listSheetDetail.codeFill) + " tờ"}</td>
                          <td style={{ textAlign: "right", color: "red" }}>{globalProps.inputNumberVND.formatter((reconciliationDetail.totalPayout - reconciliationDetail.unProcessCashPayout))}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>


                {/* <h4 style={{ marginTop: 20 }}><b><Translate id="RECONCILIATION_REVENUE.CATEGORY_RECOCILIATION" /></b></h4> */}
                <table className="table table-hover table-bordered table-striped" id="tableValue">
                  <thead>
                    <tr>
                      <th style={{ width: "30%", textAlign: "center" }}><Translate id="RECONCILIATION_REVENUE.CONTENT" /></th>
                      <th style={{ width: "25%", textAlign: "center" }}><Translate id="RECONCILIATION_REVENUE.VALUE" /></th>
                      <th style={{ width: "45%", textAlign: "center" }}><Translate id="RECONCILIATION_REVENUE.EXPLAIN" /></th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="numberic-1"><Translate id="RECONCILIATION_REVENUE.CATEGORY_SALE_REVENUE" /></td>
                      <td><b>{<RenderText value={reconciliationDetail.successSaleRevenue} type="NUMBER_NO_DOT" />}</b></td>
                      <td><i><Translate id="RECONCILIATION_REVENUE.CATEGORY_SALE_REVENUE_NOTE" /></i></td>
                    </tr>
                    <tr>
                      <td className="numberic-1"><Translate id="RECONCILIATION_REVENUE.CATEGORY_PROMOTION" /></td>
                      <td><b>{<RenderText value={reconciliationDetail.promotionAmount} type="NUMBER_NO_DOT" />}</b></td>
                      <td><i><Translate id="RECONCILIATION_REVENUE.CATEGORY_PROMOTION_NOTE" /></i></td>
                    </tr>
                    <tr>
                      <td className="numberic-1"><Translate id="RECONCILIATION_REVENUE.CATEGORY_REVENUE" /></td>
                      <td><b>{<RenderText value={reconciliationDetail.ePaymentRevenue + reconciliationDetail.cashRevenue} type="NUMBER_NO_DOT" />}</b></td>
                      <td><i><Translate id="RECONCILIATION_REVENUE.CATEGORY_REVENUE_NOTE" /></i> <br /></td>
                    </tr>
                    <tr>
                      <td className="numberic-1-1"><Translate id="RECONCILIATION_REVENUE.CATEGORY_WALLET_REVENUE" /></td>
                      <td>{<RenderText value={reconciliationDetail.ePaymentRevenue} type="NUMBER_NO_DOT" />}</td>
                      <td><i><Translate id="RECONCILIATION_REVENUE.CATEGORY_WALLET_REVENUE_NOTE" /></i></td>
                    </tr>
                    <tr>
                      <td className="numberic-1-1"><Translate id="RECONCILIATION_REVENUE.CATEGORY_CASH_REVENUE" /></td>
                      <td>{<RenderText value={reconciliationDetail.cashRevenue} type="NUMBER_NO_DOT" />}</td>
                      <td><i><Translate id="RECONCILIATION_REVENUE.CATEGORY_CASH_REVENUE_NOTE" /></i></td>
                    </tr>
                    <tr>
                      <td className="numberic-1"><Translate id="RECONCILIATION_REVENUE.CATEGORY_EPAYMENT_FEE" /></td>
                      <td><b>{<RenderText value={reconciliationDetail.ePaymentFee} type="NUMBER" />}</b></td>
                      {/* <td><i><Translate id="RECONCILIATION_REVENUE.CATEGORY_EPAYMENT_FEE_NOTE" /></i></td> */}
                    </tr>

                    <tr>
                      <td className="numberic-1"><Translate id="RECONCILIATION_REVENUE.TOTAL_PAYOUT_CASH" /></td>
                      <td><b>{<RenderText value={reconciliationDetail.totalPayout} type="NUMBER_NO_DOT" />}</b></td>
                      <td><i><Translate id="RECONCILIATION_REVENUE.TOTAL_PAYOUT_NOTE" /></i> <br /></td>
                    </tr>
                    <tr>
                      <td className="numberic-1-1"><Translate id="RECONCILIATION_REVENUE.CASH_REFUND_PAYOUT" /></td>
                      <td>{<RenderText value={reconciliationDetail.cashRefundPayout} type="NUMBER_NO_DOT" />}</td>
                      <td><i><Translate id="RECONCILIATION_REVENUE.CASH_REFUND_PAYOUT_NOTE" /></i></td>
                    </tr>
                    <tr>
                      <td className="numberic-1-1"><Translate id="RECONCILIATION_REVENUE.CASH_PAYOUT" /></td>
                      <td>{<RenderText value={reconciliationDetail.cashPayout} type="NUMBER_NO_DOT" />}</td>
                      <td><i><Translate id="RECONCILIATION_REVENUE.CASH_PAYOUT_NOTE" /></i></td>
                    </tr>
                    {/* <tr>
                      <td className="numberic-1-1"><Translate id="RECONCILIATION_REVENUE.MANUAL_PAYOUT" /></td>
                      <td>{<RenderText value={reconciliationDetail.manualPayout} type="NUMBER_NO_DOT" />}</td>
                      <td><i><Translate id="RECONCILIATION_REVENUE.MANUAL_PAYOUT_NOTE" /></i></td>
                    </tr> */}
                    <tr>
                      <td className="numberic-1-1"><Translate id="RECONCILIATION_REVENUE.UNPROCESS_CASH_PAYOUT" /></td>
                      <td>{<RenderText value={reconciliationDetail.unProcessCashPayout} type="NUMBER_NO_DOT" />}</td>
                      <td><i><Translate id="RECONCILIATION_REVENUE.UNPROCESS_CASH_PAYOUT_NOTE" /></i></td>
                    </tr>
                    <tr>
                      <td className="numberic-1"><Translate id="RECONCILIATION_REVENUE.TOTAL_PAYOUT_EPAYMENT" /></td>
                      <td><b>{<RenderText value={reconciliationDetail.epaymentRefund} type="NUMBER_NO_DOT" />}</b></td>
                      <td><i><Translate id="RECONCILIATION_REVENUE.TOTAL_PAYOUT_EPAYMENT" /></i> <br /></td>
                    </tr>
                    {/* <tr>
                      <td className="numberic-1"><Translate id="RECONCILIATION_REVENUE.CASH_REFUND_FILL" /></td>
                      <td><b>{<RenderText value={reconciliationDetail.cashReturnFill} type="NUMBER_NO_DOT" />}</b></td>
                      <td><i><Translate id="RECONCILIATION_REVENUE.CASH_REFUND_FILL_NOTE" /></i></td>
                    </tr> */}
                    {/* <tr>
                      <td className="numberic-1"><Translate id="RECONCILIATION_REVENUE.CASH_UNKNOWN" /></td>
                      <td><b>{<RenderText value={reconciliationDetail.cashUnknown} type="NUMBER_NO_DOT" />}</b></td>
                      <td><i><Translate id="RECONCILIATION_REVENUE.CASH_UNKNOWN_NOTE" /></i></td>
                    </tr> */}
                    <tr>
                      <td className="numberic-1"><Translate id="RECONCILIATION_REVENUE.CASH_IN_THE_PERIOD" /></td>
                      <td><b>{<RenderText value={reconciliationDetail.cashInThePeriod} type="NUMBER_NO_DOT" />}</b></td>
                      <td><i><Translate id="RECONCILIATION_REVENUE.CASH_IN_THE_PERIOD_NOTE" /></i></td>
                    </tr>
                    <tr>
                      <td className="numberic-1"><Translate id="RECONCILIATION_REVENUE.PARTNER_COLLECT_CASH" /></td>
                      <td><b>{<RenderText value={reconciliationDetail.partnerCollectCash} type="NUMBER_NO_DOT" />}</b></td>
                      <td><i><Translate id="RECONCILIATION_REVENUE.PARTNER_COLLECT_CASH_NOTE" /></i></td>
                    </tr>
                    <tr>
                      <td className="numberic-1"><Translate id="RECONCILIATION_REVENUE.CASH_GIVE_TO_ACCOUNTANT" /></td>
                      <td><b>{<RenderText value={reconciliationDetail.cashRevenue +
                        reconciliationDetail.unProcessCashPayout + reconciliationDetail.cashUnknown
                      } type="NUMBER_NO_DOT" />}</b></td>
                      <td><i><Translate id="RECONCILIATION_REVENUE.CASH_GIVE_TO_ACCOUNTANT_NOTE" /></i></td>
                    </tr>
                  </tbody>
                </table>

                {/* <h4 style={{ marginTop: 20 }}><b>{<Translate id="RECONCILIATION_REVENUE.CATEGORY_PAYMENT" />}</b></h4>
                <table className="table table-hover table-bordered table-striped" id="tableValue">
                  <thead>
                    <tr>
                      <th style={{ width: "30%", textAlign: "center" }}><Translate id="RECONCILIATION_REVENUE.CONTENT" /></th>
                      <th style={{ width: "25%", textAlign: "center" }}><Translate id="RECONCILIATION_REVENUE.VALUE" /></th>
                      <th style={{ width: "45%", textAlign: "center" }}><Translate id="RECONCILIATION_REVENUE.EXPLAIN" /></th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="numberic-1"><Translate id={reconciliationDetail.partnerPayAmount ? "RECONCILIATION_REVENUE.PARTNER_PAYMENT_COMPANY" : "RECONCILIATION_REVENUE.COMPANY_PAYMENT_PARTNER"} /></td>
                      <td><b>{<RenderText value={Math.abs(reconciliationDetail.partnerPayAmount || reconciliationDetail.companyPayAmount)} type="NUMBER_NO_DOT" />}</b></td>
                      <td><i><Translate id="RECONCILIATION_REVENUE.PARTNER_PAYMENT_COMPANY_NOTE" /></i></td>
                    </tr>
                  </tbody>
                </table> */}
              </Form>
            </TabPane>
            {/* <TabPane tab={<strong>{<Translate id="RECONCILIATION_REVENUE.VENDING_LIST" />}</strong>}
              key={tabs.COLLECT_CASH_RELATED}>
              <Card>
                {reconciliationDetail.lstReconciliationRevenueVending &&
                  <Table
                    {...globalProps.table}
                    dataSource={reconciliationDetail.lstReconciliationRevenueVending.map((k, i) => ({ ...k, key: i, index: ++i }))}
                    pagination={false}
                  >
                    <Column {...globalProps.tableRow} title={<Translate id="INDEX" />} dataIndex="index" width={60} />
                    <Column {...globalProps.tableRow} key="vendingCode" title={<Translate id="RECONCILIATION_REVENUE.VENDING_CODE" />} dataIndex="vendingCode" width={60} />
                    <Column {...globalProps.tableRow} key="vendingName" title={<Translate id="RECONCILIATION_REVENUE.VENDING_NAME" />} dataIndex="vendingName" width={60} />
                    <Column {...globalProps.tableRow} key="machineModel" title={<Translate id="RECONCILIATION_REVENUE.MACHINE_MODEL" />} dataIndex="machineModel" width={60} />
                     <Column {...globalProps.tableRow} key="confirmTime" title={<Translate id="RECONCILIATION_REVENUE.MACHINE_MODEL" />} dataIndex="confirmTime" width={60}
                      render={(val) => <RenderText value={val} type="DATETIME" />} /> 
                    <ColumnGroup title={<Translate id="RECONCILIATION_REVENUE.RECONCILIATION_PERIOD" />}>
                      <Column {...globalProps.tableRow}
                        title={<Translate id="RECONCILIATION_REVENUE.FROM" />}
                        dataIndex="fromDate" width={70}
                        render={val => <RenderText value={val} type="DATETIME" />}
                      />
                      <Column {...globalProps.tableRow}
                        title={<Translate id="RECONCILIATION_REVENUE.TO" />}
                        dataIndex="toDate" width={70}
                        render={val => <RenderText value={val} type="DATETIME" />}
                      />
                    </ColumnGroup>
                    <Column align="right" className="column-name-short" key="successSaleRevenue" title={<Translate id="RECONCILIATION_REVENUE.CATEGORY_SALE_REVENUE" />} dataIndex="successSaleRevenue" width={60}
                      render={val => <RenderText value={val} type="NUMBER_NO_DOT" />}
                    />
                    <Column align="right" className="column-name-short" key="promotionAmount" title={<Translate id="RECONCILIATION_REVENUE.CATEGORY_PROMOTION" />} dataIndex="promotionAmount"
                      render={val => <RenderText value={val} type="NUMBER_NO_DOT" />}
                    />
                    <ColumnGroup title={<Translate id="RECONCILIATION_REVENUE.CATEGORY_REVENUE" />}>
                      <Column align="right" className="column-name-short" key="ePaymentRevenue" title={<Translate id="RECONCILIATION_REVENUE.CATEGORY_WALLET_REVENUE" />} dataIndex="ePaymentRevenue"
                        render={val => <RenderText value={val} type="NUMBER_NO_DOT" />}
                      />
                      <Column align="right" className="column-name-short" key="cashRevenue" title={<Translate id="RECONCILIATION_REVENUE.CATEGORY_CASH_REVENUE" />} dataIndex="cashRevenue"
                        render={val => <RenderText value={val} type="NUMBER_NO_DOT" />}
                      />
                    </ColumnGroup>
                    <Column align="right" className="column-name-short" key="ePaymentFee" title={<Translate id="RECONCILIATION_REVENUE.CATEGORY_EPAYMENT_FEE" />} dataIndex="ePaymentFee"
                      render={val => <RenderText value={val} type="NUMBER_NO_DOT" />}
                    />
                    <Column align="right" className="column-name-short" key="topup" title={<Translate id="RECONCILIATION_REVENUE.SERVICE_TOPUP_TRANSACION" />} dataIndex="topup"
                      render={val => <RenderText value={val} type="NUMBER_NO_DOT" />}
                    />
                    <ColumnGroup title={<Translate id="RECONCILIATION_REVENUE.REFUND_PREV_PERIOD" />}>
                      <Column align="right" {...globalProps.tableRow} key="ePaymentRefundPrevPeriod" title={<Translate id="RECONCILIATION_REVENUE.ELECTRONIC" />} dataIndex="ePaymentRefundPrevPeriod"
                        render={val => <RenderText value={val} type="NUMBER_NO_DOT" />}
                      />
                      <Column align="right" {...globalProps.tableRow} key="cashRefundPrevPeriod" title={<Translate id="RECONCILIATION_REVENUE.CASH" />} dataIndex="cashRefundPrevPeriod"
                        render={val => <RenderText value={val} type="NUMBER_NO_DOT" />}
                      />
                    </ColumnGroup>
                    <Column align="right" className="column-name-short" key="cashInThePeriod" title={<Translate id="RECONCILIATION_REVENUE.CASH_IN_THE_PERIOD" />} dataIndex="cashInThePeriod"
                      render={val => <RenderText value={val} type="NUMBER_NO_DOT" />}
                    />
                    {
                      reconciliationDetail.cashLeftOverBy === "PARTNER" ?
                        <React.Fragment>
                          <Column align="right" className="column-short-name" key="unProcessCashLeftOver" title={<Translate id="RECONCILIATION_REVENUE.UNPROCESS_CASH_LEFT_OVER" />} dataIndex="unProcessCashLeftOver"
                            render={val => <RenderText value={val} type="NUMBER_NO_DOT" />}
                          />
                          <Column align="right" className="column-short-name" key="topupFromCashLeftOverPrevPeriod" title={<Translate id="RECONCILIATION_REVENUE.TOPUP_FROM_CASH_LEFT_OVER" />} dataIndex="topupFromCashLeftOverPrevPeriod"
                            render={val => <RenderText value={val} type="NUMBER_NO_DOT" />}
                          />
                        </React.Fragment>
                        : ""
                    }
                    <Column align="right" className="column-name-short" key="debtAmount" title={<Translate id="RECONCILIATION_REVENUE.CLEARING" />} dataIndex="debtAmount"
                      render={val => <RenderText value={val} type="NUMBER_NO_DOT" />}
                    />
                    <Column className="column-name" key="debtNote" title={<Translate id="RECONCILIATION_REVENUE.DEBT_NOTE" />} dataIndex="debtNote" />
                  </Table>
                }
              </Card>
            </TabPane>
            <TabPane tab={<strong>{<Translate id="RECONCILIATION_REVENUE.EPAYMENT_FEE" />}</strong>}
              key={tabs.WALLET_FEE}>
              <Card>
                {reconciliationDetail.lstPaymentMethodDetail &&
                  <Table
                    {...globalProps.table}
                    dataSource={reconciliationDetail.lstPaymentMethodDetail.map((k, i) => ({ ...k, key: i, index: ++i }))}
                    pagination={false}
                    summary={(pageData) => {
                      return (
                        <React.Fragment>
                          <Table.Summary.Row>
                            <Table.Summary.Cell align="right" index={0} colSpan={5}>
                              <Text className="text-right"><Translate id="TOTAL" /></Text>
                            </Table.Summary.Cell>
                            <Table.Summary.Cell index={1}>
                              <Text className="text-right">
                                {
                                  reconciliationDetail.lstPaymentMethodDetail.reduce((prev, cur) => prev + (cur.feeAmount || 0), 0).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                                }
                              </Text>
                            </Table.Summary.Cell>
                          </Table.Summary.Row>
                        </React.Fragment>
                      );
                    }}
                  >
                    <Column {...globalProps.tableRow} title={<Translate id="INDEX" />} dataIndex="index" width={60} />
                    <Column {...globalProps.tableRow} key="paymentMethod" title={<Translate id="RECONCILIATION_REVENUE.PAYMENT_METHOD" />} dataIndex="paymentMethod" width={60} />
                    <Column align="right" {...globalProps.tableRow} key="fee" title={<Translate id="RECONCILIATION_REVENUE.PERCENT_FEE" />} dataIndex="fee" width={60} />
                    <Column align="right" {...globalProps.tableRow} key="totalTransaction" title={<Translate id="RECONCILIATION_REVENUE.TOTAL_TRANSACTION_SUCCESS" />} dataIndex="totalTransaction" width={60} />
                    <Column align="right" {...globalProps.tableRow} key="totalAmount" title={<Translate id="RECONCILIATION_REVENUE.TOTAL_VALUE_TRANSACTION_SUCCESS" />} dataIndex="totalAmount" width={60}
                      render={val => <RenderText value={val} type="NUMBER" />}
                    />
                    <Column align="right" {...globalProps.tableRow} key="feeAmount" title={<Translate id="RECONCILIATION_REVENUE.FEE_AMOUNT" />} dataIndex="feeAmount" width={60}
                      render={val => <RenderText value={val} type="NUMBER" />} />
                  </Table>
                }
              </Card>
            </TabPane> */}
          </Tabs>
        </Card>
        <Modal
          visible={this.state.visibleModalConfirm}
          onOk={this.confirm}
          onCancel={this.hideModalConfirm}
          okText="OK"
          okButtonProps={globalProps.okButton}
          cancelButtonProps={globalProps.cancelButton}
          cancelText="Cancel"
        >
          <p><Translate id="CONFIRM_RECONCILIATION" /></p>
        </Modal>
        <Modal
          visible={this.state.visibleModalCancel}
          onOk={this.cancel}
          onCancel={this.hideModalCancel}
          okText="OK"
          okButtonProps={globalProps.okButton}
          cancelButtonProps={globalProps.cancelButton}
          cancelText="Cancel"
        >
          <p><Translate id="CANCEL_RECONCILIATION" /></p>
        </Modal>
      </React.Fragment >
    )
  }
}

const stateToProps = (state) => {
  return {
    reconciliationId: state.reconciliationRevenue.reconciliationId,
    reconciliationDetail: state.reconciliationRevenue.reconciliationDetail,
    cashSheetDetail: state.reconciliationRevenue.cashSheetDetail,
    listCashSheetDetail: state.reconciliationRevenue.listCashSheetDetail,
    listSheetDetail: state.reconciliationRevenue.listSheetDetail,
    userInfo: state.auth.userInfo,
  };
}

const dispatchToProps = (dispatch) => bindActionCreators({
  detail: reconciliationRevenueActions.detail,
  getCashSheetDetail: reconciliationRevenueActions.getCashSheetDetail,
  changeReconciliationStatus: reconciliationRevenueActions.changeReconciliationStatus,
  exportForm: reconciliationRevenueActions.exportForm,
}, dispatch);

export default connect(stateToProps, dispatchToProps)(withLocalize(ReconciliationRevenueDetail));