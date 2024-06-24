import React, { Component } from "react";
import { Form, Row, Col, Button, Card, Input, Select } from 'antd';
import { globalProps, rules } from "../../../data"
const { Option } = Select;
class Register extends Component {
  onAddressChange(val) {
    let { form, getDistricts, getWards } = this.props;
    if ("cityId" in val) {
      form.setFieldsValue({
        districtId: undefined,
        wardId: undefined
      });
      if (val.cityId) {
        getDistricts({ cityId: val.cityId })
      }
      return;
    }
    if ("districtId" in val) {
      form.setFieldsValue({
        wardId: undefined,
      });
      if (val.districtId) {
        getWards({ districtId: val.districtId })
      }
      return;
    }
  }

  onSave(e) {
    let { categoryList, cityList, districtList, wardList } = this.props;
    let body = { ...e }
    let category = categoryList.find(k => k.id === e.categoryId);
    if (category) {
      body.categoryName = category.name;
    }
    let city = cityList.find(x => x.id === body.cityId);
    let district = districtList.find(x => x.id === body.districtId);
    let ward = wardList.find(x => x.id === body.wardId);
    city = !!city ? city.name : "";
    district = !!district ? district.name : "";
    ward = !!ward ? ward.name : "";
    body.addressFull = [body.addressDetail, ward, district, city].join(", ");
    this.props.register({ merchant: body });
  }

  render() {
    let { categoryList, cityList, districtList, wardList, form } = this.props;

    return (
      <div className="register" >
        <div>
          <Card>
            <h2><strong>Hợp tác cùng ToroG</strong></h2>
            <Form
              {...globalProps.form}
              onFinish={e => this.onSave(e)}
              form={form}
              onValuesChange={e => this.onAddressChange(e)}
            >
              <Row {...globalProps.row}>
                <Col {...globalProps.col3}>
                  <Form.Item {...globalProps.formItem}
                    label={"Tên công ty"}
                    name="brandName"
                    rules={[rules.required]}
                  >
                    <Input placeholder="Nhập thông tin vào đây" />
                  </Form.Item>
                </Col>
                <Col {...globalProps.col3}>
                  <Form.Item {...globalProps.formItem}
                    label={"Ngành hàng"}
                    name="categoryId"
                    rules={[rules.required]}
                  >
                    <Select placeholder="Lựa chọn hình thức">
                      {categoryList.map(k =>
                        <Option value={k.id} key={k.id}>{k.name}</Option>
                      )}
                    </Select>
                  </Form.Item>
                </Col>
                <Col {...globalProps.col3}>
                  <Form.Item {...globalProps.formItem}
                    label={"Số điện thoại"}
                    name="phone"
                    rules={[rules.required]}
                  >
                    <Input placeholder="Nhập số điện thoại vào đây" />
                  </Form.Item>
                </Col>
                <Col {...globalProps.col3}>
                  <Form.Item {...globalProps.formItem}
                    label={"Email"}
                    name="email"
                    rules={[rules.required, rules.type.email]}
                  >
                    <Input placeholder="Nhập email vào đây" />
                  </Form.Item>
                </Col>
                <Col {...globalProps.col3}>
                  <Form.Item {...globalProps.formItem}
                    label={"Địa chỉ"}
                    name="addressDetail"
                    rules={[rules.required]}
                  >
                    <Input placeholder="Nhập địa chỉ vào đây" />
                  </Form.Item>
                </Col>
                <Col {...globalProps.col3}>
                  <Row gutter={8}>
                    <Col {...globalProps.col}>
                      <Form.Item {...globalProps.formItem} {...globalProps.formItem}
                        label={"Tỉnh/Thành Phố"}
                        name="cityId"
                        rules={[rules.required]}
                      >
                        <Select placeholder="Lựa chọn" style={{ width: "100%" }}
                          {...globalProps.selectSearch}
                        >
                          {cityList.map((k, i) =>
                            <Option key={i} value={k.id}>{k.name}</Option>
                          )}
                        </Select>
                      </Form.Item>
                    </Col>
                    <Col {...globalProps.col}>
                      <Form.Item {...globalProps.formItem} {...globalProps.formItem}
                        label={"Quận/Huyện"}
                        name="districtId"
                        rules={[rules.required]}
                      >
                        <Select placeholder="Lựa chọn"
                          style={{ width: "100%" }}
                          {...globalProps.selectSearch}
                        >
                          {districtList.map((k, i) =>
                            <Option key={i} value={k.id}>{k.name}</Option>
                          )}
                        </Select>
                      </Form.Item>
                    </Col>
                    <Col {...globalProps.col}>
                      <Form.Item {...globalProps.formItem} {...globalProps.formItem}
                        label={"Phường/Xã"}
                        name="wardId"
                        rules={[rules.required]}
                      >
                        <Select placeholder="Lựa chọn"
                          style={{ width: "100%" }}
                          {...globalProps.selectSearch}
                        >
                          {wardList.map((k, i) =>
                            <Option key={i} value={k.id}>{k.name}</Option>
                          )}
                        </Select>
                      </Form.Item>
                    </Col>
                  </Row>
                </Col>
                <Col {...globalProps.col3}>
                  <Button htmlType="submit" className="custom-btn-primary" type="primary" style={{ width: "100%" }}>
                    Đăng ký ngay
                  </Button>
                </Col>
              </Row>
            </Form>
            <div style={{ fontSize: "12px", marginTop: 10 }}>
              Bằng việc chấp nhận và điền đầy đủ thông tin được xem như Khách hàng đã đồng ý để ToroG thu thập, sử dụng và tiết lộ thông tin theo Chính sách bảo mật.
            </div>
          </Card>
        </div>
      </div>
    )
  }
}

const FormWrapper = (props) => {
  const [form] = Form.useForm();
  return (
    <Register {...props} form={form} />
  )
}

export default FormWrapper;