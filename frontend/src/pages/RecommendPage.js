import React, {useState} from "react";
import { withRouter } from "react-router-dom";
import PageTemplate from '../components/templateMovieListPage'
import {getRecommendMovies} from '../api/tmdb-api'
import AddToWatchListButton from '../components/buttons/addToWatchList'

const RecommendPage = (props) => {
  const { id } = props.match.params;
  const [movies,SetMovies]=useState([])
  getRecommendMovies(id).then((res)=>{
    SetMovies(res)
  })
    
    return (
      <PageTemplate
        title="Recommend Movies"
        movies={movies} 
        action={(movie) => {
          return <AddToWatchListButton movie={movie} />;
        }}
      />
    
    );
  };
  
  export default withRouter(RecommendPage);