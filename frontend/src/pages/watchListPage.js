import React, {useContext} from "react";
import MovieListPageTemplate from "../components/templateMovieListPage";
import CheckRecommendButton from '../components/buttons/CheckRecommend'
import {MoviesContext} from '../contexts/moviesContext'

const WatchListMoviesPage = props => {
  const context = useContext(MoviesContext);
  const watchList = context.upcoming.filter( m => m.upcoming )
  return (
    <MovieListPageTemplate
      movies={watchList}
      title={"Watch List Movies"}
      action={movie => <CheckRecommendButton movie={movie} />}
    />

  );
};

export default WatchListMoviesPage;