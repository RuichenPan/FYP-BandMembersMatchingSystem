import React, { useContext} from "react";
import ActorPageTemplate from '../components/templateActorListPage'
import {ActorsContext} from '../contexts/actorsContext'
import AddToILikeButton from '../components/buttons/addToILike'


const ActorPage = () => {
  const context = useContext(ActorsContext);
  const actors = context.actors.filter( m => !m.like );
  return (
    <ActorPageTemplate
      name="Popular People"
      actors={actors}  /* Changed */
      action={(actor) => {
        return <AddToILikeButton actor={actor} />;
      }}
    />
  );
};

export default ActorPage;