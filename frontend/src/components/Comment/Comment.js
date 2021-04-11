import React, { useContext, useEffect, useState } from 'react';
import httpHelper from '../../api/httpHelper';
import { UserContext } from '../../contexts/userContext';
import Util from '../../util';
import MyImage from '../MyImage/MyImage';

const ComentItem = (props) => {
  const [isReply, setIsReply] = useState(false);
  const [content, setContent] = useState('');
  const { onReply, context, row = {} } = props;
  const curentUser = httpHelper.userInfo;

  const handleReply = async () => {
    const { id: comment_id } = row;
    await context.onReplyComment({ comment_id, content });
    onReply && onReply();
    setIsReply(false);
    context.alertMsg('Reply success');
  };

  const { id: url_user_id } = Util.parseQuery();
  console.log(url_user_id, curentUser.id);

  return (
    <div className="split-line-bottom padding-tb-20">
      <div className="row">
        <div className="person-label g-center">
          <div className="comment-avatar">
            <MyImage avatar={row.comment_avatar} />
          </div>
        </div>
        <div className="col1">
          <div className="row row-between">
            <span>{Util.format(row.create_time, 'yyyy-MM-dd HH:mm:ss')}</span>
            {url_user_id === curentUser.id && row.reply_create_time === 0 && <span className="icon icon-reply handle " onClick={() => setIsReply(true)}></span>}
            {/* <span className="icon icon-reply handle " onClick={() => setIsReply(true)}></span> */}
          </div>
          <div className="row">
            <div className="col0 comment-content" style={{ maxWidth: '60%' }}>
              {row.comment_content}
            </div>
            <div className="col1"></div>
          </div>

          {isReply && (
            <div className="col1 ">
              <div className="margin-top-10">
                <textarea value={content} onChange={(e) => setContent(e.target.value)}></textarea>
              </div>
              <div>
                <button disabled={!content} className="btn btn-light" onClick={handleReply}>
                  Reply
                </button>
                <button className="btn btn-light margin-left-10" onClick={() => setIsReply(false)}>
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {row.reply_create_time > 0 && (
        <div className="row margin-top-5">
          <div className="col2">
            <div className="text-right">{Util.format(row.reply_create_time, 'yyyy-MM-dd HH:mm:ss')}</div>

            <div className="row">
              <div className="col1"></div>
              <div className="col0 comment-content" style={{ maxWidth: '60%' }}>
                {row.reply_content}
              </div>
            </div>
          </div>
          <div className="person-label g-center">
            <div className="comment-avatar">
              <MyImage avatar={row.reply_avatar} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const Comment = (props) => {
  const context = useContext(UserContext);
  const [content, setMsg] = useState('');
  const [list, setList] = useState([]);

  const getList = async ({ page = 1, size = 20 } = {}) => {
    const { id: user_id } = Util.parseQuery();
    const info = await context.onGetCommentList({ page, size, user_id });
    setList([...info.list]);
  };

  useEffect(() => {
    getList();
    
    // eslint-disable-next-line
  }, [context]);

  const handleSave = async () => {
    const { id: user_id } = Util.parseQuery();
    await context.onAddComment({ content, user_id });
    context.alertMsg('Add Success');
    setList([]);
    getList();
  };

  const handleReply = () => {
    getList();
  };

  return (
    <div className="comment-body ">
      <div className="row split-line-bottom">
        <div className="col1 text-center font-size-20 padding-20">My Comment</div>
      </div>
      <div className="">
        {list &&
          list.map((row, index) => {
            return <ComentItem key={index} row={row} {...props} context={context} onReply={handleReply} />;
          })}
      </div>
      <div className="row margin-top-10">
        <div className="person-label">Comment:</div>
        <div className="col1">
          <textarea value={content} onChange={(e) => setMsg(e.target.value)}></textarea>
        </div>
      </div>
      <div className="row margin-top-10">
        <div className="person-label"></div>
        <div className="col1">
          <button disabled={!content} className="btn btn-light" onClick={handleSave}>
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default Comment;
