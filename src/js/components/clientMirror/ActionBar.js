import React from 'react';
import PropTypes from 'prop-types';

require('es6-promise').polyfill();
const axios = require('axios');
const jsSdkVersions = require('../../data/js-sdk-versions');

class ActionBar extends React.Component {
  constructor() {
    super();
    this.state = { isLoadingSessionInfo: false };
    this.jsSdkVersionItems = jsSdkVersions.map(item =>
      <option key={item.value} value={item.value}>{item.label}</option>
    );
  }

  changeSdkHandler(event) {
    if(this.props.onSdkChange) {
      this.props.onSdkChange(event.target.value);
    }
  }

  runClickHandler() {
    if(this.props.onRunClick) {
      this.props.onRunClick();
    }
  }

  saveClickHandler() {
    if(this.props.onSaveClick) {
      this.props.onSaveClick();
    }
  }

  generateSessionInfoClickHandler() {
    this.setState({ isLoadingSessionInfo: true });
    axios.get(`${baseUrl}/session`)
      .then((res) => {
        if(this.props.onInfoGenerate) {
          this.props.onInfoGenerate(res.data);
        }
        this.setState({ isLoadingSessionInfo: false });
      });
  }

  render() {
    return (
      <div className="action-bar">
        <div className="sdk-version">
          <span>JS SDK Version</span>
          <select name="version" value={this.props.sdk} onChange={this.changeSdkHandler.bind(this)}>
            {this.jsSdkVersionItems}
          </select>
        </div>
        <button className="btn" onClick={this.runClickHandler.bind(this)}>
          <span className={'glyphicon ' + (this.props.options.isRunning ?
            'glyphicon-refresh spinning' : 'glyphicon-play')}
          /> Run
        </button>
        <button className="btn" onClick={this.saveClickHandler.bind(this)}>
          <span className={'glyphicon ' + (this.props.options.isSaving ?
            'glyphicon-refresh spinning' : 'glyphicon-copy')}
          /> Save
        </button>
        <button className="btn btn-large" onClick={this.generateSessionInfoClickHandler.bind(this)}>
          <span className={'glyphicon ' + (this.state.isLoadingSessionInfo ?
            'glyphicon-refresh spinning' : 'glyphicon-plus')}
          /> Generate Session
        </button>
      </div>
    );
  }
}

ActionBar.propTypes = {
  sdk: PropTypes.string,
  options: PropTypes.object,
  onSdkChange: PropTypes.func,
  onRunClick: PropTypes.func,
  onInfoGenerate: PropTypes.func,
  onSaveClick: PropTypes.func
};

export default ActionBar;
