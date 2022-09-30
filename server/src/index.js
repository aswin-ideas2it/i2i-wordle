const app = require('express')();
const cors = require('cors');
const router = require('./router');
const requestIp = require('request-ip');
const { connectMongo } = require('./../src/lib/db');
const { config: { clientUrl, serverUrl } } = require('./config');
const useragent = require('express-useragent');
const bodyParser = require('body-parser');
const session = require('express-session');
const passport = require('passport');
const { getLoggedInDetails, loginGoogleUser } = require('./lib/user');
const redis = require('redis');
const connectRedis = require('connect-redis');
const BasicStrategy = require('passport-http').BasicStrategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;

const PORT = process.env.PORT || 5000;

connectMongo().then(() => {
    console.log(`Connected to Mongo DB`);
    const RedisStore = connectRedis(session);
    const redisClient = redis.createClient({ socket: { port: process.env.REDIS_PORT, host: process.env.REDIS_HOST }, legacyMode: true });
    redisClient.connect();
    redisClient.on('error', (err) => {
        console.log('Could not establish a connection with Redis. ' + err);
    });
    redisClient.on('connect', () => {
        console.log('Connected to Redis successfully');
        app.use(cors({
            origin: clientUrl,
            methods: ['GET', 'POST', 'PUT', 'DELETE'],
            credentials: true
        }));
        app.set('trust proxy', 1)
        app.use(requestIp.mw());
        app.use(useragent.express());
        app.use(bodyParser.urlencoded({ extended: false }));
        app.use(bodyParser.json());
        app.use(session({
            store: new RedisStore({ client: redisClient }),
            secret: process.env.SESSION_SECRET,
            resave: false,
            cookie: { expires: new Date(253402300000000) },
            saveUninitialized: false,
        }));
        app.use(passport.initialize());
        app.use(passport.session());

        passport.use(new BasicStrategy(async (userName, password, done) => {
            const user = await getLoggedInDetails(userName, password);
            if (user === 'INP' || user === 'UNF') return done(user);
            return done(null, user);
        }));

        passport.use(new GoogleStrategy({
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: `${serverUrl}/api/auth/google/callback`
        },
            async (accessToken, refreshToken, profile, done) => {
                const user = await loginGoogleUser(profile._json.email, profile._json.name, profile._json.picture);
                return done(null, user);
            }
        ));

        passport.serializeUser((user, done) => {
            done(null, { userId: user.userId, userName: user.userName });
        });

        passport.deserializeUser((user, done) => {
            done(null, user);
        });

        app.use('/api', router);

        app.listen(PORT, console.log(`
------------------------------------------------
Ideas2IT Wordly Server is Listening at ${PORT}
------------------------------------------------`));
    });
}).catch(err => {
    console.log(err, 'MongoDB connection error');
});