import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";
import { gapi } from "gapi-script";

import Encode from './components/Encode/Encode';
import Decode from './components/Decode/Decode';
import Home from './components/Home/Home';
import Auth from './components/Auth/Auth';
import Activate from './components/Auth/Activate';
import Navigation from './components/Navigation/Navigation';
import Account from './components/Account/Account';
import PVD from './components/PVD/PVD';
import { Container } from 'react-bootstrap';

import './App.css';

function App() {
  gapi.load("client:auth2", () => {
    gapi.client.init({
      clientId:
        "*****.apps.googleusercontent.com",
      plugin_name: "chat",
    });
  });
  
  return (
    <Router>
      <Navigation />
      <Container fluid className="container-margin">
        <Switch>
          <Route exact path="/">
            <Home />
          </Route>
          <Route path="/encode">
            <Encode />
          </Route>
          <Route path="/decode">
            <Decode />
          </Route>
          <Route path="/auth">
            <Auth />
          </Route>
          <Route path="/account">
            <Account />
          </Route>
          <Route path="/activateUser/:hash">
            <Activate />
          </Route>
          <Route path="/PVD">
            <PVD />
          </Route>
        </Switch>
      </Container>
    </Router>
  );
}

export default App;
