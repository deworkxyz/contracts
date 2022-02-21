// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol";

contract DeworkTasksVerified is ERC721Upgradeable, OwnableUpgradeable {
  mapping(uint256 => bool) private _verified;

  function __DeworkTasksVerified_init_unchained() public initializer {
    
  }

  function verified(uint256 tokenId) public view returns (bool) {
    return _verified[tokenId];
  }

  function setVerified(uint256 tokenId, bool verified_) public virtual onlyOwner {
    _setVerified(tokenId, verified_);
  }

  function _setVerified(uint256 tokenId, bool verified_) internal virtual {
    _verified[tokenId] = verified_;
  }

  /**
    * @dev This empty reserved space is put in place to allow future versions to add new
    * variables without shifting down storage in the inheritance chain.
    * See https://docs.openzeppelin.com/contracts/4.x/upgradeable#storage_gaps
    */
  uint256[49] private __gap;
}