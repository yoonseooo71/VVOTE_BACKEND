const dbClient = require("../postgresql");

function getPostData(request,response){
  const limit = request.params.limit; 
  const offset = request.params.offset ;
  const postQuery = `SELECT P.*, UD.name as writer FROM posts as P INNER JOIN userdata as UD on P.uid = UD.id LIMIT $1 OFFSET $2;`
  dbClient.query(postQuery,[limit,offset],(err,result)=>{
    if (err) {
      response.status(500).send({ error: err });
    } else {
      response.status(200).json(result.rows);
    }
  }) 
}


function postWrite(req, res) {
  const { title, optiona, optionb, totalvotes, avotes, bvotes, commant} = req.body;
  const postQuery = `insert into posts(uid,title,optiona,optionb,totalvotes,avotes,bvotes,commant,regdate,updatedate,deletedate) values ($1,$2,$3,$4,$5,$6,$7,$8,CURRENT_TIMESTAMP,null,null)`;
  
  dbClient.query(
    postQuery,
    [req.user.id,title,optiona,optionb,totalvotes,avotes,bvotes,commant],
    (err) => {
      if (err) {
        res.status(500).send({ error: err });
      } else {
        res.status(200).send({ message: "success" });
      }
    }
  );
}
function getPostsCount(request,response) {
  const postQury = `select count(*) from posts`
  dbClient.query(postQury,(err,result)=>{
    if (err) {
      response.status(500).send({ error: err });
    } else {
      console.log(result.rows[0]);
      response.status(200).json(result.rows[0]);
    }
  })
}

module.exports = {
  getPostData,
  postWrite,
  getPostsCount,
};
