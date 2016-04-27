'use strict';

import findKey from 'lodash/findKey';

export default function TargetSystemResolver() {
  let systems = {};

  function register(system, url) {
    systems[system] = url;
  }

  function provider() {
    function url(system) {
      return systems[system];
    }

    function system(url) {
      return findKey(systems, (urlPrefix) => {
        return url.indexOf(urlPrefix) > -1;
      });
    }

    return {
      url: url,
      system: system
    };
  }

  return {
    register: register,
    $get: provider
  };
}
