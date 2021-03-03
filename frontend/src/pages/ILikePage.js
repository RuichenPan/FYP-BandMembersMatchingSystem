import React, {useContext} from "react";
import ActorPageTemplate from '../components/templateActorListPage'
import RemoveLikeButton from '../components/buttons/removeLike'
import {ActorsContext} from '../contexts/actorsContext'

const ILikePage = props => {
  const context = useContext(ActorsContext);
  const ilike = context.actors.filter( m => m.like )
  let actors = ilike;
  
  return (
    <>
    {
      actors.length!==0 ?
    <ActorPageTemplate
      actors={ilike}
      name={"Favorite Actors"}
      action={actor => <RemoveLikeButton actor={actor} />}
    />:
    <>
    <ActorPageTemplate
      actors={ilike}
      name={"Favorite Actors"}
      action={actor => <RemoveLikeButton actor={actor} />}
    />
    <p>Sorry!You have not added any favorite actor</p>
    </>
    }
  </>
  );
};

export default ILikePage;