import React, {useContext} from "react";
import MovieListPageTemplate from "../components/templateMovieListPage";
import AddReviewButton from '../components/buttons/addReview'
import {MoviesContext} from '../contexts/moviesContext'

const FavoriteMoviesPage = props => {
  const context = useContext(MoviesContext);
  const favorites = context.movies.filter( m => m.favorite )
  const movies = favorites;
  return (
    <>
    {
      movies.length!==0 ?
    <MovieListPageTemplate
      movies={favorites}
      title={"Favorite Movies"}
      action={movie => <AddReviewButton movie={movie} />}
    />:
    <>
    <MovieListPageTemplate
      movies={favorites}
      title={"Favorite Movies"}
      action={movie => <AddReviewButton movie={movie} />}
    />
    <p>Sorry!You have not added any movie</p>

    </>
    }
  </>
  );
};

export default FavoriteMoviesPage;