const router = require("express").Router();
const { AuthMiddleware } = require("../Authentication");
const {
  createTweet,
  deleteTweet,
  getTweet,
  feed,
  like,
  dislike,
} = require("../Controllers/TweetController");

router.post("/createtweet", AuthMiddleware, createTweet);
router.post("/deletetweet", AuthMiddleware, deleteTweet);
router.get("/feed", AuthMiddleware, feed);
router.get("/tweet/:username", getTweet);
router.post("/like/:tweet_id", AuthMiddleware, like);
router.post("/dislike/:tweet_id", AuthMiddleware, dislike);

module.exports = router;
