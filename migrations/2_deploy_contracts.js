var SimpleStorage = artifacts.require("./SimpleStorage.sol");
var EduForAllCourse = artifacts.require("./EduForAllCourse.sol");

module.exports = async (deployer, network, [defaultAccount]) => {
  console.log('DEPLOYING TO ' + network);
    // hard coded for rinkeby
    if (network.startsWith('rinkeby')) {
      deployer.deploy(EduForAllCourse, "0x2ed0feb3e7fd2022120aa84fab1945545a9f2ffc9076fd6156fa96eaff4c1311")
      .then((data) =>{
        console.log('Deploy successful: ' + data)
      })
      // let eduForAll = await EduForAllCourse.deployed()
    } else {
      //local
      deployer.deploy(EduForAllCourse, "0x2ed0feb3e7fd2022120aa84fab1945545a9f2ffc9076fd6156fa96eaff4c1311")
    }
};
