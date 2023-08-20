const { databaseQuery } = require("../lib/database");

async function getSearchInfiniteScrollData(request, response) {
  try {
    const limit = request.params.limit;
    const offset = request.params.offset;
    const searchQuery = request.query.q;
    const postQuery = `
      SELECT P.*, UD.name as writer, 
      cast ((SELECT COUNT(*) FROM posts_likes WHERE post_id = P.post_id) as integer) as likes,
      cast ((SELECT COUNT(*) FROM comment WHERE post_id = P.post_id) as integer) as comment_count,
      cast ((select count(*) from vote where post_id = P.post_id) as integer) as totalvotes,
      cast ((select count(*) from vote where post_id = P.post_id and vote_option = 'a') as integer) as avotes,
      cast ((select count(*) from vote where post_id = P.post_id and vote_option = 'b') as integer) as bvotes 
      FROM posts as P 
      INNER JOIN userdata as UD on P.uid = UD.id 
      WHERE P.deletedate is null 
      AND P.title LIKE concat('%',cast($1 as TEXT),'%')
      ORDER BY likes DESC 
      LIMIT $2 OFFSET $3;
    `;
    const result = await databaseQuery(postQuery, [searchQuery, limit, offset]);
    response.status(200).json(result.rows);
  } catch (err) {
    console.log("getInfiniteScrollData:error:", err);
    response.status(500).send({ error: err });
  }
}
module.exports = {
  getSearchInfiniteScrollData,
};
