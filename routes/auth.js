const express = require("express");
const passport = require("passport");
const router = express.Router();

// Google 로그인 라우트
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// Google 로그인 콜백 라우트
router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  (req, res) => {
    // 로그인 성공 시 프론트엔드로 데이터를 JSON 형식으로 반환 
    req.session.isLogin = true ; 
    console.log(req.session);
    res.redirect("http://localhost:3000/");
  }
);

module.exports = router;
