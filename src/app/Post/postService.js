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

exports.editPost = async function (postIdx, content) {
    const connection = await pool.getConnection(async conn => conn);

    try {
        const editPostParams = [content, postIdx];
        const editPostResult = await postDao.updatePost(
            connection,
            editPostParams
        );

        return response(baseResponse.SUCCESS);
    } catch (err) {
        console.log(`App - editPost Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    } finally {
        connection.release();
    }
};

exports.editPostStatusPost = async function (postIdx) {
    const connection = await pool.getConnection(async conn => conn);

    try {
        // 포스트 삭제 전, 포스트가 ACTIVE 인지 확인부터 해야함.

        // 게시물 상태조회
        const checkPostStatusResult = await postProvider.checkPostStatus(
            postIdx
        );

        if (checkPostStatusResult == 'INACTIVE') {
            return errResponse(baseResponse.POST_STATUS_INACTIVE);
        } else if (checkPostStatusResult == '') {
            return errResponse(baseResponse.POST_NOT_EXIST);
        }

        // 게시물 삭제
        const editPostStatusResult = await postDao.updatePostStatus(
            connection,
            postIdx
        );
        return response(baseResponse.SUCCESS);
    } catch (err) {
        console.log(`App - deletePost Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    } finally {
        connection.release();
    }
};
