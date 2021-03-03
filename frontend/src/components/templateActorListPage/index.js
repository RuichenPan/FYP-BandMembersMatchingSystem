import React from "react";
import Header from "../headerActorList";
import ActorList from "../actorList";

const ActorListPageTemplate = ({actors, name, action}) => {

  const displayedActors = actors

  return (
    <>
      <Header name={name} numActors={displayedActors.length} />
      <ActorList
       action={action}
       actors={displayedActors}
    />
    </>
  );
};

export default ActorListPageTemplate ;