function readAllDocuments() {
    readDocuments('/doc/all');
}

function readAllOpenDocuments() {
    readDocuments('/doc/allOpen');
}

function readMyDocuments() {
    readDocuments('/doc/myDocs/' + currentUserId);
}

function readMyOpenDocuments() {
    readDocuments('/doc/myOpenDocs/' + currentUserId);
}

function readDocuments(url) {
    $.ajax({
        url: baseURL + url,
        type: 'get',
        accept: 'application/json',
        global: false,
        success: function (response) {
            displayDocuments(response);
        }
    })
}

function displayDocuments(response) {
    myDocuments = response;
    docControllerAngular.addDocuments(response);
    docControllerAngular.fileDownloadUrl = fileDownloadUrl + fileBasePath;
    docControllerAngular.$apply();
    showDocumentsPage();
}


function uploadDocument(data, childDir, callbackFunction, callbackParameter) {

    $("#status-message").html("Uploading the document. " + getLoadingMoreGif());

    $.ajax({
        type: "POST",
        enctype: 'multipart/form-data',
        url: childDir,
        data: data,
        processData: false,
        contentType: false,
        cache: false,
        timeout: 600000,
        success: function (data) {
            $("#status-message").html("Successfully uploaded the file, now adding the document details..." + getLoadingMoreGif());
            callbackFunction(callbackParameter);
        },
        error: function (e) {
            $("#status-message").html("File upload failed, cannot add the document now. Please check the details");
            console.log("ERROR : ", e);
            return false;
        }
    });
}

function addDocument() {
    var form = $('#fileUploadForm')[0];
    // Create an FormData object
    var data = new FormData(form);
    var file = $("#AddDocument-file-input").get(0).files[0]; //$('input[name="file"]').get(0).files[0];
    console.log(file);
    data.append('file', file);
    var fileName = file.name;
    var childDir = fileUploadUrl + fileBasePath + "/" + $("#AddDocument-child-name").html();
    uploadDocument(data, childDir, addDocumentDetails, fileName);
}

function addDocumentDetails(fileName) {

    var docName = fileName;
    var revision = 1;
    var childId = $("#AddDocument-child-id").html();
    var childName = $("#AddDocument-child-name").html();
    var owner = $("#AddDocument-owner").val();
    var creator = $("#AddDocument-creator").val();
    var remarks = $("#AddDocument-remarks").val();
    var status = $("#AddDocument-status").val();

    //  protected int docId;
    //	protected String docName;
    //	protected int revision;
    //	protected int childId;
    //	protected String childName;
    //	protected String owner;
    //	protected String creator;	
    //	protected String createdOn;	
    //	protected String lastUpdated;
    //	protected String remarks;
    //	protected String status;

    if (docName.trim().length === 0) {
        $("#status-message").html("Invalid details");
        return;
    }

    $("#status-message").html("Please wait, adding document..." + getLoadingMoreGif());
    var data = {
        docId: 1,
        docName: docName,
        revision: revision,
        childId: childId,
        childName: childName,
        owner: owner,
        creator: creator,
        createdOn: '',
        lastUpdated: '',
        remarks: remarks,
        status: status
    };
    $.ajax({
        url: baseURL + '/doc/add',
        type: 'post',
        contentType: 'application/json',
        global: false,
        success: function (response) {
            $("#status-message").html("Document successfully added");
            sleep(2000);
            showWelcomePage();
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            console.log(textStatus + "Error adding document" + errorThrown);
            $("#status-message").html("Error adding document, please check the details");
        },
        data: JSON.stringify(data)
    })
}


function downloadDocument() {
    $.ajax({
        url: '/Js/rest/file/get',
        type: 'get',
        contentType: 'application/json',
        global: false,
        success: function (response) {
            //TODO try to update the current page if possible. with updated time, state and remarks. 
            console.log(response);
            $("#status-message").html("Document details updated");
            sleep(2000);
            //readAllActions();
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            console.log("Http responseText: " + XMLHttpRequest.responseText + ", Status : " + XMLHttpRequest.status + ", ErrorThrown: " + errorThrown);
            $("#status-message").html("Error Updating Document");
        }
    })
}


function saveCurrentDocument(document) {

    var form = $('#UpdateDocument-FileUploadForm')[0];
    // Create an FormData object
    var data = new FormData(form);
    var file = $("#UpdateDocument-file-input").get(0).files[0]; //$('input[name="file"]').get(0).files[0];
    console.log(file);
    //    file.name = document.docName;
    //    console.log(file);
    document.docName = file.name;
    data.append('file', file);
    var fileName = file.name;
    var childDir = fileUploadUrl + fileBasePath + "/" + $("#UpdateDocument-child-name").html();
    uploadDocument(data, childDir, saveCurrentDocumentDetails, document);

}

function saveCurrentDocumentDetails(document) {
    document.owner = $("#UpdateDocument-owner").val();
    document.status = $("#UpdateDocument-status").val();
    document.remarks += "; " + $("#UpdateDocument-remarks").val();

    $("#status-message").html("Updating Document...");
    $.ajax({
        url: baseURL + '/doc/update',
        type: 'post',
        contentType: 'application/json',
        global: false,
        success: function (response) {
            //TODO try to update the current page if possible. with updated time, state and remarks. 
            $("#status-message").html("Document details updated");
            sleep(2000);
            //readAllActions();
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            console.log("Http responseText: " + XMLHttpRequest.responseText + ", Status : " + XMLHttpRequest.status + ", ErrorThrown: " + errorThrown);
            $("#status-message").html("Error Updating Document");
        },
        data: JSON.stringify(document)
    })
}






function readAllActions() {
    readActions('/action/all');
};

function readAllOpenActions() {
    readActions('/action/allOpen');
};

function readMyActions() {
    readActions('/action/myActions' + '/' + currentUserId);
};

function readMyOpenActions() {
    readActions('/action/myOpenActions' + '/' + currentUserId);
};

function readActions(url) {
    $.ajax({
        url: baseURL + url,
        type: 'get',
        accept: 'application/json',
        global: false,
        success: function (response) {
            displayActions(response);
        }
    })
};

function displayActions(response) {
    myActions = response;
    actionControllerAngular.addActions(response);
    actionControllerAngular.$apply();
    showActionsPage();
}

function addAction() {

    var docId = $("#AddAction-docId").html(); //TODO check why .val is not returning contents?
    var docName = $("#AddAction-docName").html();
    var actionTitle = $("#AddAction-title").val();
    var action_creator = currentUserId; //$("#AddAction-title").val();
    var action_owner = $("#AddAction-owner").val();
    var state = 'Created'; //$("#AddAction-state").val(); //by default
    var remarks = $("#AddAction-remarks").val();

    var data = {
        actionId: 1,
        docId: docId,
        docName: docName,
        actionTitle: actionTitle,
        action_creator: action_creator,
        action_owner: action_owner,
        created_on: '',
        updated_on: '',
        state: state,
        remarks: remarks
    };
    $("#AddAction-submit-button").prop("disabled", true);
    $.ajax({
        url: baseURL + '/action/add',
        type: 'post',
        contentType: 'application/json',
        global: false,
        success: function (response) {
            setStatus("Action successfully added");
            sleep(2000);
            showWelcomePage();
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            console.log("Http responseText: " + XMLHttpRequest.responseText + ", Status : " + XMLHttpRequest.status + ", ErrorThrown: " + errorThrown);
            $("#status-message").html("Error Adding Action");
            $("#AddAction-submit-button").prop("disabled", false);
        },
        data: JSON.stringify(data)
    })
}


function saveCurrentAction(action) {

    action.state = $("#UpdateAction-state").val();
    action.remarks += "; " + $("#update-action-remarks").val();

    $("#status-message").html("Updating Action...");
    $.ajax({
        url: baseURL + '/action/update',
        type: 'post',
        contentType: 'application/json',
        global: false,
        success: function (response) {
            //TODO try to update the current page if possible. with updated time, state and remarks. 
            $("#status-message").html("Action item updated");
            sleep(2000);
            readAllActions();
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            console.log("Http responseText: " + XMLHttpRequest.responseText + ", Status : " + XMLHttpRequest.status + ", ErrorThrown: " + errorThrown);
            $("#status-message").html("Error Updating Action");
        },
        data: JSON.stringify(action)
    })
}

function retrieveDocStates() {
    $.ajax({
        url: baseURL + '/doc/states',
        type: 'get',
        accept: 'application/json',
        global: false,
        success: function (response) {
            setDocStates(response);
        }
    })
};

function setDocStates(docStates) {
    var addDocumentStatus = document.getElementById("AddDocument-status");
    var updateDocumentStatus = document.getElementById("UpdateDocument-status");
    for (i = 0; i < docStates.length; i++) {
        addValuesToSelect(addDocumentStatus, docStates[i].docState);
        addValuesToSelect(updateDocumentStatus, docStates[i].docState);
    }
}

function retrieveActionStates() {
    $.ajax({
        url: baseURL + '/action/states/all',
        type: 'get',
        accept: 'application/json',
        global: false,
        success: function (response) {
            setActionStates(response);
        }
    })
};

function setActionStates(actionStates) {
    var updateActionState = document.getElementById("UpdateAction-state");
    //var AddActionState = document.getElementById("AddAction-state");
    for (i = 0; i < actionStates.length; i++) {
        addValuesToSelect(updateActionState, actionStates[i].state);
        //addValuesToSelect(AddActionState, actionStates[i].state);
    }
}

function addValuesToSelect(selectOption, text) {
    var option = document.createElement("option");
    option.text = text;
    //option.value = staff.userId;
    selectOption.add(option);
}
