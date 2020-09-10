import React from 'react';

export default React.createContext({
  adminAccessToken: null,
  adminId: null,
  adminTokenExpiration: null,
  // eslint-disable-next-line
  adminLogin: (adminAccessToken, adminId, adminTokenExpiration) => {},
  adminLogout: () => {},
});
