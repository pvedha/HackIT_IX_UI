var userIdsResponse = "";
var userIdsResponseReceived = false;
var validUserId = true;
var currentUserId = "";
var currentUserDetails;
var myJobtitle;
var token = "";

var myGasLimit = 6721975;

var myAddress;

var loadedContract;
var currentContract;
var filterPending;
var filterLatest;
var watchDog = false;

var url = 'http://10.78.213.217:80'; //window.location.host;
var baseURL = url; // + "/docmgr/doc"; //http://hostname:8080/blog/blog
var appURL = url + "/docmgr" //http://hostname:8080/blog

var fileBasePath = "c:/temp";
var fileServiceUrl = url + "/Js/rest";
var fileUploadUrl = fileServiceUrl + "/file/upload?filePath=";
var fileDownloadUrl = "/Js/rest/file/get?filePath=";

var dashBoardLinkHtml;


var docControllerAngular; // = angular.element($('#BlogPostController-Div')).scope();
var userControllerAngular
var contractControllerAngular;
var childControllerAngular;
var actionControllerAngular;
var updateActionControllerAngular;
var updateChildControllerAngular;
var updateDocumentControllerAngular;
var propertiesControllerAngular;


var jobTitles = [];
var actionStates = [];
var docStates = [];
var staffs = [];
var myActions = [];
var myDocuments = [];
var myChildren = [];

var httpPost = 'post';
var httpGet = 'get';
var httpPut = 'put';

var selectedUserType = "";
//Dev settings
var infiniteScroll = true;
var currentOffset = 1;
var debugMode = false;


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
            searchChildren($("#search-text").val());
        }
    });

    $("#search-text1").keypress(function (event) {
        var keycode = (event.keyCode ? event.keyCode : event.which);
        if (keycode == '13') {
            //searchAllPosts($("#search-text1").val());
            setStatus('please login');
        }
    });

    $("#user-profile-form").keypress(function (event) {
        $("#user-profile-update").removeClass("disabled-button");
        $("#user-profile-update").addClass("btn1"); //will this keep adding the same class?                  
    });

    $("#ManageControls-user-type").on('change', function () {
        updateManageControlsPageValues();
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
    $('#addStaff-submit-button').click(
        function () {
            addStaff();
        });
    $('#createContract-submit-button').click(
        function () {
            createContract();
        });
    $('#search-button').click(
        function () {
            searchAllPosts();
        });
    $('#post-comment-button').click(
        function () {
            addComment();
        });

    document.getElementById('myFile').onchange = function () {
        $("#UpdateContract-hash").val(jsmd5(this.value));
    };

    userControllerAngular = angular.element($('#UserController-Div')).scope();
    contractControllerAngular = angular.element($('#MyContracts-Div')).scope();
    docControllerAngular = angular.element($('#DocController-Div')).scope();
    childControllerAngular = angular.element($('#ChildController-Div')).scope();
    actionControllerAngular = angular.element($('#ActionController-Div')).scope();
    updateActionControllerAngular = angular.element($('#UpdateAction-Div')).scope();
    updateChildControllerAngular = angular.element($('#UpdateChild-Div')).scope();
    updateDocumentControllerAngular = angular.element($('#UpdateDocument-Div')).scope();
    propertiesControllerAngular = angular.element($('#PropertiesController-Div')).scope();

    $('[data-toggle="tooltip"]').tooltip();

    hideAllForms();
    loadContents();
    try {
        if (localStorage.getItem("userId") !== null && localStorage.getItem("token")) {
            validateSession();
        } else {
            showLoginPage();
        }
    } catch (e) {
        showLoginPage();
    }
    $('.affixed').affix({
        offset: {
            top: 50
        }
    });

    $("#myCarousel").carousel("pause");

});


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
        url: baseURL + '/user/authenticate/' + userId,
        type: 'get',
        accept: 'application/json',
        global: false,
        success: function (response) {
            loadMainPage(response);
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            log("Invalid user credentials");
            $("#status-message").html("Invalid crendentials, please try again");
            //$("#login-message").css({ 'color': 'green', 'font-size': '100%' });
            showLoginPage();
        }
    })
}

function validateSession() {
    var userId = localStorage.getItem("userId");
    var token = localStorage.getItem("token");
    authenticate(userId, "");
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
    localStorage.setItem("userId", "");
    localStorage.setItem("token", "");
    window.location.href = appURL;
}




function loadContents() {
    //retrieveJobTitles(); not here. 
    //initAllUsers();
    //retrieveDocStates();
    //retrieveActionStates();
}

function showLoginPage() {
    $("#signup-form").hide();
    $("#result-div").hide();
    $("#mainPage").hide();
    $("#LoginForm").show();
    $("#LoggedInForm").hide();

}

function hideAllForms() {
    $("#LoginForm").hide();
    $("#LoggedInForm").hide();
    $("#NotLogged").hide();
    // $("#post-comment-button").prop("disabled", true);
    //$("#comment-textarea").prop("disabled", true);

    //$("#loading-more").hide();
    //$("#thats-all").hide();

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
