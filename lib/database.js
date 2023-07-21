const dbClient = require("../postgresql");

async function selectUser(id){
  try {
    const pgQuery = 'SELECT * FROM userData WHERE id = ($1)'
    const result = await dbClient.query(pgQuery,[id]); 
    return result.rows[0] ;
  } catch(err) {
    throw err ;
  }
}

async function setUser(user){
  try {
    const pgQuery = 'INSERT INTO userData(id,name,email,photo) VALUES ($1,$2,$3,$4)';
    dbClient.query(pgQuery,[user.id,user.name,user.email,user.photo])
    console.log('setUser')
  } catch(err){
    throw err ; 
  }
}


module.exports = {
  selectUser,
  setUser
}