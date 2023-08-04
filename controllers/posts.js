const { getUserName } = require("../lib/database");
const dbClient = require("../postgresql");

function getInfiniteScrollData(request, response) {
  const limit = request.params.limit;
  const offset = request.params.offset;
  const postQuery = `SELECT P.*, UD.name as writer FROM posts as P INNER JOIN userdata as UD on P.uid = UD.id order by id asc LIMIT $1 OFFSET $2;`;
  dbClient.query(postQuery, [limit, offset], (err, result) => {
    if (err) {
      response.status(500).send({ error: err });
    } else {
      response.status(200).json(result.rows);
      /** 데이터 전달 딜레이 테스트 코드*/
      // setTimeout(() => {
      //   response.status(200).json(result.rows);
      // }, 1000);
    }
  });
}
function getPostInfo(request, response) {
  const postId = request.params.postId;
  const postQuery = `SELECT P.*, UD.name as writer FROM posts as P INNER JOIN userdata as UD on P.uid = UD.id where P.id = $1`;
  dbClient.query(postQuery, [postId], (err, result) => {
    if (err) {
      response.status(500).send({ error: err });
    } else {
      response.status(200).json(result.rows[0]);
    }
  });
}

function getComment(request, response) {
  const postId = request.params.postId ; 
  const postQuery = `select * from comment where post_id = $1`;
  dbClient.query(postQuery,[postId],(err,result)=>{
    if (err) {
      response.status(500).send({ error: err });
    } else {
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
    }
  })
}

function getPostsCount(request, response) {
  const postQury = `select count(*) from posts`;
  dbClient.query(postQury, (err, result) => {
    if (err) {
      response.status(500).send({ error: err });
    } else {
      response.status(200).json(result.rows[0]);
    }
  });
}
function postWrite(req, res) {
  const { title, optiona, optionb, totalvotes, avotes, bvotes, commant} =
    req.body;
  const postQuery = `insert into posts(uid,title,likes,optiona,optionb,totalvotes,avotes,bvotes,comment_count,regdate,updatedate,deletedate) values ($1,$2,0,$3,$4,$5,$6,$7,$8,CURRENT_TIMESTAMP,null,null)`;

  dbClient.query(
    postQuery,
    [req.user.id, title, optiona, optionb, totalvotes, avotes, bvotes, commant],
    (err) => {
      if (err) {
        res.status(500).send({ error: err });
      } else {
        res.status(200).send({ message: "success" });
      }
    }
  );
}
function commentWrite(request, response) {
  const {
    post_id,
    comment_id,
    writer_id,
    writer,
    contents,
    likes,
    parents_id,
  } = request.body;
  const postQuery = `insert into comment values($1,$2,$3,$4,$5, $6,CURRENT_TIMESTAMP,null,null,$7)`;
  dbClient.query(
    postQuery,
    [
      post_id,
      comment_id,
      writer_id,
      writer,
      contents,
      likes,
      parents_id,
    ],
    (err) => {
      if (err) {
        response.status(500).send({ error: err });
      } else {
        response.status(200).send({ message: "success" });
      }
    }
  );
}

module.exports = {
  getInfiniteScrollData,
  getPostInfo,
  postWrite,
  getPostsCount,
  commentWrite,
  getComment
};
