import React from 'react';
import { withRouter } from 'react-router-dom';
import CustomCodeMirror from '../components/custom/CustomCodeMirror';
import ActionBar from '../components/clientMirror/ActionBar';
import ResultPane from '../components/clientMirror/ResultPane';
const axios = require('axios');

const initialState = require('../data/client-mirror-initial-state');
const jsSdkVersions = require('../data/js-sdk-versions');

class ClientMirror extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sdk: jsSdkVersions[0].value,
      html: initialState.html,
      javascript: initialState.javascript,
      css: initialState.css,
      result: {}
    };
    if (this.props.match.params.mirrorId) {
      this.setSavedState(this.props.match.params.mirrorId);
    }
  }

  setInitialState() {
    this.setState({
        sdk: jsSdkVersions[0].value,
        html: initialState.html,
        javascript: initialState.javascript,
        css: initialState.css,
        result: {}
      });
  }

  setSavedState(mirrorId) {
    axios.get(`${baseUrl}/client-mirror/${mirrorId}`)
      .then((response) => {
        this.setState({
          sdk: response.data.sdk,
          html: response.data.html,
          javascript: response.data.javascript,
          css: response.data.css,
          result: {}
        });
      })
      .catch((error) => console.log(error));
  }

  updateSDK(newSdk) {
    this.setState({ sdk: newSdk });
  }

  updateHTML(newCode) {
    this.setState({ html: newCode });
  }

  updateJS(newCode) {
    this.setState({ javascript: newCode });
  }

  updateCSS(newCode) {
    this.setState({ css: newCode });
  }

  infoGenerateHandler(info) {
    this.setState({
      javascript:
        `${`var apiKey = ${info.apiKey};\n` +
        `var sessionId = "${info.sessionId}";\n` +
        `var token = "${info.token}";\n\n`}${
        this.state.javascript}`,
    });
  }

  save() {
    axios.post(`${baseUrl}/client-mirror`, this.state)
      .then((response) => {
          this.props.history.push(`/client-mirror/${response.data}`);
      })
      .catch((error) => console.log(error));
  }

  run() {
    this.setState({ result: {
      html: this.state.html,
      javascript: this.state.javascript,
      css: this.state.css
    }});
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.match.params.mirrorId !== nextProps.match.params.mirrorId) {
      if (nextProps.match.params.mirrorId){
        this.setSavedState(this.props.match.params.mirrorId);
      } else {
        this.setInitialState();
      }
    }
  }

  render() {
    return (
      <div>
        <ActionBar
          sdk={this.state.sdk}
          onSdkChange={this.updateSDK.bind(this)}
          onInfoGenerate={this.infoGenerateHandler.bind(this)}
          onRunClick={this.run.bind(this)}
          onSaveClick={this.save.bind(this)}
          options={{
            isRunning: false
          }}
        />
        <div className="pane-window">
          <div className="container-code-mirror">
            <CustomCodeMirror
              name="HTML"
              value={this.state.html}
              options={{
                lineNumbers: true,
                mode: 'htmlembedded',
                lineWrapping: true }}
              onChange={this.updateHTML.bind(this)}
            />
            <CustomCodeMirror
              name="JavaScript"
              value={this.state.javascript}
              options={{
                lineNumbers: true,
                mode: 'javascript',
                lineWrapping: true }}
              onChange={this.updateJS.bind(this)}
            />
          </div>
          <div className="container-code-mirror">
            <CustomCodeMirror
              name="CSS"
              value={this.state.css}
              options={{
                lineNumbers: true,
                mode: 'css',
                lineWrapping: true }}
              onChange={this.updateCSS.bind(this)}
            />
            <ResultPane
              className="result-pane"
              name="Result"
              sdkValue={this.state.sdk}
              result={this.state.result}
            />
          </div>
        </div>
      </div>
    );
  }
}


export default withRouter(ClientMirror);
