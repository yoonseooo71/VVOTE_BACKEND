function getLoginUser(req, res) {
  const data = { isLogin: req.session.isLogin, user: req.user };
  res.json(data);
}

function logout(req, res) {
  req.logout((err) => {
    req.session.destroy();
    if (err) {
			console.log('logout:error:',err);
      res.status(500).send({error:err});
    } else {
      res.status(200).send({massege:"server ok: 로그아웃 완료"});
    }
  });
}
module.exports = {
  getLoginUser,
  logout,
};
