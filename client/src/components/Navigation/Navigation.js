import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';
import { NavLink } from 'react-router-dom';
import { Navbar, Nav, NavDropdown, Image } from 'react-bootstrap';
import logo from '../../images/brand-logo.png';
import decode from 'jwt-decode';

import './styles.css';

const Navigation = () => {
  const [user, setuser] = useState(JSON.parse(localStorage.getItem('profile')));
  const dispatch = useDispatch();
  const history = useHistory();
  const location = useLocation();

  useEffect(() => {
    const token = user?.token;

    if (token) {
      const decodedToken = decode(token);

      if (decodedToken.exp * 1000 < new Date().getTime()) logout();
    }

    setuser(JSON.parse(localStorage.getItem('profile')));
  }, [location]);

  const logout = () => {
    dispatch({ type: 'LOGOUT' });

    history.push('/');

    setuser(null);
  }


  return (
    <div className="w-100 m-0 fixed-top">
      <Navbar collapseOnSelect expand="lg" className="navbar-top" variant="dark">
        <Navbar.Brand className="brand-container"><NavLink className="text-white brand-link" to="/" ><Image className="brand-logo" src={logo} /></NavLink></Navbar.Brand>
        <Navbar.Toggle className="ml-auto" aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="nav-margin">
            <NavLink activeClassName='navbar-link-active active' to="/encode" className="nav-link">Ukryj wiadomość</NavLink>
            <NavLink activeClassName='navbar-link-active active' to="/decode" className="nav-link">Odczytaj wiadomość</NavLink>
            <NavLink activeClassName='navbar-link-active active' to="/PVD" className="nav-link">Opis metody</NavLink>
          </Nav>
        </Navbar.Collapse>
        {user !== null && (
          <Nav>

          </Nav>
        )}
        <Navbar.Collapse id="responsive-navbar-nav" className="justify-content-end">
          <Nav className="mr-5">
            {user === null ? (
              <NavLink activeClassName='navbar-link-active active' to="/auth" className="nav-link justify-content-end">Zaloguj</NavLink>
            ) :
              (
                <NavDropdown className="top-navbar-dropdown" title={user?.token?.length > 500 ? user?.result?.givenName : user?.result?.name}>
                  <NavLink to="/account" activeClassName='navbar-link-active active' className="nav-link dropdown-nav-link">Konto</NavLink>
                  <Nav.Link className="dropdown-nav-link" onClick={logout} >Wyloguj</Nav.Link>
                </NavDropdown>
              )
            }
          </Nav>
        </Navbar.Collapse>
      </Navbar>
      <div className="navbar-border"></div>
    </div>
  )
}

export default Navigation
