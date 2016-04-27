'use strict';

describe('request builder', function() {
  var $window, RequestBuilder;

  beforeEach(angular.mock.module('gaas-client'));

  beforeEach(angular.mock.inject($injector => {
    $window = $injector.get('$window');
    RequestBuilder = $injector.get('RequestBuilder');
    spyOn($window.location, 'replace');
  }));

  it('should redirect to gaas', () => {
    RequestBuilder('http://gaas.bank.com/authorize', request => {
      return request
        .withTargetSystem('GAAS')
        .withClientSystem('WAC')
        .withLocales(['en', 'sk']);
    });

    const requestUrl = $window.location.replace.calls.argsFor(0)[0];

    expect(requestUrl).toMatch('http://gaas.bank.com/authorize');
    expect(requestUrl).toMatch('nonce=');
    expect(requestUrl).toMatch('ui_locales=en%20sk');
    expect(requestUrl).toMatch('client_id=GAAS%3AWAC');
  });
});
