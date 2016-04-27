'use strict';

import { generate, validate } from './nonce.js';

describe('nonce', () => {
  beforeEach(() => {
    sessionStorage.clear();
  });

  it('be 64 character long', () => {
    let nonce = generate();

    expect(nonce.length).toEqual(64);
  });

  it('be saved to session storage', () => {
    expect(sessionStorage.getItem('nonce')).toBeFalsy();
    generate();
    expect(sessionStorage.getItem('nonce')).toBeTruthy();
  });

  it('be validated', () => {
    let nonce = generate();

    expect(validate(nonce)).toEqual(true);
  });
});
