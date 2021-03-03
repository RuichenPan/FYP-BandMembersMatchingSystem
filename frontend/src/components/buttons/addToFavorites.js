import React, { useContext } from 'react';
import { MoviesContext } from '../../contexts/moviesContext';
import { HeartTwoTone } from '@ant-design/icons';

const AddToFavoriteButton = ({ movie }) => {
  const context = useContext(MoviesContext);

  const handleAddToFavorite = (e) => {
    e.preventDefault();
    context.addToFavorites(movie.id);
  };
  return (
    <button type="button" className="btn w-100 btn-primary" onClick={handleAddToFavorite}>
      <HeartTwoTone />
    </button>
  );
};

export default AddToFavoriteButton;
