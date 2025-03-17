require('dotenv').config();
const passport = require('passport');
const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');
const User = require('./Users');


const opts = {};

opts.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme("JWT");

opts.secretOrKey = process.env.JWT_SECRET;

if (!opts.secretOrKey) {
  console.error("JWT_SECRET is not defined in your environment variables.");
  process.exit(1);
}


passport.use(new JwtStrategy(opts, async (jwt_payload, done) => {
  try {
    
    const user = await User.findById(jwt_payload.id);
    
    
    if (user) {
      return done(null, user);
    } else {
      
      return done(null, false);
    }
  } catch (err) {
    
    return done(err, false);
  }
}));

exports.isAuthenticated = passport.authenticate('jwt', { session: false });

exports.secret = opts.secretOrKey;
