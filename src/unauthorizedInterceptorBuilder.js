'use strict';

UnauthorizedInterceptorBuilder.$inject = [
  '$q',
  '$log',
  'RequestBuilder',
  'TargetSystemResolver'
];

export default function UnauthorizedInterceptorBuilder($q, $log, RequestBuilder, TargetSystemResolver) {
  return function(builder) {
    function redirect(response) {
      $log.info('Intercepting. ' + response.config.url);
      const url = response.headers('www-authenticate');
      //$log.info(response);
      var headers = response.headers();
      $log.info('response headers:');
      angular.forEach(headers, function(item, key) {
        $log.info(key + ' : ' + item);
      });
      $log.info('www-authenticate header: ' + url);
      if (url) {
        const system = TargetSystemResolver.system(response.config.url);
        $log.info('System: ' + system);

        RequestBuilder(url, request => {
          return builder(request)
            .withTargetSystem(system);
        });
      }
      return $q.reject(response);
    }

    return {
      responseError: redirect
    };
  };
}
