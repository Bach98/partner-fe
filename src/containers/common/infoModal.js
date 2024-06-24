import React, { Component } from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { withLocalize } from "react-localize-redux";
import {
  Modal,
} from "antd";
import { commonActions } from "../../actions";


class InfoModal extends Component {
  state = {};
  form = React.createRef();

  render() {
    let {
      isShow,
      title,
      content,
      hide
    } = this.props;
    return (
      <Modal
        visible={isShow}
        title={<strong>{title}</strong>}
        okText="OK"
        onCancel={() => hide()}
        onOk={() => hide()}
      >
        <p>{content}</p>
      </Modal>
    );
  }
}

const stateToProps = (state) => {
  return {
    isShow: state.common.isShowInfoPopup,
    title: state.common.dataInfoPopup.title,
    content: state.common.dataInfoPopup.content
  };
};

const dispatchToProps = (dispatch) => bindActionCreators({
  hide: commonActions.hideInfoPopUp
}, dispatch);

export default connect(
  stateToProps,
  dispatchToProps
)(withLocalize(InfoModal));
