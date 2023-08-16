require("dotenv").config();
const express = require("express");
const session = require("express-session");
const pgSession = require("connect-pg-simple")(session);
const cors = require("cors");
const usersRouter = require("./routes/users");
const postsRouter = require("./routes/posts");
const authRouter = require("./routes/auth");
const likeRouter = require("./routes/like");
const voteRouter = require("./routes/vote");
const dbClient = require("./postgresql");
const passport = require("passport");
const { selectUser, setUser } = require("./lib/database");
const GoogleStrategy = require("passport-google-oauth20").Strategy;

const app = express();

// 데이터베이스 연결
dbClient.connect((error) => {
  if (error) {
    console.log("데이터베이스 연결 오류:", error);
  } else {
    console.log("데이터베이스 연결됨");
  }
});

// Passport 구성 및 설정
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  selectUser(id)
    .then((user) => done(null, user))
    .catch((err) => done(err));
});

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      // 로그인 성공 시 사용자 정보를 처리하는 로직을 작성하세요
      // 예: 사용자 정보를 데이터베이스에 저장하거나 세션을 설정하는 등의 작업
      try {
        const exUser = await selectUser(profile.id);
        if (exUser) {
          done(null, exUser);
        } else {
          const newUser = {
            id: profile.id,
            name: profile.displayName,
            email: profile.emails[0].value,
            photo: profile.photos[0].value,
          };
          setUser(newUser);
          done(null, newUser);
        }
      } catch (error) {
        console.error(error);
        done(error);
      }
    }
  )
);

// 미들웨어 설정
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors({
  origin: process.env.CLIENT_URL, // 접근 권한을 부여하는 도메인
  credentials: true, // 응답 헤더에 Access-Control-Allow-Credentials 추가
}));
app.use(
  session({
    store: new pgSession({
      pool: dbClient,
      tableName: "user_sessions",
    }),
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 7 * 24 * 60 * 60 * 1000 },
  })
);
app.use(passport.initialize());
app.use(passport.session());

// 라우트 설정
app.use("/users", usersRouter);
app.use("/posts", postsRouter);
app.use("/auth", authRouter);
app.use("/like", likeRouter);
app.use('/vote', voteRouter);


// 에러 처리 미들웨어
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: err.message });
});
// 서버 시작
const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`서버가 포트 ${port}에서 실행 중입니다.`);
});
