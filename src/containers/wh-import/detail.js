import React, { Component, Fragment } from "react";
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Translate, withLocalize } from "react-localize-redux";
import { Table, PageHeader, Card, Form, Row, Col, Input, Descriptions, Select, Upload, Button, Modal, Image } from 'antd';
import { UploadOutlined, SaveOutlined } from '@ant-design/icons';
import { LOCAL_PATH } from "../../constants";
import { history } from '../../store';
import { globalProps, PERMISSION, isAllow, rules, format } from "../../data";
import { whImportActions } from "../../actions";
import moment from 'moment';
const { Column } = Table;
const { Option } = Select;
class ImportDetail extends Component {
  state = {
    showModalImportProduct: false,
    fileList: [],
    paginate: {
      pageIndex: 1,
      pageSize: 100,
    },
  }
  form = React.createRef()
  componentDidMount() {
    let { match: { params: { id } }, detail } = this.props;
    if (id !== "new" && id) {
      detail({ data: { importId: id } });
    } else {
      detail({ data: { importId: 0 } });
    }

    this.setState({
      fileList: []
    });
  }

  componentDidUpdate(prevProps) {
    let { match: { params: { id: prevId } } } = prevProps;
    let { importExcelResult, totalError, products, match: { params: { id } }, detail } = this.props;
    if (id !== prevId) {
      detail({ data: { importId: id } });
    }
    if (importExcelResult !== undefined && importExcelResult !== prevProps.importExcelResult) {
      if (totalError !== undefined && totalError > 0) {
        this.setState({
          showModalImportProduct: true,
          fileList: []
        });
      } else if (totalError === 0) {
        this.setState({
          fileList: [...importExcelResult],
        });
      }
    }
    if (products !== undefined && products !== prevProps.products) {
      this.setState({
        fileList: [...products],
      });

    }
  }

  onImport(data) {
    let {
      match: {
        params: { id }
      }
    } = this.props;
    let { file } = data;
    let formData = new FormData();
    formData.append("file", file);
    this.props.importExcel(formData, id);
    this.setState({
      fileList: []
    });
  }

  onSave(e) {
    let { fileList } = this.state;
    let { totalAmount, importInfo } = this.props;
    let body = {
      ...e,
      id: importInfo.id || 0,
      productList: [...fileList],
      totalAmount
    }
    if (importInfo.id) {
      this.props.confirm(body);
    } else {
      this.props.save(body);
    }

  }
  render() {
    let { showModalImportProduct, fileList, paginate: { pageSize, pageIndex } } = this.state;
    let { importInfo, warehouse, importTypes, machines, importStatus, importExcelResult, totalError, totalAmount } = this.props;
    return (
      <React.Fragment>
        <PageHeader
          title={<span><Translate id="WAREHOUSE_IMPORT_HEADER" /> / <Translate id="DETAIL" /></span>}
          ghost={false}
          onBack={e => history.push(LOCAL_PATH.WAREHOUSE.IMPORT.INDEX)}
        />
        <Form
          {...globalProps.form}
          initialValues={importInfo}
          key={importInfo.id}
          onFinish={e => this.onSave(e)}
          ref={this.form}
        >
          <Card
            style={globalProps.panel}
            title={<strong><Translate id="GENERAL_INFO" /></strong>}
            extra={
              isAllow(PERMISSION.WAREHOUSE_IMPORT.EDIT) &&
              <Row  >
                <Col {...globalProps.col3}>
                  <Button
                    type="primary"
                    className="custom-btn-primary"
                    htmlType="submit"
                    hidden={fileList.length === 0 || importInfo.id}
                  >
                    <span>
                      <Translate id="SAVE" />
                    </span>
                    <SaveOutlined />
                  </Button>
                </Col>
                {importInfo && importInfo.importType === "IMPORT_FROM_MACHINE" &&
                  <Col {...globalProps.col3}>
                    <Button
                      type="primary"
                      className="custom-btn-primary"
                      htmlType="submit"
                      hidden={!importInfo.id || importInfo.status === "DONE"}
                    >
                      <span>
                        <Translate id="CONFIRM" />
                      </span>
                      <SaveOutlined />
                    </Button>
                  </Col>}
              </Row>
            }
          >
            <Row {...globalProps.row}>
              <Col {...globalProps.colHalf}>
                <Form.Item {...globalProps.formItem}
                  label={<Translate id="WH_IMPORT_CODE" />}
                  name="code"
                >
                  <Input disabled />
                </Form.Item>
              </Col>
              <Col {...globalProps.colHalf}>
                <Form.Item {...globalProps.formItem}
                  label={<Translate id="IMPORT_TYPE" />}
                  name="importType"

                >
                  <Select style={{ width: "100%" }} disabled>
                    {importTypes.map((k, i) =>
                      <Option key={i} value={k.code}>{k.name}</Option>
                    )}

                  </Select>
                </Form.Item>
              </Col>
              <Col {...globalProps.colHalf}>
                <Form.Item {...globalProps.formItem}
                  label={<Translate id="STATUS" />}
                  name="status"
                >
                  <Select disabled>
                    {importStatus.map((k, i) =>
                      <Option key={i} value={k.code}>{k.name}</Option>
                    )}
                  </Select>
                </Form.Item>
              </Col>
              {(importInfo && importInfo.importType && importInfo.importType === "IMPORT_PURCHASE") ?
                <Col {...globalProps.colHalf}>
                  <Form.Item {...globalProps.formItem}
                    label={<Translate id="WH_IMPORT_IMPORT_CODE" />}
                    name="warehouseImport"
                    rules={[rules.required]}
                  >
                    <Select disabled={importInfo.id} {...globalProps.selectSearch}>
                      {warehouse.map((k, i) =>
                        <Option key={i} value={k.code}>{k.name}</Option>
                      )}
                    </Select>
                  </Form.Item>
                </Col>
                :
                <Fragment>
                  <Col {...globalProps.colHalf}>
                    <Form.Item {...globalProps.formItem}
                      label={<Translate id="WH_EXPORT_EXPORT_CODE" />}
                      name="warehouseExport"
                    >
                      <Select disabled>
                        {machines.map((k, i) =>
                          <Option key={i} value={k.code}>{k.name}</Option>
                        )}
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col {...globalProps.colHalf}>
                    <Form.Item {...globalProps.formItem}
                      label={<Translate id="WH_IMPORT_IMPORT_TO_MACHINE_CODE" />}
                      name="warehouseImport"
                    >
                      <Select disabled>
                        {machines.map((k, i) =>
                          <Option key={i} value={k.code}>{k.name}</Option>
                        )}
                      </Select>
                    </Form.Item>
                  </Col></Fragment>}
              <Col {...globalProps.colHalf}>
                <Form.Item {...globalProps.formItem}
                  label={<Translate id="DATE_CREATED" />}
                  name="createDate"
                >
                  <Input disabled />
                </Form.Item>
              </Col>
              <Col {...globalProps.colHalf}>
                <Form.Item {...globalProps.formItem}
                  label={<Translate id="WH_IMPORT_USER_IMPORT" />}
                  name="userImport"
                >
                  <Input disabled />
                </Form.Item>
              </Col>
            </Row>

          </Card>
        </Form>
        <div className="card-container">
          {
            <div className="btn-wrapper" style={{ textAlign: "right", paddingRight: 20, marginBottom: 10, display: "flex" }}>
              <Upload
                showUploadList={false} accept=".xlsx"
                beforeUpload={() => false}
                onChange={e => this.onImport(e)}
                maxCount={1}
              >
                <Button
                  type="primary"
                  className="custom-btn-large custom-btn-wide"
                  disabled={importInfo.id}
                >
                  <span>
                    <Translate id="IMPORT_EXCEL" />
                  </span>
                  <UploadOutlined />
                </Button>
              </Upload>
              <Descriptions >
                <Descriptions.Item span={1}></Descriptions.Item>

                <Descriptions.Item span={1} style={{ paddingBottom: 0 }}  >
                  <strong style={{ display: "flex", alignItems: "center" }} ><Translate id="WH_IMPORT_DETAIL_TOTAL_AMOUNT" />
                    &nbsp; &nbsp;
                    {importInfo.id ?
                      <p style={{ color: "red", fontSize: 18 }} >{globalProps.inputNumber.formatter(importInfo.totalAmount)} VND </p>
                      :
                      <p style={{ color: "red", fontSize: 18 }} >{globalProps.inputNumber.formatter(totalAmount)} VND </p>}

                  </strong>
                </Descriptions.Item>
              </Descriptions>
            </div>
          }
          <Table
            {...globalProps.table}
            pagination={{
              pageSize: pageSize,
              // total: total || 0,
              current: Number(pageIndex),
              showSizeChanger: true,
              showTotal: sum => <div>{sum} <Translate id="ITEM" /></div>
            }}
            dataSource={fileList.map((k, i) => ({ ...k, index: i + 1, key: i }))}
          >
            <Column {...globalProps.tableRow} title={<Translate id="INDEX" />} dataIndex="index" width={60} />
            <Column {...globalProps.tableRow} title={<Translate id="WH_IMPORT_PRODUCT" />} dataIndex="product" />
            <Column {...globalProps.tableRow} align='center' title={<Translate id="WH_IMPORT_IMAGE" />}
              render={value => <img style={{ maxHeight: 100, maxWidth: 100 }} src={value} alt="" />}
              dataIndex="image" />
            <Column {...globalProps.tableRow} title={<Translate id="WH_IMPORT_UNIT" />} dataIndex="unit" />
            <Column {...globalProps.tableRow} sorter={(a, b) => a.qtyImport - b.qtyImport} title={<Translate id="WH_IMPORT_QTY_IMPORT" />}
              render={val => val ? globalProps.inputNumber.formatter(val) : 0}
              align="right"
              dataIndex="qtyImport" />
            <Column {...globalProps.tableRow} sorter={(a, b) => a.supplierPrice - b.supplierPrice} title={<Translate id="WH_IMPORT_SUPPLIER_PRICE" />}
              render={val => val ? globalProps.inputNumber.formatter(val) : 0}
              align="right"
              dataIndex="supplierPrice" />
            <Column {...globalProps.tableRow} sorter={(a, b) => a.amount - b.amount} title={<Translate id="WH_IMPORT_AMOUNT" />}
              render={val => val ? globalProps.inputNumber.formatter(val) : 0}
              align="right"
              dataIndex="amount" />
            <Column {...globalProps.tableRow} sorter={(a, b) => a.amount - b.amount} title={<Translate id="SELLING_PRICE" />}
              render={val => val ? globalProps.inputNumber.formatter(val) : 0}
              align="right"
              dataIndex="sellingPrice" />
            <Column  {...globalProps.tableRow} sorter={(a, b) => a.expriceDate.localeCompare(b.expriceDate)} title={<Translate id="WH_IMPORT_EXPRICE_DATE" />} dataIndex="expireDate"
              render={(val) => val ? moment(val).format(format.date) : ""} />
          </Table>
        </div>

        <Modal
          {...globalProps.modal}
          visible={showModalImportProduct}
          closeIcon={<div />}
          cancelText={<Translate id="CANCEL" />}
          width={1200}
          closable
          onCancel={() => {
            this.setState({
              showModalImportProduct: false,
              fileList: [],

            });
          }}
          okButtonProps={{ hidden: true }}
        >
          {
            importExcelResult &&
            importExcelResult.length > 0 &&
            (
              <Row {...globalProps.row} style={{ marginTop: 20 }}>
                <Col {...globalProps.colHalf}>
                  <span><Translate id="TOTAL_IMPORT_SUCCESS" /></span>
                  <Input disabled value={importExcelResult.length - totalError} />
                </Col>
                <Col {...globalProps.colHalf}>
                  <span><Translate id="TOTAL_IMPORT_FAIL" /></span>
                  <Input disabled value={totalError} />
                </Col>
                {

                  <Col {...globalProps.col3} style={{ marginTop: 20 }}>
                    <strong style={{ color: "red" }}><Translate id="IMPORT_FAIL" /></strong>
                    <Table
                      {...globalProps.table}
                      dataSource={importExcelResult.map((e, i) => {
                        return {
                          ...e,
                          index: i + 1,
                        }
                      })}
                    >
                      <Column
                        title={<Translate id="INDEX" />}
                        dataIndex="index"
                      />
                      <Column
                        title={<Translate id="CODE" />}
                        dataIndex="product"
                      />
                      <Column
                        title={<Translate id="WH_IMPORT_IMAGE" />}
                        dataIndex="image"
                        render={(val) =>
                          val ?
                            <Image src={val} width={100} height={100} />
                            : ""
                        }
                      />
                      <Column
                        title={<Translate id="WH_IMPORT_QTY_IMPORT" />}
                        dataIndex="qtyImport"
                        render={(val, record) =>
                          val ?
                            globalProps.inputNumber.formatter(val)
                            : 0
                        }
                      />
                      <Column
                        title={"Giá 1 sản phẩm / đơn vị tính"}
                        dataIndex="priceOfProduct"
                        render={(val, record) =>
                          val ?
                            globalProps.inputNumber.formatter(val)
                            : 0
                        }
                      />

                      <Column
                        title={"Giá NCC"}
                        dataIndex="supplierPrice"
                        render={(val, record) =>
                          val ?
                            globalProps.inputNumber.formatter(val)
                            : 0
                        }
                      />
                      <Column
                        title={<Translate id="PRODUCT_UNIT" />}
                        dataIndex="unit"
                      />
                      <Column
                        title={<Translate id="BILL_EXPIREDDATE" />}
                        dataIndex="expireDate"
                        render={(val) => val ? moment(val).format(format.date) : ""}
                      />
                      <Column
                        title={"Lỗi"}
                        dataIndex="error"
                        render={(val) => {
                          return <span style={{ color: "red" }}>
                            {val}
                          </span>
                        }}
                      />
                    </Table>
                  </Col>
                }
              </Row>
            )
          }
        </Modal>
      </React.Fragment >
    )
  }
}

const stateToProps = (state) => {
  return {
    products: state.whImport.products,
    importId: state.whImport.importId,
    importInfo: state.whImport.importInfo,
    importTypes: state.whImport.importTypes,
    machines: state.whImport.machines,
    importStatus: state.whImport.importStatus,
    warehouse: state.whImport.warehouse,
    importExcelResult: state.whImport.importExcelResult,
    totalError: state.whImport.totalError,
    totalAmount: state.whImport.totalAmount,
  };
}

const dispatchToProps = (dispatch) => bindActionCreators({
  detail: whImportActions.detail,
  importExcel: whImportActions.importExcel,
  save: whImportActions.save,
  confirm: whImportActions.confirm,
}, dispatch);

export default connect(stateToProps, dispatchToProps)(withLocalize(ImportDetail));