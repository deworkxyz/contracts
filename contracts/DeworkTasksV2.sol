// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol";
import "./MinterRoleUpgradeable.sol";
import "./DeworkTasksBaseURI.sol";
import "./DeworkTasksVerified.sol";

contract DeworkTasksV2 is ERC721Upgradeable, OwnableUpgradeable, DeworkTasksBaseURI, DeworkTasksVerified, MinterRoleUpgradeable {

  function initialize(string memory baseURI_) public initializer {
    OwnableUpgradeable.__Ownable_init();
    MinterRoleUpgradeable.__MinterRoleUpgradeable_init();
    ERC721Upgradeable.__ERC721_init("Dework", "Dework");
    DeworkTasksBaseURI.__DeworkTasksBaseURI_init_unchained(baseURI_);
    DeworkTasksVerified.__DeworkTasksVerified_init_unchained();
  }

  function _baseURI() override internal view virtual returns (string memory) {
    return DeworkTasksBaseURI.getBaseURI();
  }

  function _beforeTokenTransfer(
    address from,
    address to,
    uint256 tokenId
  ) internal virtual override onlyMinter {
    super._beforeTokenTransfer(from, to, tokenId);
  }

  function mint(address to, uint256 tokenId, bool verified_) public virtual onlyMinter {
    super._mint(to, tokenId);
    _setVerified(tokenId, verified_);
  }
}