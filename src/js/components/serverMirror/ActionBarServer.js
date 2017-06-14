import React from 'react';
import PropTypes from 'prop-types';

require('es6-promise').polyfill();
const axios = require('axios');
const apiRequestTemplates = require('../../data/api-request-templates');

class ActionBarServer extends React.Component {
  constructor() {
    super();
    this.state = { isLoadingAuthToken: false };
    this.templateItems = Object.keys(apiRequestTemplates).map((key, index) =>
      <option key={key} value={key}>{key}</option>
    );
  }

  changeTemplateHandler(event) {
    if(this.props.onTemplateChange) {
      this.props.onTemplateChange(event.target.value);
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

  generateAuthTokenClickHandler() {
    this.setState({ isLoadingAuthToken: true });
    axios.get(`${baseUrl}/jwt-token`)
      .then((res) => {
        if(this.props.onInfoGenerate) {
          this.props.onInfoGenerate(res.data);
        }
        this.setState({ isLoadingAuthToken: false });
      });
  }

  render() {
    return (
      <div className="action-bar">
        <div className="sdk-version">
          <span>API Request Template</span>
          <select name="version" value={this.props.template} onChange={this.changeTemplateHandler.bind(this)}>
            {this.templateItems}
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
        <button className="btn btn-large" onClick={this.generateAuthTokenClickHandler.bind(this)}>
          <span className={'glyphicon ' + (this.state.isLoadingAuthToken ?
            'glyphicon-refresh spinning' : 'glyphicon-plus')}
          /> Generate Token
        </button>
      </div>
    );
  }
}

ActionBarServer.propTypes = {
  template: PropTypes.string,
  options: PropTypes.object,
  onTemplateChange: PropTypes.func,
  onRunClick: PropTypes.func,
  onInfoGenerate: PropTypes.func,
  onSaveClick: PropTypes.func
};

export default ActionBarServer;
