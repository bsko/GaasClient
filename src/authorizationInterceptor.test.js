'use strict';

import { save } from './lib/token';

describe('authorization interceptor', function() {
  var $http, $httpBackend;
  beforeEach(angular.mock.module('gaas-client', ($httpProvider, TargetSystemResolverProvider) => {
    $httpProvider.interceptors.push('AuthorizationInterceptor');
    TargetSystemResolverProvider.register('GeminiMCH', '/ibs/');
    TargetSystemResolverProvider.register('GAAS', '/gaas/');
  }));

  beforeEach(angular.mock.inject($injector => {
    $http = $injector.get('$http');
    $httpBackend = $injector.get('$httpBackend');
  }));

  beforeEach(() => {
    sessionStorage.clear();
  });

  it('should add Authorization header', done => {
    save('token');
    $httpBackend.expectGET('test', headers => headers.Authorization === 'Bearer token')
      .respond(200, {});

    $http.get('test')
      .then(() => done());

    $httpBackend.flush();
  });

  it('should add Authorization header for target system', done => {
    save('MCH token', 'GeminiMCH');
    save('GAAS token', 'GAAS');

    $httpBackend.expectGET('/ibs/test', headers => headers.Authorization === 'Bearer MCH token')
      .respond(200, {});

    $httpBackend.expectGET('/gaas/test', headers => headers.Authorization === 'Bearer GAAS token')
      .respond(200, {});

    $http.get('/ibs/test')
      .then(() => $http.get('/gaas/test'))
      .then(() => done());

    $httpBackend.flush();
  });

  it('should not add Authorization header when no token is available', done => {
    $httpBackend.expectGET('test', headers => !headers.Authorization)
      .respond(200, {});

    $http.get('test')
      .then(() => done());

    $httpBackend.flush();
  });
});
