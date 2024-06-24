
import React, { Component } from "react";
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { SearchOutlined } from '@ant-design/icons';
import { Translate, withLocalize } from "react-localize-redux";
import { Table, PageHeader, Row, Col, Button, Form, Select, Card, Image } from 'antd';
import { globalProps, rules } from "../../data";
import { whInventoryActions } from "../../actions";
import { SaveOutlined } from '@ant-design/icons';
const { Column } = Table;
const { Option } = Select;
const defaultPaginate = {
  pageSize: 50,
  pageIndex: 1
}
class WhInventory extends Component {
  state = {
    timeFromReadonly: false,
    timeToReadonly: false,
    searchBody: {},
    paginate: {
      pageIndex: 1,
      pageSize: 50,
    },
    imports: [],
    exportImport: { loading: false },
    sort: {},
    exportExcelFile: { loading: false },
  }

  form = React.createRef()



  componentDidMount() {
    this.props.init();
  }

  onSearch(e) {
    this.setState({
      searchBody: e,
      paginate: {
        pageSize: e.pageSize ? e.pageSize : defaultPaginate.pageSize,
        pageIndex: e.pageIndex ? e.pageIndex : defaultPaginate.pageIndex,
      },
    }, () => {
      let { paginate, searchBody } = this.state;
      let { search } = this.props;
      let data = {
        ...searchBody,
        paging: {
          ...paginate
        },
      }
      search({ data });
    })
  }

  OnExportExcel() {
    let { inventories } = this.props;
    let body = {
      productList: inventories,
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

  changePaginate(paging) {
    this.setState({
      paginate: {
        pageSize: paging.pageSize,
        pageIndex: paging.current
      },
    });
  }

  onReset() {
    let form = this.form.current;
    if (form) {
      form.resetFields()
    }
    this.setState({
      searchBody: {},
      paginate: defaultPaginate,
    }, () => {
      this.onSearch({});
    });
  }

  render() {
    let { products, warehouses, total, inventories } = this.props;
    let { searchBody, paginate: { pageIndex }, exportExcelFile } = this.state;
    return (
      <React.Fragment>
        <PageHeader
          title={"Quản lý tồn kho chính"}
          ghost={false}
        />
        <Card
          title={<strong><Translate id="SEARCH" /></strong>}
          size="small"
          style={{ marginTop: 10 }}
          extra={<Button
            type="primary"
            className="custom-btn-primary"
            loading={exportExcelFile.loading}
            onClick={e => this.OnExportExcel()}
            hidden={inventories === undefined || !inventories.length}
          >
            <span>
              <Translate id="EXPORT_EXCEL" />
            </span>
            <SaveOutlined />
          </Button>}
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
                  label={<Translate id="WAREHOUSE" />}
                  name="WarehouseIds"
                  rules={[rules.required]}
                >
                  <Select {...globalProps.selectSearch} allowClear mode="multiple">
                    {warehouses.map((k, i) =>
                      <Option value={k.id} key={i}>{`${k.code} - ${k.name}`}</Option>
                    )}
                  </Select>
                </Form.Item>
              </Col>
              {/* <Col {...globalProps.col}>
                <Form.Item {...globalProps.formItem}
                  label={"Hạn sử dụng đến ngày"}
                  name="expireDate"
                  initialValue={moment()}
                // rules={[rules.required]}
                >
                  <DatePicker
                    format={translate("FORMAT_DATE")}
                    style={{ width: '100%' }}
                  />
                </Form.Item>
              </Col> */}
              <Col {...globalProps.col}>
                <Form.Item {...globalProps.formItem}
                  label={<Translate id="PRODUCT" />}
                  name="productIds"
                >
                  <Select {...globalProps.selectSearch} allowClear mode="multiple">
                    {products.map((k, i) =>
                      <Option value={k.id} key={i}>{k.name}</Option>
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

              </Col>
            </Row>
          </Form>
        </Card>
        <div className="card-container">
          <Table
            {...globalProps.table}
            dataSource={inventories && inventories.map((k, i) => {
              k.key = i;
              k.indexToShow = i + 1;
              return k;
            })}
            //onChange={e => this.changePaginate(e)}
            pagination={{
              pageSize: 99999,
              total: total || 0,
              current: Number(pageIndex),
              showSizeChanger: false,
              showTotal: sum => <div>{sum} <Translate id="ITEM" /></div>
            }}
          >
            <Column {...globalProps.tableRow} title={<Translate id="INDEX" />} dataIndex="indexToShow" width={50} />
            <Column {...globalProps.tableRow} title={"Tên sản phẩm"} dataIndex="productName" />
            <Column {...globalProps.tableRow} title={"Đơn vị"}
              dataIndex="unitName" />
            <Column {...globalProps.tableRow} title={"Hình ảnh"} dataIndex="image"
              render={(val) =>
                val ?
                  <Image src={val} width={100} height={100} />
                  : ""
              } />
            <Column {...globalProps.tableRow} title={"Số lượng tồn"}
              render={val => val ? globalProps.inputNumber.formatter(val) : 0}
              align="right"
              dataIndex="quantity" />
            <Column {...globalProps.tableRow} title={"Số lượng đáp ứng"}
              render={val => val ? globalProps.inputNumber.formatter(val) : 0}
              align="right"
              dataIndex="quantityAvailable" />

            <Column {...globalProps.tableRow} title={"Giá nhà cung cấp"} dataIndex="price"
              render={val => val ? <span style={{ color: "red" }}>{globalProps.inputNumberVND.formatter(val)}</span> : 0}
              align="right" />
            <Column {...globalProps.tableRow} title={"Hạn sử dụng"} dataIndex="expireDate" />
            <Column {...globalProps.tableRow} title={"Ghi chú"} dataIndex="note" />
            <Column {...globalProps.tableRow} title={"Mã lô"} dataIndex="lotNo" />
          </Table>
        </div>
      </React.Fragment >
    )
  }
}

const stateToProps = (state) => {
  return {
    inventories: state.whInventory.inventories,
    total: state.whInventory.totalItem,
    warehouses: state.whInventory.warehouses,
    products: state.whInventory.products,
  };
}

const dispatchToProps = (dispatch) => bindActionCreators({
  init: whInventoryActions.init,
  search: whInventoryActions.search,
  exportExcel: whInventoryActions.exportExcel,
}, dispatch);

export default connect(stateToProps, dispatchToProps)(withLocalize(WhInventory));