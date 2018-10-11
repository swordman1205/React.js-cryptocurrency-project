import React, {Component} from 'react';
import {Modal} from 'antd';

import './iframemodal.scss';

export default class IframeModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      url: '',
      visible: false
    }
  }

  componentWillReceiveProps(props) {
    if (!props.url) {
      return;
    }

    this.setState({
      url: props.url,
      visible: true
    });
  }

  closeModal() {
    this.setState({
      visible: false
    });
    this.props.onClose();
  }

  render() {
    return (
      <Modal
        visible={this.state.visible}
        onCancel={this.closeModal.bind(this)}
        destroyOnClose={true}
        className="iframe-modal"
        >
        <iframe src={this.state.url} allowFullScreen/>
      </Modal>
    );
  }
}
