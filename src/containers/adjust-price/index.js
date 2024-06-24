import React, { Component } from "react";
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Translate } from "react-localize-redux";
import { Modal, Table, PageHeader, Row, Col, Button, Form, Select, Card, Image, Radio } from 'antd';

import { globalProps, isAllow, PERMISSION, RenderText } from "../../data";
import { adjustPriceActions } from "../../actions";

import {

  SearchOutlined,
} from '@ant-design/icons';
const { Column } = Table;
const { Option } = Select;

// const lsTmp = [
//   {
//     pSelect: false,
//     price: "12000"
//   },
//   {
//     pSelect: false,
//     price: "13000"
//   },
//   {
//     pSelect: false,
//     price: "14000"
//   },
// ]

class AdjustPrice extends Component {
  state = {
    showAdvance: false,
    timeFromReadonly: false,
    timeToReadonly: false,
    searchBody: {},
    paginate: {
      pageIndex: 1,
      pageSize: 10,
    },
    exportReport: { loading: false },
    sort: {},
    btnSelect: false,
    reconciliationRevenueItem: {},
    lstProduct: []
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
    this.onSearch();
  }

  static getDerivedStateFromProps(props, state) {
    if (props.lstProduct) {
      return {
        lstProduct: props.lstProduct
      }
    }
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

  onGetSearchBody() {
    let body = { ...this.form.current.getFieldsValue() };

    return body;
  }

  downloadFile(url) {
    window.open(url);
  }

  showModal() {
    this.setState({
      visibleModal: true,
    });
  };

  hideModal = () => {
    this.setState({
      visibleModal: false,
    });
  };

  selectedPrice(itemProduct, price) {
    let lstProductUpdate = this.state.lstProduct;
    lstProductUpdate.forEach(item => {
      if (itemProduct.id === item.id) {
        item.selectedPrice = price;
      }
    });

    this.setState({
      lstProduct: lstProductUpdate,
    });
  }

  confirm = () => {
    let { confirmAdjustPrice } = this.props;
    let lstData = [];
    this.state.lstProduct.filter(item => { return item.selectedPrice; }).map(item => {
      let data = {
        PromotionProductId: item.promotionProductId,
        AmountDiscount: Number(item.selectedPrice) - item.defaultPrice
      }

      lstData.push(data);
      return item;
    });

    confirmAdjustPrice({ data: { listAdjustPriceConfirm: lstData } });

    this.setState({
      visibleModal: false,
    });

    this.onSearch();
  };

  render() {
    let { machines, productIds } = this.props;
    let { searchBody, lstProduct } = this.state;
    return (
      <React.Fragment>
        <PageHeader
          title={<Translate id="ADJUST_PRICE_PRODUCT" />}
          ghost={false}
        />
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
            onFinish={e => this.onSearch()}
            {...globalProps.form}
            ref={this.form}
          >
            <Row {...globalProps.row}>
              {/* <Col {...globalProps.col}>
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
              <Col {...globalProps.col}>
                <Form.Item {...globalProps.formItem}
                    label={<Translate id="LOCATION_AREA" />}
                    name="locationAreaMachineIds"
                >
                  <Select {...globalProps.selectSearch} allowClear mode="multiple">
                    {locationAreaMachines.map((k, i) =>
                      <Option value={k.id} key={i}>{`${k.code} - ${k.name}`}</Option>
                    )}
                  </Select>
                </Form.Item>
              </Col> */}
              <Col {...globalProps.col}>
                <Form.Item {...globalProps.formItem}
                  label={<Translate id="MACHINE" />}
                  name="machineIds"
                >
                  <Select {...globalProps.selectSearch} allowClear>
                    {machines.map((k, i) =>
                      <Option value={k.id} key={i}>{`${k.code} - ${k.name}`}</Option>
                    )}
                  </Select>
                </Form.Item>
              </Col>
              <Col {...globalProps.col}>
                <Form.Item {...globalProps.formItem}
                  label={<Translate id="MANCHINE_PRODUCT" />}
                  name="productIds"
                >
                  <Select {...globalProps.selectSearch} allowClear mode="multiple">
                    {productIds.map((k, i) =>
                      <Option value={k.id} key={i}>{`${k.name}`}</Option>
                    )}
                  </Select>
                </Form.Item>
              </Col>
            </Row>
            {/* {showAdvance ?
              <Row {...globalProps.row}>
                <Col {...globalProps.col}>
                  <Form.Item {...globalProps.formItem}
                    label={<Translate id="ADDRESS_TYPE" />}
                    name="addressTypes"
                  >
                    <Select {...globalProps.selectSearch} allowClear mode="multiple">
                      {addressTypes.map((k, i) =>
                        <Option value={k.code} key={i}>{`${k.name}`}</Option>
                      )}
                    </Select>
                  </Form.Item>
                </Col>
                <Col {...globalProps.col}>
                <Form.Item {...globalProps.formItem}
                  label={<Translate id="MACHINE_MODEL" />}
                  name="machineModelIds"
                >
                  <Select {...globalProps.selectSearch} allowClear mode="multiple">
                    {machineModels.map((k, i) =>
                      <Option value={k.id} key={i}>{`${k.name}`}</Option>
                    )}
                  </Select>
                </Form.Item>
              </Col>
                <Col {...globalProps.col}>
                  <Form.Item {...globalProps.formItem}
                    label={<Translate id="MANCHINE_PRODUCT" />}
                    name="productIds"
                  >
                    <Select {...globalProps.selectSearch} allowClear mode="multiple">
                      {productIds.map((k, i) =>
                        <Option value={k.code} key={i}>{`${k.name}`}</Option>
                      )}
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
             :""} */}
            {isAllow(PERMISSION.ADJUST_PRICE.LIST) &&
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
                    onClick={() => this.onReset()}
                  >
                    <span>
                      <Translate id="RESET" />
                    </span>
                  </Button>
                  {
                    isAllow(PERMISSION.ADJUST_PRICE.CONFIRM) && lstProduct.length > 0 &&
                    <Button
                      className="custom-btn-primary"
                      type="primary"
                      size="large"
                      onClick={() => this.showModal()}
                    >
                      <span>
                        <Translate id="CONFIRM" />
                      </span>
                    </Button>
                  }
                </Col>
              </Row>
            }
          </Form>
        </Card>
        <div className="card-container">
          {isAllow(PERMISSION.RECONCILIATION_REVENUE.LIST) &&
            <Row {...globalProps.row}>
              <Col {...globalProps.col3}>
                <Card justify="space-around" align="middle" style={{ marginTop: 10 }}>
                  <Row {...globalProps.row}>
                    <Col {...globalProps.col}> <span> <Translate id="PRODUCT" /></span></Col>
                    <Col {...globalProps.col}> <span>  <Translate id="SELLING_PRICE" /></span></Col>
                    <Col {...globalProps.col}> <span>  <Translate id="ADJUSTMENT_PRICE" /></span></Col>
                  </Row>
                  {
                    lstProduct.filter(item => { return item.adjustPriceValue }).map((itemProduct, index) => {
                      return (
                        <Row justify="space-around" key={index} align="middle" {...globalProps.row} className="custom-border">
                          <Col className="custom-card-img" {...globalProps.col}>
                            <Image
                              className="custom-image-product"
                              preview={{ visible: false }}
                              src={itemProduct.image.replace("~", process.env.API_VENDING_URL)}
                            />
                            <span>{itemProduct.fullName}</span>
                          </Col>
                          <Col {...globalProps.col}>
                            <span>{<RenderText value={parseInt(itemProduct.sellingPrice, 10)} type="NUMBER_NO_DOT" />}</span>
                          </Col>
                          <Col {...globalProps.col}>
                            {
                              itemProduct.adjustPriceValue ?
                                <Radio.Group defaultValue="0" buttonStyle="solid">
                                  {
                                    itemProduct.adjustPriceValue.split(';').filter(item => { return item !== itemProduct.sellingPrice }).map((item, index) => {
                                      return (
                                        <Radio.Button value={item} key={item} onClick={() => this.selectedPrice(itemProduct, item)}>{<RenderText value={parseInt(item, 10)} type="NUMBER_NO_DOT" />}</Radio.Button>
                                      )
                                    })
                                  }
                                </Radio.Group>
                                : ""
                            }
                          </Col>
                        </Row>
                      )
                    })
                  }
                </Card>
              </Col>
            </Row>
          }
        </div>
        <Modal
          visible={this.state.visibleModal}
          onOk={this.confirm}
          onCancel={this.hideModal}
          okText="OK"
          okButtonProps={globalProps.okButton}
          cancelButtonProps={globalProps.cancelButton}
          cancelText="Cancel"
        >
          <p><Translate id="CONFIRM_ADJUST_PRICE_PRODUCT" /></p>
          <Table
            {...globalProps.table}
            dataSource={lstProduct.filter((value, index) => { return value.selectedPrice }).map((k, i) => ({ ...k, index: i + 1, key: i }))}
            pagination={false}
          >
            <Column {...globalProps.tableRow} key="index" title={<Translate id="INDEX" />} dataIndex="index" width={60} />
            <Column {...globalProps.tableRow} key="name" title={<Translate id="PRODUCT" />} dataIndex="name" />
            <Column {...globalProps.tableRow} key="sellingPrice" title={<Translate id="SELLING_PRICE" />} dataIndex="sellingPrice" />
            <Column {...globalProps.tableRow} key="selectedPrice" title={<Translate id="ADJUSTMENT_PRICE" />} dataIndex="selectedPrice" />
          </Table>
        </Modal>
      </React.Fragment >
    )
  }
}

const stateToProps = (state) => {
  return {
    locations: state.adjustPrice.locations,
    locationAreaMachines: state.adjustPrice.locationAreaMachines,
    machines: state.adjustPrice.machines,
    addressTypes: state.adjustPrice.addressTypes,
    machineModels: state.adjustPrice.machineModels,
    productIds: state.adjustPrice.productIds,
    lstProduct: state.adjustPrice.lstProduct,
    paging: state.adjustPrice.paging,
  };
}

const dispatchToProps = (dispatch) => bindActionCreators({
  init: adjustPriceActions.init,
  search: adjustPriceActions.search,
  confirmAdjustPrice: adjustPriceActions.confirmAdjustPrice
}, dispatch);

export default connect(stateToProps, dispatchToProps)(AdjustPrice);