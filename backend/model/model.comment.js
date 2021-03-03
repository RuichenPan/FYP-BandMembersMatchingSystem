import mongoose from 'mongoose';
const { Schema } = mongoose;

export default mongoose.model(
  'comment',
  new Schema(
    {
      to_user_id: { type: String, default: '' },
      to_username: { type: String, default: '' },
      to_msg: { type: String, default: '' },
      to_create_time: { type: Number, default: Date.now() },
      reply_user_id: { type: String, default: '' },
      reply_username: { type: String, default: '' },
      reply_msg: { type: String, default: '' },
      reply_create_time: { type: Number, default: 0 },
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
