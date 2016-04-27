'use strict';

import TargetSystemResolver from './targetSystemResolver';
import TokenParser from './tokenParser';
import RequestBuilder from './requestBuilder';
import AuthorizationInterceptor from './authorizationInterceptor';
import UnauthorizedInterceptorBuilder from './unauthorizedInterceptorBuilder';

export default angular
  .module('gaas-client', [])
  .provider('TargetSystemResolver', TargetSystemResolver)
  .factory('TokenParser', TokenParser)
  .factory('RequestBuilder', RequestBuilder)
  .factory('AuthorizationInterceptor', AuthorizationInterceptor)
  .factory('UnauthorizedInterceptorBuilder', UnauthorizedInterceptorBuilder)
  .name;
