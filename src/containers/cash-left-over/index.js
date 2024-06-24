import React, { Component } from "react";
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Translate, withLocalize } from "react-localize-redux";
import { Table, PageHeader, Row, Col, Button, Form, Select, Card, Input, Modal, InputNumber, DatePicker, TimePicker, Space, Radio, Collapse, Tag, Tooltip, Statistic } from 'antd';
import { globalProps, isAllow, PERMISSION, rules, RenderText } from "../../data";
import { cashLeftOverActions } from "../../actions";
import moment from "moment";
import { SearchOutlined } from '@ant-design/icons';
import { BILL_TYPE } from "../../constants";
import helper from "../../helper/string.helper";
import validatorHelper from "../../helper/validator.helper";
const { Column } = Table;
const { Option } = Select;
const { TextArea } = Input;

class CashLeftOver extends Component {
  state = {
    showAdvance: false,
    searchBody: {},

    isShowCharityModal: false,
    charityFundId: 0,

    isShowTopupModal: false,
    itemCash: {},
    itemProvider: {},
    lstProcess: [],
    paginate: {
      pageIndex: 1,
      pageSize: 10,
    },
    exportReport: { loading: false },
    sort: {},

    isShowTopupBankModal: false,
    isPolicyTopupBankModal: false,
    itemTopupBank: {},
  }
  form = React.createRef();
  formCash = React.createRef();
  formTopupBank = React.createRef();

  toggleAdvanceSearch() {
    this.setState({
      showAdvance: !this.state.showAdvance,
    });
    this.onReset();
  }

  componentDidMount() {
    this.props.init();
  }

  componentDidUpdate(prevProps) {
    let { fromDate, toDate, fromTime, toTime } = this.props;
    if (fromDate && prevProps.fromDate !== fromDate) {
      this.form.current.setFieldsValue({
        fromDate: moment(fromDate)
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

    if (prevProps.paging.pageSizeDefault !== this.props.paging.pageSizeDefault) {
      this.changePaginate({ pageSize: this.props.paging.pageSizeDefault, pageIndex: this.state.paginate.pageIndex })
    }
  }

  onGetSearchBody() {
    let body = { ...this.form.current.getFieldsValue() };
    if (body.fromDate) {
      let dateFromFormat = body.fromDate.format('YYYY-MM-DD');
      let timeFromFormat = '';

      if (body.fromTime) {
        timeFromFormat = body.fromTime.format('HH:mm:ss');
      }
      if (timeFromFormat === '') {
        timeFromFormat = '00:00:00';
      }
      let date = moment(`${dateFromFormat} ${timeFromFormat}`);

      body.fromDate = date.format("YYYY-MM-DDTHH:mm:ss");
    }

    if (body.toDate) {
      let toDateFormat = body.toDate.format('YYYY-MM-DD');
      let timeToFormat = '';

      if (body.toTime) {
        timeToFormat = body.toTime.format('HH:mm:ss');
      }

      if (timeToFormat === '') {
        timeToFormat = '23:59:59';
      }

      let date = moment(`${toDateFormat} ${timeToFormat}`);
      body.toDate = date.format("YYYY-MM-DDTHH:mm:ss");
    }

    return body;
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
      let searchBody = this.onGetSearchBody();
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
    this.setState({ exportReport: { loading: true } });

    exportExcel({ data })
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


  showTopupModal(record) {
    record.isShowUnknow = false;
    this.setState({
      itemCash: record,
      isShowTopupModal: true,
      lstProcess: [],
    });
  };

  handleCancel = () => {
    // TH có tiền dư từ giao dịch trước
    let { itemCash } = this.state;
    let { translate } = this.props;
    if (itemCash && itemCash.isShowUnknow) {
      let modal = Modal.confirm({
        title: translate("TITLE_NOTIFICATION"),
        centered: true,
        content: translate("HAS_BALANCE_CASH_NOT_YET_HANLDE"),
        okText: translate("HANLDE_LATER"),
        cancelText: translate("CONTINUE_HANLDE"),
        onOk: () => {
          modal.destroy();
          this.confirmUnknow();
        },
        onCancel: () => {
          modal.destroy();
        },
      });
    } else {
      this.setState({
        isShowTopupModal: false
      });
    }
  };

  onFinish = () => {

  };
  onFinishFailed = () => {

  };

  onChangePhone(e) {
    let start = e.target.value.substr(0, 3);
    if (start.length === 3) {
      let { providerList } = this.props;
      let tel = providerList.find(k => k.prefixNumbers.split(',').includes(start));
      if (tel) {
        this.formCash.current.setFieldsValue({
          providerMobile: tel.code,
        });
        this.setState({
          itemProvider: tel
        });
      } else {
        this.setState({
          itemProvider: null
        });
      }
    }
  }

  onChangeProvider(e) {
    let { providerList } = this.props;
    let tel = providerList.find(k => k.code === e);
    if (tel) {
      this.formCash.current.setFieldsValue({
        providerMobile: tel.code,
      });
      this.setState({
        itemProvider: tel
      });
    } else {
      this.setState({
        itemProvider: null
      });
    }
  }

  onTopupToro() {
    let { translate } = this.props;
    let formCashCurrent = { ...this.formCash.current };
    formCashCurrent.validateFields().then(cash => {
      let modal = Modal.confirm({
        title: translate("TITLE_NOTIFICATION"),
        centered: true,
        content: (
          <div>
            <label>{translate("ARE_YOU_SURE_YOU_WANT_TORO", { phone: cash.phone })}</label>
            <p>{translate("SYSTEM_WILL_AUTOMATICALLY_CREATE_ACCOUNT")}</p>
          </div>
        ),
        okText: translate("CONFIRM"),
        cancelText: translate("CLOSE"),
        onOk: () => {
          modal.destroy();
          this.confirmTopupToro(cash);
        },
        onCancel: () => {
          modal.destroy();
        },
      });
    }).catch(errorInfo => { console.log(errorInfo); })
  }

  confirmTopupToro(cash) {
    let { itemProvider, itemCash } = this.state;
    let { process } = this.props;
    let data = {
      transactionCode: itemCash.cashLeftOverCode,
      parentTransactionCode: itemCash.originTransactionCode,
      parentTransactionType: itemCash.originTransactionType,
      machineCode: itemCash.machineCode,
      topupAmount: cash.amount,
      remainAmount: cash.amount,
      billType: BILL_TYPE.TOPUP_TORO,
      userName: cash.name,
      phoneNumber: cash.phone,
      note: cash.note,
      masterCharityFundId: null,
      provider: itemProvider.code,
      vendor: itemProvider.partner,
    };
    this.setState({
      isShowTopupModal: false,
    });
    process({ data }).finally(() => {
      this.onSearch();
    });
  }

  onUnknow() {
    let { translate } = this.props;
    let modal = Modal.confirm({
      title: translate("TITLE_NOTIFICATION"),
      centered: true,
      content: translate("ARE_YOU_SURE_YOU_PROCESS"),
      okText: translate("CONFIRM"),
      cancelText: translate("CLOSE"),
      onOk: () => {
        modal.destroy();
        this.confirmUnknow();
      },
      onCancel: () => {
        modal.destroy();
      },
    });
  }

  confirmUnknow() {
    let { itemCash } = this.state;
    let { process } = this.props;
    let data = {
      transactionCode: itemCash.cashLeftOverCode,
      parentTransactionCode: itemCash.originTransactionCode,
      parentTransactionType: itemCash.originTransactionType,
      machineCode: itemCash.machineCode,
      topupAmount: itemCash.amount,
      remainAmount: itemCash.amount,
      billType: BILL_TYPE.UNKNOW,
      userName: null,
      phoneNumber: null,
      note: null,
      masterCharityFundId: null,
      provider: null,
    };
    this.setState({
      isShowTopupModal: false,
    });
    process({ data }).finally(() => {
      this.onSearch();
    });
  }

  onTopupPhone() {
    let formCashCurrent = { ...this.formCash.current };
    formCashCurrent.validateFields().then(cash => {
      this.confirmTopupPhone(cash);
    }).catch(errorInfo => { console.log(errorInfo); })
  }

  confirmTopupPhone(cash) {
    let { translate, process } = this.props;
    let { itemProvider, itemCash } = this.state;
    if (Number(cash.amount) < Number(itemProvider.minValue)) {
      const modal = Modal.info();
      modal.update({
        title: translate("TITLE_NOTIFICATION"),
        centered: true,
        content: translate("PROVIDER_NOT_SUPPORT", { amount: helper.numberToString(Number(cash.amount)) }),
        okText: translate("CLOSE"),
        onOk: () => {
          modal.destroy();
        },
      });
    } else {
      // Số chia
      var divisor = Number(cash.amount);
      // Số bị chia
      var dividend = Number(itemProvider.multiplier);
      if (divisor % dividend === 0) {
        let data = {
          transactionCode: itemCash.cashLeftOverCode,
          parentTransactionCode: itemCash.originTransactionCode,
          parentTransactionType: itemCash.originTransactionType,
          machineCode: itemCash.machineCode,
          topupAmount: cash.amount,
          remainAmount: cash.amount,
          billType: BILL_TYPE.TOPUP_PHONE,
          userName: cash.name,
          phoneNumber: cash.phone,
          note: cash.note,
          masterCharityFundId: null,
          provider: itemProvider.code,
          vendor: itemProvider.partner,
        };

        let modal = Modal.confirm({
          title: translate("TITLE_NOTIFICATION"),
          centered: true,
          content: (
            <div>
              <label>{translate("ARE_YOU_SURE_YOU_WANT_PHONE", { amount: helper.numberToString(Number(cash.amount)), phone: cash.phone })}</label>
            </div>
          ),
          okText: translate("CONFIRM"),
          cancelText: translate("CLOSE"),
          onOk: () => {
            modal.destroy();
            this.setState({
              isShowTopupModal: false,
            });
            process({ data }).finally(() => {
              this.onSearch();
            });
          },
          onCancel: () => {
            modal.destroy();
          },
        });
      } else {
        // kết quả chia
        var quotient = Math.floor(divisor / dividend);
        // Tiền dư 
        var remainder = divisor % dividend;
        // Tiền nạp phone
        var amount = quotient * dividend;
        let data = {
          transactionCode: itemCash.cashLeftOverCode,
          parentTransactionCode: itemCash.originTransactionCode,
          parentTransactionType: itemCash.originTransactionType,
          machineCode: itemCash.machineCode,
          topupAmount: amount,
          remainAmount: divisor,
          billType: BILL_TYPE.TOPUP_PHONE,
          userName: cash.name,
          phoneNumber: cash.phone,
          note: cash.note,
          masterCharityFundId: null,
          provider: itemProvider.code,
          vendor: itemProvider.partner,
        };
        let modal = Modal.confirm({
          title: translate("TITLE_NOTIFICATION"),
          centered: true,
          content: (
            <div>
              <p>{translate("THE_SYSTEM_ONLY_TOPS_UP_THE_AMOUNT_MULTIPLE", { multipler: helper.numberToString(Number(dividend)) })}</p>
              <p>{translate("YOUR_BALANCE_CASH", { divisor: helper.numberToString(Number(cash.amount)) })}</p>
              <p>{translate("SYSTEM_WILL_TOP_UP_THE_AMOUNT_OF_MONEY_LEFT_OVER_CAN_USED_MAKE_OTHER_TRANSACTION", { amount: helper.numberToString(Number(amount)), remainder: helper.numberToString(Number(remainder)) })}</p>
            </div>
          ),
          okText: translate("CONFIRM"),
          cancelText: translate("CLOSE"),
          onOk: () => {
            modal.destroy();
            this.setState({
              isShowTopupModal: false,
            });
            process({ data }).then((res) => {
              console.log("res", res);
              if (res.resultCode === "SUCCESS") {
                itemCash.amount = remainder;
                itemCash.isShowUnknow = true;
                itemCash.cashLeftOverCode = helper.makeUUID(32);
                itemCash.originTransactionCode = res.data.billNumber;
                itemCash.originTransactionType = res.data.billType;
                this.setState({
                  itemCash: itemCash,
                  isShowTopupModal: true,
                });
              } else {
                this.setState({
                  itemCash: {},
                  isShowTopupModal: false,
                });
              }
            });
          },
          onCancel: () => {
            modal.destroy();
          },
        });
      }
    }
  }

  onTopupCharity() {
    this.setState({
      isShowTopupModal: false,
      isShowCharityModal: true,
      charityFundId: null
    })
  }

  onOkCharity = () => {
    let { charityFundId } = this.state;
    let { translate } = this.props;
    if (!charityFundId) {
      let modal = Modal.info({
        icon: undefined,
        centered: true,
        content: translate("REQUEST_CHOSEN_CHARITY"),
        okText: translate("CLOSE"),
        onOk: () => {
          modal.destroy();
        },
      });
    } else {
      let modal = Modal.confirm({
        icon: undefined,
        centered: true,
        content: translate("ARE_YOU_SURE_YOU_WANT_CHARITY"),
        okText: translate("CONFIRM"),
        cancelText: translate("CLOSE"),
        onOk: () => {
          modal.destroy();
          this.confirmCharity();
        },
        onCancel: () => {
          modal.destroy();
        },
      });
    }
  }

  confirmCharity() {
    let { itemCash, charityFundId } = this.state;
    let { process } = this.props;
    let data = {
      transactionCode: itemCash.cashLeftOverCode,
      parentTransactionCode: itemCash.originTransactionCode,
      parentTransactionType: itemCash.originTransactionType,
      machineCode: itemCash.machineCode,
      topupAmount: itemCash.amount,
      remainAmount: itemCash.amount,
      billType: BILL_TYPE.TOPUP_CHARITY_FUND,
      userName: itemCash.name,
      phoneNumber: itemCash.phone,
      note: itemCash.note,
      masterCharityFundId: charityFundId,
      provider: null,
    };
    this.setState({
      isShowCharityModal: false
    });
    process({ data }).finally(() => {
      this.onSearch();
    });
  }

  onCancelCharity = () => {
    // TH cancel mà có tiền dư từ giao dịch trc
    let { itemCash } = this.state;
    if (itemCash && itemCash.isShowUnknow) {
      this.setState({
        isShowCharityModal: false,
        isShowTopupModal: true,
        charityFundId: null
      })
    } else {
      this.setState({
        isShowCharityModal: false,
        isShowTopupModal: false,
        charityFundId: null
      })
    }
  }

  // start topup bank
  onOpenTopupBank(e) {
    let { getBankList } = this.props;
    getBankList({});
    let formCashCurrent = { ...this.formCash.current };
    let item = formCashCurrent.getFieldsValue();
    let temp = {
      cashLeftOverCode: item.cashLeftOverCode,
      phone: item.phone,
      amount: item.amount,
    }
    this.setState({
      isShowTopupBankModal: true,
      // isShowTopupModal: false,
      itemTopupBank: temp
    })
  }
  onConfirmTopupBank() {
    let formTopupBankCurrent = { ...this.formTopupBank.current };
    formTopupBankCurrent.validateFields().then(bank => {
      this.confirmTopupBank(bank);
    }).catch(errorInfo => { console.log(errorInfo); })
  }

  confirmTopupBank(bank) {
    let { process } = this.props;
    let { itemCash } = this.state;
    let data = {};
    let bankDto = {};
    let transfer247Dto = {};
    data.machineCode = itemCash.machineCode;
    data.companyId = itemCash.companyId;
    data.billType = BILL_TYPE.TOPUP_BANK;
    data.transactionCode = bank.cashLeftOverCode;
    data.userName = bank.bankAccountName.toUpperCase();
    data.phoneNumber = bank.phone;
    data.parentTransactionCode = itemCash.originTransactionCode;
    data.parentTransactionType = itemCash.originTransactionType;
    data.toTransactionCode = itemCash.processTransactionCode;
    data.toTransactionType = itemCash.processTransactionType;
    data.remainAmount = bank.amount;
    data.topupAmount = bank.amount;
    transfer247Dto.type247 = "Account";
    bankDto.transfer247 = transfer247Dto;
    bankDto.bankCode = bank.bankCode;
    bankDto.bankAccount = bank.bankAccount;
    bankDto.bankAccountName = bank.bankAccountName.toUpperCase();
    bankDto.phone = bank.phone;
    bankDto.typeTransfer = "TRANSFER_247";
    data.topupBank = bankDto;
    process({ data }).finally(() => {
      this.onSearch();
    });
    this.setState({
      isShowTopupBankModal: false,
      isShowTopupModal: false,
    });
  }

  onCloseTopupBank = () => {
    this.setState({
      isShowTopupBankModal: false
    })
  }

  onOpenPolicy() {
    this.setState({
      isPolicyTopupBankModal: true
    })
  }

  onClosePolicy = () => {
    this.setState({
      isPolicyTopupBankModal: false
    })
  }
  // end topup bank


  render() {
    let { machines, bankList, providerList, charityList, locations, cashLeftOver, fromDate, toDate, fromTime, toTime, paging, translate } = this.props;
    let { searchBody, paginate, showAdvance, itemCash, itemTopupBank, isShowTopupModal, isShowCharityModal, isShowTopupBankModal, isPolicyTopupBankModal } = this.state;
    console.log(cashLeftOver);
    return (
      <React.Fragment>
        <PageHeader
          title={<Translate id="CASH_LEFT_OVER_HEADER" />}
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
            onFinish={e => this.onSearch()}
            {...globalProps.form}
            ref={this.form}
          >
            <Row {...globalProps.row}>
              {/* Máy */}
              <Col {...globalProps.col}>
                <Form.Item {...globalProps.formItem}
                  label={<Translate id="MACHINE" />}
                  name="vendingIds"
                >
                  <Select {...globalProps.selectSearch} allowClear mode="multiple">
                    {machines.map((k, i) =>
                      <Option value={k.id} key={i}>{`${k.code} - ${k.name}`}</Option>
                    )}
                  </Select>
                </Form.Item>
              </Col>
              <Col {...globalProps.col}>
                <Input.Group size="large">
                  <Row gutter={8}>
                    <Col style={{ width: '50%' }}>
                      <Form.Item {...globalProps.formItem}
                        label={<Translate id="DATE_FROM" />}
                        name="fromDate"
                        initialValue={moment(fromDate)}
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
                        name="fromTime"
                        initialValue={moment(fromTime, "HH:mm:ss")}
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
                        name="toDate"
                        style={{ width: '100%' }}
                        initialValue={moment(toDate)}
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
                        name="toTime"
                        initialValue={moment(toTime, "HH:mm:ss")}
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
                <Form.Item {...globalProps.formItem}
                  label={<Translate id="CASH_LEFT_OVER_CODE" />}
                  name="cashLeftOverCode"
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col {...globalProps.col}>
                <Form.Item {...globalProps.formItem}
                  label={<Translate id="ORIGIN_TRANSACTION_CODE" />}
                  name="originTransactionCode"
                >
                  <Input />
                </Form.Item>
              </Col>
              {/* <Col {...globalProps.col}>
                <Form.Item {...globalProps.formItem}
                  label={<Translate id="PROCESS_TRANSACTION_CODE" />}
                  name="processTransactionCode"
                >
                  <Input />
                </Form.Item>
              </Col> */}
              <Col {...globalProps.col}>
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
            </Row>
            {showAdvance ?
              <Row {...globalProps.row}>
                <Col {...globalProps.col}>
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
                {/* <Col {...globalProps.col}>
                  <Form.Item {...globalProps.formItem}
                    label={<Translate id="STATUS" />}
                    name="status"
                  >
                    <Select {...globalProps.selectSearch} allowClear mode="multiple">
                      {statusList.map((k, i) =>
                        <Option value={k.id} key={i}>{`${k.name}`}</Option>
                      )}
                    </Select>
                  </Form.Item>
                </Col> */}
              </Row>
              : ""}
            {isAllow(PERMISSION.CASH_LEFT_OVER.INDEX) &&
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
                {/* <Button type="primary" size="large"
                    className="custom-btn-primary"
                    loading={exportReport.loading} onClick={() => this.onExport()}>
                    <Translate id="EXPORT_EXCEL" />
                  </Button> */}
              </Space>
            }
          </Form>
        </Card>

        <Collapse
          style={globalProps.panel}
          expandIconPosition="right"
          defaultActiveKey={[0]}
        >
          <Collapse.Panel header={<strong><Translate id="SUMMARY" /></strong>} >
            <Tag style={{ padding: 10, margin: 8, background: "#FFF" }}>
              <Statistic
                title={
                  <Tooltip title={<Translate id={"TOTAL_TRANSACTION"} />}>
                    <strong><Translate id={"TOTAL_TRANSACTION"} /></strong>
                  </Tooltip>
                }
                value={cashLeftOver.totalItem}
                valueRender={e => <strong style={{ color: "#878BB6" }}>{e}</strong>}
              />
            </Tag>
            <Tag style={{ padding: 10, margin: 8, background: "#FFF" }}>
              <Statistic
                title={
                  <Tooltip title={<Translate id={"TOTAL_AMOUNT"} />}>
                    <strong><Translate id={"TOTAL_AMOUNT"} /></strong>
                  </Tooltip>
                }
                value={cashLeftOver.totalAmount}
                valueRender={e => <strong style={{ color: "#4ACAB4" }}>{e}</strong>}
              />
            </Tag>
          </Collapse.Panel>
        </Collapse>

        <div className="card-container">
          {isAllow(PERMISSION.CASH_LEFT_OVER.INDEX) &&
            <Table
              {...globalProps.table}
              dataSource={cashLeftOver.cashLeftOverList.map((k, i) => ({ ...k, index: i + 1, key: i }))}
              onChange={this.changePaginate}
              pagination={
                {
                  pageSize: paginate.pageSize,
                  total: cashLeftOver.totalItem,
                  current: paginate.pageIndex,
                  showSizeChanger: true,
                  pageSizeOptions: paging.pageSizes,
                  locale: { items_per_page: "" },
                  showTotal: sum => <div>{sum} <Translate id="RESULT" /></div>
                }
              }
            >
              <Column width={60} title={<Translate id="INDEX" />} dataIndex="index" />
              {isAllow(PERMISSION.CASH_LEFT_OVER.PROCESS) && (
                <Column {...globalProps.tableRow} dataIndex="id" width={60}
                  render={(val, record) =>
                    <Button size="large" className="custom-btn-primary" type="primary" onClick={() => this.showTopupModal(record)}>
                      <span>
                        <Translate id="PROCESS" />
                      </span>
                    </Button>
                  }
                />
              )}
              < Column {...globalProps.tableRow} key="cashLeftOverCode" title={<Translate id="CASH_LEFT_OVER_CODE" />} dataIndex="cashLeftOverCode" />
              <Column {...globalProps.tableRow} key="status" title={<Translate id="STATUS" />} dataIndex="status" render={val => val ? <Translate id={`CASH_LEFT_OVER_STATUS.${val}`} /> : ""} />
              {/* <Column {...globalProps.tableRow} key="processTransactionCode" title={<Translate id="PROCESS_TRANSACTION_CODE" />} dataIndex="processTransactionCode" />
              <Column {...globalProps.tableRow} key="processTransactionType" title={<Translate id="PROCESS_TRANSACTION_TYPE" />} dataIndex="processTransactionType"
                render={val => val ? <Translate id={`CASH_LEFT_OVER_TYPE.${val}`} /> : ""} /> */}
              <Column {...globalProps.tableRow} key="updateTime" title={<Translate id="TIME" />} dataIndex="updateTime" />
              <Column align="right" {...globalProps.tableRow} key="amount" title={<Translate id="AMOUNT" />} dataIndex="amount" render={val => <RenderText value={val} type="NUMBER_NO_DOT" />} />
              <Column {...globalProps.tableRow} key="fullName" title={<Translate id="FULL_NAME" />} dataIndex="fullName" />
              <Column {...globalProps.tableRow} key="phoneNumber" title={<Translate id="PHONE_NUMBER" />} dataIndex="phoneNumber" />
              <Column {...globalProps.tableRow} key="machineCode" title={<Translate id="MACHINE_CODE" />} dataIndex="machineCode" />
              {/* <Column {...globalProps.tableRow} key="note" title={<Translate id="PROCESS_NOTE" />} dataIndex="note" /> */}
              <Column {...globalProps.tableRow} key="locationName" title={<Translate id="LOCATION" />} dataIndex="locationName" />
              <Column {...globalProps.tableRow} key="originTransactionCode" title={<Translate id="ORIGIN_TRANSACTION_CODE" />} dataIndex="originTransactionCode" />
              <Column {...globalProps.tableRow} key="originTransactionType" title={<Translate id="ORIGIN_TRANSACTION_TYPE" />} dataIndex="originTransactionType"
                render={val => val ? <Translate id={`CASH_LEFT_OVER_TYPE.${val}`} /> : ""} />
            </Table>
          }
        </div>

        <Modal
          title={<Translate id="CHOOSE_HOW_TO_USE_AN_UNDERSTANDED_REFUND" />}
          textAlign="center"
          centered={true}
          visible={isShowTopupModal}
          onCancel={this.handleCancel}
          maskClosable={false}
          footer={null}
          closable
          destroyOnClose
        >
          <Form
            id="topup"
            name="topup"
            labelAlign="left"
            layout="horizontal"
            scrollToFirstError={true}
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 18 }}
            initialValues={itemCash}
            ref={this.formCash}
            key={itemCash.amount}
            width={600}
          >
            <Form.Item
              label={<Translate id="CASH_LEFT_OVER_CODE" />}
              name="cashLeftOverCode"
            >
              <Input disabled />
            </Form.Item>
            <Form.Item
              label={<Translate id="NAME" />}
              name="name"
            >
              <Input />
            </Form.Item>
            <Form.Item
              label={<Translate id="PHONE_NUMBER" />}
              name="phone"
              rules={[
                {
                  required: true,
                  message: <Translate id="REQUIRED_INFORMATION" />,
                },
                {
                  validator: (rules, value) => {
                    if (validatorHelper.isPhoneNumber(value)) {
                      return Promise.resolve()
                    } else {
                      if (value) {
                        return Promise.reject(<Translate id="INVALID_PHONE" />);
                      }
                      return Promise.reject();
                    }
                  }
                }
              ]}
            >
              <Input type="tel" onChange={e => this.onChangePhone(e)} />
            </Form.Item>

            <Form.Item
              label={<Translate id="PROVIDER" />}
              name="providerMobile"
              rules={[{
                required: true,
                message: <Translate id="REQUIRED_INFORMATION" />
              }]}
            >
              <Select size="large" onChange={e => this.onChangeProvider(e)}>
                {providerList &&
                  (
                    providerList.map((k, i) =>
                      <Option value={k.code} key={i} >{k.name}</Option>
                    )
                  )
                }
              </Select>
            </Form.Item>
            <Form.Item
              label={<Translate id="REFUND_AMOUNT" />}
              name="amount"
            >
              <InputNumber {...globalProps.inputNumber} disabled={true} style={{ width: "100%" }} />
            </Form.Item>
            <Form.Item
              label={<Translate id="NOTE" />}
              name="note"
              rules={[{
                required: true,
                message: <Translate id="REQUIRED_INFORMATION" />
              }]}
            >
              <TextArea autoSize={{ minRows: 3, maxRows: 5 }} style={{ width: "100%" }} />
            </Form.Item>
            <div style={{ textAlign: "center" }}>
              <Space size="small" className="main-btn-topup">
                <Button type="primary"
                  className="custom-btn-primary" onClick={(e) => this.onTopupToro(e)}>
                  <Translate id="TOPUP_TORO" />
                </Button>
                {
                  itemCash.isShowUnknow && (
                    <Button type="primary"
                      className="custom-btn-primary" onClick={(e) => this.onUnknow(e)}>
                      <Translate id="NO_PROCESS" />
                    </Button>
                  )
                }
                {
                  providerList && providerList.find(x => x.minValue <= itemCash.amount) && (
                    <Button type="primary"
                      className="custom-btn-primary" onClick={(e) => this.onTopupPhone()}>
                      <Translate id="TOPUP_PHONE" />
                    </Button>
                  )
                }

                <Button type="primary"
                  className="custom-btn-primary" onClick={(e) => this.onOpenTopupBank(e)}>
                  <Translate id="TOPUP_BANK" />
                </Button>

                {/* <Button type="primary"
                  className="custom-btn-primary" onClick={(e) => this.onTopupCharity()}>
                  <Translate id="CHARITABLE_CONTRIBUTIONS" />
                </Button> */}

                <Button onClick={this.handleCancel}>
                  <Translate id="CLOSE" />
                </Button>

              </Space>
            </div>
          </Form>
        </Modal>

        {/* Modal quỹ từ thiện */}
        <Modal
          title={<Translate id="CHOOSE_CHARITY_FUNDS" />}
          textAlign="center"
          centered={true}
          visible={isShowCharityModal}
          onOk={this.onOkCharity}
          onCancel={this.onCancelCharity}
          okText={<Translate id="CONFIRM" />}
          cancelText={<Translate id="CLOSE" />}
          closable
          destroyOnClose
        >
          {
            charityList && (
              <Table
                {...globalProps.table}
                className="d-table"
                dataSource={charityList.map((k, i) => ({ ...k, index: i + 1, key: i }))}
              >
                <Column {...globalProps.tableRow} title={<Translate id="INDEX" />} dataIndex="index" width={60} />
                <Column {...globalProps.tableRow} title={<Translate id="CHOOSE" />} dataIndex="id"
                  render={(val, record) =>
                    <Radio
                      style={{ height: 40, width: 40 }}
                      checked={this.state.charityFundId === record.id}
                      onChange={e => this.setState({ charityFundId: record.id })}
                    >
                    </Radio>
                  }
                />
                <Column {...globalProps.tableRow} title={<Translate id="FUND_NAME" />} dataIndex="name" />
              </Table>
            )
          }
        </Modal>

        {/* Topup bank */}
        <Modal
          title={<strong><Translate id="TRANS_TOPUP_BANK.TITLE_TOP_UP_BANK" /></strong>}
          textAlign="center"
          centered={true}
          visible={isShowTopupBankModal}
          onCancel={this.onCloseTopupBank}
          footer={null}
          maskClosable={false}
          closable
          destroyOnClose
        >
          <div className="main-topup-bank">
            <Form
              id="topup-bank"
              name="topup-bank"
              labelAlign="left"
              layout="horizontal"
              scrollToFirstError={true}
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 16 }}
              initialValues={itemTopupBank}
              key={itemTopupBank.cashLeftOverCode}
              ref={this.formTopupBank}
            >
              {/* Mã giao dịch */}
              <Form.Item
                label={<Translate id="CASH_LEFT_OVER_CODE" />}
                name="cashLeftOverCode"
              >
                <Input disabled />
              </Form.Item>
              {/* Ngân hàng */}
              <Form.Item
                label={<Translate id="TRANS_TOPUP_BANK.BANK" />}
                name="bankCode"
                rules={[{
                  required: true,
                  message: <Translate id="REQUIRED_INFORMATION" />
                }]}
              >
                <Select size="large" allowClear showSearch
                  optionFilterProp="children" >
                  {bankList.map((k, i) =>
                    <Option value={k.code} key={i} >{k.shortName}</Option>
                  )}
                </Select>
              </Form.Item>

              {/* Số tài khoản */}
              <Form.Item
                label={<Translate id="TRANS_TOPUP_BANK.BANK_ACCOUNT" />}
                name="bankAccount"
                rules={[
                  {
                    required: true,
                    message: <Translate id="REQUIRED_INFORMATION" />
                  },
                  {
                    validator: (rules, value) => {
                      if (validatorHelper.isOnlyNumber(value)) {
                        return Promise.resolve()
                      } else {
                        if (value) {
                          return Promise.reject(<Translate id="ONLY_NUMER" />);
                        }
                        return Promise.reject();
                      }
                    }
                  }
                ]}
              >
                <Input type="tel" />
              </Form.Item>

              {/* Chủ tài khoản */}
              <Form.Item
                label={<Translate id="TRANS_TOPUP_BANK.BANK_ACCOUNT_NAME" />}
                name="bankAccountName"
                rules={[{
                  required: true,
                  message: <Translate id="REQUIRED_INFORMATION" />
                }]}
              >
                <Input className="bank-account-name" type="text" />
              </Form.Item>

              {/* Số điện thoại */}
              <Form.Item
                label={<Translate id="TRANS_TOPUP_BANK.PHONE_NUMBER" />}
                name="phone"
                rules={[
                  {
                    required: true,
                    message: <Translate id="REQUIRED_INFORMATION" />,
                  },
                  {
                    validator: (rules, value) => {
                      if (validatorHelper.isPhoneNumber(value)) {
                        return Promise.resolve()
                      } else {
                        if (value) {
                          return Promise.reject(<Translate id="INVALID_PHONE" />);
                        }
                        return Promise.reject();
                      }
                    }
                  }
                ]}
              >
                <Input type="tel" />
              </Form.Item>

              {/* Số tiền */}
              <Form.Item
                label={<Translate id="TRANS_TOPUP_BANK.AMOUNT" />}
                name="amount"
                rules={[{
                  required: true,
                  message: <Translate id="REQUIRED_INFORMATION" />
                }]}
              >
                <InputNumber {...globalProps.inputNumberMoney} disabled={true} style={{ width: "100%" }} />
              </Form.Item>

              {/* Ghi chú */}
              <Form.Item
                label={<Translate id="NOTE" />}
                name="note"
                rules={[{
                  required: true,
                  message: <Translate id="REQUIRED_INFORMATION" />
                }]}
              >
                <TextArea autoSize={{ minRows: 3, maxRows: 5 }} style={{ width: "100%" }} />
              </Form.Item>

              {/* <Row>
                <Col span={24}>
                  <div className="default-color-text note-topup-bank">{<Translate id="TRANS_TOPUP_BANK.NOTE_TOPUP_BANK" />}</div>
                  <div className="default-color-text note-topup-bank_1">{<Translate id="TRANS_TOPUP_BANK.NOTE_TOPUP_BANK_1" />}
                    <a
                      className="a-blue"
                      onClick={(e) => this.onOpenPolicy()}
                      rel="noopener">
                      <Translate id="TRANS_TOPUP_BANK.SEE_MORE" />
                    </a>
                  </div>
                </Col>
              </Row> */}

              <Row>
                <Col span={24} flex="auto" style={{ textAlign: "center", marginTop: 20, marginBottom: 20 }}>
                  <Space size="small">
                    <Button type="primary" className="custom-btn-primary" onClick={(e) => this.onConfirmTopupBank(e)}>
                      <Translate id="CONFIRM" />
                    </Button>
                    <Button onClick={this.onCloseTopupBank}>
                      <Translate id="CLOSE" />
                    </Button>
                  </Space>
                </Col>
              </Row>
            </Form>
          </div>
        </Modal >

        {/* Policy topup bank */}
        <Modal
          title={<strong><Translate id="TRANS_TOPUP_BANK.NOTE_TOPUP_BANK" /></strong>}
          textAlign="center"
          centered={true}
          visible={isPolicyTopupBankModal}
          onCancel={this.onClosePolicy}
          footer={[
            <Button key="back" onClick={this.onClosePolicy}>
              <Translate id="CLOSE" />
            </Button>
          ]}
          maskClosable={false}
          closable
          destroyOnClose
        >
          <div>
            <div>1. Quý khách hàng xác nhận rằng, thông tin tài khoản ngân hàng cung cấp cho Kootoro là chính xác và là tài khoản ngân hàng Quý khách hàng mong muốn nhận tiền.</div>
            <br></br>
            <div>2. Kootoro không chịu trách nhiệm và xử lý trong trường hợp Quý khách hàng cung cấp sai thông tin tài khoản ngân hàng nhận tiền.</div>
            <br></br>
            <div>3. Trường hợp Quý khách hàng bỏ qua lựa chọn chuyển tiền vào tài khoản thì các giao dịch tiền dư này sẽ được Kootoro bảo lưu trong thời gian 48 giờ kể từ thời điểm phát sinh giao dịch mua hàng. Sau thời gian này Kootoro sẽ được miễn trừ trách nhiệm xử lý giao dịch tiền dư liên quan.</div>
            <br></br>
            <div>4. Lệnh chuyển tiền sẽ được xử lý trong thời gian 24h từ thời điểm khách hàng gửi yêu cầu chuyển tiền, không bao gồm thứ 7 - chủ nhật và các ngày lễ theo quy định của nhà nước.</div>
          </div>
        </Modal>

      </React.Fragment >
    )
  }
}

const stateToProps = (state) => {
  return {
    machines: state.cashLeftOver.machines,
    bankList: state.cashLeftOver.bankList,
    statusList: state.cashLeftOver.statusList,
    providerList: state.cashLeftOver.providerList,
    charityList: state.cashLeftOver.charityList,
    locations: state.cashLeftOver.locations,
    fromDate: state.cashLeftOver.fromDate,
    toDate: state.cashLeftOver.toDate,
    fromTime: state.cashLeftOver.fromTime,
    toTime: state.cashLeftOver.toTime,
    paging: state.cashLeftOver.paging,
    cashLeftOver: state.cashLeftOver.cashLeftOver
  };
}

const dispatchToProps = (dispatch) => bindActionCreators({
  init: cashLeftOverActions.init,
  search: cashLeftOverActions.search,
  process: cashLeftOverActions.process,
  exportExcel: cashLeftOverActions.exportExcel,
  getBankList: cashLeftOverActions.getBankList,
}, dispatch);

export default connect(stateToProps, dispatchToProps)(withLocalize(CashLeftOver));