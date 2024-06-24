import React, { Component } from "react";
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Translate, withLocalize } from "react-localize-redux";
import { Table, PageHeader, Card, Form, Row, Col, Input, Tabs, Checkbox, Radio, Space } from 'antd';
import { LOCAL_PATH } from "../../constants";
import { history } from '../../store';
import { globalProps, RenderText } from "../../data";
import { promotionActions } from "../../actions";

const { Column } = Table;
const { TextArea } = Input;
const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};
class PromotionDetail extends Component {
  state = {
    tab: "1",
  }

  componentDidMount() {
    let { match: { params: { id } }, detail } = this.props;
    if (id !== "new" && id) {
      detail({ data: { promotionId: id } });
    } else {
      detail({ data: { promotionId: 0 } });
    }

  }

  onChangeTab(val) {
    this.setState((state) => ({ tab: val || state.tab, sort: {} }), () => { })
  }

  render() {
    let { promotionDetail, translate, format } = this.props;
    let { tab } = this.state;

    if (!promotionDetail)
      return null;

    return (
      <React.Fragment>
        <PageHeader
          title={<span><Translate id="PROMOTION.INDEX" /> / <Translate id="DETAIL" /></span>}
          ghost={false}
          onBack={e => history.push(LOCAL_PATH.PROMOTION.INDEX)}
        />

        <Card
          style={globalProps.panel}
          title={<strong><Translate id="GENERAL_INFO" /></strong>}
        >
          <Form {...globalProps.form}>
            <Row {...globalProps.row}>
              <Col {...globalProps.colHalf}>
                <Form.Item {...globalProps.formItem}
                  label={<Translate id="PROMOTION.PROMOTION_CODE" />}
                >
                  <Input disabled value={promotionDetail.code} />
                </Form.Item>
              </Col>
              <Col {...globalProps.colHalf}>
                <Form.Item {...globalProps.formItem}
                  label={<Translate id="PROMOTION.PROMOTION_NAME" />}
                >
                  <Input disabled value={promotionDetail.name} />
                </Form.Item>
              </Col>
            </Row>
            <Row {...globalProps.row}>
              <Col {...globalProps.colHalf}>
                <Form.Item {...globalProps.formItem}
                  label={<Translate id="PROMOTION.PROMOTION_TIME" />}
                >
                  <Input.Group size="medium">
                    <Row gutter={8}>
                      <Col style={{ width: '49%' }}>
                        <Input disabled value={promotionDetail.startDate} />
                      </Col>
                      <Col style={{ width: '2%' }}> - </Col>
                      <Col style={{ width: '49%' }}>
                        <Input disabled value={promotionDetail.endDate} />
                      </Col>
                    </Row>
                  </Input.Group>
                </Form.Item>
              </Col>
              <Col {...globalProps.colHalf}>
                <Form.Item {...globalProps.formItem}
                  label={<Translate id="STATUS" />}
                >
                  <Input disabled value={promotionDetail.status ? translate(`PROMOTION.PROMOTION_STATUS_${(promotionDetail.status)}`) : ""} />
                </Form.Item>
              </Col>
            </Row>
            <Row {...globalProps.row}>
              <Col {...globalProps.colHalf}>
                <Form.Item {...globalProps.formItem}
                  label={<Translate id="PROMOTION.PROMOTION_CATEGORY" />}
                >
                  <Input disabled value={promotionDetail.promotionCategory ? translate(`PROMOTION.${(promotionDetail.promotionCategory)}`) : ""} />
                </Form.Item>
              </Col>
              <Col {...globalProps.colHalf}>
                <Form.Item {...globalProps.formItem}
                  label={<Translate id="PROMOTION.CHANNEL" />}
                >
                  <Input disabled value={promotionDetail.channel ? translate(`PROMOTION.CHANNEL_${(promotionDetail.channel)}`) : ""} />
                </Form.Item>
              </Col>
            </Row>
            {
              promotionDetail.promotionCategory === "PROMOTIONVOUCHER" ?
                <Row {...globalProps.row}>
                  <Col {...globalProps.colHalf}>
                    <Form.Item {...globalProps.formItem}
                      label={<Translate id="PROMOTION.VOUCHER_TYPE" />}
                    >
                      <Input disabled value={promotionDetail.voucherType ? translate(`PROMOTION.VOUCHER_TYPE_${(promotionDetail.voucherType)}`) : ""} />
                    </Form.Item>
                  </Col>
                  <Col {...globalProps.colHalf}>
                    {
                      promotionDetail.voucherType === 1 ?
                        <Form.Item {...globalProps.formItem}
                          label={<Translate id="PROMOTION.VOUCHER_CODE" />}
                        >
                          <Input disabled value={promotionDetail.voucherCode} />
                        </Form.Item>
                        : ""
                    }
                  </Col>
                  {promotionDetail.voucherType === 1 &&
                    <React.Fragment>
                      <Col {...globalProps.colHalf}>
                        <Form.Item {...globalProps.formItem}
                          label={<Translate id="PROMOTION.VOUCHER_QUANTITY" />}
                        >
                          <Input disabled value={promotionDetail.voucherReleaseQuantity} />
                        </Form.Item>
                      </Col>
                      <Col {...globalProps.colHalf}>
                        <Form.Item {...globalProps.formItem}
                          label={<Translate id="PROMOTION.USED_QUANTITY" />}
                        >
                          <Input disabled value={promotionDetail.voucherUsedQuantity} />
                        </Form.Item>
                      </Col>
                    </React.Fragment>
                  }
                </Row> : ""
            }

            {
              promotionDetail.promotionCategory === "SAMPLING" ?
                <Row {...globalProps.row}>
                  <React.Fragment>
                    <Col {...globalProps.colHalf}>
                      {
                        promotionDetail.voucherType === 1 ?
                          <Form.Item {...globalProps.formItem}
                            label={<Translate id="PROMOTION.ACQUIRE_USER_USED_QUANTITY" />}
                          >
                            <Input disabled value={promotionDetail.acquireUserUsedQuantity} />
                          </Form.Item>
                          : ""
                      }
                    </Col>
                    <Col {...globalProps.colHalf}></Col>
                    <Col {...globalProps.colHalf}>
                      <Form.Item {...globalProps.formItem}
                        label="&nbsp;"
                      >
                        <Radio.Group onChange={this.onChange} value={promotionDetail.acquireUserType} disabled>
                          <Space direction="vertical">
                            <Radio value="AllPromotion"><Translate id="PROMOTION.ACQUIRE_USER_ALL_PROMOTION" /></Radio>
                            <Radio value="NumberOfDays">
                              <Translate id="PROMOTION.ACQUIRE_USER_FOR_DAY" />
                              {promotionDetail.acquireUserType === "NumberOfDays" ? <Input disabled style={{ width: 200, marginLeft: 10 }} value={promotionDetail.numberOfDays} /> : null}
                            </Radio>
                          </Space>
                        </Radio.Group>
                      </Form.Item>

                    </Col>
                    <Col {...globalProps.colHalf}></Col>
                    <Col className="mr-top-bottom-5" {...globalProps.col3}>
                      <Checkbox disabled checked={promotionDetail.isHasOTP}><Translate id="PROMOTION.ACQUIRE_USER_HAS_OTP" /></Checkbox>
                    </Col>
                  </React.Fragment>
                </Row>
                : ""
            }

            {
              promotionDetail.promotionCategory === "PROMOTIONNODROP" ?
                <Row {...globalProps.row}>
                  <React.Fragment>
                    <Col {...globalProps.colHalf}>
                      <Form.Item {...globalProps.formItem}
                        label={<Translate id="PROMOTION.GIFT_TYPE" />}
                      >
                        <Input disabled value={promotionDetail.giftType ? translate(`PROMOTION.GIFT_TYPE_${(promotionDetail.giftType)}`) : ""} />
                      </Form.Item>
                    </Col>
                    <Col {...globalProps.colHalf}></Col>
                    {
                      promotionDetail.giftType === "GIFTOUTLAYOUT" ?
                        <React.Fragment>
                          <Col {...globalProps.colHalf}>
                            <Form.Item {...globalProps.formItem}
                              label={<Translate id="PROMOTION.OBJECT_TYPE" />}
                            >
                              <Input disabled value={promotionDetail.voucherType ? translate(`PROMOTION.VOUCHER_TYPE_${(promotionDetail.voucherType)}`) : ""} />
                            </Form.Item>
                          </Col>
                          {
                            promotionDetail.voucherType === 1 ?
                              <React.Fragment>
                                <Col {...globalProps.colHalf}>
                                  <Form.Item {...globalProps.formItem}
                                    label={<Translate id="PROMOTION.OBJECT_CODE" />}
                                  >
                                    <Input disabled value={promotionDetail.voucherCode} />
                                  </Form.Item>
                                </Col>
                                <Col {...globalProps.colHalf}>
                                  <Form.Item {...globalProps.formItem}
                                    label={<Translate id="PROMOTION.OBJECT_QUANTITY" />}
                                  >
                                    <Input disabled value={promotionDetail.voucherReleaseQuantity} />
                                  </Form.Item>
                                </Col>
                                <Col {...globalProps.colHalf}>
                                  <Form.Item {...globalProps.formItem}
                                    label={<Translate id="PROMOTION.DONATED_QUANTITY" />}
                                  >
                                    <Input disabled value={promotionDetail.voucherUsedQuantity} />
                                  </Form.Item>
                                </Col>
                              </React.Fragment>
                              : ""
                          }
                        </React.Fragment>
                        :
                        <Col {...globalProps.colHalf}>
                          <Form.Item {...globalProps.formItem}
                            label={<Translate id="PROMOTION.GAME_RELATED" />}
                          >
                            <Input disabled value={promotionDetail.gamePolicy} />
                          </Form.Item>
                        </Col>
                    }
                  </React.Fragment>
                </Row> : ""
            }
            <Row {...globalProps.row}>
              <Col {...globalProps.colHalf}>
                <Form.Item {...globalProps.formItem}
                  label={<Translate id="NOTE" />}
                >
                  <TextArea
                    disabled
                    value={promotionDetail.note}
                    autoSize={{ minRows: 3, maxRows: 5 }}
                  />
                </Form.Item>
              </Col>
              <Col {...globalProps.colHalf}>
                <Form.Item {...globalProps.formItem}
                  label={<Translate id="CREATED_ON" />}
                >
                  <Input disabled value={promotionDetail.createdOn} />
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Card>

        <div className="card-container">
          <Tabs activeKey={tab}
            style={globalProps.panel}
            type="card"
            onChange={e => this.onChangeTab(e)}
          >
            <Tabs.TabPane
              key="1"
              tab={<strong><Translate id="PRODUCT" /></strong>}
            >

              {
                promotionDetail.promotionCategory === "PROMOTIONVOUCHER" ?
                  <Form layout="horizontal" {...layout}>
                    <Row>
                      <Col {...globalProps.col}>
                        <Form.Item label={<Translate id="PROMOTION.VOUCHER_FORMALITY" />}>
                          <Input style={{ width: 150 }} disabled value={promotionDetail.discountVoucherType ? translate(`PROMOTION.${(promotionDetail.discountVoucherType)}`) : ""} />
                        </Form.Item>
                      </Col>
                      <Col {...globalProps.col}>
                        <Form.Item label={<Translate id="PROMOTION.VOUCHER_VALUE" />}>
                          <Input style={{ width: 150 }} disabled value={(promotionDetail.voucherAmount || 0).toFixed(format || 2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")} />
                        </Form.Item>
                      </Col>
                      <Col {...globalProps.col}>
                        <Form.Item>
                          <Checkbox className="checkbox-Apply" disabled checked={promotionDetail.isApplyAllProduct} >Áp dụng tất cả sản phẩm</Checkbox>
                        </Form.Item>
                      </Col>
                      {
                        promotionDetail.discountVoucherType === "PERCENT" ?
                          <React.Fragment>

                            <Col {...globalProps.col}>
                              <Form.Item label={<Translate id="PROMOTION.TOTAL_APPLY_AMOUNT" />}>
                                <Input style={{ width: 150 }} disabled value={(promotionDetail.totalApplyAmount || 0).toFixed(format || 2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")} />
                              </Form.Item>
                            </Col>
                            <Col {...globalProps.col}>
                              <Form.Item label={<Translate id="PROMOTION.MAX_BUY_QUANTITY" />}>
                                <Input style={{ width: 150 }} disabled value={promotionDetail.maxBuyQuantity} />
                              </Form.Item>
                            </Col>
                          </React.Fragment>
                          : ""
                      }
                    </Row>
                  </Form>
                  :
                  <Row {...globalProps.row}>
                    <Col {...globalProps.col}>
                      <Form.Item {...globalProps.formItem}
                        label={<Translate id="PROMOTION.FORMALITY" />}
                      >
                        <Input style={{ width: 150 }} disabled value={promotionDetail.promotionDiscountType ? translate(`PROMOTION.${(promotionDetail.promotionDiscountType)}`) : ""} />
                      </Form.Item>
                    </Col>
                    <Col {...globalProps.colHalf}>
                      <Checkbox className="checkbox-Apply" disabled checked={promotionDetail.isApplyAllProduct} >Áp dụng tất cả sản phẩm</Checkbox>
                    </Col>
                  </Row>
              }
              {
                promotionDetail.isApplyAllProduct ?
                  ""
                  : <Table
                    {...globalProps.table}
                    dataSource={promotionDetail.productList.map((k, i) => ({ ...k, index: i + 1, key: i }))}
                  >
                    <Column {...globalProps.tableRow} title={<Translate id="INDEX" />} dataIndex="index" width={60} />
                    <Column key="productCode" {...globalProps.tableRow} title={<Translate id="PROMOTION.PRODUCT_CODE" />} dataIndex="productCode" />
                    <Column key="productName" {...globalProps.tableRow} title={<Translate id="PROMOTION.PRODUCT_NAME" />} dataIndex="productName" />
                    <Column key="image" {...globalProps.tableRow}
                      title={<Translate id="IMAGE" />}
                      render={value => <img style={{ maxHeight: 100, maxWidth: 100 }} src={value} alt="" />}
                      dataIndex="image" />
                    <Column key="category" {...globalProps.tableRow} title={<Translate id="CATEGORY" />} dataIndex="category" />
                    <Column key="status" {...globalProps.tableRow} title={<Translate id="PROMOTION.PROMOTION_STATUS" />} render={val => <Translate id={`PROMOTION.PROMOTION_STATUS_${val}`} />} dataIndex="status" />
                    <Column align="right" key="sellingPrice" {...globalProps.tableRow} title={<Translate id="SELLING_PRICE" />} dataIndex="sellingPrice" render={val => <RenderText value={val} type="NUMBER" />} />
                    <Column key="discountValue" {...globalProps.tableRow} title={<Translate id="PROMOTION.VALUE_INCREASE_DECREASE" />} dataIndex="discountValue" />
                    {
                      promotionDetail.promotionCategory === "PROMOTIONDISCOUNT"
                        ? <Column key="adjustPriceValue" {...globalProps.tableRow} title={<Translate id="PROMOTION.ADJUST_PRICE_VALUE" />} dataIndex="adjustPriceValue" />
                        : ""
                    }

                  </Table>
              }
            </Tabs.TabPane>

            {/*  Kiểm tra có danh sách máy */}
            <Tabs.TabPane
              key="2"
              tab={<strong><Translate id="MACHINE" /></strong>}
            >
              <Table
                {...globalProps.table}
                dataSource={promotionDetail.vendingList.map((k, i) => ({ ...k, index: i + 1, key: i }))}
              >
                <Column {...globalProps.tableRow} title={<Translate id="INDEX" />} dataIndex="index" width={60} />
                <Column key="machineModel" {...globalProps.tableRow} title={<Translate id="MACHINE_MODEL" />} dataIndex="machineModel" />
                <Column key="vendingCode" {...globalProps.tableRow} title={<Translate id="MACHINE_CODE" />} dataIndex="vendingCode" />
                <Column key="vendingName" {...globalProps.tableRow} title={<Translate id="MACHINE_NAME" />} dataIndex="vendingName" />
                <Column key="status" {...globalProps.tableRow} title={<Translate id="PROMOTION.PROMOTION_STATUS" />} render={val => <Translate id={`PROMOTION.PROMOTION_STATUS_${val}`} />} dataIndex="status" />
                {/* <Column key="businessStatus" {...globalProps.tableRow} title={<Translate id="MANCHINE_STATUS_BUSINESS" />} render={val => <Translate id={val} />} dataIndex="businessStatus" /> */}
                <Column key="locationAreaMachine" {...globalProps.tableRow} title={<Translate id="LOCATION_AREA" />} dataIndex="locationAreaMachine" />
                <Column key="address" {...globalProps.tableRow} title={<Translate id="ADDRESS" />} dataIndex="address" />
              </Table>
            </Tabs.TabPane>
            {
              promotionDetail.promotionCategory === "PROMOTIONVOUCHER" && promotionDetail.voucherType === 2 ?
                <Tabs.TabPane
                  key="3"
                  tab={<strong><Translate id="PROMOTION.VOUCHER" /></strong>}
                >
                  {
                    promotionDetail.giftVoucherList &&
                    <Table
                      {...globalProps.table}
                      dataSource={promotionDetail.giftVoucherList.map((k, i) => ({ ...k, index: i + 1, key: i }))}
                    >
                      <Column {...globalProps.tableRow} title={<Translate id="INDEX" />} dataIndex="index" width={60} />
                      <Column align="center" key="voucherCode" {...globalProps.tableRow} title={<Translate id="PROMOTION.VOUCHER_CODE" />} dataIndex="voucherCode" />
                      <Column align="center" key="useQuantity" {...globalProps.tableRow} title={<Translate id="PROMOTION.VOUCHER_QUANTITY_USE_QUANTITY" />} render={val => 1} dataIndex="useQuantity" />
                      <Column align="center" key="assignStatus" {...globalProps.tableRow} title={<Translate id="PROMOTION.VOUCHER_STATUS" />} render={val => <Translate id={`PROMOTION.ASSIGN_STATUS_${val}`} />} dataIndex="assignStatus" />
                      <Column align="center" key="voucherProcessingStatus" {...globalProps.tableRow} title={<Translate id="PROMOTION.VOUCHER_USED_STATUS" />} render={val => <Translate id={`PROMOTION.VOUCHER_STATUS_${val}`} />} dataIndex="voucherProcessingStatus" />
                      <Column align="center" key="promoQuantityUsed" {...globalProps.tableRow} title={<Translate id="PROMOTION.VOUCHER_USED_QUANTITY" />} dataIndex="promoQuantityUsed" />
                      <Column align="center" key="maxQuantityUsed" {...globalProps.tableRow} title={<Translate id="PROMOTION.USED_PROMO_QUANTITY" />} dataIndex="maxQuantityUsed" />
                      <Column align="center" key="promoQuantity" {...globalProps.tableRow} title={<Translate id="PROMOTION.PROMO_VOUCHER_QUANTITY" />} dataIndex="promoQuantity" />
                      <Column align="center" key="maxQuantity" {...globalProps.tableRow} title={<Translate id="PROMOTION.PROMO_VOUCHER_MAX_USED_QUANTITY" />} dataIndex="maxQuantity" />
                      <Column align="center" key="voucherStatus" {...globalProps.tableRow} title={<Translate id="PROMOTION.STATUS" />} render={val => <Translate id={`PROMOTION.STATUS_${val}`} />} dataIndex="voucherStatus" />
                    </Table>
                  }
                </Tabs.TabPane>
                : ""
            }
          </Tabs>
        </div>

      </React.Fragment >
    )
  }
}

const stateToProps = (state) => {
  return {
    promotionId: state.promotion.promotionId,
    promotionDetail: state.promotion.promotionDetail,
  };
}

const dispatchToProps = (dispatch) => bindActionCreators({
  detail: promotionActions.detail,
}, dispatch);

export default connect(stateToProps, dispatchToProps)(withLocalize(PromotionDetail));