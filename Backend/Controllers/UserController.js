const bcrypt = require("bcryptjs");
const { UserModel } = require("../Models/Model");
const jwt = require("jsonwebtoken");
const { Schema } = require("mongoose");
const UserSchema = require("../Models/UserSchema");
module.exports = {
  signUp: async (req, res) => {
    let { username, password } = req.body;

    // Username length should be more than equal to 4
    if (username == undefined || username == null || username.length < 4) {
      return res.status(400).send({
        success: false,
        message: "Username should be of atleast 4 character",
      });
    }

    // Password length should be more than equal to 6
    if (password == undefined || password == null || password.length < 6) {
      return res.status(400).send({
        success: false,
        message: "Password should be of atleast 6 character",
      });
    }

    // Encrypting the password using bcryptjs
    password = bcrypt.hashSync(password, parseInt(process.env.SALT));

    // Adding the user in Usermodel with usernname, password, following array which holds the following list and follower array
    //which holds the followers list
    const user = UserModel({
      username: username,
      password: password,
      following: [],
      follower: [],
    });

    //Generating token using JWT using jsonwebtoken
    let token = jwt.sign({ username }, process.env.SECRET_KEY, {
      expiresIn: 24 * 60 * 60 * 1000,
    });

    //Saving the User
    user.save(function (err) {
        // console.log(UserSchema.find(username));

      if (err)  {
          console.log({err})
        if (err.code === 11000) {
          // Duplicate username found
          return res
            .status(400)
            .send({ success: false, message: "User already exist!" });
        }
        // Some other error while saving
        return res.status(400).send({ success: false, message: err });
      }

      //Saved successfully
      res.json({
        success: true,
        message: `User ${username} created successfully!`,
        token,
      });
    });
  },

  login: async (req, res) => {
    let { username, password } = req.body;
    let usernameMsg = "";
    let passwordMsg = "";
    if (username == undefined || username == null || username.length < 4) {
      usernameMsg = "Username";
    }
    if (password == undefined || password == null || password.length < 6) {
      passwordMsg = usernameMsg == "Username" ? " and Password" : "Password";
    }
    if (usernameMsg == "Username" || passwordMsg == "Password") {
      message = usernameMsg + pwdMsg + " is incorrect";
      return res.status(400).send({
        status: false,
        message,
      });
    }

    //Finds the User from model
    let result = await UserModel.find({
      username: username,
    });

    //If user found
    if (result.length > 0) {
      //Comparing with the encrypted stored password.
      const isPasswordValid = bcrypt.compareSync(password, result[0].password);

      //Password doesnt match
      if (!isPasswordValid) {
        return res
          .status(403)
          .send({ success: false, message: "Password incorrect" });
      }

      //Generating token
      let token = jwt.sign({ username: username }, process.env.SECRET_KEY, {
        expiresIn: 24 * 60 * 60 * 1000,
      });

      //User is valid
      res.send({
        success: true,
        message: `Username: ${username} got logged In !`,
        token,
      });
    } else {
      //User not found
      res.status(403).send({
        success: false,
        message: `username ${username} does not exist!`,
      });
    }
  },
  follow: async (req, res) => {
    let { username, following, follower } = req.user; //this user wants to follow to_username

    //getting the username to whom logged in user wants to follow through query parameter
    let { to_username } = req.params;

    //Validating the user to be followed
    toUser = await UserModel.find({ username: to_username });
    if (toUser.length < 1) {
      return res.status(400).send({
        success: false,
        message: "Invalid user",
      });
    }

    //Getting follower list of the user to be followed so that we can update that
    to_follower = toUser[0].follower;

    //Checking if its already following?
    if (!to_follower.includes(username)) {
      to_follower.push(username);
      await UserModel.findOneAndUpdate(
        { username: to_username },
        { follower: to_follower }
      );
    } else {
      res.send({ status: true, message: "Already following" });
    }

    if (!following.includes(to_username)) {
      following.push(to_username);
      await UserModel.findOneAndUpdate(
        { username: username },
        { following: following }
      );
    }

    res.send({ success: true, message: "Followed Successfully" });
  },

  unfollow: async (req, res) => {
    // Destructuring from the request header
    let { username, following, follower } = req.user;

    //getting the username to whom logged in user wants to follow through query parameter
    let { to_username } = req.params;

    //Validating that user to be followed
    toUser = await UserModel.find({ username: to_username });
    if (toUser.length < 1) {
      return res.status(400).send({
        success: false,
        message: "Invalid ",
      });
    }

    //Getting follower list of the user to be followed so that we can update that
    to_follower = toUser[0].follower;

    //Checking if its already following? If yes then remove from that list
    if (to_follower.includes(username)) {
      to_follower = to_follower.filter((elt) => elt !== username);
      await UserModel.findOneAndUpdate(
        { username: to_username },
        { follower: to_follower }
      );
    } else {
      res.send({ status: true, message: "Not following" });
    }

    //Removing from following list
    if (following.includes(to_username)) {
      following = following.filter((elt) => elt !== to_username);
      await UserModel.findOneAndUpdate(
        { username: username },
        { following: following }
      );
    }
    res.send({ success: true, message: "Unfollowed successfully" });
  },
};
