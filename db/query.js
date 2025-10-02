const pool = require("./pool");

async function createUser(user) {
  await pool.query(
    "INSERT INTO users(firstName,lastName,username,password) VALUES($1,$2,$3,$4)",
    [user.firstName, user.lastName, user.username, user.password]
  );
}

async function getUser(username) {
  const result = await pool.query("SELECT * FROM users WHERE username=$1", [
    username,
  ]);
  return result.rows[0];
}
async function getUserById(userid) {
  const result = await pool.query("SELECT * FROM users WHERE id=$1", [userid]);
  return result.rows[0];
}

async function updateMembership(num, userid) {
  await pool.query("UPDATE users SET membership= $1 WHERE id=$2", [
    num,
    userid,
  ]);
}

async function createMessage(msg) {
  await pool.query(
    "INSERT INTO messages(user_id, title, msg, date) VALUES ($1,$2,$3,$4)",
    [msg.userid, msg.title, msg.content, msg.date]
  );
}

async function getAllMessagesWithUsers() {
  const messages = await pool.query(
    "SELECT messages.title, messages.date,messages.msg,users.firstname,users.lastname  FROM messages JOIN users ON users.id=messages.user_id ORDER BY messages.date DESC;"
  );
  return messages.rows;
}

module.exports = {
  createUser,
  getUser,
  getUserById,
  updateMembership,
  createMessage,
  getAllMessagesWithUsers,
};
