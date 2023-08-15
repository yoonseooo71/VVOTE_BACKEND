const { v4: uuidv4 } = require("uuid");
const dbClient = require("../postgresql");
const { databaseQuery } = require("../lib/database");

async function setPostLike(request, response) {
  try {
    const { postId } = request.body;
    const userId = request.user.id ; 
    const postQuery = `insert into posts_likes ( post_id, user_id, regdate, updatedate, deletedate) values ($1, $2, CURRENT_TIMESTAMP, null, null)`;
    await databaseQuery(postQuery,[postId, userId]);
    response.status(200).send({ message: "success" });
  } catch(err) {
    console.log("setPostLike:error:",err);
    response.status(500).send({ error: err });
  }
}
async function deletePostLike(request,response){
  try {
    const {postId} = request.body;
    const userId = request.user.id ; 
    const postQuery = `DELETE FROM posts_likes WHERE user_id = $1 and post_id = $2`
    await databaseQuery(postQuery,[userId,postId]) ; 
    response.status(200).send({ message: "success" });
  } catch(err) {
    console.log("deletePostLike:error:",err);
    response.status(500).send({ error: err });

  }
}
async function checkPostLike(request, response) {
  try {
    const { postId } = request.params;
    const userId = request.user.id ;
    const postQuery = `SELECT EXISTS (SELECT 1 FROM posts_likes WHERE user_id = $1  AND post_id =  $2)`;
    const result = await databaseQuery(postQuery,[userId,postId]); 
    const isLike = result.rows[0].exists; 
    const json = {isLike:isLike} ;
    response.status(200).json(json);
  } catch (err) {
    console.log("checkPostLike:error:",err); 
    response.status(500).send({error:err});
  }
}

module.exports = {
  setPostLike,
  deletePostLike,
  checkPostLike

};
