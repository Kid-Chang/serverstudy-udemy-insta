// 유저 게시글 조회
async function selectuserPosts(connection, userIdx) {
  const selectuserPostsQuery = `
    SELECT p.postIdx as postIdx,
        pi.imgUrl as postImgUrl    
    FROM Post as p 
        join PostImgUrl as pi on pi.postIdx = p.postIdx and pi.status = 'ACTIVE'
        join User as u on u.userIdx = p.userIdx
    WHERE p.status = 'ACTIVE' and u.userIdx = ?
    group by p.postIdx
    HAVING min(pi.postImgUrlIdx)
    order by p.postIdx;
    `;

  const [userPostsRows] = await connection.query(selectuserPostsQuery, userIdx);

  return userPostsRows;
}

module.exports = {
  selectuserPosts,
};
