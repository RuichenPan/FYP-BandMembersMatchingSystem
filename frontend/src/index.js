import React, { lazy, Suspense } from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, Redirect, Switch } from 'react-router-dom'; // CHANGED
import io from './libs/socket.io.min.js';
import '../node_modules/bootstrap/dist/css/bootstrap.css';
import 'antd/dist/antd.css';
import './index.css';

import HomePage from './pages/homePage';
import SiteHeader from './components/siteHeader';
import { createBrowserHistory } from 'history';
import UserContentProvider from './contexts/userContext';
const history = createBrowserHistory({ basename: '/' });
const SignUp = lazy(() => import('./components/signUp'));
const Login = lazy(() => import('./components/login'));
const ProfilePage = lazy(() => import('./pages/profilePage'));
const CheckEmailPage = lazy(() => import('./pages/checkEmailPage'));
const FavoritesPage = lazy(() => import('./pages/favoritesPage'));
const MapPage = lazy(() => import('./pages/mapPage'));
const PersonDetailPage = lazy(() => import('./pages/personDetailPage'));
const VideoPage = lazy(() => import('./pages/videoPage'));
const AlbumPage = lazy(() => import('./pages/albumPage'));
const ChatPage = lazy(() => import('./pages/chatPage'));

var host = window.location.host;
if (!host.includes('herokuapp.com')) {
  host = '127.0.0.1:5300';
}
const socket = io(host, { reconnection: true, path: '/chat', auth: { token: '' } });

const App = () => {
  return (
    <Router history={history}>
      <div className="indexPageCss container">
        <UserContentProvider history={history} socket={socket}>
          <Suspense fallback={<h1>Loading page....</h1>}>
            <SiteHeader />
            <Switch>
              <Route exact path="/signup" component={SignUp} />
              <Route exact path="/login" component={Login} />
              <Route exact path="/profile" component={ProfilePage} />
              <Route exact path="/emailcheck" component={CheckEmailPage} />
              <Route exact path="/favorites" component={FavoritesPage} />
              <Route exact path="/map" component={MapPage} />
              <Route exact path="/person" component={PersonDetailPage} />
              <Route exact path="/album" component={AlbumPage} />
              <Route exact path="/video" component={VideoPage} />
              <Route exact path="/chat" component={ChatPage} />
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
