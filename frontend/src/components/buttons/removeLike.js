import React, { useContext } from "react";
import {ActorsContext} from "../../contexts/actorsContext";

const RemoveLikeButton = ({ actor }) => {
  const context = useContext(ActorsContext);

  const handleRemoveLike = e => {
    e.preventDefault();
    context.RemoveLike(actor.id);
  };
  return (
    <button
      type="button"
      className="btn w-100 btn-primary"
      onClick={handleRemoveLike}
    >
      Remove From Like
    </button>
  );
};

export default RemoveLikeButton;