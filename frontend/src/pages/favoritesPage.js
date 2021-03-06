import React, { useContext, useEffect, useState } from 'react';
import Card from '../components/card/card';
import { UserContext } from '../contexts/userContext';
import './favorites.css';

const FavoritesPage = (props) => {
  const [isLoading, setIsLoading] = useState(true);
  const [fList, setFList] = useState([]);
  const context = useContext(UserContext);

  const initData = async () => {
    await context.onGetFavoritesList();
    const { list } = context.state.favorite_mine || {};
    setFList(list);
    setIsLoading(false);
  };

  useEffect(() => {
    const apiCall = async () => {
      await context.onGetFavoritesList();
      const { list } = context.state.favorite_mine || {};
      setFList(list);
      setIsLoading(false);
    };
    apiCall();
    // eslint-disable-next-line
  }, [context]);

  // const { list } = context.state.favorite_mine || {};

  return (
    <div className="favorites">
      {fList && fList.length > 0 ? (
        <div className="favorite-body">
          {fList.map((row, index) => {
            return <Card style={{ width: '16.6%' }} key={index} info={row} collection onUpdate={() => initData()} />;
          })}
        </div>
      ) : (
        !isLoading && (
          <div className="row margin-top-40">
            <div className="col1 text-center font-size-25">
              <h1>The favorite is empty, add it quickly</h1>
            </div>
          </div>
        )
      )}
    </div>
  );
};

export default FavoritesPage;
