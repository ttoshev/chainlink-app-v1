pragma solidity >=0.4.21 <0.7.0;

contract SimpleStorage {
  string storedData;
  address public main;

  constructor (string memory  x) public {
    main = msg.sender;
    storedData = x;
  }

  function set(string memory x) public {
    storedData = x;
  }

  function get() public view returns (string memory) {
    return storedData;
  }
}
