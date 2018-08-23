function newPost() {

    var userId = currentUserId;
    //console.log("Current User" + currentUserId);
    // userId = "bloguser";
    var title = $("#new-post-title").val();
    var message = $("#new-post-message").val();
    var tags = $("#new-post-tags").val();
    var category = $("#new-post-category").val();
    $("#new-post-info").css({
        'color': 'green',
        'font-size': '100%'
    });
    if (title.trim().length === 0 || message.trim().length === 0) {
        $("#new-post-info").html("Title / Message cannot be empty");
        //console.log("Title / message cannot be empty");
        return;
    }

    $("#new-post-info").html("Please wait, submitting post...");
    // $("#new-post-info").css({ 'color': 'green', 'font-size': '100%' });
    //    console.log(userId + title + message + tags + category);
    var data = {
        userId: userId,
        title: title,
        message: message,
        tags: tags,
        category: category
    };
    $.ajax({

        url: baseURL + '/post/makePost',
        type: 'post',
        contentType: 'application/json',
        global: false,
        success: function (response) {
            //console.log("Posting done");
            $("#new-post-info").html("Successfully Posted.");
            showPostsView();
            readAllPosts();

        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            //console.log("Error submitting the post");
            $("#new-post-info").html(
                "Error submitting the post, please try again");
        },
        data: JSON.stringify(data)
    })
}

function addComment() {
    var userId = currentUserId;
    //    console.log("Current User" + currentUserId);
    var message = $("#comment-textarea").val();
    var postId = currentPostId;
    if (message.trim().length === 0) {
        $("#new-comment-info").html("Comment cannot be empty");
        //        console.log("Title / message cannot be empty");
        return;
    }
    $("#new-post-info").html("Please wait, submitting post...");
    //$("#new-post-info").css({ 'color': 'green', 'font-size': '100%' });
    //    console.log(userId + postId + message);
    var data = {
        postId: postId,
        message: message,
        userId: userId,
    };
    $.ajax({
            url: baseURL + '/post/addComment',
            type: 'post',
            contentType: 'application/json',
            global: false,
            success: function (response) {
                //$("#viewForm").hide();
                //displayPosts(response);
                //console.log("Comment added");
                $("#new-comment-info").html("Successfully Posted.");
                loadSamePost = true;
                readAllPosts();
                $("#comment-textarea").val("");
                //$.when( readAllPosts() ).then(function() {
                //	viewPost(postId);
                //});                                    
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                //                    console.log("Error submitting the post");
                $("#new-comment-info").html("Error submitting the post, please try again");
                showViewPostView();
                //$("#login-message").css({ 'color': 'green', 'font-size': '100%' });
            },
            data: JSON.stringify(data)
        })
        //    userId = "bloguser";


}

function newChat() {
    var userId = currentUserId;
    //console.log("Current User" + currentUserId);
    var message = $("#new-chat-message").val();

    if (message.trim().length === 0) {
        //        $("#new-comment-info").html("chat cannot be empty");
        //        console.log("chat msg cannot be empty");
        return;
    }
    var data = {
        message: message,
        userId: userId,
    };
    $.ajax({
            url: baseURL + '/newChat',
            type: 'post',
            contentType: 'application/json',
            global: false,
            success: function (response) {
                //$("#viewForm").hide();
                //displayPosts(response);
                //                    console.log("Posting done");
                //                    $("#new-chat-info").html("Successfully Posted.");
                $("#new-chat-message").val("");
                //showChatView();                
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                //                    console.log("Error submitting the post");
                //                    $("#new-chat-info").html("Error submitting the post, please try again");
                //showChatView();
                //$("#login-message").css({ 'color': 'green', 'font-size': '100%' });
            },
            data: JSON.stringify(data)
        })
        //    userId = "bloguser";


}

function readChats() {

    $.ajax({
        url: baseURL + '/getChats',
        type: 'get',
        accept: 'application/json',
        global: false,
        headers: {
            "token": token,
            "userId": currentUserId
        },
        success: function (response) {
            // $("#viewForm").hide();
            displayChats(response);
            //window.setTimeout(update, 10000);
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            log("Error reading the chats");
            //$("#post-info").html("Error Loading the posts, please try again");
            // $("#login-message").css({ 'color': 'green', 'font-size': '100%'
            // });
        }
    })

}

function displayChats(response) {
    $("#show-chat-div").html("");
    var htmlContent = "";
    for (i = 0; i < response.length; i++) {
        var chat = response[i];
        htmlContent += "<p class='chatMessage'>" + chat.chatmsg;
        htmlContent += "<p class='chatDetail'>" + chat.postedBy;
        htmlContent += " : " + chat.postedon + "</p>";
    }
    $("#show-chat-div").append(htmlContent);
    $("#show-chat-div").animate({
        scrollTop: $('#show-chat-div').height() + 500
    }, 1000);
}



function readAllPosts() {
    showPostsView();
    $("#post-info").html("Please wait, loading posts...");
    $("#post-info").css({
        'color': 'green',
        'font-size': '100%'
    });
    $.ajax({
        url: baseURL + '/post/all',
        type: 'get',
        accept: 'application/json',
        global: false,
        success: function (response) {
            // $("#viewForm").hide();
            readPostResponse = response;
            if (loadSamePost) {
                viewPost(currentPostId);
                loadSamePost = false;
            } else {
                $("#posts-heading").html("Latests Posts");
                displayPosts(response);
            }

        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            log("Error Loading the posts read");
            $("#post-info").html("Error Loading the posts, please try again");
            // $("#login-message").css({ 'color': 'green', 'font-size': '100%'
            // });
        }
    })
}



function readLimitedPosts() {
    showPostsView();
    $("#post-info").html("Please wait, loading posts...");
    $("#post-info").css({
        'color': 'green',
        'font-size': '100%'
    });
    log("Reading limited posts from offset : " + currentOffset);
    $.ajax({
        url: baseURL + '/post/offset/' + currentOffset,
        type: 'get',
        accept: 'application/json',
        global: false,
        success: function (response) {
            // $("#viewForm").hide();
            var receivedCount = response.length;
            if (receivedCount > 0) {
                if (readPostResponse.length === 0) {
                    readPostResponse = response; // Seems we dont need this, appending to empty array is possible
                } else {
                    readPostResponse.push.apply(readPostResponse, response);
                }

                currentOffset = currentOffset + receivedCount;
                log("The posts received now " + readPostResponse.length + ".. current offset : " + currentOffset);
                if (loadSamePost) {
                    viewPost(currentPostId);
                    loadSamePost = false;
                } else {
                    $("#posts-heading").html("Latests Posts");
                    displayPosts(readPostResponse);
                    log("New posts displayed");
                    loadMoreContents = true;
                    $("#loading-more").show();
                }
            } else {
                //log("Thats all man, nothing more");
                loadMoreContents = false;
                $('#loading-more').hide();
                $('#thats-all').show();
            }

            if (receivedCount < 10) {
                //log("Thats all man, nothing more");
                loadMoreContents = false;
                $('#loading-more').hide();
                $('#thats-all').show();
            }

        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            log("Error Loading the posts read");
            $("#post-info").html("Error Loading the posts, please try again");
            // $("#login-message").css({ 'color': 'green', 'font-size': '100%'
            // });
            //log("Thats all man, nothing more2");
            loadMoreContents = false;
            $('#loading-more').hide();
            $('#thats-all').show();
        }
    })
}


function stopLoadingMore() {
    loadMoreContents = false;
    $('#loading-more').hide();
    $('#thats-all').show();
}

function searchByCategory(category) {
    $("#post-info").html("Please wait, loading posts...");
    $("#post-info").css({
        'color': 'green',
        'font-size': '100%'
    });
    //    console.log("Searching for category " + category);
    $.ajax({
        url: baseURL + '/post/category/' + category,
        type: 'get',
        accept: 'application/json',
        global: false,
        success: function (response) {
            // $("#viewForm").hide();
            //            console.log("successfully received posts for category " + category);
            $("#posts-heading").html("Latests posts, Category : " + category);
            showPostsView();
            displayPosts(response);
            stopLoadingMore();

        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            console
                .log("Error retrieving the posts search by category " + category);
            //$("#post-info").html(
            //"Posts not available for category : " + category);
            showPostsView();
            stopLoadingMore();
            // $("#login-message").css({ 'color': 'green', 'font-size':
            // '100%' });
        }
    })
}

function searchAllPosts(searchString) {

    //var searchString = ;
    if (searchString.trim().length === 0) {
        //        console.log("search string cannot be empty");
        return;
    }
    $("#post-info").html("Please wait, loading posts for search string '" + searchString + "'");
    $("#post-info").css({
        'color': 'green',
        'font-size': '100%'
    });
    $.ajax({

        url: baseURL + '/post/search/' + searchString,
        type: 'get',
        accept: 'application/json',
        global: false,
        success: function (response) {
            showPostsView();
            displayPosts(response);
            $("#post-info").html("Posts for search string '" + searchString + "'");
            $("#post-info").css({
                'color': 'green',
                'font-size': '100%'
            });
            stopLoadingMore();

        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            $("#post-info").html("No results found");
            showPostsView();
            stopLoadingMore();
            //$("#login-message").css({ 'color': 'green', 'font-size': '100%' });
        }
    })
}

function displayPosts(response) {
    //readPostResponse = response; //redundant we did already in load ajax
    //    console.log("Reading posts done.");
    $("#post-contents").html("");
    //postControllerAngular.clear();
    postControllerAngular.addPosts(response);
    postControllerAngular.$apply();
    $("#post-info").html("");
    retrieveFavourites();
}

function viewPost(postId) {

    if (readPostResponse.length === 0) {
        //        console.log("Couldnt display the selected post");
        $("#view-post-info").html("Couldnt display the selected post");
        $("#view-post-info").css({
            'color': 'green',
            'font-size': '100%'
        });
        return;
    }

    //currentPostId = postId;
    for (i = 0; i < readPostResponse.length; i++) {
        if (postId === readPostResponse[i].postId) {
            currentPost = readPostResponse[i];
            break;
        }
    }

    loadSelectedPost(currentPost);
}

function loadSelectedPost(currentPost) {
    currentPostId = currentPost.postId;
    $("#view-post-title").html(currentPost.title);
    $("#view-post-message").html(currentPost.message);
    $("#view-post-by").html("Posted By : <b>" + currentPost.userName + "</b>");
    $("#view-post-time").html("Posted On : " + currentPost.postedOn);
    $("#view-post-tags").html("Tags : " + currentPost.tags);
    $("#view-post-category").html("Category : " + currentPost.category);

    var favPost = false;
    if (currentUserFavouriteList.length != 0) {
        for (i = 0; i < currentUserFavouriteList.length; i++) {
            if (currentPostId === currentUserFavouriteList[i]) {
                favPost = true;
            }
        }
    }

    if (favPost) {
        setRemoveFavourite(currentPostId);
    } else {
        setAddFavourite(currentPostId);
    }


    currentPostComments = currentPost.comments;
    var htmlContent = "";
    for (i = 0; i < currentPostComments.length; i++) {
        var comment = currentPostComments[i];
        htmlContent += "<hr style='height:0.5px; margin: 10px 0 10px 0' color=white ><p class='post-message'>" + comment.message + "</p>";

        htmlContent += "<p class='post-detail'>By : <b>" + comment.userId + "</b> ,<span>   </span> On : " + comment.postedOn + "</p>";
    }
    $("#view-post-comments-div").html(htmlContent);
    showViewPostView();
}

function addFavourite(postId) {

    $.ajax({
        url: baseURL + '/favourite/add/' + currentUserId + '/' + postId,
        type: 'post',
        contentType: 'application/json',
        global: false,
        success: function (response) {
            //            console.log("Added to favoutires");
            setRemoveFavourite(postId);
            retrieveFavourites();

        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            //            console.log("Error adding to favourites");
            $("#add-favourite-div").html(
                "<p class='quicklink-title'>Error : </p><a href='#' onClick=addFavourite(" + postId + ")> Try again </a>");
        },
        //		data : JSON.stringify(data)
    })
}

function removeFavourite(postId) {

    $.ajax({
        url: baseURL + '/favourite/remove/' + currentUserId + '/' + postId,
        type: 'post',
        contentType: 'application/json',
        global: false,
        success: function (response) {
            //            console.log("Removed from favoutires");
            setAddFavourite(postId);
            retrieveFavourites();
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            log("Error adding to favourites");
            $("#add-favourite-div").html(
                "<p class='quicklink-title'>Error : </p><a href='#' onClick=removeFavourite(" + postId + ")> Try again </a>");
        },
        //		data : JSON.stringify(data)
    })
}

function setAddFavourite(postId) {
    $("#add-favourite-div").html("<p class='quicklink-title'> <img src='img/22xFavourite.png' class='img-grayed'> " + "<a href='#' onClick=addFavourite(" + postId + ")> Add Favourite Post </a>");
}

function setRemoveFavourite(postId) {
    $("#add-favourite-div").html("<p class='quicklink-title'> <img src='img/22xFavourite.png'> Favourite Post <a href='#' onClick=removeFavourite(" + postId + ")> Remove </a>");
}

function showNewPost() {
    $("#post-div").hide();
    $("#view-post-div").hide();
    $("#user-profile-div").hide();
    $("#new-post-title").val("");
    $("#new-post-message").val("");
    $("#new-post-tags").val("");
    $("#new-post-info").html("");
    $("#new-post-div").slideDown(1000);
}

function showPostsView() {
    $("#new-post-div").hide(); // .fadeOut(5000);
    $("#view-post-div").hide();
    $("#user-profile-div").hide();
    $("#post-div").fadeIn(2000);
}

function showViewPostView() {
    $("#new-post-div").hide();
    $("#post-div").hide();
    $("#user-profile-div").hide();
    $("#view-post-div").fadeIn(2000);
}

function retrieveCategory() {
    $.ajax({
        url: baseURL + '/category',
        type: 'get',
        accept: 'application/json',
        global: false,
        success: function (response) {
            var postCategory = document
                .getElementById("new-post-category");
            $("#category-links").html("");
            var categoryLinks = "";
            for (i = 0; i < response.length; i++) {
                var option = document.createElement("option");
                option.text = response[i];
                postCategory.add(option);
                categoryLinks += "<a class='quicklink-links' href='#' onClick=searchByCategory('" + response[i] + "')>" + response[i] + "</a><br>";
            }
            $("#category-links").append(categoryLinks);
            //            console.log("added items");

        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            log("Error Loading categories");
            $("#category-links").html("Error Loading categories");
        }
    })
}

function retrieveFavourites() {
    $("#favourite-links").html("");
    $.ajax({
        url: baseURL + '/favourite/' + currentUserId,
        type: 'get',
        accept: 'application/json',
        global: false,
        success: function (response) {

            var favouriteLinks = "";


            if (readPostResponse.length === 0) {
                return;
            }
            currentUserFavouriteList = response;

            for (i = 0; i < response.length; i++) {
                //                var linkText = getLinkTextFor(response[i]);
                //                if(linkText.length > 50){
                //                    linkText = linkText.trim(40) + "...";
                //                }
                //The above fails miserably after 4th iteration????

                var linkText = "";
                for (j = 0; j < readPostResponse.length; j++) {
                    if (response[i] === readPostResponse[j].postId) {
                        linkText = readPostResponse[j].title;
                        break;
                    }
                }

                favouriteLinks += "<a class='quicklink-links' href='#' onClick=viewPost(" + response[i] + ")>" + linkText + "</a><br>"; //May be trim needed. ??
            }
            $("#favourite-links").append(favouriteLinks);
            //            console.log("added items");
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            log("Error Loading favourites");
            $("#favourite-links").html("No favourite posts");
        }
    })
}


function getLinkTextFor(postId) {
    for (i = 0; i < readPostResponse.length; i++) {
        if (postId === readPostResponse[i].postId) {
            return readPostResponse[i].title;
        }
    }
}
