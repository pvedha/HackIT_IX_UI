var userIdsResponse = "";
var userIdsResponseReceived = false;
var validUserId = true;
var currentUserId = "";
var currentUserDetails;
var token = "";
var url = 'http://' + window.location.host;
var baseURL = url + "/docmgr/doc"; //http://hostname:8080/blog/blog
var appURL = url + "/doc" //http://hostname:8080/blog
var readPostResponse = [];
var currentPostId = 0;
var currentPost;
var currentUserFavouriteList = [];
var userHasFavourites = false;
var loadSamePost = false;
var postControllerAngular; // = angular.element($('#BlogPostController-Div')).scope();


//Dev settings
var infiniteScroll = true;
var currentOffset = 1;
var debugMode = false;
var loadMoreContents = true;


$(document).ready(function () {
    $("#signup-form").keypress(function (event) {
        var keycode = (event.keyCode ? event.keyCode : event.which);
        if (keycode == '13') {
            addUser();
        }
    });
    $("#signin-form").keypress(function (event) {
        var keycode = (event.keyCode ? event.keyCode : event.which);
        if (keycode == '13') {
            login();
        }
    });
    $("#search-text").keypress(function (event) {
        var keycode = (event.keyCode ? event.keyCode : event.which);
        if (keycode == '13') {
            searchAllPosts($("#search-text").val());
        }
    });

    $("#search-text1").keypress(function (event) {
        var keycode = (event.keyCode ? event.keyCode : event.which);
        if (keycode == '13') {
            searchAllPosts($("#search-text1").val());
        }
    });

    $("#user-profile-form").keypress(function (event) {
        $("#user-profile-update").removeClass("disabled-button");
        $("#user-profile-update").addClass("btn1"); //will this keep adding the same class?                  
    });
    $('#trythis-button')
        .click(function () {
            retrieveCategory();
        });

    $('#trythis2-button')
        .click(function () {
            readAllPosts();
        });

    $('#login-button').click(
        function () {
            login();
        });

    $('#signup-button').click(
        function () {
            addUser();
        });

    $('#newPost-submit-button').click(
        function () {
            newPost();
        });
    //    $('#newChat-submit-button').click(
    //        function () {
    //            newChat();
    //        });
    $('#search-button').click(
        function () {
            searchAllPosts();
        });
    $('#post-comment-button').click(
        function () {
            addComment();
        });

    postControllerAngular = angular.element($('#BlogPostController-Div')).scope();

    $('[data-toggle="tooltip"]').tooltip();


    //    console.log("Data from localStorage", localStorage.getItem("userId"));
    hideAllForms();
    if (localStorage.getItem("userId") !== null && localStorage.getItem("token")) {
        validateSession();
    } else {
        showLoginPage();
    }
    loadContents();
    $('.affixed').affix({
        offset: {
            top: 50
        }
    });

    $("#myCarousel").carousel("pause");

});

function addUser() {
    if (!validUserId) {
        alert("User Id taken. Please try another");
        return;
    }
    $("#validUser").html("Creating User...");
    var userid = $("#userid").val();
    var name = $("#username").val();
    var password = $("#password").val();
    var about = $("#about").val();
    var data = {
        userid: userid,
        name: name,
        password: password,
        about: about
    };
    $
        .ajax({
            url: baseURL + '/user/addUser',
            type: 'post',
            contentType: 'application/json',
            success: function (response) {
                $("#validUser")
                    .html("Thanks for signing. Please login.");
                toggleSignform();
                document.getElementById('myModal').style.display = "none";
                authenticate(userid, password);
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                $("#validUser")
                    .html("Sorry invalid details, please try again. " + textStatus + " : " + errorThrown);
            },
            data: JSON.stringify(data),
        });
};

function getUserIds() {
    //    console.log("receiving user ids");
    $.ajax({
        url: baseURL + '/user/ids',
        type: 'get',
        accept: 'application/json',
        global: false,
        success: function (response) {
            //$("#viewForm").hide();
            $("#result-div")
                .html(
                    response);
            userIdsResponse = response;
            userIdsResponseReceived = true;
            //            console.log("Rsp 1" + response);
            $("#result-div").show();
            return response;
        }
    })
};


//Main Functionality after logging in. 
function login() {
    $("#loginMessage").html("Please wait, validating credentials...");
    $("#loginMessagee").css({
        'color': 'green',
        'font-size': '100%'
    });
    //    var userId = $("#loginId").val();
    //    var password = $("#loginPassword").val();
    authenticate($("#loginId").val(), $("#loginPassword").val());
};


function authenticate(userId, password) {
    $.ajax({
        url: baseURL + '/user/' + userId + '/' + password,
        type: 'get',
        accept: 'application/json',
        global: false,
        success: function (response) {
            //$("#viewForm").hide();
            //            console.log("Valid user");
            //<img id='current-user-icon' src='img/48px-User_icon_2.svg.png'/> 
            //$("#current-user-icon").css("filter", "none");
            loadMainPage(response);
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            log("Invalid user credentials");
            $("#loginMessage").html("Invalid crendentials, please try again");
            //$("#login-message").css({ 'color': 'green', 'font-size': '100%' });
        }
    })
}

function validateSession() {
    var userId = localStorage.getItem("userId");
    var token = localStorage.getItem("token");
    $.ajax({

        url: baseURL + '/user/validate',
        type: 'get',
        accept: 'application/json',
        global: false,
        headers: {
            "token": token,
            "userId": userId
        },
        success: function (response) {
            //$("#viewForm").hide();
            //            console.log("user logged in already");
            //<img id='current-user-icon' src='img/48px-User_icon_2.svg.png'/> 
            //$("#current-user-icon").css("filter", "none");
            loadMainPage(response);

        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            log("Invalid user credentials");
            //$("#loginMessage").html("Invalid crendentials, please try again");
            //$("#login-message").css({ 'color': 'green', 'font-size': '100%' });
            showLoginPage();
            $("#Logged").hide();
            $("#LoggedInForm").hide();
            $("#NotLogged").show();
        }
    })
};



function updateProfile() {
    $("#user-profile-info").html("updating your profile...");
    var userId = currentUserId;
    var userName = currentUserDetails.name;
    var emailId = "";
    var password = "";
    var newPassword = $("#view-profile-newPassword").val().trim();
    var about = $("#view-profile-about").val();
    var data = {
        userId: userId,
        userName: userName,
        emailId: emailId,
        password: password,
        newPassword: newPassword,
        about: about
    };
    $.ajax({
        url: baseURL + '/user/update',
        type: 'post',
        contentType: 'application/json',
        success: function (response) {
            $("#user-profile-info").html("Profile updated successfully");
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            $("#user-profile-info")
                .html("Error validating details, please try again. " + textStatus + " : " + errorThrown);
        },
        data: JSON.stringify(data),
    });

}



function viewProfile() {
    $("#post-div").hide();
    $("#view-post-div").hide();
    $("#new-post-div").hide();
    $("#user-profile-fixed").html("User ID : <b>" + currentUserId + "</b><br>Name : <b>" + currentUserDetails.name);
    $("#view-profile-about").val(currentUserDetails.about);
    $("#user-profile-div").fadeIn(1000);

}

function sleep(milliseconds) {
    var start = new Date().getTime();
    for (var i = 0; i < 1e7; i++) {
        if ((new Date().getTime() - start) > milliseconds) {
            break;
        }
    }
}

function validateUser(value) {
    //console.log(value);
    if (userIdsResponseReceived) {
        for (i = 0; i < userIdsResponse.length; i++)
            if (userIdsResponse[i].toLocaleLowerCase() === value.trim().toLocaleLowerCase()) {
                //                console.log("UserId Exists " + value);
                $("#validUser").html("User ID " + value + " not available");
                $("#validUser").css({
                    'color': 'red',
                    'font-size': '100%'
                });
                validUserId = false;
                return;
            } else {
                $("#validUser").html("User Id " + value + " available");
                $("#validUser").css({
                    'color': 'green',
                    'font-size': '100%'
                });
                validUserId = true;
            }
    }
}

function toggleSignform() {
    $("#signup-form").toggle();
    $("#signin-form").toggle();
}

function signOut() {
    Chat.loginMessage("Signing out");
    localStorage.setItem("userId", "");
    localStorage.setItem("token", "");
    window.location.href = appURL;
}




function loadMainPage(response) {
    token = response.token; //new token?
    $("#current-user-icon").html("<img src='img/48px-User_icon_2.svg.png' class='img-normal'/>");
    $("#user-detail-div").html("<b>" + response.name + "</b><p><i>" + response.about);
    currentUserId = response.userId;
    currentUserDetails = response;
    $("#user-button").html("<span class='glyphicon glyphicon-user' > </span>" + response.name);
    localStorage.setItem("userId", response.userId);
    localStorage.setItem("token", response.token);
    //    console.log("user id assigned" + currentUserId + "complete response " + response);
    $("#LoginForm").hide();
    $("#NotLogged").hide();
    $("#LoggedInForm").show();
    $("#mainPage").show().fadeIn(50000); //to be removed in new version
    $("#mainPage").fadeIn(5000); // to be removed in new version.   
    //$("#newChat - submit - button").prop("disabled", false);
    $("#new-chat-message").prop("disabled", false);
    $("#post-comment-button").prop("disabled", false);
    $("#comment-textarea").prop("disabled", false);

    //Chat.initialize();
    setTimeout(function () {
        Chat.loginMessage("Just logged in.")
    }, 3000);
}


function loadContents() {
    retrieveCategory();
    if (infiniteScroll) {
        readLimitedPosts();
    } else {
        readAllPosts();
    }
    if (currentUserId != "") {
        retrieveFavourites();
    }
    window.setInterval(function () {
        //readChats();
    }, 3000);
    //readChats();
}

function showLoginPage() {
    $("#signup-form").hide();
    $("#result-div").hide();
    $("#mainPage").hide();
    //$("#loginPage").hide(); //to hide first
    //$("#post-div").hide(); //This is shown at all times
    $("#new-post-div").hide();
    $("#view-post-div").hide();
    $("#user-profile-div").hide();
    $("#LoginForm").show();
    $("#LoggedInForm").hide();

}

function hideAllForms() {
    $("#LoginForm").hide();
    $("#LoggedInForm").hide();
    $("#NotLogged").hide();
    //$("#newChat-submit-button").prop("disabled", true);
    $("#new-chat-message").prop("disabled", true);
    $("#post-comment-button").prop("disabled", true);
    $("#comment-textarea").prop("disabled", true);

    $("#loading-more").hide();
    $("#thats-all").hide();

}

function skipLogin() {
    $("#user-div").html("<br>User : debugger<p><i> A quick way to debug");
    $("#user-div").append("<a href='" + url + "'>Sign out</a>");
    currentUserId = "u";
    //    console.log("user id assigned" + currentUserId);
    $("#loginPage").hide();
    $("#mainPage").show().fadeIn(50000);
    $("#mainPage").fadeIn(5000);
    readAllPosts();
    retrieveCategory();
}

function allowDrop(ev) {
    ev.preventDefault();
    //    console.log("Allowdrop ID " + ev.target.id);
}

function drag(ev) {
    ev.dataTransfer.setData("text", ev.target.id);
    //    console.log("Event Target ID " + ev.target.id);
}

function drop(ev) {
    ev.preventDefault();
    var data = ev.dataTransfer.getData("text");
    var targetId = "";
    var offsetParentItem = ev.target;
    while (true) {
        targetId = offsetParentItem.id;
        if (targetId == "main-contents-div" || targetId == "chat-div" || targetId == "quicklinks-div") {
            document.getElementById("droppable-div").insertBefore(document.getElementById(data), document.getElementById(targetId)); //sort of works, identify before item dynamically.
            break;
        }
        if (targetId == "body") {
            break;
        }
        offsetParentItem = offsetParentItem.offsetParent;
    }

}

$(window).scroll(function () {
    // This is the function used to detect if the element is scrolled into view
    function elementScrolled(elem) {
        var docViewTop = $(window).scrollTop();
        var docViewBottom = docViewTop + $(window).height();
        var elemTop = $(elem).offset().top;
        return ((elemTop <= docViewBottom) && (elemTop >= docViewTop));
    }
    if (elementScrolled('#loading-more')) {
        if (loadMoreContents) {
            readLimitedPosts();
            loadMoreContents = false;
        }
    }
});
