import React, { Component, Fragment } from "react";
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Translate, withLocalize } from "react-localize-redux";
import { Table, PageHeader, Card, Form, Row, Col, Input, Descriptions, Select, Button, InputNumber, Space, Modal, Typography } from 'antd';
import { LOCAL_PATH } from "../../constants";
import { history } from '../../store';
import { globalProps, PERMISSION, isAllow, rules } from "../../data";
import { whExportActions, showErrorMessage } from "../../actions";
import { SaveOutlined, PlusCircleOutlined } from '@ant-design/icons';
import TextArea from "antd/lib/input/TextArea";
// import moment from 'moment';
const { Text } = Typography;
const { Column } = Table;
const { Option } = Select;
class ExportDetail extends Component {
  state = {
    productList: [],
    selected: [],
    loading: false,
    totalAmountState: 0,
    exportExcelFile: { loading: false },
    paginate: {
      pageIndex: 1,
      pageSize: 100,
    },
    exportTypeState: "EXPORT_TO_MACHINE"
  }
  form = React.createRef()
  formTable = React.createRef()
  componentDidMount() {
    let { match: { params: { id } }, detail } = this.props;
    if (id !== "new" && id) {
      detail({ data: { exportId: id } });
    } else {
      detail({ data: { exportId: 0 } });
    }

    this.setState({
      fileList: []
    });
  }

  componentDidUpdate(prevProps) {
    let { match: { params: { id: prevId } } } = prevProps;
    let { products, match: { params: { id } }, detail } = this.props;
    if (id !== prevId) {
      detail({ data: { exportId: id } });
    }
    if (products !== prevProps.products) {
      let list = products.map((k, i) => {
        k = {
          ...k,
          key: i,
          index: i + 1,
        };
        return k;
      });
      this.updateList([...list]);
      // let listAmount = list.map(a => a.amount);
      // if (listAmount && listAmount.length > 0) {
      //   let sum = listAmount.reduce((partialSum, a) => partialSum + a, 0) || 0;
      //   this.setState({ totalAmountState: sum })
      // }
    }
  }

  updateList(list) {
    let listAmount = list.map(a => a.amount);
    if (listAmount && listAmount.length > 0) {
      let sum = listAmount.reduce((partialSum, a) => partialSum + a, 0) || 0;
      this.setState({ totalAmountState: sum })
    }
    this.setState(
      {
        productList: list,
      },
      () => {
        let { productList } = this.state;
        let form = this.formTable.current;
        if (form) {
          form.setFieldsValue({ productList });
        }
      }
    );
  }

  onSelect(e) {
    this.setState({
      selected: e,
    });
  }

  onDelete() {
    let { selected, productList } = this.state;
    if (selected && selected.length) {
      let temp = [...productList];
      let tempNew = temp.filter((k, i) => !selected.includes(i));
      let list = tempNew.map((k, i) => ({
        ...k,
        key: i,
        index: i + 1,
      }));
      let form = this.formTable.current;
      if (form) {
        form.setFieldsValue({ productList: list });
      }
      this.setState(
        {
          selected: [],
          productList: list,
        },
      );
      let listAmount = list.map(a => a.amount);
      if (listAmount && listAmount.length > 0) {
        let sum = listAmount.reduce((partialSum, a) => partialSum + a, 0) || 0;
        this.setState({ totalAmountState: sum })
      } else {
        this.setState({ totalAmountState: 0 })
      }
    }
  }

  onResetProduct() {
    this.setState(
      {
        selected: [],
        productList: [],
        totalAmountState: 0
      },
    );
  }

  onRowChange(index, key, value) {
    let { productList } = this.state;
    let item = productList[index];
    if (key === "quantityExport" && item) {
      let temp = [...productList];
      item[key] = value;
      item["amount"] = value * item["supplierPriceExchange"]
      temp.splice(index, 1, item);
      this.updateList([...temp]);
    }
    else if (item) {
      let temp = [...productList];
      item[key] = value;
      temp.splice(index, 1, item);
      this.updateList([...temp]);
    }
  }

  onSave(e) {
    let { productList, totalAmountState } = this.state;
    let { exportInfo } = this.props;
    if (exportInfo.id) {
      let body = {
        ...e,
        id: exportInfo.id,
        productList: productList.filter(p => p.quantityExport > 0),
        inventoryList: [],
        totalAmountBeforeVAT: totalAmountState
      }
      this.props.confirm(body);
    } else {
      let isCheck = false;
      if (e.exportType === "EXPORT_TO_MACHINE") {
        productList.map(item =>
          productList.map(item2 => {
            if (item.productCode === item2.productCode && item.key !== item2.key) {
              let temp = item.quantityExport + item2.quantityExport
              if (temp > item.quantityNeedExport) {
                isCheck = true;
              }
            }
            if (item.productCode === item2.productCode && item.key !== item2.key) {
              let temp = item.quantityExport + item2.quantityExport
              if (temp > item.q) {
                isCheck = true;
              }
            }
            return item2;
          })
        )
      }

      if (isCheck) {
        let modal = Modal.warning({
          title: "Thông báo",
          centered: true,
          content: (
            <div>
              <label>
                Số lượng xuất của sản phẩm vượt quá số lượng tối đa!!!
              </label>
            </div>
          ),
          cancelText: "Tắt",
          onCancel: () => {
            modal.destroy();
          },
        });
      } else {
        let body = {
          ...e,
          productList: productList.filter(p => p.quantityExport > 0),
          inventoryList: productList.filter(p => p.quantityExport > 0).map(a => a.inventoryId) || [],
          totalAmountBeforeVAT: totalAmountState
        }
        let formTable = { ...this.formTable.current };
        formTable.validateFields().then(e => {
          this.props.save(body);
        }).catch(errorInfo => { console.log(errorInfo); })

      }
    }
  }

  getProductByLayout(e) {
    let form = this.form.current;
    let warehouseExport;
    let warehouseImport;
    if (form) {
      warehouseExport = form.getFieldValue("warehouseExport");
      warehouseImport = form.getFieldValue("warehouseImport");
      if (warehouseExport && warehouseImport) {
        let body = {
          warehouseExport,
          warehouseImport
        }
        this.onResetProduct()
        this.props.getProductByLayout(body);
      } else {
        this.props.showErrorMessage("please.input.data.warehouse");
      }
    } else {
      this.props.showErrorMessage("please.input.data.warehouse");
    }
  }

  getProductByInventoryMachine(e) {
    let form = this.form.current;
    let warehouseExport;
    let warehouseImport;
    if (form) {
      warehouseExport = form.getFieldValue("warehouseExport");
      warehouseImport = form.getFieldValue("warehouseImport");
      if (warehouseExport) {
        let body = {
          warehouseExport,
          warehouseImport
        }
        this.onResetProduct()
        this.props.getProductByInventoryMachine(body);
      } else {
        this.props.showErrorMessage("please.input.data.warehouse");
      }
    } else {
      this.props.showErrorMessage("please.input.data.warehouse");
    }
  }

  OnExportExcel() {
    let { productList } = this.state;
    let { exportInfo } = this.props;
    let body = {

      id: exportInfo.id,
      code: exportInfo.code,
      exportType: exportInfo.exportType,
      warehouseImport: exportInfo.warehouseImport,
      productList: productList.filter(p => p.quantityExport > 0),
    }
    this.props.exportExcel(body).then(res => {
      this.setState({ exportExcelFile: { loading: false, url: res.fileUrl } });
      this.downloadFile(res.fileUrl);
    }).catch(e => {
      this.setState({ exportExcelFile: { loading: false } });
    });
  }

  downloadFile(url) {
    window.open(url);
  }

  changeExportType(e) {
    this.form.current.setFieldsValue({
      warehouseExport: undefined,
    });
    this.setState({ exportTypeState: e });
  }
  render() {
    let { exportInfo, warehouse, exportTypes, machines, exportStatus } = this.props;
    let { productList, selected, totalAmountState, exportExcelFile, paginate: { pageSize, pageIndex }, exportTypeState } = this.state;

    return (
      <React.Fragment>
        <PageHeader
          title={<span><Translate id="WAREHOUSE_EXPORT_HEADER" /> / <Translate id="DETAIL" /></span>}
          ghost={false}
          onBack={e => history.push(LOCAL_PATH.WAREHOUSE.EXPORT.INDEX)}
        />
        <Form
          {...globalProps.form}
          initialValues={exportInfo}
          key={exportInfo.id}
          onFinish={e => this.onSave(e)}
          ref={this.form}
        >
          <Card
            style={globalProps.panel}
            title={<strong><Translate id="GENERAL_INFO" /></strong>}
            extra={
              <Row  >
                <Col {...globalProps.col3}>
                  <Space>
                    {isAllow(PERMISSION.WAREHOUSE_EXPORT.EDIT) &&
                      <Button
                        type="primary"
                        className="custom-btn-primary"
                        htmlType="submit"
                        hidden={exportInfo.id}
                      >
                        <span>
                          <Translate id="SAVE" />
                        </span>
                        <SaveOutlined />
                      </Button>}
                    {isAllow(PERMISSION.WAREHOUSE_EXPORT.CONFIRM) &&
                      <Button
                        type="primary"
                        className="custom-btn-primary"
                        hidden={exportInfo.status === "DONE" || !exportInfo.id}
                        htmlType="submit"
                      >
                        <span>
                          <Translate id="CONFIRM" />
                        </span>
                        <SaveOutlined />
                      </Button>}
                    <Button
                      type="primary"
                      className="custom-btn-primary"
                      loading={exportExcelFile.loading}
                      onClick={e => this.OnExportExcel()}
                      hidden={!exportInfo.id}
                    >
                      <span>
                        <Translate id="EXPORT_EXCEL" />
                      </span>
                      <SaveOutlined />
                    </Button>
                  </Space>
                </Col>
              </Row>
            }
          >

            <Row {...globalProps.row}>
              <Col {...globalProps.colHalf}>
                <Form.Item {...globalProps.formItem}
                  label={<Translate id="WH_EXPORT_CODE" />}
                  name="code"
                >
                  <Input disabled />
                </Form.Item>
              </Col>
              {!exportInfo.id ?
                <Col {...globalProps.colHalf}>
                  <Form.Item {...globalProps.formItem}
                    label={<Translate id="EXPORT_TYPE" />}
                    name="exportType"
                  >
                    <Select style={{ width: "100%" }} onChange={e => this.changeExportType(e)} >
                      {exportTypes.map((k, i) => {
                        if (["EXPORT_FROM_MACHINE", "EXPORT_TO_MACHINE"].includes(k.code)) {
                          return <Option key={i} value={k.code}>{k.name}</Option>
                        }
                        return 0;
                      }
                      )}
                    </Select>
                  </Form.Item>
                </Col>
                :
                <Col {...globalProps.colHalf}>
                  <Form.Item {...globalProps.formItem}
                    label={<Translate id="EXPORT_TYPE" />}
                    name="exportType"
                  >
                    <Select style={{ width: "100%" }} disabled>
                      {exportTypes.map((k, i) =>
                        <Option key={i} value={k.code}>{k.name}</Option>
                      )}

                    </Select>
                  </Form.Item>
                </Col>
              }
              {(exportTypeState === "EXPORT_TO_MACHINE") ?
                <Fragment>
                  <Col {...globalProps.colHalf}>
                    <Form.Item {...globalProps.formItem}
                      label={<Translate id="WH_EXPORT_EXPORT_CODE" />}
                      name="warehouseExport"
                      rules={[rules.required]}
                    >
                      <Select {...globalProps.selectSearch} disabled={exportInfo.id} onChange={e => this.onResetProduct()}>
                        {warehouse.map((k, i) =>
                          <Option key={i} value={k.code}>{k.name}</Option>
                        )}
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col {...globalProps.colHalf}>
                    <Form.Item {...globalProps.formItem}
                      label={<Translate id="WH_EXPORT_IMPORT_CODE" />}
                      name="warehouseImport"
                      rules={[rules.required]}
                    >
                      <Select  {...globalProps.selectSearch} disabled={exportInfo.id} onChange={e => this.onResetProduct()} >
                        {machines.map((k, i) =>
                          <Option key={i} value={k.code}>{k.name}</Option>
                        )}
                      </Select>
                    </Form.Item>
                  </Col> </Fragment>
                :
                <Col {...globalProps.colHalf}>
                  <Form.Item {...globalProps.formItem}
                    label={<Translate id="WH_EXPORT_EXPORT_CODE" />}
                    name="warehouseExport"
                  >
                    <Select {...globalProps.selectSearch} disabled={!exportTypeState === "EXPORT_FROM_MACHINE" && exportInfo.id}>
                      {machines.map((k, i) =>
                        <Option key={i} value={k.code}>{k.name}</Option>
                      )}
                    </Select>
                  </Form.Item>
                </Col>}
              <Col {...globalProps.colHalf}>
                <Form.Item {...globalProps.formItem}
                  label={<Translate id="STATUS" />}
                  name="status"
                >
                  <Select disabled>
                    {exportStatus.map((k, i) =>
                      <Option key={i} value={k.code}>{k.name}</Option>
                    )}
                  </Select>
                </Form.Item>
              </Col>
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
                  label={<Translate id="WH_EXPORT_USER_EXPORT" />}
                  name="userExport"
                >
                  <Input disabled />
                </Form.Item>
              </Col>
            </Row>
          </Card>
        </Form>
        <div className="card-container">
          <Form ref={this.formTable} onFinish={(e) => this.onSave(e)}>
            <React.Fragment>
              <Space style={{ marginBottom: 12 }}>
                {exportTypeState === "EXPORT_TO_MACHINE" ?
                  <Button disabled={exportInfo.id} type="primary" onClick={(e) => this.getProductByLayout()}>
                    <span>
                      <Translate id="GET_PRODUCT_BY_LAYOUT" />
                    </span>
                    <PlusCircleOutlined />
                  </Button> :
                  <Button disabled={exportInfo.id} type="primary" onClick={(e) => this.getProductByInventoryMachine()}>
                    <span>
                      <Translate id="GET_PRODUCT_BY_MACHINE" />
                    </span>
                    <PlusCircleOutlined />
                  </Button>}
                <Button disabled={!selected.length > 0 || exportInfo.id} type="danger" onClick={(e) => this.onDelete()}>
                  <span>
                    <Translate id="DELETE" />
                  </span>
                </Button>
                {<div className="btn-wrapper" style={{ textAlign: "right", paddingRight: 20, marginBottom: 10 }}>
                  <Descriptions >
                    <Descriptions.Item span={1}></Descriptions.Item>

                    <Descriptions.Item span={1} style={{ paddingBottom: 0 }}  >
                      <strong style={{ display: "flex", alignItems: "center" }} ><Translate id="WH_IMPORT_DETAIL_TOTAL_AMOUNT" />
                        &nbsp; &nbsp;

                        <p style={{ color: "red", fontSize: 18 }} >{globalProps.inputNumber.formatter(totalAmountState)} VND </p>


                      </strong>
                    </Descriptions.Item>
                  </Descriptions>
                </div>
                }</Space>

              {exportTypeState !== "EXPORT_FROM_MACHINE" ?
                <Table
                  {...globalProps.table}
                  dataSource={
                    productList
                      ? productList.map((e, i) => {
                        return {
                          ...e,
                          index: i,
                          indexToShow: i + 1,
                        };
                      })
                      : []
                  }
                  pagination={{
                    pageSize: pageSize,
                    // total: total || 0,
                    current: Number(pageIndex),
                    showSizeChanger: true,
                    showTotal: sum => <div>{sum} <Translate id="ITEM" /></div>
                  }}

                  rowSelection={{
                    type: "checkbox",
                    onChange: (e) => this.onSelect(e),
                    selectedRowKeys: selected,
                  }}
                  summary={(pageData) => {
                    let totalQuantityNeedMax = 0;
                    let totalQuantityOnhand = 0;
                    let totalQuantityNeedExport = 0;
                    let totalQuantityAvailable = 0;
                    let totalQuantityExport = 0;
                    let totalSupplierPriceExchange = 0;
                    let totalAmount = 0;
                    pageData.forEach(({ quantityNeedMax, quantityOnhand, quantityNeedExport, quantityAvailable, quantityExport, supplierPriceExchange, amount }) => {
                      totalQuantityNeedMax += quantityNeedMax;
                      totalQuantityOnhand += quantityOnhand;
                      totalQuantityNeedExport += quantityNeedExport;
                      totalQuantityAvailable += quantityAvailable;
                      totalQuantityExport += quantityExport;
                      totalSupplierPriceExchange += supplierPriceExchange;
                      totalAmount += amount;
                    });

                    return (

                      <Table.Summary.Row>
                        <Table.Summary.Cell ></Table.Summary.Cell>
                        <Table.Summary.Cell ></Table.Summary.Cell>
                        <Table.Summary.Cell ></Table.Summary.Cell>
                        <Table.Summary.Cell >Tổng</Table.Summary.Cell>
                        <Table.Summary.Cell ></Table.Summary.Cell>
                        <Table.Summary.Cell >
                          <Text type="danger">{totalQuantityNeedMax}</Text>
                        </Table.Summary.Cell>
                        <Table.Summary.Cell >
                          <Text type="danger">{totalQuantityOnhand}</Text>
                        </Table.Summary.Cell>
                        <Table.Summary.Cell >
                          <Text type="danger">{totalQuantityNeedExport}</Text>
                        </Table.Summary.Cell>
                        <Table.Summary.Cell >
                          <Text type="danger">{totalQuantityAvailable}</Text>
                        </Table.Summary.Cell>
                        <Table.Summary.Cell >
                          <Text type="danger">{totalQuantityExport}</Text>
                        </Table.Summary.Cell>
                        <Table.Summary.Cell ></Table.Summary.Cell>
                        <Table.Summary.Cell >
                          <Text type="danger">{globalProps.inputNumberVND.formatter(totalSupplierPriceExchange)}</Text>
                        </Table.Summary.Cell>
                        <Table.Summary.Cell >
                          <Text type="danger">{globalProps.inputNumberVND.formatter(totalAmount)}</Text>
                        </Table.Summary.Cell>
                      </Table.Summary.Row>
                    );
                  }}
                >

                  <Column
                    title={<Translate id="INDEX" />}
                    dataIndex="indexToShow"
                    align="center"
                  />
                  <Column
                    {...globalProps.tableRow}
                    title={"Sản phẩm"}
                    dataIndex="productName"
                    align='center'
                  />
                  <Column
                    {...globalProps.tableRow}
                    title={"Hình ảnh"}
                    render={value => <img style={{ maxHeight: 100, maxWidth: 100 }} src={value} alt="" />}
                    dataIndex="imagePath"
                  />
                  <Column
                    {...globalProps.tableRow}
                    title={"Đơn vị"}
                    dataIndex="unitName"
                    align='center'
                  />
                  <Column
                    {...globalProps.tableRow}
                    title={"SL Fill tối đa"}
                    dataIndex="quantityNeedMax"
                    align='right'
                  />
                  <Column
                    {...globalProps.tableRow}
                    title={"SL tồn (Kho máy)"}
                    dataIndex="quantityOnhand"
                    align='right'
                  />
                  <Column
                    {...globalProps.tableRow}
                    title={"SL cần xuất"}
                    dataIndex="quantityNeedExport"
                    align='right'
                  />
                  <Column
                    {...globalProps.tableRow}
                    title={"SL tồn (Kho xuất)"}
                    dataIndex="quantityAvailable"
                    align='right'
                  />
                  <Column
                    {...globalProps.tableRow}
                    title={"SL xuất"}
                    dataIndex="quantityExport"
                    render={(val, record) => (
                      <Form.Item
                        style={{ marginBottom: 0 }}
                        name={["productList", record.key, "quantityExport"]}
                        rules={[
                          ({ getFieldValue }) => ({
                            validator(_, value) {
                              let quantityNeedExport = getFieldValue([
                                "productList",
                                record.key,
                                "quantityNeedExport",
                              ]);
                              let quantityAvailable = getFieldValue([
                                "productList",
                                record.key,
                                "quantityAvailable",
                              ]);
                              if (quantityAvailable === 0) {
                                return Promise.reject("Kho xuất hết hàng!"
                                );
                              }
                              if (value !== null && value !== undefined) {
                                if (value < 1) {
                                  return Promise.reject("SL xuất không được nhỏ hơn 1!")
                                    ;
                                } else if (value > quantityAvailable) {
                                  console.log(quantityAvailable);
                                  console.log(value);
                                  return Promise.reject("SL xuất không được lớn hơn SL tồn kho!")
                                    ;
                                } else if (value > quantityNeedExport) {
                                  return Promise.reject("SL xuất không được lớn hơn SL tối đa!"
                                  );
                                } else {
                                  return Promise.resolve();
                                }
                              } else {
                                return Promise.reject("SL xuất trống!"
                                );
                              }
                            },
                          }), rules.type.number
                        ]}
                      >
                        <InputNumber
                          disabled={exportInfo.id}
                          {...globalProps.inputNumber}
                          className="input-number-right"
                          style={{ width: "100%", minWidth: "150px" }}
                          onChange={(e) => {
                            this.onRowChange(record.key, "quantityExport", e);
                          }}
                        />
                      </Form.Item>
                    )}
                  />
                  <Column
                    title={"HSD"}
                    dataIndex="expireDate"
                    {...globalProps.tableRow}
                    render={(val) => {
                      if (val) {
                        // Chuyển đổi định dạng chuỗi ngày sang ISO 8601
                        const isoDateString = val.split('/').reverse().join('-');

                        // Sử dụng Date.parse() để chuyển đổi thành timestamp
                        const timestamp = Date.parse(isoDateString);
                        const currentDate = new Date();
                        // Tạo đối tượng Date từ timestamp
                        const expireDate = new Date(timestamp);
                        if (expireDate < (currentDate.setMonth(currentDate.getMonth() + 2))) {
                          return <p style={{ color: "red" }}>{val}</p>
                        }
                        return val;
                      }
                      return "";
                    }}
                  />
                  <Column
                    title={"Đơn Giá NCC"}
                    dataIndex="supplierPriceExchange"
                    render={val => val ? globalProps.inputNumberVND.formatter(val) : 0}
                    {...globalProps.tableRow}
                    align='right'
                  />
                  <Column
                    title={"Thành tiền"}
                    dataIndex="amount"
                    render={val => val ? globalProps.inputNumberVND.formatter(val) : 0}
                    {...globalProps.tableRow}
                    align='right'
                  />
                  <Column
                    title={"Ghi chú"}
                    dataIndex="note"
                    {...globalProps.tableRow}
                    render={(val, record) => (
                      <Form.Item
                        style={{ marginBottom: 0 }}
                        name={["productList", record.key, "note"]}
                      >
                        <TextArea
                          disabled={exportInfo.id}
                          style={{ width: "100%", minWidth: "150px" }}
                          onChange={(e) => {
                            this.onRowChange(record.key, "note", e.target.value);
                          }}
                        />
                      </Form.Item>
                    )}
                  />
                </Table>
                :
                <Table
                  {...globalProps.table}
                  dataSource={
                    productList
                      ? productList.map((e, i) => {
                        return {
                          ...e,
                          index: i,
                          indexToShow: i + 1,
                        };
                      })
                      : []
                  }
                  pagination={{
                    pageSize: pageSize,
                    current: Number(pageIndex),
                    showSizeChanger: true,
                    showTotal: sum => <div>{sum} <Translate id="ITEM" /></div>
                  }}

                  rowSelection={{
                    type: "checkbox",
                    onChange: (e) => this.onSelect(e),
                    selectedRowKeys: selected,
                  }}
                  summary={(pageData) => {
                    let totalQtyLayout = 0;
                    let totalQtyInventory = 0;
                    let totalQtyDifference = 0;
                    let totalQuantityExport = 0;
                    let totalSupplierPriceExchange = 0;
                    let totalAmount = 0;
                    pageData.forEach(({ qtyLayout, qtyInventory, qtyDifference, quantityExport, supplierPriceExchange, amount }) => {
                      totalQtyLayout += qtyLayout;
                      totalQtyInventory += qtyInventory;
                      totalQtyDifference += qtyDifference;
                      totalQuantityExport += quantityExport;
                      totalSupplierPriceExchange += supplierPriceExchange;
                      totalAmount += amount;
                    });

                    return (

                      <Table.Summary.Row>
                        <Table.Summary.Cell ></Table.Summary.Cell>
                        <Table.Summary.Cell ></Table.Summary.Cell>
                        <Table.Summary.Cell ></Table.Summary.Cell>
                        <Table.Summary.Cell >Tổng</Table.Summary.Cell>
                        <Table.Summary.Cell >
                          <Text type="danger">{totalQtyLayout}</Text>
                        </Table.Summary.Cell>
                        <Table.Summary.Cell >
                          <Text type="danger">{totalQtyInventory}</Text>
                        </Table.Summary.Cell>
                        <Table.Summary.Cell >
                          <Text type="danger">{totalQtyDifference}</Text>
                        </Table.Summary.Cell>
                        <Table.Summary.Cell >
                          <Text type="danger">{totalQuantityExport}</Text>
                        </Table.Summary.Cell>
                        <Table.Summary.Cell ></Table.Summary.Cell>
                        <Table.Summary.Cell >
                          <Text type="danger">{globalProps.inputNumberVND.formatter(totalSupplierPriceExchange)}</Text>
                        </Table.Summary.Cell>
                        <Table.Summary.Cell >
                          <Text type="danger">{globalProps.inputNumberVND.formatter(totalAmount)}</Text>
                        </Table.Summary.Cell>
                      </Table.Summary.Row>
                    );
                  }}
                >

                  <Column
                    title={<Translate id="INDEX" />}
                    dataIndex="indexToShow"
                    align="center"
                  />
                  <Column
                    {...globalProps.tableRow}
                    title={"Sản phẩm"}
                    dataIndex="productName"
                    align='center'
                    render={(val, record) => record.productCode + " - " + val}
                  />
                  <Column
                    {...globalProps.tableRow}
                    title={"Hình ảnh"}
                    render={value => <img style={{ maxHeight: 100, maxWidth: 100 }} src={value} alt="" />}
                    dataIndex="imagePath"
                  />
                  <Column
                    {...globalProps.tableRow}
                    title={"SL tồn trên Layout"}
                    dataIndex="qtyLayout"
                    align='right'
                  />
                  <Column
                    {...globalProps.tableRow}
                    title={"SL tồn kho máy"}
                    dataIndex="qtyInventory"
                    align='right'
                  />
                  <Column
                    {...globalProps.tableRow}
                    title={"SL chênh lệch"}
                    dataIndex="qtyDifference"
                    align='right'
                  />
                  <Column
                    {...globalProps.tableRow}
                    title={"SL xuất"}
                    dataIndex="quantityExport"
                    render={(val, record) => (
                      <Form.Item
                        style={{ marginBottom: 0 }}
                        name={["productList", record.key, "quantityExport"]}
                        rules={[
                          ({ getFieldValue }) => ({
                            validator(_, value) {
                              let qtyDifference = getFieldValue([
                                "productList",
                                record.key,
                                "qtyDifference",
                              ]);
                              let qtyInventory = getFieldValue([
                                "productList",
                                record.key,
                                "qtyInventory",
                              ]);
                              if (qtyInventory === 0) {
                                return Promise.reject("Kho xuất hết hàng!"
                                );
                              }
                              if (value !== null && value !== undefined) {
                                if (value < 1) {
                                  return Promise.reject("SL xuất không được nhỏ hơn 1!")
                                    ;
                                } else if (value > qtyDifference) {
                                  return Promise.reject("SL xuất không được lớn hơn SL tồn kho chênh lệch!")
                                    ;
                                } else {
                                  return Promise.resolve();
                                }
                              } else {
                                return Promise.reject("SL xuất trống!"
                                );
                              }
                            },
                          }), rules.type.number
                        ]}
                      >
                        <InputNumber
                          disabled={exportInfo.id}
                          {...globalProps.inputNumber}
                          className="input-number-left"
                          style={{ width: "100%", minWidth: "150px" }}
                          onChange={(e) => {
                            this.onRowChange(record.key, "quantityExport", e);
                          }}
                        />
                      </Form.Item>
                    )}
                  />
                  <Column
                    title={"HSD"}
                    dataIndex="expireDate"
                    {...globalProps.tableRow}
                  //    render={(val) => val ? moment(val).format(format.date) : ""}
                  />
                  <Column
                    title={"Đơn Giá NCC"}
                    dataIndex="supplierPriceExchange"
                    render={val => val ? globalProps.inputNumberVND.formatter(val) : 0}
                    {...globalProps.tableRow}
                    align='right'
                  />
                  <Column
                    title={"Thành tiền"}
                    dataIndex="amount"
                    render={val => val ? globalProps.inputNumberVND.formatter(val) : 0}
                    {...globalProps.tableRow}
                    align='right'
                  />
                  <Column
                    title={"Ghi chú"}
                    dataIndex="note"
                    {...globalProps.tableRow}
                    render={(val, record) => (
                      <Form.Item
                        style={{ marginBottom: 0 }}
                        name={["productList", record.key, "note"]}
                      >
                        <TextArea
                          disabled={exportInfo.id}
                          style={{ width: "100%", minWidth: "150px" }}
                          onChange={(e) => {
                            this.onRowChange(record.key, "note", e.target.value);
                          }}
                        />
                      </Form.Item>
                    )}
                  />
                </Table>}
            </React.Fragment>
          </Form>
          {/* {isAllow(PERMISSION.WAREHOUSE_EXPORT.DETAIL) &&
            <Table
              {...globalProps.table}
              dataSource={products.map((k, i) => ({ ...k, index: i + 1, key: i }))}
            >
              <Column {...globalProps.tableRow} title={<Translate id="INDEX" />} dataIndex="index" width={60} />
              <Column sorter={(a, b) => a.product.localeCompare(b.code)} {...globalProps.tableRow} title={<Translate id="WH_EXPORT_PRODUCT" />} dataIndex="product" />
              <Column align='center' sorter={(a, b) => a.image.localeCompare(b.image)} {...globalProps.tableRow} title={<Translate id="WH_EXPORT_IMAGE" />}
                render={value => <img style={{ maxHeight: 100, maxWidth: 100 }} src={value} alt="" />}
                dataIndex="image" />
              <Column sorter={(a, b) => a.unit.localeCompare(b.unit)} {...globalProps.tableRow} title={<Translate id="WH_EXPORT_UNIT" />} dataIndex="unit" />
              <Column sorter={(a, b) => a.qtyExport - b.qtyExport} {...globalProps.tableRow} title={<Translate id="WH_EXPORT_QTY_EXPORT" />}
                render={val => val ? globalProps.inputNumber.formatter(val) : 0}
                dataIndex="qtyExport" />
              <Column sorter={(a, b) => a.supplierPrice - b.supplierPrice} {...globalProps.tableRow} title={<Translate id="WH_EXPORT_SUPPLIER_PRICE" />}
                render={val => val ? globalProps.inputNumber.formatter(val) : 0}
                align="right"
                dataIndex="supplierPrice" />
              <Column sorter={(a, b) => a.amount - b.amount} {...globalProps.tableRow} title={<Translate id="WH_EXPORT_AMOUNT" />}
                render={val => val ? globalProps.inputNumber.formatter(val) : 0}
                align="right"
                dataIndex="amount" />
              <Column sorter={(a, b) => a.expriceDate.localeCompare(b.expriceDate)} {...globalProps.tableRow} title={<Translate id="WH_EXPORT_EXPRICE_DATE" />} dataIndex="expriceDate" />
            </Table>
          } */}
        </div>

      </React.Fragment >
    )
  }
}

const stateToProps = (state) => {
  return {
    products: state.whExport.products,
    exportId: state.whExport.exportId,
    exportInfo: state.whExport.exportInfo,
    exportTypes: state.whExport.exportTypes,
    machines: state.whExport.machines,
    exportStatus: state.whExport.exportStatus,
    warehouse: state.whExport.warehouse,
  };
}

const dispatchToProps = (dispatch) => bindActionCreators({
  detail: whExportActions.detail,
  exportExcel: whExportActions.exportDetailExcel,
  getProductByLayout: whExportActions.getProductByLayout,
  getProductByInventoryMachine: whExportActions.getProductByInventoryMachine,
  save: whExportActions.edit,
  confirm: whExportActions.confirm,
  showErrorMessage: showErrorMessage,
}, dispatch);

export default connect(stateToProps, dispatchToProps)(withLocalize(ExportDetail));