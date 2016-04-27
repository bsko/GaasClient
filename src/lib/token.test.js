'use strict';

import { save, load, decode } from './token.js';

describe('token', () => {
  beforeEach(() => {
    sessionStorage.clear();
  });

  it('should be saved to session storage', () => {
    expect(sessionStorage.getItem('token')).toBeFalsy();
    save('token');
    expect(sessionStorage.getItem('token')).toBeTruthy();
  });

  it('should be loaded from storage', () => {
    let token = 'token';
    save(token);

    expect(load()).toEqual(token);
  });

  it('should be saved for specific target system', () => {
    expect(sessionStorage.getItem('tokenGAAS')).toBeFalsy();
    save('token', 'GAAS');
    expect(sessionStorage.getItem('tokenGAAS')).toBeTruthy();
  });

  it('should be loaded for specific target system', () => {
    let token = 'token';
    save(token, 'GAAS');

    expect(load('GAAS')).toEqual(token);
  });

  it('should decode jwt', () => {
    let token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWV9.TJVA95OrM7E2cBab30RMHrHDcEfxjoYZgeFONFh7HgQ';

    expect(decode(token)).toEqual({
      sub: '1234567890',
      name: 'John Doe',
      admin: true
    });
  });
});
