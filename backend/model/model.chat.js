import mongoose from 'mongoose';
const { Schema } = mongoose;

export default mongoose.model(
  'chat',
  new Schema(
    {
      user_id: { type: String, comment: 'UserID' },
      username: { type: String, comment: 'UserName' },
      reply_user_id: { type: String, comment: 'ReplyUserID' },
      reply_username: { type: String, comment: 'ReplyUserName' },
      msg: { type: String, comment: 'Content' },
      state: { type: Number, default: 0, comment: '0：Unread ; 1 Have Read' },
      create_time: { type: Number, comment: 'CreateTime', default: Date.now },
      update_time: { type: Number, comment: 'UpdateTime', default: Date.now },
    },
    {
      toJSON: {
        virtuals: true,
        transform(doc, ret) {
          delete ret.__v;
          delete ret._id;
          return ret;
        },
      },
    },
  ),
);
