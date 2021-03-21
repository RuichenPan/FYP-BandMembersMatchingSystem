import React, { useContext, useEffect, useState } from 'react';
import Card from '../components/card/card';
import { UserContext } from '../contexts/userContext';

const FavoritesPage = (props) => {
  const [, setTimes] = useState(0);
  const context = useContext(UserContext);
  useEffect(() => {
    const callApi = async () => {
      await context.onGetFavoritesList();
      setTimes(Date.now());
    };

    callApi();
  }, [context]);

  const { list } = context.state.favorite_mine || {};
  console.log('context.state:', context.state);
  return (
    <div className="favorite-body">
      {list &&
        list.map((row, index) => {
          return <Card key={index} info={row} />;
        })}
    </div>
  );
};

export default FavoritesPage;
