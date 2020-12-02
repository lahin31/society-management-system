import React, { useState, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Switch,
} from 'react-router-dom';

import AuthContext from './contexts/auth-context';

import IndexPage from './pages/Index';
import HomePage from './pages/home/Home';
import Login from './pages/authentications/Login';
import Registration from './pages/authentications/Registration';
import ForgetPassword from './pages/authentications/ForgetPassword';
import ConfirmingAccount from './pages/authentications/ConfirmingAccount';
import ProfilePage from './pages/user/Profile';
import EditProfile from './pages/user/EditProfile';
import ContactUs from './pages/contact-us/ContactUs';
import AboutUs from './pages/about-us/AboutUs';
import ResetPassword from './pages/authentications/ResetPassword';
import Search from './pages/search/Search';

import Navbar from './components/navbar/Navbar';

import './App.scss';
import SocietyDetails from './pages/societies/society/SocietyDetails';

function App() {
  const [token, setToken] = useState('');
  const [, setRefreshToken] = useState('');
  const [userId, setUserId] = useState('');
  const [authenticateUser] = useState({});
  const [tokenExpiration, setTokenExpiration] = useState('');

  useEffect(() => {
    const accessToken = JSON.parse(
      localStorage.getItem('accessToken')
    );
    const userIdLocal = JSON.parse(localStorage.getItem('userId'));
    const tokenExp = JSON.parse(
      localStorage.getItem('tokenExpiration')
    );
    if (accessToken && userIdLocal && tokenExp) {
      setToken(accessToken);
      setUserId(userIdLocal);
      setTokenExpiration(tokenExp);
    }
  }, []);

  const login = (token, refreshToken, userId, tokenExpiratopn) => {
    setToken(token);
    setRefreshToken(refreshToken);
    setUserId(userId);
    setTokenExpiration(tokenExpiratopn);
  };

  const logout = () => {
    setToken(null);
    setRefreshToken(null);
    setUserId(null);
    setTokenExpiration(null);
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('userId');
    localStorage.removeItem('tokenExpiration');
  };

  return (
    <Router>
      <AuthContext.Provider
        value={{
          token,
          userId,
          authenticateUser,
          tokenExpiration,
          login,
          logout,
        }}
      >
        <main>
          <Navbar />
          <Switch>
            {!token && <Route path="/" exact component={IndexPage} />}
            {token && <Route path="/" exact component={HomePage} />}
            {token && (
              <Route
                path="/profile/:username"
                component={ProfilePage}
              />
            )}
            {token && (
              <Route
                path="/edit-profile/:username"
                component={EditProfile}
              />
            )}
            {token && <Route path="/search/:searchVal" component={Search} />}
            {token && <Route path="/societies/:society_id" component={SocietyDetails} />}
            {token && <Route path="/about_us" component={AboutUs} />}
            {token && <Route path="/contact_us" component={ContactUs} />}
            {!token && <Route path="/login" component={Login} />}
            {!token && (
              <Route path="/registration" component={Registration} />
            )}
            {!token && (
              <Route
                path="/forget-password"
                component={ForgetPassword}
              />
            )}
            {!token && (
              <Route
                path="/confirmation/:token"
                component={ConfirmingAccount}
              />
            )}
            {!token && (
              <Route path="/reset/:token" component={ResetPassword} />
            )}
          </Switch>
        </main>
      </AuthContext.Provider>
    </Router>
  );
}

export default App;
