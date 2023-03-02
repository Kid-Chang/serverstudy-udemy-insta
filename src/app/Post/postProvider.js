const { pool } = require('../../../config/database');
const postDao = require('./postDao');

exports.retrieveUserPosts = async function (userIdx) {
  const connection = await pool.getConnection(async (coon) => coon);
  const userPostsResult = await postDao.selectuserPosts(connection, userIdx);

  connection.release();

  return userPostsResult;
};
