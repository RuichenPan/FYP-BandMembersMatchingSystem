import React from "react";
import { Link } from "react-router-dom";
import "./actorCard.css";
import "../../globals/fontawesome";
import AddReviewButton from '../buttons/addActorReview'

const ActorCard = ({actor, action}) => {
  return (
    <div className="col-sm-3">
      <div className="card  bg-white">
      <Link to={`/actor/${actor.id}`}>
        <img
          className="card-img-tag center "
          alt={actor.name}
          src={
            actor.profile_path
              ? `https://image.tmdb.org/t/p/w500/${actor.profile_path}`
              : "./film-poster-placeholder.png"
          }
        />
        </Link>
        <div className="card-body">
          <h4 className="card-title ">{actor.name}</h4>
          {/* <p>
            <FontAwesomeIcon icon={["fas", "calendar"]} />
            <span> {actor.known_for[0].origin_country===undefined? "unknown": actor.known_for[0].origin_country}</span>
          </p>
          <p>
            <FontAwesomeIcon icon={["fas", "star"]} />
            <span> {actor.vote_average}</span>
          </p> */}
        </div>
        <div className="card-footer d-flex">
           {action(actor)}
            <AddReviewButton actor={actor}/>
        </div>
      </div>
    </div>
  );
};

export default ActorCard;