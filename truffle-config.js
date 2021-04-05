const path = require("path");
require('dotenv').config()

module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  contracts_build_directory: path.join(__dirname, "client/src/contracts"),
  networks: {
    develop: {
      port: 8545
    },
    kovan: {
      provider: function() {
        return new HDWalletProvider([process.env.PRIVATE_KEY], process.env.KOVAN_RPC_URL)
      },
      gas: 5000000,
      gasPrice: 25000000000,
      network_id: 42
    }
  },
  compilers: {
    solc: {
      version: "0.8.0",
    },
  },
  api_keys: {
    etherscan: ETHERSCAN_API_KEY
  },
  plugins: [
    'truffle-plugin-verify'
  ]
};
