'use strict';

import Request from './lib/request';
import { generate } from './lib/nonce';

RequestBuilder.$inject = [
  '$window',
  '$log'
];

export default function RequestBuilder($window, $log) {
  return function(url, builder) {
    $log.info('Request builder with params: url=' + url);
    const request = new Request(url, requestUrl => {
      $window.location.replace(requestUrl);
    });

    builder(request)
      .withNonce(generate())
      .build()
      .perform();
  };
}
