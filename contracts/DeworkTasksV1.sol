// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol";
import "./DeworkTasksBaseURI.sol";

contract DeworkTasksV1 is ERC721Upgradeable, OwnableUpgradeable, DeworkTasksBaseURI {

  function initialize(string memory baseURI_) public initializer {
    OwnableUpgradeable.__Ownable_init();
    ERC721Upgradeable.__ERC721_init("Dework", "Dework");
    DeworkTasksBaseURI.__DeworkTasksBaseURI_init_unchained(baseURI_);
  }

  function _baseURI() override internal view virtual returns (string memory) {
    return DeworkTasksBaseURI.getBaseURI();
  }

  function _beforeTokenTransfer(
    address from,
    address to,
    uint256 tokenId
  ) internal virtual override onlyOwner {
    super._beforeTokenTransfer(from, to, tokenId);
  }

  function mint(address to, uint256 tokenId) public virtual onlyOwner {
    super._mint(to, tokenId);
  }
}