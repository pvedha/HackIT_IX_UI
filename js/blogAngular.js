var blogPostModule = angular.module("BlogPostApp", []);
blogPostModule.controller("BlogPostController", function ($scope) {


    $scope.posts = [];
    $scope.add = function () {
        $scope.posts.push({
            title: $scope.contact.name,
            message: $scope.post.message
        });
        $scope.addPost("Inside", "addFunction");
    };

    $scope.clear = function () {
        $scope.posts = [];
    };

    $scope.addPost = function (titleIn, messageIn, postIdIn, response) {
        $scope.posts.push({
            title: titleIn,
            message: messageIn,
            postId: postIdIn
        });
    };

    $scope.addPosts = function (response) {
        $scope.posts = [];
        for (i = 0; i < response.length; i++) {
            var post = response[i];
            var postMessage = "";
            if (post.message.length > 200) {
                postMessage = post.message.substring(0, 200) + "....."; //<a href='#' onClick=viewPost(" + response[i].postId
                //+ ")> read more </a>";
                //Check to make this contents as html
            } else {
                postMessage = post.message;
            }
            $scope.posts.push({
                title: post.title,
                message: postMessage,
                postId: post.postId,
                userName: post.userName,
                postedOn: post.postedOn,
                commentsCount: post.comments.length
            });
        }
    };



    $scope.chats = [];

    $scope.addChat = function (messageIn, userNameIn, timeIn) {
        $scope.chats.push({
            userName: userNameIn,
            message: messageIn,
            time: timeIn
        });
    };


});
