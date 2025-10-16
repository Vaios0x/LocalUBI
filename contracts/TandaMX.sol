// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/ReentrancyGuardUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/PausableUpgradeable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

/**
 * @title TandaMX - Digital ROSCAs for Mexico
 * @notice Cooperative savings pools (tandas) on Celo blockchain
 * @dev Uses GoodDollar (G$) as primary currency
 */
contract TandaMX is 
    Initializable,
    OwnableUpgradeable,
    ReentrancyGuardUpgradeable,
    PausableUpgradeable 
{
    IERC20 public gDollar;
    IERC20 public cUSD;
    
    uint256 public constant MIN_MEMBERS = 3;
    uint256 public constant MAX_MEMBERS = 20;
    uint256 public constant MIN_AMOUNT = 100 * 1e18; // 100 G$
    uint256 public constant PLATFORM_FEE_BPS = 50; // 0.5%
    uint256 public constant BPS_DENOMINATOR = 10000;
    
    struct Tanda {
        uint256 id;
        address creator;
        uint256 monthlyAmount;
        uint256 cycleFrequency; // seconds (e.g., 30 days)
        uint8 maxMembers;
        uint8 currentMembers;
        uint8 currentRound;
        uint256 startTime;
        uint256 lastRoundTime;
        bool isActive;
        bool isCompleted;
        address[] members;
        mapping(address => bool) isMember;
        mapping(address => bool) hasReceivedPayout;
        mapping(uint8 => mapping(address => bool)) roundPayments;
        mapping(uint8 => address) roundRecipient;
        mapping(uint8 => uint256) roundCompletedTime;
    }
    
    uint256 public tandaCounter;
    mapping(uint256 => Tanda) public tandas;
    mapping(address => uint256[]) public userTandas;
    
    uint256 public totalPlatformFees;
    
    event TandaCreated(
        uint256 indexed tandaId,
        address indexed creator,
        uint256 amount,
        uint8 maxMembers,
        uint256 frequency
    );
    
    event MemberJoined(uint256 indexed tandaId, address indexed member);
    event TandaStarted(uint256 indexed tandaId, uint256 startTime);
    event PaymentMade(
        uint256 indexed tandaId,
        uint8 indexed round,
        address indexed payer,
        uint256 amount
    );
    event RoundCompleted(
        uint256 indexed tandaId,
        uint8 indexed round,
        address indexed recipient,
        uint256 totalAmount
    );
    event TandaCompleted(uint256 indexed tandaId);
    event MemberRemoved(uint256 indexed tandaId, address indexed member);
    
    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }
    
    function initialize(
        address _gDollar,
        address _cUSD
    ) public initializer {
        __Ownable_init();
        __ReentrancyGuard_init();
        __Pausable_init();
        
        gDollar = IERC20(_gDollar);
        cUSD = IERC20(_cUSD);
    }
    
    /**
     * @notice Create a new tanda (ROSCA)
     * @param _monthlyAmount Amount each member pays per round (in G$)
     * @param _maxMembers Number of participants (3-20)
     * @param _cycleFrequency Time between rounds in seconds (e.g., 2592000 = 30 days)
     */
    function createTanda(
        uint256 _monthlyAmount,
        uint8 _maxMembers,
        uint256 _cycleFrequency
    ) external whenNotPaused returns (uint256) {
        require(_monthlyAmount >= MIN_AMOUNT, "Amount too low");
        require(_maxMembers >= MIN_MEMBERS && _maxMembers <= MAX_MEMBERS, "Invalid member count");
        require(_cycleFrequency >= 1 days, "Cycle too short");
        
        tandaCounter++;
        Tanda storage tanda = tandas[tandaCounter];
        
        tanda.id = tandaCounter;
        tanda.creator = msg.sender;
        tanda.monthlyAmount = _monthlyAmount;
        tanda.cycleFrequency = _cycleFrequency;
        tanda.maxMembers = _maxMembers;
        tanda.currentMembers = 1;
        tanda.currentRound = 0;
        tanda.isActive = false;
        tanda.isCompleted = false;
        
        // Creator auto-joins
        tanda.members.push(msg.sender);
        tanda.isMember[msg.sender] = true;
        userTandas[msg.sender].push(tandaCounter);
        
        emit TandaCreated(
            tandaCounter,
            msg.sender,
            _monthlyAmount,
            _maxMembers,
            _cycleFrequency
        );
        emit MemberJoined(tandaCounter, msg.sender);
        
        return tandaCounter;
    }
    
    /**
     * @notice Join an existing tanda
     * @param _tandaId ID of the tanda to join
     */
    function joinTanda(uint256 _tandaId) external whenNotPaused {
        Tanda storage tanda = tandas[_tandaId];
        
        require(tanda.id != 0, "Tanda does not exist");
        require(!tanda.isActive, "Tanda already started");
        require(!tanda.isMember[msg.sender], "Already a member");
        require(tanda.currentMembers < tanda.maxMembers, "Tanda is full");
        
        tanda.members.push(msg.sender);
        tanda.isMember[msg.sender] = true;
        tanda.currentMembers++;
        userTandas[msg.sender].push(_tandaId);
        
        emit MemberJoined(_tandaId, msg.sender);
        
        // Auto-start if full
        if (tanda.currentMembers == tanda.maxMembers) {
            _startTanda(_tandaId);
        }
    }
    
    /**
     * @notice Manually start tanda (creator only, if not full after deadline)
     * @param _tandaId ID of the tanda
     */
    function startTandaManually(uint256 _tandaId) external {
        Tanda storage tanda = tandas[_tandaId];
        
        require(msg.sender == tanda.creator, "Only creator can start");
        require(!tanda.isActive, "Already started");
        require(tanda.currentMembers >= MIN_MEMBERS, "Not enough members");
        
        _startTanda(_tandaId);
    }
    
    function _startTanda(uint256 _tandaId) internal {
        Tanda storage tanda = tandas[_tandaId];
        
        tanda.isActive = true;
        tanda.startTime = block.timestamp;
        tanda.lastRoundTime = block.timestamp;
        
        // Assign payout order (simplified random - use Chainlink VRF in production)
        _assignPayoutOrder(_tandaId);
        
        emit TandaStarted(_tandaId, block.timestamp);
    }
    
    function _assignPayoutOrder(uint256 _tandaId) internal {
        Tanda storage tanda = tandas[_tandaId];
        
        // Simple pseudo-random assignment (NOT SECURE - use Chainlink VRF in production)
        address[] memory shuffled = tanda.members;
        
        for (uint8 i = 0; i < shuffled.length; i++) {
            uint256 randomIndex = uint256(
                keccak256(abi.encodePacked(block.timestamp, block.prevrandao, i, _tandaId))
            ) % shuffled.length;
            
            // Swap
            address temp = shuffled[i];
            shuffled[i] = shuffled[randomIndex];
            shuffled[randomIndex] = temp;
            
            tanda.roundRecipient[i] = shuffled[i];
        }
    }
    
    /**
     * @notice Pay monthly contribution for current round
     * @param _tandaId ID of the tanda
     */
    function payRound(uint256 _tandaId) external nonReentrant whenNotPaused {
        Tanda storage tanda = tandas[_tandaId];
        
        require(tanda.isActive, "Tanda not active");
        require(tanda.isMember[msg.sender], "Not a member");
        require(!tanda.isCompleted, "Tanda completed");
        require(
            !tanda.roundPayments[tanda.currentRound][msg.sender],
            "Already paid this round"
        );
        
        // Transfer G$ from member
        require(
            gDollar.transferFrom(msg.sender, address(this), tanda.monthlyAmount),
            "Transfer failed"
        );
        
        tanda.roundPayments[tanda.currentRound][msg.sender] = true;
        
        emit PaymentMade(_tandaId, tanda.currentRound, msg.sender, tanda.monthlyAmount);
        
        // Check if round is complete
        if (_isRoundComplete(_tandaId)) {
            _completeRound(_tandaId);
        }
    }
    
    function _isRoundComplete(uint256 _tandaId) internal view returns (bool) {
        Tanda storage tanda = tandas[_tandaId];
        
        for (uint8 i = 0; i < tanda.members.length; i++) {
            if (!tanda.roundPayments[tanda.currentRound][tanda.members[i]]) {
                return false;
            }
        }
        return true;
    }
    
    function _completeRound(uint256 _tandaId) internal {
        Tanda storage tanda = tandas[_tandaId];
        
        address recipient = tanda.roundRecipient[tanda.currentRound];
        uint256 totalPot = tanda.monthlyAmount * tanda.currentMembers;
        
        // Calculate platform fee
        uint256 fee = (totalPot * PLATFORM_FEE_BPS) / BPS_DENOMINATOR;
        uint256 netPayout = totalPot - fee;
        
        totalPlatformFees += fee;
        
        // Transfer to round recipient
        require(gDollar.transfer(recipient, netPayout), "Payout failed");
        
        tanda.hasReceivedPayout[recipient] = true;
        tanda.roundCompletedTime[tanda.currentRound] = block.timestamp;
        
        emit RoundCompleted(_tandaId, tanda.currentRound, recipient, netPayout);
        
        // Move to next round
        tanda.currentRound++;
        tanda.lastRoundTime = block.timestamp;
        
        // Check if tanda is complete
        if (tanda.currentRound >= tanda.currentMembers) {
            tanda.isCompleted = true;
            tanda.isActive = false;
            emit TandaCompleted(_tandaId);
        }
    }
    
    /**
     * @notice Remove inactive member (only before tanda starts)
     * @param _tandaId ID of the tanda
     * @param _member Address to remove
     */
    function removeMember(uint256 _tandaId, address _member) external {
        Tanda storage tanda = tandas[_tandaId];
        
        require(msg.sender == tanda.creator, "Only creator");
        require(!tanda.isActive, "Cannot remove after start");
        require(tanda.isMember[_member], "Not a member");
        require(_member != tanda.creator, "Cannot remove creator");
        
        tanda.isMember[_member] = false;
        tanda.currentMembers--;
        
        // Remove from members array
        for (uint i = 0; i < tanda.members.length; i++) {
            if (tanda.members[i] == _member) {
                tanda.members[i] = tanda.members[tanda.members.length - 1];
                tanda.members.pop();
                break;
            }
        }
        
        emit MemberRemoved(_tandaId, _member);
    }
    
    // View functions
    
    function getTandaMembers(uint256 _tandaId) external view returns (address[] memory) {
        return tandas[_tandaId].members;
    }
    
    function getTandaDetails(uint256 _tandaId) external view returns (
        uint256 id,
        address creator,
        uint256 monthlyAmount,
        uint8 maxMembers,
        uint8 currentMembers,
        uint8 currentRound,
        bool isActive,
        bool isCompleted,
        uint256 startTime
    ) {
        Tanda storage tanda = tandas[_tandaId];
        return (
            tanda.id,
            tanda.creator,
            tanda.monthlyAmount,
            tanda.maxMembers,
            tanda.currentMembers,
            tanda.currentRound,
            tanda.isActive,
            tanda.isCompleted,
            tanda.startTime
        );
    }
    
    function hasUserPaidRound(
        uint256 _tandaId,
        uint8 _round,
        address _user
    ) external view returns (bool) {
        return tandas[_tandaId].roundPayments[_round][_user];
    }
    
    function getRoundRecipient(uint256 _tandaId, uint8 _round) 
        external 
        view 
        returns (address) 
    {
        return tandas[_tandaId].roundRecipient[_round];
    }
    
    function getUserTandas(address _user) external view returns (uint256[] memory) {
        return userTandas[_user];
    }
    
    // Admin functions
    
    function withdrawPlatformFees(address _to) external onlyOwner {
        uint256 amount = totalPlatformFees;
        totalPlatformFees = 0;
        require(gDollar.transfer(_to, amount), "Withdrawal failed");
    }
    
    function pause() external onlyOwner {
        _pause();
    }
    
    function unpause() external onlyOwner {
        _unpause();
    }
}
