'use strict';

describe('target system resolver', function() {
  var resolver;
  beforeEach(angular.mock.module('gaas-client', TargetSystemResolverProvider => {
    TargetSystemResolverProvider.register('GeminiMCH', '/ibs/');
    TargetSystemResolverProvider.register('GAAS', '/gaas/');
  }));

  beforeEach(angular.mock.inject($injector => {
    resolver = $injector.get('TargetSystemResolver');
  }));

  it('should recognize system based on url', () => {
    const resolved = resolver.system('/ibs/accounts/13');

    expect(resolved).toEqual('GeminiMCH');
  });
});
