function sleep(milliseconds) {
    var start = new Date().getTime();
    for (var i = 0; i < 1e7; i++) {
        if ((new Date().getTime() - start) > milliseconds) {
            break;
        }
    }
}

function log(message) {
    if (debugMode)
        console.log(message);
}

function setPageHeading(message) {
    $("#page-heading").html(message);
}

function setStatus(message) {
    $("#status-message").html(message);
}

function getLoadingMoreGif() {
    return '<img style="width:24px;height:24px;" src="img/loading_128.gif">';
}

function enableButton() {
    $("#trial-button").prop("disabled", false);
}

function getFileDownloadUrl(childName, docName) {
    return "file:///" + fileBasePath + childName + "/" + docName;
}

function doNothing() {

}

function calculateHash(strIn) {
    var hash = 0,
        i, chr;
    if (strIn.length === 0) return hash;
    for (i = 0; i < strIn.length; i++) {
        chr = strIn.charCodeAt(i);
        hash = ((hash << 5) - hash) + chr;
        hash |= 0; // Convert to 32bit integer
    }
    return hash;
};

function copyAddress(textToCopy) {
    copyTextToClipboard(textToCopy);
}

function copyABI(abi) {
    //copyTextToClipboard(JSON.parse(abi.replace(/'/g, '"').replace(/False/g, false).replace(/True/g, true)));
    copyTextToClipboard(abi);
}

function fallbackCopyTextToClipboard(text) {
    var textArea = document.createElement("textarea");
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
        var successful = document.execCommand('copy');
        var msg = successful ? 'successful' : 'unsuccessful';
        console.log('Fallback: Copying text command was ' + msg);
    } catch (err) {
        console.error('Fallback: Oops, unable to copy', err);
    }

    document.body.removeChild(textArea);
}

function copyTextToClipboard(text) {
    if (!navigator.clipboard) {
        fallbackCopyTextToClipboard(text);
        return;
    }
    navigator.clipboard.writeText(text).then(function () {
        console.log('Async: Copying to clipboard was successful!');
    }, function (err) {
        console.error('Async: Could not copy text: ', err);
    });
}

//function doAjax(url, httpType, data, successMessage, successFunction, errorMessage) {
//    doAjax(url, httpType, data, successMessage, successFunction, errorMessage, doNothing);
//}

function doAjax(url, httpType, data, successMessage, successFunction, errorMessage, errorFunction) {
    $.ajax({
        url: baseURL + url,
        type: httpType,
        contentType: 'application/json',
        global: false,
        success: function (response) {
            $("#status-message").html(successMessage);
            sleep(2000);
            successFunction();
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            console.log("Http responseText: " + XMLHttpRequest.responseText + ", Status : " + XMLHttpRequest.status + ", ErrorThrown: " + errorThrown);
            $("#status-message").html(errorMessage);
            sleep(2000);
            errorFunction();
        },
        data: JSON.stringify(data)
    })
}

//drag drop functions
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
        if (targetId == "main-contents-div" || targetId == "quicklinks-div") {
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
    //    function elementScrolled(elem) {
    //        var docViewTop = $(window).scrollTop();
    //        var docViewBottom = docViewTop + $(window).height();
    //        var elemTop = $(elem).offset().top;
    //        return ((elemTop <= docViewBottom) && (elemTop >= docViewTop));
    //    }
    //    if (elementScrolled('#loading-more')) {
    //        if (loadMoreContents) {
    //            readLimitedPosts();
    //            loadMoreContents = false;
    //        }
    //    }
});
