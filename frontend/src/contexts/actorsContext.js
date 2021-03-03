import React, { useEffect, createContext, useReducer } from 'react';
import { getPopularActors } from '../api/tmdb-api';

export const ActorsContext = createContext(null);

const reducer = (state, action) => {
  switch (action.type) {
    case 'add-ILike':
      return {
        actors: state.actors.map((m) => (m.id === action.payload.actors.id ? { ...m, like: true } : m)),
      };
    case 'Remove-ILike':
      return {
        actors: state.actors.map((m) => (m.id === action.payload.actors.id ? { ...m, like: false } : m)),
      };
    case 'load':
      return { actors: action.payload.actors };
    default:
      return state;
  }
};

const ActorsContextProvider = (props) => {
  const [state, dispatch] = useReducer(reducer, { actors: [] });
  const addToILike = (actorId) => {
    const index = state.actors.map((m) => m.id).indexOf(actorId);
    dispatch({ type: 'add-ILike', payload: { actors: state.actors[index] } });
  };
  const RemoveLike = (actorId) => {
    const index = state.actors.map((m) => m.id).indexOf(actorId);
    dispatch({ type: 'Remove-ILike', payload: { actors: state.actors[index] } });
  };

  useEffect(() => {
    getPopularActors().then((actors) => {
      dispatch({ type: 'load', payload: { actors } });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <ActorsContext.Provider
      value={{
        actors: state.actors,
        like: state.like,
        addToILike: addToILike,
        RemoveLike: RemoveLike,
      }}
    >
      {props.children}
    </ActorsContext.Provider>
  );
};

export default ActorsContextProvider;
