import mongoose from 'mongoose';
const { Schema } = mongoose;

export default mongoose.model(
  'comment',
  new Schema(
    {
      user_id: { type: String, default: '' },
      comment_user_id: { type: String, default: '' },
      comment_username: { type: String, default: '' },
      comment_avatar: { type: String, default: '' },
      comment_content: { type: String, default: '' },
      create_time: { type: Number, default: Date.now() },
      reply_content: { type: String, default: '' },
      reply_create_time: { type: Number, default: 0 },
      reply_avatar: { type: String, default: '' },
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
