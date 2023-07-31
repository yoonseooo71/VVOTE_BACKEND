const dbClient = require("../postgresql");

function getLoginUser(req, res) {
  const data = {isLogin: req.session.isLogin,user:req.user}
  res.json(data);
}
function getUserName(request, response) {
	const user_id = request.params.user_id ; 
	const psqlQuery = "select name from userdata where id = $1;"
	dbClient.query(psqlQuery,[user_id],(err,result)=>{
		if (err) {
			res.status(500).send({ error: err });
		} else {
			response.status(200).json(result.rows[0]);
		}
	})

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
	getUserName,
  logout,
};
