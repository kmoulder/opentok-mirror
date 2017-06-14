import React from 'react';
import PropTypes from 'prop-types';

class ResultPane extends React.Component {
  componentWillReceiveProps(nextProps) {
    if (nextProps.sdkValue !== this.props.sdkValue) {
      this.setState({ sdkValue: nextProps.sdkValue }, this.changeSdkHandler);
    }
    if (nextProps.result !== this.props.result) {
      this.setState({ result: nextProps.result }, this.displayResult);
    }
  }

  frameLoadHandler() {
    this.head = this.frame.contentDocument.head;
    this.changeSdkHandler();
  }

  changeSdkHandler() {
    if(!this.head || !this.props.sdkValue) { 
      return;
    }
    if(this.body) {
      this.removeBodyNodes(true);
    }
    const scriptOT = document.createElement('script');
    scriptOT.setAttribute('src',
      `https://static.opentok.com/v${this.props.sdkValue}/js/opentok.min.js`
    );
    this.head.innerHTML = '';
    this.head.appendChild(scriptOT);
  }

  displayResult() {
    if(this.body) {
      this.body.removeChild(this.html);
      this.body.removeChild(this.style);
      this.body.removeChild(this.script);
      this.removeBodyNodes(false);
    } else {
      this.body = this.frame.contentDocument.body;
    }

    this.html = document.createElement('div');
    this.html.innerHTML = this.props.result.html;

    this.style = document.createElement('style');
    this.style.innerHTML = this.props.result.css;
    
    this.script = document.createElement('script');
    this.script.innerHTML = this.props.result.javascript;
    
    this.body.appendChild(this.html);
    this.body.appendChild(this.style);
    this.body.appendChild(this.script);
  }

  isTbPluginObject(node) {
    return node.nodeName === 'OBJECT' &&
      node.id && node.id.indexOf('tb_plugin') > -1;
  }

  removeBodyNodes(removeTbPlugin) {
    const self = this;
    const children = Array.prototype.slice.call(this.body.childNodes);
    children.forEach(function(child) {
      if(self.isTbPluginObject(child) === removeTbPlugin) {
        self.body.removeChild(child);
      }
    });
  }
  
  render() {
    return (
      <div className={this.props.className}>
        <iframe
          src={`${baseUrl}/html/frame.html`}
          className="frame"
          ref={(el) => (this.frame = el)}
          onLoad={this.frameLoadHandler.bind(this)}
        />
        <span className="pane-name">
          {this.props.name}
        </span>
      </div>
    );
  }
}

ResultPane.propTypes = {
  sdkValue: PropTypes.string,
  result: PropTypes.object
};

export default ResultPane;
