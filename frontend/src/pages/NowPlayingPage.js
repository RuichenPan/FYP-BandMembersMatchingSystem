import React, { useContext } from "react";
import PageTemplate from '../components/templateMovieListPage'
import {MoviesContext} from '../contexts/moviesContext'
import SimilarButton from '../components/buttons/Similar'

const NowPlayingMoviesPage = () => {
  const context = useContext(MoviesContext);
  const movies = context.nowplaying.filter((m) => {  
    return !("favorite" in m);
  });

  return (
    <PageTemplate
      title="Now Playing Movies"
      movies={movies}  
      action={(movie) => {
        return <SimilarButton movie={movie} />;
      }}
    />
  );
};

export default NowPlayingMoviesPage;