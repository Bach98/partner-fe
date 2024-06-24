import React, { Component } from "react";
import { NavLink } from 'react-router-dom';
import { Translate } from "react-localize-redux";
import { Result, Button } from 'antd';
import {
  BuildFilled
} from '@ant-design/icons';
class Construction extends Component {

  render() {
    return (
      <Result
        icon={<BuildFilled />}
        title={"Page under contruction."}
        subTitle={"Please comeback later."}
        extra={
          <NavLink to="/">
            <Button className="custom-btn-primary" type="primary">
              <Translate id="OK" />
            </Button>
          </NavLink>
        }
      />
    )
  }
}

export default Construction;