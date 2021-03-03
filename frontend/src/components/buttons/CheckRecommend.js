import React from "react";
import { Link } from "react-router-dom";

const checkRecommendButton = ({ movie }) => {
  return (
    <Link
    className="btn w-100 btn-primary "
    to={{
      pathname: `/movies/recommendMovie/${movie.id}`
    }}
  >
    Check Recommend Movie
  </Link>)
};

export default checkRecommendButton;