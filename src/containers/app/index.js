import React, { Component } from "react";
import { connect } from "react-redux";
import { renderToStaticMarkup } from "react-dom/server";
import { withLocalize, Translate } from "react-localize-redux";
import moment from 'moment';
import globalTranslations from "../../langs/en.translations.json";
import { Route, Redirect, Switch } from "react-router-dom";
import "../../assets/css/style.scss";
import "../../assets/css/scss/style.scss";
import english from "../../langs/en.translations.json";
import vietnam from "../../langs/vn.translations.json";
import { authActions } from "../../actions";
import { actionTypeConstants as types, layoutConstants, LOCAL_PATH } from "../../constants";
import { Layout, Spin, notification, ConfigProvider, Empty } from "antd";
import { pages, parseRoutes } from "../../data";
import HeaderBar from "../frame/header";
import MenuBar from "../frame/menu";

const { Sider, Header, Content } = Layout;

const CustomEmpty = () =>
  <Empty
    image={Empty.PRESENTED_IMAGE_SIMPLE}
    description={
      <Translate id="NO_DATA" />
    }
  />

class App extends Component {
  constructor(props) {
    super(props);
    const language = localStorage.getItem("lang")
      ? localStorage.getItem("lang")
      : "vi";

    this.props.initialize({
      languages: [
        {
          name: "EN",
          code: "en"
        },
        {
          name: "VN",
          code: "vi"
        }
      ],
      translation: globalTranslations,
      options: {
        onMissingTranslation: ({ translationId }) => `[${translationId}]`,
        renderToStaticMarkup,
        renderInnerHtml: true,
        defaultLanguage: language
      }
    });
    this.props.addTranslationForLanguage(english, "en");
    this.props.addTranslationForLanguage(vietnam, "vi");

    this.state = {
      collapsed: false,
    }
  }

  toggleMode() {
    this.setState({
      mode: this.state.mode === "dark" ? "" : "dark"
    }, () => {
    });
  }

  changeLang(val) {
    localStorage.setItem("lang", val);
    this.props.setActiveLanguage(val);
  }

  componentDidUpdate(prevProps) {
    let { message, translate, clearError } = this.props;

    if (message) {
      let messageType,
        missingMessage;
      switch (message.type) {
        case 0:
          messageType = "error";
          missingMessage = translate("MESS_DEFAULT_ERROR");
          break;
        case 1:
          messageType = "success";
          missingMessage = translate("MESS_DEFAULT_SUCCESS");
          break;
        case 2:
          messageType = "error";
          missingMessage = translate(message.message);
          break;
        default:
          messageType = "warning";
          missingMessage = translate("MESS_DEFAULT_WARNING");
          break;
      }

      notification[messageType]({
        message: translate(message.message, {}, {
          onMissingTranslation: () => missingMessage
        })
      });

      clearError();
    }
  }

  componentDidMount() {
    this.props.getCurrentUser();
  }

  toggleCollapsed(bool) {
    this.setState({ collapsed: bool });
  }

  renderContentUnAuthorize() {
    let unauthorizePage = pages.unauthorize;
    return (
      <Switch>
        {unauthorizePage.map((k, i) =>
          <Route
            key={i}
            path={k.url}
            exact
            component={(k.component)}
          />
        )}
        <Route render={() => (<Redirect to={LOCAL_PATH.LOGIN} />)} />
      </Switch>
    );
  }

  render() {
    moment.locale(localStorage.lang || "en");
    let { collapsed } = this.state;
    let { activeLanguage, languages, redirectUrl,
      countLoadingContainer, userInfo, logout
    } = this.props;
    let location = this.props.history.location.pathname;
    let authentication = !!(userInfo);
    let accessToken = localStorage.acc_token;
    if (!accessToken) {
      return this.renderContentUnAuthorize();
    } else if (!authentication) {
      return (
        <Spin spinning={true} size="large" >
          <div style={{ height: "100vh" }} />
        </Spin>
      )
    }

    let authorizePage = pages.authorize;
    let listRoutes = parseRoutes(authorizePage);
    return (
      <ConfigProvider
        renderEmpty={() => <CustomEmpty />}
      >
        <Spin spinning={countLoadingContainer > 0} style={{ position: "fixed" }} size="large">
          <Layout>
            <Sider
              theme="dark"
              className="main-sider"
              collapsed={collapsed}
              breakpoint={"md"}
              onBreakpoint={broken =>
                broken !== collapsed ? this.toggleCollapsed(broken) : undefined
              }
            >
              <MenuBar
                currentURL={location}
                collapsed={collapsed}
                toggleCollapsed={e => this.toggleCollapsed(!collapsed)}
              />
            </Sider>
            <Layout className="site-layout">
              <Header theme="light" className="site-layout-background main-header">
                <HeaderBar
                  toggleMode={e => this.toggleMode()}
                  toggleCollapsed={e => this.toggleCollapsed(!collapsed)}
                  toggleLang={e => this.changeLang(e)}
                  collapsed={collapsed}
                  activeLanguage={activeLanguage || {}}
                  languages={languages || []}
                  userInfo={userInfo}
                  logout={e => logout()}
                />
              </Header>
              <Layout style={{ padding: 10 }}>
                <Content className="main-contain">
                  <Switch>
                    {listRoutes.map((k, i) =>
                      <Route
                        key={i}
                        path={k.url}
                        exact
                        component={(k.component)}
                      />
                    )}
                    <Route render={e => <Redirect to={redirectUrl || LOCAL_PATH.EMPTY} />} />
                  </Switch>
                </Content>
              </Layout>
            </Layout>
          </Layout>
        </Spin>
      </ConfigProvider>
    );
  }
}
const mapStateToProps = state => {
  return {
    leftMenu: state.layout.leftmenu,
    authentication: state.authentication,
    message: state.message.content,
    countLoadingContainer: state.layout.countLoadingContainer,
    isShowConfirmPopup: state.common.isShowConfirmPopup,
    dataConfirmPopup: state.common.dataConfirmPopup,
    userInfo: state.auth.userInfo,
    redirectUrl: state.auth.redirectUrl,
    userPermission: state.auth.userPermission,
  };
};
const mapDispatchToProps = dispatch => {
  return {
    getCurrentUser: () => dispatch(authActions.userInfo()),
    logout: () => dispatch(authActions.logout()),
    clearError: () => dispatch({ type: types.MESSAGE.CLEAR }),
    hideSpinner: () => dispatch({ type: layoutConstants.HIDE_SPINNER }),
  };
};

export default withLocalize(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(App)
);