const { TweetModel } = require("../Models/Model");

module.exports = {
  createTweet: async (req, res) => {
    let { username } = req.user;
    let tweet = req.params.message;

    //creating tweet
    tweet = TweetModel({
      tweet: tweet,
      from: username,
      like: [],
      dislike: [],
      tweetedOn: new Date(),
    });
    await tweet.save(function (err) {
      if (err) {
        // Some other error while saving
        return res.status(400).send({ success: false, message: err });
      }
    });
    res.send({
      success: true,
      message: "Tweet Successfull!",
    });
  },
  getTweet: async (req, res) => {
    let { username } = req.params;
    let tweets = await TweetModel.find({ from: username }, function (err) {
      if (err) {
        // Some other error while deleting
        return res.status(400).send({ success: false, message: err });
      }
    });
    tweets = tweets.map((elt) => {
      return {
        like: elt.like.length,
        dislike: elt.dislike.length,
        tweetedFrom: elt.from,
        tweetedOn: elt.tweetedOn,
      };
    });
    res.send({
      success: true,
      message: "Tweet Deleted!",
      tweets: tweets,
    });
  },
  deleteTweet: async (req, res) => {
    let tweetid = req.params.tweetid;
    await TweetModel.remove({ _id: tweetid }, function (err) {
      if (err) {
        // Some other error while deleting
        return res.status(400).send({ success: false, message: err });
      }
    });
    res.send({
      success: true,
      message: "Tweet Deleted!",
    });
  },
  feed: async (req, res) => {
    //Get the following list of that user from the header (token)
    let { username, following } = req.user;

    let tweets = await TweetModel.find(
      { from: { $in: following } },
      function (err) {
        if (err) {
          return res.status(400).send({ success: false, message: err });
        }
      }
    ).sort({ tweetedOn: descending });
    res.send({
      success: true,
      message: "Latest Tweets",
      tweets: tweets,
    });
  },
  like: async (req, res) => {
    // Destructuring from the request header
    let { username } = req.user;

    let { tweet_id } = req.params;

    //Getting the tweet
    let tweet = await TweetModel.find({ _id: tweet_id });
    if (tweet.length < 1) {
      return res.status(400).send({
        success: false,
        message: "Tweet Not Found ",
      });
    }

    //Getting like(usersnames) who had like that tweet
    likes = tweet[0].like;

    //Checking if that user already liked that tweet
    if (!likes.includes(username)) {
      like.push(username);
      await TweetModel.findOneAndUpdate(
        { _id: tweet_id }, //where in sql
        { like: likes } //set in sql
      );
    } else {
      res.send({ status: true, message: "Already liked" });
    }

    res.send({ success: true, message: "Liked" });
  },
  dislike: async (req, res) => {
    // Destructuring from the request header
    let { username } = req.user;

    let { tweet_id } = req.params;

    //Getting the tweet
    let tweet = await TweetModel.find({ _id: tweet_id });
    if (tweet.length < 1) {
      return res.status(400).send({
        success: false,
        message: "Tweet Not Found ",
      });
    }

    //Getting dislike(usersnames) who had dislike that tweet
    dislikes = tweet[0].dislike;

    //Checking if that user already disliked that tweet
    if (!dislikes.includes(username)) {
      dislikes.push(username);
      await TweetModel.findOneAndUpdate(
        { _id: tweet_id },
        { dislike: dislikes }
      );
    } else {
      res.send({ status: true, message: "Already disliked" });
    }
    res.send({ success: true, message: "Disliked" });
  },
};
