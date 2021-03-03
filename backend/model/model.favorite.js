import mongoose from 'mongoose';
const { Schema } = mongoose;

export default mongoose.model(
  'favorite',
  new Schema(
    {
      user_id: { type: String, comment: 'UserID' },
      username: { type: String, comment: 'UserName' },
      favorite_user_id: { type: String, comment: 'FavoriteUserID' },
      favorite_username: { type: String, comment: 'FavoriteUserName' },
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
