// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol";

contract DeworkTasksBaseURI is ERC721Upgradeable, OwnableUpgradeable {
  string private baseURI;

  function __DeworkTasksBaseURI_init_unchained(string memory baseURI_) public initializer {
    baseURI = baseURI_;
  }

  function getBaseURI() public view returns (string memory) {
    return baseURI;
  }

  function setBaseURI(string memory baseURI_) public virtual onlyOwner {
    baseURI = baseURI_;
  }

  /**
    * @dev This empty reserved space is put in place to allow future versions to add new
    * variables without shifting down storage in the inheritance chain.
    * See https://docs.openzeppelin.com/contracts/4.x/upgradeable#storage_gaps
    */
  uint256[49] private __gap;
}