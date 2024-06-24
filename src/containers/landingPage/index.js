import React, { Component } from "react";
import { Layout } from 'antd';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

class Landing extends Component {
  constructor(props) {
    super(props);
    this.register = React.createRef();
    this.state = {
      section: {
        eco: false,
      }
    }
  }

  componentDidMount() {
  }

  componentWillUnmount() {
  }

  toRegister() {
    window.scrollTo({
      top: this.register.current.offsetTop,
      behavior: "smooth"
    });
  }

  render() {
    return (
      <div>
        <Layout className="landing-page">
        </Layout>
      </div>
    )
  }
}

const stateToProps = (state) => {
  return {
  };
}

const dispatchToProps = (dispatch) => bindActionCreators({
}, dispatch);

export default connect(stateToProps, dispatchToProps)(Landing);