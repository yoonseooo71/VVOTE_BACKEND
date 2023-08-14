const { v4: uuidv4 } = require("uuid");
const dbClient = require("../postgresql");

function setPostLike(request, response) {
  const { postId } = request.body;
  const userId = request.user.id ; 
  const postQuery = `insert into posts_likes ( post_id, user_id, regdate, updatedate, deletedate) values ($1, $2, CURRENT_TIMESTAMP, null, null)`;
  dbClient.query(postQuery, [postId, userId], (err) => {
    if (err) {
      console.log(err);
      response.status(500).send({ error: err });
    } else {
      response.status(200).send({ message: "success" });
    }
  });
}
function deletePostLike(request,response){
  const {postId} = request.body;
  const userId = request.user.id ; 
  const postQuery = `DELETE FROM posts_likes WHERE user_id = $1 and post_id = $2`
  dbClient.query(postQuery,[userId,postId],(err) => {
    if (err) {
      console.log(err);
      response.status(500).send({ error: err });
    } else {
      response.status(200).send({ message: "success" });
    }
  })
}
function checkPostLike(request, response) {
  const { postId } = request.params;
  const userId = request.user.id ;
  const postQuery = `SELECT EXISTS (SELECT 1 FROM posts_likes WHERE user_id = $1  AND post_id =  $2)`;
  dbClient.query(postQuery, [userId,postId] , (err, result) => {
    if (err) {
      response.status(500).send({ error: err });
    } else {
      const exists = result.rows[0].exists;
      const json = {isLike:exists};
      response.status(200).json(json);
    }
  });
}

module.exports = {
  setPostLike,
  deletePostLike,
  checkPostLike

};
