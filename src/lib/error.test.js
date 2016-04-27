'use strict';

import Error from './error';

describe('Error', function () {
  it('should be decodeable', () => {
    let json = {
      errorCode: 'X49',
      errorDescription: 'Invalid value',
      extendedInfo: {
        remaining: 4
      }
    };
    let error = Error.decode(json);

    expect(error.code).toEqual('X49');
    expect(error.message).toEqual('Invalid value');
    expect(error.info.remaining).toEqual(4);
  });
});
