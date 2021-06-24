const express = require("express");
const router = express.Router();
const passport = require("passport");
const jwt = require("jsonwebtoken");
const config = require("../config/database");
const User = require("../models/user");
const lodash = require("lodash");
const RefreshToken = require("../models/refreshToken");

// Register
router.post("/register", (req, res, next) => {
  let newUser = new User({
    name: req.body.name,
    email: req.body.email,
    username: req.body.username,
    password: req.body.password,
  });

  User.addUser(newUser, (err, user) => {
    if (err) res.json({ success: false, msg: "Failed to register user" });
    else res.json({ success: true, msg: "User registered" });
  });
});

// Authenticate
router.post("/authenticate", (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;

  User.getUserByUsername(username, (err, user) => {
    if (err) throw err;
    if (!user) return res.json({ success: false, msg: "User not found" });

    User.comparePassword(password, user.password, (err, isMatch) => {
      if (err) throw err;
      if (isMatch) {
        const payload = lodash.pick(user, ["name", "email", "username"]);
        payload["sub"] = user._id;
        const accessToken = jwt.sign(payload, config.accessSecret, {
          expiresIn: 36000, //10 hours
        });
        const refreshToken = jwt.sign(payload, config.refreshSecret, {
          expiresIn: 604800, // 1 week
        });

        var refreshTokenEntry = new RefreshToken({
          userId: user._id,
          token: refreshToken,
        });

        RefreshToken.addRefreshToken(refreshTokenEntry, (err, token) => {
          if (err) throw err;
          if (!token)
            return res.json({
              success: false,
              msg: "Error inserting refresh token",
            });

          return res.json({
            success: true,
            accessToken: accessToken,
            refreshToken: refreshToken,
            user: {
              id: user._id,
              name: user.name,
              username: user.username,
              email: user.email,
            },
          });
        });
      } else {
        return res.json({ success: false, msg: "Wrong password" });
      }
    });
  });
});

// Profile
router.get(
  "/profile",
  passport.authenticate("jwt", { session: false }),
  (req, res, next) => {
    res.json({ user: req.user });
  }
);

// Test Refresh
router.get("/refresh", (req, res, next) => {
  // Verify token
  jwt.verify(req.body.token, config.refreshSecret, (err, decodedPayload) => {
    if(err) throw err;
    if(!decodedPayload)
      res.json(403, {success: false, msg: 'Token provided could not be verified'})
    return;
  })
  // Find refresh token in db
  RefreshToken.findOne({ token: req.body.token }, (err, tokenEntry) => {
    if (err) throw err;
    if (!tokenEntry)
      return res.json(403, {
        success: false,
        msg: "This token does not exist",
      });

    // Get user attached to refreshToken
    User.getUserById(tokenEntry.userId, (err, user) => {
      if (err) throw err;
      if (!user)
        res.json(422, {
          success: false,
          msg: "User could not be found for token supplied",
        });
      const payload = lodash.pick(user, ["name", "email", "username"]);
      payload["sub"] = user._id;
      const accessToken = jwt.sign(payload, config.accessSecret, {
        expiresIn: 36000, //10 hours
      });

      return res.json({
        success: true,
        accessToken: accessToken,
        user: {
          id: user._id,
          name: user.name,
          username: user.username,
          email: user.email,
        },
      });
    });
  });
});

module.exports = router;