import React, { Component, Fragment } from "react";
import { Translate } from "react-localize-redux";
import {
    Table,
    PageHeader,
    Row,
    Col,
    Button,
    Form,
    Select,
    Card,
    Input,
    Modal,
    DatePicker,
    TimePicker,
    Space,
    Collapse,
    Tag,
    Tooltip,
    Statistic
} from "antd";
import {
    globalProps,
    isAllow,
    PERMISSION,
    rules,
    RenderText,
    format
} from "../../data";
import moment from "moment";
import { SearchOutlined } from "@ant-design/icons";
import { listPaymentMethodsRefund } from ".";

export class TransPaymentOrder extends Component {
    constructor(props) {
        super(props);
        this.state = {
            searchBody: {},
            paginate: {
                pageIndex: 1,
                pageSize: 10,
            },
            exportReport: { loading: false },
            amountRefundState: 0,
            itemRefund: [],
            selectList: [],
            selectIndexList: [],
        };
    }

    form = React.createRef();
    formRefund = React.createRef();

    componentDidMount() {
        let {
            init,
        } = this.props;

        init().then((res) => {
            this.onSearch();
        });
    }


    componentDidUpdate(prevProps) {
        let { fromDate, toDate, fromTime, toTime } = this.props;
        if (fromDate && prevProps.fromDate !== fromDate) {
            this.form.current.setFieldsValue({
                fromDate: moment(fromDate),
            });
        }

        if (fromTime && prevProps.fromTime !== fromTime) {
            this.form.current.setFieldsValue({
                fromTime: moment(fromTime, "HH:mm:ss"),
            });
        }

        if (toDate && prevProps.toDate !== toDate) {
            this.form.current.setFieldsValue({
                toDate: moment(toDate),
            });
        }

        if (toTime && prevProps.toTime !== toTime) {
            this.form.current.setFieldsValue({
                toTime: moment(toTime, "HH:mm:ss"),
            });
        }
    }

    onGetSearchBody() {
        let body = { ...this.form.current.getFieldsValue() };
        if (body.fromDate) {
            let dateFromFormat = body.fromDate.format("YYYY-MM-DD");
            let timeFromFormat = "";

            if (body.fromTime) {
                timeFromFormat = body.fromTime.format("HH:mm:ss");
            }
            if (timeFromFormat === "") {
                timeFromFormat = "00:00:00";
            }
            let date = moment(`${dateFromFormat} ${timeFromFormat}`);

            body.fromDate = date.format("YYYY-MM-DDTHH:mm:ss");
        }

        if (body.toDate) {
            let toDateFormat = body.toDate.format("YYYY-MM-DD");
            let timeToFormat = "";

            if (body.toTime) {
                timeToFormat = body.toTime.format("HH:mm:ss");
            }

            if (timeToFormat === "") {
                timeToFormat = "23:59:59";
            }

            let date = moment(`${toDateFormat} ${timeToFormat}`);
            body.toDate = date.format("YYYY-MM-DDTHH:mm:ss");
        }

        return body;
    }

    onSearch() {
        this.setState(
            {
                paginate: {
                    ...this.state.paginate,
                    pageIndex: 1,
                },
                sort: {},
            },
            () => {
                let { paginate } = this.state;
                let { search } = this.props;
                let searchBody = this.onGetSearchBody();
                let data = {
                    ...searchBody,
                    paging: {
                        ...paginate,
                        pageIndex: 1,
                    },
                };
                search(data);
            }
        );
    }

    changePaginate = (paginate, sorter) => {
        this.setState(
            {
                paginate: {
                    pageSize: paginate.pageSize,
                    pageIndex: paginate.current,
                },
            },
            () => {
                let { paginate } = this.state;
                let { search } = this.props;
                let searchBody = this.onGetSearchBody();
                let data = {
                    ...searchBody,
                    paging: {
                        ...paginate,
                    },
                };
                search(data);
            }
        );
    };

    onReset() {
        this.setState({
            searchBody: {}
        }, () => {
            this.form.current.resetFields();
        });
    }

    onExport() {
        let { exportExcel } = this.props;
        let data = {
            ...this.onGetSearchBody(),
        };
        this.setState({ exportReport: { loading: true } });

        exportExcel(data)
            .then((res) => {
                this.setState({ exportReport: { loading: false, url: res.fileUrl } });

                this.downloadFile(res.fileUrl);
            })
            .catch(() => {
                this.setState({ exportReport: { loading: false } });
            });
    }

    downloadFile(url) {
        window.open(url);
    }

    showTopupModal(record, type) {
        let { translate, reRefund } = this.props;
        if (type === 'REFUND') {
            let body = {
                data: { billNumber: record.billNumber }
            };
            this.props.getListOrderDetail(body).then((res) => {
                this.setState({
                    itemRefund: res.billDetails || [],
                    isShowTopupModal: true,
                });
            });
        } else if (type === 'RE_REFUND') {
            let modal = Modal.confirm({
                title: translate("TITLE_NOTIFICATION"),
                centered: true,
                content: translate("ARE_YOU_SURE"),
                okText: translate("CONFIRM"),
                cancelText: translate("CLOSE"),
                onOk: () => {
                    modal.destroy();
                    console.log(record);
                    // reRefund(record).finally(() => {
                    //   this.onSearch();
                    // });
                },
                onCancel: () => {
                    modal.destroy();
                },
            });
        }

    }

    onProcess(e) {
        let { translate } = this.props;
        let { amountRefundState, selectList } = this.state;
        if (amountRefundState > 0 && selectList.length > 0) {
            let modal = Modal.confirm({
                title: translate("TITLE_NOTIFICATION"),
                centered: true,
                content: (
                    <div>
                        <label>
                            {translate("ARE_YOU_SURE_YOU_REFUND_AMOUNT", { money: globalProps.inputNumberVND.formatter(amountRefundState) })}
                        </label>
                    </div>
                ),
                okText: translate("CONFIRM"),
                cancelText: translate("CLOSE"),
                onOk: () => {
                    modal.destroy();
                    this.confirmProcess(e);
                },
                onCancel: () => {
                    modal.destroy();
                },
            });
        } else {
            let modal = Modal.warning({
                title: translate("TITLE_NOTIFICATION"),
                centered: true,
                content: (
                    <div>
                        <label>
                            {translate("INVALID_AMOUNT_REFUND")}
                        </label>
                    </div>
                ),
                cancelText: translate("CLOSE"),
                onCancel: () => {
                    modal.destroy();
                },
            });
        }
    }

    confirmProcess(e) {
        let { refund } = this.props;
        let { selectList } = this.state;
        let data = {
            billNumber: selectList[0].billNumber,
            billDetailList: selectList
        };
        this.setState({
            isShowTopupModal: false,
        });
        refund(data).finally(() => {
            this.onSearch();
        });
    }

    onSelect(select) {
        let { listOrderDetail } = this.props;
        let amountRefund = 0;
        let list = [];
        this.setState({
            selectIndexList: select
        });

        if (select.length > 0) {
            select.map((k, i) => {
                amountRefund += listOrderDetail[k].temporaryRevenue;
                listOrderDetail[k].refundAmount = listOrderDetail[k].temporaryRevenue;
                list.push(listOrderDetail[k]);
                return k;
            }

            );
            this.setState({
                amountRefundState: amountRefund,
                selectList: list
            });
        } else {
            this.setState({
                amountRefundState: 0
            });
        }
    }

    handleCancel = () => {
        this.setState({
            itemRefund: [],
            isShowTopupModal: false,
            amountRefundState: 0
        });
    };

    onRowChange(index, key, value) {
        let { listResourceSetting } = this.props;
        let { itemRefund } = this.state;
        let item = itemRefund[index];
        if (item) {
            let temp = [...itemRefund];
            item[key] = value;
            if (key === 'reasonRefund') {
                item.reasonRefundName = listResourceSetting.filter((e) => e.code === value)[0].name;
            }
            temp.splice(index, 1, item);
            this.updateList([...temp]);
        }
    }

    updateList(list) {
        this.setState(
            {
                itemRefund: list,
            },
            () => {
                let { itemRefund } = this.state;
                let form = this.formRefund.current;
                if (form) {
                    form.setFieldsValue({ itemRefund });
                }
            }
        );
    }

    render() {
        let {
            machines, locations, paymentTransactionData, fromDate, toDate, fromTime, toTime, paymentMethods, translate, paymentStatusList, total, listResourceSetting, totalAmount, totalRefund
        } = this.props;
        let {
            searchBody, paginate: { pageSize, pageIndex }, exportReport, isShowTopupModal, amountRefundState, itemRefund, selectIndexList
        } = this.state;
        return (
            <React.Fragment>
                <PageHeader
                    title={<Translate id="PAYMENT_ORDER.INDEX" />}
                    ghost={false} />
                <Card
                    title={<strong>
                        <Translate id="SEARCH" />
                    </strong>}
                    size="small"
                    style={{ marginTop: 10 }}
                >
                    <Form
                        labelAlign="right"
                        layout="horizontal"
                        initialValues={searchBody}
                        onFinish={(e) => this.onSearch()}
                        {...globalProps.form}
                        ref={this.form}
                    >
                        <Row {...globalProps.row}>
                            {/* Máy */}
                            <Col {...globalProps.col}>
                                <Form.Item
                                    {...globalProps.formItem}
                                    label={<Translate id="MACHINE" />}
                                    name="vendingId"
                                >
                                    <Select
                                        {...globalProps.selectSearch}
                                        allowClear
                                        mode="multiple"
                                    >
                                        {machines.map((k, i) => (
                                            <Option
                                                value={k.id}
                                                key={i}
                                            >{`${k.code} - ${k.name}`}</Option>
                                        ))}
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col {...globalProps.col}>
                                <Input.Group size="large">
                                    <Row gutter={8}>
                                        <Col style={{ width: "50%" }}>
                                            <Form.Item
                                                {...globalProps.formItem}
                                                label={<Translate id="DATE_FROM" />}
                                                name="fromDate"
                                                initialValue={moment(fromDate)}
                                                rules={[rules.dateFromFilter]}
                                            >
                                                <DatePicker
                                                    format={translate("FORMAT_DATE")}
                                                    style={{ width: "100%" }} />
                                            </Form.Item>
                                        </Col>
                                        <Col style={{ width: "50%" }}>
                                            <Form.Item
                                                {...globalProps.formItem}
                                                label="&nbsp;"
                                                name="fromTime"
                                                initialValue={moment(fromTime, "HH:mm:ss")}
                                            >
                                                <TimePicker style={{ width: "100%" }} />
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                </Input.Group>
                            </Col>

                            <Col {...globalProps.col}>
                                <Input.Group size="large">
                                    <Row gutter={8}>
                                        <Col style={{ width: "50%" }}>
                                            <Form.Item
                                                {...globalProps.formItem}
                                                label={<Translate id="DATE_TO" />}
                                                name="toDate"
                                                style={{ width: "100%" }}
                                                initialValue={moment(toDate)}
                                                rules={[rules.dateToFilter]}
                                            >
                                                <DatePicker
                                                    format={translate("FORMAT_DATE")}
                                                    style={{ width: "100%" }} />
                                            </Form.Item>
                                        </Col>
                                        <Col style={{ width: "50%" }}>
                                            <Form.Item
                                                {...globalProps.formItem}
                                                label="&nbsp;"
                                                name="toTime"
                                                initialValue={moment(toTime, "HH:mm:ss")}
                                            >
                                                <TimePicker style={{ width: "100%" }} />
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                </Input.Group>
                            </Col>
                            <Col {...globalProps.col}>
                                <Form.Item
                                    {...globalProps.formItem}
                                    label={<Translate id="CASH_LEFT_OVER_CODE" />}
                                    name="transactionCode"
                                >
                                    <Input />
                                </Form.Item>
                            </Col>
                            <Col {...globalProps.col}>
                                <Form.Item
                                    {...globalProps.formItem}
                                    label={<Translate id="BILL_BILLNUMBER" />}
                                    name="billNumber"
                                >
                                    <Input />
                                </Form.Item>
                            </Col>
                            <Col {...globalProps.col}>
                                <Form.Item {...globalProps.formItem} label={<Translate id="STATUS" />}
                                    name="status"
                                >
                                    <Select {...globalProps.selectSearch} allowClear>
                                        {paymentStatusList.map((k, i) => <Option
                                            value={k.code}
                                            key={i}
                                        >{k.name}</Option>
                                        )}
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col {...globalProps.col}>
                                <Form.Item {...globalProps.formItem} label={<Translate id="LABEL_CHART_WALLET" />}
                                    name="paymentType"
                                >
                                    <Select {...globalProps.selectSearch} allowClear>
                                        {paymentMethods.map((k, i) => <Option
                                            value={k.id}
                                            key={i}
                                        >{k.name}</Option>
                                        )}
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col {...globalProps.col}>
                                <Form.Item
                                    {...globalProps.formItem}
                                    label={<Translate id="LOCATION" />}
                                    name="locationId"
                                >
                                    <Select
                                        {...globalProps.selectSearch}
                                        allowClear
                                        mode="multiple"
                                    >
                                        {locations.map((k, i) => (
                                            <Option
                                                value={k.id}
                                                key={i}
                                            >{`${k.code} - ${k.name}`}</Option>
                                        ))}
                                    </Select>
                                </Form.Item>
                            </Col>
                        </Row>
                        {isAllow(PERMISSION.PAYMENT_TRANSACTION.INDEX) && (
                            <Space size="small">
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
                                <Button type="primary" size="large"
                                    className="custom-btn-primary"
                                    loading={exportReport.loading} onClick={() => this.onExport()}>
                                    <Translate id="EXPORT_EXCEL" />
                                </Button>
                            </Space>
                        )}
                    </Form>
                </Card>

                <Collapse
                    style={globalProps.panel}
                    expandIconPosition="right"
                    defaultActiveKey={[0]}
                >
                    <Collapse.Panel
                        header={<strong>
                            <Translate id="SUMMARY" />
                        </strong>}
                    >
                        <Tag style={{ padding: 10, margin: 8, background: "#FFF" }}>
                            <Statistic
                                title={<Tooltip title={<Translate id={"TOTAL_TRANSACTION"} />}>
                                    <strong>
                                        <Translate id={"TOTAL_TRANSACTION"} />
                                    </strong>
                                </Tooltip>}
                                value={total}
                                valueRender={(e) => (
                                    <strong style={{ color: "#878BB6" }}>{e}</strong>
                                )} />
                        </Tag>
                        <Tag style={{ padding: 10, margin: 8, background: "#FFF" }}>
                            <Statistic
                                title={<Tooltip title={<Translate id={"TOTAL_AMOUNT"} />}>
                                    <strong>
                                        <Translate id={"TOTAL_AMOUNT"} />
                                    </strong>
                                </Tooltip>}
                                value={totalAmount}
                                valueRender={(e) => (
                                    <strong style={{ color: "#4ACAB4" }}>{e}</strong>
                                )} />
                        </Tag>
                        <Tag style={{ padding: 10, margin: 8, background: "#FFF" }}>
                            <Statistic
                                title={<Tooltip title={"Tổng tiền chưa thối"}>
                                    <strong>
                                        Tổng tiền hoàn lại
                                    </strong>
                                </Tooltip>}
                                value={totalRefund}
                                valueRender={(e) => (
                                    <strong style={{ color: "#FF6666" }}>{e}</strong>
                                )} />
                        </Tag>
                    </Collapse.Panel>
                </Collapse>

                <div className="card-container">
                    {isAllow(PERMISSION.PAYMENT_TRANSACTION.INDEX) && (
                        <Table
                            {...globalProps.table}
                            dataSource={paymentTransactionData.map((k, i) => {
                                k.key = i;
                                k.index = (pageIndex - 1) * pageSize + i + 1;
                                return k;
                            })}
                            onChange={(e) => this.changePaginate(e)}
                            pagination={{
                                pageSize: pageSize,
                                total: total,
                                current: pageIndex,
                                showSizeChanger: true,
                                showTotal: (sum) => (
                                    <div>
                                        {sum} <Translate id="ITEM" />
                                    </div>
                                ),
                            }}
                        >
                            <Column
                                title={<Translate id="ACTION" />}
                                key="action"
                                fixed="center"
                                render={(text, record) => (
                                    <Row gutter={8} style={{ flexWrap: "nowrap" }}>
                                        {isAllow(PERMISSION.PAYMENT_TRANSACTION.PROCESS) && (
                                            <Space>

                                                {(listPaymentMethodsRefund.includes(record.paymentType)
                                                    && record.status === "SUCCESS"
                                                    && record.refundStatus === ""
                                                    && record.amountRefund === 0) ?
                                                    <Col flex="32px">
                                                        <Button
                                                            type="primary"
                                                            className="custom-btn-primary"
                                                            onClick={() => this.showTopupModal(record, "REFUND")}
                                                        >
                                                            <Translate id="PROCESS" />
                                                        </Button></Col>
                                                    : ""}



                                                {(listPaymentMethodsRefund.includes(record.paymentType)
                                                    && record.status === "SUCCESS"
                                                    && record.refundStatus === "PENDING"
                                                    && record.amountRefund > 0) ?
                                                    <Col flex="32px"> <Button
                                                        type="primary"
                                                        className="custom-btn-primary"
                                                        onClick={() => this.showTopupModal(record, "RE_REFUND")}
                                                    >
                                                        <Translate id="RE_PROCESS" />
                                                    </Button></Col>
                                                    : ""}

                                            </Space>)}
                                    </Row>
                                )} />
                            <Column
                                width={60}
                                title={<Translate id="INDEX" />}
                                dataIndex="index" />
                            <Column
                                {...globalProps.tableRow}
                                key="billNumber"
                                title={<Translate id="BILL_BILLNUMBER" />}
                                dataIndex="billNumber" />
                            <Column
                                {...globalProps.tableRow}
                                key="transactionCode"
                                title={<Translate id="PAYMENT_ORDER.CODE" />}
                                dataIndex="transactionCode" />
                            <Column
                                {...globalProps.tableRow}
                                key="paymentType"
                                title={<Translate id="LABEL_CHART_WALLET" />}
                                dataIndex="paymentType"
                                render={(k, i) => {
                                    return paymentMethods &&
                                        Array.isArray(paymentMethods) &&
                                        paymentMethods.length > 0 &&
                                        k
                                        ? (paymentMethods.find(e => e.id === k) ? paymentMethods.find(e => e.id === k).name : k)
                                        : "";
                                }} />
                            <Column
                                {...globalProps.tableRow}
                                key="paymentTime"
                                title={<Translate id="CREATED_DATE_ON" />}
                                dataIndex="paymentTime"
                                render={(val) => val ? moment(val).format(format.date) : ""} />
                            <Column
                                {...globalProps.tableRow}
                                key="paymentTime"
                                title={<Translate id="CREATED_TIME_ON" />}
                                dataIndex="paymentTime"
                                render={(val) => val ? moment(val).format(format.times) : ""} />
                            <Column
                                {...globalProps.tableRow}
                                key="updateTime"
                                title={<Translate id="UPDATED_DATE" />}
                                dataIndex="updateTime"
                                render={(val) => val ? moment(val).format(format.date) : ""} />
                            <Column
                                {...globalProps.tableRow}
                                key="updateTime"
                                title={<Translate id="UPDATED_TIME" />}
                                dataIndex="updateTime"
                                render={(val) => val ? moment(val).format(format.times) : ""} />
                            <Column
                                className="column-default"
                                key="status"
                                title={<Translate id="STATUS" />}
                                dataIndex="status"
                                render={(k, i) => {
                                    return paymentStatusList &&
                                        Array.isArray(paymentStatusList) &&
                                        paymentStatusList.length > 0 &&
                                        k
                                        ? paymentStatusList.find(e => e.code === k).name
                                        : "";
                                }} />
                            <Column
                                align="right"
                                className="column-default"
                                title={<Translate id="TOTAL_AMOUNT" />}
                                render={(val, record) => (
                                    <RenderText value={record.orderAmount - record.orderPromoAmount - record.orderPartnerPromoAmount} type="NUMBER_NO_DOT" />
                                )} />
                            <Column
                                align="right"
                                className="column-default"
                                title={<Translate id="PAYMENT_ORDER.PROMOTION_AMOUNT" />}
                                render={(val, record) => (
                                    <RenderText value={record.orderPromoAmount + record.orderPartnerPromoAmount} type="NUMBER_NO_DOT" />
                                )} />
                            <Column
                                align="right"
                                className="column-default"
                                title={<Translate id="PAYMENT_ORDER.ORDER_AMOUNT" />}
                                dataIndex="orderAmount"
                                render={(val, record) => (
                                    <RenderText value={val} type="NUMBER_NO_DOT" />
                                )} />
                            <Column
                                align="right"
                                className="column-default"
                                title={<Translate id="PAYMENT_ORDER.AMOUNT" />}
                                dataIndex="amount"
                                render={(val, record) => (
                                    <RenderText value={val} type="NUMBER_NO_DOT" />
                                )} />
                            <Column
                                align="right"
                                className="column-default"
                                title={<Translate id="PAYMENT_ORDER.AMOUNT_REFUND" />}
                                dataIndex="amountRefund"
                                render={(val, record) => (
                                    <RenderText value={val} type="NUMBER_NO_DOT" />
                                )} />
                            <Column
                                align="right"
                                className="column-default"
                                title={<Translate id="BILL_DETAIL_REFUNDSTATUS" />}
                                dataIndex="refundStatus"
                                render={(val) => val ? <Translate id={`TRANSACTION_REFUND_STATUS.${val}`} /> : ""} />
                            <Column
                                align="right"
                                className="column-default"
                                title={<Translate id="PAYMENT_TRANSACTION_REFUND_CODE" />}
                                dataIndex="refundTransactionCode" />
                            <Column
                                className="column-default"
                                key="machineCode"
                                title={<Translate id="MACHINE_CODE" />}
                                dataIndex="machineCode" />
                            <Column
                                className="column-default"
                                key="partnerTransactionCode"
                                title={<Translate id="PAYMENT_ORDER.PARTNER_TRAS_CODE" />}
                                dataIndex="partnerTransactionCode" />
                            <Column
                                className="column-default"
                                key="locationName"
                                title={<Translate id="LOCATION_NAME" />}
                                dataIndex="locationName" />
                        </Table>
                    )}
                </div>
                {/* Topup  */}
                <Modal
                    title={<strong>
                        Xử lý giao dịch
                    </strong>}
                    textAlign="center"
                    centered={true}
                    visible={isShowTopupModal}
                    onCancel={this.handleCancel}
                    footer={null}
                    maskClosable={false}
                    closable
                    destroyOnClose
                    width={1000}
                >
                    <Fragment>
                        <Card style={{ marginBottom: 10 }}>
                            <Row {...globalProps.row}>
                                <Col {...globalProps.col3}>
                                    <Form.Item
                                        label={"Mã đơn hàng"}
                                    >
                                        <Input disabled={true} value={itemRefund[0] && itemRefund[0].billNumber} />
                                    </Form.Item>
                                    <Form.Item
                                        label={"Số tiền hoàn"}
                                    >
                                        <strong style={{ fontSize: 20, color: "#FF6666" }}>{globalProps.inputNumberVND.formatter(amountRefundState)}</strong>
                                    </Form.Item>
                                </Col>
                            </Row>
                        </Card>
                        <Form ref={this.formRefund} onFinish={(e) => this.onProcess(e)}>
                            <Table
                                {...globalProps.table}
                                dataSource={itemRefund.map((k, i) => {
                                    k.key = i;
                                    k.index = (pageIndex - 1) * pageSize + i + 1;
                                    return k;
                                })}
                                rowSelection={{
                                    type: "checkbox",
                                    //selectedRowKeys: selected,
                                    onChange: (e) => this.onSelect(e),
                                }}
                            >
                                <Column
                                    width={60}
                                    title={<Translate id="INDEX" />}
                                    dataIndex="index" />
                                <Column
                                    {...globalProps.tableRow}
                                    key="productCode"
                                    title={"Mã sản phẩm"}
                                    dataIndex="productCode" />
                                <Column
                                    {...globalProps.tableRow}
                                    key="productName"
                                    title={"Tên sản phẩm"}
                                    dataIndex="productName" />
                                <Column
                                    {...globalProps.tableRow}
                                    key="quantity"
                                    title={"Số lượng"}
                                    dataIndex="quantity" />
                                <Column
                                    align="right"
                                    className="column-default"
                                    title={"Đơn giá bán"}
                                    dataIndex="amount"
                                    render={(val, record) => (
                                        <RenderText value={val} type="NUMBER_NO_DOT" />
                                    )} />
                                <Column
                                    align="right"
                                    className="column-default"
                                    title={"Số tiền hoàn"}
                                    dataIndex="temporaryRevenue" // giá này là Final price khác vs price khi có khuyến mãi
                                    render={(val, record) => (
                                        <RenderText value={val} type="NUMBER_NO_DOT" />
                                    )} />
                                <Column
                                    className="column-default"
                                    title={"Lý do hoàn tiền"}
                                    dataIndex="reasonRefund"
                                    render={(val, record) => {
                                        return (
                                            <Form.Item
                                                style={{ marginBottom: 0 }}
                                                name={["itemRefund", record.key, "reasonRefund"]}
                                                rules={[
                                                    ({ getFieldValue }) => ({
                                                        validator(_, value) {
                                                            let isValid = false;
                                                            if (selectIndexList.length > 0 && selectIndexList.includes(record.key)) {
                                                                if (value != null) {
                                                                    isValid = true;
                                                                } else {
                                                                    isValid = false;
                                                                }
                                                            } else {
                                                                isValid = true;
                                                            }
                                                            if (isValid) {
                                                                return Promise.resolve();
                                                            }
                                                            return Promise.reject(
                                                                new Error("Yêu cầu chọn!")
                                                            );
                                                        },
                                                    }),
                                                ]}
                                            >
                                                <Select
                                                    onChange={(e) => {
                                                        this.onRowChange(record.key, "reasonRefund", e);
                                                    }}
                                                >
                                                    {listResourceSetting.map((e, i) => {
                                                        return (
                                                            <Option key={i} value={e.code}>
                                                                {e.name}
                                                            </Option>
                                                        );
                                                    })}
                                                </Select>
                                            </Form.Item>
                                        );
                                    }} />
                                <Column
                                    className="column-default"
                                    title={"Ghi chú"}
                                    dataIndex="refundNote"
                                    render={(val, record) => {
                                        return (
                                            <Form.Item
                                                {...globalProps.formItem}
                                                name={["itemRefund", record.key, "refundNote"]}
                                                rules={[
                                                    ({ getFieldValue }) => ({
                                                        validator(_, value) {
                                                            let isValid = false;
                                                            if (selectIndexList.length > 0 && selectIndexList.includes(record.key)) {
                                                                if (value != null) {
                                                                    isValid = true;
                                                                } else {
                                                                    isValid = false;
                                                                }
                                                            } else {
                                                                isValid = true;
                                                            }
                                                            if (isValid) {
                                                                return Promise.resolve();
                                                            }
                                                            return Promise.reject(
                                                                new Error("Yêu cầu điền!")
                                                            );
                                                        },
                                                    }),
                                                ]}
                                            >
                                                <TextArea rows={2} onChange={(e) => {
                                                    this.onRowChange(record.key, "refundNote", e.target.value);
                                                }}
                                                    style={{ width: "100%" }} />
                                            </Form.Item>
                                        );
                                    }} />
                            </Table>
                            <div style={{ textAlign: "center" }}>
                                <Space size="small" className="main-btn-topup">
                                    <Button
                                        type="primary"
                                        className="custom-btn-primary"
                                        htmlType="submit"
                                    >
                                        <Translate id="PROCESS" />
                                    </Button>
                                    <Button onClick={this.handleCancel}>
                                        <Translate id="CLOSE" />
                                    </Button>
                                </Space>
                            </div></Form>
                    </Fragment>
                </Modal>

            </React.Fragment>
        );
    }
}
