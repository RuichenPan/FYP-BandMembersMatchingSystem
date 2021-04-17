import React, { useContext, useState, useEffect } from 'react';
import HttpHelper from '../api/httpHelper';
import Album from '../components/album/album';
import Radio from '../components/radio/radio';
import RadioGroup from '../components/radio/radio-group';
import Video from '../components/video/video';
import { UserContext } from '../contexts/userContext';
import './profilePage.css';

const ProfilePage = (props) => {
  // eslint-disable-next-line
  const [, setTimes] = useState(0);
  const context = useContext(UserContext);
  const [uInfo, setUpdateUserInfo] = useState({});

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
          await getVideo(1, 50, context.state.userInfo.id);
          await getAlbum(1, 50, context.state.userInfo.id);
        }
        setUpdateUserInfo({ ...context.state.userInfo });
      } catch (ex) {
        console.log(ex);
      }
    };
    api();
    // eslint-disable-next-line
  }, [context]);

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

  const { musicStyles = [], IAmA = [] } = context.state || {};

  return (
    <div className="profileCss">
      <div className="row margin-top-20">
        <div className="col-4 row">
          <div className="col-3"></div>
          <div className="col-8">
            <div className="img img-portrait" style={{ backgroundImage: `url('${HttpHelper.WebSite}/uploads/${uInfo.avatar || ''}')` }}>
              <input className="file-upload" type="file" accept="image/*" onChange={handleUploadFile} />
            </div>
            <div className="text-center margin-top-20">Portrait</div>
            <div className="text-center handle margin-top-20" onClick={() => context.switchPage('/person', { id: uInfo.id })}>
              Message
            </div>
          </div>
          <div className="col-1"></div>
        </div>
        <div className="col-8">
          <div className="row margin-top-10 align-center">
            <div className="pp-label">Name:</div>
            <div className="col-3 ">
              <span className="padding-left-10">{uInfo.username}</span>
            </div>

            <div className="pp-label">Gender:</div>
            <div className="col-3 ">
              <RadioGroup row onChange={handleChange.bind(this, 'gender')} active={uInfo.gender}>
                {['Male', 'Female'].map((item) => {
                  return (
                    <Radio key={item} value={item}>
                      {item}
                    </Radio>
                  );
                })}
              </RadioGroup>
            </div>
          </div>

          <div className="row margin-top-10 align-center">
            <div className="pp-label">Address:</div>
            <div className="row col-8 ">
              <input type="text" className="input margin-right-10" disabled value={uInfo.address || ''} />
              {uInfo.id && <div className="handle icon icon-position" onClick={() => context.switchPage(`map/?lat=${uInfo.lat || ''}&lon=${uInfo.lon || ''}&isEdit=1&id=${uInfo.id}`)}></div>}
            </div>
          </div>
          <div className="row margin-top-10">
            <div className="pp-label">I am a:</div>
            <div className="col-8 ">
              <RadioGroup row onChange={handleChange.bind(this, 'i_am_a')} active={uInfo.i_am_a}>
                {IAmA &&
                  IAmA.map((item) => {
                    return (
                      <Radio key={item.value} value={item.value}>
                        {item.value}
                        {'Other' === item.value && (
                          <div className="margin-top-0">
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
            <div className="pp-label">Music Style:</div>
            <div className="col-8 ">
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
            <div className="pp-label">Album:</div>
            <div className="col-8">
              <Album
                small
                {...props}
                onUpload={async (type, e) => {
                  const fileInfo = await context.onUpload(e.target.files[0]);
                  await handleChange('files', [{ type, url: fileInfo.path }]);
                  await getAlbum(1, 50, context.state.userInfo.id);
                  setTimes(Date.now());
                  context.alertMsg('Upload success');
                }}
              />
            </div>
          </div>

          <div className="row margin-top-40">
            <div className="pp-label">Video:</div>
            <div className="col-8">
              <Video
                small
                onUpload={async (type, e) => {
                  const fileInfo = await context.onUpload(e.target.files[0]);
                  await handleChange('files', [{ type, url: fileInfo.path }]);
                  await getVideo(1, 50, context.state.userInfo.id);
                  setTimes(Date.now());
                  context.alertMsg('Upload success');
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;

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
