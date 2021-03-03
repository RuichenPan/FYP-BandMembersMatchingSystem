import mongoose from 'mongoose';
const { Schema } = mongoose;

module.exports = mongoose.model(
  'user',
  new Schema(
    {
      username: { type: String, default: '' },
      email: { type: String, default: '' },
      password: { type: String, default: '' },
      salt: { type: String, default: '' },
      image: { type: String, default: '' },
      video: { type: Array, default: [] },
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
