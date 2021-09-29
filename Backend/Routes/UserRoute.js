const router = require("express").Router();
const { AuthMiddleware } = require("../Authentication");
const {
  signUp,
  login,
  follow,
  unfollow
} = require("../Controllers/UserController");
router.post("/signup", signUp);
router.post("/login", login);
router.post("/follow/:to_username", AuthMiddleware, follow);
router.post("/unfollow/:to_username", AuthMiddleware, unfollow);
module.exports = router;
