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
      console.log(response);
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
