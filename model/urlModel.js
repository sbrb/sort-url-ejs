import mongoose from 'mongoose';

export default mongoose.model('Url', new mongoose.Schema(
  {
    urlCode: {
      type: String
    },
    longUrl: {
      type: String,
      required: true,
    },
    shortUrl: {
      type: String,
      trim: true
    },
  }, { timestamps: true }
));