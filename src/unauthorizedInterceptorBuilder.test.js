'use strict';

describe('unauthorized interceptor', function() {
  var $http, $httpBackend, $window;

  angular
    .module('interceptorModule', [])
    .factory('UnauthorizedInterceptor', UnauthorizedInterceptorBuilder => {
      return UnauthorizedInterceptorBuilder(request => {
        return request
          .withTargetSystem('GeminiMCH')
          .withClientSystem('GIB')
          .withLocales(['en']);
      });
    })
    .config(($httpProvider, TargetSystemResolverProvider) => {
      $httpProvider.interceptors.push('UnauthorizedInterceptor');
      TargetSystemResolverProvider.register('GAAS', '/gaas/');
    });

  beforeEach(angular.mock.module('gaas-client', 'interceptorModule'));

  beforeEach(angular.mock.inject($injector => {
    $http = $injector.get('$http');
    $httpBackend = $injector.get('$httpBackend');
    $window = $injector.get('$window');
    spyOn($window.location, 'replace');
  }));

  it('should redirect to gaas', done => {
    $httpBackend.expectGET('test')
      .respond(401, {}, {'WWW-Authenticate': 'http://gaas.bank.com/authorize'});

    $http.get('test')
      .catch(() => {
        const requestUrl = $window.location.replace.calls.argsFor(0)[0];

        expect(requestUrl).toMatch('http://gaas.bank.com/authorize');
        expect(requestUrl).toMatch('nonce=');
        expect(requestUrl).toMatch('ui_locales=en');
        expect(requestUrl).toMatch('client_id=GeminiMCH%3AGIB');
        done();
      });

    $httpBackend.flush();
  });

  it('should redirect to with specific target system', done => {
    $httpBackend.expectGET('/gaas/test')
      .respond(401, {}, {'WWW-Authenticate': 'http://gaas.bank.com/authorize'});

    $http.get('/gaas/test')
      .catch(() => {
        const requestUrl = $window.location.replace.calls.argsFor(0)[0];

        expect(requestUrl).toMatch('client_id=GAAS%3AGIB');
        done();
      });

    $httpBackend.flush();
  });
});
