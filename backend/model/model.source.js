import mongoose from 'mongoose';
const { Schema } = mongoose;

export default mongoose.model(
  'source',
  new Schema(
    {
      user_id: { type: String, default: '' },
      type: { type: Number, default: 1, comment: '1 video, 2 album' },
      url: { type: String, default: '' },
      desc: { type: String, default: '' },
      create_time: { type: Number, default: Date.now() },
    },
    {
      timestamps: { createdAt: 'create_time', updatedAt: 'update_time' },
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
