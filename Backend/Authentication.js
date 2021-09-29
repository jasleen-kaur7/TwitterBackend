const {UserModel} = require("./Models/Model");
const jwt = require("jsonwebtoken");
module.exports = {
  AuthMiddleware: async (req, res, next) => {
    //get the token from header
    let token = req.headers["twitter-token"];

    //Token not found
    if (!token) {
      return res.status(401).send({ er: "No token found", auth: false });
    }

    //verify the token
    jwt.verify(token, process.env.SECRET_KEY, async (err, decode) => {
      if (err) {
        return res
          .status(500)
          .send({ auth: false, er: "Authentication failed" });
      }

      let result = await UserModel.find({
        username: decode.username, // get the Usermodel from the decode username
      });

      //appending the user detail in header request
      req.user = result[0];
      next();
    });

    console.log(req.body);
  },
};
