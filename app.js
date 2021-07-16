const express = require('express');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const session = require('express-session');
const path = require('path');
const nunjucks = require('nunjucks');
const dotenv = require('dotenv');
const passport = require('passport');
const ejs = require('ejs');

dotenv.config();

const indexRouter = require('./routes/index');
const authRouter = require('./routes/auth');
const customerRouter = require('./routes/customer');
const add_infoRouter = require('./routes/add_info');
const playlistRouter = require('./routes/playlist');
const chartRouter = require('./routes/chart');
const allsongRouter = require('./routes/all_song');
const kakaoRouter = require('./routes/kakao');
const searchRouter = require('./routes/search');
const searchtestRouter = require('./routes/searchtest');


const { sequelize } = require('./models');
const connect = require('./schemas');
const passportConfig = require('./passport');

const app = express();
passportConfig();
app.set('port', process.env.PORT || 8006);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.engine('html', ejs.renderFile)
sequelize.sync({ force: false })
    .then(() => {
        console.log('데이터베이스 연결 성공');
    })
    .catch((err) => {
        console.error(err);
    });
connect();

const sessionMiddleware = session({
    resave: false,
    saveUninitialized: false,
    secret: process.env.COOKIE_SECRET,
    cookie: {
        httpOnly: true,
        secure: false,
    },
});

app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, '/node_modules')));
app.use(express.json());
app.use(express.urlencoded({ extended: false}));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(sessionMiddleware);
app.use(passport.initialize());
app.use(passport.session());




app.use('/', indexRouter);
app.use('/auth', authRouter);
app.use('/customer', customerRouter);
app.use('/add_info', add_infoRouter);
app.use('/playlist', playlistRouter);
app.use('/chart', chartRouter);
app.use('/all_song', allsongRouter);
app.use('/kakaopay', kakaoRouter);
//app.use('/search', searchRouter);
app.use('/search', searchtestRouter);

app.use((req, res, next) => {
    const error = new Error(`${req.method} ${req.url} 라우터가 없습니다.`);
    error.status = 404;
    next(error);
});

app.use((err, req, res, next) => {
    res.locals.message = err.message;
    res.locals.error = process.env.NODE_ENV !== 'production' ? err : {};
    res.status(err.status || 500);
    res.render('error');
});

app.listen(app.get('port'), () => {
    console.log(`http://localhost:${app.get('port')}`);
});