import React, { Component } from "react";
import { Translate } from "react-localize-redux";
import { Menu, Row, Col, Button } from "antd";
import { leftMenu, isAllow } from "../../data";
import { NavLink } from 'react-router-dom';
// import { LOCAL_PATH } from "../../constants";
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
} from '@ant-design/icons';
import logo from "../../../src/assets/images/logo-evend.png";
const { SubMenu } = Menu;

class MenuBar extends Component {
  constructor(props) {
    super(props);

    let rootMenuItem = [];
    let rootSubmenu = [];
    leftMenu.map(k => {
      if (k.childs) {
        rootSubmenu.push(k.url);
        return k.childs.map(h =>
          rootMenuItem.push(h.url)
        );
      } else {
        return rootMenuItem.push(k.url);
      }
    });

    this.state = {
      openKeys: [],
      selectedKeys: [],
      rootMenuItem,
      rootSubmenu
    };
  }

  onNavigate() {
    if (window.screen.width <= 600) {
      this.props.toggleCollapsed();
    }
  }

  render() {
    let { rootMenuItem, rootSubmenu } = this.state;
    let { currentURL, collapsed } = this.props;
    let selected = rootMenuItem.find(x => currentURL.startsWith(x));
    let listExpanse = rootSubmenu.filter(x => currentURL.startsWith(x));
    return (
      <React.Fragment>
        <Row>
          <Col>
            {/* <NavLink
              to={LOCAL_PATH.EMPTY}
            > */}
            <Row
              align="middle"
              justify="center"
              gutter={6}
              style={{ height: 64, marginLeft: 5 }}
            >
              <Col flex="unset">
                <img alt="logo" style={{ width: collapsed ? 60 : 150 }} src={logo} />
              </Col>
            </Row>
            {/* </NavLink> */}
          </Col>
          <Col className="menu-collapse-btn">
            <Button className="custom-btn-primary" type="primary" onClick={this.props.toggleCollapsed} >
              {React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined)}
            </Button>
          </Col>
        </Row>
        <Menu
          className="header-component"
          onClick={this.props.handleClick}
          selectedKeys={selected ? [selected] : []}
          defaultOpenKeys={listExpanse}
          theme="dark"
          mode="inline"
        >
          {leftMenu.filter(k => k.enable && isAllow(k.permission)).map(k =>
            (!!k.childs) ?
              <SubMenu
                key={k.url}
                title={
                  <React.Fragment>
                    {k.icon}
                    {collapsed ?
                      <div><Translate id={`${k.name}`} /></div>
                      :
                      <Translate id={`${k.name}`} />
                    }
                  </React.Fragment>
                }
              >
                {k.childs.filter(h => h.enable && isAllow(h.permission)).map(h =>
                  <Menu.Item key={h.url} >
                    {h.icon}
                    <NavLink to={h.url} onClick={e => this.onNavigate()}>
                      <Translate id={`${h.name}`} />
                    </NavLink>
                  </Menu.Item>
                )}
              </SubMenu>
              :
              <Menu.Item key={k.url}>
                {k.icon}
                <NavLink to={k.url} onClick={e => this.onNavigate()}>
                  {collapsed ?
                    <div><Translate id={`${k.name}`} /></div>
                    :
                    <Translate id={`${k.name}`} />
                  }
                </NavLink>
              </Menu.Item>
          )}
        </Menu>
      </React.Fragment >
    )
  }
}

export default MenuBar;