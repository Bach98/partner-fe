import React, { Component } from "react";
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Translate, withLocalize } from "react-localize-redux";
import { Table, PageHeader, Row, Col, Tabs, Button, Form, Input, Select, Card, Descriptions, Switch } from 'antd';
// import Map from '../maps';
import Map from '../maps/mapWithCluster';
import { globalProps, stringToASCII, PERMISSION, isAllow } from "../../data";
import { machineActions } from "../../actions";
import { GOOGLE_MAP, LOCAL_PATH } from "../../constants";
import { history } from '../../store';
import {
  EyeFilled,
  SearchOutlined,
} from '@ant-design/icons';
const { Column } = Table;
const { Option } = Select;

const defaultTab = "1";

class Machine extends Component {
  state = {
    showAdvance: false,
    timeFromReadonly: false,
    timeToReadonly: false,
    searchBody: {},
    tab: defaultTab,
    paginate: {
      pageIndex: 1,
      pageSize: 10,
    },
    machineModels: []
  }
  form = React.createRef()

  componentDidMount() {
    this.props.init();
  }

  onSearch(body) {
    this.setState({ searchBody: body, paginate: { ...this.state.paginate, pageIndex: 1 } }, () => {
      this.onFilter();
    });
  }

  componentDidUpdate(prevProps) {
    if (prevProps.machineModels !== this.props.machineModels) {

      let { cityIdDefault } = this.props;

      this.setState({ searchBody: { cityId: cityIdDefault } }, () => {
        this.onFilter();
      });
    }
  }

  onReset() {
    this.setState({
      searchBody: {}
    }, () => {
      this.form.current.resetFields();

      this.cityChange(this.props.cityIdDefault);
    });
  }

  onFilter() {
    let { searchBody } = this.state;
    let { machineModels } = this.props;
    let tempMachines = [...machineModels];
    if (searchBody.machine && searchBody.machine.length) {
      tempMachines = tempMachines.filter(k => searchBody.machine.includes(k.id));
    }

    if (searchBody.location && searchBody.location.length) {
      tempMachines = tempMachines.filter(k => searchBody.location.includes(k.locationId));
    }

    if (searchBody.locationAreaMachines && searchBody.locationAreaMachines.length) {
      tempMachines = tempMachines.filter(k => searchBody.locationAreaMachines.includes(k.locationAreMachineId));
    }

    if (searchBody.statusInternet && searchBody.statusInternet.length) {
      tempMachines = tempMachines.filter(k => searchBody.statusInternet.includes(k.statusInternetCode));
    }

    if (searchBody.statusMaintenance && searchBody.statusMaintenance.length) {
      tempMachines = tempMachines.filter(k => searchBody.statusMaintenance.includes(k.statusMaintenanceCode));
    }

    if (searchBody.address) {
      tempMachines = tempMachines.filter(k => stringToASCII(k.address).indexOf(stringToASCII(searchBody.address)) >= 0);
    }

    if (searchBody.addressTypes) {
      tempMachines = tempMachines.filter(k => searchBody.addressTypes.includes(k.addressType));
    }

    if (searchBody.vendingMachineModels) {
      tempMachines = tempMachines.filter(k => searchBody.vendingMachineModels.includes(k.machineModel));
    }

    if (searchBody.cityId) {
      tempMachines = tempMachines.filter(k => searchBody.cityId === k.cityId);
    }

    if (searchBody.districtId) {
      tempMachines = tempMachines.filter(k => searchBody.districtId === k.districtId);
    }

    if (searchBody.wardId) {
      tempMachines = tempMachines.filter(k => searchBody.wardId === k.wardId);
    }

    this.setState({
      machineModels: tempMachines,
    })
  }

  gotoDetail(machine) {
    this.props.gotoDetail(machine.id);
    history.push(LOCAL_PATH.CATEGORY.MACHINE.DETAIL);
  }

  cityChange(value) {
    this.form.current.setFieldsValue({
      wardId: undefined,
      districtId: undefined,
      address: undefined
    });

    this.props.getDistrict({ data: { cityId: value } });
  }

  districtChange(value) {
    this.form.current.setFieldsValue({
      wardId: undefined,
      address: undefined
    });

    this.props.getWard({ data: { districtId: value } });
  }

  wardChange(value) {
    this.form.current.setFieldsValue({
      address: undefined
    });
  }

  cityClear() {

    this.form.current.setFieldsValue({
      wardId: undefined,
      districtId: undefined,
      address: undefined
    });

  }

  districtClear() {
    this.form.current.setFieldsValue({
      wardId: undefined,
      address: undefined
    });
  }

  wardClear() {
    this.form.current.setFieldsValue({
      address: undefined
    });
  }

  toggleAdvanceSearch() {
    this.setState({
      showAdvance: !this.state.showAdvance,
      timeFromReadonly: false,
      timeToReadonly: false
    });
    this.onReset();
  }

  render() {
    let { machines: propsMachines, translate, addressTypes, cities, districts, vendingMachineModels,
      wards, cityIdDefault, locations, locationAreaMachines, statusMaintenance, statusInternet } = this.props;
    let { searchBody, machineModels, showAdvance } = this.state;
    return (
      <React.Fragment>
        <PageHeader
          title={<Translate id="LOCATION_AND_MACHINE_HEADER" />}
          ghost={false}
        />
        {isAllow(PERMISSION.MACHINE.LIST) &&
          <Card
            title={<strong><Translate id="SEARCH" /></strong>}
            size="small"
            style={{ marginTop: 10 }}
            extra={
              <Switch
                checked={showAdvance}
                checkedChildren={<Translate id="SEARCH_ADVANCE" />}
                unCheckedChildren={<Translate id="SEARCH_BASIC" />}
                onChange={e => this.toggleAdvanceSearch()}
              />
            }
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
                    label={<Translate id="MACHINE" />}
                    name="machine"
                  >
                    <Select {...globalProps.selectSearch} allowClear mode="multiple">
                      {propsMachines.map((k, i) =>
                        <Option value={k.id} key={i}>{`${k.code} - ${k.name}`}</Option>
                      )}
                    </Select>
                  </Form.Item>
                </Col>
                <Col {...globalProps.col}>
                  <Form.Item {...globalProps.formItem}
                    label={<Translate id="LOCATION" />}
                    name="location"
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
                    label={<Translate id="MACHINE_MODEL" />}
                    name="vendingMachineModels"
                  >
                    <Select {...globalProps.selectSearch} allowClear mode="multiple" >
                      {vendingMachineModels.map((k, i) =>
                        <Option value={k.id} key={i}>{`${k.name}`}</Option>
                      )}
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
              {showAdvance ?
                <Row {...globalProps.row}>
                  <Col {...globalProps.col}>
                    <Form.Item {...globalProps.formItem}
                      label={<Translate id="LOCATION_TYPE" />}
                      name="addressTypes"
                    >
                      <Select {...globalProps.selectSearch} allowClear mode="multiple">
                        {addressTypes.map((k, i) =>
                          <Option value={k.code} key={i}>
                            {translate(`ADDRESS_TYPE_${(k.code || "").toUpperCase()}`)}
                          </Option>
                        )}
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col {...globalProps.col}>
                    <Form.Item {...globalProps.formItem}
                      label={<Translate id="LOCATION_AREA" />}
                      name="locationAreaMachines"
                    >
                      <Select {...globalProps.selectSearch} allowClear mode="multiple">
                        {locationAreaMachines.map((k, i) =>
                          <Option value={k.id} key={i}>{`${k.name} - ${k.code}`}</Option>
                        )}
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col {...globalProps.col}>
                    <Form.Item {...globalProps.formItem}
                      label={<Translate id="MANCHINE_STATUS_INTERNET" />}
                      name="statusInternet"
                    >
                      <Select {...globalProps.selectSearch} allowClear mode="multiple">
                        {statusInternet.map((k, i) =>
                          <Option value={k.code} key={i}>
                            <Translate id={k.code} />
                          </Option>
                        )}
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col {...globalProps.col}>
                    <Form.Item {...globalProps.formItem}
                      label={<Translate id="MANCHINE_STATUS_MAINTENANCE" />}
                      name="statusMaintenance"
                    >
                      <Select {...globalProps.selectSearch} allowClear mode="multiple">
                        {statusMaintenance.map((k, i) =>
                          <Option value={k.code} key={i}>
                            <Translate id={k.code} />
                          </Option>
                        )}
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col {...globalProps.col2}>
                    <Form.Item {...globalProps.formItem}
                      label={<Translate id="ADDRESS" />}
                      name="address"
                    >
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col {...globalProps.col}>
                    <Form.Item {...globalProps.formItem}
                      label={<Translate id="CITY" />}
                      name="cityId"
                      initialValue={cityIdDefault}
                    >
                      <Select {...globalProps.selectSearch}
                        allowClear
                        onChange={e => this.cityChange(e)}
                        onClear={() => this.cityClear()}
                      >
                        {cities.map((k, i) =>
                          <Option value={k.id} key={i}>
                            {k.name}
                          </Option>
                        )}
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col {...globalProps.col}>
                    <Form.Item {...globalProps.formItem}
                      label={<Translate id="DISTRICT" />}
                      name="districtId"
                    >
                      <Select
                        {...globalProps.selectSearch}
                        allowClear
                        onChange={e => this.districtChange(e)}
                        onClear={() => this.districtClear()}
                      >
                        {districts.map((k, i) =>
                          <Option value={k.id} key={i}>
                            {k.name}
                          </Option>
                        )}
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col {...globalProps.col}>
                    <Form.Item {...globalProps.formItem}
                      label={<Translate id="WARD" />}
                      name="wardId"
                    >
                      <Select {...globalProps.selectSearch}
                        allowClear
                        onChange={e => this.wardChange(e)}
                        onClear={() => this.wardClear()}
                      >
                        {wards.map((k, i) =>
                          <Option value={k.id} key={i}>
                            {k.name}
                          </Option>
                        )}
                      </Select>
                    </Form.Item>
                  </Col>
                </Row>
                : ""}

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
                </Col>
              </Row>
            </Form>
          </Card>
        }
        <div className="card-container">
          <Tabs
            style={globalProps.panel}
            type="card"
          >
            {isAllow(PERMISSION.MACHINE.LIST) &&
              <Tabs.TabPane
                key="1"
                tab={<strong><Translate id="LIST" /></strong>}
              >
                <Table
                  {...globalProps.table}
                  dataSource={machineModels.map((k, i) => ({ ...k, index: i + 1, key: i }))}
                >
                  {isAllow(PERMISSION.MACHINE.DETAIL) &&
                    <Column {...globalProps.tableRow} dataIndex="id" width={60}
                      render={(val, record) =>
                        <Row gutter={8} style={{ flexWrap: "nowrap" }}>
                          <Col flex="32px">
                            <Button
                              type="primary"
                              icon={<EyeFilled />}
                              shape="circle"
                              onClick={e => this.gotoDetail(record)}
                            />
                          </Col>
                        </Row>
                      }
                    />
                  }
                  <Column {...globalProps.tableRow} title={<Translate id="INDEX" />} dataIndex="index" width={50} />
                  <Column sorter={(a, b) => a.machineModel.localeCompare(b.machineModel)}
                    {...globalProps.tableRow}
                    title={<Translate id="MACHINE_MODEL" />}
                    dataIndex="machineModel"
                    render={val => val ? <Translate id={`MACHINE_MODEL_${(val).toUpperCase()}`} /> : ''}
                    width={100}
                  />

                  <Column sorter={(a, b) => a.machineCode.localeCompare(b.machineCode)} {...globalProps.tableRow} title={<Translate id="MACHINE_CODE" />} dataIndex="machineCode" width={70} />
                  <Column sorter={(a, b) => a.machineName.localeCompare(b.machineName)} {...globalProps.tableRow} className="c-vending-name" title={<Translate id="MACHINE_NAME" />} dataIndex="machineName" width={150} />
                  <Column sorter={(a, b) => a.addressType.localeCompare(b.addressType)}
                    {...globalProps.tableRow}
                    title={<Translate id="LOCATION_TYPE" />}
                    dataIndex="addressType"
                    render={val => val ? <Translate id={`ADDRESS_TYPE_${val.toUpperCase()}`} /> : ''}
                  />
                  <Column sorter={(a, b) => a.locationName.localeCompare(b.locationName)} {...globalProps.tableRow} title={<Translate id="LOCATION" />} dataIndex="locationName" />
                  <Column sorter={(a, b) => a.locationArea.localeCompare(b.locationArea)} {...globalProps.tableRow} title={<Translate id="MACHINE_AREA" />} dataIndex="locationArea" />
                  <Column sorter={(a, b) => a.address.localeCompare(b.address)} {...globalProps.tableRow} title={<Translate id="ADDRESS" />} dataIndex="address" width={200} />
                  <Column sorter={(a, b) => a.statusInternet.localeCompare(b.statusInternet)} {...globalProps.tableRow} title={<Translate id="MANCHINE_STATUS_INTERNET" />} dataIndex="statusInternet" render={val => val ? <Translate id={val.toUpperCase()} /> : ''} />
                  <Column sorter={(a, b) => a.statusMaintenance.localeCompare(b.statusMaintenance)} {...globalProps.tableRow} title={<Translate id="MANCHINE_STATUS_MAINTENANCE" />} dataIndex="statusMaintenance" render={val => val ? <Translate id={val.toUpperCase()} /> : ''} />
                </Table>
              </Tabs.TabPane>
            }
            {isAllow(PERMISSION.MACHINE.MAP) &&
              <Tabs.TabPane
                key="2"
                tab={<strong><Translate id="MAP" /></strong>}
              >
                <div style={{ height: 500 }}>
                  <Map
                    googleMapURL={GOOGLE_MAP.API_KEY}
                    loadingElement={<div style={{ height: `100%` }} />}
                    containerElement={
                      <div style={{ height: `500px`, width: `100%` }} />
                    }
                    mapElement={
                      <div style={{ height: `500px`, width: `100%` }} />
                    }
                    marker={machineModels.map(k => ({
                      lat: (k.lat - 0) + (0.000003 * (Math.floor(Math.random() * 9) + 1)),
                      lng: (k.lng - 0) + (0.000003 * (Math.floor(Math.random() * 9) + 1)),
                      info: <div>
                        <Descriptions>
                          <Descriptions.Item span={3} label={<Translate id="MACHINE_NAME" />}>
                            {k.machineName}
                          </Descriptions.Item>
                          <Descriptions.Item span={3} label={<Translate id="MACHINE_CODE" />}>
                            {k.machineCode}
                          </Descriptions.Item>
                          <Descriptions.Item span={3} label={<Translate id="ADDRESS" />}>
                            {k.address}
                          </Descriptions.Item>
                        </Descriptions>
                        <Button
                          onClick={e => this.gotoDetail(k)}
                        >
                          <Translate id="DETAIL" />
                        </Button>
                      </div>
                    }))}
                  />
                </div>
              </Tabs.TabPane>
            }
          </Tabs>
        </div>
      </React.Fragment >
    )
  }
}

const stateToProps = (state) => {
  return {
    machines: state.machine.machines,
    addressTypes: state.machine.addressTypes,
    machineModels: state.machine.machineModels,
    cities: state.machine.cities,
    districts: state.machine.districts,
    wards: state.machine.wards,
    cityIdDefault: state.machine.cityIdDefault,
    locations: state.machine.locations,
    locationAreaMachines: state.machine.locationAreaMachines,
    vendingMachineModels: state.machine.vendingMachineModels,
    statusMaintenance: state.machine.statusMaintenance,
    statusInternet: state.machine.statusInternet
  };
}

const dispatchToProps = (dispatch) => bindActionCreators({
  init: machineActions.init,
  search: machineActions.search,
  gotoDetail: machineActions.gotoDetail,
  getDistrict: machineActions.getDistrict,
  getWard: machineActions.getWard
}, dispatch);

export default connect(stateToProps, dispatchToProps)(withLocalize(Machine));