'use strict';

import Crypto from 'crypto-js/core';
import SHA256 from 'crypto-js/sha256';

const length = 32;

export function generate() {
  let random = rand();
  sessionStorage.setItem('nonce', JSON.stringify(random.words));

  return hash(random);
}

export function validate(nonce) {
  let savedWords = sessionStorage.getItem('nonce');
  let random = Crypto.lib.WordArray.create(JSON.parse(savedWords));

  return nonce && hash(random) === nonce;
}

function rand() {
  if (window.crypto.getRandomValues) {
    let values = window.crypto.getRandomValues(new Int32Array(length));
    let array = Array.prototype.slice.call(values);
    return Crypto.lib.WordArray.create(array);
  } else {
    return Crypto.lib.WordArray.random(length * 4);
  }
}

function hash(random) {
  return SHA256(random).toString();
}
