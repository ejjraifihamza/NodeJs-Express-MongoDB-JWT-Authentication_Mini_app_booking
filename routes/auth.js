const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../model/User");

const schema = require("../validation");
const verify = require("./verifyToken");

router.post("/register", async (req, res) => {
  const { error } = schema.registerValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const emailExist = await User.findOne({ email: req.body.email });
  if (emailExist)
    return res.status(400).send("Email Already Exist! - maybe try new one.");

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);

  const user = new User({
    name: req.body.name,
    email: req.body.email,
    password: hashedPassword,
  });
  try {
    await user.save();
    res.send("User saved successfully!");
  } catch (error) {
    res.status(400).send(error);
  }
});

router.post("/login", async (req, res) => {
  const { error } = schema.loginValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send(`Email Incorrect.`);

  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword) return res.status(400).send("Password Incorrect.");

  const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET, {
    // expiresIn: "30s",
  });
  res.header("auth-token", token).send(token);
});

router.post("/logout", verify.auth, async (req, res) => {
  res.send("Logged out!");
});

module.exports = router;
