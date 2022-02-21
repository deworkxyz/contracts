// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import '@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol';
import '@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol';
import "./Roles.sol";

contract MinterRoleUpgradeable is OwnableUpgradeable {
  using Roles for Roles.Role;

  event MinterAdded(address indexed account);
  event MinterRemoved(address indexed account);

  Roles.Role private minters;

  function __MinterRoleUpgradeable_init() internal onlyInitializing {
      __MinterRoleUpgradeable_init_unchained();
  }

  function __MinterRoleUpgradeable_init_unchained() internal onlyInitializing {
      _addMinter(msg.sender);
  }

  modifier onlyMinter() {
    require(isMinter(msg.sender), "MinterRoleUpgradeable: caller is not a minter");
    _;
  }

  function isMinter(address account) public view returns (bool) {
    return minters.has(account);
  }

  function addMinter(address account) public onlyOwner {
    _addMinter(account);
  }

  function removeMinter(address account) public onlyOwner {
    _removeMinter(account);
  }

  function renounceMinter() public {
    _removeMinter(msg.sender);
  }

  function _addMinter(address account) internal {
    minters.add(account);
    emit MinterAdded(account);
  }

  function _removeMinter(address account) internal {
    minters.remove(account);
    emit MinterRemoved(account);
  }

  /**
    * @dev This empty reserved space is put in place to allow future versions to add new
    * variables without shifting down storage in the inheritance chain.
    * See https://docs.openzeppelin.com/contracts/4.x/upgradeable#storage_gaps
    */
  uint256[50] private __gap;
}