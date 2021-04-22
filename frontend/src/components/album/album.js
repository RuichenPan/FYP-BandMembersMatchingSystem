import React, { useContext, useEffect, useState } from 'react';
import HttpHelper from '../../api/httpHelper';
import { UserContext } from '../../contexts/userContext';

const Album = (props) => {
  // eslint-disable-next-line
  const [, setTimes] = useState(0);
  const [list, setList] = useState([]);
  const context = useContext(UserContext);
  // console.log('album:', context.state);
  useEffect(() => {
    const { album } = context.state;
    const { list = [] } = album || {};
    setList(list);

    // eslint-disable-next-line
  }, [context.state.album]);

  const deleteSource = async (row, index) => {
    await context.onSourceDelete(row, index, 'album');
    console.log(index, context.state.album.list);
    setTimes(Date.now());
    // context.alertMsg('Delete success');
  };

  return (
    <div className="album-body">
      {list &&
        list.map((row, index) => {
          return (
            <div key={index} className="album-item">
              <div className="img img-cover" style={{ backgroundImage: `url('${HttpHelper.WebSite}/uploads/${row.url}')` }}>
                <div className="img-delete handle bg-dark" onClick={() => deleteSource(row, index)}>
                  {`x`}
                </div>
              </div>
            </div>
          );
        })}
      <div className="g-center album-item handle a-none">
        <div className="btn btn-dark">Upload</div>
        <input
          className="file-upload"
          type="file"
          accept="image/*"
          onChange={(e) => {
            props.onUpload('album', e);
          }}
        />
      </div>
    </div>
  );
};

export default Album;
