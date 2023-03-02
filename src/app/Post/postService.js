const { pool } = require('../../../config/database');
const baseResponse = require('../../../config/baseResponseStatus');
const { response, errResponse } = require('../../../config/response');
const postDao = require('./postDao');
const postProvider = require('./postProvider');

exports.createPost = async function (userIdx, content, postImgUrls) {
    const connection = await pool.getConnection(async conn => conn);

    try {
        const insertPostParams = [userIdx, content];
        const postResult = await postDao.insertPost(
            connection,
            insertPostParams
        );

        // 생성된 Post의 idx
        console.log('아래 값은 postResult 값을 출력');
        console.log(postResult);
        const postIdx = postResult[0].insertId;
        console.log(postImgUrls);
        for (postImgUrl of postImgUrls) {
            console.log(`출력: ${postImgUrl}`);
            const insertPostImgParams = [postIdx, postImgUrl];
            const postImgResult = await postDao.insertPostImg(
                connection,
                insertPostImgParams
            );
        }

        return response(baseResponse.SUCCESS, { addPost: postIdx });
    } catch (err) {
        console.log(`App - createPost Service Error\n: ${err.message}`);

        return errResponse(baseResponse.DB_ERROR);
    } finally {
        connection.release();
    }
};
