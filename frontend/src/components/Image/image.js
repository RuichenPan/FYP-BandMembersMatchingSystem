import React from 'react';
import httpHelper from '../../api/httpHelper';
import defaultAvatar from '../../images/default-avatar.jpg';
const Image = (props) => {
  const { avatar } = props;
  let avatar_url = avatar ? `${httpHelper.WebSite}/uploads/${avatar}` : defaultAvatar;
  console.log('avatar_url:', avatar_url, 'avatar:', !avatar);
  return <div className="img img-cover" style={{ backgroundImage: `url('${avatar_url}')` }}></div>;
};

export default Image;
