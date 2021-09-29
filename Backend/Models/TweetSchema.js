const mongoose = require("mongoose");
const TweetSchema = new mongoose.Schema({
  tweet: { type: String },
  from: { type: String },
  like: [{ type: String }],
  dislike: [{ type: String }],
  tweetedOn: { type: Date, default: Date.now },
});

module.exports = TweetSchema;
