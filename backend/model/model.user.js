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
      gender: { type: String, default: 'Male', comment: 'male, female' },
      avatar: { type: String, default: '' },
      description: { type: String, default: '' },
      state: { type: Number, default: 1, comment: '1 : verification, 2: normal' },
      i_am_a: { type: String, default: '', comment: 'Guitarist, Bassist, Drummer, Keyboard Player, Leader Singer，Other' },
      i_am_a_other: { type: String, default: '', comment: 'Guitarist, Bassist, Drummer, Keyboard Player, Leader Singer，Other' },
      music_style: { type: String, default: '', comment: 'Hard Rock, Pop Music, Thrash Metal, Death Metal, Punk, Electronic Music, Jazz, Blues' },
      address: { type: String, default: '' },
      lat: { type: Number, default: '' },
      lon: { type: Number, default: '' },
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
