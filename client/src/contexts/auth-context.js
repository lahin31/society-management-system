import React from 'react';

export default React.createContext({
  token: null,
  userId: null,
  tokenExpiration: null,
  authenticatedUser: {},
  // eslint-disable-next-line
  login: (token, userId, tokenExpiration) => {},
  logout: () => {},
});
