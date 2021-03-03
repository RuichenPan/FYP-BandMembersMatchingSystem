import React from "react";
import { Link } from "react-router-dom";

const SimilarButton = ({ movie }) => {
  return (
    <Link
    className="btn w-100 btn-primary "
    to={{
      pathname: `/movies/similarMovie/${movie.id}`
    }}
  >
    Check Similar Page
  </Link>)
};

export default SimilarButton;