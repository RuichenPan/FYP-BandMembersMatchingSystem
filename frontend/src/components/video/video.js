import React, { useContext, useEffect, useState } from 'react';
import HttpHelper from '../../api/httpHelper';
import { UserContext } from '../../contexts/userContext';

const Video = (props) => {
  // eslint-disable-next-line
  const [, setTimes] = useState(0);
  const [list, setList] = useState([]);
  const context = useContext(UserContext);
  console.log('video:', context.state.video);
  useEffect(() => {
    const { video } = context.state;
    const { list = [] } = video || {};
    setList(list);

    // eslint-disable-next-line
  }, [context.state.video]);

  const deleteSource = async (row, index) => {
    await context.onSourceDelete(row, index, 'video');
    setTimes(Date.now());
  };

  return (
    <div className="album-body">
      {list &&
        list.map((row, index) => {
          return (
            <div key={index} className="album-item">
              <div className="img img-cover" style={{ backgroundImage: `url('${HttpHelper.WebSite}/uploads/${row.url}')` }}>
                <div className="img-delete handle" onClick={() => deleteSource(row, index)}>
                  {`x`}
                </div>
              </div>
            </div>
          );
        })}
      <div className="g-center album-item handle">
        Upload
        <input
          className="file-upload"
          type="file"
          accept="video/*"
          onChange={(e) => {
            props.onUpload && props.onUpload('video', e);
          }}
        />
      </div>
    </div>
  );
};

export default Video;
