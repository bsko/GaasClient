'use strict';

import { load } from './lib/token';

AuthorizationInterceptor.$inject = [
  'TargetSystemResolver'
];

export default function AuthorizationInterceptor(TargetSystemResolver) {
  return {
    request: function(config) {
      const system = TargetSystemResolver.system(config.url);
      const token = load(system);
      if (token) {
        config.headers['Authorization'] = 'Bearer ' + token;
      }
      return config;
    }
  };
}
