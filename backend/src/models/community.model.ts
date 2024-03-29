import mongoose, { Schema } from 'mongoose';

export type CommunityTypes = {
  author: mongoose.Types.ObjectId;
  name: string;
  userId: number;
  avatar: string;
  coverImage: string;
  description: string;
  rule: string[];
  members: mongoose.Types.ObjectId[];
  moderator: mongoose.Types.ObjectId[];
  posts: mongoose.Types.ObjectId[];
};

const communitySchema = new mongoose.Schema<CommunityTypes>(
  {
    // userId: {
    //   type: Number,
    //   // required: true,
    // },

    author: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    name: {
      type: String,
      unique: true,
      required: true,
      trim: true,
    },
    avatar: {
      type: String,
    },
    coverImage: {
      type: String,
    },

    description: {
      type: String,
      trim: true,
    },
    rule: [String],
    members: [
      { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: [] },
    ],
    moderator: [
      { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: [] },
    ],
    posts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post', default: [] }],
  },
  { timestamps: true }
);

export const Community = mongoose.model('Community', communitySchema);
