const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const User = require("../models/user");
const config = require("../config/database");

module.exports = (passport) => {
  let opts = {};
  opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
  opts.secretOrKey = config.secret;
  passport.use(new JwtStrategy(opts, (jwt_payload, done) => {
      User.getUserById(jwt_payload.sub, (err, user) => {
        if (err) {
            console.log('error', err);
          return done(err, false);
        }
        if (user) {
            console.log('user', user);
          return done(null, user);
        } else {
        console.log('no user');
          return done(null, false);
        }
      });
    })
  );
};
