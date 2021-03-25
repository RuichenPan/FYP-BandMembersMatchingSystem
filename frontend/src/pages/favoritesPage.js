import React, { useContext, useEffect, useState } from 'react';
import Card from '../components/card/card';
import { UserContext } from '../contexts/userContext';

const FavoritesPage = (props) => {
  const [, setTimes] = useState(0);
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
    initData();
  }, [context]);

  // const { list } = context.state.favorite_mine || {};
  console.log('isLoading:', isLoading);
  return (
    <div>
      {fList && fList.length > 0 ? (
        <div className="favorite-body">
          {fList.map((row, index) => {
            return <Card key={index} info={row} collection onUpdate={() => initData()} />;
          })}
        </div>
      ) : (
        !isLoading && (
          <div className="row margin-top-40">
            <div className="col1 text-center ggs-font-size-">
              <h1>The favorite is empty, add it quickly</h1>
            </div>
          </div>
        )
      )}
    </div>
  );
};

export default FavoritesPage;
