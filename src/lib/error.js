'use strict';

export default class Error {
  constructor(code, message, info) {
    this.code = code;
    this.message = message;
    this.info = info;
  }

  static decode(json) {
    let code = json.errorCode;
    let message = json.errorDescription;
    let info = json.extendedInfo;

    return new Error(code, message, info);
  }
}
