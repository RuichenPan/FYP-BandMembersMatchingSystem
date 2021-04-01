import React, { useContext, useEffect } from 'react';
import GoBack from '../components/GoBack/GoBack';
import { UserContext } from '../contexts/userContext';
import Util from '../util';

const VideoPage = (props) => {
  const context = useContext(UserContext);

  const getData = async ({ page = 1, size = 20 } = {}) => {
    const { id: user_id } = Util.parseQuery();
    console.log('user_id:', user_id);
    const info = await context.onVideo({ page, size, user_id });
    console.log(info);
  };
  useEffect(() => {
    getData();
  }, [context]);

  return (
    <div>
      <GoBack />
    </div>
  );
};

export default VideoPage;
