function loadMainPage(response) {
    token = response[0][0];
    myJobTitle = response[0][0];
    myAddress = response[0][1];
    $("#MyProfile-address").html(response[0][1]);
    $("#current-user-icon").html("<img src='img/48px-User_icon_2.svg.png' class='img-normal'/>");
    $("#user-detail-div").html("<b>" + response.name + "</b><p><i>" + response.about);
    $("#my-action-count").html(response.myOpenActionCount);
    currentUserId = response[0][0];
    currentUserDetails = response;
    $("#user-button").html("<span class='glyphicon glyphicon-user' > </span>" + response[0][0]);
    localStorage.setItem("userId", response[0][0]);
    localStorage.setItem("token", response[0][1]);
    //    console.log("user id assigned" + currentUserId + "complete response " + response);
    $("#LoginForm").hide();
    $("#NotLogged").hide();
    $("#LoggedInForm").show();
    //retrieveSystemProperties();
    showWelcomePage();
    loadDashboardLinks();
    watchBalance();
    //retrieveJobTitles();
}


function retrieveSystemProperties() {
    $.ajax({
        url: baseURL + '/gen/properties',
        type: 'get',
        accept: 'application/json',
        global: false,
        success: function (response) {
            setSystemProperties(response);
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            log("Error Loading system properties, " + textStatus);
        }
    })
}

function setSystemProperties(response) {
    propertiesControllerAngular.addProperties(response);
    propertiesControllerAngular.$apply();

    for (i = 0; i < response.length; i++) {
        if (response[i].name == "BasePath") {
            fileBasePath = response[i].property;
        }
    }
}

function updateSystemProperty(name, value) {
    var data = {
        name: name,
        property: $(document.getElementById(value)).val()
    }

    $.ajax({
        url: baseURL + '/gen/properties',
        type: 'post',
        contentType: 'application/json',
        global: false,
        success: function (response) {
            setStatus("System properties updated, kindly relogin");
            sleep(2000);
            //showWelcomePage();
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            console.log(textStatus + "Error updating system properties" + errorThrown);
            setStatus("Error updating system properties, please check the details");
        },
        data: JSON.stringify(data)
    })
}

function updateSystemProperties(propertyList) {
    $.ajax({
        url: baseURL + '/gen/properties',
        type: 'post',
        contentType: 'application/json',
        global: false,
        success: function (response) {
            setStatus("System properties updated, kindly relogin");
            sleep(2000);
            showWelcomePage();
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            console.log(textStatus + "Error updating system properties " + errorThrown);
            setStatus("Error updating system properties, please check the details");
        },
        data: JSON.stringify(propertyList)
    })
}

function retrieveJobTitles() {
    $.ajax({
        url: baseURL + '/gen/jobTitles',
        type: 'get',
        accept: 'application/json',
        global: false,
        success: function (response) {
            jobTitles = response;
            setJobTitles();
            loadDashboardLinks();
            updateManageControlsPageValues();
            //            console.log("added items");
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            log("Error Loading jobTitles");
        }
    })
}

function setJobTitles() {

    $("#staff-job-title").find('option').remove().end();
    $("#ManageControls-user-type").find('option').remove().end();
    var jobTitle = document.getElementById("staff-job-title");
    var manageControlsJobTitle = document.getElementById("ManageControls-user-type");

    for (i = 0; i < jobTitles.length; i++) {
        addJobTitleToSelect(jobTitle, jobTitles[i].title);
        addJobTitleToSelect(manageControlsJobTitle, jobTitles[i].title);
    }
}

function addJobTitleToSelect(selectElement, title) {
    var option = document.createElement("option");
    option.text = title;
    selectElement.add(option);
}




function loadDashboardLinks() {

    dashBoardLinkHtml = "";

    addDashBoardLinkHeading("Actions");

    addDashBoardLinkEntry("showNewContractView", "Create a contract");
    addDashBoardLinkEntry("addUserView", "Add new user");
    addDashBoardLinkEntry("updateContractView", "Update Contract");
    addDashBoardLinkEntry("peerReviewView", "Peer Reviews");

    addDashBoardLinkHeading("Views");
    addDashBoardLinkEntry("viewAllAddresses", "View Available Addresses");
    addDashBoardLinkEntry("myContractsView", "View My Contracts");
    addDashBoardLinkEntry("contractStatusView", "Contract Status");


    addDashBoardLinkHeading("Settings");

    //addDashBoardLinkEntry("readAllChildren", "Show All Students");

    addDashBoardLinkEntry("showMyProfile", "My Details");
    addDashBoardLinkEntry("viewSystemDetails", "System Details");

    $("#dashboard-links").html(dashBoardLinkHtml);
}

function contractStatusView() {
    hideAllPages();
    setPageHeading("Contract Status");
    $("#ContractStatus-Div").show();
}

function updateContractView() {
    hideAllPages();
    setPageHeading("Update Contract");
    $("#UpdateContract-Div").show();
}

function peerReviewView() {
    hideAllPages();
    setPageHeading("Peer Review");
    $("#PeerReview-Div").show();
}

function myContractsView() {
    hideAllPages();
    setPageHeading("My Contracts");
    $("#MyContracts-Div").show();
    loadMycontracts();
}

function showNewContractView() {
    getSampleSource();
    hideAllPages();
    setPageHeading("Create a new Contract");
    $("#NewContract-Div").show();
}


function viewSystemDetails() {
    hideAllPages();
    setPageHeading("System Details");
    $("#SystemDetails-Div").show();
    getSystemDetails();
}


function addUserView() {
    hideAllPages();
    setPageHeading("Add new User/Address");
    $("#CreateAccount-Div").show();
}



function addDashBoardLinkEntry(functionName, linkText) {
    dashBoardLinkHtml += "<a class='quicklink-links' href='#' onClick=" + functionName + "()>" + linkText + "</a><br/>";
}

function addDashBoardLinkHeading(heading) {
    dashBoardLinkHtml += "<h2>" + heading + "</h2>";
}


function showWelcomePage() {
    hideAllPages();
    setPageHeading("Welcome to Smart Contract Management");
    $("#WelcomePage-Div").show();
}

function showUsersPage() {
    hideAllPages();
    setPageHeading("View All Users");
    $("#UserController-Div").show();
}

function showActionsPage() {
    hideAllPages();
    setPageHeading("View Actions");
    $("#ActionController-Div").show();
}

function showChildrenPage() {
    hideAllPages();
    setPageHeading("view All Children");
    $('#ChildController-Div').show();
}

function showAddStaffPage() {
    hideAllPages();
    setPageHeading("Add Staff");
    $("#AddStaff-Div").show();
    $("#staff-userId").val("");
    $("#staff-name").val("");
    $("#staff-about").val("");
    $("#staff-email").val("");
    $("#staff-phone").val("");
    $("#staff-job-title").val("");
}

function showAddChildrenPage() {
    hideAllPages();
    setPageHeading("Add Child");
    $("#AddChild-Div").show();
}

function showDocumentsPage() {
    hideAllPages();
    setPageHeading("View Documents");
    $("#DocController-Div").show();
}

function manageUserControls() {
    hideAllPages();
    setPageHeading("Manage user controls");
    $("#ManageControls-Div").show();
    updateManageControlsPageValues();
}


function showSystemSettings() {
    hideAllPages();
    setPageHeading("View/Update System Properties");
    $("#PropertiesController-Div").show();
}

function showUpdateActionPage(actionId) {

    for (i = 0; i < myActions.length; i++) {
        if (myActions[i].actionId == actionId) {
            updateActionControllerAngular.setActionDetail(myActions[i]);
            updateActionControllerAngular.$apply();
            break;
        }
    }

    hideAllPages();
    setPageHeading("Update Action");
    $("#UpdateAction-Div").show();
}


function showMyProfile() {
    $("#MyProfile-id").html(currentUserId);
    $("#MyProfile-name").html(currentUserId);
    $("#MyProfile-newPassword").val("");
    $("#MyProfile-address").val(myAddress);
    //$("#MyProfile-email").val(currentUserDetails.email);
    //$("#MyProfile-phone").val(currentUserDetails.phone);
    hideAllPages();
    setPageHeading("My Profile");
    $("#MyProfile-div").fadeIn(1000);
}

function hideAllPages() {
    $("#status-message").html("");
    $("#NewContract-Div").hide();
    $("#SystemDetails-Div").hide();
    $("#CreateAccount-Div").hide();
    $("#MyContracts-Div").hide();
    $("#ContractStatus-Div").hide();
    $("#UpdateContract-Div").hide();
    $("#PeerReview-Div").hide();
    //$("#-Div").hide();
    $("#WelcomePage-Div").hide();

    $("#UserController-Div").hide();
    $("#AddStaff-Div").hide();

    $("#MyProfile-div").hide();

}
