'use strict';

import Request from './request.js';

describe('request', () => {
  it('should not add multiple query marks', () => {
    let request = new Request('http://example.com?query=true')
      .withChannel(7);

    expect(request.url).toEqual('http://example.com?query=true&claims=%7B%22id_token%22%3A%7B%22req_channel_id%22%3A%7B%22value%22%3A7%7D%7D%7D');
  });

  it('should stringify claims', () => {
    let request = new Request('http://example.com')
      .withChannel(7);

    expect(request.url).toEqual('http://example.com?claims=%7B%22id_token%22%3A%7B%22req_channel_id%22%3A%7B%22value%22%3A7%7D%7D%7D');
  });

  it('should perform callback', () => {
    let result;
    let target = 'http://example.com';
    function callback(url) {
      result = url;
    }

    let request = new Request(target, callback);
    request.perform();
    expect(result).toEqual(target);
  });
});
