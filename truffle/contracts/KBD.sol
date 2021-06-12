// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

//import "@openzeppelin/contracts/token/ERC777/ERC777.sol";

// contract KBDERC777 is ERC777 {
//     uint256 public test;

//     constructor() ERC777("Sakon", "WINERC777", new address[](0)) {
//         //_mint(msg.sender, 1000000 * (10 ** uint(decimals())), "","");
//         test = 1;
//     }
// }

contract KBD is ERC20 {
    address private admin;

    modifier onlyAdmin() {
        require(msg.sender == admin, "admin only");
        _;
    }

    constructor() ERC20("Sakon", "WIN") {
        _mint(msg.sender, 1000000 * (10**uint256(decimals())));
        admin = msg.sender;
    }

    function burn(address account, uint256 amount) public onlyAdmin {
        _burn(account, amount * (10**uint256(decimals())));
    }

    function mint(address account, uint256 amount) public onlyAdmin {
        _mint(account, amount * (10**uint256(decimals())));
    }
}
