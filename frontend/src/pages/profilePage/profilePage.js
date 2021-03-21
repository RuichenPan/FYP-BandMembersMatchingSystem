import React, { useContext, useState, useEffect } from 'react';
import HttpHelper from '../../api/httpHelper';
import Album from '../../components/album/album';
import Card from '../../components/card/card';
import Radio from '../../components/radio/radio';
import RadioGroup from '../../components/radio/radio-group';
import SubLogo from '../../components/subLogo/subLogo';
import Video from '../../components/video/video';
import { UserContext } from '../../contexts/userContext';

const PorfilePage = (props) => {
  // eslint-disable-next-line
  const [times, setTimes] = useState(0);
  const context = useContext(UserContext);
  const [msg, setMsg] = useState('');
  const [uInfo, setUpdateUserInfo] = useState({});

  const sendData = (data) => {
    console.log(data);
    context.socket.send(data);
  };

  const getVideo = async (page, size, user_id) => {
    await context.onVideo({ page, size, user_id });
  };

  const getAlbum = async (page, size, user_id) => {
    await context.onAlbum({ page, size, user_id });
  };

  useEffect(() => {
    // get config info
    const api = async () => {
      try {
        await context.getConfigInfo();
        await context.getUserInfo();
        if (context.state.userInfo) {
          await getVideo(1, 10, context.state.userInfo.id);
          await getAlbum(1, 10, context.state.userInfo.id);
        }
        setUpdateUserInfo({ ...context.state.userInfo });
      } catch (ex) {
        console.log(ex);
      }

      context.socket.auth.token = HttpHelper.token;
      context.socket.disconnect().connect();
      context.socket.on('msg', (data) => {
        console.log('data:', data);
      });
    };
    api();
    // eslint-disable-next-line
  }, [context]);

  const handleSocket = () => {
    sendData({ msg });
  };

  const handleChange = async (field, value) => {
    if (props.isView) {
      return;
    }
    const newObj = { ...uInfo };
    newObj[field] = value;
    setUpdateUserInfo({ ...newObj });
    await context.onUpdateProfile(newObj);
  };

  const handleUploadFile = async (e) => {
    const fileInfo = await context.onUpload(e.target.files[0]);
    handleChange('avatar', fileInfo.path);
  };

  const { musicStyles = [], IAmA = [], userInfo = {} } = context.state;

  return (
    <div >
      <SubLogo />
      <div className="row">
        <input value={msg} onChange={(e) => setMsg(e.target.value)} />
        <button onClick={handleSocket}>connect</button>
      </div>
      <div className="row">
        <div className="col-3">
          <Card />
        </div>
        <div className="col-9">
          <div className="row">
            <div className="col-2 text-right">Portrait:</div>
            <div className="col-8 ">
              <div className="img img-portrait" style={{ backgroundImage: `url('${HttpHelper.WebSite}/uploads/${uInfo.avatar || ''}')` }}>
                <input className="file-upload" type="file" accept="image/*" onChange={handleUploadFile} />
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-2 text-right">Name:</div>
            <div className="col-8 ">
              <span className="padding-left-10">{userInfo.username}</span>
            </div>
          </div>

          <div className="row">
            <div className="col-2 text-right">Gender:</div>
            <div className="col-10 ">
              <span className="padding-left-10">{userInfo.gender}</span>
            </div>
          </div>
          <div className="row">
            <div className="col-2 text-right">I am a:</div>
            <div className="col-10 ">
              <RadioGroup row onChange={handleChange.bind(this, 'i_am_a')} active={uInfo.i_am_a}>
                {IAmA &&
                  IAmA.map((item) => {
                    return (
                      <Radio key={item.value} value={item.value}>
                        {item.value}
                        {'Other' === item.value && (
                          <div className="margin-top-10">
                            <input
                              value={uInfo.i_am_a_other || ''}
                              disabled={item.value !== uInfo.i_am_a}
                              onChange={(e) => {
                                handleChange('i_am_a_other', e.target.value);
                              }}
                            />
                          </div>
                        )}
                      </Radio>
                    );
                  })}
              </RadioGroup>
            </div>
          </div>

          <div className="row margin-top-40">
            <div className="col-2 text-right">Music Style:</div>
            <div className="col-10 ">
              <RadioGroup row onChange={handleChange.bind(this, 'music_style')} active={uInfo.music_style}>
                {musicStyles &&
                  musicStyles.map((item) => {
                    return (
                      <Radio key={item.value} value={item.value}>
                        {item.value}
                      </Radio>
                    );
                  })}
              </RadioGroup>
            </div>
          </div>

          <div className="row margin-top-40">
            <div className="col-2">Album</div>
            <div className="col-10">
              <Album
                small
                {...props}
                onUpload={async (type, e) => {
                  const fileInfo = await context.onUpload(e.target.files[0]);
                  await handleChange('files', [{ type, url: fileInfo.path }]);
                  await getAlbum(1, 10, context.state.userInfo.id);
                  setTimes(Date.now());
                }}
              />
            </div>
          </div>

          <div className="row margin-top-40">
            <div className="col-2">Video</div>
            <div className="col-10">
              <Video
                small
                onUpload={async (type, e) => {
                  const fileInfo = await context.onUpload(e.target.files[0]);
                  await handleChange('files', [{ type, url: fileInfo.path }]);
                  await getVideo(1, 10, context.state.userInfo.id);
                  setTimes(Date.now());
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PorfilePage;

// <div className="row">
//   <div className="col-10">
//   <nav aria-label="Page navigation example">
//     <ul className="pagination">
//       <li className="page-item"><a class="page-link" href="#">Previous</a></li>
//       <li className="page-item"><a class="page-link" href="#">1</a></li>
//       <li className="page-item"><a class="page-link" href="#">2</a></li>
//       <li className="page-item"><a class="page-link" href="#">3</a></li>
//       <li className="page-item"><a class="page-link" href="#">Next</a></li>
//     </ul>
//   </nav>
//   </div>
// </div>
