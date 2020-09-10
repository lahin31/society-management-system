import React, { useContext, useEffect, useState } from 'react';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import { Link, withRouter, useLocation } from 'react-router-dom';
import AuthContext from '../../contexts/auth-context';
import './Navbar.scss';

const Navbar = (props) => {
  const [searchVal, setSearchVal] = useState('');
  const context = useContext(AuthContext);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const path = useLocation();

  useEffect(() => {
    if (context.userId) {
      setAnchorEl(null);
    }
  }, [context]);

  useEffect(() => {
    if (searchVal !== '') props.history.push('/search/' + searchVal);
  }, [props.history, searchVal]);

  const handleLogout = () => {
    context.logout();
    props.history.push('/login');
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSeachValue = (e) => {
    setSearchVal(e.target.value);
  };

  return (
    <>
      {path.pathname !== '/admin/login' ? (
        <nav className="navbar navbar-success" data-testid="navbar">
          <Link to={'/'} id="logo" data-testid="home-link">
            Society Management System
          </Link>
          {!context.token && (
            <Link to="/login" data-testid="login-link">
              <Button
                variant="contained"
                color="secondary"
                className="nav_btn"
              >
                Login
              </Button>
            </Link>
          )}
          {context.token && (
            <div className="search_field_wrap">
              {' '}
              <div className="search_field_wrap"></div>
              <input
                type="text"
                placeholder="Search"
                value={searchVal}
                onChange={handleSeachValue}
              />
            </div>
          )}
          {context.token && (
            // <Button variant="contained" color="secondary" className="nav_btn" onClick={handleLogout}>Logout</Button>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <IconButton
                aria-label="more"
                aria-controls="long-menu"
                aria-haspopup="true"
                onClick={handleClick}
              >
                <MoreVertIcon />
              </IconButton>
              <Menu
                id="simple-menu"
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                <Link
                  to={'/profile/' + context.authenticateUser.username}
                >
                  <MenuItem onClick={handleClose}>Profile</MenuItem>
                </Link>
                <MenuItem onClick={handleClose}>My account</MenuItem>
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
              </Menu>
            </div>
          )}
        </nav>
      ) : null}
    </>
  );
};

export default withRouter(Navbar);
