'use strict';

export default class Request {
  constructor(url, callback) {
    this.url = url;
    this.callback = callback;
  }

  withClientSystem(clientSystem) {
    this.clientSystem = clientSystem;
    return this;
  }

  withTargetSystem(targetSystem) {
    if (targetSystem) {
      this.targetSystem = targetSystem;      
    }
    return this;
  }

  withRedirect(uri) {
    this.url = addParam(this.url, 'redirect_uri', uri);
    return this;
  }

  withState(state) {
    this.url = addParam(this.url, 'state', JSON.stringify(state));
    return this;
  }

  withNonce(nonce) {
    this.url = addParam(this.url, 'nonce', nonce);
    return this;
  }

  withDisplay(display) {
    this.url = addParam(this.url, 'display', display);
    return this;
  }

  withPrompt(prompt) {
    this.url = addParam(this.url, 'prompt', prompt);
    return this;
  }

  withLocales(locales) {
    this.url = addParam(this.url, 'ui_locales', locales.join(' '));
    return this;
  }

  withChannel(id) {
    let claims = {
      id_token: {
        req_channel_id: {
          value: id
        }
      }
    };
    this.url = addParam(this.url, 'claims', JSON.stringify(claims));
    return this;
  }

  withUIParams(params) {
    this.url = addParam(this.url, 'ui_params', JSON.stringify(params));
    return this;
  }

  build() {
    this.url = addParam(this.url, 'client_id', this.targetSystem + ':' + this.clientSystem);
    return this;
  }

  perform() {
    if (this.callback) {
      this.callback(this.url);
    }
  }
}

function addParam(url, name, value) {
  let encoded = encodeParam(name, value);
  let separator = url.indexOf('?') > -1 ? '&' : '?';
  return url + separator + encoded;
}

function encodeParam(name, value) {
  return encodeURIComponent(name) + '=' + encodeURIComponent(value);
}
