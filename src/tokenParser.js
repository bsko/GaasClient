'use strict';

import split from 'lodash/split';
import fromPairs from 'lodash/fromPairs';

import { save, decode } from './lib/token';
import { validate } from './lib/nonce';
import Error from './lib/error';

TokenParser.$inject = [
  '$location'
];

export default function TokenParser($location) {
  var parser = {
    success: function(success) {
      parser.onSuccess = success;
      return parser;
    },
    error: function(error) {
      parser.onError = error;
      return parser;
    },
    parse: parse
  };

  return parser;

  function parse() {
    const { id_token, state, error, error_description } = urlParams();

    if (id_token) {
      try {
        const { nonce, system } = decodeToken(id_token);
        if (validate(nonce)) {
          save(id_token, system);
          if (parser.onSuccess) {
            parser.onSuccess(state);
          }
        } else {
          handleError('INVALID_NONCE', 'Nonce is invalid', info(state));
        }
      } catch(e) {
        handleError('INVALID_TOKEN', 'Token is invalid', info(state));
      }
    } else if (error) {
      handleError(error, error_description, info(state));
    }
  }

  function urlParams() {
    const hash = $location.hash();
    if (hash) {
      const params = split(split(hash, '?').slice(-1)[0], '&');
      const pairs = params.map(param => split(param, '='));
      return fromPairs(pairs);
    } else {
      return $location.search();
    }
  }

  function decodeToken(token) {
    const decoded = decode(token);
    return {
      nonce: decoded.nonce,
      system: split(decoded.aud, ':')[0]
    };
  }

  function handleError(code, message, info) {
    if (parser.onError) {
      const error = new Error(code, message, info);
      parser.onError(error);
    }
  }

  function info(state) {
    return state ? { state: state } : null;
  }
}
