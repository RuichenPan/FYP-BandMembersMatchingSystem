import React, { useContext, useEffect, useState } from 'react';
import GoBack from '../components/GoBack/GoBack';
import MyImage from '../components/MyImage/MyImage';
import { UserContext } from '../contexts/userContext';
import Util from '../util';

const AlbumPage = (props) => {
  const context = useContext(UserContext);
  const [list, setList] = useState([]);

  const initData = async ({ page = 1, size = 20 } = {}) => {
    const { id: user_id } = Util.parseQuery();
    const info = await context.onAlbum({ page, size, user_id });
    console.log(info);
    const tmp = list.concat(info.list);
    setList(tmp);
  };

  useEffect(() => {
    initData();
  }, [context]);
  return (
    <div className="albumPagebody">
      <GoBack />

      <div className="row row-wrap">
        {list &&
          list.map((row, index) => {
            
            return (
              <div key={index} className="col-p-20" style={{ height: '300px' }}>
                <div style={{ padding: '5px', width: '100%', height: '100%' }}>
                  <MyImage avatar={row.url} />
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default AlbumPage;
