const { databaseQuery } = require("../lib/database");

async function setPostVote(request,response) {
  try {
    const {postId,voteOption} = request.body ; 
    const userid = request.user.id ; 
    const postQuery = `insert into vote (user_id,post_id,vote_option) values ($1, $2, $3) ;`
    const result = await databaseQuery(postQuery,[userid, postId, voteOption]); 
    response.status(200).send({ message: "success" });
  } catch(err) {
    console.log('setVte:error:',err);
    response.status(500).send({ error:err});
  }
};

async function deletePostVote(request,response){
  try {
    const {postId} = request.body;
    const userId = request.user.id ; 
    const postQuery = `DELETE FROM vote WHERE user_id = $1 and post_id = $2`
    await databaseQuery(postQuery,[userId,postId]) ; 
    response.status(200).send({ message: "success" });
  } catch(err) {
    console.log("deletePostLike:error:",err);
    response.status(500).send({ error: err });

  }
}


async function checkPostVote(request, response) {
  try {
    const { postId } = request.params;
    const userId = request.user.id ;
    const postQuery = `SELECT EXISTS (SELECT 1 FROM vote WHERE user_id = $1  AND post_id =  $2)`;
    const result = await databaseQuery(postQuery,[userId,postId]); 
    const isVote = result.rows[0].exists; 
    const json = {isVote:isVote} ;
    response.status(200).json(json);
  } catch (err) {
    console.log("checkPostLike:error:",err); 
    response.status(500).send({error:err});
  }
}


module.exports = {
  setPostVote,
  checkPostVote,
  deletePostVote
}