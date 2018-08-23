var Web3 = require('web3');
var web3 = new Web3();
//if (typeof web3 !== 'undefined') {
//    web3 = new Web3(web3.currentProvider);
//} else {
//    // set the provider you want from Web3.providers
//    web3 = new Web3(new Web3.providers.HttpProvider("http://10.78.213.217:7545"));
//}
web3.setProvider(new web3.providers.HttpProvider("http://10.78.213.217:7545"));


function createContract() {
    data = {
        sourceCode: $("#ContractSourceCode").val()
    };
    $("#contractStatus").html("Compiling the contract, please wait.....");
    $.ajax({
        url: baseURL + '/source/compile',
        type: 'post',
        accept: 'application/json',
        global: false,
        contentType: 'application/json',
        success: function (response) {
            publishContract(response["<stdin>:Sample"].bin, response["<stdin>:Sample"].abi);
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            console.log(textStatus + "Error Retrieving children" + errorThrown);
            $("#status-message").html("Error Retrieving children");
        },
        data: JSON.stringify(data)
    })
};


function publishContract(byteCode, abi) {
    $("#contractStatus").html("Publishing the contract, please wait.....");
    web3.eth.defaultAccount = web3.eth.coinbase;
    web3.eth.contract(abi).new({
            data: byteCode,
            value: web3.toWei(Number($("#NewContract-PromisedAmount").val()), 'ether'),
            gas: 6721974
        },
        function (err, c) {
            if (err) {
                console.error(err);
                return;

                // callback fires twice, we only want the second call when the contract is deployed
            } else if (c.address) {
                contract = c;
                //console.log('address: ' + contract.address);
                result = 'Contract Successfully created. \naddress: ' + contract.address + "\n";
                $("#contractStatus").html(result);
                loadedContract = contract;
                setContractDetails(contract);

                //            inc = contract.Incremented({
                //                odd: true
                //            }, update);
            }
        });
}

function setContractDetails(contract, name) {
    targetUsers = $("#TargetUsers").val().split(",");
    bList = []
    for (i = 0; i < targetUsers.length; i++) {
        bList[i] = targetUsers[i].trim();
    }
    totalAmount = Number($("#NewContract-PromisedAmount").val());
    bonusAmount = Number($("#NewContract-BonusAmount").val());
    peerReview = document.getElementById("NewContract-peerReview").checked;
    documentNeeded = document.getElementById("NewContract-DocProof").checked
    contract.setContractDetails(bList, totalAmount, bonusAmount, peerReview, documentNeeded, {
        from: web3.eth.accounts[0],
        gas: myGasLimit
    })
    name = $("#NewContract-contractName").val();
    saveContractToDB(contract, name, bList);
}

function saveContractToDB(contract, name, bList) {
    data = {
        owner: currentUserId,
        ownerAddress: myAddress,
        contractName: name,
        contractAddress: contract.address,
        byteCode: "43543543536ffff....",
        abi: contract.abi,
        beneficiaries: bList
    };

    $.ajax({
        url: baseURL + '/contract/add',
        type: 'post',
        accept: 'application/json',
        global: false,
        contentType: 'application/json',
        success: function (response) {
            //publishContract(response["<stdin>:Sample"].bin, response["<stdin>:Sample"].abi);
            $("#status-message").html("Saved contract details");
            //updateContractDetailsInDB(contract, name, bList);
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            console.log(textStatus + "Error Retrieving children" + errorThrown);
            $("#status-message").html("Error saving contract");
        },
        data: JSON.stringify(data)
    })
}

function loadContractDetais() {
    address = $("#UpdateContractAddress").val();
    $.ajax({
        url: baseURL + '/contract/load/' + address,
        type: 'get',
        accept: 'application/json',
        global: false,
        success: function (response) {
            //$("#ContractSourceCode").val(response.sampleSource);
            //populateContractDetails(response, address);
            $("#UpdateContractABI").val(response[0][1]);
            $("#UpdateContract-MyAddress").val(myAddress);
            $("#UpdateContract-MyGasLimit").val(myGasLimit);
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            console.log(textStatus + "Error Retrieving children" + errorThrown);
            $("#status-message").html("ABI not available in system");
        }
    })
}

function loadPeerReviewContractDetais() {
    address = $("#PeerReviewAddress").val();
    $.ajax({
        url: baseURL + '/contract/load/' + address,
        type: 'get',
        accept: 'application/json',
        global: false,
        success: function (response) {
            //$("#ContractSourceCode").val(response.sampleSource);
            //populateContractDetails(response, address);
            $("#PeerReviewABI").val(response[0][1]);
            $("#PeerReview-MyAddress").val(myAddress);
            $("#PeerReview-MyGasLimit").val(myGasLimit);
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            console.log(textStatus + "Error Retrieving children" + errorThrown);
            $("#status-message").html("ABI not available in system");
        }
    })
}

function contractStatus(address) {
    $("#ContractStatusAddress").val(address);
    contractStatusView();
    loadContractStatus();
}

function loadContractStatus() {
    address = $("#ContractStatusAddress").val();
    $.ajax({
        url: baseURL + '/contract/load/' + address,
        type: 'get',
        accept: 'application/json',
        global: false,
        success: function (response) {
            //$("#ContractSourceCode").val(response.sampleSource);
            //populateContractDetails(response, address);
            $("#ContractStatusABI").val(response[0][1]);
            showContractStatus();
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            console.log(textStatus + "Error Retrieving children" + errorThrown);
            $("#status-message").html("ABI not available in system");
        }
    })
}

function showContractStatus() {
    currentContract = web3.eth.contract(JSON.parse($("#ContractStatusABI").val().replace(/'/g, '"').replace(/False/g, false).replace(/True/g, true))).at(address);
    var currentStatus = currentContract.getContractStatus({
        from: myAddress,
        gas: myGasLimit
    });
    loadEngagementChart(currentStatus);
    loadAmountChart(currentStatus);
}

function revokeContract() {
    currentContract.withdrawContract({
        from: myAddress,
        gas: myGasLimit
    });
    $("#status-message").html("Contract revoked and amount credited to owner");
    showContractStatus();
}

function forceDistribute() {
    currentContract.distributeForAll({
        from: myAddress,
        gas: myGasLimit
    });
    $("#status-message").html("Amount distributed to all beneficiaries");
    showContractStatus();
}


function loadEngagementChart(currentStatus) {
    var ctx = document.getElementById("engagementChart").getContext('2d');
    ctx.canvas.parentNode.style.height = '64px';
    var myChart = new Chart(ctx, {
        type: 'horizontalBar',
        data: {
            labels: ["Total Beneficiaries", "Initial Stage", "Achieved Objective", "Validated", "Distributed"],
            datasets: [{
                label: '# of Beneficiaries',
                data: [currentStatus[0].toNumber(), currentStatus[1].toNumber(), currentStatus[2].toNumber(), currentStatus[3].toNumber(), currentStatus[4].toNumber()],
                backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                        'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(255, 159, 64, 0.2)'
            ],
                borderColor: [
                'rgba(255,99,132,1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)'
            ],
                borderWidth: 1
        }]
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
            }]
            }
        }
    });

}

function loadAmountChart(currentStatus) {

    balanceAmount = currentStatus[7].toNumber() / 1000000000000000000;
    amountPerHead = currentStatus[6].toNumber() / 1000000000000000000;
    distributionCount = currentStatus[4].toNumber();
    distributedAmount = distributionCount * amountPerHead;

    var ctx = document.getElementById("amountChart").getContext('2d');
    ctx.canvas.parentNode.style.height = '64px';
    var myChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ["Amount Pending", "Amount Distributed"],
            datasets: [{
                label: 'Contract Amount',
                data: [balanceAmount, distributedAmount],
                backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)'
            ],
                borderColor: [
                'rgba(255,99,132,1)',
                'rgba(54, 162, 235, 1)'
            ],
                borderWidth: 1
        }]
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
            }]
            }
        }
    });
}

function populateSelfData() {
    //$("#UpdateContractABI").val();

    //web3.eth.defaultAccount = $("#UpdateContract-MyAddresss").val();//web3.eth.accounts[0];
    //var tContract = web3.eth.contract(JSON.parse($("#UpdateContractABI").val().replace(/'/g, '"').replace(/False/g, '"False"').replace(/True/g, '"True"')));
    //var tc = tContract.at(address);
    //console.log(tc.getMyData());

    var currentContract = web3.eth.contract(JSON.parse($("#UpdateContractABI").val().replace(/'/g, '"').replace(/False/g, false).replace(/True/g, true))).at(address);
    var currentStatus = currentContract.getMyData({
        from: $("#UpdateContract-MyAddress").val(),
        gas: myGasLimit
    });
    //console.log(currentStatus[0].toNumber());
    $("#UpdateContract-data").val(currentStatus[0].toNumber());
    $("#UpdateContract-hash").val(currentStatus[5]);
    $("#UpdateContract-peer").html(currentStatus[3]);
    state = currentStatus[7].toNumber();
    if (state == 0) {
        $("#UpdateContract-status").html("Initiated");
    } else if (state == 1) {
        $("#UpdateContract-status").html("Ready For Review");
    } else if (state == 2) {
        $("#UpdateContract-status").html("Completed");
    } else if (state == 3) {
        $("#UpdateContract-status").html("Amount Distributed");
    }
    $("#UpdateContract-amount").html(currentStatus[6].toNumber());
}

function updateSelfData() {
    var currentContract = web3.eth.contract(JSON.parse($("#UpdateContractABI").val().replace(/'/g, '"').replace(/False/g, false).replace(/True/g, true))).at(address);
    currentContract.setSelfData($("#UpdateContract-data").val(), $("#UpdateContract-hash").val(), {
        from: $("#UpdateContract-MyAddress").val(),
        gas: myGasLimit
    });
    populateSelfData();
}

function updatePeerReview() {
    var currentContract = web3.eth.contract(JSON.parse($("#PeerReviewABI").val().replace(/'/g, '"').replace(/False/g, false).replace(/True/g, true))).at(address);
    accepted = document.getElementById("PeerReviewCheckBox").checked;
    currentContract.closePeerReview($("#PeerReviewTargetAddress").val(), accepted, {
        from: $("#PeerReview-MyAddress").val(),
        gas: myGasLimit
    });
}

function updateContractDetailsInDB(contract, name, bList) {

    data = {
        owner: currentUserId,
        contractName: name,
        contractAddress: contract.address,
        beneficiaries: bList
    };

    $.ajax({
        url: baseURL + '/contract/updateDetails',
        type: 'post',
        accept: 'application/json',
        global: false,
        contentType: 'application/json',
        success: function (response) {
            //publishContract(response["<stdin>:Sample"].bin, response["<stdin>:Sample"].abi);
            $("#status-message").html($("#status-message").html() + "\NUpdated contract details in DB");
            //updateContractDetailsInDB(contract, name, bList);
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            console.log(textStatus + "Error Retrieving children" + errorThrown);
            $("#status-message").html("Error saving contract");
        },
        data: JSON.stringify(data)
    })
}


function watchBalance() {
    var coinbase = myAddress; //web3.eth.coinbase;

    var originalBalance = web3.eth.getBalance(coinbase).toNumber
    var currentBalance = web3.eth.getBalance(coinbase).toNumber() / 1000000;
    $("#my-balance").html(currentBalance);
    web3.eth.filter('latest').watch(function () {
        currentBalance = web3.eth.getBalance(coinbase).toNumber() / 1000000;
        $("#my-balance").html(currentBalance);
    });

    //filterWatchAll();
    //filterWatch();
}

function getSampleSource() {
    $.ajax({
        url: baseURL + '/source/sample',
        type: 'get',
        accept: 'application/json',
        global: false,
        success: function (response) {
            $("#ContractSourceCode").val(response.sampleSource);
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            console.log(textStatus + "Error Retrieving children" + errorThrown);
            $("#status-message").html("Error Retrieving children");
        }
    })
};



function filterWatch() {
    var filter = web3.eth.filter('pending');

    filter.watch(function (error, log) {
        console.log(log); //  {"address":"0x0000000000000000000000000000000000000000", "data":"0x0000000000000000000000000000000000000000000000000000000000000000", ...}
    });

    // get all past logs again.
    var myResults = filter.get(function (error, logs) {
        console.log("AllLogs" + logs)
    });

    // stops and uninstalls the filter
    //filter.stopWatching();
}

function filterWatchAll() {

    // can be 'latest' or 'pending'
    filterLatest = web3.eth.filter('latest');
    // OR object are log filter options
    //var filter = web3.eth.filter(options);

    // watch for changes
    filterLatest.watch(function (error, result) {
        if (!error)
            $("#status-message").html("Latest : " + result);
    });

    // Additionally you can start watching right away, by passing a callback:
    //    web3.eth.filter(options, function (error, result) {
    //        if (!error)
    //            console.log(result);
    //    });


    filterPending = web3.eth.filter('pending');
    filterPending.watch(function (error, result) {
        if (!error)
            $("#status-message").html("Pending : " + result);
    });


}

function updateWatchDog(flag) {
    watchDog = flag;
    if (watchDog) {
        filterWatchAll();
    } else {
        filterLatest.stopWatching();
        filterPending.stopWatching();
    }
}

function createAccount() {
    userName = $("#CreateAccountUserName").val();
    userId = $("#CreateAccountUserID").val();
    password = $("#CreateAccountPassword").val();
    passphrase = userName + userId + password;
    web3.personal.newAccount(passphrase,
        function (error, result) {
            if (error)
                $("#status-message").html("Error creating Account");
            else {
                console.log(result);
                $("#status-message").html("Account created");
                $("#CreateAccountPassword").html(result);
                address = result;
                saveAccountDetails(userName, userId, password, address, passphrase);
            }
        });
}

function saveAccountDetails(userName, userId, password, address, phrase) {
    data = {
        userName: userName,
        address: address,
        userId: userId,
        passphrase: phrase,
        password: password
    };
    $.ajax({
        url: baseURL + '/user/add',
        type: 'post',
        accept: 'application/json',
        global: false,
        contentType: 'application/json',
        success: function (response) {
            //publishContract(response["<stdin>:Sample"].bin, response["<stdin>:Sample"].abi);
            $("#status-message").html("Saved user details in DB");
            //updateContractDetailsInDB(contract, name, bList);
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            console.log(textStatus + "Error saving user details" + errorThrown);
            $("#status-message").html("Error saving user details");
        },
        data: JSON.stringify(data)
    })
}


function getSystemDetails() {
    //web3.eth.getGasPrice((err, _gp) => {console.log(_gp.toString(10))})
    web3.eth.getGasPrice((err, _gp) => {
        $("#SystemGasPrice").html(_gp.toString(10))
    });
    $("#SystemAccounts").html(web3.eth.accounts.length);
    $("#SystemCurrentBlock").html(web3.eth.blockNumber);
    web3.eth.getCoinbase((err, _gp) => {
        $("#SystemCoinBase").html(_gp)
    });
    $("#SystemProvider").html(web3.currentProvider.host);
    $("#SystemGasLimit").val(myGasLimit);
}

function updateSystemDetails() {
    myGasLimit = Number($("#SystemGasLimit").val());
    watchDogUpdate = document.getElementById("SystemWatchDog").checked;
    if (watchDog != watchDogUpdate) {
        updateWatchDog(watchDogUpdate);
    }
}

function viewAllAddresses() {
    accounts = web3.eth.accounts;
    displayUsers(accounts);
}
