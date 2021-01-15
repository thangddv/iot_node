const JwtStrategy = require('passport-jwt').Strategy;
const { ExtractJwt } = require('passport-jwt');

const User = require('../model/user');

const config = require('../config');

const applyPassportStrategy = (passport) => {
  const opts = {};
  opts.secretOrKey = config.jwt.secret;
  opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();

  passport.use(
    new JwtStrategy(opts, (jwtPayload, done) => {
      User.findOne({ _id: jwtPayload.id }, (err, user) => {
        if (err) {
          return done(err, false);
        }
        if (user) {
          return done(null, user);
        }

        return done(null, false);
      });
    })
  );
};

module.exports = { applyPassportStrategy };
