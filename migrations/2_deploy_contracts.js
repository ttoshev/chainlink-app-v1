var SimpleStorage = artifacts.require("./SimpleStorage.sol");
var EduForAllCourse = artifacts.require("./EduForAllCourse.sol");

module.exports = function(deployer) {
  deployer.deploy(SimpleStorage, "Boss");

  // getWeb3()
  // .then((web3) => {
  deployer.deploy(EduForAllCourse, "0x2ed0feb3e7fd2022120aa84fab1945545a9f2ffc9076fd6156fa96eaff4c1311");
  // })
};
