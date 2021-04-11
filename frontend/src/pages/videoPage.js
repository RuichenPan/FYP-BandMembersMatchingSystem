import React, { useContext, useEffect } from 'react';
import GoBack from '../components/GoBack/GoBack';
import { UserContext } from '../contexts/userContext';
import Util from '../util';

const VideoPage = (props) => {
  const context = useContext(UserContext);

  useEffect(() => {
    const apiCall = async ({ page = 1, size = 20 } = {}) => {
      const { id: user_id } = Util.parseQuery();
      await context.onVideo({ page, size, user_id });
    };
    apiCall();
  }, [context]);

  return (
    <div>
      <GoBack />
    </div>
  );
};

export default VideoPage;
