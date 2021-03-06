pragma solidity >=0.4.22 <6.0.0;

import '@openzeppelin/contracts-ethereum-package/contracts/math/SafeMath.sol';
import '../interfaces/ICurveLogic.sol';
import './BancorFormula.sol';


/**
 * @title Bancor Curve Logic
 * @dev Curve that returns price per token according to bancor formula and specified reserve ratio
 */
contract BancorCurveLogic is ICurveLogic, BancorFormula {
    using SafeMath for uint256;

    /*
     * @dev reserve ratio, represented in ppm, 1-1000000
     * 1/3 corresponds to y= multiple * x^2
     * 1/2 corresponds to y= multiple * x
     * 2/3 corresponds to y= multiple * x^1/2
     * multiple will depends on contract initialization,
     * specificallytotalAmount and poolBalance parameters
     * we might want to add an 'initialize' function that will allow
     * the owner to send ether to the contract and mint a given amount of tokens
     */

    uint32 internal _reserveRatio;

    // uint256 internal _serviceParamsIndex;

    /// @dev                    Initialize contract
    /// @param reserveRatio     The number of curve tokens to mint
    constructor(uint32 reserveRatio) public {
        _reserveRatio = reserveRatio;
        // _serviceParamsIndex = _bancorService.addParams(reserveRatio);
    }

    /// @dev                    Get the price to mint tokens
    /// @param totalSupply      The existing number of curve tokens
    /// @param amount           The number of curve tokens to mint
    function calcMintPrice(
        uint256 totalSupply,
        uint256 reserveBalance,
        uint256 amount
    ) public view returns (uint256) {
        return
            calculatePurchaseReturn(
                totalSupply,
                reserveBalance,
                _reserveRatio,
                amount
            );
    }

    /// @dev                    Get the reward to burn tokens
    /// @param totalSupply      The existing number of curve tokens
    /// @param amount           The number of curve tokens to burn
    function calcBurnReward(
        uint256 totalSupply,
        uint256 reserveBalance,
        uint256 amount
    ) public view returns (uint256) {
        return
            calculateSaleReturn(
                totalSupply,
                reserveBalance,
                _reserveRatio,
                amount
            );
    }

    /// @notice Get reserve ratio
    function reserveRatio() public view returns (uint32) {
        return _reserveRatio;
    }
}
