const dbClient = require("../postgresql");

function getLoginUser(req, res) {
  const data = {isLogin: req.session.isLogin,user:req.user}
  res.json(data);
}


function logout(req, res) {
  req.logout((err) => {
		req.session.destroy();
		if (err) {
			res.redirect("http://localhost:3000/");
		} else {
			res.status(200).send("server ok: 로그아웃 완료");
		}
	});
}
module.exports = {
  getLoginUser,
  logout,
};
