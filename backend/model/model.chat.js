import mongoose from 'mongoose';
const { Schema } = mongoose;

export default mongoose.model(
  'chat',
  new Schema(
    {
      user_id: { type: String, comment: '' },
      username: { type: String, comment: '' },
      reply_user_id: { type: String, comment: '' },
      reply_username: { type: String, comment: '' },
      msg: { type: String, comment: '' },
      state: { type: Number, default: 1, comment: '1 unread,2 read' },
      create_time: { type: Number, comment: '', default: Date.now },
      update_time: { type: Number, comment: '', default: Date.now },
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
