pragma solidity ^0.5.12;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MockToken is ERC20 {

    string  public name = "test";     
    string  public symbol = "test";   
    uint8   public decimals = 18;

    function mint(address to, uint256 amount) public {
        _mint(to, amount);
    }
}
