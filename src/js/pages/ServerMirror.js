import React from 'react';
import CustomCodeMirror from '../components/custom/CustomCodeMirror';
import ActionBarServer from '../components/serverMirror/ActionBarServer';

require('es6-promise').polyfill();
const axios = require('axios');
const apiRequestTemplates = require('../data/api-request-templates');

class ServerMirror extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      template: Object.keys(apiRequestTemplates)[0],
      json: this.getJsonByTemplate(Object.keys(apiRequestTemplates)[0]),
      result: '',
      isRunning: false,
      isSaving: false
    };
    if (this.props.match.params.mirrorId) {
      this.setSavedState(this.props.match.params.mirrorId);
    }
  }

  setSavedState(mirrorId) {
    axios.get(`${baseUrl}/server-mirror/${mirrorId}`)
      .then((response) => {
        this.setState({
          template: response.data.template,
          json: response.data.json
        });
      });
  }

  updateTemplate(newTemplate) {
    this.setState({ template: newTemplate });
    this.updateJSON(this.getJsonByTemplate(newTemplate));
  }

  updateJSON(newCode) {
    this.setState({ json: newCode });
  }

  infoGenerateHandler(info) {
    this.setState({
      json: this.state.json
        .replace('<API_KEY>', info.apiKey)
        .replace('<JWT_TOKEN>', info.token),
    });
  }

  getJsonByTemplate(template) {
    return JSON.stringify(apiRequestTemplates[template], null, 4);
  }

  run() {
    this.setState({ isRunning: true });
    axios({
      method: 'POST',
      url: `${baseUrl}/sendAnvilRequest`,
      data: { jsonObj: this.state.json },
    }).then((res) => {
      this.setState({
        result: JSON.stringify(res.data, null, 4),
        isRunning: false
      });
    });
  }

  save() {
    this.setState({ isSaving: true });
    axios.post(`${baseUrl}/server-mirror`, {
      template: this.state.template,
      json: this.state.json})
      .then((response) => {
        this.props.history.push(`/server-mirror/${response.data}`);
        this.setState({ isSaving: false });
      });
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.match.params.mirrorId !== nextProps.match.params.mirrorId) {
      if (nextProps.match.params.mirrorId && !this.state.isSaving) {
        this.setSavedState(nextProps.match.params.mirrorId);
      }
    }
  }

  render() {
    const isRunning = this.state.isRunning;
    const isSaving = this.state.isSaving;
    return (
      <div>
        <ActionBarServer
          template={this.state.template}
          onTemplateChange={this.updateTemplate.bind(this)}
          onInfoGenerate={this.infoGenerateHandler.bind(this)}
          onRunClick={this.run.bind(this)}
          onSaveClick={this.save.bind(this)}
          options={{
            isRunning,
            isSaving
          }}
        />
        <div className="pane-window">
          <div className="container-code-mirror container-code-mirror-server">
            <CustomCodeMirror
              name="JSON"
              value={this.state.json}
              options={{
                lineNumbers: true,
                mode: 'javascript',
                lineWrapping: true }}
              onChange={this.updateJSON.bind(this)}
            />
          </div>
          <div className="container-code-mirror container-code-mirror-server">
            <CustomCodeMirror
              name="Result"
              value={this.state.result}
              options={{
                lineNumbers: true,
                readOnly: true,
                mode: 'xml',
                lineWrapping: true }}
              onChange={this.updateJSON.bind(this)}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default ServerMirror;
