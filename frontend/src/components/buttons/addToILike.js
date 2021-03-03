import React, { useContext } from "react";
import {ActorsContext} from "../../contexts/actorsContext";
import { HeartTwoTone } from '@ant-design/icons'
const AddToILikeButton = ({ actor }) => {
  const context = useContext(ActorsContext);

  const handleAddToILike = e => {
    e.preventDefault();
    context.addToILike(actor.id);
  };
  return (
    <button
      type="button"
      className="btn w-50 btn-primary"
      onClick={handleAddToILike}
    >
      <HeartTwoTone />
    </button>
  );
};

export default AddToILikeButton;