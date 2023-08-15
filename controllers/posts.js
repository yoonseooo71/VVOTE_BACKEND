const { databaseQuery } = require("../lib/database");
const dbClient = require("../postgresql");

async function getInfiniteScrollData(request, response) {
  try {
    const limit = request.params.limit;
    const offset = request.params.offset;
    const postQuery = `
      SELECT P.*, UD.name as writer, 
      (SELECT COUNT(*) FROM posts_likes WHERE post_id = P.post_id) as likes,
      (SELECT COUNT(*) FROM comment WHERE post_id = P.post_id) as comment_count
      FROM posts as P 
      INNER JOIN userdata as UD on P.uid = UD.id 
      ORDER BY regdate asc 
      LIMIT $1 OFFSET $2;
    `;
    const result = await databaseQuery(postQuery,[limit,offset]); 
    response.status(200).json(result.rows);
  } catch(err) {
    console.log("getInfiniteScrollData:error:",err);
    response.status(500).send({ error: err });
  }
}
async function getPostInfo(request, response) {
  try {
    const postId = request.params.postId;
    const postQuery = `SELECT P.*, UD.name as writer FROM posts as P INNER JOIN userdata as UD on P.uid = UD.id where P.post_id = $1`;
    const countQuery = `SELECT COUNT(*) FROM posts_likes WHERE post_id =  $1`;
    const result = await databaseQuery(postQuery,[postId]) ; 
    const postData = result.rows[0];
    const countResult = await databaseQuery(countQuery,[postId]) ; 
    const count = parseInt(countResult.rows[0].count) ; 
    const json = {...postData,likes:count};
    response.status(200).json(json);
  } catch (err) {
    console.log("getPostInfo:error:",err);
    response.status(500).send({ error: err });
  }
}
async function getComment(request, response) {
  try {
    const postId = request.params.postId ; 
    const postQuery = `select * from comment where post_id = $1`;
    const result = await databaseQuery(postQuery,[postId]); 
    const data = result.rows.map((el)=>{return {...el,reply:[]}});
    const comments = data.filter((el)=>el.parents_id === null);
    const replyes = data.filter((el)=>el.parents_id !== null);
    replyes.forEach((reply)=>{
      comments.forEach(comment=>{
        if(reply.parents_id === comment.comment_id) {
          comment.reply.push(reply);
        }
      }) 
    })
    response.status(200).json(comments);
  } catch(err) {
    console.log("getComment:error:",err);
    response.status(500).send({error:err})
  }
}

async function getPostsCount(request, response) {
  try {
    const postQury = `select count(*) from posts`;
    const result = await databaseQuery(postQury) ;
    response.status(200).json(result.rows[0]); 
  } catch(err) {
    console.log("getPostCount:error:",err);
    response.status(500).send({ error: err });
  }
}
async function postWrite(req, res) {
  try {
    const { title, optiona, optionb, totalvotes, avotes, bvotes} =
    req.body;
    const postQuery = `insert into posts(uid,title,optiona,optionb,totalvotes,avotes,bvotes,regdate,updatedate,deletedate) values ($1,$2,$3,$4,$5,$6,$7,CURRENT_TIMESTAMP,null,null)`;
    await databaseQuery(postQuery,[req.user.id, title, optiona, optionb, totalvotes, avotes, bvotes])
    res.status(200).send({ message: "success" });
  } catch(err) {
    console.log("postWrite:error:",err);
    res.status(500).send({ error: err });

  }
}
async function commentWrite(request, response) {
  try {
    const {
      post_id,
      comment_id,
      writer_id,
      writer,
      contents,
      parents_id,
    } = request.body;
    const postQuery = `insert into comment (post_id,writer_id,writer,contents,parents_id, regdate,updatedate,deletedate) values($1,$2,$3,$4,$5,CURRENT_TIMESTAMP,null,null) RETURNING *`;
    const result = await databaseQuery(postQuery,[
      post_id,
      writer_id,
      writer,
      contents,
      parents_id,
    ])
    if (parents_id === null) {
      response.status(200).json({...result.rows[0],reply:[]});
    } else {
      response.status(200).json(result.rows[0]);
    }
  } catch(err){
    console.log("commentWrite:error:",err)
    response.status(500).send({ error:err});
  }
}


module.exports = {
  getInfiniteScrollData,
  getPostInfo,
  postWrite,
  getPostsCount,
  commentWrite,
  getComment,
};
