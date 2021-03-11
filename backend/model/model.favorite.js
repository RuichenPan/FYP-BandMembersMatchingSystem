import mongoose from 'mongoose';
const { Schema } = mongoose;

export default mongoose.model(
  'favorite',
  new Schema(
    {
      user_id: { type: String, default: '' },
      username: { type: String, default: '' },
      favorite_user_id: { type: String, default: '' },
      favorite_username: { type: String, default: '' },
      favorite_avatar: { type: String, default: '' },
      create_time: { type: Number, default: Date.now },
      update_time: { type: Number, default: Date.now },
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
