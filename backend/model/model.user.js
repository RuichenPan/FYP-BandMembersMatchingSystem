import mongoose from 'mongoose';
const { Schema } = mongoose;

export default mongoose.model(
  'user',
  new Schema(
    {
      username: { type: String, default: '' },
      email: { type: String, default: '' },
      password: { type: String, default: '' },
      salt: { type: String, default: '' },
      avatar: { type: String, default: '' },
      i_am_a: { type: String, default: '', comment: 'Guitarist, Bassist, Drummer, Keyboard Player, Leader Singer，Other' },
      music_style: { type: String, default: '', comment: 'Hard Rock, Pop Music, Thrash Metal, Death Metal, Punk, Electronic Music, Jazz, Blues' },
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
