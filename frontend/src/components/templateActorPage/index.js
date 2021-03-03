import React from "react";
import ActorHeader from '../headerActor'
import "./actorPage.css";

const TemplateActorPage = ({ actor, children }) => {
  return (
    <>
      <ActorHeader actor={actor} />
      <div className="row">
        <div className="col-3">
          <img
            src={
              actor.profile_path
                ? `https://image.tmdb.org/t/p/w500/${actor.profile_path}`
                : "./film-poster-placeholder.png"
            }
            className="actor"
            alt={actor.name}
          />
        </div>
        <div className="col-9">{children}</div>
      </div>
    </>
  );
};

export default TemplateActorPage;