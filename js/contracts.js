function loadMycontracts() {
    $.ajax({
        url: baseURL + '/contract/view/address/' + myAddress,
        type: 'get',
        accept: 'application/json',
        global: false,
        success: function (response) {
            //publishContract(response["<stdin>:Sample"].bin, response["<stdin>:Sample"].abi);
            //$("#status-message").html("Saved contract details");
            loadContractsController(response);
            //updateContractDetailsInDB(contract, name, bList);
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            console.log(textStatus + "Error Loading contracts" + errorThrown);
            $("#status-message").html("Error Loading contract");
        }
    })
}

function loadContractsController(response) {
    contractControllerAngular.addContracts(response);
    contractControllerAngular.$apply();
    //showUsersPage();
}
