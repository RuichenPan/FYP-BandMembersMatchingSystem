import React, {useState } from "react";
import { withRouter } from "react-router-dom";
import PageTemplate from '../components/templateMovieListPage'
import {getSimilarMovies} from '../api/tmdb-api'
import AddToFavoritesButton from '../components/buttons/addToFavorites'
const SimilarPage = (props) => {
  const { id } = props.match.params;
  const [movies,SetMovies]=useState([])
  getSimilarMovies(id).then((res)=>{
    SetMovies(res)
  })
  return (
    <>
    {
      movies.length!==0 ? 
      <PageTemplate
        title="Similar Movies"
        movies={movies}  /* Changed */
        action={(movie) => {
          return <AddToFavoritesButton movie={movie} />;
        }}
      />: 
      <p>Sorry! No Similar Movies</p>
    }
</>
  
  );
};

export default withRouter(SimilarPage);