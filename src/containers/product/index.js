import React, { Component } from "react";
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Translate, withLocalize } from "react-localize-redux";
import { Table, PageHeader, Row, Col, Modal, Button, Form, Input, Card, Space, InputNumber } from 'antd';
import { globalProps, rules, isAllow, PERMISSION } from "../../data";
import { productActions } from "../../actions";
import {
  SearchOutlined,
} from '@ant-design/icons';
const { Column } = Table;


class Product extends Component {
  state = {
    searchBody: {},
    sort: {},
    paginate: {
      pageIndex: 1,
      pageSize: 10,
    },
    exportProduct: { loading: false },
    isShowChangeModal: false,
    itemCash: {},
  }
  formCash = React.createRef();
  form = React.createRef()
  componentDidMount() {
    this.props.init();
    //this.onSearch({});
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
    this.setState({ exportProduct: { loading: true } });
    exportExcel({ data })
      .then(res => {
        this.setState({ exportProduct: { loading: false, url: res.fileUrl } });
        this.downloadFile(res.fileUrl);
      }).catch(e => {
        this.setState({ exportProduct: { loading: false } });
      });
  }

  downloadFile(url) {
    window.open(url);
  }

  showChangeModal(record) {
    this.setState({
      itemCash: {
        ...record,
        partnerPurchasePrice: record.purchasePrice,
        partnerPrice: record.sellingPrice,
        pointsPartner: record.points,
      },
      isShowChangeModal: true,
    });
  }

  handleCancel = () => {
    this.setState({
      isShowChangeModal: false,
    });
  };

  confirm(e) {
    let formCashCurrent = { ...this.formCash.current };
    let item = formCashCurrent.getFieldsValue();
    let { editProduct } = this.props;
    let data = {
      productId: item.id,
      partnerPrice: item.partnerPrice,
      partnerPurchasePrice: item.partnerPurchasePrice,
      partnerPoints: item.pointsPartner,
    };
    this.setState({
      isShowChangeModal: false,
      itemCash: {}
    });
    editProduct(data);
  }

  handleOk = () => {
    let { translate } = this.props;
    let modal = Modal.confirm({
      title: translate("TITLE_NOTIFICATION"),
      centered: true,
      content: 'Bạn có chắc muốn thay đổi thông tin sản phẩm không?',
      okText: translate("CONFIRM"),
      cancelText: translate("CANCEL"),
      onOk: () => {
        this.confirm()
      },
      onCancel: () => {
        modal.destroy();
      },
    });

  };

  render() {
    let { product, paging } = this.props;
    let { paginate, searchBody, exportProduct, isShowChangeModal, itemCash } = this.state;
    return (
      <React.Fragment>
        <PageHeader
          title={<Translate id="PRODUCT_INDEX" />}
          ghost={false}
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
              {/* Mã */}
              <Col {...globalProps.col}>
                <Form.Item {...globalProps.formItem}
                  label={<Translate id="PRODUCT_CODE" />}
                  name="code"
                >
                  <Input />
                </Form.Item>
              </Col>
              {/* Name */}
              <Col {...globalProps.col}>
                <Form.Item {...globalProps.formItem}
                  label={<Translate id="PRODUCT_NAME" />}
                  name="name"
                >
                  <Input />
                </Form.Item>
              </Col>
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
                  loading={exportProduct.loading} onClick={e => this.onExport()}>
                  <Translate id="EXPORT_EXCEL" />
                </Button>
              </Col>
            </Row>
          </Form>
        </Card>

        <div className="card-container">
          <Table
            {...globalProps.table}
            dataSource={product.productList.map((k, i) => ({ ...k, key: i, index: (paginate.pageIndex - 1) * paginate.pageSize + i + 1 }))}
            onChange={this.changePaginate}
            pagination={
              {
                pageSize: paginate.pageSize,
                total: product.total,
                current: paginate.pageIndex,
                showSizeChanger: true,
                pageSizeOptions: paging.pageSizes,
                locale: { items_per_page: "" },
                showTotal: sum => <div>{sum} <Translate id="RESULT" /></div>
              }
            }
          >
            <Column {...globalProps.tableRow} title={<Translate id="INDEX" />} dataIndex="index" width={50} />
            {
              isAllow(PERMISSION.PRODUCT.EDIT_PRICE) &&
              <Column
                {...globalProps.tableRow}
                dataIndex="id"
                render={(val, record) => (
                  <Button
                    style={{ width: '90%' }}
                    size="large"
                    className="custom-btn-primary"
                    type="primary"
                    onClick={() => this.showChangeModal(record)}
                  >
                    <span>
                      <Translate id="PROCESS" />
                    </span>
                  </Button>
                )}
              />}
            <Column key="code" {...globalProps.tableRow} title={<Translate id="PRODUCT_CODE" />} dataIndex="code" />
            <Column key="name" {...globalProps.tableRow} title={<Translate id="PRODUCT_NAME" />} dataIndex="name" />
            <Column key="category" {...globalProps.tableRow} title={<Translate id="PRODUCT_CATEGORY" />} dataIndex="category" />
            <Column key="unit" {...globalProps.tableRow} title={<Translate id="PRODUCT_UNIT" />} dataIndex="unit" />
            <Column align="right" key="purchasePrice" {...globalProps.tableRow} title={<Translate id="PRODUCT_PURCHASE_PRICE" />}
              dataIndex="purchasePrice" render={val => val ? globalProps.inputNumber.formatter(val) : 0} />
            <Column align="right" key="sellingPrice" {...globalProps.tableRow} title={<Translate id="PRODUCT_SELLING_PRICE" />}
              dataIndex="sellingPrice" render={val => val ? globalProps.inputNumber.formatter(val) : 0} />
            <Column key="image" {...globalProps.tableRow}
              title={<Translate id="PRODUCT_IMAGE" />}
              dataIndex="image"
              render={value => <img style={{ maxHeight: 100, maxWidth: 100 }} src={value} alt="" />}
            />
          </Table>
        </div>
        <Modal
          title={
            <strong>
              <Translate id="EDIT_PRODUCT" />
            </strong>
          }
          textAlign="center"
          centered={true}
          visible={isShowChangeModal}
          onCancel={this.handleCancel}
          footer={null}
          maskClosable={false}
          closable
          destroyOnClose
          width={700}
        >
          <Form
            id="editProduct"
            name="editProduct"
            labelAlign="left"
            layout="horizontal"
            scrollToFirstError={true}
            initialValues={itemCash}
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 18 }}
            ref={this.formCash}

            onFinish={e => this.handleOk(e)}
          >
            <Form.Item
              label={<Translate id="" />}
              name="id"
              hidden
            >
              <Input hidden />
            </Form.Item>
            <Form.Item
              label={<Translate id="PRODUCT_CODE" />}
              name="code"
            >
              <Input disabled />
            </Form.Item>
            <Form.Item label={<Translate id="PRODUCT_NAME" />} name="name">
              <Input disabled />
            </Form.Item>
            <Form.Item label={<Translate id="PRODUCT_PURCHASE_PRICE" />} name="purchasePrice">
              <InputNumber
                {...globalProps.inputNumber}
                disabled={true}
                style={{ width: "100%" }}
                addonAfter="VND"
              />
            </Form.Item>
            <Form.Item
              label={<Translate id="PRODUCT_PURCHASE_PRICE_CHANGE" />}
              name="partnerPurchasePrice"
              rules={[rules.required,
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if ((value && value < 1000) || value === 0) {
                    return Promise.reject(
                      new Error(
                        "Giá phải lớn hơn 1,000VNĐ"
                      )
                    );
                  }
                  return Promise.resolve();
                },
              }),
              ]}>
              <InputNumber
                min={1000}
                className="input-number-red"
                {...globalProps.inputNumber}
                style={{ width: "100%" }}
                addonAfter="VND"
                color="red"
              />
            </Form.Item>
            <Form.Item label={<Translate id="PRODUCT_SELLING_PRICE" />} name="sellingPrice">
              <InputNumber
                {...globalProps.inputNumber}
                disabled={true}
                style={{ width: "100%" }}
                addonAfter="VND"
              />
            </Form.Item>
            <Form.Item
              label={<Translate id="PRODUCT_SELLING_PRICE_CHANGE" />}
              name="partnerPrice"
              rules={[rules.required,
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if ((value && value < 1000) || value === 0) {
                    return Promise.reject(
                      new Error(
                        "Giá phải lớn hơn 1,000VNĐ"
                      )
                    );
                  }
                  return Promise.resolve();
                },
              }),
              ]}>
              <InputNumber
                className="input-number-red"
                {...globalProps.inputNumber}
                style={{ width: "100%" }}
                min={1000}
                addonAfter="VND"
              />
            </Form.Item>
            <Form.Item label={<Translate id="PRODUCT_REWARD_POINTS" />} name="points">
              <InputNumber
                {...globalProps.inputNumber}
                disabled={true}
                style={{ width: "100%" }}
                addonAfter="E-POINTS"
              />
            </Form.Item>
            <Form.Item
              label={<Translate id="PRODUCT_REWARD_POINTS_CHANGE" />}
              name="pointsPartner"
              rules={[rules.required,
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if ((value && value < 0)) {
                    return Promise.reject(
                      new Error(
                        "Giá phải lớn hơn 0"
                      )
                    );
                  }
                  return Promise.resolve();
                },
              }),
              ]}>
              <InputNumber
                className="input-number-red"
                {...globalProps.inputNumber}
                style={{ width: "100%" }}
                min={0}
                addonAfter="E-POINTS"
              />
            </Form.Item>
            <div style={{ textAlign: "center" }}>
              <Space size="small" className="main-btn-topup">
                <Button type="primary"
                  htmlType="submit"
                  className="custom-btn-primary">
                  <Translate id="CONFIRM" />
                </Button>
                <Button onClick={this.handleCancel}>
                  <Translate id="CLOSE" />
                </Button>
              </Space>
            </div>
          </Form>
        </Modal>

      </React.Fragment >
    )
  }
}

const stateToProps = (state) => {
  return {
    paging: state.product.paging,
    product: state.product.product,
  };
}

const dispatchToProps = (dispatch) => bindActionCreators({
  init: productActions.init,
  search: productActions.search,
  exportExcel: productActions.exportExcel,
  editProduct: productActions.editProduct,
}, dispatch);

export default connect(stateToProps, dispatchToProps)(withLocalize(Product));