import React from "react";
import PageTemplate from "../components/templateActorPage";
import ReviewForm from '../components/reviewForm'

const ActorReviewFormPage = props => {
  return (
      <PageTemplate actor={props.location.state.actor}>
          <ReviewForm actor={props.location.state.actor} />
      </PageTemplate>
  );
};
export default ActorReviewFormPage;