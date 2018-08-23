pragma solidity ^0.4.11;
contract Sample {
    
    uint public purchaseValue;
    address public sellerAddress;
    address public buyerAddress;
    enum purchaseState { Created, Locked, Inactive }
    
    bool public peerReviewNeeded;
    uint public totalAmount;
    uint public bonusAmount;
    struct beneficiary {
        bool authorized;
        uint selfData; // delegateWeight is accumulated by delegation
        bool accepted;  // if true, that person already used their vote
        address peerReviewer; // the person that the voter chooses to delegate their vote to instead of voting themselves
        string documentHash;   // index of the proposal that was voted for
    }
    
    address public contractOwner;
    mapping(address => beneficiary) beneficiaries;
    address[] public bens;
    
    constructor() public{
        contractOwner = msg.sender;
        peerReviewNeeded = false;
    }
    
    function setAidAmount(uint ta, uint ba) public {
        require(msg.sender == contractOwner);
        totalAmount = ta;
        bonusAmount = ba;
    }
    
    function setBeneficiaries(address[] b) public{
        require(msg.sender == contractOwner);
        for (uint i = 0; i < b.length; i++) {
            beneficiaries[b[i]].authorized = true;
        }
        bens = b;
    }
    
    function getContractOwner() public constant returns(address owner){
        owner = contractOwner;
    }
    
    function getBeneficiaries() public constant returns(address[] b){
        b = bens;
    }
    
    function setSelfData(uint data) public{
        require(beneficiaries[msg.sender].authorized);
        beneficiaries[msg.sender].selfData = data;
    }
    
    function getSelfData() public constant returns(uint data){
        data  = beneficiaries[msg.sender].selfData;
    }
    
    function setDocumentHash(string h) public{
        require(beneficiaries[msg.sender].authorized);
        beneficiaries[msg.sender].documentHash = h;
    }
    
    function getDocumentHash() public constant returns(string hash){
        hash = beneficiaries[msg.sender].documentHash;
    }
}