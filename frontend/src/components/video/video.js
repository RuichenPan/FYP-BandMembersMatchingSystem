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
    // context.alertMsg('Delete success');
  };

  return (
    <div className="album-body">
      {list &&
        list.map((row, index) => {
          return (
            <div key={index} className="album-item">
              <video className="img img-cover" src={`${HttpHelper.WebSite}/uploads/${row.url}`} controls></video>
              <div className="img-delete handle bg-dark" onClick={() => deleteSource(row, index)}>
                {`x`}
              </div>
            </div>
          );
        })}
      <div className="g-center album-item a-none">
        <div className="btn btn-dark handle">Upload</div>
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
