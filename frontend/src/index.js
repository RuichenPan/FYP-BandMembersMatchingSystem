import React, { lazy, Suspense } from 'react';
import './index.css';
import io from './libs/socket.io.min.js';
import ReactDOM from 'react-dom';
import { Router, Route, Redirect, Switch } from 'react-router-dom'; // CHANGED
import FavoriteMoviesPage from './pages/favoritesMoviesPage'; // NEW
import '../node_modules/bootstrap/dist/css/bootstrap.css';
import HomePage from './pages/homePage';
import MoviePage from './pages/movieDetailsPage';
import ActorPage from './pages/actorDetailsPage';
import MovieReviewPage from './pages/movieReviewPage';
import SiteHeader from './components/siteHeader';
import { createBrowserHistory } from 'history';

import MoviesContextProvider from './contexts/moviesContext';
import GenresContextProvider from './contexts/genresContext';
import ActorsContextProvider from './contexts/actorsContext';

import AddMovieReviewPage from './pages/addMovieReviewPage';
import AddActorReviewPage from './pages/addActorReviewPage';

import { FirebaseAppProvider } from 'reactfire';
import firebaseConfig from './firebaseConfig';

import 'antd/dist/antd.css';
import UserContentProvider from './contexts/userContext';

const history = createBrowserHistory({ basename: '/' });

const UpcomingPage = lazy(() => import('./pages/UpcomingPage'));
const TopRatedPage = lazy(() => import('./pages/topRatedPage'));
const similarMovie = lazy(() => import('./pages/similarMoviePage'));
const WatchListPage = lazy(() => import('./pages/watchListPage'));
const RecommendPage = lazy(() => import('./pages/RecommendPage'));
const NowPlayingMovisPage = lazy(() => import('./pages/NowPlayingPage'));
const PopularActorsPage = lazy(() => import('./pages/PopularActorPage'));
const LikeActors = lazy(() => import('./pages/ILikePage'));
const SignUp = lazy(() => import('./components/signUp'));
const Login = lazy(() => import('./components/login'));
const ProfilePage = lazy(() => import('./pages/profilePage'));
const CheckEmailPage = lazy(() => import('./pages/checkEmailPage'));

var host = window.location.host;
if (!host.includes('herokuapp.com')) {
  host = '127.0.0.1:5300';
}
var socket = io(host, { path: '/chat', auth: { token: '' } });

const App = () => {
  return (
    <FirebaseAppProvider firebaseConfig={firebaseConfig}>
      <Router history={history}>
        <div className="jumbotron_1 indexPageCss container-fluid">
          <MoviesContextProvider>
            <GenresContextProvider>
              <ActorsContextProvider>
                <UserContentProvider history={history} socket={socket}>
                  <Suspense fallback={<h1>Loading page....</h1>}>
                    <SiteHeader />
                    <Switch>
                      <Route exact path="/reviews/form" component={AddMovieReviewPage} />
                      <Route exact path="/reviews/actorform" component={AddActorReviewPage} />
                      <Route exact path="/reviews/:id" component={MovieReviewPage} />
                      <Route exact path="/movies/favorites" component={FavoriteMoviesPage} />
                      <Route exact path="/movies/watchList" component={WatchListPage} />
                      <Route exact path="/movies/recommendMovie/:id" component={RecommendPage} />
                      <Route exact path="/movies/nowplaying" component={NowPlayingMovisPage} />
                      <Route exact path="/actors" component={PopularActorsPage} />
                      <Route exact path="/actors/favorites" component={LikeActors} />
                      <Route exact path="/movies/Upcoming" component={UpcomingPage} />
                      <Route exact path="/movies/toprated" component={TopRatedPage} />
                      <Route exact path="/movies/similarMovie/:id" component={similarMovie} />
                      <Route exact path="/signup" component={SignUp} />
                      <Route exact path="/login" component={Login} />
                      <Route exact path="/profile" component={ProfilePage} />
                      <Route exact path="/emailcheck" component={CheckEmailPage} />
                      <Route exact path="/movies/:id" component={MoviePage} />
                      <Route exact path="/actor/:id" component={ActorPage} />

                      <Route exact path="/" component={HomePage} />
                      <Redirect exact from="*" to="/" />
                    </Switch>
                  </Suspense>
                </UserContentProvider>
              </ActorsContextProvider>
            </GenresContextProvider>{' '}
          </MoviesContextProvider>
        </div>
      </Router>
    </FirebaseAppProvider>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
