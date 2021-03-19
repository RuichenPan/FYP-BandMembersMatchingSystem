import React, { lazy, Suspense } from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, Redirect, Switch } from 'react-router-dom'; // CHANGED
import io from './libs/socket.io.min.js';
import '../node_modules/bootstrap/dist/css/bootstrap.css';
// import 'antd/dist/antd.css';
import './index.css';

import HomePage from './pages/homePage';
import SiteHeader from './components/siteHeader';
import { createBrowserHistory } from 'history';

import UserContentProvider from './contexts/userContext';

const history = createBrowserHistory({ basename: '/' });
const SignUp = lazy(() => import('./components/signUp'));
const Login = lazy(() => import('./components/login'));
const ProfilePage = lazy(() => import('./pages/profilePage/profilePage'));
const CheckEmailPage = lazy(() => import('./pages/checkEmailPage'));

var host = window.location.host;
if (!host.includes('herokuapp.com')) {
  host = '127.0.0.1:5300';
}
var socket = io(host, { path: '/chat', auth: { token: '' } });

const App = () => {
  return (
    <Router history={history}>
      <div className="indexPageCss container-fluid">
        <UserContentProvider history={history} socket={socket}>
          <Suspense fallback={<h1>Loading page....</h1>}>
            <SiteHeader />
            <Switch>
              <Route exact path="/signup" component={SignUp} />
              <Route exact path="/login" component={Login} />
              <Route exact path="/profile" component={ProfilePage} />
              <Route exact path="/emailcheck" component={CheckEmailPage} />
              <Route exact path="/" component={HomePage} />
              <Redirect exact from="*" to="/" />
            </Switch>
          </Suspense>
        </UserContentProvider>
      </div>
    </Router>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
