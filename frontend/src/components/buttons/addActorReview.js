import React from "react";
import { Link } from "react-router-dom";

const ActorReviewButton = ({ actor }) => {
  return (
    <Link
      className="btn w-100 btn-primary "
      to={{
        pathname: `/reviews/actorform`,
        state: {
          actor: actor
        }
      }}
    >
      Write a Review
    </Link>
  );
};

export default ActorReviewButton;