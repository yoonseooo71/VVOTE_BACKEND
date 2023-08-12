const { v4: uuidv4 } = require("uuid");
const dbClient = require("../postgresql");

function setPostLike(request, response) {
  const { postId, userId } = request.body;
  const likeId = uuidv4();
  const postQuery = `insert into posts_likes (like_id, post_id, user_id, regdate, updatedate, deletedate) values ($1, $2, $3 , CURRENT_TIMESTAMP, null, null)`;
  dbClient.query(postQuery, [likeId, postId, userId], (err) => {
    if (err) {
      console.log(err);
      response.status(500).send({ error: err });
    } else {
      response.status(200).send({ message: "success" });
    }
  });
}

function checkPostLike(request, response) {
  const { postId } = request.params;
  const userId = request.user.id ;
  const postQuery = `SELECT EXISTS (SELECT 1 FROM posts_likes WHERE user_id = $1  AND post_id =  $2)`;
  const postQuery2 = `SELECT COUNT(*) FROM posts_likes WHERE post_id =  $1`
  dbClient.query(postQuery, [userId,postId] , (err, result) => {
    if (err) {
      response.status(500).send({ error: err });
    } else {
      const exists = result.rows[0].exists;
      dbClient.query(postQuery2,[postId],(err, result) => {
        if (err) {
          response.status(500).send({ error: err });
        } else {
          const count = parseInt(result.rows[0].count) ; 
          const json = {isLike:exists,count:count};
          response.status(200).json(json);
        }
      });
    }
  });
}

module.exports = {
  setPostLike,
  checkPostLike
};
