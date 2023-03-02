module.exports = function (app) {
    const post = require('./postController');

    // 3.1 게시물 리스트 조회
    app.get('/posts', post.getPosts);

    // 3.2 게시물 생성 API
    app.post('/posts', post.postPosts);
};
