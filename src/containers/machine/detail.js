import React, { Component } from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { Translate } from "react-localize-redux";
import { PageHeader, Card, Form, Row, Col, Empty } from "antd";
import { globalProps } from "../../data";
import { machineActions } from "../../actions";
import { LOCAL_PATH } from "../../constants";
import { history } from "../../store";

class MachineDetail extends Component {
  state = {};

  componentDidMount() {
    let { machineId, detail } = this.props;
    if (machineId) {
      detail({ data: { machineId } });
    } else {
      history.push(LOCAL_PATH.CATEGORY.MACHINE.INDEX);
    }
  }

  render() {
    let { layout, machineInfo } = this.props;

    return (
      <React.Fragment>
        <PageHeader
          title={
            <span>
              <Translate id="LOCATION_AND_MACHINE_HEADER" /> /{" "}
              <Translate id="DETAIL" />
            </span>
          }
          ghost={false}
          onBack={(e) => history.push(LOCAL_PATH.CATEGORY.MACHINE.INDEX)}
        />

        <Card
          style={globalProps.panel}
          title={
            <strong>
              <Translate id="GENERAL_INFO" />
            </strong>
          }
        >
          <Form {...globalProps.form}>
            <Row {...globalProps.row}>
              <Col {...globalProps.colHalf}>
                <Form.Item
                  {...globalProps.formItem}
                  label={<Translate id="MACHINE_CODE" />}
                >
                  {machineInfo.machineCode}
                </Form.Item>
              </Col>
              <Col {...globalProps.colHalf}>
                <Form.Item
                  {...globalProps.formItem}
                  label={<Translate id="MACHINE_NAME" />}
                >
                  {machineInfo.machineName}
                </Form.Item>
              </Col>

              <Col {...globalProps.colHalf}>
                <Form.Item
                  {...globalProps.formItem}
                  label={<Translate id="LOCATION" />}
                >
                  {machineInfo.locationName}
                </Form.Item>
              </Col>
              <Col {...globalProps.colHalf}>
                <Form.Item
                  {...globalProps.formItem}
                  label={<Translate id="MACHINE_AREA" />}
                >
                  {machineInfo.locationArea}
                </Form.Item>
              </Col>

              <Col {...globalProps.col3}>
                <Form.Item
                  {...globalProps.formItem}
                  label={<Translate id="ADDRESS" />}
                >
                  {machineInfo.address}
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Card>
        <Card
          style={globalProps.panel}
          title={
            <strong>
              <Translate id="MACHINE_LAYOUT" />
            </strong>
          }
        >
          {layout &&
            !!layout.subLayoutList &&
            layout.subLayoutList.map((subLayout, subLayoutIndex) => {
              let maxCol = Math.max(
                ...subLayout.trayList.map(
                  (k) =>
                    k.slotList.reduce(
                      (a, b) =>
                        (typeof a === "number" ? a : a.cellNumber || 1) +
                        b.cellNumber
                    ) || 0
                )
              );
              let minW = 140;
              return (
                <Card key={subLayoutIndex} bodyStyle={{ padding: 10 }}>
                  <div style={{ width: 1400 }}>
                    {subLayout.trayList.map((tray, trayIndex) => (
                      <div
                        className="tray"
                        style={{ display: "flex", width: maxCol * minW || 0 }}
                        key={trayIndex}
                      >
                        {tray.slotList.map((slot, slotIndex) => (
                          <Card
                            className="slot"
                            cell={slot.cellNumber || 1}
                            key={slotIndex}
                            style={{
                              flex: `1 0 ${(slot.cellNumber || 1) * minW}px`,
                              backgroundColor: "#E6E6E6",
                              borderColor: "#A5A5A5",
                              height: 290,
                            }}
                            cover={
                              <table>
                                {slot.productTemplateImage ? (
                                  <div
                                    style={{
                                      backgroundImage: `url(${slot.productTemplateImage})`,
                                      height: 160,
                                      backgroundRepeat: "no-repeat",
                                      backgroundPosition: "center",
                                      backgroundSize: "contain",
                                    }}
                                  />
                                ) : (
                                  <Empty
                                    style={{
                                      padding: "2px",
                                      margin: 0,
                                    }}
                                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                                    description={
                                      <span
                                        style={{
                                          color: "rgba(0,0,0,0.5)",
                                        }}
                                      >
                                        <Translate id="NOT_AVAILABLE" />
                                      </span>
                                    }
                                  />
                                )}
                                <div style={{ height: 133, width: "auto" }}>
                                  <div>
                                    <div>
                                      <Card.Meta
                                        style={{
                                          position: "relative",
                                          textalign: "center",
                                          border: "ridge",
                                          width: "auto",
                                        }}
                                        title={
                                          <div
                                            style={{
                                              whiteSpace: "pre-wrap",
                                              minHeight: 30,
                                              fontWeight: 500,
                                              fontSize: "14px",
                                              display: "flex",
                                              justifyContent: "center",
                                              alignItems: "center",
                                            }}
                                          >
                                            {slot.productTemplateName}
                                          </div>
                                        }
                                      />
                                    </div>
                                  </div>

                                  <div
                                    style={{
                                      position: "relative",
                                      fontWeight: 500,
                                      textAlign: "center",
                                      border: "ridge ",

                                      top: 2,
                                      width: "auto",
                                    }}
                                  >
                                    Lò xo 6 đơn
                                  </div>
                                  <div
                                    style={{
                                      fontWeight: 500,
                                      height: 27,
                                      width: "100%",
                                      display: "flex",
                                    }}
                                  >
                                    <div
                                      style={{
                                        top: 0,
                                        left: 0,
                                        width: "50%",
                                        textAlign: "center",
                                        border: "ridge",
                                      }}
                                    >
                                      KC:6,0cm
                                    </div>
                                    <div
                                      style={{
                                        textAlign: "center",
                                        bottom: 28,
                                        left: 138,
                                        width: "51%",
                                        border: "ridge",
                                      }}
                                    >
                                      R:7,5cm
                                    </div>
                                  </div>
                                  <div
                                    style={{
                                      fontWeight: 500,
                                      display: "flex",
                                      flexWrap: "wrap",
                                      justifyContent: "center",
                                      height: 48,
                                      width: "100%",
                                    }}
                                  >
                                    <div
                                      style={{
                                        height: 48,
                                        flex: "33%",
                                      }}
                                    >
                                      <span
                                        style={{
                                          position: "absolute",
                                          backgroundColor: "#eeeeee",
                                          height: 48,
                                          textAlign: "center",

                                          width: "33%",
                                          border: "ridge",
                                        }}
                                      >
                                        {slot.position}
                                      </span>
                                    </div>

                                    <div
                                      style={{
                                        textAlign: "center",
                                        flex: "33%",
                                        border: "ridge",
                                        height: 48,
                                      }}
                                    >
                                      6pcs
                                    </div>
                                    <div
                                      style={{
                                        textAlign: "center",
                                        border: "ridge",
                                        flex: "34%",
                                        height: 48,
                                      }}
                                    >
                                      6pcs
                                    </div>
                                  </div>
                                </div>
                              </table>
                            }
                            bodyStyle={{ padding: 0 }}
                          ></Card>
                        ))}
                      </div>
                    ))}
                  </div>
                </Card>
              );
            })}
        </Card>
      </React.Fragment>
    );
  }
}

const stateToProps = (state) => {
  return {
    layout: state.machine.layout,
    machineId: state.machine.machineId,
    machineInfo: state.machine.machineInfo,
  };
};

const dispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      detail: machineActions.detail,
    },
    dispatch
  );

export default connect(stateToProps, dispatchToProps)(MachineDetail);
