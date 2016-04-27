'use strict';

import { load } from './lib/token';
import { generate } from './lib/nonce';
import Crypto from 'crypto-js';

describe('token parser', function() {
  var $location, parser;
  beforeEach(angular.mock.module('gaas-client'));
  beforeEach(angular.mock.inject($injector => {
    $location = $injector.get('$location');
    parser = $injector.get('TokenParser');
  }));

  beforeEach(() => {
    sessionStorage.clear();
  });

  it('should validate token with valid nonce', () => {
    const nonce = generate();
    const token = createToken({nonce: nonce});

    $location.url('http://bank.com/accounts#id_token=' + token);
    parser.parse();

    expect(load()).toEqual(token);
  });

  it('should save token for requested target system', () => {
    const nonce = generate();
    const token = createToken({
      aud: 'GeminiMCH:GIB',
      nonce: nonce
    });

    $location.url('http://bank.com/accounts#id_token=' + token);
    parser.parse();

    expect(load('GeminiMCH')).toEqual(token);
  });

  it('should reject invalid token', () => {
    $location.url('http://bank.com/accounts#id_token=token');
    parser
      .error(error => {
        expect(error.code).toEqual('INVALID_TOKEN');
      })
      .parse();

    expect(load()).toBeFalsy();
  });

  it('should reject token with invalid nonce', () => {
    const token = createToken({nonce: 'fake nonce'});

    $location.url('http://bank.com/accounts#id_token=' + token);
    parser
      .error(error => {
        expect(error.code).toEqual('INVALID_NONCE');
      })
      .parse();

    expect(load()).toBeFalsy();
  });

  it('should handle redirect with error', () => {
    $location.url('http://bank.com/accounts#error=error&error_description=description');
    parser
      .error(error => {
        expect(error.code).toEqual('error');
        expect(error.message).toEqual('description');
      })
      .parse();

    expect(load()).toBeFalsy();
  });

  it('should parse token from url with hashbang', () => {
    const nonce = generate();
    const token = createToken({ nonce: nonce });

    $location.url('http://bank.com/#/accounts/123?id_token=' + token);
    parser.parse();

    console.log(sessionStorage.getItem('nonce'));
    expect(load()).toEqual('token');
  });


  it('should parse error from url with hashbang', () => {
    $location.url('http://bank.com/#!/accounts/123?error=error&error_description=description');
    parser
      .error(error => {
        expect(error.code).toEqual('error');
        expect(error.message).toEqual('description');
      })
      .parse();

    expect(load()).toBeFalsy();
  });

});

function createToken(data) {
  const header = {
    'alg': 'HS256',
    'typ': 'JWT'
  };

  const stringifiedHeader = Crypto.enc.Utf8.parse(JSON.stringify(header));
  const encodedHeader = base64url(stringifiedHeader);

  const stringifiedData = Crypto.enc.Utf8.parse(JSON.stringify(data));
  const encodedData = base64url(stringifiedData);

  return encodedHeader + '.' + encodedData + '.TJVA95OrM7E2cBab30RMHrHDcEfxjoYZgeFONFh7HgQ';
}

// Helper function for test jwt token creation
function base64url(source) {
  // Encode in classical base64
  let encodedSource = Crypto.enc.Base64.stringify(source);

  // Remove padding equal characters
  encodedSource = encodedSource.replace(/=+$/, '');

  // Replace characters according to base64url specifications
  encodedSource = encodedSource.replace(/\+/g, '-');
  encodedSource = encodedSource.replace(/\//g, '_');

  return encodedSource;
}
