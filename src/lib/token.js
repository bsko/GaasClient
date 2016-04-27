'use strict';

import jwtDecode from 'jwt-decode';

export function load(system) {

  return sessionStorage.getItem(key(system));
}

export function save(token, system) {
  sessionStorage.setItem(key(system), token);
}

export function decode(token) {
  return jwtDecode(token);
}

function key(system) {
  return system ? 'token' + system : 'token';
}
