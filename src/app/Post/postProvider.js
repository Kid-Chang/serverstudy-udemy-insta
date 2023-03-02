const { pool } = require('../../../config/database');
const postDao = require('./postDao');

exports.retrieveUserPosts = async function (userIdx) {
  const connection = await pool.getConnection(async (coon) => coon);
  const userPostsResult = await postDao.selectuserPosts(connection, userIdx);

  connection.release();

  return userPostsResult;
};

exports.retrievePostList = async function (userIdx) {
  const connection = await pool.getConnection(async (conn) => conn);
  const postListResult = await postDao.selectPosts(connection, userIdx);

  // 여기서 forEach 쓰면 안됨. forEach는 뿌려주는 거고, for of는 하나씩 잠깐 찢어서 빌려주는거. 즉, post.imgs라고 작성하는 부분들이 postListResult에 반영됨.
  for (post of postListResult) {
    const postIdx = post.postIdx;
    const postImgResult = await postDao.selectPostImgs(connection, postIdx);
    post.imgs = postImgResult;
  }

  connection.release();

  return postListResult;
};
