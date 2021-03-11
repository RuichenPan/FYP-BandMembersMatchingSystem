import mongoose from 'mongoose';
const { Schema } = mongoose;

module.exports = mongoose.model(
  'config',
  new Schema(
    {
      name: { type: String, default: '' },
      value: { type: String, default: '' },
      password: { type: String, default: '' },
      sort: { type: Number, default: 0 },
      desc: { type: String, default: '' },
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
