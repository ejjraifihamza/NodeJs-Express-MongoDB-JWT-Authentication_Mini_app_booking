const router = require("express").Router();

const verify = require("./verifyToken");

router.get("/", verify.auth, (req, res) => {
  res.json({
    posts: {
      title: `my first post`,
      description: `random data you shouldnt access without jwt token!`,
    },
    user: {
      userId: req.user,
    },
  });
});

module.exports = router;
