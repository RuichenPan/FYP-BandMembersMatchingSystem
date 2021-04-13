import React, { useContext, useEffect, useState } from 'react';
import HttpHelper from '../api/httpHelper';
import GoBack from '../components/GoBack/GoBack';
import { UserContext } from '../contexts/userContext';
import Util from '../util';

const VideoPage = (props) => {
  const context = useContext(UserContext);
  const [list, setList] = useState([]);

  useEffect(() => {
    const apiCall = async ({ page = 1, size = 20 } = {}) => {
      const { id: user_id } = Util.parseQuery();
      const info = await context.onVideo({ page, size, user_id });
      const tmp = list.concat(info.list);
      setList(tmp);
    };
    apiCall();
    // eslint-disable-next-line
  }, [context]);

  // style={{ backgroundImage: `url('${HttpHelper.WebSite}/uploads/${row.url}')` }}
  return (
    <div>
      <GoBack />
      <div className="row row-wrap">
        {list && list.length > 0 ? (
          list.map((row, index) => {
            return (
              <div key={index} className="col-p-20" style={{ height: '300px' }}>
                <div style={{ padding: '5px', height: '100%', border: '1px solid #f0f0f0', margin: '5px' }}>
                  <video src={`${HttpHelper.WebSite}/uploads/${row.url}`} controls height="100%" width="100%"></video>
                </div>
              </div>
            );
          })
        ) : (
          <div className="col1 text-center font-size-20">No relevant video</div>
        )}
      </div>
    </div>
  );
};

export default VideoPage;
