function setStaffRoles() {

    $("#child-teacher").find('option').remove().end();
    $("#child-councillor").find('option').remove().end();
    $("#child-therapist").find('option').remove().end();
    $("#UpdateDocument-owner").find('option').remove().end();
    $("#AddDocument-owner").find('option').remove().end();
    $("#UpdateChild-Teacher").find('option').remove().end();
    $("#UpdateChild-Councillor").find('option').remove().end();
    $("#UpdateChild-Therapist").find('option').remove().end();
    $("#AddAction-owner").find('option').remove().end();

    var teachers = document.getElementById("child-teacher");
    var councillors = document.getElementById("child-councillor");
    var therapists = document.getElementById("child-therapist");
    var updateDocumentOwner = document.getElementById("UpdateDocument-owner");
    var addDocumentOwner = document.getElementById("AddDocument-owner");
    var addDocumentCreator = document.getElementById("AddDocument-creator");
    var updateChildTeacher = document.getElementById("UpdateChild-Teacher");
    var updateChildCouncillor = document.getElementById("UpdateChild-Councillor");
    var updateChildTherapist = document.getElementById("UpdateChild-Therapist");
    var addActionOwner = document.getElementById("AddAction-owner");
    for (i = 0; i < staffs.length; i++) {
        addStaffRoleToSelect(teachers, staffs[i]);
        addStaffRoleToSelect(councillors, staffs[i]);
        addStaffRoleToSelect(therapists, staffs[i]);
        addStaffRoleToSelect(updateDocumentOwner, staffs[i]);
        addStaffRoleToSelect(addDocumentOwner, staffs[i]);
        addStaffRoleToSelect(addDocumentCreator, staffs[i]);
        addStaffRoleToSelect(updateChildTeacher, staffs[i]);
        addStaffRoleToSelect(updateChildCouncillor, staffs[i]);
        addStaffRoleToSelect(updateChildTherapist, staffs[i]);
        addStaffRoleToSelect(addActionOwner, staffs[i]);
    }
}

function addStaffRoleToSelect(selectOption, staff) {
    var option = document.createElement("option");
    option.text = staff.userName + " ( " + staff.userId + " )";
    option.value = staff.userId;
    selectOption.add(option);
}

function readAllUsers() {
    $.ajax({
        url: baseURL + '/user/all',
        type: 'get',
        accept: 'application/json',
        global: false,
        success: function (response) {
            displayUsers(response);
        }
    })
};

function displayUsers(response) {
    userControllerAngular.addUsers(response);
    userControllerAngular.$apply();
    showUsersPage();
}

function addStaff() {
    var userId = $("#staff-userId").val();
    var userName = $("#staff-name").val();
    var about = $("#staff-about").val();
    var email = $("#staff-email").val();
    var phone = $("#staff-phone").val();
    var jobTitle = $("#staff-job-title").val();
    if (userName.trim().length === 0 || userId.trim().length === 0) {
        $("#status-message").html("Invalid details");
        //console.log("Title / message cannot be empty");
        return;
    }

    $("#status-message").html("Please wait, adding staff...");
    var data = {
        userId: userId,
        userName: userName,
        about: about,
        email: email,
        phone: phone,
        jobTitle: jobTitle
    };
    $.ajax({
        url: baseURL + '/user/addStaff',
        type: 'post',
        contentType: 'application/json',
        global: false,
        success: function (response) {
            $("#status-message").html("Staff successfully added");
            sleep(2000);
            initAllUsers();
            showWelcomePage();
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            console.log(textStatus + "Error adding user" + errorThrown);
            $("#status-message").html("Error adding, please check the details");
        },
        data: JSON.stringify(data)
    })
}


function updateMyProfile() {


    currentUserDetails.about = $("#MyProfile-about").val();
    currentUserDetails.email = $("#MyProfile-email").val();
    currentUserDetails.phone = $("#MyProfile-phone").val();

    var newPassword = $("#MyProfile-newPassword").val();

    if (newPassword.trim().length === 0) {
        currentUserDetails.password = "";
    } else {
        currentUserDetails.password = newPassword;
    }

    $("#status-message").html("Please wait, updating profile...");

    $.ajax({
        url: baseURL + '/user/update',
        type: 'post',
        contentType: 'application/json',
        global: false,
        success: function (response) {
            $("#status-message").html("Profile successfully updated");
            sleep(2000);
            showWelcomePage();
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            console.log(textStatus + "Error updating profile" + errorThrown);
            $("#status-message").html("Error updating, please check the details");
        },
        data: JSON.stringify(currentUserDetails)
    })
}


function resetPassword(userId) {
    if (currentUserDetails.jobTitle != "Administrator") {
        setStatus("You are not Authorized");
        return; //Rather do it at the rest layer
    }

    $.ajax({
        url: baseURL + '/user/reset/' + userId,
        type: 'post',
        accept: 'application/json',
        global: false,
        success: function (response) {
            //displayChildren(response);
            $("#status-message").html("Password reset done for " + userId);
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            console.log(textStatus + "Error resetting password" + errorThrown);
            $("#status-message").html("Error resetting password for " + userId);
        }
    })
}

function readAllChildren() {
    $.ajax({
        url: baseURL + '/child/all',
        type: 'get',
        accept: 'application/json',
        global: false,
        success: function (response) {
            displayChildren(response);
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            console.log(textStatus + "Error Retrieving children" + errorThrown);
            $("#status-message").html("Error Retrieving children");
        }
    })
};


function searchChildren(searchKey) {
    $.ajax({
        url: baseURL + '/child/find/' + searchKey,
        type: 'get',
        accept: 'application/json',
        global: false,
        success: function (response) {
            displayChildren(response);
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            console.log(textStatus + "Error Searching children" + errorThrown);
            setStatus("Error Searching children with text '" + searchKey + "'");
        }
    })
};


function displayChildren(response) {
    myChildren = response;
    childControllerAngular.addChildren(response);
    childControllerAngular.$apply();
    showChildrenPage();
}

function addChild() {

    var id = $("#child-roll-no").val();
    var name = $("#child-name").val();
    var dob = $("#child-dob").val();
    var doj = $("#child-doj").val();
    var remarks = $("#child-remarks").val();
    var message = $("#child-message").val();
    var teacher = $("#child-teacher").val();
    var councillor = $("#child-councillor").val();
    var therapist = $("#child-therapist").val();
    var tags = $("#child-tags").val();

    if (name.trim().length === 0) {
        setStatus("Invalid details");
        return;
    }
    setStatus("Please wait, adding child...");

    var data = {
        id: id,
        name: name,
        dob: dob,
        doj: doj,
        remarks: remarks,
        message: message,
        teacher: teacher,
        teacherId: '',
        councillor: councillor,
        councillorId: '',
        therapist: therapist,
        therapistId: '',
        tags: tags
    };

    //Calling common ajax function
    doAjax('/child/add', httpPost, data, "Child successfully added", showWelcomePage, "Error adding, please check the details", doNothing);
}

function saveCurrentChild(child) {

    child.teacher = $("#UpdateChild-Teacher").val();
    child.councillor = $("#UpdateChild-Councillor").val();
    child.therapist = $("#UpdateChild-Therapist").val();
    child.remarks += $("#UpdateChild-remarks").val();
    child.message += $("#UpdateChild-message").val();

    $("#status-message").html("Updating Child...");
    $.ajax({
        url: baseURL + '/child/update',
        type: 'post',
        contentType: 'application/json',
        global: false,
        success: function (response) {
            //TODO try to update the current page if possible. with updated time, state and remarks. 
            $("#status-message").html("Child details updated");
            sleep(2000);
            //readAllActions();
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            console.log("Http responseText: " + XMLHttpRequest.responseText + ", Status : " + XMLHttpRequest.status + ", ErrorThrown: " + errorThrown);
            $("#status-message").html("Error Updating Child");
        },
        data: JSON.stringify(child)
    })
}

function addStaffRole() {
    var title = $("#AddStaffRole-title").val();
    var remarks = $("#AddStaffRole-remarks").val();
    var addStaff = $("#AddStaffRole-addStaff").is(":checked");
    var addChildren = $("#AddStaffRole-addChildren").is(":checked");
    var viewAllChildren = $("#AddStaffRole-viewAllChildren").is(":checked");
    var viewAllDocuments = $("#AddStaffRole-viewAllDocuments").is(":checked");
    var viewAllActions = $("#AddStaffRole-viewAllActions").is(":checked");
    var manageUserControls = $("#AddStaffRole-manageUserControls").is(":checked");
    var manageSettings = $("#AddStaffRole-manageSettings").is(":checked");

    setStatus("Please wait, adding staff role...");
    var data = {
        title: title,
        remarks: remarks,
        addStaff: addStaff,
        addChildren: addChildren,
        viewAllChildren: viewAllChildren,
        viewAllDocuments: viewAllDocuments,
        viewAllActions: viewAllActions,
        manageUserControls: manageUserControls,
        manageSettings: manageSettings
    };

    $.ajax({
        url: baseURL + '/gen/jobTitles/add',
        type: 'post',
        contentType: 'application/json',
        global: false,
        success: function (response) {
            setStatus("Staff role added");
            sleep(2000);
            retrieveJobTitles(); //better to refresh the controls stored
            showWelcomePage();
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            console.log(textStatus + "Error adding staff role " + errorThrown);
            setStatus("Error adding staff role, please check the details");
        },
        data: JSON.stringify(data)
    })
}

function updateUserControl() {

    var title = $("#ManageControls-user-type").val();
    var remarks = $("#ManageControls-remarks").val();
    var addStaff = $("#ManageControls-addStaff").is(":checked");
    var addChildren = $("#ManageControls-addChildren").is(":checked");
    var viewAllChildren = $("#ManageControls-viewAllChildren").is(":checked");
    var viewAllDocuments = $("#ManageControls-viewAllDocuments").is(":checked");
    var viewAllActions = $("#ManageControls-viewAllActions").is(":checked");
    var manageUserControls = $("#ManageControls-manageUserControls").is(":checked");
    var manageSettings = $("#ManageControls-manageSettings").is(":checked");

    setStatus("Please wait, updating user controls...");
    var data = {
        title: title,
        remarks: remarks,
        addStaff: addStaff,
        addChildren: addChildren,
        viewAllChildren: viewAllChildren,
        viewAllDocuments: viewAllDocuments,
        viewAllActions: viewAllActions,
        manageUserControls: manageUserControls,
        manageSettings: manageSettings
    };

    selectedUserType = title;

    $.ajax({
        url: baseURL + '/gen/jobTitles/update',
        type: 'post',
        contentType: 'application/json',
        global: false,
        success: function (response) {
            setStatus("User controls updated");
            sleep(2000);
            retrieveJobTitles(); //better to refresh the controls stored
            //showWelcomePage();
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            console.log(textStatus + "Error updating controls " + errorThrown);
            setStatus("Error updating, please check the details");
        },
        data: JSON.stringify(data)
    })
}
