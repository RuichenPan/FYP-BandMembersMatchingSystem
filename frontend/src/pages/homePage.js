import React, { useContext, useEffect, useState } from 'react';
import { UserContext } from '../contexts/userContext';
import Card from '../components/card/card';

const MovieListPage = () => {
  const [, setTimes] = useState(0);
  const context = useContext(UserContext);

  useEffect(() => {
    const apiCall = async () => {
      await context.onHomeData();
      setTimes(Date.now());
    };
    apiCall();
  }, [context]);

  const { list = [] } = context.state.home || {};
  return (
    <div className="home-body">
      {list &&
        list.map((row, index) => {
          return <Card key={index} info={row} hideChat onUpdate={() => setTimes(Date.now())} />;
        })}
    </div>
  );
};

export default MovieListPage;
