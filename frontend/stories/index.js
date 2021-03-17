import React from 'react';
import { storiesOf } from '@storybook/react';
import '../node_modules/bootstrap/dist/css/bootstrap.css';
import MovieCard from '../src/components/movieCard';
import FilterControls from '../src/components/filterControls';
import MoviesHeader from '../src/components/headerMovieList';
import MovieList from '../src/components/movieList';
import ActorList from '../src/components/actorList';
import MovieDetails from '../src/components/movieDetails';
import ActorDetails from '../src/components/actorDetails';
import MovieHeader from '../src/components/headerMovie';
import ActorHeader from '../src/components/headerActor';
import ActorHeaderList from '../src/components/headerActorList';
import TemplateActorListPage from '../src/components/templateActorListPage';
import { MemoryRouter } from 'react-router';
import GenresContextProvider from '../src/contexts/genresContext';
import { action } from '@storybook/addon-actions';
import SiteHeader from '../src/components/siteHeader';
import ActorCard from '../src/components/actorCard';
import Login from '../src/components/login';
import { FirebaseAppProvider } from 'reactfire';
import firebaseConfig from '../src/firebaseConfig';
import Signup from '../src/components/signUp';

const sample = {
  adult: false,
  backdrop_path: '/5Iw7zQTHVRBOYpA0V6z0yypOPZh.jpg',
  belongs_to_collection: {
    id: 10,
    name: 'Star Wars Collection',
    poster_path: '/iTQHKziZy9pAAY4hHEDCGPaOvFC.jpg',
    backdrop_path: '/d8duYyyC9J5T825Hg7grmaabfxQ.jpg',
  },
  budget: 200000000,
  genres: [
    {
      id: 14,
      name: 'Fantasy',
    },
    {
      id: 12,
      name: 'Adventure',
    },
    {
      id: 878,
      name: 'Science Fiction',
    },
    {
      id: 28,
      name: 'Action',
    },
  ],
  homepage: 'https://www.starwars.com/films/star-wars-episode-viii-the-last-jedi',
  id: 181808,
  imdb_id: 'tt2527336',
  original_language: 'en',
  original_title: 'Star Wars: The Last Jedi',
  overview:
    'Rey develops her newly discovered abilities with the guidance of Luke Skywalker, who is unsettled by the strength of her powers. Meanwhile, the Resistance prepares to do battle with the First Order.',
  popularity: 44.208,
  poster_path: '/kOVEVeg59E0wsnXmF9nrh6OmWII.jpg',
  production_companies: [
    {
      id: 1,
      logo_path: '/o86DbpburjxrqAzEDhXZcyE8pDb.png',
      name: 'Lucasfilm',
      origin_country: 'US',
    },
    {
      id: 11092,
      logo_path: null,
      name: 'Ram Bergman Productions',
      origin_country: 'US',
    },
    {
      id: 2,
      logo_path: '/wdrCwmRnLFJhEoH8GSfymY85KHT.png',
      name: 'Walt Disney Pictures',
      origin_country: 'US',
    },
  ],
  production_countries: [
    {
      iso_3166_1: 'US',
      name: 'United States of America',
    },
  ],
  release_date: '2017-12-13',
  revenue: 1332459537,
  runtime: 152,
  spoken_languages: [
    {
      iso_639_1: 'en',
      name: 'English',
    },
  ],
  status: 'Released',
  tagline: 'Darkness rises... and light to meet it',
  title: 'Star Wars: The Last Jedi',
  video: false,
  vote_average: 7,
  vote_count: 9692,
};

const actor = {
  adult: false,
  gender: 1,
  id: 1734,
  known_for_department: 'Acting',
  name: "Annette O'Toole",
  popularity: 56.83,
  profile_path: '/z5BS5EeuhpM2KGFfUjOhVXtjmMy.jpg',
  birthday: '1952-04-01',
  deathday: null,
  homepage: null,
  imdb_id: 'nm0001578',
  place_of_birth: 'Houston, Texas, USA',
};
storiesOf('Home Page/MovieCard', module)
  .addDecorator((story) => <MemoryRouter initialEntries={['/']}>{story()}</MemoryRouter>)
  .add('default', () => <MovieCard movie={sample} action={(movie) => <button className="btn w-100 btn-primary">Test</button>} />)
  .add('exception', () => {
    const sampleNoPoster = { ...sample, poster_path: undefined };
    return <MovieCard movie={sampleNoPoster} action={(movie) => <button className="btn w-100 btn-primary">Test</button>} />;
  });
