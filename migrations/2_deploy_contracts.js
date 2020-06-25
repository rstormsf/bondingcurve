const BancorCurveLogic = artifacts.require("BancorCurveLogic");

module.exports = function (deployer) {
  deployer.deploy(BancorCurveLogic, 1000);
};
